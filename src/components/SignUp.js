import React, { Component } from 'react';
import {View,Text,TextInput} from 'react-native';

import Header from './Header';
import InputArea from './InputArea';
import Button from './Button';
import firebase from './firebase';
import Spinner from './Spinner';
// import firebase from 'firebase';


class SignUp extends Component {

    state={email:'',password:'',userName:'',mobileNo:'',error:'',loading:false};
    

    onSignUp() {
        console.log('sign up clicked');
        firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
        .then(() => {this.storeToDB(); this.props.navigation.navigate('Games'); this.setState({loading:false}) })
        .catch((error)=> { console.log(error); this.setState({error}) });
    }

    storeToDB() {
        firebase.database().ref().child('/userMetadata/'+firebase.auth().currentUser.uid).set({
            userName:this.state.userName,
            mobileNo:this.state.mobileNo
        });

        firebase.database().ref().child('/mobileNo/'+this.state.mobileNo).set(firebase.auth().currentUser.uid);
        // set also returns a promise
    }

    showButtonOrSpinner() {
        console.log('inside');
        if(this.state.loading) {
            console.log('spinner');
            return <Spinner size={'large'}/>
        }

        return <Button onPress={()=>{this.setState({loading:true});this.onSignUp()}} style={styles.buttonStyle} buttonContent='Sign Up' />
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    render() {
        return(
            <View style={styles.mainContainer}>
                {/* <Header headerTitle='Sign Up' /> */}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <InputArea
                            secureTextEntry = {false}
                            placeHolder = 'email'
                            label = 'Email id'
                            value= {this.state.email}
                            onChangeText = {email=>this.setState({email})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <InputArea
                            secureTextEntry = {false}
                            placeHolder = 'User name'
                            label = 'User name'
                            value= {this.state.userName}
                            onChangeText = {userName=>this.setState({userName})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <InputArea
                            secureTextEntry = {false}
                            placeHolder = 'mobileNo'
                            label = 'mobileNo'
                            value= {this.state.mobileNo}
                            onChangeText = {mobileNo=>this.setState({mobileNo})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <InputArea
                            secureTextEntry = {true}
                            placeHolder = 'password'
                            label = 'Password'
                            value= {this.state.password}
                            onChangeText = {password=>this.setState({password})}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        {this.showButtonOrSpinner()}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    mainContainer:{
        flex:1,
        flexDirection:'column'
    },
    formContainer: {
        marginTop:20,
        paddingHorizontal:10,
        flex:1,
        flexDirection:'column',
    },
    inputContainer: {
        backgroundColor:'transparent',
    },
    buttonStyle:{
        backgroundColor:'transparent',
        padding:15,
        paddingLeft:20,
        paddingRight:20,
        fontSize:18,
    },
    buttonContainer:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        backgroundColor:'transparent'
    },
};

export default SignUp;