import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Favourites from '../../screens/Favourites';
import Home from '../../screens/Home';
import InviteFriends from '../../screens/InviteFriends';
import Location from '../../screens/Location';
import MyCart from '../../screens/MyCart';
import Notification from '../../screens/Notifications';
import OrderTrack from '../../screens/OrderTrack';
import PaymentSetting from '../../screens/PaymentSetting';
import AddNewCard from '../../screens/PaymentSetting/addNewCard';
import Profile from '../../screens/Profile';
import ProfileInner from '../../screens/Profile/ProfileInner';
import AcceptedInvites from '../../screens/Rewards/AcceptedInvites';
import EarnedRewards from '../../screens/Rewards/EarnedRewards';
import DrawerStack from '../DrawerStack';
import CompletedOrder from '../../screens/CompletedOrders';
import CompletedOrderDetailed from '../../screens/CompletedOrders/detailed';
import BowlCreation from '../../screens/BowlCreation';
import Payment from '../../screens/Payment';

const Stack = createStackNavigator();

const CustomerStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="Home" component={DrawerStack} />
      <Stack.Screen name="ProfileInner" component={ProfileInner} />
      <Stack.Screen name="PaymentSetting" component={PaymentSetting} />
      <Stack.Screen name="add-new-card" component={AddNewCard} />
      <Stack.Screen name="completed-order" component={CompletedOrder} />
      <Stack.Screen name="order-track" component={OrderTrack} />
      <Stack.Screen name="invite-friends" component={InviteFriends} />
      <Stack.Screen name="earned-rewards" component={EarnedRewards} />
      <Stack.Screen name="accepted-invites" component={AcceptedInvites} />
      <Stack.Screen name="notification" component={Notification} />
      <Stack.Screen name="Bowl creation" component={BowlCreation} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen
        name="completed-order-details"
        component={CompletedOrderDetailed}
      />
    </Stack.Navigator>
  );
};

export default CustomerStack;
