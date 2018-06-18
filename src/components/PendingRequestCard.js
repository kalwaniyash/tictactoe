import React, { Component } from 'react';
import {View,Text,ScrollView,Button, FlatList, TouchableHighlight,TouchableOpacity} from 'react-native';

import firebase, {database} from './firebase';

import {StatusOnline,StatusOffline} from './Status';
import {acceptPendingRequest,declinePendingRequest} from './PendingStatus';
import FadeInView from './FadeInView';
import Spinner from './Spinner';


class PendingRequestCard extends Component {
    
    state={status:'',acceptDeclineButtonState:false}

    componentWillReceiveProps(nextProps) {
        console.log('nextProps',nextProps);
        this.fetchDataFromFirebase();
    }
    
    componentWillMount() {
        console.log('cwm props',this.props);
        this.fetchDataFromFirebase();
    }

    fetchDataFromFirebase() {
        database.child('status/'+this.props.otherPersonsUid+'/currentStatus').on('value', (snapshot) => {
            this.setState({ status:snapshot.val() });
        });
    }

    render() {
        return(
            <TouchableOpacity onLongPress={ () => {this.setState({acceptDeclineButtonState : !this.state.acceptDeclineButtonState});console.log('buttton value',this.state.acceptDeclineButtonState)} }>
            <View style={styles.cardContainer}>
                <View style={{position:'absolute',top:4,right:8}}>
                    <Text style={{fontSize:10}}>
                        X
                    </Text>
                </View>
                
                {/* image */}
                <View>
                    <View style={{width:75,height:75,borderRadius:100,backgroundColor:'#B4B4B4'}}/>
                </View>
                
                {/* status */}
                <View style={{position:'absolute',right:29,top:63,borderWidth:2,borderColor:'white',borderRadius:100}}>
                    <RenderStatus status={this.state.status} />
                </View>
                
                
                <ToggleContent 
                acceptDeclineButtonState={this.state.acceptDeclineButtonState} 
                otherPersonsUid={this.props.otherPersonsUid}
                gameId = {this.props.pendingRequestPreviewData.gameId}
                reqReceivedTS={this.props.pendingRequestPreviewData.reqReceivedTS}
                />
                
                {/* Username */}
                {/* <View style={{marginTop:10}}>
                    <Text style={styles.nameText}>
                        <RenderUserName otherPersonsUid={this.props.otherPersonsUid} />
                    </Text>
                </View> */}
                
                {/* Timestamp */}
                {/* <View style={styles.descriptionContainer}>
                    <Text style={{fontSize:12,alignItems:'center',textAlign:'center'}}>
                        Request received <RenderTS ts={this.props.pendingRequestPreviewData.reqReceivedTS} /> ago
                    </Text>
                </View> */}

                
                {/* <View style={{flexDirection:'row',alignSelf:'center',marginTop:10}}>
                    
                    <TouchableHighlight onPress={ () => acceptPendingRequest(this.props.pendingRequestPreviewData.gameId,this.props.otherPersonsUid) }>
                        <View style={styles.acceptButton} />
                    </TouchableHighlight>
                    
                    
                    <TouchableHighlight onPress={ () => declinePendingRequest(this.props.otherPersonsUid,null) }>
                        <View style={styles.declineButton} />    
                    </TouchableHighlight>
                </View> */}
            </View>
            </TouchableOpacity>
        );
    }
}

const ToggleContent = ({acceptDeclineButtonState,otherPersonsUid,gameId,reqReceivedTS}) => {
    console.log('in toogleContent function',acceptDeclineButtonState,otherPersonsUid);
    if(acceptDeclineButtonState) {
        console.log('inside if')
        return (
            <View style={{flexDirection:'row',alignSelf:'center',marginTop:10}}>
                {/* Accept button */}
                <TouchableHighlight onPress={ () => acceptPendingRequest(gameId,otherPersonsUid) }>
                    <View style={styles.acceptButton} />
                </TouchableHighlight>

                {/* Decline button */}
                <TouchableHighlight onPress={ () => declinePendingRequest(otherPersonsUid,null) }>
                    <View style={styles.declineButton} />    
                </TouchableHighlight>
            
            </View>
            );
    } else {
        console.log('inside else')
        return (
            <View>
                {/* Username */}
                <View style={{marginTop:10}}>
                    <Text style={styles.nameText}>
                        {/* <RenderUserName otherPersonsUid={this.props.otherPersonsUid} /> */}
                        <RenderUserName otherPersonsUid={otherPersonsUid}/>
                    </Text>
                </View>
                
                {/* Timestamp */}
                <View style={styles.descriptionContainer}>
                    <Text style={{fontSize:12,alignItems:'center',textAlign:'center'}}>
                        Request received <RenderTS ts={reqReceivedTS} /> ago
                    </Text>
                </View>
            </View>
        );
    }
}

const RenderTS = ({ts}) => {
    // difference = Math.floor(Date.now()/1000) - Math.floor(ts/1000);
    timeNow = Math.floor(Date.now()/1000);
    console.log('timeNow',timeNow);
    timeThen = Math.floor(ts/1000);
    console.log('timeThen',timeThen);
    difference = timeNow - timeThen;
    console.log('pending request preview time difference',difference);
    //  less than 60 secs
    if(difference < 60 ) {
        return <Text>{difference} secs</Text>
    } else if (difference >= 60 && difference < 3600) {
        console.log(difference);
        let mins = Math.floor(difference/60);
        return <Text>{mins} mins</Text>
    } else if (difference >= 3600) {
        let hours = Math.floor(difference/3600);
        return <Text>{hours} hrs </Text>
    }
};

const RenderStatus = ({status}) => {
    console.log('status',status);
    if(status === 'online') {
        return <StatusOnline />
    }
    else if(status === 'offline'){
        return <StatusOffline />
    } else {
        return <View />
    }
}

export class RenderUserName extends Component {
    
    state={userName:''}

    componentWillMount() {
        database.child('/userMetadata/'+this.props.otherPersonsUid+'/userName').once('value').then((snapshot)=>{
            console.log('userName in card',snapshot.val());
            this.setState({userName:snapshot.val()});
        });
    }

    render() {
        return(
            <Text> {this.state.userName} </Text>
        );
    }
}

const styles = {
    acceptButton:{
        width:40,
        height:40,
        borderRadius:100,
        backgroundColor:'#48C199',
        marginRight:15
    },
    declineButton:{
        width:40,
        height:40,
        borderRadius:100,
        backgroundColor:'#ED5D54',
    },
    status:{
        marginLeft:4,
        width:6,
        height:6,
        borderRadius:100,
        backgroundColor:'#3AD973'
    },
    nameText:{
        fontSize:14,
        fontWeight:'600',
    },
    descriptionContainer:{
        marginTop:4,
    },
    cardContainer: {
        // maxWidth:150,
        width:120,
        backgroundColor:'white',
        paddingHorizontal:10,
        paddingTop:5,
        paddingBottom:2,
        alignItems:'center',
        marginRight:8,
        marginVertical:8,
        borderRadius:5
    },
    scrollViewStyle:{
        marginLeft:15,
        paddingVertical:17,
        marginRight:10
    },
    mainContainer: {
        // backgroundColor:'#F4F4F4',
        paddingHorizontal: 10,
        minHeight: 260,
    },
    headingContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:6,
        // paddingHorizontal:10,
    },
    seeAllText:{
        color:'#3A98F0',
        fontSize:16,
        fontWeight:'300'
    },
    pendingRequestText:{
        fontSize:15,
        fontWeight:'600'
    }
}

export default PendingRequestCard;