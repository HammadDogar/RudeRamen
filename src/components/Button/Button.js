import React from 'react';
import {Button} from 'react-native';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  width: ${props => props.width};
`;

const GenericButton = ({children, onPress, ...props}) => {
  return <StyledButton onPress={onPress} {...props} />;
};

GenericButton.defaultProps = {};

export {GenericButton as Button};
