import React from 'react';
import Navigator from './Navigator'
import { Provider } from 'react-redux';
import store from './redux/store'

export default function app() {

  	return (
		<Provider store={store}>
			<Navigator />
		</Provider>
  	);
}
