import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import AdminDashboardScreen from '../../screens/AdminSide/Dashboard';
import CompletedOrder from '../../screens/AdminSide/Orders/CompletedOrders';
import CompletedOrderDetails from '../../screens/AdminSide/Orders/CompleteOrderDetails';
import ConfirmOrderDetails from '../../screens/AdminSide/Orders/ConfirmOrderDetails';
import NewOrderDetails from '../../screens/AdminSide/Orders/NewOrderDetails';
import Notification from '../../screens/Notifications';
import OrderTrack from '../../screens/OrderTrack';
import DrawerStack from '../DrawerStack';
import ScheduleManagment from '../../screens/AdminSide/ScheduleManagment';
import EditSchedule from '../../screens/AdminSide/ScheduleManagment/editScheduleManagment';
import EditScheduleSingle from '../../screens/AdminSide/ScheduleManagment/editScheduleManagmentSingle';
import CreateMenu from '../../screens/AdminSide/AdminMenu/createMenu';
import IngredientsAndAddonsDetails from '../../screens/AdminSide/AdminMenu/ingredients';
import MenuList from '../../screens/AdminSide/AdminMenu/MenuList';
import AdminOrders from '../../screens/AdminSide/Orders';
const Stack = createStackNavigator();

const ResturantStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="admin-dashboard1" component={DrawerStack} />
      <Stack.Screen name="completed-order" component={CompletedOrder} />
      <Stack.Screen name="order-track" component={OrderTrack} />
      <Stack.Screen name="notification" component={Notification} />
      <Stack.Screen name="Order Details" component={NewOrderDetails} />
      <Stack.Screen
        name="confirm-order-details"
        component={ConfirmOrderDetails}
      />
      <Stack.Screen
        name="complete-order-details"
        component={CompletedOrderDetails}
      />
      <Stack.Screen name="schedule-managment" component={ScheduleManagment} />

      <Stack.Screen
        name="add-and-edit-ingredients-addons"
        component={IngredientsAndAddonsDetails}
      />
      <Stack.Screen name="edit-schedule-managment" component={EditSchedule} />
      <Stack.Screen
        name="edit-schedule-managment-single"
        component={EditScheduleSingle}
      />
      <Stack.Screen name="create-Menu" component={CreateMenu} />
      {/* <Stack.Screen
        name="add-and-edit-ingredients-addons"
        component={IngredientsAndAddonsDetails}
      /> */}
      <Stack.Screen name="menu-list" component={MenuList} />
    </Stack.Navigator>
  );
};

export default ResturantStack;
