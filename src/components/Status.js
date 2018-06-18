// without exporting any default in here how is the application working

import React from 'react';
import {View} from 'react-native';

export const StatusOnline = () => {
    return <View style={styles.statusOnline} />  
};

export const StatusOffline = () => {
    return <View style={styles.statusOffline} />
};

const styles = {
    statusOnline: {
        width:10,
        height:10,
        borderRadius:100,
        backgroundColor:'#7CE84F',
        alignSelf:'center',
    },
    statusOffline: {
        width:10,
        height:10,
        borderRadius:100,
        backgroundColor:'#F0B228',
        alignSelf:'center',
    }
}