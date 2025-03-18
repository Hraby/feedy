import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import AddressSelect from '@/components/AddressSelect';

const defaultAddress = { city: "Zlín", zipCode: "760 01", street: "náměstí Míru 12", country: "Czechia" };

export default function AddressScreen() {
  const { address } = useAuth();
  const currentAddress = address || defaultAddress;

  const addresses = [
    {
      id: "1",
      type: "DOMOV",
      address: `${currentAddress.street}, ${currentAddress.zipCode}, ${currentAddress.city}\n${currentAddress.country}`,
      icon: "home-outline",
    }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}
        onPress={() => router.push('/usermenu')}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.header}>Moje adresa</Text>
      
      <AddressSelect onAddressChange={() => {}} />
      
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.addressItem}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon as any} size={24} color="#FF5500" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.addressType}>{item.type}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/adressform')}
            >
              <Ionicons name="create-outline" size={20} color="#FF5500" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={20} color="#FF5500" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/adressform')}
      >
        <Text style={styles.addButtonText}>PŘIDAT NOVOU ADRESU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 20,
  },
  header: {
    fontSize: 16,
    marginTop: 40,
    color: "#000000",
    marginLeft: 290,
    fontWeight: "400",
    marginBottom: 30,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBEBEB",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  addressType: {
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 5,
  },
  addressText: {
    color: "#777",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#FF5500",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 75,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "light",
  },
});
