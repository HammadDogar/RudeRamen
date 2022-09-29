import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components';

const StyledText = styled(Text)`
  color: ${props => props.color};
  font-size: ${props => props.size};
  text-align: ${props => props.align};
  font-family: '${props => props.fontFamily}';
  margin-top: ${props => props.marginTop};
  margin-bottom: ${props => props?.marginBottom};
  margin-left: ${props => props?.marginLeft};
  margin-right: ${props => props?.marginRight};
  padding-top: ${props => props.paddingTop};
  padding-bottom: ${props => props?.paddingBottom};
  padding-left: ${props => props?.paddingLeft};
  padding-right: ${props => props?.paddingRight};
`;

const GenericText = ({children, color, size, ...props}) => {
  return (
    <StyledText {...props} size={size} color={color}>
      {children}
    </StyledText>
  );
};

GenericText.defaultProps = {
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,

  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

export {GenericText as Text};
