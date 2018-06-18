import React, { Component } from 'react';
import  {Animated,View,Text,AppState,Button,ScrollView} from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.0.0-beta.14

import Contacts from 'react-native-contacts';

import Header from './Header';
import GameList from './GameList';
import StartNewGame from './StartNewGame';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PendingRequestPreview from './PendingRequestPreview';
// import Button from './Button';
import RenderSingleOngoingGame from './RenderSingleOngoingGame';

import firebase, { database } from './firebase';
import TabsNavigation from './TabsNavigation';
import OngoingGames from './OngoingGames';

class Games extends Component {
    
    state={ appState : AppState.currentState,count:'', ongoingGamesData : {}, noOfOngoingGames : '' };

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Games',
            // headerStyle: {backgroundColor: 'white'},
            // headerBackTitleStyle: {color:'white'},
            headerRight: <Button title="Logout" onPress={ ()=>{ database.child('/status/'+firebase.auth().currentUser.uid).set({
                currentStatus:'offline',
                ts: Date.now()
            }); firebase.auth().signOut(); } }/>,
            headerLeft: <Button title="+" onPress={ () => navigation.navigate('Friends') } />
        }
    };
    
    componentWillMount() {
        this.props.navigation.setParams({ navigation: this.props.navigation });
        this.updateAppStatus(this.state.appState);
        
        AppState.addEventListener('change', (state) => {
            this.updateAppStatus(state);
        });

        this.fetchOngoingGamesData(firebase.auth().currentUser.uid);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', (state) => {
            this.updateAppStatus(state);
        });
    }

    // make this exportable
    fetchOngoingGamesData(myUid) {
        database.child('ongoingGames/'+myUid).on('value',(snapshot)=>{
            // snapshot.val() key is otherPersonsUid and value is gameId
            let noOfOngoingGames;
            if(snapshot.val() != null) {
                noOfOngoingGames = Object.keys(snapshot.val()).length;
                console.log('noOfOngoingGames ',noOfOngoingGames);
            } else  {
                noOfOngoingGames = 0;
                console.log('noOfOngoingGames ',noOfOngoingGames);
            }
            this.setState({ ongoingGamesData:snapshot.val(), noOfOngoingGames });
        });
    }

    updateAppStatus(state) {
        if(state === 'active') {
            console.log('user is online');
            database.child('/status/'+firebase.auth().currentUser.uid).set({
                currentStatus:'online',
                ts: Date.now()
            });
        } else if(state === 'background' || state === 'inactive') {
            console.log('user is offline');
            database.child('/status/'+firebase.auth().currentUser.uid).set({
                currentStatus:'offline',
                ts: Date.now()
            });
        }
    }

    render() {
        return(
            <View style={{flex:1,backgroundColor:'#F4F4F4'}}>
                <ScrollView>
                <PendingRequestPreview navigation={this.props.navigation} />
                <View style={{flex:1}}>
                    <View style={{paddingLeft:15,paddingTop:4}}>
                        <Text style={{fontSize:16,fontWeight:'600'}}>
                            Games ({this.state.noOfOngoingGames})
                        </Text>
                    </View>
                    <OngoingGames
                    ongoingGamesData={this.state.ongoingGamesData}
                    navigation = {this.props.navigation}
                    />
                    {/* previously commented. Uncomment at your own risk */}
                    {/* <RenderSingleOngoingGame /> */}
                </View>
                </ScrollView>
            </View>
        );
    }
}

export default Games;