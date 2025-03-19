import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';

export default function AuthIndex() {
  const { user, loading } = useAuth();
  
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(app)/(user)');
    }
  }, [user, loading]);

  if (loading || !fontsLoaded) {
    return null; // Počkej, až se fonty načtou
  }

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('@/assets/images/startpage.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={[styles.title, { fontFamily: 'Montserrat_500Medium' }]}>feedy.</Text>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={[styles.loginButtonText, { fontFamily: 'Montserrat_500Medium' }]}>Přihlásit se</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/register')}
          >
            <Text style={[styles.registerButtonText, { fontFamily: 'Montserrat_500Medium' }]}>Registrace</Text>
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
