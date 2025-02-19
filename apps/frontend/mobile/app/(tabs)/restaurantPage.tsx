import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantScreen() {
  const foodItems = Array.from({ length: 6 }, (_, index) => ({
    id: index.toString(),
    title: 'Döner klasický',
    description: 'Šťavnaté maso s čerstvou zeleninou',
    price: '135,00 Kč',
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('@/assets/images/mrgrill.jpg')} style={styles.topImage} />
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.locationBadge}>Zlín</Text>
        <Text style={styles.restaurantName}>Mr Grill</Text>
        <View style={styles.detailsRow}>
          <Badge icon="fast-food" label="Burger" />
          <Badge icon="car" label="35 min" />
          <Rating rating="4/5" />
        </View>
        <Text style={styles.description}>
          Hovězí burgery, kuřecí kebaby, vegetariánská kuchyně.
        </Text>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Döner kebab – chleba</Text>
        <FlatList
          data={foodItems}
          renderItem={({ item }) => (
            <FoodCard
              title={item.title}
              description={item.description}
              price={item.price}
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

const Badge = ({ icon, label }) => (
  <View style={styles.badge}>
    <Ionicons name={icon} size={14} color="#000" />
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

const Rating = ({ rating }) => (
  <View style={styles.ratingContainer}>
    <Text style={styles.ratingText}>{rating}</Text>
    <Ionicons name="star" size={14} color="#000" />
  </View>
);

const FoodCard = ({ title, description, price }) => (
  <View style={styles.foodCard}>
    <Image source={require('@/assets/images/kebab.png')} style={styles.foodImage} />
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
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    height: 300,
  },
  topImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 20,
  },
  infoBlock: {
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  locationBadge: {
    backgroundColor: '#FFE4D4',
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    borderRadius: 20,
    fontSize: 16,
    width: 55,
    color: '#FF5500',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 35,
  },
  badgeText: {
    fontSize: 14,
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    marginRight: 2,
  },
  description: {
    fontSize: 16,
    marginTop: 15,
    color: '#252B33',
  },
  sectionBlock: {
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    marginTop: 0,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  foodCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginBottom: 20,
    position: 'relative',
    flexDirection: 'column',
  },
  textContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  foodDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'left',
    marginTop: 5,
  },
  bottomContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5500',
  },
  foodImage: {
    width: 100,
    height: 80,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#FF5500',
    padding: 6,
    borderRadius: 20,
  },
});