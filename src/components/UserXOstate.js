import React, {Component} from 'react';
import {View,Text} from 'react-native';

const UserXOstate = ({mySymbol,userNameOfOtherPlayer}) => {
    console.log('mySymbol,userNameOfOtherPlayer',mySymbol,userNameOfOtherPlayer);
    return(
        <View>
            {renderSymbol(mySymbol,userNameOfOtherPlayer)}
        </View>
    );
}

const renderSymbol = ({mySymbol,userNameOfOtherPlayer}) => {
    if(mySymbol === 'X') {
        console.log('MySymbol',mySymbol);
        return (
            <View style={{flexDirection:'row',justifyContent:'space-around',flex:1,position:'absolute',bottom:35,width:'100%'}} >
                <View style={{justifyContent:'center',alignItems:'center'}} >
                    <View>
                        <Image resizeMode={'contain'} style={{width:30}} source={require('./cross.png')} />
                    </View>
                    <View style={{marginTop:12}}>
                        <Text style={{fontSize:25,fontWeight:'600'}} >
                            YOU
                        </Text>
                    </View>
                </View>
                <View style={{alignItems:'center',alignItems:'center'}} >
                    <View>
                        <Image resizeMode={'contain'} style={{width:38}} source={require('./Oval.png')} />
                    </View>
                    <View style={{marginTop:5}}>
                        <Text style={{fontSize:25,fontWeight:'600'}}>
                            { userNameOfOtherPlayer.split(' ')[0] }
                        </Text>
                    </View>
                </View>
            </View>
        );
    } else if(mySymbol === '0') {
        return(
            <View style={{flexDirection:'row',justifyContent:'space-around',flex:1,position:'absolute',bottom:35,width:'100%'}} >
                <View style={{justifyContent:'center',alignItems:'center'}} >
                    <View>
                        <Image resizeMode={'contain'} style={{width:30}} source={require('./Oval.png')} />
                    </View>
                    <View style={{marginTop:12}}>
                        <Text style={{fontSize:25,fontWeight:'600'}} >
                            YOU
                        </Text>
                    </View>
                </View>
                <View style={{alignItems:'center',alignItems:'center'}} >
                    <View>
                        <Image resizeMode={'contain'} style={{width:38}} source={require('./cross.png')} />
                    </View>
                    <View style={{marginTop:5}}>
                        <Text style={{fontSize:25,fontWeight:'600'}}>
                            { userNameOfOtherPlayer.split(' ')[0] }
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default UserXOstate;