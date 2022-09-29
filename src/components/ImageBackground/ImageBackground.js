import React from 'react';
import {ImageBackground} from 'react-native';
import styled from 'styled-components';

const StyledImageBackground = styled(ImageBackground)`
  height: ${props => props.height};
`;

const GenericImageBackground = ({...props}) => {
  return <StyledImageBackground {...props} />;
};

GenericImageBackground.defaultProps = {
  height: '100%',
};

export {GenericImageBackground as ImageBackground};
