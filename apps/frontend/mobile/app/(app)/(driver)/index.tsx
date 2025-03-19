import React, {useEffect, useState} from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator} from "react-native";
import {router} from 'expo-router';
import {useAuth} from '@/context/AuthContext';
import {useDriver} from '@/context/DriverContext';
import {BACKEND_URL} from '@/lib/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  menuItemId: string;
  menuItem: {name: string}
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  restaurantId: string;
  restaurant: Restaurant;
  orderItems: OrderItem[];
}

const TakeOrderScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(!1);
  const [error, setError] = useState<string|null>(null);
  const [canceledOrderIds, setCanceledOrderIds] = useState<string[]>([]);
  
  const {accessToken} = useAuth();
  const {setActiveOrderId} = useDriver();

  useEffect(() => {
    const loadCanceledOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem("canceledOrders");
        if (savedOrders) {
          setCanceledOrderIds(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    
    loadCanceledOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, [canceledOrderIds]);

  const fetchOrders = async () => {
    try {
      setIsLoading(!0);
      setError(null);
      const response = await fetch(`${BACKEND_URL}/order?status=Ready`, {
        headers: {'Authorization': `Bearer ${accessToken}`}
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const data = await response.json();
      const filteredData = data.filter((order: Order) => !canceledOrderIds.includes(order.id));
      setOrders(filteredData);
    } catch (error) {
      console.log("Error", error);
      setError("Nepodařilo se načíst objednávky. Zkuste to prosím znovu.");
    } finally {
      setIsLoading(!1);
    }
  };

  const calculateTotalPrice = (orderItems: OrderItem[]|undefined) => {
    if (!orderItems) return 0;
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/order/${orderId}/claim`, {
        method: 'PATCH',
        headers: {'Authorization': `Bearer ${accessToken}`}
      });
      
      if (!response.ok) {
        throw new Error("Failed to claim order");
      }
      
      setActiveOrderId(orderId);
      router.push("/(app)/(driver)/driverdelivery");
    } catch (error) {
      console.log("Error", error);
      setError("Nepodařilo se přijmout objednávku. Zkuste to prosím znovu.");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const updatedCanceledOrders = [...canceledOrderIds, orderId];
    setCanceledOrderIds(updatedCanceledOrders);
    try {
      await AsyncStorage.setItem("canceledOrders", JSON.stringify(updatedCanceledOrders));
    } catch (error) {
      console.log("Error", error);
    }
    setOrders(orders.filter(order => order.id !== orderId));
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Zkusit znovu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Příjem objednávek</Text>
      </View>
      
      {orders.map((order) => (
        <View key={order.id} style={styles.orderSection}>
          <Text style={styles.distance}>Do 5 km</Text>
          <View style={styles.orderContainer}>
            <View style={styles.imagePlaceholder}>
              <Image 
                source={{uri: order.restaurant?.imageUrl}} 
                style={styles.restaurantImage} 
                resizeMode="cover"
                defaultSource={require('@/assets/images/placeholder.png')}
              />
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderName}>{order.restaurant?.name || 'Neznámá restaurace'}</Text>
              <View style={styles.priceItemsContainer}>
                <Text style={styles.price}>{calculateTotalPrice(order.orderItems).toFixed(2)} Kč</Text>
                <Text style={styles.items}>| {order.orderItems?.length || 0} položek</Text>
              </View>
            </View>
            <Text style={styles.orderId}>#{order.id.slice(-6)}</Text>
          </View>
          <View style={styles.buttonsBackground}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptOrder(order.id)}>
                <Text style={styles.acceptText}>Přijmout</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(order.id)}>
                <Text style={styles.cancelText}>Zrušit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      
      {orders.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Žádné dostupné objednávky</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    fontFamily: "Montserrat", 
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF5500',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: "Montserrat", 
    fontWeight: 'bold',
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
    fontFamily: "Montserrat", 
    color: "#000000",
    fontWeight: "400",
    marginTop: 10,
  },
  orderSection: {
    marginBottom: 20,
  },
  distance: {
    fontSize: 16,
    fontFamily: "Montserrat", 
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
    backgroundColor: "",
    borderRadius: 1,
    marginRight: 10,
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  orderDetails: {
    flex: 1,
  },
  orderName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat", 
  },
  priceItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat", 
    color: "#333",
  },
  items: {
    fontSize: 14,
    fontFamily: "Montserrat", 
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
    fontFamily: "Montserrat", 
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
    fontFamily: "Montserrat", 
  },
  orderId: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "#555",
    textDecorationLine: "underline",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: "Montserrat", 
    textAlign: 'center',
  },
});

export default TakeOrderScreen;