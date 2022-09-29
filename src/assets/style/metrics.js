import {Dimensions, Platform, NativeModules} from 'react-native';

const {width, height} = Dimensions.get('window');

const deviceWidth = width < height ? width : height;
const deviceHeight = width < height ? height : width;

// Dynamique value for responsive elemenet ( margin , Radius , sizeImage .....)
const metrics = {
  deviceWidth,
  deviceHeight,
  tinyMargin: deviceWidth * 0.015,
  tinyPadding: deviceWidth * 0.015,
  smallMargin: deviceWidth * 0.03,
  smallPadding: deviceWidth * 0.03,
  baseMargin: deviceWidth * 0.05,
  basePadding: deviceWidth * 0.05,
  doubleMargin: deviceWidth * 0.1,
  doublePadding: deviceWidth * 0.1,
  statusBarHeight: Platform.OS === 'ios' ? 22 : NativeModules.HEIGHT,
  // navBarHeight: (Platform.OS === 'ios') ? 64 + 22 : 64,

  border: {
    largeBorder: deviceWidth * 0.005,
    mediumBorder: deviceWidth * 0.003,
    regularBorder: deviceWidth * 0.002,
    smallBorder: deviceWidth * 0.001,
  },

  radius: {
    extraRadius: deviceWidth * 0.06,
    doubleRadius: deviceWidth * 0.03,
    regularRadius: deviceWidth * 0.012,
    mediumRadius: deviceWidth * 0.009,
    smallRadius: deviceWidth * 0.005,
  },
};

export default metrics;
