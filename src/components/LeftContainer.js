import React from 'react';
import {View,Text} from 'react-native';

import Button from './Button';

const LeftContainer = (props) => {
    return(
        <View style={styles.leftContainer}>
            <View style={{marginBottom:4,flexDirection:'row'}}>
                <Text style={styles.username}>Sachin Bansal</Text>
                <View style={styles.status} />
            </View>
            <View>
                <Text style={styles.lastMovePlayed}>Last move played 10 mins ago</Text>
            </View>
        </View>
    );
};

const styles = {
    leftContainer:{
        flexDirection:'column',
        flex:1,
        marginLeft:15,
    },
    username:{
        fontSize:23,
        fontWeight:'bold'
    },
    lastMovePlayed:{
        fontSize:12,
        fontWeight:'400',
    },
    status: {
        width:10,
        height:10,
        borderRadius:100,
        backgroundColor:'#F0B228',
        alignSelf:'center',
        marginLeft:8
    }
};


export default LeftContainer;