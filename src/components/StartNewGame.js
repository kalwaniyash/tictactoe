import React from 'react';
import {View,Text} from 'react-native';

import Button from './Button';
import Friends from './Friends';

const StartNewGame = ({navigation}) =>{
    return(
        <View style={styles.mainContainer}>
            {/* buttonContainer is a view that contains the button */}
            <Button 
            onPress={ () => {navigation.navigate('Friends');console.log('Clicked');} } 
            buttonContainer={styles.buttonContainer} buttonStyle={styles.buttonStyle} 
            buttonContent={'Start new game'} 
            />
        </View>
    );
};

const styles = {
    buttonContainer:{
        // flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#217BDE',
        borderColor:'#104C8D',
        borderRadius:20,
        borderWidth:0.7,
        alignSelf:'center',
        height:40,
    },
    buttonStyle:{
        paddingHorizontal:70,
        paddingVertical:14,
        backgroundColor:'transparent',
        color:'white',
    },
    mainContainer: {
        marginVertical:15,
        alignItems:'center',
        justifyContent:'center'
    }
};


export default StartNewGame;