import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';

const StyledView = styled(View)`
  padding-top: ${props => props.paddingTop};
  padding-bottom: ${props => props.paddingBottom};
  padding-left: ${props => props.paddingLeft};
  padding-right: ${props => props.paddingRight};

  margin-top: ${props => props.marginTop};
  margin-bottom: ${props => props.marginBottom};
  margin-left: ${props => props.marginLeft};
  margin-right: ${props => props.marginRight};

  /* height: ${props => props.height}; */
  width: ${props => props.width};
`;

const GenericView = ({children, ...props}) => {
  return (
    <StyledView {...props} style={props?.containerStyle}>
      {children}
    </StyledView>
  );
};

GenericView.defaultProps = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,

  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,

  height: 'auto',
  width: 'auto',
};

export {GenericView as View};
