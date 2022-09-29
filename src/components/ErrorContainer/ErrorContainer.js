import React from 'react';
import styled from 'styled-components';
import {View} from '../View';

export const ErrorContainer = ({children}) => {
  return <StyledErrorContainer>{children}</StyledErrorContainer>;
};

const StyledErrorContainer = styled(View)`
  color: red;
  background-color: red;
  max-width: 300px;
  align-items: center;
  align-self: center;
  margin-top: 10;
  margin-bottom: 10;
`;
