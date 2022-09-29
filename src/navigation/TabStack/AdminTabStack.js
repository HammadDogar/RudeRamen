import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { metrics } from '../../assets/style';
import AdminDashboardScreen from '../../screens/AdminSide/Dashboard';
import AdminMenu from '../../screens/AdminSide/AdminMenu';
import AdminOrders from '../../screens/AdminSide/Orders';
import AdminPayments from '../../screens/AdminSide/AdminPayments';
import AdminProfile from '../../screens/AdminSide/AdminProfile';
import CreateMenu from '../../screens/AdminSide/AdminMenu/createMenu';
import EditScheduleSingle from '../../screens/AdminSide/ScheduleManagment/editScheduleManagmentSingle';
import IngredientsAndAddonsDetails from '../../screens/AdminSide/AdminMenu/ingredients';
import MenuList from '../../screens/AdminSide/AdminMenu/MenuList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');
const TabStack = () => {
  return (

    <Tab.Navigator
      // initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
        // tabBarShowLabel: false,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 12,
          // marginBottom: 5,
          marginBottom: 15,

        },
        tabBarStyle: {
          // height: 60,
          height: 70,

          // marginVertical: 20,
          alignItems: 'center',
          backgroundColor: '#132333',
          borderRadius: 50,
          justifyContent: "center"

        },
        tabBarItemStyle: {
          height: 70,
        }
      }}>
      <Tab.Screen
        name="admin-dashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <EntypoIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="admin-menu1"
        component={Nestedtab}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <EntypoIcon
              name="text-document-inverted"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="admin-orders"
        component={AdminOrders}
        options={{
          tabBarLabel: 'All Orders',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="admin-payments"
        component={AdminPayments}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcon name="payments" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="admin-profile"
        component={AdminProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="user-circle-o" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>

  );
};

export default TabStack;

const TabBarComponent = ({ navigation, state, routesData }) => {
  let { routes } = state;
  let currentIndex = state.index;
  const onNavigate = index => {
    const focused = index === currentIndex;

    if (routes[index].name === 'admin-orders') {
      navigation.navigate('admin-orders', {
        screen: 'New orders',
      });
    } else {
      const event = navigation.emit({
        type: 'tabPress',
        target: routes[index].key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) {
        navigation.navigate(routes[index].name);
      }
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

const Nestedtab = () => {
  return (
    <Stack.Navigator
      initialRouteName="admin-menu"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="admin-menu" component={AdminMenu} />

      <Stack.Screen
        name="edit-schedule-managment-single"
        component={EditScheduleSingle}
      />
      <Stack.Screen name="create-Menu" component={CreateMenu} />
      <Stack.Screen
        name="add-and-edit-ingredients-addons"
        component={IngredientsAndAddonsDetails}
      />
      <Stack.Screen name="menu-list" component={MenuList} />
    </Stack.Navigator>
  );
};
const styles = StyleSheet.create({
  tabbar: {
    height: 70,
    // marginBottom: 50,
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

const routesDataForAdmin = [
  {
    text: 'Home',
    icon: <EntypoIcon name="home" size={30} color="#ffffff" />,
  },
  {
    text: 'Menu',
    icon: (
      <EntypoIcon name="text-document-inverted" size={30} color="#ffffff" />
    ),
  },
  {
    text: 'All Orders',
    icon: <FontAwesomeIcon name="group" size={30} color="#ffffff" />,
  },
  {
    text: 'Payments',
    icon: <MaterialIcon name="payments" size={30} color="#ffffff" />,
  },
  {
    text: 'Profile',
    icon: <FontAwesomeIcon name="user-circle-o" size={30} color="#ffffff" />,
  },
];
