import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Splash} from '../../screens';
import Authentication from '../../screens/Authentication';
import NewPassword from '../../screens/Authentication/newPassword';
import RecoverPassword from '../../screens/Authentication/recoverPassword';
import Verification from '../../screens/Authentication/verification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AuthStack = ({navigation}) => {
  const [asynValue, setAsyncValue] = useState(null);
  useEffect(() => {
    const getDataFromAsynStorage = async () => {
      let values = await getData();
      setAsyncValue(values);
    };
    getDataFromAsynStorage();
  });
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {asynValue === null && <Stack.Screen name="Splash" component={Splash} />}

      <Stack.Screen name="Authentication" component={Authentication} />
      <Stack.Screen name="RecoverPassword" component={RecoverPassword} />
      <Stack.Screen name="verification-user" component={Verification} />
      <Stack.Screen name="enter-new-password" component={NewPassword} />
    </Stack.Navigator>
  );
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('splash_run');
    if (value !== null) {
      // value previously stored
      return value;
    }
    return null;
  } catch (e) {
    // error reading value
  }
};

export default AuthStack;
