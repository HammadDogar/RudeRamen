import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';

const StyledViewBackgroundColor = styled(View)`
  height: ${props => props.height};
  background-color: ${props => props.bgColor};
`;

const ViewBackgroundColor = ({...props}) => {
  return <StyledViewBackgroundColor {...props} />;
};

ViewBackgroundColor.defaultProps = {
  height: '100%',
};

export {ViewBackgroundColor as ViewWithBackgroundColor};
