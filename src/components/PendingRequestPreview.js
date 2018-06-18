import React, { Component } from 'react';

import {View,Text,ScrollView,Button, FlatList} from 'react-native';
import firebase, {database} from './firebase';

import {StatusOnline,StatusOffline} from './Status';
import FadeInView from './FadeInView';
import PendingRequestCard from './PendingRequestCard';
import Spinner from './Spinner';

class PendingRequestPreview extends Component{

    state={ pendingRequestPreviewData: {}, showSpinner : true };

    componentWillMount() {
        const myUid = firebase.auth().currentUser.uid;

        database.child('pendingRequest/'+myUid).limitToFirst(5).on('value', (snapshot) => {
            pendingRequest = [];
            for(let key in snapshot.val()){
                singleObject = {};
                singleObject.uid = key,
                singleObject.pendingRequestPreviewData = snapshot.val()[key]
                
                console.log('singlePendingRequest',singleObject);
                pendingRequest.push(singleObject);
            }
            this.setState({ pendingRequestPreviewData:pendingRequest,showSpinner:false });
        });
    }

    render() {
        return(
            <View style={styles.mainContainer}>
                <View style={styles.headingContainer}>
                    <View>
                        <Text style={styles.pendingRequestText}>
                            Pending Requests
                        </Text>
                    </View>
                    {/* <View>
                        <Button
                        title='See All'
                        onPress={() => this.props.navigation.navigate('PendingRequest')}
                        />
                    </View> */}
                </View>
                <View style={{flex:1}}>
                    {
                        this.displayContent(this.state.showSpinner)
                    }
                </View>
            </View>
        );
    }

    displayContent(spinnerValue) {
        if(spinnerValue) {
            return( <Spinner /> );
        } else {
            return(
                <View>
                <FadeInView style={{flex:1}}>
                    { this.renderMultipleCards(this.state.pendingRequestPreviewData) }
                </FadeInView>
                </View>
            );
        }
    }

    renderMultipleCards(pendingRequestPreviewData) {
        if(pendingRequestPreviewData.length > 0) {
            return(
                <View>
                    <FlatList 
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={pendingRequestPreviewData}
                    renderItem={ ({item}) => { return <PendingRequestCard 
                                            otherPersonsUid={item.uid} 
                                            pendingRequestPreviewData={item.pendingRequestPreviewData} 
                                            status={this.state.status}
                                            /> }
                                }
                    keyExtractor={ (item) => item.uid }            
                    />
                </View>
            );   
        } else if(pendingRequestPreviewData.length == 0) {
            return(
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>
                        No Pending request
                    </Text>
                </View>
            );
        } else  {
            return( <View/> );
        }
    }
}

const styles = {
    acceptButton:{
        width:55,
        height:55,
        borderRadius:100,
        backgroundColor:'#48C199',
        marginRight:10
    },
    declineButton:{
        width:55,
        height:55,
        borderRadius:100,
        backgroundColor:'#ED5D54',
    },
    status:{
        marginLeft:4,
        width:6,
        height:6,
        borderRadius:100,
        backgroundColor:'#3AD973'
    },
    nameText:{
        fontSize:17,
        fontWeight:'500',
    },
    descriptionContainer:{
        marginTop:10,
    },
    cardContainer: {
        maxWidth:150,
        backgroundColor:'white',
        paddingHorizontal:10,
        paddingTop:5,
        paddingBottom:10,
        alignItems:'center',
        marginRight:8,
        marginVertical:8,
    },
    scrollViewStyle:{
        marginLeft:15,
        paddingVertical:17,
        marginRight:10
    },
    mainContainer: {
        // backgroundColor:'#F4F4F4',
        paddingHorizontal: 10,
        // flex:1,   // do not use flex:1 here since it passes this property to parent and divides the parent 
                    //and the rest of the parent's siblings in half. 
                    //Use min height (temporary solution). It should automatically take only the amount of space it requires
        minHeight: 180,
    },
    headingContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:6,
        // paddingHorizontal:10,
    },
    seeAllText:{
        color:'#3A98F0',
        fontSize:16,
        fontWeight:'300'
    },
    pendingRequestText:{
        fontSize:15,
        fontWeight:'500'
    }
}
export default PendingRequestPreview;