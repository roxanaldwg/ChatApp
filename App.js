import { StyleSheet } from "react-native";
import React from "react";

import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// create navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Screen1"
        >
          <Stack.Screen
            name="Screen1"
            component={Screen1}
          />
          <Stack.Screen
            name="Screen2"
            component={Screen2}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }