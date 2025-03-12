import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from 'react-native-maps';

const OrderScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Dovoz</Text>
      </View>
      <View style={styles.mapContainer}>
      <MapView style={styles.map}>
      </MapView>
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryTimeLabel}>Odhadovaný čas</Text>
        <View style={styles.deliveryTimeWrapper}>
          <Ionicons name="time-outline" size={16} color="#FF5500" />
          <Text style={styles.deliveryTime}>10 minut</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.sectionHeader}>Objednávka</Text>
      <View style={styles.orderItem}>
        <Text style={styles.itemName}>Caramel Macchiato</Text>
        <Text style={styles.itemInfo}><Text style={styles.itemQuantity}>1 x</Text> <Text style={styles.itemPrice}>90 Kč</Text></Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.itemName}>Greentea Latte</Text>
        <Text style={styles.itemInfo}><Text style={styles.itemQuantity}>1 x</Text> <Text style={styles.itemPrice}>100 Kč</Text></Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.itemName}>Egg Mayo Breakfast Sandwich</Text>
        <Text style={styles.itemInfo}><Text style={styles.itemQuantity}>2 x</Text> <Text style={styles.itemPrice}>220 Kč</Text></Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Celkem</Text>
        <Text style={styles.totalPrice}>410 Kč</Text>
      </View>
      <TouchableOpacity style={styles.deliveryButton}>
        <Text style={styles.deliveryButtonText}>DORUČENO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20
  },
  header: {
    textAlign: "right",
    flex: 1,
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
  },
  backButton: {
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 20,
    marginRight: 10
  },
  map: {
    flex: 1,
  },
  mapContainer: {
    height: 400,
    overflow: "hidden"
  },
  fullWidthMap: {
    width: "100%",
    height: "100%"
  },
  deliveryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10
  },
  deliveryTimeLabel: {
    fontWeight: "bold",
    fontSize: 16
  },
  deliveryTimeWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  deliveryTime: {
    marginLeft: 5,
    color: "#E85527",
    fontSize: 16
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: 10,
    marginHorizontal: 20
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 5
  },
  itemName: {
    fontSize: 16,
    color: "#333"
  },
  itemInfo: {
    fontSize: 16,
    color: "#333"
  },
  itemQuantity: {
    fontWeight: "300"
  },
  itemPrice: {
    fontWeight: "bold"
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 10
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333"
  },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333"
  },
  deliveryButton: {
    backgroundColor: "#FF5500",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50
  },
  deliveryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default OrderScreen;
