import React from 'react';
import {View,Text, Button} from 'react-native';

const GameHeader = ({userNameOfOtherPlayer}) => {
    return(
        <View style={styles.headerContainer}>
            <Text style={styles.headerLabel}>
                Playing with {userNameOfOtherPlayer}
            </Text>
        </View>
    );
};

const styles = {
    headerContainer: {
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:40,
        width:'100%',
    },
    headerLabel: {
        fontSize:25,
        fontWeight:'600',
    },
};

export default GameHeader;