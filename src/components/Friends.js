import React, { Component } from 'react';
import {View,Text,AsyncStorage} from 'react-native';

import Header from './Header';
import Button from './Button';
import ListSkeleton from './ListSkeleton';
import Dividers from './Dividers';
import firebase, {database} from './firebase';

import _ from 'lodash';

import Contacts from 'react-native-contacts';
import ExistingFriends from './ExistingFriends';
import NonExistingFriends from './NonExistingFriends';
import Spinner from './Spinner';

class Friends extends Component {
    

    usersExisting = [];
    usersNotExisting = [];
    
    static navigationOptions = {
        headerTitle: 'Friends',
        headerStyle: {backgroundColor: '#63A3EA'},
        headerTitleStyle: { color: 'white' },
        headerBackTitleStyle: {color:'white'},
    };
    
    promiseArrayOfUid = [];
    promiseArrayOfStatus = [];

    state = {usersExisting:[], usersNotExisting:[], userStatus:[], uid:[], spinner:true};

    componentWillMount() {

        Contacts.getAll((err, contacts) => {
            if(err === 'denied') {
              console.log('Denied',err);
            }
            else {
                AsyncStorage.getItem('contactsInDB').then( (contactsInLocalDB) => {
                    if(contactsInLocalDB === null) {
                        console.log('contacts not in local storage');
                        // contacts stored in local storage since they were not found in local storage
                        
                        AsyncStorage.setItem('contactsInDB', JSON.stringify(contacts) ).then( (contactsInLocalDB) => {
                            console.log('Contacts stored in local db');
                        }).catch( err => console.log('Could not store to local db due to' + err ) );
                        
                        this.checkIfContactsExistInDB(contacts);
                    } else if( contactsInLocalDB !== null) {
                        console.log('data is not null',typeof(JSON.parse(contactsInLocalDB) ) );
                        if(_.isEqual(JSON.parse(contactsInLocalDB),contacts)) {
                            console.log('data is equal');
                            // simply get the locally stored existing friends
                            AsyncStorage.getItem('existingFriendsUid').then( (uid) => {
                                if(uid !== null) {
                                    console.log('uid found in local storage ',uid,' typeof',typeof(uid));
                                    
                                    uid = JSON.parse(uid);
                                    this.setState({uid:uid,spinner:false}, () => {console.log('state set through local db')});
                                } else if (uid === null) {
                                    // this else if statement is to ensure that if the code breaks i.e if a local copy of the contacts is found
                                    // but a local copy of uids is not found then the state should not be set to null
                                    console.log('uid not found in local storage sending all requests to firebase again');
                                    this.checkIfContactsExistInDB(contacts);
                                }
                            }).catch( err => console.log(err) );
                        
                        } else {
                            console.log('data has been changed');
                            // typeof(contactsInLocalDB) here should be an array
                            AsyncStorage.setItem('contactsInDB', JSON.stringify(contacts) ).then( (contactsInLocalDB) => {
                                console.log('Contacts stored in local db ', contactsInLocalDB);
                            }).catch( err => console.log('Could not store to local db due to' + err ) );

                            this.checkIfContactsExistInDB(contacts);
                        }
                    
                    }
                }).catch( err => console.log('err ',err) );

            }
        })
    }


    checkIfContactsExistInDB(contacts) {

        userName='',phoneNumber='';
        promises=[];
        let t1 = Date.now()/1000;
        
        console.log('contacts length',contacts.length);
        console.log('checkIfContactsExistInDB called once');
        contacts.forEach( (contact) => {
            userName  = contact.givenName;
            
            if(contact.phoneNumbers.length > 0) {
                contact.phoneNumbers.forEach((data)=>{
                    // console.log('normal number',data.number);
                    if(data.label === 'mobile' && data.number.length >= 10) {
    
                        let str = data.number;
                        str = str.replace(/\s/g,''); //removes spaces
                        str = str.replace(/\(/g,''); //removes all (
                        str = str.replace(/\)/g,''); //removes all )
                        str = str.replace(/\*/g,''); //removes all *
                        str = str.replace(/\#/g,''); //removes all #

                        if(str.indexOf('+') > -1 ) {
                            str = str.replace(/\+/g,'');
                            str = str.substr(2); //should remove the 91 after the + sign
                        }
                        // console.log('modified number',str);
                        promises.push(database.child('/mobileNo/'+str).once('value'));
                    } else {
                        console.log('Number'+ data.number +' length is less than 10 '+ data.number.length +' or label is '+ data.label);
                    }
                });
            } else {
                // console.log('Phone number length is 0');
            }
        });
        let t2 = Date.now()/1000;
        console.log('time in secs taken to send request to db ', t2-t1 );
        
        let t3 = Date.now()/1000;
        Promise.all(promises).then( (snapshot)=>{
            let uid = [];
            let notExist = [];
            snapshot.forEach((data)=>{
                // console.log(data);
                // data over here is UID
                if(data.exists() && !(uid.indexOf(data.val() ) > -1) ){
                    console.log('uid ', data.val() );
                    uid.push(data.val());
                } else {
                    notExist.push(data.val());
                }
            });
            
            console.log('uid ',uid,);

            AsyncStorage.setItem('existingFriendsUid',JSON.stringify(uid)).then( (uid) => {
                console.log('Uids stored to local DB',uid);
            }).catch(err => console.log(err) );
            
            this.setState({ uid:uid, spinner:false });
            let t4 = Date.now()/1000;
            console.log('time to serve back request',t4-t3);
            console.log('uid',this.state.uid);
        }).catch( err => console.log(err) );
    }

    renderExistingFriend() {
        return this.state.uid.map((uid)=>{
            // this uid is of the other person i'm palying the game with
            return <ExistingFriends otherPersonsUid={uid} />
        });
    }

    renderIntitalStateOfPage(spinnerState) {
        console.log('spinnerState',spinnerState);
        if(spinnerState) {
            return(
                <Spinner />
            );
        } else {
            if(this.state.uid.length == 0) {
                return(
                    <View style={{alignItems:'center', justifyContent:'center'}}>
                        <Text style={{marginTop:20,fontSize:16}}>
                            No Friends on XOX
                        </Text>
                    </View>
                );
            } else {
                return(
                    <View>
                        {this.renderExistingFriend()}
                    </View>
                );
            }   
        }
    }


    render() {
        return(
            <View>
                <View style={{marginTop:5}}>
                    <View>
                        <Dividers dividerTitle='XOX Friends' />
                    </View>
                    <View style={{marginTop:15}}>
                        {this.renderIntitalStateOfPage(this.state.spinner)}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    buttonStyle:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'transparent',
    },
    buttonContainer:{
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#B0B0B0',
        borderRadius:20,
        borderWidth:0.7,
    },
    acceptButtonContainer: {
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#B0B0B0',
        borderRadius:20,
        borderWidth:0.7,
    },
    acceptButton: {
        paddingLeft:27,
        paddingRight:27,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'transparent',
        fontSize:14
    },
    declineButtonContainer: {
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#EEBABA',
        borderRadius:20,
        borderWidth:0.7,
    },
    declineButtton:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'transparent',
    },
    gameslist: {
        backgroundColor:'#D8D8D8',
        borderColor:'#979797',
        borderWidth:0.5,
        flexDirection:'row',
        paddingTop:14,
        paddingBottom:14,
        height:100
    },
    leftContainer:{
        flexDirection:'column',
        flex:1,
        marginLeft:15,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    rightContainer:{
        flexDirection:'column',
        alignItems:'flex-end',
        justifyContent:'center',
        flex:1
    },
    username:{
        fontSize:23,
        fontWeight:'bold'
    },
    lastMovePlayed:{
        fontSize:10,
        fontWeight:'400',
    },
    status: {
        width:10,
        height:10,
        borderRadius:100,
        backgroundColor:'#F0B228',
        alignSelf:'center',
        marginLeft:8
    },
    confimationContainer: {
        flexDirection:'row'
    }
};

export default Friends;


// let contactss = [
//     {
//         givenName:'Yash Kalwani',
//         phoneNumbers: [{
//             label:'mobile',
//             number:'7710020100'
//         }]
//     },
//     {
//         givenName:'Sachin Bansal',
//         phoneNumbers: [{
//             label:'mobile',
//             number:'9971530964'
//         }]
//     },
//     {
//         givenName:'Jai Kapasia',
//         phoneNumbers: [{
//             label:'mobile',
//             number:'9664227310'
//         }]
//     }
// ];




// let countryCode='',mobileNumber='';
// if( str.indexOf('+') > -1 ) {
//     countryCode = str.substr(0,str.indexOf(' '));
//     mobileNumber = str.substr(str.indexOf(' ')+1);
// } else {
//     mobileNumber = str;
// }

// // if there is a plus sign and no space between the country code,
// //the + sign still exists and is causing error so to remove that + sign we use the following
// if(mobileNumber.indexOf('+') > -1 ) {
//     mobileNumber = mobileNumber.replace(/\+/g,'');
//     mobileNumber = mobileNumber.substr(2); //should remove the 91 after the + sign
//     console.log('string after removal of +91 ',mobileNumber);
// }


// mobileNumber = mobileNumber.replace(/\s/g,'');
// mobileNumber = mobileNumber.replace(/\(/g,'');
// mobileNumber = mobileNumber.replace(/\)/g,'');
// mobileNumber = mobileNumber.replace(/\*/g,'');
// mobileNumber = mobileNumber.replace(/\#/g,'');

// console.log('modified number',mobileNumber);
// promises.push(database.child('/mobileNo/'+mobileNumber).once('value'));