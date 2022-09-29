import React, {useContext, useEffect, useState} from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NewOrders from './NewOrders';
import ConfirmedOrders from './ConfirmedOrders';
import CompletedOrders from './CompletedOrders';
import {metrics} from '../../../assets/style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import ReadyToPickupOrder from './ReadyToPickupOrders';
import {getOrdersByresturantUserId} from '../../../services/CloudFunction/ordersManagment';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';

const Tab = createMaterialTopTabNavigator();
const AdminOrders = () => {
  const navigation = useNavigation();

  const [tabName, setTabName] = useState('New orders');

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: 60,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            backgroundColor: '#132333',
          }}>
          <EntypoIcon
            name="menu"
            size={30}
            color="#ffffff"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />

          <Ionicons
            name="notifications"
            size={30}
            color="#ffffff"
            onPress={() => navigation.navigate('notification')}
          />
        </View>
        <TopNavigation tabName={tabName} />
      </View>
    </SafeAreaView>
  );
};

const TopNavigation = ({tabName}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: 'Lato-Bold',
          fontSize: 12,
          textTransform: 'capitalize',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#132333',
          borderBottomWidth: 6,
          borderColor: '#132333',
        },
        tabBarActiveTintColor: '#132333',
        initialRouteName: 'New orders',
      }}>
      <Tab.Screen name="New orders" component={NewOrders} />
      <Tab.Screen name="Confirmed orders" component={ConfirmedOrders} />
      <Tab.Screen name="Ready to pick up" component={ReadyToPickupOrder} />
      <Tab.Screen name="Picked up" component={CompletedOrders} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default AdminOrders;
