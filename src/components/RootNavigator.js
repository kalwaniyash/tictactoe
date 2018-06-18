import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.0.0-beta.14
import Games from './Games';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Friends from './Friends';
import PlayingArea from './PlayingArea';

const RootNavigator = StackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            headerTitle: 'Sign In',
        },
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            headerTitle: 'Sign Up',
        },
    },
    Games: {
      screen: Games,
      navigationOptions: {
        headerTitle: 'Games',
      },
    },
    Friends: {
        screen: Friends,
        navigationOptions: {
            headerTitle: 'Friends',
        },
    },
    PlayingArea: {
        screen: PlayingArea,
    },
}
);

export default RootNavigator;