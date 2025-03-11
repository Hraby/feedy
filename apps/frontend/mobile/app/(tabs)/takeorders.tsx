import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const orders = [
  { id: 1, name: "Pizza Hut", price: "350 Kč", items: "03 Items", distance: "Do 5 km" },
  { id: 2, name: "Pizza Hut", price: "350 Kč", items: "03 Items", distance: "Do 15 km" },
  { id: 3, name: "Pizza Hut", price: "350 Kč", items: "03 Items", distance: "Do 25 km" }
];

const OrderScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Příjem objednávek</Text>
      </View>
      {orders.map((order) => (
        <View key={order.id} style={styles.orderSection}>
          <Text style={styles.distance}>{order.distance}</Text>
          <View style={styles.orderContainer}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.orderDetails}>
              <Text style={styles.orderName}>{order.name}</Text>
              <View style={styles.priceItemsContainer}>
                <Text style={styles.price}>{order.price}</Text>
                <Text style={styles.items}> | {order.items}</Text>
              </View>
            </View>
            <Text style={styles.orderId}>#162432</Text>
          </View>
          <View style={styles.buttonsBackground}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.acceptButton}><Text style={styles.acceptText}>Přijmout</Text></TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
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
    marginRight: 10,
  },
  orderSection: {
    marginBottom: 20,
  },
  distance: {
    fontSize: 16,
    fontWeight: "light",
    marginLeft: 30,
    marginBottom: 5,
    marginTop: 15,
    color: "#333",
  },
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFF",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#A0A9B0",
    borderRadius: 10,
    marginRight: 10,
  },
  orderDetails: {
    flex: 1,
  },
  orderName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  priceItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  items: {
    fontSize: 14,
    color: "#888",
  },
  buttonsBackground: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  acceptButton: {
    backgroundColor: "#FF5500",
    paddingVertical: 8,
    paddingHorizontal: 45,
    borderRadius: 8,
  },
  acceptText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  cancelButton: {
    borderColor: "#FF5500",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 45,
    borderRadius: 8,
  },
  cancelText: {
    color: "#FF5500",
    fontWeight: "bold",
  },
  orderId: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "#555",
    textDecorationLine: "underline",
  },
});

export default OrderScreen;
