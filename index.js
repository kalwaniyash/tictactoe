import React, { Component } from 'react';
import {Image,View,Text,AppRegistry,Button, AppState} from 'react-native';
// import {StackNavigator} from 'react-navigation';
import Contacts from 'react-native-contacts';


import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';
import Friends from './src/components/Friends';
import Games from './src/components/Games';
import PlayingArea from './src/components/PlayingArea';
import PendingReq from './src/components/PendingReq';

import Spinner from './src/components/Spinner';

// import Button from './src/components/Button';

import firebase, { database }  from './src/components/firebase';
import {StackNavigator} from 'react-navigation';

import RootNavigator from './src/components/RootNavigator';
import PendingRequest from './src/components/PendingRequest';
// import TabsNavigation from './src/components/TabsNavigation';

class App extends Component {

    state={loggedIn:null};

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.setState({ loggedIn:true });
            } else {
                this.setState({ loggedIn:false });
            }
        });
    }

    render(){
        return(
            <View style={{flex:1}}>
                {this.checkUserStatus()}
            </View>
        );
    }
    
    checkUserStatus() {
        console.log('Checking user status',this.state.loggedIn);
        if(this.state.loggedIn) {
                return <MainNavigation />
            } else if(this.state.loggedIn === false) {
                console.log('open sign in');
                return <AuthNavigator />
            } else if(null) {
                return  <Spinner />
            }
    }
}

const AuthNavigator = StackNavigator({
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
    }
});

// stops from mutiple clicks in the auth navigation
const defaultGetStateForActions = AuthNavigator.router.getStateForAction;

AuthNavigator.router.getStateForAction = (action, state) => {
  const prevRoute = state && state.routes[state.routes.length - 1];

  if (!state || action.routeName !== prevRoute.routeName) {
    return defaultGetStateForActions(action, state);
  }
  return null;
};


const MainNavigation = StackNavigator({
        Games: {
        screen: Games,
        },
        Friends: {
            screen: Friends,
        },
        PlayingArea: {
            screen: PlayingArea,
        },
        PendingRequest: {
            screen: PendingRequest,
        }
    }
);

// stops from multiple clicks in main navigation
const defaultGetStateForAction = MainNavigation.router.getStateForAction;

MainNavigation.router.getStateForAction = (action, state) => {
  const prevRoute = state && state.routes[state.routes.length - 1];

  if (!state || action.routeName !== prevRoute.routeName) {
    return defaultGetStateForAction(action, state);
  }
  return null;
};

const Logout = () => {
    firebase.auth().signOut().then( ()=> console.log('Signed out') ).catch( err => console.log(err) );

};


AppRegistry.registerComponent('tictactoe', () => App);
