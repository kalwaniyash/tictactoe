import React, { Component } from 'react';
import {View,Text} from 'react-native';

import Button from './Button';

const ListSkeleton = () => {
    return(<View />);
}

const styles = {
    gameslist: {
        backgroundColor:'#D8D8D8',
        borderColor:'#979797',
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
    },
    rightContainer:{
        flexDirection:'column',
        alignItems:'flex-end',
        justifyContent:'center',
        flex:1
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
        backgroundColor:'#B0B0B0',
        borderRadius:20,
        borderWidth:0.7,
    }
};


export default ListSkeleton;