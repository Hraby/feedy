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

export default function RegistrationScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  const { register, loading: authLoading, error } = useAuth() || {};

  const handleRegistration = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Vyplňte prosím všechna pole');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Heslo musí obsahovat alespoň 6 znaků');
      return;
    }

    setLocalLoading(true);
    try {
      await register(firstName, lastName, email, password);
    } catch (e) {
      console.error('Local registration error:', e);
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

  return (
    <ImageBackground source={require('@/assets/images/bg-register.png')} style={styles.container}>
      <View style={styles.headerBackground}>
        <Image source={require('@/assets/images/Logos/feedyLogoWhite.png')} style={styles.logo} />
      </View>
      
      
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Registrace</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.inactiveTab}>Přihlásit se</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput 
        placeholder="Jméno" 
        style={styles.input} 
        value={firstName}
        onChangeText={setFirstName}
      />
      
      <TextInput 
        placeholder="Přijmení" 
        style={styles.input} 
        value={lastName}
        onChangeText={setLastName}
      />
      
      <TextInput 
        placeholder="E-mail" 
        style={styles.input} 
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput 
        placeholder="Heslo" 
        style={styles.input} 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegistration}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" testID="loading-indicator"/>
        ) : (
          <Text style={styles.buttonText}>Zaregistrovat se</Text>
        )}
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
    height: 350,
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
    height: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ff9966',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'light',
    fontSize: 18,
  },
});