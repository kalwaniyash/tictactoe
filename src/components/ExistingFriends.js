import React, { Component } from 'react';
import {View,Text, AppState, Alert} from 'react-native';

import Button from './Button';
import firebase, { database } from './firebase';

import SendGameRequest from './SendGameRequest';
import {StatusOnline,StatusOffline} from './Status';

class ExistingFriends extends Component {

    state = {userName:'',status:'',ts:'',rightContainerText:'',reqSend:null}
    myUid = firebase.auth().currentUser.uid;

    componentWillMount() {
        // if the uid is my uid then don't show
        console.log('uid',this.props.otherPersonsUid);
        database.child('/userMetadata/'+this.props.otherPersonsUid).once('value').then((snapshot)=>{
            console.log(snapshot.val().userName);
            this.setState({ userName:snapshot.val().userName });
        }).catch( err => console.log(err) );

        database.child('status/'+this.props.otherPersonsUid).on('value', (snapshot) => {
            // snapshot.val() contains currentStatus online/offline and ts of the write
            this.setState({ status : snapshot.val().currentStatus });
            this.setState({ ts: snapshot.val().ts });
        });

        database.child('requestSend/'+this.myUid+'/'+this.props.otherPersonsUid).on('value', (snapshot) => {
            if( snapshot.exists() ) {
                this.setState({rightContainerText:'Request Send'},()=>{console.log(this.state.rightContainerText)});
                // this.setState({reqSend:true});
                // console.log('reqSend state',this.state.reqSend);
            }
            // else {
                // this.setState({reqSend:false});
                // console.log('reqSend state',this.state.reqSend);
            // }
        });

        database.child('pendingRequest/'+this.myUid+'/'+this.props.otherPersonsUid).once('value').then((snapshot) => {
            console.log(snapshot.exists())
            if(snapshot.exists()) {
                this.setState({rightContainerText:'Request Pending'},()=>{console.log(this.state.rightContainerText)});
            }
        })

    }

    renderStatus(status) {
        // console.log(status);
        if(status === 'online') {
            return <StatusOnline />
        }
        else if(status === 'offline'){
            return <StatusOffline />
        }
    }

    renderTS(ts) {
        if(this.state.status === 'offline'){
            difference = Math.floor(Date.now()/1000) - Math.floor(ts/1000);
            if(difference < 60 ) {
                console.log(difference);
                return <Text style={styles.lastMovePlayed}>Last online {difference} secs ago</Text>
            } else if (difference >= 60) {
                console.log(difference);
                let mins = Math.floor(difference/60);
                return <Text style={styles.lastMovePlayed}>Last online {mins} mins ago</Text>
            } else {
                console.log(typeof(difference));
            }
        }        
    }

    renderRightContainerButton(rightContainerText) {
        console.log(rightContainerText);
        if(rightContainerText !== '') {
            return(

                <Text style={{ color:'white',fontSize:16,paddingHorizontal:10,paddingVertical:10 }}>
                    {rightContainerText}
                </Text>
            );
        } else {
            return(
                <Button
                    onPress={() => SendGameRequest(this.props.otherPersonsUid,this.state.userName) }
                    buttonContainer={styles.buttonContainer} 
                    buttonStyle={styles.buttonStyle} 
                    buttonContent='PLAY'
                />
            );
        }
    }
    
    render() {
        return(
            <View style={styles.gameslist}>
                <View style={styles.leftContainer}>
                    <View style={{marginBottom:4,flexDirection:'row'}}>
                        <Text style={styles.username}>{this.state.userName}</Text>
                        {this.renderStatus(this.state.status)}
                    </View>
                    <View>
                        <Text style={styles.lastActive}>{this.renderTS(this.state.ts)}</Text>
                    </View>
                </View>
                <View style={styles.rightContainer}>
                    {
                        this.renderRightContainerButton(this.state.rightContainerText)
                    }
                </View>
            </View>
        );
    }
}

const styles = {
    reqSendButtonContainer:{
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#7CE84F',
        borderRadius:20,
        borderWidth:0.7,
        paddingHorizontal:20 
    },
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
        paddingHorizontal:20 
    },
    gameslist: {
        backgroundColor:'#63A3EA',
        borderColor:'#035FC4',
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
        fontWeight:'bold',
        color:'white',
    },
    lastActive:{
        fontSize:12,
        fontWeight:'400',
        color:'white',
    },
};

export default ExistingFriends;