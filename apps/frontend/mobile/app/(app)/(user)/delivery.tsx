import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useShoppingCart } from '@/context/CartShoppingContext';
import { useAuth } from '@/context/AuthContext';
import AddressSelect from '@/components/AddressSelect';
import { BACKEND_URL } from '@/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultAddress = { city: "Zlín", zipCode: "760 01", street: "náměstí Míru 12", country: "Czechia" };

interface OrderDTO {
  restaurantId: string;
  address: {
    city: string;
    zipCode: string;
    street: string;
    country: string;
  };
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
}

export default function DeliveryScreen() {
  const [deliveryMethod, setDeliveryMethod] = useState("door");
  const { cartItems, clearCart } = useShoppingCart();
  const { user, address, accessToken } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState(address || defaultAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddressChange = (newAddress: any) => {
    if (newAddress.city !== (address?.city || defaultAddress.city)) {
      Alert.alert(
        "Nesprávné město",
        "Dodací adresa musí být ve stejném městě jako vaše registrační adresa.",
        [{ text: "OK" }]
      );
      return;
    }
    setDeliveryAddress(newAddress);
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const restaurantId = cartItems[0]?.restaurantId || "";
      
      const orderDto: OrderDTO = {
        address: deliveryAddress,
        restaurantId,
        items: cartItems.map((item: any) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      const response = await fetch(`${BACKEND_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(orderDto)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const order = await response.json();
      
      // Uložíme ID objednávky do historie
      const orderHistoryStr = await AsyncStorage.getItem('orderHistory');
      const orderHistory = orderHistoryStr ? JSON.parse(orderHistoryStr) : [];
      orderHistory.push(order.id);
      await AsyncStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      
      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Nepodařilo se vytvořit objednávku. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasValidAddress = deliveryAddress && cartItems.length > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Shrnutí objednávky</Text>
        <Text style={styles.title}>Doručení</Text>
        
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Detaily</Text>
            <AddressSelect onAddressChange={handleAddressChange} />
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.name}>{user?.firstName || 'Uživatel'} {user?.lastName || ''}</Text>
            <View style={styles.separator} />
            <Text style={styles.address}>
              {deliveryAddress.street}{"\n"}
              {deliveryAddress.zipCode} {deliveryAddress.city}{"\n"}
              {deliveryAddress.country}
            </Text>
            <View style={styles.separator} />
            <Text style={styles.phone}>{user?.email || 'Není zadán'}</Text>
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

        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Objednávka</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} Kč</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.rowBetween}>
          <Text style={styles.totalText}>Celkem k zaplacení</Text>
          <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} Kč</Text>
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.payButton, (!hasValidAddress || isLoading) && styles.disabledButton]} 
        onPress={handleCheckout}
        disabled={!hasValidAddress || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.payButtonText}>ZAPLATIT</Text>
        )}
      </TouchableOpacity>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingBottom: 150,
  },
  scrollView: {
    flex: 1,
    padding: 20,
    paddingBottom: 160,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#EBEBEB',
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  header: {
    fontSize: 16,
    marginTop: 40,
    color: "#000000",
    marginLeft: 230,
    fontWeight: "400",
    fontFamily: "Montserrat", 
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 45,
    letterSpacing: 0.4,
    fontFamily: "Montserrat", 
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
    fontFamily: "Montserrat", 
    letterSpacing: 0.4,
  },
  addressBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    fontFamily: "Montserrat", 
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat", 
    letterSpacing: 0.4,
  },
  address: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Montserrat", 
    marginVertical: 5,
    paddingTop: 5,
    letterSpacing: 0.3,
  },
  phone: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Montserrat", 
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
    fontFamily: "Montserrat", 
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
    fontFamily: "Montserrat", 
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Montserrat", 
    marginTop: 10,
    marginRight: 15,
  },
  payButton: {
    backgroundColor: "#FF5500",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "light",
    fontFamily: "Montserrat", 
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
  orderSummary: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
    marginVertical: 15,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  itemName: {
    fontSize: 16,
    fontFamily: "Montserrat", 
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat", 
    color: "#FF5500",
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontFamily: "Montserrat", 
    marginBottom: 10,
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
  },
});