// screens/SignupScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ route, navigation }) {
  const { userType } = route.params;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!username || !password || !phoneNumber || (userType === 'user' && !address)) {
      console.error('All fields are required');
      setIsSubmitting(false);
      return;
    }

    const signupData = { username, password, phone: phoneNumber, userType };
    if (userType === 'user') {
      signupData.address = address;
    }

    try {
      await axios.post('http://192.168.113.117:5000/auth/signup', signupData);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top-left image */}
      <Image
        source={require('../assets/images/QuickSeva(3).png')} // Add your image path here
        style={styles.topLeftImage}
      />

      <Text style={styles.headerText}>Sign Up as {userType.charAt(0).toUpperCase() + userType.slice(1)}</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#9c27b0"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9c27b0"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#9c27b0"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      
      {userType === 'user' && (
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#9c27b0"
          value={address}
          onChangeText={setAddress}
        />
      )}

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={isSubmitting}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}> Login</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4a148c',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#7b1fa2',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    color: '#4a148c',
  },
  signupButton: {
    backgroundColor: '#7b1fa2',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginText: {
    color: '#4a148c',
    fontSize: 16,
  },
  loginLink: {
    color: '#7b1fa2',
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
