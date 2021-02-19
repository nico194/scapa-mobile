import React, { useEffect } from 'react';
import Navigator from './Navigator'
import { Provider } from 'react-redux';
import store from './redux/store'
import { LinearGradient } from 'expo-linear-gradient';

export default function app() {

  	return (
		<Provider store={store}>
			<Navigator />
		</Provider>

  	);
}
