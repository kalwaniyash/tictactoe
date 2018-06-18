import React, { Component } from 'react';
import {View,Text, ScrollView, FlatList} from 'react-native';
import firebase, { database } from './firebase';
import {StatusOnline,StatusOffline} from './Status';
import OngoingStatus from './OngoingStatus';
import FadeInView from '../animations/FadeInView';
import Spinner from './Spinner';

import RenderSingleOngoingGame from './RenderSingleOngoingGame';

class OngoingGames extends Component {

    state={ongoingGamesData:{}, showSpinner : true };

    componentWillMount() {
        let myUid = firebase.auth().currentUser.uid;
        database.child('ongoingGames/'+myUid).on('value',(snapshot) => {
            // snapshot.val() key is otherPersonsUid and value is gameId

            ongoingGamesData = [];
            for(let key in snapshot.val()){

                singleObject = {};
                singleObject.otherPlayersUid = key;
                singleObject.gameId = snapshot.val()[key];
                
                ongoingGamesData.push(singleObject);
            }
            
            this.setState({ ongoingGamesData:ongoingGamesData,showSpinner:false });
        });
    }

    render() {
      return(
        <View style={{flex:1}}>
            {
                this.decideInitialContent(this.state.showSpinner)
            }
        </View>
      );
    }

    decideInitialContent(showSpinner) {
        if(showSpinner) {
            return(
                <View style={{ flex : 1 }}>
                    <Spinner />
                </View>
            );
        } else {
            return(
                <View style={{flex:1}}>
                    { this.renderOngoingGames(this.state.ongoingGamesData) }        
                </View>
            );
        }
    }

    renderOngoingGames(ongoingGamesData) {
        if(ongoingGamesData.length > 0) {
            
            return(
                <FlatList
                    data={ongoingGamesData}
                    renderItem={({item}) => { return <RenderSingleOngoingGame navigation={this.props.navigation} uidOfOtherPlayer={item.otherPlayersUid} gameId={item.gameId} />
                    } }
                keyExtractor={ (item) => item.uidOfOtherPlayer }
                />
            );
        } else {
            return(
                <View style={{alignItems:'center',justifyContent:'flex-start',minHeight:100,flex:1}}>
                    <Text style={{fontSize:18,fontWeight:'300',marginTop:100}}>
                        No Ongoing Games
                    </Text>
                </View>
            );
        }
    }
};

const styles = {
    gameslist: {
        backgroundColor:'#4092ED',
        borderWidth:1,
        borderColor:'black',
        flexDirection:'row',
        height:100
    },
    leftContainer:{
        flexDirection:'column',
        flex:1,
        marginLeft:15,
        justifyContent:'center',
        alignItems:'flex-start',
        
    },
    rightContainer:{
        flexDirection:'column',
        alignItems:'flex-end',
        justifyContent:'center',
        flex:1
    },
    userNameOfOtherPlayer:{
        fontSize:23,
        fontWeight:'bold',
        color:'white',
        backgroundColor:'transparent'
    },
    lastMovePlayed:{
        fontSize:10,
        fontWeight:'400',
        color:'white',
        backgroundColor:'transparent'
    },
};

export default OngoingGames;