import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const PersonalInfo = () => {
  const {user} = useAuth();

  const firstLetter = user?.firstName.charAt(0);

  const roleColors = {
    Admin: '#dc3545',
    Courier: '#28a745',
    Restaurant: '#8a2be2',
    Customer: '#007bff'
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/usermenu')}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Profil</Text>

      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
          
          <View style={styles.rolesContainer}>
            {user?.role.map((role: any, index:any) => (
              <View 
                key={index} 
                style={[
                  styles.roleButton, 
                  { backgroundColor: roleColors[role as keyof typeof roleColors] || '#6c757d' }
                ]}
              >
                <Text style={styles.roleText}>{role}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Upravit profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF'
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
    fontSize: 18,
    marginTop: 50,
    color: "#000000",
    textAlign: "right",
    fontWeight: "500",
    marginBottom: 40,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#555'
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 12,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  roleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  roleText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: "#FF5500",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500'
  }
});

export default PersonalInfo;