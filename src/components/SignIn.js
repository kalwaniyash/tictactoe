import React, { Component } from 'react';
import {View,Text,TextInput,ActivityIndicator} from 'react-native';

import Header from './Header';
import InputArea from './InputArea';
import Button from './Button';
import firebase from './firebase';
import Spinner from './Spinner';

import Games from './Games';
import SignUp from './SignUp';

class SignIn extends Component {
    
    state={email:'',password:'',loading:false};

    onSignIn() {
        this.setState({loading:true})
        
        firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
            .then(()=>{
                console.log('Signing in');
                this.props.navigation.navigate('Games');
                this.setState({loading:false});
            })
            .catch((error) => {
                console.log(error);
                this.setState({loading:false});
        });
    }

    // createAccount() {
    //     this.props.navigation.navigate('SignUp');
    // }

    showButtonOrSpinner() {
        console.log('spinner');
        if(this.state.loading) {
            return (
                <View style={{flex:1,marginTop:75}}>
                    <Spinner size={'large'}/>
                </View>
            );
        }

        return (
            <View>
                <View style={styles.buttonContainer}>
                    <Button 
                        onPress={()=>this.onSignIn()} 
                        buttonStyle={styles.buttonStyle}
                        buttonContent='Sign In' 
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{marginTop:20,paddingHorizontal:10}}>
                    <InputArea
                        secureTextEntry = {false}
                        placeHolder = 'email'
                        label = 'Email id'
                        value= {this.state.text}
                        onChangeText = {email=>this.setState({email})}
                    />
                </View>
                <View style={{paddingHorizontal:10}}>
                    <InputArea
                        secureTextEntry = {true}
                        placeHolder = 'password'
                        label = 'Password'
                        value= {this.state.password}
                        onChangeText = {password=>this.setState({password})}
                    />
                </View>
                {/* <View style={styles.buttonContainer}> */}
                <View>
                    {this.showButtonOrSpinner()}
                </View>
                {/* </View> */}
                <View>
                    <Button 
                    onPress={ () => this.props.navigation.navigate('SignUp') } 
                    buttonContainer={styles.goToSignUpContainer} 
                    buttonStyle={styles.goToSignUpButton} 
                    buttonContent={'Create Account'} 
                    />
                </View>
            </View>
        );
    }
};

const styles ={
    buttonContainer: {
        alignItems:'center',
        justifyContent:'center',
        marginTop:75,
        backgroundColor:'transparent'
    },
    buttonStyle: {
        backgroundColor:'transparent',
        // padding:15,
        // paddingLeft:20,
        // paddingRight:20,
        fontSize:24,
    },
    goToSignUpContainer: {
        marginTop:30,
        // marginLeft:20,
        alignItems:'center',
        backgroundColor:'transparent'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'black',
        height: window.height,
        width: window.width,
        opacity: 0.4,
    }
};

export default SignIn;