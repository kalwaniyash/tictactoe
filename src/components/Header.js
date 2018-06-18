import React, { Component } from 'react';
import {View,Text,Image} from 'react-native';
import firebase, { database,currentUser } from './firebase';
import StartNewGame from './StartNewGame';

import {lengthOfOngoingGames} from './OngoingGames';

class Header extends Component {
    state = {userName:''};
    
    componentWillMount() {
        database.child('/userMetadata/'+firebase.auth().currentUser.uid+'/userName').once('value').then((snapshot)=>{
            this.setState({ userName:snapshot.val() });
        }).catch( err => console.log(err) );
    }
    
    render() {
        return(
            <View style={styles.containerStyle}>
                <View>
                    <Text style={styles.headerTitle}>{this.state.userName}</Text>
                </View>
                <View style={styles.friendsOnlineContainer}>
                    <Text style={styles.friendsOnline}>10 friends online</Text>
                    <View style={styles.separator} />
                    <Text style={styles.friendsOnline}>20 Ongoing games</Text>
                </View>
                <StartNewGame navigation={this.props.navigation} />
            </View>
        );
    };
}

const styles = {
    headerTitle:{
        fontSize:30,
        color:'white',
        fontWeight:'600',
    },
    containerStyle: {
        paddingTop:34,
        paddingBottom:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#63A3EA',
    },
    friendsOnlineContainer: {
        paddingVertical:13,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    friendsOnline: {
        color: 'white',
        fontSize:15,
    },
    separator: {
        width:8,
        height:8,
        borderRadius:100,
        backgroundColor:'#AAD8FC',
        borderColor:'#6FB8FD',
        alignSelf:'center',
        marginHorizontal:6,
    },
};

export default Header;