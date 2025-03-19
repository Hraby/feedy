import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  Image, 
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { login, loading: authLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLocalLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      console.error('Local login error:', e);
    } finally {
      setLocalLoading(false);
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const isLoading = localLoading || authLoading;

  // Načti fonty
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  if (!fontsLoaded) {
    return null; // Počkej, než se fonty načtou
  }

  return (
    <ImageBackground 
      source={require('@/assets/images/bg-login.png')}
      style={styles.container}
    >
      <View style={styles.headerBackground}>
        <Image 
          source={require('@/assets/images//Logos/feedyLogoGradient.png')}
          style={styles.logo}
        />
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={[styles.inactiveTab, { fontFamily: 'Montserrat_400Regular' }]}>Registrace</Text>
        </TouchableOpacity>
        <Text style={[styles.activeTab, { fontFamily: 'Montserrat_500Medium' }]}>Přihlásit se</Text>
      </View>
      
      <TextInput 
        placeholder="E-mail" 
        style={[styles.input, { fontFamily: 'Montserrat_400Regular' }]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput 
        placeholder="Heslo" 
        style={[styles.input, { fontFamily: 'Montserrat_400Regular' }]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
        testID="login-button"
      >
        {isLoading ? (
          <ActivityIndicator color="#252B33" testID="activity-indicator"/>
        ) : (
          <Text style={[styles.buttonText, { fontFamily: 'Montserrat_500Medium' }]}>Přihlásit se</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.forgotPassword}
        //onPress={() => router.push('/(auth)/forgot-password')}
      >
        <Text style={[styles.forgotPasswordText, { fontFamily: 'Montserrat_400Regular' }]}>Zapomenuté heslo?</Text>
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
    color: 'white',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#252B33',
    fontWeight: 'light',
    fontSize: 18,
  },
  forgotPassword: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 14,
  }
});
