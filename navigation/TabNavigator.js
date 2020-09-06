import React, { useContext } from 'react';
import { Ionicons, Foundation, Feather, FontAwesome } from '@expo/vector-icons';
import { HomeNavigator, PostNavigator, ActivityNavigator, ProfileNavigator, MessageNavigation } from './StackNavigator'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import { NewMessagesContext } from '../context/NewMessageContext';

const activeColor = "#00CBA8";
const inactiveColor = "#1C1C1C";

const TabNavigator = createAppContainer(createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <Foundation name='home' color={focused ? activeColor : inactiveColor} size={32} />
        )
      }
    },
    Activity: {
      screen: ActivityNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <Feather name='clock' color={focused ? activeColor : inactiveColor} size={28} />
        )
      }
    },
    Post: {
      screen: PostNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <Ionicons name='ios-add-circle' color={focused ? activeColor : inactiveColor} size={32} />
        )
      }
    },
    Messages: {
      screen: MessageNavigation,
      navigationOptions: ({navigation}) => ({
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <>
            {navigation.state.params && navigation.state.params.newMessages ? (
              <FontAwesome name="circle" size={15} style={{ color: 'red', marginRight: -7, marginBottom: -7 }} />
            ) : null}
            <Feather name='send' color={focused ? activeColor : inactiveColor} size={28} />
          </>
        )
      })
    },
    MyProfile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <Ionicons name='md-contact' color={focused ? activeColor : inactiveColor} size={32} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        paddingVertical: 10,
        height: 60
      }
    }
  }
));

export default TabNavigator;