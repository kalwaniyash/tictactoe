import React, { Component } from 'react';

import {View,Text} from 'react-native';
import Button from './Button';
import firebase, { database } from './firebase';

import PlayingArea from './PlayingArea';

class OngoingStatus extends Component {

    state={userNameOfOtherPlayer:'',buttonContent:''}

    myUid = firebase.auth().currentUser.uid;

    componentWillMount() {
        console.log('componentWillMount props',this.props);
        this.turn(this.props);
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps props', nextProps);
        this.turn(nextProps);
    }

    turn(props) {
        let userNameOfOtherPlayer = props.userNameOfOtherPlayer,uidOfOtherPlayer = props.uidOfOtherPlayer;

        console.log('props in turn',props);

        if(props.nextMove === this.myUid) {
            this.setState({buttonContent:'Your turn!'}, () => console.log('YOUR TURN') );
        } else if(props.nextMove === uidOfOtherPlayer){
            this.setState({buttonContent : 'Opponent\'s turn'},() => console.log('uidOfOtherPlayer',uidOfOtherPlayer) );
        }
        
        if(props.giveUp === firebase.auth().currentUser.uid) {
            this.setState({buttonContent:'You gave up'}, () => console.log('You gave up') );
        } else if(props.giveUp === uidOfOtherPlayer) {
            this.setState({buttonContent: 'Opponent gave up'},() => console.log('Opponent gave up') );
        }
        
        if(props.gameWon == this.myUid) {
            this.setState({buttonContent:'You won'}, () => console.log('You won') );
        } else if(props.gameWon == uidOfOtherPlayer) {
            this.setState({buttonContent:'Opponent won'}, () => console.log('Opponent won') );
        }
        
        if(props.gameDraw === 'gameDraw'){
            console.log('props.gameDraw',props.gameDraw);
            this.setState({buttonContent:'Game Draw'}, () => console.log('Game draw') );
        }
    }

    render() {
        return(
            <View style={{backgroundColor:'#0775FF',flex:1,position:'absolute',top:10,right:25,alignContent:'center',justifyContent:'center',paddingHorizontal:8,paddingVertical:4,borderRadius:5,zIndex:10}} >
                <Text style={{color:'white'}} >
                    {this.state.buttonContent}
                </Text >
            </View>
        );
    }
}

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
        backgroundColor:'white',
        borderRadius:20,
        borderWidth:0.7,
    },
};

export default OngoingStatus;