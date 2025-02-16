import { getBackgroundColorAsync } from 'expo-system-ui';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';

export default function RegistrationScreen() {
  return (
    <ImageBackground source={require('@/assets/images/bg-login.png')} style={styles.container}>
      <View style={styles.headerBackground}>
        <Image source={require('@/assets/images//Logos/feedyLogoGradient.png')} style={styles.logo} />
      </View>
      <View style={styles.tabs}>
        <Text style={styles.inactiveTab}>Registrace</Text>
        <Text style={styles.activeTab}>Přihlásit se</Text>
      </View>
      <TextInput placeholder="Uživatelské jméno nebo E-mail" style={styles.input} />
      <TextInput placeholder="Heslo" style={styles.input} secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Přihlásit se</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: '100%',
    height: 400,
    backgroundColor: '#FF5500',
  },
  headerBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 100,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 40,
  },
  activeTab: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  inactiveTab: {
    color: 'white',
    fontSize: 24,
    marginRight: 100,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#FF5500',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    backgroundColor: '#FD7C3C',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#252B33',
    fontWeight: 'light',
    fontSize: 18,
  },
});
