import React from 'react';
import {View, ActivityIndicator} from 'react-native';

const Spinner = ({size}) => {
    return(
        <View style={{flex:1}}>
            <ActivityIndicator style={styles.spinnerStyle} size={size || 'large'}/>
        </View>
    );
};

const styles = {
    spinnerStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
};

export default Spinner;