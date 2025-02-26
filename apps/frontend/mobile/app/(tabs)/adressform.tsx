import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

const { height } = Dimensions.get("window");

const AddressForm = () => {
  const [selectedLabel, setSelectedLabel] = useState("Domov");
  const [location, setLocation] = useState(null);
  const [mapUri, setMapUri] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      const destination = "D%C5%99evnick%C3%A1%201788%2C%20Zl%C3%ADn";
      const newMapUri = `https://mapy.cz/zakladni?plan=trasa&rc=${longitude}%2C${latitude}~D%C5%99evnick%C3%A1%201788%2C%20Zl%C3%ADn&rp=pos&mrp=%7B%22c%22%3A111%7D`;
      setMapUri(newMapUri);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <WebView source={{ uri: mapUri }} style={styles.map} />
      </View>

      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.label}>MĚSTO*</Text>
        <TextInput style={styles.input} placeholder="Zadejte Město" />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>ULICE*</Text>
            <TextInput style={styles.input} placeholder="Zadejte Ulici" />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>PSČ*</Text>
            <TextInput style={styles.input} placeholder="123 45" keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.label}>ČÍSLO DOMU/BYTU</Text>
        <TextInput style={styles.input} placeholder="123" />

        <Text style={styles.label}>OZNAČIT JAKO</Text>
        <View style={styles.buttonContainer}>
          {["Domov", "Práce", "Jiné"].map((label) => (
            <TouchableOpacity
              key={label}
              style={[styles.button, selectedLabel === label && styles.buttonSelected]}
              onPress={() => setSelectedLabel(label)}
            >
              <Text style={[styles.buttonText, selectedLabel === label && styles.buttonTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#EBEBEB",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSelected: {
    backgroundColor: "#FF5500",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  buttonTextSelected: {
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
  saveButton: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: "#FF5500",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "light",
    color: "#FFF",
  },
});

export default AddressForm;
