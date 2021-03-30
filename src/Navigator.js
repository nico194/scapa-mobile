import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SpeakScreen from './screens/SpeakScreen';
import ConfigScreen from './screens/ConfigScreen';
import CustomCategoriesScreen from './screens/CustomCategoriesScreen';
import CustomPictogramsScreen from './screens/CustomPictogramsScreen';
import LoadingResourseScreen from './screens/LoadingResourseScreen';
import MemoriesScreen from './screens/MemoriesScreen';
import RoutinesScreen from './screens/RoutinesScreen';

const Stack = createStackNavigator();

export default function Navigator() {
  	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}} >
				<Stack.Screen name='Home' component={HomeScreen} />
				<Stack.Screen name='Login' component={LoginScreen}  />
				<Stack.Screen name='Config' component={ConfigScreen}  />
				<Stack.Screen name='CustomCategories' component={CustomCategoriesScreen} />
				<Stack.Screen name='CustomPictograms' component={CustomPictogramsScreen} />
				<Stack.Screen name='LoadingResourse' component={LoadingResourseScreen} />
				<Stack.Screen name='Register' component={RegisterScreen} />
				<Stack.Screen name='Speak' component={SpeakScreen} />
				<Stack.Screen name='Memories' component={MemoriesScreen} />
				<Stack.Screen name='Routines' component={RoutinesScreen} />
			</Stack.Navigator>
		</NavigationContainer>
  	);
}