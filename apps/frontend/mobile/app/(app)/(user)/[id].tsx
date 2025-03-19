import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { BACKEND_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useShoppingCart } from "@/context/CartShoppingContext";

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
  const { accessToken } = useAuth();
  const { addToCart, cartItems, clearCart } = useShoppingCart();

  const getDefaultImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'burger':
        return require('@/assets/images/burger.png');
      case 'kuřecí':
        return require('@/assets/images/chicken.png');
      case 'pizza':
        return require('@/assets/images/pizza.png');
      case 'čína':
        return require('@/assets/images/ramen.png');
      case 'snídaně':
        return require('@/assets/images/sandwich.png');
      case 'sushi':
        return require('@/assets/images/sushi.png');
      case 'salát':
        return require('@/assets/images/carrot.png');
      case 'sladké':
        return require('@/assets/images/waffle.png');
      case 'slané':
        return require('@/assets/images/fries.png');
      default:
        return require('@/assets/images/placeholder.png');
    }
  };

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
        const newData = await data.json();
        setRestaurant(newData);
      } catch (error) {
        console.error("Error loading restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleAddToCart = (item: MenuItem) => {
    if (cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId) {
      Alert.alert(
        "Změna restaurace",
        "Máte v košíku položky z jiné restaurace. Chcete vymazat košík a přidat tuto položku?",
        [
          {
            text: "Ne, ponechat",
            style: "cancel"
          },
          {
            text: "Ano, vymazat košík",
            onPress: () => {
              clearCart();
              addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                restaurantId: item.restaurantId,
                restaurantName: restaurant?.name || '',
                image: item.imageUrl ? { uri: item.imageUrl } : undefined
              });
            }
          }
        ]
      );
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        restaurantId: item.restaurantId,
        restaurantName: restaurant?.name || '',
        image: item.imageUrl ? { uri: item.imageUrl } : undefined
      });
    }
  };

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
        <Text style={styles.errorText}>Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.imageUrl }} style={styles.topImage} />
        <TouchableOpacity style={styles.backButton}
        onPress={() => router.push("/(app)/(user)/")}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.locationBadge}>Zlín</Text>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.detailsRow}>
          <Badge icon="fast-food" label={"Food"} />
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
            <FoodCard
              item={item}
              onAddToCart={() => handleAddToCart(item)}
              restaurantName={restaurant.name}
              getDefaultImage={getDefaultImage}
            />
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

const FoodCard = ({ item, onAddToCart, restaurantName, getDefaultImage }: { 
  item: MenuItem; 
  onAddToCart: () => void; 
  restaurantName: string;
  getDefaultImage: (category: string) => any;
}) => (
  <TouchableOpacity 
    style={styles.foodCard}
    onPress={() => router.push({
      pathname: '/order',
      params: {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        restaurantId: item.restaurantId,
        restaurantName: restaurantName
      }
    })}
  >
    <Image 
      source={item.imageUrl ? {uri: item.imageUrl} : require('@/assets/images/placeholder.png')} 
      style={styles.foodImage} 
      resizeMode="cover"
      defaultSource={require('@/assets/images/placeholder.png')}
    />
    <View style={styles.textContainer}>
      <Text style={styles.foodTitle}>{item.name}</Text>
      <Text style={styles.foodDescription}>{item.description}</Text>
    </View>
    <View style={styles.bottomContainer}>
      <Text style={styles.foodPrice}>{item.price} Kč</Text>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={(e) => {
          e.stopPropagation();
          onAddToCart();
        }}
      >
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
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
    width: "100%",
    height: 80,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#FF5500",
    padding: 6,
    borderRadius: 20,
  },
});