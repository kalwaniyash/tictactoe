import React from 'react';
import {View,Text,TextInput} from 'react-native';

const InputArea = (props) => {
    return(
        <View style={styles.formContainer}>
            <View style={{justifyContent: 'space-around',flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={styles.labelStyle}>{props.label}</Text>
                </View>
                <View style={{flex:3}}>
                    <TextInput style = {styles.textInput}
                        secureTextEntry = {props.secureTextEntry}
                        placeHolder = {props.placeHolder}
                        autoCorrect = {false}
                        value= {props.value}
                        onChangeText = {props.onChangeText}
                    />
                </View>
            </View>
        </View>        
    );
};

const styles = {
    formContainer: {
        flexDirection:'column',
    },
    labelContainer:{
        flexDirection:'row',
        flex:1,
        // alignItems:'flex-start',
        // justifyContent:'flex-start',
        // marginTop:10
    },
    labelStyle: {
        fontSize:15,
        backgroundColor:'transparent'
    },
    textInputContainer:{
        flex:3,
        flexDirection:'column',
        // backgroundColor:'black',
        // borderWidth:1,
        justifyContent:'flex-start',
        height:30
    },
    textInput:{
    }
};

export default InputArea;