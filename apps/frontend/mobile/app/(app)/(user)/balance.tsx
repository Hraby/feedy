import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_URL } from '@/lib/constants';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  menuItemId: string;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

const BalanceScreen = () => {
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
            },
            method: "GET"
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
      console.error('Error loading orders:', error);
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

  const calculateTotalExpenses = () => {
    return orders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((orderSum, item) => orderSum + (item.price * item.quantity), 0);
    }, 0);
  };

  const calculateMonthlyExpenses = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return orders
      .filter(order => new Date(order.createdAt) >= firstDayOfMonth)
      .reduce((sum, order) => {
        return sum + order.orderItems.reduce((orderSum, item) => orderSum + (item.price * item.quantity), 0);
      }, 0);
  };

  const totalExpenses = calculateTotalExpenses();
  const monthlyExpenses = calculateMonthlyExpenses();
  const averageOrder = orders.length > 0 ? totalExpenses / orders.length : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}
        onPress={() => router.push('/usermenu')}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.header}>Útraty</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5500" />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.totalExpensesCard}>
            <Text style={styles.totalExpensesLabel}>Celkové útraty</Text>
            <Text style={styles.totalExpensesValue}>{totalExpenses.toFixed(2)} Kč</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#FF5500" />
              <Text style={styles.statLabel}>Tento měsíc</Text>
              <Text style={styles.statValue}>{monthlyExpenses.toFixed(2)} Kč</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#FF5500" />
              <Text style={styles.statLabel}>Průměrná objednávka</Text>
              <Text style={styles.statValue}>{averageOrder.toFixed(2)} Kč</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 20,
  },
  header: {
    fontSize: 16,
    marginTop: 40,
    color: "#000000",
    marginLeft: 320,
    fontWeight: "400",
    marginBottom: 30,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  totalExpensesCard: {
    backgroundColor: '#F8F8F8',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalExpensesLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  totalExpensesValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BalanceScreen;
