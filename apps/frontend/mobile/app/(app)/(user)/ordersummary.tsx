import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_URL } from '@/lib/constants';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl: string;
  category: string;
  restaurantId: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItem;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  phone: string;
  ownerId: string;
  status: string;
  category: string[];
  imageUrl: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string[];
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  restaurantId: string;
  courierProfileId: string | null;
  userId: string;
  user: User;
  restaurant: Restaurant;
  CourierProfile: any | null;
  orderItems: OrderItem[];
}

const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orderIdsStr = await AsyncStorage.getItem('orderHistory');
      if (!orderIdsStr) {
        setOrders([]);
        return;
      }

      const orderIds = JSON.parse(orderIdsStr);
      
      const ordersPromises = orderIds.map(async (id: string) => {
        try {
          const response = await fetch(`${BACKEND_URL}/order/${id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (!response.ok) {
            console.warn(`Failed to fetch order ${id}: ${response.status}`);
            return null;
          }
          
          return await response.json();
        } catch (error) {
          console.warn(`Error fetching order ${id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(ordersPromises);
      const validOrders = results.filter((order): order is Order => order !== null);
      validOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(validOrders);
    } catch (error) {
      console.log("Error loading orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [accessToken])
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#666666';
    }
  };

  const calculateTotalPrice = (orderItems: OrderItem[]) => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderItem}>
      <View>
        <Text style={styles.place}>{item.restaurant.name}</Text>
        <Text style={styles.details}>
          {item.orderItems.map(orderItem => 
            `${orderItem.quantity}x ${orderItem.menuItem.name}`
          ).join(', ')}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.price}>{calculateTotalPrice(item.orderItems).toFixed(2)} Kč</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}
      onPress={() => router.push('/usermenu')}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Objednávky</Text>
      <Text style={styles.subHeader}>Nejnovější</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5500" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Zatím nemáte žádné objednávky</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 20
  },
  header: {
    fontSize: 16,
    marginTop: 40,
    color: "#000000",
    marginLeft: 300,
    fontWeight: "400",
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12
  },
  place: {
    fontWeight: 'bold',
    fontSize: 16
  },
  details: {
    color: 'gray',
    fontSize: 14,
    marginTop: 4
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FF5500'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  listContainer: {
    paddingBottom: 20
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500'
  }
});

export default OrdersScreen;
