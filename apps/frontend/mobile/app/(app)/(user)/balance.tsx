import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

const BalanceScreen = () => {
  const [balance, setBalance] = useState(390);

  const handleDobit = () => {
    Alert.prompt(
      'Dobít zůstatek',
      'Zadejte částku, kterou chcete dobít:',
      [
        {
          text: 'Zrušit',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (amount) => {
            const parsedAmount = parseFloat(amount);
            if (!isNaN(parsedAmount) && parsedAmount > 0) {
              setBalance((prevBalance) => prevBalance + parsedAmount);
            } else {
              Alert.alert('Chyba', 'Zadejte platnou částku.');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}
        onPress={() => router.push('/usermenu')}
        >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.header}>Zůstatek</Text>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerText}>Celkový zůstatek</Text>
          <Text style={styles.balance}>{balance.toFixed(2)} Kč</Text>
        </View>
        <TouchableOpacity style={styles.dobitButton} onPress={handleDobit}>
          <Text style={styles.dobitButtonText}>Dobít</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Útraty</Text>
      <View style={styles.expenseRow}>
        <Text style={styles.expenseLabel}>Celkem</Text>
        <Text style={styles.expenseValue}>2900,00 Kč</Text>
      </View>
      <View style={styles.expenseRow}>
        <Text style={styles.expenseLabel}>Tento měsíc</Text>
        <Text style={styles.expenseValue}>2900,00 Kč</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#EBEBEB",
    padding: 8,
    borderRadius: 20,
  },
  header: {
    fontSize: 16,
    marginTop: 40,
    color: "#000000",
    marginLeft: 320,
    fontWeight: "400",
    marginBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  balance: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  dobitButton: {
    backgroundColor: '#FF5500',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  dobitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  expenseLabel: {
    fontSize: 16,
    color: '#000',
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default BalanceScreen;
