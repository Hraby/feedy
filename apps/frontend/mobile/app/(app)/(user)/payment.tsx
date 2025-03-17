import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

const PaymentSuccessScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark" size={80} color="white" />
      </View>

      <Text style={styles.title}>Platba byla úspěšná</Text>
      <Text style={styles.subtitle}>Na objednávce se pracuje!</Text>

      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/(app)/(user)/ordertrack')}>
        <Text style={styles.buttonText}>SLEDOVAT OBJEDNÁVKU</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#FF5500",
    borderRadius: 100,
    width: 125,
    height: 125,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 40,
  },
  button: {
    position: "absolute",
    bottom: 95,
    left: 20,
    right: 20,
    backgroundColor: "#FF5500",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "light",
    color: "#FFF",
  },
});

export default PaymentSuccessScreen;
