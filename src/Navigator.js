import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SpeakScreen from './screens/SpeakScreen';

const Stack = createStackNavigator();

export default function Navigator() {
  	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}} >
				<Stack.Screen name='Home' component={HomeScreen} />
				<Stack.Screen name='Login' component={LoginScreen}  />
				<Stack.Screen name='Register' component={RegisterScreen} />
				<Stack.Screen name='Speak' component={SpeakScreen} />
			</Stack.Navigator>
		</NavigationContainer>
  	);
}