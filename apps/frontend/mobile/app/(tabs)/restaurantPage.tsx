import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantScreen() {
  const foodItems = [...Array(6)].map((_, index) => ({
    id: index.toString(),
    title: "Döner klasický",
    description: "Šťavnaté maso s čerstvou zeleninou",
    price: "135,00 Kč",
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
        <Text style={styles.description}>Hovězí burgery, kuřecí kebaby, vegetariánská kuchyně.</Text>
      </View>

      <Section title="Döner kebab – chleba">
        {[...Array(3)].map((_, index) => (
          <FoodCard key={index} title="Döner klasický" description="Šťavnaté maso s čerstvou zeleninou" price="135,00 Kč" />
        ))}
      </Section>
    </ScrollView>
  );
}

interface BadgeProps {
  icon: string;
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ icon, label }) => (
  <View style={styles.badge}>
    <Ionicons name={icon} size={14} color="#000" />
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

const Rating: React.FC<{ rating: string }> = ({ rating }) => (
  <View style={styles.ratingContainer}>
    <Text style={styles.ratingText}>{rating}</Text>
    <Ionicons name="star" size={14} color="#000" />
  </View>
);

interface FoodCardProps {
    title: string;
    description: string;
    price: string;
  }

const FoodCard = ({ title, description, price }: FoodCardProps) => (
    <View style={styles.foodCard}>
      <Image source={require('@/assets/images/kebab.png')} style={styles.foodImage} />
      <Text style={styles.foodTitle}>{title}</Text>
      <Text style={styles.foodDescription}>{description}</Text>
      <Text style={styles.foodPrice}>{price}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foodScroll}>
      {children}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  imageContainer: { 
    height: 300 
  },
  infoBlock: { 
    padding: 20
  },

  topImage: { 
    width: '100%', 
    height: '100%' 
  },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    backgroundColor: '#fff', 
    padding: 8, 
    borderRadius: 20 
  },
  foodImage: { 
    width: 100, 
    height: 80, 
    borderRadius: 5 
  },
  addButton: { 
    backgroundColor: '#FF5500', 
    padding: 6, 
    borderRadius: 20, 
    marginLeft: 80,
    marginTop: -10,
    flexDirection: 'row'
  },
  locationBadge: { 
    backgroundColor: '#FFE4D4', 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 20, 
    fontSize: 16, 
    width: 55,
    color: '#FF5500', 
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5
  },
  restaurantName: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 8 
  },
  badgeText: { 
    fontSize: 14, 
    marginLeft: 5 
  },
  ratingText: { 
    fontSize: 16, 
    marginRight:  2
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginVertical: 20, 
    paddingLeft: 20 ,
    marginTop: 0
  },
  foodTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 5 ,
    textAlign: 'left'
  },
  foodDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    marginLeft: -5
  },
  foodPrice: { 
    fontSize: 12, 
    flexDirection: 'row',
    fontWeight: 'bold', 
    color: '#FF5500', 
    marginRight: 50, 
    marginTop: 5
  },
  detailsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10 
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 35 
  },
  ratingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  foodScroll: { 
    paddingLeft: 20 
  },
  foodCard: { 
    width: 140, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 10, 
    marginRight: 12, 
    alignItems: 'center',
    shadowColor: '#666666',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd', 
  },
  description: {
    fontSize: 16,
    marginTop: 15,
    color: '#252B33'
  }
});
