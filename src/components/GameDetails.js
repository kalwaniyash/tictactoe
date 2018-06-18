import React, { Component } from 'react';
import {View,Text} from 'react-native';
import { database } from './firebase';
import { Database } from '@firebase/database';

class GameDetails extends Component {
    
    state={secs:0,mins:0,gameNotWon:false}
    
    render() {
        return(
            <View style={styles.gameStatusContainer}>
                <View>
                    <Text style={styles.gameStatus}>
                        You-{this.props.mySymbol}
                    </Text>
                </View>
                {/* <View>
                    <Text style={styles.gameStatus}>
                        {this.state.mins} : {this.state.secs}
                    </Text>
                </View> */}
                <View>
                    <Text style={styles.gameStatus}>
                        {this.props.userNameOfOtherPlayer}-{this.props.otherPlayersSymbol}
                    </Text>
                </View>
            </View>
        );
    }

    startTimer() {
        // if the game is not won then keep the timer going
        console.log('gameNotWon ',this.state.gameNotWon);
        setInterval(() => {
            if(this.state.secs>=60) {
                this.setState({ secs : 0 });
                this.setState({ mins : this.state.mins+1 });
                console.log(this.state.secs,this.state.mins);
            } else {
                this.setState({ secs:this.state.secs+1 });
            }
        },1000);
    }
}

const styles = {
    gameStatusContainer: {
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:25,
    },
    gameStatus: {
        fontSize:22,
        fontWeight:'700',
    },
};

export default GameDetails;