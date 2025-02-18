import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Checkbox, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OrderScreen() {
  const [quantity, setQuantity] = useState(1);
  const [sauces, setSauces] = useState(['Bylinková omáčka', 'Česneková omáčka']);

  const handleSauceToggle = (sauce) => {
    if (sauces.includes(sauce)) {
      if (sauces.length > 1) {
        setSauces(sauces.filter((s) => s !== sauce));
      }
    } else if (sauces.length < 2) {
      setSauces([...sauces, sauce]);
    }
  };

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={require('@/assets/images/kebab2.png')} style={styles.topImage} />
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBlock}>
          <Text style={styles.foodTitle}>Kebab klasický</Text>
          <View style={styles.restaurantContainer}>
  <Ionicons name="home-outline" size={20} color="gray" style={styles.homeIcon} />
  <Text style={styles.restaurant}>Kebab Haus Zlín</Text>
</View>
          <Text style={styles.description}>Maso, turecký chléb, zelí, dresink</Text>

          <Text style={styles.sectionTitle}>Jakou omáčku si přejete?</Text>
          <Text style={styles.sauceHint}>Vyberte alespoň 1 možnost, nejvíce 2.</Text>
          <Checkbox.Item label="Bez omáčky" status={sauces.length === 0 ? 'checked' : 'unchecked'} onPress={() => setSauces([])} />
          <Checkbox.Item label="Bylinková omáčka" status={sauces.includes('Bylinková omáčka') ? 'checked' : 'unchecked'} onPress={() => handleSauceToggle('Bylinková omáčka')} />
          <Checkbox.Item label="Česneková omáčka" status={sauces.includes('Česneková omáčka') ? 'checked' : 'unchecked'} onPress={() => handleSauceToggle('Česneková omáčka')} />
        </View>

        <View style={styles.boxContainer}>
          <View style={styles.priceQuantityContainer}>
            <Text style={styles.price}>{(305 * quantity).toFixed(2)} Kč</Text>

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

          <Button mode="contained" style={styles.addButton}>
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
  },
  restaurant: {
    color: '#252B33',
    marginTop: 10,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: 'light',
    marginBottom: 10,
    marginTop: 5,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 18,
  },
  sauceHint: {
    color: '#FF5500',
    marginBottom: 5,
  },
  boxContainer: {
    backgroundColor: '#F0F5FA',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 20,
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
  },
  addButton: {
    backgroundColor: '#F56A00',
    borderRadius: 10,
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
