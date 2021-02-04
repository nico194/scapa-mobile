import React, { useEffect } from 'react';
import Navigator from './Navigator'
import { Provider } from 'react-redux';
import store from './redux/store'
import { LinearGradient } from 'expo-linear-gradient';
import { dropDatabaseTablesAsync, setupDatabaseAsync } from './configs/database'

export default function app() {

	useEffect(() => {
		async function loadDataAsync() {
			try {
				await dropDatabaseTablesAsync();
				await setupDatabaseAsync();
			} catch (error) {
				console.log(error)
			}
		}
		loadDataAsync();
	}, [])

  	return (
		<Provider store={store}>
			<LinearGradient style={{ flex: 1 }} colors={['#62B1F6', '#2F62FB']}>
				<Navigator />
			</LinearGradient>
		</Provider>

  	);
}
