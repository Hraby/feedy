import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useDriver } from '@/context/DriverContext';
import * as Location from 'expo-location';

const OrderScreen = () => {
  const { activeOrder, fetchActiveOrder, pickupOrder, completeDelivery } = useDriver();
  const [restaurantCoordinates, setRestaurantCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchActiveOrder();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationUpdates = async () => {
      if (!locationPermission) return;

      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (location) => {
            setCurrentLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        );
      } catch (error) {
        console.log('Error watching location:', error);
      }
    };

    startLocationUpdates();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationPermission]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
    }
  };

  useEffect(() => {
    const getRestaurantCoordinates = async () => {
      if (!activeOrder?.restaurant?.address) return;

      try {
        const address = `${activeOrder.restaurant.address.street}, ${activeOrder.restaurant.address.zipCode}, ${activeOrder.restaurant.address.city}, ${activeOrder.restaurant.address.country}`;
        const geocode = await Location.geocodeAsync(address);
        
        if (geocode.length > 0) {
          setRestaurantCoordinates({
            latitude: geocode[0].latitude,
            longitude: geocode[0].longitude
          });
        }
      } catch (error) {
        console.log('Error geocoding restaurant address:', error);
      }
    };

    const getDeliveryCoordinates = async () => {
      if (!activeOrder?.user?.address) return;

      try {
        const address = `${activeOrder.user.address.street}, ${activeOrder.user.address.zipCode}, ${activeOrder.user.address.city}, ${activeOrder.user.address.country}`;
        const geocode = await Location.geocodeAsync(address);
        
        if (geocode.length > 0) {
          setDeliveryCoordinates({
            latitude: geocode[0].latitude,
            longitude: geocode[0].longitude
          });
        }
      } catch (error) {
        console.log('Error geocoding delivery address:', error);
      }
    };

    getRestaurantCoordinates();
    getDeliveryCoordinates();
  }, [activeOrder]);

  const calculateTotalPrice = () => {
    if (!activeOrder) return 0;
    return activeOrder.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePickup = async () => {
    setIsLoading(true);
    try {
      await pickupOrder();
      await fetchActiveOrder();
    } catch (error) {
      console.log('Error picking up order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliveryComplete = async () => {
    setIsLoading(true);
    try {
      await completeDelivery();
      setShowSuccessModal(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      setTimeout(() => {
        router.replace('/(app)/(driver)');
      }, 2000);
    } catch (error) {
      console.log('Error completing delivery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeOrder) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5500" />
      </View>
    );
  }

  const isPickedUp = activeOrder.status === 'OutForDelivery';
  const mapRegion = currentLocation ? {
    ...currentLocation,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  } : undefined;

  return (
    <ScrollView style={styles.container}>
      <View style={{ paddingBottom: 100 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/(app)/(driver)')}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.header}>Dovoz</Text>
        </View>
        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map}
            region={mapRegion}
            showsUserLocation
            followsUserLocation
          >
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="Vaše poloha"
                pinColor="#007AFF"
              />
            )}
            {restaurantCoordinates && (
              <Marker
                coordinate={restaurantCoordinates}
                title={activeOrder?.restaurant.name}
                pinColor="#FF5500"
              />
            )}
            {deliveryCoordinates && (
              <Marker
                coordinate={deliveryCoordinates}
                title="Dodací adresa"
                pinColor="#FF5500"
              />
            )}
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
        {activeOrder.orderItems.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.menuItem.name}</Text>
            <Text style={styles.itemInfo}>
              <Text style={styles.itemQuantity}>{item.quantity} x</Text>
              <Text style={styles.itemPrice}>{item.price} Kč</Text>
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Celkem</Text>
          <Text style={styles.totalPrice}>{calculateTotalPrice()} Kč</Text>
        </View>
        {!isPickedUp ? (
          <TouchableOpacity 
            style={[styles.pickupButton, isLoading && styles.disabledButton]}
            onPress={handlePickup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.pickupButtonText}>VYZVEDNOUT OBJEDNÁVKU</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.deliveryButton, isLoading && styles.disabledButton]}
            onPress={handleDeliveryComplete}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.deliveryButtonText}>DORUČENO</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <Modal
        transparent
        visible={showSuccessModal}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#FF5500" />
            </View>
            <Text style={styles.successTitle}>Objednávka doručena!</Text>
            <Text style={styles.successText}>Děkujeme za vaši službu</Text>
          </Animated.View>
        </View>
      </Modal>
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
    fontSize: 16,
    fontFamily: "Montserrat", 
  },
  deliveryTimeWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  deliveryTime: {
    marginLeft: 5,
    fontFamily: "Montserrat", 
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
    fontFamily: "Montserrat", 
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
    fontFamily: "Montserrat", 
    color: "#333"
  },
  itemInfo: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Montserrat", 
  },
  itemQuantity: {
    fontWeight: "300",
    fontFamily: "Montserrat", 
  },
  itemPrice: {
    fontWeight: "bold",
    fontFamily: "Montserrat", 
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
    fontFamily: "Montserrat", 
    color: "#333"
  },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Montserrat", 
    color: "#333"
  },
  pickupButton: {
    backgroundColor: "#FF5500",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50
  },
  pickupButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontFamily: "Montserrat", 
    fontSize: 16
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
    fontFamily: "Montserrat", 
    fontSize: 16
  },
  disabledButton: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Montserrat", 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successText: {
    fontFamily: "Montserrat", 
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default OrderScreen;
