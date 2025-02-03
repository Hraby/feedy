import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/startpage.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.title}>feedy.</Text>
          
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Přihlásit se</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Registrace</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FF5500',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FF5500',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF5500',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  registerButtonText: {
    color: '#FF5500',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
