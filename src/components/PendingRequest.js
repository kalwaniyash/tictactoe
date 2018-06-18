import React, { Component } from 'react';
import { View, Text, FlatList} from 'react-native';

import firebase,{ database } from './firebase';

import PendingReq from './PendingReq';
import Spinner from './Spinner';
import PendingStatus from './PendingStatus';

import {RenderUserName} from './PendingRequestPreview';

export default class PendingRequest extends Component {
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Pending Requests',
            headerStyle: {backgroundColor: '#63A3EA'},
            headerTitleStyle: { color: 'white' },
            headerBackTitleStyle: {color:'white'},
        }
    };

    state = { showSpinner : true }

    componentWillMount() {
        let myUid = firebase.auth().currentUser.uid;
        // structure of snapshot over here is  { uid: true }
        database.child('pendingRequest/'+myUid).on('value',(snapshot)=>{
            pendingRequestData = [];
            for(let key in snapshot.val()){
                
                singleObject = {};
                singleObject.otherPersonsUid = key;
                singleObject.gameId = snapshot.val()[key].gameId;
                singleObject.reqReceivedTS = snapshot.val()[key].reqReceivedTS;
                
                console.log('singlePendingRequest',singleObject);
                pendingRequestData.push(singleObject);
            }
            console.log('pendingRequestData',pendingRequestData);
            this.setState({ pendingRequestData : pendingRequestData, showSpinner:false});
        });
    }

    render() {
    return (
        <View style={{ flex:1 }}>
            { this.showSpinner(this.state.showSpinner) }
        </View>
    );
  }

  showSpinner(showSpinner) {
    if(showSpinner) {
        return(
            <View>
                <Spinner />
            </View>
        );
    } else  {
        console.log(this.state.pendingRequestData);
        return(
            <View style={{flex:1}}>
                { this.showPendingRequests(this.state.pendingRequestData) }
            </View>
        );
    }
  }

  showPendingRequests(pendingRequestData) {
    console.log(pendingRequestData);
    return(
        <View style={styles.container}>
            <FlatList
            data={pendingRequestData}
            renderItem={({item}) => <RenderSinglePendingRequest data = {item} navigation={this.props.navigation} /> }
            keyExtractor={ (item) => item.otherPersonsUid }
            />
        </View>
      );
  }
};

class RenderSinglePendingRequest extends Component {
    
    componentWillMount() {
    }

    renderTs(ts) {
        difference = Math.floor(Date.now()/1000) - Math.floor(ts/1000);

        if(difference < 60 ) {
            return <Text style={styles.lastMovePlayed}>Request recieved more than {difference} secs ago</Text>
        } else if (difference >= 60) {
            console.log(difference);
            let mins = Math.floor(difference/60);
            return <Text style={styles.lastMovePlayed}>Request recieved more than {mins} mins ago</Text>
        }
    }

    render() {
        const {otherPersonsUid,reqReceivedTS,gameId} = this.props.data
    
        return(
            <View style={styles.gameslist}>
                <View style={styles.leftContainer}>
                    <View style={{marginBottom:4,flexDirection:'row'}}>
                        <Text style={styles.username}>
                            <RenderUserName otherPersonsUid={otherPersonsUid} />
                        </Text>
                    </View>
                    <View>
                        {this.renderTs(reqReceivedTS)}
                    </View>
                </View>
                <View style={styles.rightContainer}>
                    <PendingStatus
                    gameId={gameId}
                    otherPersonsUid={otherPersonsUid}
                    redirect={this.props.navigation}
                    userNameOfOtherPlayer={'Yash'}
                    />
                </View>
            </View>
        );
    };
};

const styles = {
    container: {
     flex: 1,
     paddingTop: 22
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
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
        backgroundColor:'transparent',
    },
    rightContainer:{
        flexDirection:'column',
        alignItems:'flex-end',
        justifyContent:'center',
        flex:1
    },
    username:{
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
