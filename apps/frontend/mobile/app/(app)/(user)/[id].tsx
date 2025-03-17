import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { BACKEND_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    available: boolean;
    restaurantId: string;
  }
  
  interface Restaurant {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    menuItems: MenuItem[];
  }

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [loading, setLoading] = useState(true);
  const {accessToken} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(`${BACKEND_URL}/restaurant/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            credentials: "include",
        });
        const newData = await data.json()
        setRestaurant(newData);
        console.log(restaurant)
      } catch (error) {
        console.error("Chyba při načítání restaurace:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF5500" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Restaurace nenalezena.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.imageUrl }} style={styles.topImage} />
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.locationBadge}>Zlín</Text>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.detailsRow}>
          <Badge icon="fast-food" label={"Jídlo"} />
          <Badge icon="car" label="35 min" />
          <Rating rating="4/5" />
        </View>
        <Text style={styles.description}>{restaurant.description}</Text>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <FlatList
          data={restaurant.menuItems}
          renderItem={({ item }) => (
            <FoodCard title={item.name} description={item.description} price={`${item.price} Kč`} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.cardRow}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const Badge = ({ icon, label }: any) => (
  <View style={styles.badge}>
    <Ionicons name={icon} size={14} color="#000" />
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

const Rating = ({ rating }: any) => (
  <View style={styles.ratingContainer}>
    <Text style={styles.ratingText}>{rating}</Text>
    <Ionicons name="star" size={14} color="#000" />
  </View>
);

const FoodCard = ({ title, description, price }: any) => (
  <View style={styles.foodCard}>
    <Image source={require("@/assets/images/kebab.png")} style={styles.foodImage} />
    <View style={styles.textContainer}>
      <Text style={styles.foodTitle}>{title}</Text>
      <Text style={styles.foodDescription}>{description}</Text>
    </View>
    <View style={styles.bottomContainer}>
      <Text style={styles.foodPrice}>{price}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  imageContainer: {
    height: 300,
  },
  topImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 20,
  },
  infoBlock: {
    padding: 20,
  },
  locationBadge: {
    backgroundColor: "#FFE4D4",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 16,
    width: 55,
    color: "#FF5500",
    textAlign: "center",
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 35,
  },
  badgeText: {
    fontSize: 14,
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    marginRight: 2,
  },
  description: {
    fontSize: 16,
    marginTop: 15,
    color: "#252B33",
  },
  sectionBlock: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  cardRow: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  foodCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#dddddd",
    marginBottom: 20,
  },
  textContainer: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    marginTop: 5,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  foodDescription: {
    fontSize: 12,
    color: "#666666",
    marginTop: 5,
  },
  bottomContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF5500",
  },
  foodImage: {
    width: 100,
    height: 80,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#FF5500",
    padding: 6,
    borderRadius: 20,
  },
});