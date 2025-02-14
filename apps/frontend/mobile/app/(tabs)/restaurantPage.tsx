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
      {/* Horní sekce – obrázek restaurace a tlačítko zpět */}
      <View style={styles.imageContainer}>
        <Image source={require('@/assets/images/mrgrill.jpg')} style={styles.topImage} />
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Informační blok restaurace */}
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

      {/* Sekce s jídly */}
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

// Komponenta pro zobrazení odznaku
const Badge = ({ icon, label }) => (
  <View style={styles.badge}>
    <Ionicons name={icon} size={14} color="#000" />
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

// Komponenta pro zobrazení hodnocení
const Rating = ({ rating }) => (
  <View style={styles.ratingContainer}>
    <Text style={styles.ratingText}>{rating}</Text>
    <Ionicons name="star" size={14} color="#000" />
  </View>
);

// Komponenta pro zobrazení karty jídla
const FoodCard = ({ title, description, price }) => (
  <View style={styles.foodCard}>
    <Image source={require('@/assets/images/kebab.png')} style={styles.foodImage} />
    <View style={styles.textContainer}>
      <Text style={styles.foodTitle}>{title}</Text>
      <Text style={styles.foodDescription}>{description}</Text>
    </View>
    {/* Nový kontejner pro dolní část karty */}
    <View style={styles.bottomContainer}>
      <Text style={styles.foodPrice}>{price}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  // Kontejner pro celou obrazovku
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Kontejner pro horní obrázek restaurace
  imageContainer: {
    height: 300,
  },
  // Styl pro horní obrázek (vyplní celý container)
  topImage: {
    width: '100%',
    height: '100%',
  },
  // Tlačítko pro návrat, umístěné nad obrázkem
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 20,
  },
  // Informační blok restaurace
  infoBlock: {
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  // Styl pro odznak s umístěním
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
  // Název restaurace
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  // Řádek s detaily (odznaky a hodnocení)
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  // Styl pro jednotlivý odznak
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 35,
  },
  // Text v odznaku
  badgeText: {
    fontSize: 14,
    marginLeft: 5,
  },
  // Kontejner pro hodnocení
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Text hodnocení
  ratingText: {
    fontSize: 16,
    marginRight: 2,
  },
  // Popis restaurace
  description: {
    fontSize: 16,
    marginTop: 15,
    color: '#252B33',
  },
  // Sekce s jídly
  sectionBlock: {
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 20,
  },
  // Název sekce s jídly
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    marginTop: 0,
  },
  // Řádek karet – dvě karty vedle sebe
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  // Styl karty jídla
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
  // Kontejner pro text uvnitř karty (zarovnaný vlevo)
  textContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  // Název jídla
  foodTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  // Popis jídla
  foodDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'left',
    marginTop: 5,
  },
  // Nový kontejner pro dolní část karty (cena a tlačítko)
  bottomContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Cena jídla – umístěná v levém dolním rohu karty
  foodPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5500',
  },
  // Obrázek jídla
  foodImage: {
    width: 100,
    height: 80,
    borderRadius: 5,
  },
  // Tlačítko pro přidání jídla – umístěné v pravém dolním rohu karty
  addButton: {
    backgroundColor: '#FF5500',
    padding: 6,
    borderRadius: 20,
  },
});
