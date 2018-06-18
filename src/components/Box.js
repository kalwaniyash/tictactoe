import React, { Component } from 'react';
import {View} from 'react-native';

import CorrectButton from './CorrectButton';

class Box extends Component {
    render() {
        const {specificStyle} = this.props;
        return(
            <View style={{flex:1,height:100,...this.props.specificStyle}}>
                <CorrectButton
                onPress={()=> this.props.onPress()}
                buttonContent={this.props.children}
                buttonStyle={styles.box}
                />
            </View>
        );
    }
};

const styles = {
    box: {
        // borderWidth:1,
        // borderColor:'green',
        height:99,
    //     ...this.props.specificStyle,
    },
};

export default Box;