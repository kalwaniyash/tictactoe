import React, { Component } from 'react';
import {View,Text, ScrollView, FlatList,TouchableHighlight} from 'react-native';
import firebase, { database } from './firebase';
import {StatusOnline,StatusOffline} from './Status';
import OngoingStatus from './OngoingStatus';
import FadeInView from '../animations/FadeInView';
import Spinner from './Spinner';


class RenderSingleOngoingGame extends Component {
    state={
        status:'',
        userNameOfOtherPlayer:'',
        gameMetaData:{},
        nextMove:'',
        gameWon:false,
        gameDraw:'',
        giveUp:'',
        lastMoveTS:'',
        gameMovesId:''
    };
    gameMovesId = '';
    
    // check if the previous props are different from nextProps then only change state
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps',nextProps);
        this.fetchSingleOngoingGameData(nextProps);
    }

    componentWillMount() {
        this.fetchSingleOngoingGameData(this.props);
    }

    componentWillUnmount() {
        this.removeFirebaseListeners(this.props);
    }

    removeFirebaseListeners(props) {
        database.child('status/'+props.uidOfOtherPlayer).off();
        database.child('gameMetadata/'+props.gameId+'/lastMoveTS').off();
        database.child('gameMetadata/'+props.gameId+'/nextMove').off();
        database.child('gameMetadata/'+props.gameId+'/gameDraw').off();
        database.child('gameMetadata/'+props.gameId+'/gameWon').off();
        console.log('firebase listener removed');
    }
    

    fetchSingleOngoingGameData(props) {
        const myUid = firebase.auth().currentUser.uid;
        console.log('props in fetchSingleOngoingGameData', props);
        // make a dummy object and store all the setStates here and then set the state to the object

        database.child('userMetadata/'+props.uidOfOtherPlayer).once('value').then((snapshot)=>{
            this.setState({ userNameOfOtherPlayer:snapshot.val().userName });
        }).catch(err => console.log(err));

        database.child('status/'+props.uidOfOtherPlayer).on('value', (snapshot) => {
            this.setState({ status:snapshot.val().currentStatus });
        });
        
        database.child('gameMetadata/'+props.gameId).once('value').then((snapshot)=>{
            // no need to save all of this in state. Save in normal local variables
            console.log('gameMetaData',snapshot.val());
            this.setState({ gameMetaData:snapshot.val(),gameMovesId:snapshot.val().gameMovesId })
        }).catch(err => console.log(err));

        database.child('gameMetadata/'+props.gameId+'/lastMoveTS').on('value',(snapshot)=>{
            this.setState({ lastMoveTS:snapshot.val() }, ()=> console.log('this.state.lastMoveTS',this.state.lastMoveTS) );
        });

        database.child('gameMetadata/'+props.gameId+'/nextMove').on('value',(snapshot) => {
            this.setState({nextMove:snapshot.val()}, () => console.log('this.state.nextMove',this.state.nextMove) );
        });

        database.child('gameMetadata/'+props.gameId+'/gameDraw').on('value',(snapshot) => {
            this.setState({gameDraw:snapshot.val()},() => console.log('this.state.gameDraw',this.state.gameDraw) );
        });

        database.child('gameMetadata/'+props.gameId+'/giveUp').on('value',(snapshot) => {
            this.setState({giveUp:snapshot.val()}, () => console.log('this.state.giveUp', this.state.giveUp ));
        });

        database.child('gameMetadata/'+props.gameId+'/gameWon').on('value',(snapshot) => {
            this.setState({gameWon:snapshot.val()},() => console.log('this.state.gameWon',this.state.gameWon) );
        });
    }

    renderStatus(status) {
        if(status === 'online') {
            return <StatusOnline />
        }
        else if(status === 'offline'){
            return <StatusOffline />
        }
    }

    renderTS(lastMoveTS) {
        if(lastMoveTS == 0) {
            return <Text>First move not played yet</Text>
        }

        difference = Math.floor(Date.now()/1000) - Math.floor(lastMoveTS/1000);

        if(difference < 60 ) {
            return <Text>Last move more than {difference} secs ago</Text>
        } else if (difference >= 60) {
            let mins = Math.floor(difference/60);
            return <Text>Last move more than {mins} mins ago</Text>
        } else {
            return <View />
        }
    }

    showPreviewOfGame() {
        console.log('Long pressed on game');
    }

    render() {
        return(
            <View>
                <TouchableHighlight onPress={() =>  this.props.navigation.navigate('PlayingArea',{   //passing this as object to the playinArea page
                                    gameMovesId: this.state.gameMovesId,
                                    gameId: this.props.gameId,
                                    otherPlayersUid: this.props.uidOfOtherPlayer,
                                    userNameOfOtherPlayer: this.state.userNameOfOtherPlayer,
                                    navigation: this.props.navigation,
                                    })}
                                    
                                    onLongPress={ () => this.showPreviewOfGame() } >
                <View style={styles.mainContainer}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <View style={{width:75,height:75,borderRadius:100,backgroundColor:'#B4B4B4'}}/>
                        </View>
                        <View style={{flex:3,paddingLeft:10}}>
                            <View style={{marginTop:10}}>
                                <Text style={{fontSize:20,fontWeight:'600'}}>
                                    { this.state.userNameOfOtherPlayer }
                                </Text>
                            </View>
                            <View style={{marginTop:3}}>
                                <Text>
                                    {this.renderTS(this.state.lastMoveTS)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                </TouchableHighlight>
                <OngoingStatus
                    nextMove={this.state.nextMove}
                    gameDraw = {this.state.gameDraw}
                    giveUp = {this.state.giveUp}
                    gameWon = {this.state.gameWon}
                    uidOfOtherPlayer = {this.props.uidOfOtherPlayer} />
            </View>
        );
    }
}

const styles = {
    mainContainer :{
        backgroundColor:'white',
        width:'95%',
        borderRadius:5,
        alignSelf:'center',
        shadowOffset:{ height:2 },
        shadowColor: '#000000',
        shadowOpacity: 0.14,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop:20,
        marginBottom:5,
        zIndex:1,
        position:'relative',
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


export default RenderSingleOngoingGame;