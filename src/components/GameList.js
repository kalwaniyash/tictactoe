

import React, { Component } from 'react';

import {View,Text} from 'react-native';
import Button from './Button'
// import ListSkeleton from './ListSkeleton'
import firebase, { database } from './firebase';

import PendingStatus from './PendingStatus';
import OngoingStatus from './OngoingStatus';
import List from './List';
import FadeInView from './FadeInView';
import Spinner from './Spinner';

class GameList extends Component {    

    state={data:[]};

    componentWillMount() {
        // my uid
        uid = firebase.auth().currentUser.uid;
        database.child('/ongoingGames/'+uid).on('value', (snapshot) => {
            // all of my ongoing games
            let ongoingGames = {};
            ongoingGames = snapshot.val();
            let array = [];
            console.log(ongoingGames);
            
            for(let key in ongoingGames) {
                let singleObject = {};
                console.log(key);
                console.log(ongoingGames[key]);
                singleObject.gameId = ongoingGames[key]
                singleObject.uid = key
                console.log(singleObject);
                array.push(singleObject);
                console.log(array);
            }
            
            this.setState({data:array});
            console.log('state set',this.state.data);
        });
    }

    renderEntireList() {
        // data is an array of gameId and uid
        if(this.state.data.length > 0) {
          return this.state.data.map((individualGame)=>{
            //  snapshot has uid and gameId
            // uid of the person i am palying the game with
            console.log('gameId',individualGame.gameId);
            return  <FadeInView>
                        <List data={individualGame} redirect={this.props.redirect} />
                    </FadeInView>
            });
        } else {
            return <NoGames />
        }
    }
    
    render() {
        return(
            <View style={{marginTop:45,flex:1}}>
                {this.renderEntireList()}
            </View>
        );
    }
    
};

const NoGames = () => {
    return(
        <View style={styles.noGamesContainer}>
            <Text style={{fontSize:27,color:'#0079FF',fontWeight:'400',opacity:1,marginTop:17}}>
                No Ongoing Games
            </Text>
            <Text style={{fontSize:21,color:'#0079FF',marginTop:30,opacity:1,fontWeight:'300'}}>
                Click on Start a new game to play
            </Text>
            <Text style={{fontSize:21,color:'#0079FF',marginTop:4,opacity:1,fontWeight:'300'}}>
                XOX with your phone contacts
            </Text>
        </View>
    );
}

const styles = {
    noGamesContainer:{
        backgroundColor:'#C0DAF8',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:10,
        paddingBottom:60,
        borderRadius:8
    }
};

export default GameList;