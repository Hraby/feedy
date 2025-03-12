import { getBackgroundColorAsync } from 'expo-system-ui';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function RegistrationScreen() {
  return (
    <ImageBackground source={require('@/assets/images/bg-register.png')} style={styles.container}>
      <View style={styles.headerBackground}>
        <Image source={require('@/assets/images//Logos/feedyLogoWhite.png')} style={styles.logo} />
      </View>
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Registrace</Text>
         <TouchableOpacity 
                    onPress={() => router.push('/login')}
                  >
        <Text style={styles.inactiveTab}>Přihlásit se</Text>
        </TouchableOpacity>
      </View>
      <TextInput placeholder="Uživatelské jméno" style={styles.input} />
      <TextInput placeholder="E-mail" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Heslo" style={styles.input} secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Zaregistrovat se</Text>
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
    backgroundColor: '#fff',
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
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 40,
  },
  activeTab: {
    color: '#FF5500',
    fontWeight: 'bold',
    fontSize: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#FF5500',
    marginRight: 100,
  },
  inactiveTab: {
    color: '#000',
    fontSize: 24,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FF5500',
    paddingVertical: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'light',
    fontSize: 18,
  },
});
