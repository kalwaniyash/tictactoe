import React, { Component } from 'react';
import {View,Text} from 'react-native';
import firebase, { database } from './firebase';
import PendingStatus from './PendingStatus';

import {RenderUserName} from './PendingRequestPreview';
import Spinner from './Spinner';

class PendingReq extends Component {
    
    state ={ pendingRequestData:{},userName:'',ts:'',showSpinner:true };

    componentWillMount() {
        let myUid = firebase.auth().currentUser.uid;
        console.log(myUid);
        database.child('pendingRequest/'+myUid).on('value',(snapshot)=>{
            console.log(snapshot.val());
            this.setState({pendingRequestData:snapshot.val()});
            this.setState({ showSpinner : false });
        });
    }

    renderPendingRequest(pendingRequestData) {
        temp = [];
        for(let key in pendingRequestData) {
            singleComponentData = {};
            
            singleComponentData.otherPersonsUid = key;
            singleComponentData.dataOfRequestSend = pendingRequestData[key];
            
            temp.push(singleComponentData);
        }
        console.log('All games in an array',temp);
        return(
                <View>
                {
                temp.map((data) =>
                (
                    console.log(data),
                    <RenderSingleComponent 
                        otherPersonsUid={data.otherPersonsUid}
                        dataOfRequestSend={data.dataOfRequestSend}
                    />
                ))
                }
                </View>
        );
    }

    showSpinner(showSpinner){
        if(showSpinner){
            return(
                <View>
                    <Spinner />
                </View>
            );
        } else {
            return(
                <View>
                    { this.renderPendingRequest(this.state.pendingRequestData) }
                </View>
            );
        }
    }

    render() {
        return(
            <View style={{flex:1}}>
                { this.showSpinner(this.state.showSpinner) }
            </View>
        );
    }
};

class RenderSingleComponent extends Component {
    state={userName:'',ts:''}

    componentWillMount() {
        console.log('otherPersonsUid',this.props.otherPersonsUid);
        // database.child('/userMetadata/'+this.props.otherPersonsUid+'/userName').once('value').then((snapshot)=>{
        //     console.log(snapshot.val());
        //     this.setState({userName:snapshot.val()});
        //     this.setState({ ts:this.props.dataOfRequestSend.reqReceivedTS });
        // });
        this.setState({ ts:this.props.dataOfRequestSend.reqReceivedTS });
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
        return(
            <View style={styles.gameslist}>
                <View style={styles.leftContainer}>
                    <View style={{marginBottom:4,flexDirection:'row'}}>
                        {/* <Text style={styles.username}>{this.state.userName}</Text> */}
                        <Text style={styles.username}><RenderUserName otherPersonsUid={this.props.otherPersonsUid} /></Text>
                    </View>
                    <View>
                        {/* <Text>{this.state.ts}</Text> */}
                        {this.renderTs()}
                    </View>
                </View>
                <View style={styles.rightContainer}>
                    <PendingStatus 
                    gameId={this.props.dataOfRequestSend.gameId}
                    otherPersonsUid={this.props.otherPersonsUid}
                    userNameOfOtherPlayer={this.state.userName}
                    />
                </View>
            </View>
        );
    }
}

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

export default PendingReq;