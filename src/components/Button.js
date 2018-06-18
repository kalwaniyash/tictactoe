import React from 'react';
import {View,TouchableOpacity, Text, TouchableHighlight} from 'react-native';

const Button = (props) => {
    return(
    <TouchableOpacity onPress={() => props.onPress()} style={props.buttonContainer}>
        <Text style={props.buttonStyle}>{props.buttonContent}</Text>
    </TouchableOpacity>
    );
};

const styles = {
};

export default Button;