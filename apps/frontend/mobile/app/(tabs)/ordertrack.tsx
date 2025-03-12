import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from 'react-native-maps';

const { height } = Dimensions.get("window");

const TrackOrder = () => {

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Sledovat objednávku</Text>

      <View style={styles.mapWrapper}>
        <View style={styles.mapContainer}>
        <MapView style={styles.map}>
        </MapView>
        </View>
      </View>

      <View style={styles.estimatedTimeContainer}>
        <Text style={styles.estimatedTime}>20 min</Text>
        <Text style={styles.subText}>ODHADOVANÝ ČAS DORUČENÍ</Text>
      </View>

      <View style={styles.statusContainer}>
        {statusSteps.map((step, index) => (
          <View key={index} style={styles.statusItem}>
            <Text style={[styles.statusText, step.completed && styles.activeText]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const statusSteps = [
  { label: "📥  Objednávka byla přijata", completed: true },
  { label: "👨‍🍳  Restaurace připravuje objednávku", completed: false },
  { label: "📦  Objednávka čeká na vyzvednutí", completed: false },
  { label: "🚗  Objednávka je na cestě", completed: false },
  { label: "🏁  Objednávka doručena!", completed: false },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  /*
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#181C2E',
    padding: 8,
    borderRadius: 30,
    zIndex: 2,
  },
  */
  header: {
    textAlign: "right",
    flex: 1,
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
    marginTop: 65,
    marginRight: 20,
  },
  mapWrapper: {
    marginTop: 20,
  },
  mapContainer: {
    height: height * 0.53,
  },
  map: {
    flex: 1,
  },
  estimatedTimeContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  estimatedTime: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
    color: "#999",
  },
  statusContainer: {
    paddingHorizontal: 60,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: "#999",
  },
  activeText: {
    color: "#FF5500",
    fontWeight: "bold",
  },
});

export default TrackOrder;