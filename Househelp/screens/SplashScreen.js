import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Welcome text */}
      <Text style={styles.welcomeText}>Welcome to QuickSeva!</Text>

      {/* Display the larger logo image at the top */}
      <Image 
        source={require('../assets/images/QuickSeva.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />

      {/* Sign Up Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('SelectUserType')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Log In Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align elements closer to the top
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  logo: {
    width: 500, // Set the logo size similar to the design
    height: 500, // Set the logo size similar to the design
    marginTop: 10, // Additional spacing at the top
    marginBottom: 20, // Reduced spacing to avoid pushing buttons down
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#7b1fa2',
    marginTop: 30, // Additional spacing at the top
    marginBottom: 30, // Reduced spacing below the welcome text
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7b1fa2',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5, // Reduced spacing between buttons
    width: '70%', // Slightly narrower button width for better alignment
    alignItems: 'center',
    position: 'relative', // Relative positioning to avoid pushing the buttons too low
    bottom: 100, // Move buttons upwards
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
  },
});
