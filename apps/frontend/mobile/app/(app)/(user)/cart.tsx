import React, { useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";

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
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  const handleIncrease = (id: string) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const handleDecrease = (id: string) => {
    setCart(cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const handleRemove = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => {
          handleRemove(id);
          const ref = swipeableRefs.current.get(id);
          if (ref) {
            ref.close();
          }
        }}
      >
        <Ionicons name="trash" size={24} color="#FFF" />
      </TouchableOpacity>
    );
  };

  const closeOtherSwipeables = (id: string) => {
    swipeableRefs.current.forEach((ref, key) => {
      if (key !== id && ref) {
        ref.close();
      }
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable
      ref={ref => {
        if (ref && !swipeableRefs.current.has(item.id)) {
          swipeableRefs.current.set(item.id, ref);
        }
      }}
      renderRightActions={() => renderRightActions(item.id)}
      onSwipeableOpen={() => closeOtherSwipeables(item.id)}
      overshootRight={false}
    >
      <View style={styles.cartItem}>
        <View style={styles.itemRow}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price.toFixed(2)} Kč</Text>
          </View>
        </View>
        
        <View style={styles.quantityRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={[styles.quantityButton, item.quantity <= 1 ? styles.quantityButtonDisabled : {}]} 
              onPress={() => handleDecrease(item.id)}
              disabled={item.quantity <= 1}
            >
              <Ionicons name="remove" size={20} color={item.quantity <= 1 ? "#AAA" : "#FFF"} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => handleIncrease(item.id)}>
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.itemTotalPrice}>{(item.price * item.quantity).toFixed(2)} Kč</Text>
        </View>
      </View>
    </Swipeable>
  );

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#FBFBFB"}}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>Kebab House Zlín</Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.deleteInfo}>
          <Ionicons name="information-circle-outline" size={18} color="#666" />
          <Text style={styles.deleteText}>Pro smazání přejeďte položku vlevo</Text>
        </View>

        {cart.length > 0 ? (
          <FlatList 
            data={cart} 
            keyExtractor={(item) => item.id} 
            renderItem={renderItem} 
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={80} color="#DDD" />
            <Text style={styles.emptyCartText}>Váš košík je prázdný</Text>
          </View>
        )}

        <View style={styles.summaryContainer}>
          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Položky</Text>
              <Text style={styles.summaryValue}>{totalItems} ks</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Celkem</Text>
              <Text style={styles.summaryTotal}>{totalPrice.toFixed(2)} Kč</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.checkoutButton, cart.length === 0 && styles.disabledButton]} 
            onPress={() => router.push('/(app)/(shared)/delivery')}
            disabled={cart.length === 0}
          >
            <Text style={styles.checkoutButtonText}>Pokračovat k platbě</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 20,
  },
  restaurantHeader: {
    alignItems: "center",
    paddingTop: 25,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  separator: {
    width: "35%",
    height: 2,
    backgroundColor: "#FF5500",
    marginTop: 8,
    borderRadius: 1,
  },
  deleteInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: "#F0F0F0",
    alignSelf: "center",
    paddingVertical: 8,
    borderRadius: 20,
  },
  deleteText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: "#666",
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  quantityButton: {
    backgroundColor: "#404040",
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    backgroundColor: "#555",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginHorizontal: 10,
    width: 25,
    textAlign: "center",
  },
  itemTotalPrice: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FF5500",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 16,
    marginVertical: 12,
    marginRight: 20,
  },
  summaryContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryDetails: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  summaryTotal: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    backgroundColor: "#FF5500",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50
  },
  checkoutButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyCartText: {
    marginTop: 16,
    fontSize: 18,
    color: "#999",
    fontWeight: "500",
  },
});