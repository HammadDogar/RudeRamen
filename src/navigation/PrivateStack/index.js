import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {ROLEID} from '../../constants';
import CustomerStack from '../CustomerStack';
import ResturantStack from '../ResturantStack';

const PrivateStack = ({roleId}) => {
  if (roleId === ROLEID.CUSTOMER) return <CustomerStack roleId={roleId} />;
  else if (roleId === ROLEID.ADMIN) {
    return <ResturantStack roleId={roleId} />;
  }
};

export default PrivateStack;
