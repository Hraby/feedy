import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const RatingScreen = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = () => {
    if (!name || rating === '' || isNaN(rating) || rating < 0 || rating > 5) {
      Alert.alert("Chyba", "Zadejte platné jméno a hodnocení mezi 0 a 5.");
      return;
    }
    Alert.alert("Úspěšně odesláno", "Vaše hodnocení bylo zaznamenáno.");
    setName('');
    setRating('');
  };

  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton}
              onPress={() => router.push('/usermenu')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      <Text style={styles.header}>Informace</Text>
      <Text style={styles.title}>Ohodnoťte restauraci nebo kurýra</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadejte jméno restaurace/kurýra"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Hodnocení (0-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Odeslat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#EBEBEB',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#EBEBEB',
    padding: 8,
    borderRadius: 20,
  },
  backText: {
    fontSize: 18,
  },
  header: {
    fontSize: 16,
    fontFamily: "Montserrat", 
    marginTop: 40,
    color: "#000000",
    marginLeft: 300,
    fontWeight: "400",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF5500',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 600,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
});

export default RatingScreen;
