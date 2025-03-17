import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_URL } from '@/lib/constants';
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'OutForDelivery' | 'Delivered' | 'Cancelled';

const statusToStepMap: Record<OrderStatus, number> = {
  "Pending": 1,
  "Preparing": 2,
  "Ready": 3,
  "OutForDelivery": 4,
  "Delivered": 5,
  "Cancelled": 1
};

const TrackOrder = () => {
  const { id } = useLocalSearchParams();
  const { accessToken } = useAuth();
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Pending');
  const [orderStep, setOrderStep] = useState(1);

  const kfcLocation = {
    latitude: 49.223890,
    longitude: 17.670722,
  };

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status);

    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (!accessToken || !id) return;
    
    const fetchOrderStatus = async () => {
      try {
        console.log("Fetching order status for ID:", id);
        const response = await fetch(`${BACKEND_URL}/order/${id}/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        });

        if (!response.ok) throw new Error("Failed to fetch order status");
        
        const data = await response.json();
        console.log("Order status response:", data);
        const status = data.status as OrderStatus;
        setOrderStatus(status);
        
        if (status && status in statusToStepMap) {
          setOrderStep(statusToStepMap[status]);
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrderStatus();
    const intervalId = setInterval(fetchOrderStatus, 5000);
    return () => clearInterval(intervalId);
  }, [id, accessToken]);

  if (locationPermission !== 'granted') {
    return <Text>Nemáte povolení pro přístup k poloze</Text>;
  }

  if (!userLocation) {
    return <Text>Načítání polohy...</Text>;
  }

  const isOrderComplete = orderStep === 5;

  const steps = [
    { id: 1, label: "📥  Objednávka byla přijata", completed: orderStep >= 1 },
    { id: 2, label: "👨‍🍳  Restaurace připravuje objednávku", completed: orderStep >= 2 },
    { id: 3, label: "📦  Objednávka čeká na vyzvednutí", completed: orderStep >= 3 },
    { id: 4, label: "🚗  Objednávka je na cestě", completed: orderStep >= 4 },
    { id: 5, label: "🏁  Objednávka doručena!", completed: orderStep >= 5 },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Sledovat objednávku</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.mapWrapper}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker 
                coordinate={kfcLocation} 
                title="KFC Zlín Zlaté Jablko" 
                description="nám. Míru 174, 760 01 Zlín 1" 
              />
              <Marker 
                coordinate={userLocation} 
                title="Vaše poloha" 
                description="Vaše aktuální pozice" 
              />
              <Polyline
                coordinates={[userLocation, kfcLocation]}
                strokeColor="#FF5500"
                strokeWidth={4}
              />
            </MapView>
          </View>
        </View>

        <View style={styles.estimatedTimeContainer}>
          <Text style={styles.estimatedTime}>20 min</Text>
          <Text style={styles.subText}>ODHADOVANÝ ČAS DORUČENÍ</Text>
        </View>

        <View style={styles.statusContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.statusItem}>
              <Text style={[styles.statusText, step.completed && styles.activeText]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingBottom: 125,
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
    textAlign: "right",
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
    marginTop: 65,
    marginRight: 20,
  },
  scrollView: {
    flex: 1,
  },
  mapWrapper: {
    marginTop: 20,
  },
  mapContainer: {
    height: height * 0.4,
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    color: "#999",
  },
  activeText: {
    color: "#FF5500",
    fontWeight: "bold",
  },
});

export default TrackOrder; 