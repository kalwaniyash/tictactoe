import React, { Component } from 'react';
import {View, Alert} from 'react-native';

import CorrectButton from './CorrectButton'
import firebase, { database } from './firebase';

class GiveUp extends Component {

    // renderGiveUpButton(giveUp) {
    //     if(giveUp)  {
    //         return <View />
    //     } else {
    //         return <View style={styles.giveUpButtonContainer}>
    //                      <CorrectButton
    //                      onPress={()=> this.giveUp(this.props.navigation,this.props.gameId) }
    //                      buttonContent={'Give up'}
    //                      buttonStyle={styles.buttonStyle}
    //                      />
    //                  </View>
    //     }
    // }

    componentWillMount() {
        console.log('cwm props showGiveUpButton ', this.props.showGiveUpButton);
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('componentWillRecieveProps showGiveUpButton ', nextProps.showGiveUpButton);
    //     this.props = nextProps;
    //     console.log('props after overwritting ',this.props);
    // }

    renderGiveUpButton(showGiveUpButton) {
        if(showGiveUpButton)  {
            return <View style={styles.giveUpButtonContainer}>
                         <CorrectButton
                         onPress={()=> this.giveUp(this.props.navigation,this.props.gameId) }
                         buttonContent={'Give up'}
                         buttonStyle={styles.buttonStyle}
                         />
                     </View>
        } else {
            return <View />
        }
    }

    giveUp(navigation,gameId) {
        console.log('gameId after clicked on give up',gameId);
        Alert.alert(
            'Give up?',
            'Are you sure you want to give up?',
            [
                {text: 'Yes', onPress: () => storeAndRedirect(navigation,gameId)},
                {text: 'No', onPress: () => {}, style: 'cancel'},
            ],
            {cancelable:false}
        );
        
        const storeAndRedirect = (navigation,gameId) => {
            database.child('/gameMetadata/'+gameId+'/giveUp').set(firebase.auth().currentUser.uid);
            database.child('gameMetadata/'+gameId+'/nextMove').set('0');
            navigation.goBack();
        };
    }
    
    render() {
        return(
            <View>
                {/* {this.renderGiveUpButton(this.props.giveUp)} */}
                {/* { console.log('showGiveUpButton ',this.props.showGiveUpButton) } */}
                {this.renderGiveUpButton(this.props.showGiveUpButton)}
            </View>
        );
    };
};

const styles = {
    giveUpButtonContainer: {
        backgroundColor:'#D8D8D8',
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:25,
    },
    buttonStyle:{
        color:'#F75050',
        paddingHorizontal:18,
        paddingVertical:10,
        borderRadius:15,
        borderWidth:1,
        fontSize:17,
    }
};

export default GiveUp;