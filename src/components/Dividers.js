import React from 'react';

import {View,Text} from 'react-native';
const Dividers = (props) => {
    return(
        <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>{props.dividerTitle}</Text>
        </View>
    );
};

const styles = {
    dividerContainer:{
        alignItems:'flex-start',
        justifyContent:'center',
    },
    dividerText:{
        marginLeft:20,
        marginTop:20,
        fontSize:14,
        fontWeight:'700',
        backgroundColor:'transparent'
    },
};

export default Dividers;