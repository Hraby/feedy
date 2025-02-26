import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DeliveryScreen() {
  const [deliveryMethod, setDeliveryMethod] = useState("door");

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.header}>Shrnutí objednávky</Text>
      <Text style={styles.title}>Doručení</Text>
      
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Detaily</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>změnit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addressBox}>
          <Text style={styles.name}>John Pork</Text>
                  <View style={styles.separator} />
          <Text style={styles.address}>Dřevnická 1788, Zlín{"\n"}Česká republika</Text>
                  <View style={styles.separator} />
          <Text style={styles.phone}>+420 123 456 789</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Způsob doručení</Text>
        <TouchableOpacity style={styles.option} onPress={() => setDeliveryMethod("door")}>
          <Ionicons 
            name={deliveryMethod === "door" ? "radio-button-on" : "radio-button-off"} 
            size={20} color="#FF5500" 
          />
          <Text style={styles.optionText}>Doručení až ke dveřím</Text>
        </TouchableOpacity>
                <View style={styles.separator2} />
        <TouchableOpacity style={styles.option} onPress={() => setDeliveryMethod("pickup")}>
          <Ionicons 
            name={deliveryMethod === "pickup" ? "radio-button-on" : "radio-button-off"} 
            size={20} color="#FF5500" 
          />
          <Text style={styles.optionText}>Osobní vyzvednutí</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.rowBetween}>
        <Text style={styles.totalText}>Celkem k zaplacení</Text>
        <Text style={styles.totalPrice}>579,00 Kč</Text>
      </View>
      
      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>ZAPLATIT</Text>
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
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#EBEBEB',
    padding: 8,
    borderRadius: 20,
  },
  header: {
    fontSize: 16,
    marginTop: 40,
    color: "#000000",
    marginLeft: 240,
    fontWeight: "400",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 45,
    letterSpacing: 0.4,
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 0.4,
  },
  changeText: {
    color: "#FF5500",
    fontSize: 14,
    marginRight: 10,
  },
  addressBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.4,
  },
  address: {
    fontSize: 16,
    color: "#OOO",
    marginVertical: 5,
    paddingTop: 5,
    letterSpacing: 0.3,
  },
  phone: {
    fontSize: 16,
    color: "#OOO",
    paddingTop: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginLeft: 10,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "400",
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
    marginRight: 15,
  },
  payButton: {
    backgroundColor: "#FF5500",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "light",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#868686",
    marginTop: 5,
    opacity: 0.3,
  },
  separator2: {
    width: "90%",
    height: 1,
    backgroundColor: "#868686",
    marginTop: 5,
    marginLeft: 10,
    opacity: 0.3,
  },
});