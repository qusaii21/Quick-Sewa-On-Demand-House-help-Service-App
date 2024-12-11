import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Save maid's username after login
  const saveMaidUsername = async (username) => {
    try {
      await AsyncStorage.setItem('maidUsername', username); // Store username in AsyncStorage
    } catch (error) {
      console.error('Error saving maid username:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.113.117:5000/auth/login', { username, password });
      console.log('Login successful:', response.data);
  
      const { userType } = response.data; // Assuming your response includes userType
      if (userType === 'user') {
        console.log('Navigating to UserRequestScreen');
        navigation.navigate('UserRequestScreen', { username });
      } else if (userType === 'maid') {
        console.log('Navigating to MaidRequestScreen');
        // Save the maid's username to AsyncStorage
        await saveMaidUsername(username);
        navigation.navigate('MaidRequestScreen');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top-left image */}
      <Image
        source={require('../assets/images/QuickSeva(3).png')} // Add your image path here
        style={styles.topLeftImage}
      />
      
      <Text style={styles.headerText}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#9c27b0" // Light purple placeholder text color
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9c27b0" // Light purple placeholder text color
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SelectUserType')}>
          <Text style={styles.signupLink}> Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom-right image */}
      <Image
        source={require('../assets/images/QuickSeva(3).png')} // Add your image path here
        style={styles.bottomRightImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4a148c', // Deep purple for header text
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#7b1fa2', // Medium purple border for input fields
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff', // White background for input fields
    color: '#4a148c', // Text color inside the input
  },
  loginButton: {
    backgroundColor: '#7b1fa2', // Medium purple button
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff', // White text for the login button
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  signupText: {
    color: '#4a148c', // Deep purple text
    fontSize: 16,
  },
  signupLink: {
    color: '#7b1fa2', // Medium purple link text
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  topLeftImage: {
    position: 'absolute',
    top: -70,
    left: -80,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  bottomRightImage: {
    position: 'absolute',
    bottom: -150,
    right: -80,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
