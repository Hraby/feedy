import React, { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView } from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AddressSelect from '@/components/AddressSelect';
import { BACKEND_URL } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRestaurants } from '@/lib/api';

interface Category {
  id: string;
  title: string;
  image: any; 
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string[];
  status: string;
  rating?: number;
  deliveryTime?: string;
  address?: {
    city: string;
    zipCode: string;
    street: string;
    country: string;
  };
}

const menuCategories = [
  { id: '1', title: 'Burger', icon: require('@/assets/images/burger.png') },
  { id: '2', title: 'Kuřecí', icon: require('@/assets/images/chicken.png') },
  { id: '3', title: 'Pizza', icon: require('@/assets/images/pizza.png') },
  { id: '4', title: 'Čína', icon: require('@/assets/images/ramen.png') },
  { id: '5', title: 'Snídaně', icon: require('@/assets/images/sandwich.png') },
  { id: '6', title: 'Sushi', icon: require('@/assets/images/sushi.png') },
  { id: '7', title: 'Salát', icon: require('@/assets/images/carrot.png') },
  { id: '8', title: 'Sladké', icon: require('@/assets/images/waffle.png') },
  { id: '9', title: 'Slané', icon: require('@/assets/images/fries.png') },
];

export default function IndexScreen() {
  const { user, accessToken, address } = useAuth();
  const [restaurantsData, setRestaurantsData] = useState({
    all: [],
    filtered: [],
    loading: true,
    newLoading: true,
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pulseAnim] = useState(new Animated.Value(0.3));

  const defaultAddress = { city: "Zlín", zipCode: "760 01", street: "náměstí Míru 12", country: "Czechia" };

  const loadRestaurants = async () => {
    if (!accessToken) return;

    const savedAddress = await AsyncStorage.getItem('deliveryAddress');
    const currentAddress = savedAddress || defaultAddress;
    setRestaurantsData((prevState) => ({ ...prevState, loading: true, newLoading: true }));

    try{
      const allRestaurants = await fetchRestaurants(currentAddress, accessToken);

      setRestaurantsData({
        all: allRestaurants,
        filtered: allRestaurants,
        loading: false,
        newLoading: false,
      });
    } catch (error) {
      console.log("Error loading restaurants:", error);
      setRestaurantsData({ ...restaurantsData, loading: false, newLoading: false });
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadRestaurants();
    }
  }, [accessToken, address]);

  useFocusEffect(
    useCallback(() => {
      console.log('Page focused, loading restaurants...');
      loadRestaurants();
      return () => console.log('Page unfocused, cleaning up...');
    }, [])
  );

  const toggleFilter = (categoryName: string) => {
    if (categoryName === selectedCategory) {
      setSelectedCategory(null);
      setRestaurantsData({
        ...restaurantsData,
        filtered: restaurantsData.all,
      });
    } else {
      setSelectedCategory(categoryName);
      setRestaurantsData({
        ...restaurantsData,
        filtered: restaurantsData.all.filter((restaurant: any) =>
          restaurant.category.includes(categoryName)
        ),
      });
    }
  };
  

  const handleAddressChange = () => {
    loadRestaurants();
  };

  useEffect(() => {
    const pulsate = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      })
    ]);
    
    Animated.loop(pulsate).start();
    
    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);

  const RestaurantSkeleton = () => (
    <Animated.View 
      style={[
        styles.restaurantCard, 
        { opacity: pulseAnim }
      ]}
    >
      <View style={[styles.skeletonImage, { backgroundColor: '#e0e0e0' }]} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantTitleContainer}>
          <View style={[styles.skeletonText, { width: '50%', height: 14, backgroundColor: '#e0e0e0' }]} />
          <View style={[styles.skeletonText, { width: '30%', height: 12, backgroundColor: '#e0e0e0' }]} />
        </View>
        <View style={[styles.skeletonText, { width: '90%', height: 12, marginTop: 5, backgroundColor: '#e0e0e0' }]} />
        <View style={[styles.skeletonText, { width: '70%', height: 12, marginTop: 3, backgroundColor: '#e0e0e0' }]} />
        <View style={styles.restaurantTags}>
          <View style={[styles.skeletonTag, { width: 70, backgroundColor: '#e0e0e0' }]} />
          <View style={[styles.skeletonTag, { width: 60, backgroundColor: '#e0e0e0' }]} />
        </View>
      </View>
    </Animated.View>
  );

  const renderSkeletons = (count = 4) => {
    return Array(count).fill(0).map((_, index) => (
      <RestaurantSkeleton key={index} />
    ));
  };

  const RestaurantCard = ({ restaurant, onPress }: { restaurant: Restaurant, onPress: () => void }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={onPress}
    >
      <Image 
        source={{ uri: restaurant.imageUrl }} 
        style={styles.restaurantImage} 
        resizeMode="cover"
        defaultSource={require('@/assets/images/placeholder.png')}
      />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantTitleContainer}>
          <Text style={styles.restaurantTitle}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{restaurant.rating || "4.0"}</Text>
            <Ionicons name="star" size={16} color="#FF5500" />
          </View>
        </View>
        <Text style={styles.restaurantDescription} numberOfLines={2}>
          {restaurant.description}
        </Text>
        <View style={styles.restaurantTags}>
          {restaurant.category && restaurant.category.map((cat: string, i: number) => (
            <View key={i} style={styles.tag}>
              <Ionicons name="fast-food-outline" size={16} color="#252B33" />
              <Text style={styles.tagText}>{cat}</Text>
            </View>
          )).slice(0, 2)}
          <View style={styles.tag}>
            <Ionicons name="time-outline" size={16} color="#252B33" />
            <Text style={styles.tagText}>{restaurant.deliveryTime || "25 min"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const NewRestaurantsSection = () => (
    <>
      <Text style={styles.sectionTitle}>Vyzkoušejte něco nového</Text>
      <View style={styles.cardsScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {restaurantsData.loading ? (
            renderSkeletons(4)
          ) : restaurantsData.all.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                Momentálně nejsou dostupné žádné nové restaurace.
              </Text>
            </View>
          ) : (
            restaurantsData.all.map((restaurant: any, index) => (
              <RestaurantCard 
                key={index} 
                restaurant={restaurant} 
                onPress={() => router.push({
                  pathname: '/(app)/(user)/[id]',
                  params: { id: restaurant.id }
                })}
              />
            ))
          )}
        </ScrollView>
      </View>
    </>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftContainer}>
            <AddressSelect onAddressChange={handleAddressChange} />
          </View>
          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={() => router.push("/(app)/(user)/usermenu")}>
              <Ionicons name="person-circle-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rectangle}>
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => router.push('/(app)/(user)/search')}>
            <Text style={styles.rectangleText}>Na co máte chuť?</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.secondRectangle}>
          <Text style={styles.secondRectangleText}>Ochutnejte</Text>
          <Text style={styles.secondRectangleSubText}>Naše skvělé</Text>
          <Text style={styles.secondRectangleBoldText}>BURGERY</Text>
          
          <Image source={require('@/assets/images/burgerAndChips.png')} style={styles.secondRectangleImage} />
        </View>

        <View style={styles.menuScrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {menuCategories.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.menuItem, 
                  selectedCategory === item.title && styles.menuItemActive
                ]}
                onPress={() => toggleFilter(item.title)}
              >
                <Image source={item.icon} style={styles.menuIcon} />
                <Text style={[
                  styles.menuText, 
                  selectedCategory === item.title && styles.menuTextActive
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
       
        <Text style={styles.sectionTitle}>
          {user?.firstName ? `Co to dnes bude, ${user.firstName}` : 'Co to dnes bude?'}
        </Text>

        <View style={styles.cardsScrollContainer}>
          {restaurantsData.loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {renderSkeletons(4)}
            </ScrollView>
          ) : restaurantsData.filtered.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                Pod tímto filtrem aktuálně není dostupná žádná restaurace.
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {restaurantsData.filtered.map((restaurant: any, index) => (
                <RestaurantCard 
                  key={index} 
                  restaurant={restaurant} 
                  onPress={() => router.push({
                    pathname: '/(app)/(user)/[id]',
                    params: { id: restaurant.id }
                  })}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <NewRestaurantsSection />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
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
    paddingVertical: 80,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 30,
    borderRadius: 15,
  },
  secondRectangleText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    textAlign: 'left',
    position: 'absolute',
    marginTop: 20,
    marginLeft: 20,
  },
  secondRectangleSubText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    textAlign: 'left',
    position: 'absolute',
    marginTop: 55,
    marginLeft: 20,
  },
  secondRectangleBoldText: {
    color: '#fff',
    fontSize: 45,
    fontWeight: '500',
    textAlign: 'left',
    position: 'absolute',
    marginTop: 90,
    marginLeft: 20,
  },
  secondRectangleImage: {
    width: 180,
    height: 200,
    position: 'absolute',
    right: -15,
    top: -5,
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
    fontWeight: 'light',
  },
  menuTextActive: {
    color: '#fff',
  },
  cardsScrollContainer: {
    marginTop: 20,
    paddingLeft: 15,
  },
  restaurantCard: {
    width: 160,
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd', 
  },
  restaurantImage: {
    width: '100%',
    height: 95,
  },
  restaurantInfo: {
    padding: 8,
    flex: 1,
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
    flex: 1,
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
    flex: 1,
  },
  restaurantTags: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#252B33',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#252B33',
    marginLeft: 15,
    marginTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginHorizontal: 15,
    marginTop: 10,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: 300,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  skeletonImage: {
    width: '100%',
    height: 95,
  },
  skeletonText: {
    height: 10,
    borderRadius: 4,
    marginVertical: 3,
  },
  skeletonTag: {
    height: 12,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 8,
  }
});