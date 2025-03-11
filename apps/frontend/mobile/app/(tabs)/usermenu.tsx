import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';

const UserMenu = () => {
  const [isCourier, setIsCourier] = useState(false);

  const toggleMode = () => setIsCourier(!isCourier);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Uživatelský profil</Text>

      <View style={styles.profileSection}>
        <View style={styles.profileText}>
          <Text style={styles.subtitle}>Uživatelský profil</Text>
          <Text style={styles.name}>Miroslav</Text>
        </View>
        <Image source={require('@/assets/images/avatar.png')} style={styles.icon} />
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Adresa</Text>
          <Text style={styles.cardText}>Upravte nebo změňte svou adresu</Text>
          <Image source={require('@/assets/images/Location.png')} style={styles.smallIcon} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Objednávky</Text>
          <Text style={styles.cardText}>Podívejte se na všechny Vaše objednávky</Text>
          <Image source={require('@/assets/images/Bill.png')} style={styles.smallIcon} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Zůstatek</Text>
          <Text style={styles.cardText}>Dobijte si kredit pro objednávání</Text>
          <Image source={require('@/assets/images/Transaction.png')} style={styles.smallIcon} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informace</Text>
          <Text style={styles.cardText}>Zjistěte si něco o Nás a naší apce</Text>
          <Image source={require('@/assets/images/Info.png')} style={styles.smallIcon} />
        </View>
      </View>

      <View style={styles.largeCard}>
        <Text style={styles.cardTitle}>Režim kurýra</Text>
        <Text style={styles.cardText}>Přepněte do režimu kurýra a začněte vydělávat ještě dnes</Text>
        <View style={styles.courierMode}>
          <TouchableOpacity style={[styles.toggleContainer, isCourier && styles.toggleContainerActive]} onPress={toggleMode}>
            <Animated.View style={[styles.toggleButton, isCourier && styles.toggleButtonActive]} />
          </TouchableOpacity>
          <Text style={styles.toggleText}>{isCourier ? 'Kurýr' : 'Uživatel'}</Text>
          <Image source={require('@/assets/images/Supplier.png')} style={styles.supplierIcon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  header: {
    textAlign: "right",
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
    marginTop: 40,
    marginBottom: 16
  },
  profileSection: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 16
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  subtitle: {
    color: 'gray',
    fontSize: 16,
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 25
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    backgroundColor: '#EBEBEB',
    borderRadius: 16,
    padding: 25,
    width: '48%',
    marginBottom: 8
  },
  largeCard: {
    backgroundColor: '#EBEBEB',
    borderRadius: 16,
    padding: 25,
    marginTop: 8
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  cardText: {
    color: 'gray',
    fontSize: 16,
    marginBottom: 10,
  },
  smallIcon: {
    width: 45,
    height: 45,
    alignSelf: 'flex-end'
  },
  courierMode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  toggleContainer: {
    width: 60,
    height: 32,
    backgroundColor: 'gray',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 4
  },
  toggleContainerActive: {
    backgroundColor: '#FF5500'
  },
  toggleButton: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  toggleButtonActive: {
    alignSelf: 'flex-end'
  },
  toggleText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'light'
  },
  supplierIcon: {
    width: 45,
    height: 45,
    marginLeft: 'auto',
  }
});

export default UserMenu;
