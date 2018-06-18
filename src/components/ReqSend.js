import React, { Component } from 'react';
import {View, Text} from 'react-native';

import firebase, { database } from './firebase';

class ReqSend extends Component {
    
    myUid = firebase.auth().currentUser.uid;
    state={ reqSend:{} };

    componentWillMount() {
        database.child('/requestSend/'+this.myUid).on('value',(snapshot)=>{
            this.setState({ reqSend : snapshot.val() });
        });
    }

    renderList(reqSend) {
        for (let key in reqSend){
            console.log(key);
            return <RenderSingleComponent uid={key} />
        }
    }
    
    render() {
        return(
            <View>
                { this.renderList(this.state.reqSend) }
            </View>
        );
    }
};

class RenderSingleComponent extends Component {
    state={ userName: '' };

    componentWillMount() {
        console.log(this.props.uid);
        database.child('userMetadata/'+this.props.uid).once('value').then((snapshot)=>{
            this.setState({ userName : snapshot.val().userName });
        }).catch( err => console.log(err) );
    }

    render() {
        return(
            <View style={styles.gameslist}>
                <View style={styles.leftContainer}>
                    <View style={{marginBottom:4,flexDirection:'row'}}>
                        <Text style={styles.username}>{this.state.userName}</Text>
                    </View>
                </View>
                <View style={styles.rightContainer}>
                    <Text style={{color:'#7CE84F',marginRight:15,fontSize:17}}>Request Send</Text>
                </View>
            </View>
        );
    }
}

const styles = {
    gameslist: {
        backgroundColor:'#4092ED',
        borderWidth:1,
        borderColor:'black',
        flexDirection:'row',
        height:100
    },
    leftContainer:{
        flexDirection:'column',
        flex:1,
        marginLeft:15,
        justifyContent:'center',
        alignItems:'flex-start',
        backgroundColor:'transparent',
    },
    rightContainer:{
        flexDirection:'column',
        alignItems:'flex-end',
        justifyContent:'center',
        flex:1
    },
    username:{
        fontSize:23,
        fontWeight:'bold',
        color:'white',
        backgroundColor:'transparent'
    },
    lastMovePlayed:{
        fontSize:10,
        fontWeight:'400',
        color:'white',
        backgroundColor:'transparent'
    },
};

export default ReqSend;