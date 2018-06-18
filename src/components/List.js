import React, { Component } from 'react';
import {View,Text} from 'react-native';

import PendingStatus from './PendingStatus';
import OngoingStatus from './OngoingStatus';
import firebase, { database } from './firebase';

class List extends Component {
    
    // gameData structure {gameDataId,gameStatus,nextMove,ts,uid}
    state={userName:'',status:'',gameData:{},data:[],gameStatus:'',nextMove:''};

    renderRightContainerContent(status) {
        console.log('renderRightContainerContent');
        if(status === 'pending') {
            console.log('pending')
            return <PendingStatus 
            redirect={this.props.redirect}      //passing this.navigation.navigate
            gameDataId={this.state.gameData.gameDataId}
            gameId={this.props.data.gameId}
            otherPlayersUid={this.props.data.uid}
            userNameOfOtherPlayer = {this.state.userName}
            />
        } else if(status === 'ongoing') {
            console.log('ongoing')
            // this uid is of the player who has previously played the move
            console.log(this.props.data.gameId)

            return <OngoingStatus
                redirect={this.props.redirect}      //passing this.navigation.navigate
                nextMove={this.state.nextMove}   //uid of the person who has to play the next move
                gameDataId={this.state.gameData.gameDataId}  //gameDataId to be passed from one page to another
                gameId= {this.props.data.gameId}
                otherPlayersUid={this.props.data.uid}   //uid of the other player
                userNameOfOtherPlayer = {this.state.userName}
                />
        }
    }


    componentWillMount() {
        console.log('Component did mount inside list');
        let dummy = [];
        
        // userName of ther person i am playing the game with
        database.child('userMetadata/'+this.props.data.uid).once('value').then((snapshot)=>{
            console.log(snapshot.val().userName);
            this.setState({ userName:snapshot.val().userName });
        }).catch(err => console.log(err));

        database.child('status/'+this.props.data.uid).on('value', (snapshot) => {
            console.log(snapshot.val());
            this.setState({ status:snapshot.val() });         
        });

        // gameData of that game
        console.log(this.props.data);
        database.child('games/'+this.props.data.gameId).once('value').then((snapshot)=>{
            console.log( snapshot.val() );
            this.setState({ gameData:snapshot.val() });
            console.log(this.state.gameData);
        }).catch(err => console.log(err));
        
        database.child('games/'+this.props.data.gameId+'/gameStatus').on('value',(snapshot) => {
            console.log(snapshot.val());
            this.setState({gameStatus:snapshot.val()});
            console.log(snapshot.val());
            // this.renderRightContainerContent(this.state.gameStatus);
        });

        database.child('games/'+this.props.data.gameId+'/nextMove').on('value',(snapshot) => {
            console.log(snapshot.val());
            this.setState({nextMove:snapshot.val()});
            this.renderRightContainerContent(this.state.gameStatus,this.state.nextMove);
        });
    }

    renderTS(ts) {
        ts = ts/1000;
        let currentTS = Date.now()/1000;
        let differenceInTS = Math.round(currentTS - ts);
        console.log(differenceInTS);
        if(differenceInTS < 60) {   //checks if difference in seconds is less than 60
            return <Text style={styles.lastMovePlayed}>Last move played {differenceInTS} seconds ago</Text>
        } else if(differenceInTS >= 60 && differenceInTS < 3600) {   //if it is greater than 60 seconds and less than 3600 seconds i.e an hour
            return <Text style={styles.lastMovePlayed}>Last move played {differenceInTS/60} mins ago</Text>;
        } else if(differenceInTS >= 3600 && differenceInTS < 86400) {
            return <Text style={styles.lastMovePlayed}>Last move played {differenceInTS/3600} hours ago</Text>;
        } else {
            return <Text style={styles.lastMovePlayed}>Last move played more than 1 day ago</Text>;
        }
    }

    renderStatus(status) {
        console.log(status);
        if(status === 'online') {
            return <View style={styles.statusOnline} />
        } 
        else if(status === 'offline'){
            return <View style={styles.statusOffline} />
        }
    }
    
    render() {
        return(
            <View style={styles.gameslist}>
                <View style={styles.leftContainer}>
                    <View style={{marginBottom:4,flexDirection:'row'}}>
                        <Text style={styles.username}>{ this.state.userName }</Text>
                        {this.renderStatus(this.state.status)}
                    </View>
                    <View>
                        {/* <Text style={styles.lastMovePlayed}>Last move played {this.renderTS(this.state.gameData.ts)} mins ago</Text> */}
                        {this.renderTS()}
                    </View>
                </View>
                <View style={styles.rightContainer}>
                    { this.renderRightContainerContent(this.state.gameStatus) }
                </View>
            </View>
        );
    }
}

// const renderTS = (ts) => {
//         let currentTS = Date.now();
//         finalTS = currentTS - ts;
//     return <Text style={styles.lastMovePlayed}>Last move played {finalTS} mins ago</Text>
// };

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
        backgroundColor:'#63A3EA',
        borderWidth:0.8,
        flexDirection:'row',
        // paddingTop:14,
        // paddingBottom:14,
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
    statusOnline: {
        width:10,
        height:10,
        borderRadius:100,
        backgroundColor:'#7CE84F',
        alignSelf:'center',
        marginLeft:8
    },
    statusOffline: {
        width:10,
        height:10,
        borderRadius:100,
        backgroundColor:'#F0B228',
        alignSelf:'center',
        marginLeft:8
    },
};

export default List;