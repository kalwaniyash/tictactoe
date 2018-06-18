import React from 'react';

import { TabNavigator } from 'react-navigation';
import PendingReq from './PendingReq';
import ReqSend from './ReqSend';
import OngoingGames from './OngoingGames';

const TabsNavigation = TabNavigator({
    Ongoing: {
      screen: OngoingGames,
    },
    Pending: {
        screen: PendingReq,
    },
    'Request Send': {
      screen: ReqSend,
    },
  }, {
    tabBarPosition: 'top',
    swipeEnabled:true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: 'white',
      tabStyle:{ backgroundColor:'#63A3EA' },
      inactiveTintColor:'black',
      labelStyle:{fontSize:12,paddingBottom:4},
    },
});

export default TabsNavigation;