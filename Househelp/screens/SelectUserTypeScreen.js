// screens/SelectUserTypeScreen.jsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function SelectUserTypeScreen({ navigation }) {
  useEffect(() => {
    console.log("SelectUserTypeScreen component has mounted");
  }, []);

  return (
    <View style={styles.container}>
      {/* Top-left image */}
      <Image
        source={require('../assets/images/QuickSeva(3).png')} // Add your image path here
        style={styles.topLeftImage}
      />

      <Text style={styles.title}>Select Account Type</Text>
      
      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Signup', { userType: 'user' })}
      >
        <Text style={styles.optionText}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.optionButton} 
        onPress={() => navigation.navigate('Signup', { userType: 'maid' })}
      >
        <Text style={styles.optionText}>Maid</Text>
      </TouchableOpacity>

      {/* Bottom-right image */}
      <Image
        source={require('../assets/images/QuickSeva(3).png')} // Add your image path here
        style={styles.bottomRightImage}
      />
    </View>
  );
}

// Purple Theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 30,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7b1fa2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  optionText: {
    fontSize: 18,
    color: '#f3e5f5',
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
