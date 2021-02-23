import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font';
import React, { Component } from "react";
import { StyleProvider } from "native-base";

import App from "../app";
import getTheme from "../theme/components";
import material from "../theme/variables/material";

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  UNSAFE_componentWillMount() {
    this.loadFonts();
  }
  async loadFonts() {
    await Font.loadAsync({
      Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ isReady: true });
  }
  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <StyleProvider style={getTheme(material)}>
        <App />
      </StyleProvider>
    );
  }
}