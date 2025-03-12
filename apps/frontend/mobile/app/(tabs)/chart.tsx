import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { router } from 'expo-router';

const { width } = Dimensions.get("window");

const initialCart = [
  { id: "1", name: "Kebab klasický", price: 305, quantity: 1, image: require("@/assets/images/kebab.png") },
  { id: "2", name: "Burger hovězí", price: 259, quantity: 1, image: require("@/assets/images/kebab.png") },
  { id: "3", name: "Burger hovězí", price: 259, quantity: 1, image: require("@/assets/images/kebab.png") },
  { id: "4", name: "Burger hovězí", price: 259, quantity: 1, image: require("@/assets/images/kebab.png") },
  { id: "5", name: "Burger hovězí", price: 259, quantity: 1, image: require("@/assets/images/kebab.png") },
  { id: "6", name: "Burger hovězí", price: 259, quantity: 1, image: require("@/assets/images/kebab.png") },
];

export default function CartScreen() {
  const [cart, setCart] = useState(initialCart);

  const handleIncrease = (id) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const handleDecrease = (id) => {
    setCart(cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemove(id)}>
      <Ionicons name="trash" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.cartItem}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.price.toFixed(2)} Kč</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecrease(item.id)}>
            <Ionicons name="remove" size={18} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => handleIncrease(item.id)}>
            <Ionicons name="add" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>

      <View style={styles.restaurantHeader}>
        <Text style={styles.restaurantName}>Kebab House Zlín</Text>
        <View style={styles.separator} />
      </View>

      <View style={styles.deleteInfo}>
        <Image source={require("@/assets/images/swipe-remove.png")} style={styles.deleteImage} />
        <Text style={styles.deleteText}>Pro smazání produktu přejeďte vlevo</Text>
      </View>

      <FlatList 
        data={cart} 
        keyExtractor={(item) => item.id} 
        renderItem={renderItem} 
        contentContainerStyle={{ paddingTop: 20 }}
      />

      <TouchableOpacity style={styles.orderButton}
      onPress={() => router.push('/delivery')}
      >
        <Text style={styles.orderText}
        >POKRAČOVAT NA PLATBU - {totalPrice.toFixed(2)} Kč</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  restaurantHeader: {
    alignItems: "center",
    marginTop: 100,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "light",
  },
  separator: {
    width: "90%",
    height: 1,
    backgroundColor: "black",
    marginTop: 5,
    opacity: 0.3,
  },
  deleteInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: "light",
    marginRight: 10,
  },
  deleteImage: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 15,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "#F56A00",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: "#FF5500",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 15,
    marginVertical: 8,
    marginRight: 20,
  },
  orderButton: {
    backgroundColor: "#FF5500",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    margin: 20,
    justifyContent: "space-between",
    marginBottom: 95,
  },
  orderText: {
    color: "#FFF",
    fontWeight: "light",
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#EBEBEB',
    padding: 8,
    borderRadius: 20,
  },
});

