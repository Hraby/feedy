import React from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView } from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

interface Category {
  id: string;
  title: string;
  image: any; 
}

const categories: Category[] = [
  { id: '1', title: 'Kategorie 1', image: require('@/assets/images/card1.jpeg') },
  { id: '2', title: 'Kategorie 2', image: require('@/assets/images/card1.jpeg') },
  { id: '3', title: 'Kategorie 3', image: require('@/assets/images/card1.jpeg') },
  { id: '4', title: 'Kategorie 4', image: require('@/assets/images/card1.jpeg') },
];

const menuCategories = [
  { id: '1', title: 'Burger', icon: require('@/assets/images/burger.png') },
  { id: '2', title: 'Kuřecí', icon: require('@/assets/images/chicken.png') },
  { id: '3', title: 'Pizza', icon: require('@/assets/images/pizza.png') },
  { id: '4', title: 'Ramen', icon: require('@/assets/images/ramen.png') },
  { id: '5', title: 'Sushi', icon: require('@/assets/images/sushi.png') },
];

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <Ionicons name="navigate" size={24} color="#FF5500" style={styles.icon} />
          <Text style={styles.headerTitle}>Poloha 9876</Text>
        </View>
        <View style={styles.rightContainer}>
          <Ionicons name="image" size={20} color="#fff" />
        </View>
      </View>

      <View style={styles.rectangle}>
        <Text style={styles.rectangleText}>Na co máte chuť?</Text>
      </View>
      
      <View style={styles.secondRectangle}>
        <Text style={styles.secondRectangleText}>Ochutnejte</Text>
        <Text style={styles.secondRectangleSubText}>Naše skvělé</Text>
        <Text style={styles.secondRectangleBoldText}>BURGERY</Text>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Otevřít nabídku</Text>
        </TouchableOpacity>
        
        <Image source={require('@/assets/images/burgerAndChips.png')} style={styles.secondRectangleImage} />
      </View>

      <View style={styles.menuScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {menuCategories.map((item, index) => (
            <TouchableOpacity key={item.id} style={[styles.menuItem, index === 0 && styles.menuItemActive]}>
              <Image source={item.icon} style={styles.menuIcon} />
              <Text style={[styles.menuText, index === 0 && styles.menuTextActive]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.cardsScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((item) => (
            <TouchableOpacity key={item.id} style={styles.restaurantCard}>
              <Image source={item.image} style={styles.restaurantImage} resizeMode="cover" />
              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantTitleContainer}>
                  <Text style={styles.restaurantTitle}>{item.title}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>4/5</Text>
                    <Ionicons name="star" size={16} color="#FF5500" />
                  </View>
                </View>
                <Text style={styles.restaurantDescription}>
                  Popis kategorie {item.title}.
                </Text>
                <View style={styles.restaurantTags}>
                  <View style={styles.tag}>
                    <Ionicons name="fast-food-outline" size={16} color="#252B33" />
                    <Text style={styles.tagText}>Kategorie</Text>
                  </View>
                  <View style={styles.tag}>
                    <Ionicons name="car-outline" size={16} color="#252B33" />
                    <Text style={styles.tagText}>30 min</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 40,
    backgroundColor: '#fff',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  icon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'light',
    color: '#252B33',
  },
  rightContainer: {
    backgroundColor: '#FF5500',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  rectangle: {
    backgroundColor: 'rgba(255, 85, 0, 0.3)',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
  },
  rectangleText: {
    color: '#252B33',
    fontSize: 15,
    fontWeight: 'light',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  secondRectangle: {
    backgroundColor: '#FF5500',
    paddingVertical: 95,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 30,
    borderRadius: 15,
  },
  secondRectangleText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'left',
    position: 'absolute',
    marginTop: 15,
    marginLeft: 20,
  },
  secondRectangleSubText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'left',
    position: 'absolute',
    marginTop: 45,
    marginLeft: 20,
  },
  secondRectangleBoldText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    textAlign: 'left',
    position: 'absolute',
    marginTop: 75,
    marginLeft: 20,
  },
  secondRectangleImage: {
    width: 200,
    height: 220,
    position: 'absolute',
    right: -15,
    top: 0,
  },
  menuButton: {
    backgroundColor: '#EBEBEB',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: 125,
    marginLeft: 20,
    position: 'absolute',
  },
  menuButtonText: {
    color: '#252B33',
    fontSize: 16,
    fontWeight: 'light',
    textAlign: 'center',
  },
  menuScrollContainer: {
    marginTop: 25,
    marginLeft: 15,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
  },
  menuItemActive: {
    backgroundColor: '#FF5500',
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  menuText: {
    fontSize: 14,
    color: '#252B33',
    fontWeight: 'bold',
  },
  menuTextActive: {
    color: '#fff',
  },
  cardsScrollContainer: {
    marginTop: 20,
    paddingLeft: 10,
  },
  restaurantCard: {
    width: 160, // ZMENŠENÁ ŠÍŘKA
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 95, // MENŠÍ OBRÁZEK
  },
  restaurantInfo: {
    padding: 8,
  },
  restaurantTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#252B33',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingText: {
    fontSize: 12,
    color: '#252B33',
    marginRight: 5,
  },
  restaurantDescription: {
    fontSize: 12,
    color: '#252B33',
    marginTop: 5,
  },
  restaurantTags: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#252B33',
    marginLeft: 5,
  },
});
