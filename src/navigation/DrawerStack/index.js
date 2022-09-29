import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useContext} from 'react';
import CustomDrawer from '../../components/CustomDrawer/CustomDrawer';
import {ROLEID} from '../../constants';
import Home from '../../screens/Home';
import AdminTabStack from '../TabStack/AdminTabStack';
import CustomerTabStack from '../TabStack';
import {useSelector} from 'react-redux';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';

const Drawer = createDrawerNavigator();
const DrawerStack = () => {
  const {user} = useContext(AuthenticationContext);
  // let {user} = useSelector(state => state.user);
  if (user?.userType === ROLEID.CUSTOMER) {
    return <CustomerDrawerStack />;
  } else {
    return <AdminDrawerStack />;
  }
};

export default DrawerStack;

const AdminDrawerStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      useLegacyImplementation
      drawerContent={props => <CustomDrawer role={ROLEID.ADMIN} />}
      initialRouteName="admin-dashboard2">
      <Drawer.Screen name="admin-dashboard2" component={AdminTabStack} />
    </Drawer.Navigator>
  );
};

const CustomerDrawerStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      useLegacyImplementation
      drawerContent={props => <CustomDrawer role={ROLEID.CUSTOMER} />}
      initialRouteName="Home">
      <Drawer.Screen name="Home" component={CustomerTabStack} />
    </Drawer.Navigator>
  );
};
