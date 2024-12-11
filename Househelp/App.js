// App.js or your main navigation file
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import SelectUserTypeScreen from './screens/SelectUserTypeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import UserScreen from './screens/UserRequestScreen'; // User screen component
import MaidScreen from './screens/MaidRequestScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SelectUserType" component={SelectUserTypeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserRequestScreen" component={UserScreen} /> 
        <Stack.Screen name="MaidRequestScreen" component={MaidScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
