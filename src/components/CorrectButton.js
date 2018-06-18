import React from 'react';
import {View,TouchableOpacity, Text} from 'react-native';

const CorrectButton = (props) => {
    return(
    <TouchableOpacity onPress={() => props.onPress()}>
        <Text style={props.buttonStyle}>{props.buttonContent}</Text>
    </TouchableOpacity>
    );
};

const styles = {
};

export default CorrectButton;