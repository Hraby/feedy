import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const products = [
  { id: 1, name: "Pálivé kuře", description: "Pikantní a chutné kuře s rýží" },
  { id: 2, name: "Smažené tofu", description: "Křupavé tofu se zeleninou" }
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const foundProduct = products.find((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Hledat..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {searchQuery === "" || !foundProduct ? (
        <View style={styles.notFoundContainer}>
          <Ionicons name="search" size={80} color="#ccc" />
          <Text style={styles.notFoundText}>Položka nenalezena</Text>
          <Text style={styles.subText}>Zkuste něco jiného</Text>
        </View>
      ) : (
        <View style={styles.productContainer}>
          <Text style={styles.productName}>{foundProduct.name}</Text>
          <Text style={styles.productDescription}>{foundProduct.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
},
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#EBEBEB',
    padding: 8,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 60,
    fontSize: 18,
    marginTop: 40,
  },
  notFoundContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  notFoundText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subText: {
    fontSize: 16,
    color: "#888",
  },
  productContainer: {
    padding: 40,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 18,
    color: "#555",
  },
});

export default SearchScreen;