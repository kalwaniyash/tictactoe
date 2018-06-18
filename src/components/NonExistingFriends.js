import React, { Component } from 'react';
import {View,Text} from 'react-native';

import Button from './Button';

class NonExistingFriends extends Component {
    render() {
        return(
            <View style={styles.gameslist}>
                <View style={styles.leftContainer}>
                    <View style={{marginBottom:4,flexDirection:'row'}}>
                        <Text style={styles.username}>User</Text>
                        <View style={styles.status} />
                    </View>
                    <View>
                        <Text style={styles.lastMovePlayed}>7710020100</Text>
                    </View>
                </View>
                <View style={styles.rightContainer}>
                    <Button 
                    onPress={() => this.sendGameRequest('mzcT1UqZ2BTMIj9AgMcB1mehoCr2')} 
                    buttonContainer={styles.buttonContainer} 
                    buttonStyle={styles.buttonStyle} 
                    buttonContent='Invite' 
                    />
                </View>
            </View>
        );
    }
};

const styles = {
    buttonStyle:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'transparent',
    },
    buttonContainer:{
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#B0B0B0',
        borderRadius:20,
        borderWidth:0.7,
    },
    acceptButtonContainer: {
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#B0B0B0',
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
        backgroundColor:'#EEBABA',
        borderRadius:20,
        borderWidth:0.7,
    },
    declineButtton:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'transparent',
    },
    gameslist: {
        backgroundColor:'#D8D8D8',
        borderColor:'#979797',
        borderWidth:0.5,
        flexDirection:'row',
        paddingTop:14,
        paddingBottom:14,
        height:100
    },
    leftContainer:{
        flexDirection:'column',
        flex:1,
        marginLeft:15,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    rightContainer:{
        flexDirection:'column',
        alignItems:'flex-end',
        justifyContent:'center',
        flex:1
    },
    username:{
        fontSize:23,
        fontWeight:'bold'
    },
    lastMovePlayed:{
        fontSize:10,
        fontWeight:'400',
    },
    status: {
        width:10,
        height:10,
        borderRadius:100,
        backgroundColor:'#F0B228',
        alignSelf:'center',
        marginLeft:8
    },
    confimationContainer: {
        flexDirection:'row'
    }
};

export default NonExistingFriends;