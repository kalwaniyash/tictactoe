import React from 'react';

import firebase, { database } from './firebase';
import { Alert } from 'react-native';

export default SendGameRequest = (otherPersonsUid,userName) => {
    // key generated over here is gameId
    const myUid = firebase.auth().currentUser.uid;
    checkIfRequestSend(myUid,otherPersonsUid);
    checkIfRequestIsPending(myUid,otherPersonsUid,userName);
};

const checkIfRequestIsPending = (myUid,otherPersonsUid,userName) => {
    database.child('pendingRequest/'+myUid+'/'+otherPersonsUid).once('value').then((snapshot)=> {
        if( snapshot.exists() ) {
            Alert.alert(
                'Request Pending',
                'A request from this user is already pending for you to accept',
                [
                    { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                ],
                { cancelable: false }
            );
        } else {
            const message = 'Challenge '+ userName +' to a game of XOX?'
            Alert.alert(
                'Send Request',
                message,
                [
                    { text: 'Yes', onPress: () => { makeChangesToDB(otherPersonsUid,myUid)} },
                    { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                ],
                { cancelable: false }
            );
        }
    }).catch( err =>  console.log(err) );  
};

const makeChangesToDB = (otherPersonsUid,myUid) => {
    database.child('/requestSend/'+myUid+'/'+otherPersonsUid).set(true);
    let gameId = database.push().key;
    database.child('/pendingRequest/'+otherPersonsUid+'/'+myUid).set({
        gameId:gameId,
        reqReceivedTS:Date.now(),
    });
};


const checkIfRequestSend = (myUid,otherPersonsUid) => {
    database.child('/requestSend/'+myUid+'/'+otherPersonsUid).once('value').then((snapshot)=>{
        if( snapshot.exists() ) {
            Alert.alert(
                'Request already send',
                'You have already send this user a request!',
                [
                    { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                ],
                { cancelable: false }
            );
        }
    }).catch( err => console.log(err) );
};


// export default SendGameRequest;