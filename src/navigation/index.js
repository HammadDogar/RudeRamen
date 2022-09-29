import {NavigationContainer} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AuthStack from './AuthStack';
import PrivateStack from './PrivateStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase/config';
import {getUserDetailsWithemail} from '../services/CloudFunction/auth';
import {useAuth} from './AuthProvide';
import {success, USER_REQUEST} from '../redux/types';
import {AuthenticationContext} from '../services/AuthServices/authServicecontext';

const RootNavigation = () => {
  const [state, setState] = useState(null);
  // let dispatch = useDispatch();
  const {isAuthenticated, user} = useContext(AuthenticationContext);

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('rude_ramen');
  //     if (jsonValue !== null) {
  //       setState(JSON.parse(jsonValue));
  //     } else {
  //       setState(null);
  //     }
  //   } catch (e) {
  //     setState(null);
  //     // error reading value
  //   }
  // };

  // const storeData = async value => {
  //   try {
  //     const jsonValue = JSON.stringify(value);
  //     await AsyncStorage.setItem('rude_ramen', jsonValue);
  //   } catch (e) {
  //     // saving error
  //   }
  // };

  // const removeData = async () => {
  //   try {
  //     await AsyncStorage.removeItem('rude_ramen');
  //   } catch (e) {
  //     // saving error
  //   }
  // };

  return (
    <NavigationContainer>
      {user !== null ? <PrivateStack roleId={user?.userType} /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigation;
