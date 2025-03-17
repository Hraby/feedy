import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location";
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get("window");

const defaultAddress = { city: "Zlín", zipCode: "760 01", street: "náměstí Míru 12", country: "Czechia" };

const AddressForm = () => {
  const { address, refresh } = useAuth();
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(address?.city || defaultAddress.city);
  const [street, setStreet] = useState(address?.street || defaultAddress.street);
  const [postalCode, setPostalCode] = useState(address?.zipCode || defaultAddress.zipCode);

  useEffect(() => {
    if (address) {
      setCity(address.city);
      setStreet(address.street);
      setPostalCode(address.zipCode);
    }
  }, [address]);

  const getCoordinates = async (address) => {
    try {
      const geocode = await Location.geocodeAsync(address);
      if (geocode.length > 0) {
        const { latitude, longitude } = geocode[0];
        setLocation({ latitude, longitude });
      } else {
        console.log("Adresa nebyla nalezena");
      }
    } catch (error) {
      console.log("Chyba při geokódování:", error);
    }
  };

  const handleSaveAddress = async () => {
    if (!city || !street || !postalCode) {
      Alert.alert("Chyba", "Vyplňte prosím všechna pole");
      return;
    }

    const newAddress = {
      street,
      city,
      zipCode: postalCode,
      country: "Czechia"
    };

    try {
      await AsyncStorage.setItem('deliveryAddress', JSON.stringify(newAddress));
      await refresh(); // Refresh auth context to update the address
      router.push('/adress');
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert("Chyba", "Nepodařilo se uložit adresu");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={location ? {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          } : undefined}
        >
          {location && (
            <Marker
              coordinate={location}
              title="Zadaná adresa"
            />
          )}
        </MapView>
      </View>

      <TouchableOpacity style={styles.backButton}
        onPress={() => router.push('/adress')}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.label}>MĚSTO*</Text>
        <TextInput
          style={styles.input}
          placeholder="Zadejte Město"
          value={city}
          onChangeText={setCity}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>ULICE*</Text>
            <TextInput
              style={styles.input}
              placeholder="Zadejte Ulici"
              value={street}
              onChangeText={setStreet}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>PSČ*</Text>
            <TextInput
              style={styles.input}
              placeholder="123 45"
              keyboardType="numeric"
              value={postalCode}
              onChangeText={setPostalCode}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
        <Text style={styles.saveButtonText}>ULOŽIT ADRESU</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  mapContainer: {
    height: height * 0.45,
  },
  map: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#EBEBEB",
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  saveButton: {
    position: "absolute",
    bottom: 95,
    left: 20,
    right: 20,
    backgroundColor: "#FF5500",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFF",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
});

export default AddressForm;
