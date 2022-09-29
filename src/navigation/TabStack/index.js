import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View, SafeAreaView } from 'react-native';
import Favourites from '../../screens/Favourites';
import Home from '../../screens/Home';
import MyCart from '../../screens/MyCart';
import PaymentSetting from '../../screens/PaymentSetting';
import AddNewCard from '../../screens/PaymentSetting/addNewCard';
import ProfileInner from '../../screens/Profile/ProfileInner';
import Profile from '../../screens/Profile';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { metrics } from '../../assets/style';
import { ROUTES } from '../Routes';
import OrderTrack from '../../screens/OrderTrack';
import InviteFriends from '../../screens/InviteFriends';
import EarnedRewards from '../../screens/Rewards/EarnedRewards';
import AcceptedInvites from '../../screens/Rewards/AcceptedInvites';
import Notification from '../../screens/Notifications';
import CompletedOrder from '../../screens/CompletedOrders';
import CompletedOrderDetailed from '../../screens/CompletedOrders/detailed';
import BowlCreation from '../../screens/BowlCreation';
import Payment from '../../screens/Payment';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabStack = () => {
  return (
    // <Tab.Navigator
    //   screenOptions={{headerShown: false, unmountOnBlur: true}}
    //   tabBar={props => <TabBarComponent {...props} routesData={routesData} />}>
    //   <Tab.Screen name="Home" component={Home} />
    //   <Tab.Screen name="Favourites" component={Favourites} />
    //   <Tab.Screen
    //     name={ROUTES.CUSTOMMER_PROFILE_STACK}
    //     component={ProfileSubScreen}
    //   />
    //   <Tab.Screen name={ROUTES.CUSTOMMER_CART} component={MyCartSubScreen} />
    //   {/* <Tab.Screen name="ProfileInner" component={ProfileInner} />
    //   <Tab.Screen name="PaymentSetting" component={PaymentSetting} />
    //   <Tab.Screen name="add-new-card" component={AddNewCard} /> */}
    // </Tab.Navigator>

    // <SafeAreaView style={{ flex: 1,backgroundColor:"#fff"}}>

    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'white',
      headerShown: false,
      tabBarHideOnKeyboard: true,
      unmountOnBlur: true,
      tabBarLabelPosition: 'below-icon',
      tabBarLabelStyle: {
        fontSize: 12,
        // marginBottom: 5,
        marginBottom: 15,
      },
      tabBarStyle: {
        // height: 60,
        height: 70,
        alignItems: 'center',
        backgroundColor: '#132333',
        borderRadius: 50,
        justifyContent:"center"
      },
      tabBarItemStyle:{
        height: 70,
      }
    }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Restaurants',
         
          tabBarIcon: ({ color, size }) => (
           
            <Icon name="noodles" color={color} size={size} />
            
           
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={Favourites}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            // <View style={{alignItems: 'center'}}>
            <MaterialIcon name="favorite-outline" color={color} size={size} />
            // <Text
            // style={{color: '#ffffff', fontSize: 12, textAlign: 'center'}}>
            // Favourites
            // </Text>
            // </View>
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.CUSTOMMER_PROFILE_STACK}
        component={ProfileSubScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            //<View style={{alignItems: 'center'}}>
            <FontAwesomeIcon name="user-circle-o" color={color} size={size} />
            // {/* <Text
            //   style={{color: '#ffffff', fontSize: 12, textAlign: 'center'}}>
            //   Profile
            // </Text> */}
            //</View>
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.CUSTOMMER_CART}
        component={MyCartSubScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            // <View style={{alignItems: 'center'}}>
            <FontAwesome5Icon color={color} size={size} name="shopping-cart" />
            //   <Text
            //     style={{color: '#ffffff', fontSize: 12, textAlign: 'center'}}>
            //     Cart
            //   </Text>
            // </View>
          ),
        }}
      />
    </Tab.Navigator>
    //  </SafeAreaView>
  );
};

export default TabStack;

const ProfileSubScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileInner" component={ProfileInner} />
      <Stack.Screen name="order-track" component={OrderTrack} />
      <Stack.Screen name="invite-friends" component={InviteFriends} />
      <Stack.Screen name="earned-rewards" component={EarnedRewards} />
      <Stack.Screen name="accepted-invites" component={AcceptedInvites} />
      <Stack.Screen name="notification" component={Notification} />
      <Stack.Screen name="completed-order" component={CompletedOrder} />
      <Stack.Screen
        name="completed-order-details"
        component={CompletedOrderDetailed}
      />

      <Stack.Screen name="PaymentSetting" component={PaymentSetting} />
      <Stack.Screen name="add-new-card" component={AddNewCard} />
    </Stack.Navigator>
  );
};

const MyCartSubScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="MyCart" component={MyCart} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
};

const TabBarComponent = ({ navigation, state, routesData }) => {
  let { routes } = state;
  let currentIndex = state.index;
  const onNavigate = index => {
    const focused = index === currentIndex;
    const event = navigation.emit({
      type: 'tabPress',
      target: routes[index].key,
      canPreventDefault: true,
    });
    if (!focused && !event.defaultPrevented) {
      navigation.navigate(routes[index].name);
    }
  };

  let { user } = useSelector(state => state.user);
  return (
    // <View>
    <View style={styles.tabbar}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: metrics.deviceWidth * 0.95,
          backgroundColor: '#132333',
          borderRadius: 50,
          paddingHorizontal: 20,
          // paddingVertical: 20,
        }}>
        {routesData?.map((item, index) => (
          <TouchableWithoutFeedback
            style={styles.tab}
            onPress={() => onNavigate(index)}>
            <View>
              <View style={{ alignItems: 'center' }}>
                {item?.icon}
                <Text
                  style={{ color: '#ffffff', fontSize: 12, textAlign: 'center' }}>
                  {item?.text}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    // paddingBottom: 15,
    // paddingVertical: 10,
  },

  tab: {
    alignSelf: 'center',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const routesData = [
  {
    text: 'Restaurants',
    icon: <Icon name="noodles" size={25} color="#ffffff" />,
  },
  {
    text: 'Favourites',
    icon: <MaterialIcon name="favorite-outline" size={25} color="#ffffff" />,
  },
  {
    text: 'Profile',
    icon: <FontAwesomeIcon name="user-circle-o" size={25} color="#ffffff" />,
  },
  {
    text: 'Cart',
    icon: <FontAwesome5Icon name="shopping-cart" size={25} color="#ffffff" />,
  },
];
