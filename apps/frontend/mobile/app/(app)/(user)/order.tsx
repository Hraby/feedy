import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useShoppingCart } from '@/context/CartShoppingContext';

const { width } = Dimensions.get('window');

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  restaurantId: string;
  restaurantName: string;
}

export default function OrderScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { addToCart, cartItems, clearCart } = useShoppingCart();
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (cartItems.length > 0 && cartItems[0].restaurantId !== params.restaurantId) {
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
                id: params.id,
                name: params.name,
                price: Number(params.price),
                quantity: quantity,
                restaurantId: params.restaurantId,
                restaurantName: params.restaurantName,
                image: params.imageUrl ? { uri: params.imageUrl } : undefined
              });
              router.push(`/(app)/(user)/${params.restaurantId}`);
            }
          }
        ]
      );
    } else {
      addToCart({
        id: params.id,
        name: params.name,
        price: Number(params.price),
        quantity: quantity,
        restaurantId: params.restaurantId,
        restaurantName: params.restaurantName,
        image: params.imageUrl ? { uri: params.imageUrl } : undefined
      });
      router.push(`/(app)/(user)/${params.restaurantId}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image 
          source={params.imageUrl ? { uri: params.imageUrl } : require('@/assets/images/placeholder.png')} 
          style={styles.topImage} 
        />
        <TouchableOpacity style={styles.backButton} onPress={() => router.push(`/(app)/(user)/${params.restaurantId}`)}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBlock}>
          <Text style={styles.foodTitle}>{params.name}</Text>
          <View style={styles.restaurantContainer}>
            <Ionicons name="home-outline" size={20} color="gray" style={styles.homeIcon} />
            <Text style={styles.restaurant}>{params.restaurantName}</Text>
          </View>
          <Text style={styles.description}>{params.description}</Text>
        </View>

        <View style={styles.boxContainer}>
          <View style={styles.priceQuantityContainer}>
            <Text style={styles.price}>{(Number(params.price) * quantity).toFixed(2)} Kč</Text>

            <View style={styles.quantityBox}>
              <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
                <Ionicons name="remove" size={18} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
                <Ionicons name="add" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <Button mode="contained" style={styles.addButton} onPress={handleAddToCart}>
            PŘIDAT DO KOŠÍKU
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageWrapper: {
    width: width,
    height: 250,
    position: 'relative',
  },
  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  infoBlock: {
    padding: 20,
  },
  foodTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: "Montserrat", 
  },
  restaurant: {
    color: '#252B33',
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Montserrat", 
  },
  description: {
    fontSize: 16,
    fontWeight: 'light',
    marginBottom: 10,
    fontFamily: "Montserrat", 
    marginTop: 5,
  },
  boxContainer: {
    backgroundColor: '#F0F5FA',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 20,
    fontFamily: "Montserrat", 
  },
  priceQuantityContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 24,
    fontWeight: 'light',
    color: '#1A1A1A',
    fontFamily: "Montserrat", 
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 12,
    fontFamily: "Montserrat", 
  },
  addButton: {
    backgroundColor: '#FF5500',
    borderRadius: 10,
    paddingVertical: 5,
    fontFamily: "Montserrat", 
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  homeIcon: {
    marginTop: 10,
    marginRight: 5,
    color: '#FF5500',
  },  
});
