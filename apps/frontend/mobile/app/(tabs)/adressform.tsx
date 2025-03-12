import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location";
import { router } from 'expo-router';

const { height } = Dimensions.get("window");

const AddressForm = () => {
  const [selectedLabel, setSelectedLabel] = useState("Domov");
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");

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

  const handleSaveAddress = () => {
    const address = `${street}, ${city}, ${postalCode}`;
    getCoordinates(address);
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
