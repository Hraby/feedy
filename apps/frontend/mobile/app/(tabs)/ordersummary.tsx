import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

const orders = [
  { id: '1', place: 'Kebab House Zlín', details: '1x Kebab Durum, 2x Hranolky', price: '179,00 Kč' },
  { id: '2', place: 'Kebab House Zlín', details: '1x Kebab Durum, 2x Hranolky', price: '179,00 Kč' },
  { id: '3', place: 'Kebab House Zlín', details: '1x Kebab Durum, 2x Hranolky', price: '179,00 Kč' },
  { id: '4', place: 'Kebab House Zlín', details: '1x Kebab Durum, 2x Hranolky', price: '179,00 Kč' },
  { id: '5', place: 'Kebab House Zlín', details: '1x Kebab Durum, 2x Hranolky', price: '179,00 Kč' }
];

const OrdersScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View>
        <Text style={styles.place}>{item.place}</Text>
        <Text style={styles.details}>{item.details}</Text>
      </View>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}
      onPress={() => router.push('/usermenu')}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Objednávky</Text>
      <Text style={styles.subHeader}>Nejnovější</Text>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 20
  },
  header: {
    fontSize: 16,
    marginTop: 40,
    color: "#000000",
    marginLeft: 300,
    fontWeight: "400",
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10
  },
  place: {
    fontWeight: 'bold',
    fontSize: 16
  },
  details: {
    color: 'gray',
    fontSize: 14
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default OrdersScreen;
