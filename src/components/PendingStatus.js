import React from 'react';

import {View, Alert} from 'react-native';
import Button from './Button';
import firebase, { database } from './firebase';

import PlayingArea from './PlayingArea';

const PendingStatus = ({gameId,redirect,otherPersonsUid,userNameOfOtherPlayer}) => {
    console.log('gameId',gameId);
    return(
        <View style={styles.confimationContainer}>
            
            <Button 
            onPress={ ()=>{this.acceptPendingRequest(gameId,otherPersonsUid)} } 
            buttonContainer={styles.acceptButtonContainer} 
            buttonStyle={styles.acceptButton} 
            buttonContent='Accept'
            />
            
            <Button 
            onPress={ ()=>{this.declinePendingRequest(otherPersonsUid,userNameOfOtherPlayer)} } 
            buttonContainer={styles.declineButtonContainer} 
            buttonStyle={styles.declineButtton} 
            buttonContent='X'
            />
        
        </View>
    );
};

export const acceptPendingRequest = (gameId,otherPersonsUid) => {
    let myUid = firebase.auth().currentUser.uid;
    
    // sets the game as ongoing in both the user uids
    database.child('/ongoingGames/'+otherPersonsUid+'/'+myUid).set(gameId);
    database.child('/ongoingGames/'+myUid+'/'+otherPersonsUid).set(gameId);

    gameMovesId = database.push().key;
    
    database.child('gameMetadata/'+gameId).set({
        gameMovesId:gameMovesId,
        nextMove:myUid,
        lastMoveTS:'0',
        startedAt:Date.now(),
        gameWon:false,
        giveUp:'0',
        gameDraw:'0',
    });
    
    database.child('gameMetadata/'+gameId+'/'+otherPersonsUid).set('0');
    database.child('gameMetadata/'+gameId+'/'+myUid).set('X');

    database.child('pendingRequest/'+myUid+'/'+otherPersonsUid).remove( () => console.log('removed') );
    database.child('requestSend/'+otherPersonsUid+'/'+myUid).remove( () => console.log('removed') );
}

export const declinePendingRequest = (otherPersonsUid,userNameOfOtherPlayer) => {
    if(userNameOfOtherPlayer == null) {
        message = 'Are you sure you want to decline request?'
    } else {
        message = 'Are you sure you want to decline '+ userNameOfOtherPlayer +'\'s game Request?'
    }
    Alert.alert(
        'Delete Request?',
        message,
        [
            {text:'Yes', onPress: ()=> this.deleteRequest(otherPersonsUid) },
            {text:'No', onPress: ()=> {} ,style: 'cancel' }
        ],
        {cancelable:false}
    );
};

deleteRequest = (otherPersonsUid) => {
    let myUid = firebase.auth().currentUser.uid;
    database.child('pendingRequest/'+myUid+'/'+otherPersonsUid).remove( () => console.log('removed') );
    database.child('requestSend/'+otherPersonsUid+'/'+myUid).remove( () => console.log('removed') );
};

const styles = {
    confimationContainer: {
        flexDirection:'row'
    },
    acceptButtonContainer: {
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        borderRadius:20,
        borderWidth:0.7,
    },
    acceptButton: {
        paddingLeft:27,
        paddingRight:27,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'transparent',
        fontSize:14
    },
    declineButtonContainer: {
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        borderRadius:20,
        borderWidth:0.7,
    },
    declineButtton:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'transparent',
    }
};

export default PendingStatus;