import React, { Component } from 'react';

import {View,Text,Button, Alert, Image} from 'react-native';

// import Button from './Button';
import CorrectButton from './CorrectButton';
import Box from './Box';
import firebase, { database } from './firebase';
import UserXOstate from './UserXOstate';
import GameHeader from './GameHeader';
import SendGameRequest from './SendGameRequest';

class PlayingArea extends Component {


    // content of this.props.navigation.state.params
    // const {gameMovesId,gameId,otherPlayersUid,myUid} = this.props.navigation.state.params;

    static navigationOptions = ({ navigation }) => {
        return {
            header : null,
        }
    };

    winningPermutations = [
        ['boxOne','boxTwo','boxThree'],
        ['boxFour','boxFive','boxSix'],
        ['boxSeven','boxEight','boxNine'],
        ['boxOne','boxFour','boxSeven'],
        ['boxTwo','boxFive','boxEight'],
        ['boxThree','boxSix','boxNine'],
        ['boxOne','boxFive','boxNine'],
        ['boxThree','boxFive','boxSeven'],
    ];

    state={
        boxOne:'',
        boxTwo:'',
        boxThree:'',
        boxFour:'',
        boxFive:'',
        boxSix:'',
        boxSeven:'',
        boxEight:'',
        boxNine:'',
        mySymbol:'',
        otherPlayersSymbol:'',
        giveUp:null,
        showGiveUpButton:true,
    }

    componentUnmounted = null;
    nextMove=null;
    gameMovesId='';
    gameId='';
    otherPlayersUid='';
    myUid='';
    gameDraw='';
    gameDataId = '';
    movePending = null;
    gameWon = null;
    moveCount = 0;  // if move count is 9 and game is not won then it is a draw

    renderBoxContent(boxNumber) {

        if(this.movePending) {
            this.makeMove(this.movePending,this.gameWon,boxNumber,this.gameId);
        } else {
            
            Alert.alert(
                            'Invalid move',
                            'It\'s not your turn to make a move. Please wait for your for turn',
                            [
                                {text: 'Ok', onPress: () => {}, style: 'cancel'},
                            ]
                        );
        }
    }

    makeMove(movePending,gameWon,boxNumber,gameId) {
        if(movePending && !gameWon) {
            // checks if box is empty
            if(this.state[boxNumber] === '') {
                database.child('moves/'+this.gameMovesId).push({
                    // use the timestamp provided by firebase instead of Date.now()
                    ts: Date.now(),
                    uid:this.myUid,
                    move:boxNumber
                });

                // do not use Date.now() over here use firebase timestamp
                database.child('gameMetadata/'+gameId+'/lastMoveTS').set(Date.now());
                database.child('gameMetadata/'+gameId+'/nextMove').set(this.otherPlayersUid);
            } else {
                Alert.alert(
                    'Invalid move',
                    'This box is already set. Please make some other move',
                    [
                        {text: 'Ok', onPress: () => {}, style: 'cancel'},
                    ]
                );
            }
        } else {
            // console.log('either not your move game is won');
        }
    }

    winningLogic(gameId,moveCount) {
        // console.log('Checking winning logic');
        let uidOfWinner = '';
        this.winningPermutations.forEach(element => {
            // console.log('element[0]',element[0],'symbol',this.state[element[0]]);
            // console.log('element[1]',element[1],'symbol',this.state[element[1]]);
            // console.log('element[2]',element[2],'symbol',this.state[element[2]]);
            // console.log(this.state[element[0]] === this.state[element[1]],this.state[element[1]] === this.state[element[2]],this.state[element[0]] !== '');
            if( this.state[element[0]] === this.state[element[1]] 
                    && this.state[element[1]] === this.state[element[2]]
                    && this.state[element[0]] !== ''
                ) {
                    // console.log('game won');
                    // console.log('gameWon check',this.state[element[0]] == this.state.mySymbol);
                    // console.log('gameWon check',this.state[element[0]] == this.state.otherPlayersSymbol);
                    if(this.state[element[0]] == this.state.mySymbol) {
                        // console.log('i won the game ',this.myUid);
                        uidOfWinner = this.myUid;
                        // console.log('uidOfWinner ',uidOfWinner);
                        this.gameWon = true
                        this.setState({showGiveUpButton:false}, () => console.log('showGiveUpButton is false') );
                    } else if(this.state[element[0]] == this.state.otherPlayersSymbol) {
                        // console.log('opponent won the game ',this.otherPlayersUid);
                        uidOfWinner = this.otherPlayersUid;
                        // console.log('uidOfWinner ',uidOfWinner);
                        this.gameWon = true
                        this.setState({showGiveUpButton:false},  () => console.log('showGiveUpButton is false') );
                    }
                    console.log('uidOfWinner',uidOfWinner,'gameid',gameId);
                    database.child('gameMetadata/'+ gameId +'/gameWon').set(uidOfWinner);
                    database.child('gameMetadata/'+ gameId +'/nextMove').set('0');
                    return;
                } else {
                    // console.log('Game not won');
                }
        });
        
        // only one time will this condition be true in the entire game
        // however since we are not using local data for moves this condition will be checked mutiple times even when its not necessary
        if(moveCount == 9 && !this.gameWon) {
            database.child('gameMetadata/'+ gameId +'/nextMove').set('0');
            database.child('gameMetadata/'+gameId+'/gameDraw').set('gameDraw');
            // this.setState({showGiveUpButton:false});
        }
    }

    

    componentWillMount() {
        // console.log('componentWillMount',this.props);
        this.otherPlayersUid = this.props.navigation.state.params.otherPlayersUid;
        this.userNameOfOtherPlayer = this.props.navigation.state.params.userNameOfOtherPlayer;
        this.gameId = this.props.navigation.state.params.gameId;
        this.gameMovesId = this.props.navigation.state.params.gameMovesId;
        // console.log('gameMovesId',this.gameMovesId);
        this.myUid = firebase.auth().currentUser.uid;
        
        this.componentUnmounted = true;
        
        this.setSymbolOfPlayers(this.gameId,this.gameMovesId,this.myUid);
        this.checkIfGivenUp(this.gameId);
        // use promise over here when the gamestarts the callback for this.giveUp will be in the next event loop and the value over here won't be updated
        if(!this.state.giveUp) {
            this.checkIfDraw(this.gameId,this.otherPlayersUid);
            if(!this.gameDraw) {
                this.checkIfMoveIsPending(this.gameId);
                this.checkIfGameWon(this.gameId);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log('nextProps',nextProps);
        this.gameMovesId = nextProps.gameMovesId;
    }

    componentWillUnmount() {
        // database.child('gameMetadata/'+this.gameId+'/giveUp').off();
        // database.child('gameMetadata/'+this.gameId+'/gameWon').off();
        // database.child('gameMetadata/'+this.gameId+'/gameDraw').off();
        this.componentUnmounted = false;
    }

    setSymbolOfPlayers(gameId,gameMovesId,myUid) {
        database.child('gameMetadata/'+gameId+'/'+myUid).once('value').then((snapshot) => {
            this.setState({ mySymbol:snapshot.val() });
            if(this.state.mySymbol == 'X') {
                this.setState({ otherPlayersSymbol:'0' });
            } else if(this.state.mySymbol == '0') {
                this.setState({ otherPlayersSymbol:'X' });
            }
            
            this.renderGameMoves(this.gameId,this.gameMovesId,this.myUid);
        });
    }

    checkIfDraw(gameId,otherPlayersUid) {
        database.child('gameMetadata/'+gameId+'/gameDraw').on('value', (snapshot) => {
            if( snapshot.val() == 'gameDraw') {
                this.gameDraw = true;
                this.setState({showGiveUpButton:false}, () => console.log('showGiveUpButton is false') );
                Alert.alert(
                    'Game Draw',
                    'This game has ended in a draw. Nobody won the game',
                    [
                        {text:'Ok', onPress: () => {}, style: 'cancel' }
                    ]
                );
            } else {
                this.gameDraw = false;
            }
            
        });
    }

    checkIfGivenUp(gameId) {
        database.child('gameMetadata/'+gameId+'/giveUp').on('value', (snapshot)=>{
            if(snapshot.val() === this.myUid) {
                this.setState({giveUp:true});
                this.setState({showGiveUpButton:false}, () => console.log('showGiveUpButton is false') );
                title = 'You gave up';
                Alert.alert(
                    title,
                    'Better luck next time.',
                    [
                        {text: 'Ok', onPress: () => {}, style: 'cancel'},
                    ]
                );
            } else if(snapshot.val() === this.otherPlayersUid) {
                this.setState({giveUp:true});
                this.setState({showGiveUpButton:false}, () => console.log('showGiveUpButton is false') );
                title = this.userNameOfOtherPlayer + ' gave up';
                
                Alert.alert(
                    title,
                    'Kudos! You made your opponent give up in a game of tic tac toe.',
                    [
                        {text: 'Ok', onPress: () => {}, style: 'cancel'},
                    ]
                );
            } else if(snapshot.val() == 0) {   
                this.setState({giveUp:false});
                // this.setState({showGiveUpButton:true});
            }
        });
    }

    checkIfGameWon(gameId) {
        // attaches an 'on' listener on the gameWon node so that if anybody wins the game then it directly shows the alert
        database.child('gameMetadata/'+gameId+'/gameWon').on('value', (snapshot)=>{
            // console.log('gameWon',snapshot.val());
            let title;
            userNameOfOtherPlayer = this.props.navigation.state.params.userNameOfOtherPlayer;
            
            if( this.myUid === snapshot.val() ) {
                title = 'Game Won'
                
                // checks if the page that is visible to the user is PlayingArea.js
                if(this.componentUnmounted) {
                    this.showGameWonAlert(title,this.otherPlayersUid,userNameOfOtherPlayer);
                }    
            
            } else if( this.otherPlayersUid === snapshot.val() ) {
                title = 'You lost'
                // sendGameRequest inside of showGameWonALert requires you to send userNameOfOtherPlayer to show a dialogue box
                // that is not required to be shown here
                if(this.componentUnmounted) {
                    this.showGameWonAlert(title,this.otherPlayersUid,userNameOfOtherPlayer);
                }    
            
            }
        
        });
    }

    showGameWonAlert(title,otherPlayersUid,userNameOfOtherPlayer) {
        // console.log('calling gameWon alert');
        Alert.alert(
            title,
            'Do you want to challenge the user to another matchh?',
            [
                {text: 'Yes', onPress: () => SendGameRequest(otherPlayersUid,userNameOfOtherPlayer) },
                {text: 'No', onPress: () => {}, style: 'cancel'},
            ],
            { cancelable: false }
        )
    }

    checkIfMoveIsPending(gameId) {
        database.child('/gameMetadata/'+gameId+'/nextMove').on('value', (snapshot) => {
            this.nextMove = snapshot.val();
            // checks if it is my turn
            this.movePending = this.nextMove === this.myUid; //evaluates to true or false
            
        });
    }

    renderGameMoves(gameId,gameMovesId,myUid) {
        // console.log('gameMovesId',gameMovesId);
        database.child('moves/'+gameMovesId).on('value', (snapshot) => {
            let allMoves = {};
            // console.log('snapshot.val() of allMoves',snapshot.val());
            allMoves = snapshot.val();
            // console.log('allMoves',allMoves);
            this.moveCount = 0;
            let movesToStoreInState = {};
            
            for(let key in allMoves) {
                if(allMoves[key].uid === this.myUid) {
                    movesToStoreInState[allMoves[key].move] = this.state.mySymbol;
                    this.moveCount++;
                }
                else {
                    movesToStoreInState[allMoves[key].move] = this.state.otherPlayersSymbol;
                    this.moveCount++;
                }
            }
            // console.log('movesToStoreInState',movesToStoreInState);
            this.setState(movesToStoreInState,()=>{
                // console.log('state value',this.state);
                this.winningLogic(gameId,this.moveCount);
            });

            // since set State is being done asynch the box over here is not set yet
            
            // this.winningLogic(gameId,this.moveCount);            
        });
    }
    
    render() {
        const {userNameOfOtherPlayer,gameId} = this.props.navigation.state.params
        return(
            <View style={styles.mainContainer}>
                <GameHeader userNameOfOtherPlayer={userNameOfOtherPlayer} />

                <View style={{width:'80%',alignSelf:'center',position:'absolute',bottom:166}}>
                    <View style={{flexDirection:'row'}}>
                        <Box onPress={()=>this.renderBoxContent('boxOne')} specificStyle={styles.boxA} >
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxOne}
                            </Text>
                        </Box>
                        <Box onPress={()=>this.renderBoxContent('boxTwo')} specificStyle={styles.boxA}>
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxTwo}
                            </Text>
                        </Box>
                        <Box onPress={()=>this.renderBoxContent('boxThree')} specificStyle={styles.boxB}>
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxThree}
                            </Text>
                        </Box>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Box onPress={()=>this.renderBoxContent('boxFour')} specificStyle={styles.boxA}>
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxFour}
                            </Text>
                        </Box>
                        <Box onPress={()=>this.renderBoxContent('boxFive')} specificStyle={styles.boxA}>
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxFive}
                            </Text>
                        </Box>
                        <Box onPress={()=>this.renderBoxContent('boxSix')} specificStyle={styles.boxB} >
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxSix}
                            </Text>
                        </Box>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Box onPress={()=>this.renderBoxContent('boxSeven')} specificStyle={styles.boxC}>
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxSeven}
                            </Text>
                        </Box>
                        <Box onPress={()=>this.renderBoxContent('boxEight')} specificStyle={styles.boxC}>
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxEight}
                            </Text>
                        </Box>
                        <Box onPress={()=>this.renderBoxContent('boxNine')} >
                            <Text style={styles.boxContentStyle}>
                                {this.state.boxNine}
                            </Text>
                        </Box>
                    </View>
                </View>
                
                <View style={{flexDirection:'row',justifyContent:'space-around',flex:1,position:'absolute',bottom:35,width:'100%'}} >
                    <View style={{justifyContent:'center',alignItems:'center'}} >
                        <View>
                            <Image resizeMode={'contain'} style={{width:30}} source={require('./cross.png')} />
                        </View>
                        <View style={{marginTop:12}}>
                            <Text style={{fontSize:25,fontWeight:'600'}} >
                                YOU
                            </Text>
                        </View>
                    </View>
                    <View style={{alignItems:'center',alignItems:'center'}} >
                        <View>
                            <Image resizeMode={'contain'} style={{width:38}} source={require('./Oval.png')} />
                        </View>
                        <View style={{marginTop:5}}>
                            <Text style={{fontSize:25,fontWeight:'600'}}>
                                { userNameOfOtherPlayer.split(' ')[0] }
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
}

const styles = {
    box: {
        borderWidth:1,
        height:100,
    },
    boxA:{borderRightColor:'black',borderRightWidth:2,borderBottomColor:'black',borderBottomWidth:2},
    boxB:{borderBottomColor:'black',borderBottomWidth:2},
    boxC:{borderRightColor:'black',borderRightWidth:2},
    boxContentStyle: {
        fontSize:70
    },
    gameStatusContainer: {
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:30,
    },
    gameStatus: {
        fontSize:22,
        fontWeight:'700',
    },
    headerLabel: {
        fontSize:25,
        fontWeight:'600',
    },
    headerContainer: {
        marginTop:50,
        justifyContent:'center',
        alignItems:'center',
    },
    mainContainer: {
        backgroundColor:'white',
        flex:1
    },
    giveUpButtonContainer: {
        backgroundColor:'#D8D8D8',
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:50
    },
    buttonStyle:{
        color:'#F75050',
        paddingHorizontal:18,
        paddingVertical:10,
        borderRadius:15,
        borderWidth:1,
        fontSize:17
    }
};

export default PlayingArea;