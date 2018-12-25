import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import HomeScreen from './app/screens/homeScreen'
import SearchScreen from './app/screens/searchSreen'
import { Ionicons } from '@expo/vector-icons';

const AppNavigator = createBottomTabNavigator(
  {
    Home: {screen: HomeScreen},
    Search: {screen: SearchScreen}
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({focused, tintColor}) => {
        const { routeName } = navigation.state;
        let iconName = 'default';
        if(routeName === 'Home'){
          iconName = 'ios-home';// + (focused) ? '' : '-outline';
        }
        if(routeName === 'Search'){
          iconName = 'ios-search';// + (focused) ? '' : '-outline';
        }
        //console.log(routeName, focused, iconName, navigation);
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (<Ionicons name={iconName} size={25} color={tintColor} />);
      }
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray'
    }
    // navigationOptions: {
      
    // }
  }
);

export default createAppContainer(AppNavigator);