import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { BACKEND_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchScreen = () => {
  const { accessToken, address } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const defaultAddress = {
    city: "Zlín",
    zipCode: "760 01",
    street: "náměstí Míru 12",
    country: "Czechia",
  };

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/restaurant`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error("Restaurants fetch failed");

      const data = await response.json();
      setRestaurants(data);

      const userCity = (address?.city || defaultAddress.city).toLowerCase();
      
      const filtered = data.filter((restaurant: any) => {
        const restaurantCity = restaurant.address?.city?.toLowerCase();
        return restaurantCity == userCity;
      });

      setFilteredRestaurants(filtered);

    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchRestaurants();
    }
  }, [address, accessToken]);

  const searchResults = filteredRestaurants.filter((restaurant: any) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push("/(app)/(user)")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Hledat restauraci..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {searchQuery === "" || searchResults.length === 0 ? (
        <View style={styles.notFoundContainer}>
          <Ionicons name="search" size={80} color="#ccc" />
          <Text style={styles.notFoundText}>Restaurace nenalezena</Text>
          <Text style={styles.subText}>Zkuste něco jiného</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.restaurantItem} 
              onPress={() => router.push(`/(app)/(user)/${item.id}`)}
            >
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#EBEBEB',
    padding: 8,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 60,
    fontSize: 18,
    marginTop: 40,
    fontFamily: "Montserrat", 
  },
  notFoundContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  notFoundText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Montserrat", 
  },
  subText: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Montserrat", 
  },
  restaurantItem: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    fontFamily: "Montserrat", 
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat", 
  },
  restaurantDescription: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Montserrat", 
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginLeft: 10,
  },
});

export default SearchScreen;