import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface Address {
  id: string;
  label: string;
  details: string;
  type: 'home' | 'work';
  active: boolean;
}

interface DeliveryAddress {
  street: string;
  zipCode: string;
  city: string;
  country: string;
}

const MAPY_API_KEY = process.env.EXPO_PUBLIC_MAPY_API_KEY;

const ALLOWED_CITIES = ['Brno', 'Praha', 'Zlín'];

const AddressSelect = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<DeliveryAddress | null>(null);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('deliveryAddress');
        if (savedAddress) {
          setAddress(JSON.parse(savedAddress));
        }
      } catch (error) {
        console.error('Chyba při načítání adresy:', error);
      }
    };

    loadAddress();
  }, []);

  useEffect(() => {
    if (address) {
      setAddresses([
        {
          id: 'home', 
          label: 'Domov', 
          details: `${address.street}, ${address.zipCode}, ${address.city}, ${address.country}`, 
          type: 'home', 
          active: true
        }
      ]);
    } else {
      setAddresses([
        {
          id: 'home', 
          label: 'Domov', 
          details: 'náměstí Míru 12, 760 01, Zlín, Czechia', 
          type: 'home', 
          active: true
        }
      ]);
    }
  }, [address]);

  const fetchAddresses = async (searchQuery: string) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapy.cz/v1/suggest?lang=cs&limit=5&type=regional.address&apikey=${
          encodeURIComponent(MAPY_API_KEY!)
        }&query=${encodeURIComponent(searchQuery)}`
      );

      const data = await response.json();

      const filteredSuggestions = data.items
        .filter((item: any) => {
          const municipality = item.regionalStructure?.find(
            (region: any) => region.type === 'regional.municipality'
          )?.name;
          return municipality && ALLOWED_CITIES.includes(municipality);
        })
        .map((item: any, index: number) => {
          const municipality = item.regionalStructure?.find(
            (region: any) => region.type === 'regional.municipality'
          )?.name || '';
          const zipCode = item.zip || '';
          const street = item.name || '';

          return {
            id: item.id ? `${item.id}-${index}` : `item-${index}`,
            name: `${street}, ${zipCode}, ${municipality}`,
            data: item,
          };
        });

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Chyba při vyhledávání adres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActiveAddress = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      active: addr.id === id,
    }));
    setAddresses(updatedAddresses);
    setIsDropdownVisible(false);
  };

  const handleSelectAddress = async (item: any) => {
    if (!item.data) {
      console.error('Neplatná data pro adresu:', item);
      return;
    }

    const selectedItem = item.data;
    const street = selectedItem.name || '';
    const zipCode = selectedItem.zip || '';
    const municipality = selectedItem.regionalStructure?.find(
      (region: any) => region.type === 'regional.municipality'
    )?.name || '';

    if (!municipality) {
      console.error('Nepodařilo se získat město:', selectedItem);
      return;
    }

    const addressData = {
      street,
      zipCode,
      city: municipality,
      country: 'Czechia',
    };

    try {
      await AsyncStorage.setItem('deliveryAddress', JSON.stringify(addressData));
      setAddress(addressData);
      setIsEditing(false);
      setIsDropdownVisible(false);
      Keyboard.dismiss();
      router.push("/(app)/(user)")
    } catch (error) {
      console.error('Chyba při ukládání adresy', error);
    }
  };

  const handleAddNewAddress = async (label: string, type: 'home' | 'work') => {
    if (!address) return;

    const newAddress: Address = {
      id: Date.now().toString(),
      label,
      details: `${address.street}, ${address.zipCode}, ${address.city}, ${address.country}`,
      type,
      active: true,
    };

    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      active: false,
    }));

    const newAddresses = [...updatedAddresses, newAddress];
    setAddresses(newAddresses);
    
    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(newAddresses));
    } catch (error) {
      console.error('Chyba při ukládání adres:', error);
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={[
        styles.addressItem,
        item.active && styles.activeAddressItem,
      ]}
      onPress={() => handleSetActiveAddress(item.id)}
    >
      <View style={[styles.addressIcon, item.active && styles.activeAddressIcon]}>
        <Ionicons
          name={item.type === 'home' ? 'home' : 'business'}
          size={20}
          color={item.active ? '#fff' : '#252B33'}
        />
      </View>
      <View style={styles.addressDetails}>
        <Text style={[styles.addressLabel, item.active && styles.activeAddressLabel]}>
          {item.label}
        </Text>
        <Text style={styles.addressText}>{item.details}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => {
          setIsDropdownVisible(true);
          setIsEditing(false);
        }}
      >
        <Ionicons name="navigate" size={24} color="#FF5500" />
        <Text style={styles.locationText}>
          {address?.city || 'Zlín'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setIsDropdownVisible(false);
            setIsEditing(false);
          }}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {isEditing ? (
              <View style={styles.autocompleteContainer}>
                <View style={styles.searchHeader}>
                  <Text style={styles.modalTitle}>Zadejte adresu</Text>
                  <TouchableOpacity onPress={() => setIsEditing(false)}>
                    <Ionicons name="close" size={24} color="#252B33" />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.searchInput}
                  placeholder="Vyhledat adresu..."
                  value={query}
                  onChangeText={(text) => {
                    setQuery(text);
                    fetchAddresses(text);
                  }}
                  autoFocus
                />

                {isLoading ? (
                  <ActivityIndicator size="large" color="#FF5500" style={styles.loader} />
                ) : (
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => handleSelectAddress(item)}
                      >
                        <Ionicons name="location" size={20} color="#FF5500" />
                        <Text style={styles.suggestionText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                    ListEmptyComponent={
                      query ? (
                        <Text style={styles.noResults}>Žádné výsledky nenalezeny</Text>
                      ) : null
                    }
                  />
                )}
              </View>
            ) : (
              <View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Vyberte adresu</Text>
                  <TouchableOpacity onPress={() => setIsDropdownVisible(false)}>
                    <Ionicons name="close" size={24} color="#252B33" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={addresses}
                  renderItem={renderAddressItem}
                  keyExtractor={(item) => item.id}
                  style={styles.addressList}
                />

                <TouchableOpacity
                  style={styles.changeAddressButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.changeAddressText}>Změnit adresu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addAddressButton}
                  onPress={() => {
                    setIsDropdownVisible(false);
                  }}
                >
                  <Text style={styles.addAddressText}>Přidat další adresu</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#252B33',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252B33',
  },
  addressList: {
    marginVertical: 10,
    maxHeight: 300,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeAddressItem: {
    backgroundColor: 'rgba(255, 85, 0, 0.1)',
  },
  addressIcon: {
    backgroundColor: '#EFEFEF',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeAddressIcon: {
    backgroundColor: '#FF5500',
  },
  addressDetails: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#252B33',
  },
  activeAddressLabel: {
    fontWeight: 'bold',
    color: '#FF5500',
  },
  addressText: {
    fontSize: 14,
    color: '#606060',
    marginTop: 2,
  },
  changeAddressButton: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: 8,
  },
  changeAddressText: {
    color: '#505050',
    fontSize: 16,
  },
  addAddressButton: {
    backgroundColor: '#FF5500',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: 8,
  },
  addAddressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  autocompleteContainer: {
    marginVertical: 10,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  suggestionsList: {
    marginTop: 10,
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  suggestionText: {
    fontSize: 14,
    color: '#252B33',
    marginLeft: 10,
  },
  noResults: {
    padding: 16,
    textAlign: 'center',
    color: '#666',
  },
  loader: {
    marginTop: 20,
  },
});

export default AddressSelect;