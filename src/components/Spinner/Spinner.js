import {Spinner} from 'native-base';
import React from 'react';
import {Text, View} from 'react-native';

const GenericSpinner = ({label, size, color, textColor, ...props}) => {
  return <Spinner size={size} color={`${color}`} {...props} />;
};
GenericSpinner.defaultProps = {
  size: 'lg',
  color: 'primary.blue',
};

export {GenericSpinner as Spinner};
