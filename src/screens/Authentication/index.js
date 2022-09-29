// import React from 'react';
// import {View, StyleSheet, Text, Image} from 'react-native';
// import {IMAGES} from '../../assets/Images';
// import {metrics} from '../../assets/style';

// const data = ['', '', ''];
// const App = () => {
//   return (
//     // <View style={styles.container}>
//     //   <View style={{flex: 1}}></View>
//     //   <View
//     //     style={{
//     //       flexDirection: 'row',
//     //       flex: 1,
//     //       backgroundColor: 'red',
//     //       justifyContent: 'center',
//     //     }}>
//     //     <View style={styles.oval} />
//     //   </View>
//     // </View>
//     <View style={styles.container}>
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: 'red',
//         }}>
//         <Image
//           style={styles.image}
//           // resizeMode="contain"
//           source={IMAGES.TESTING_BG}
//         />
//       </View>
//       <View
//         style={{
//           height: metrics.deviceHeight % 2,
//           flex: 1,
//           backgroundColor: 'blue',
//         }}>
//         {/* <Image source={IMAGES.TESTING_BG} /> */}
//       </View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: '#132333',
//   },
//   image: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   oval: {
//     width: 100,
//     height: metrics.deviceHeight,
//     borderRadius: 50,
//     backgroundColor: '#ffffff',
//     transform: [{scaleX: 4}],
//   },
// });

// export default App;

import {ScrollView} from 'native-base';
import React, {useDebugValue, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  useWindowDimensions,
  ImageBackground,
  View,
  Alert,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {IMAGES} from '../../assets/Images';
import {ViewWithBackgroundColor} from '../../components';
import Login from './login';
import Register from './register';
import RegisterAsResturant from './regsiterAsResturant';
import {app, auth, getCities} from '../../firebase/config';
import {
  getLogedInUserDetails,
  getUserDetailsWithemail,
} from '../../services/CloudFunction/auth';
import {onAuthStateChanged} from 'firebase/auth';
import {useDispatch} from 'react-redux';
import {success, USER_REQUEST} from '../../redux/types';

const Authentication = ({navigation}) => {
  const [screenState, setScreenState] = useState(1);
  let dispatch = useDispatch();
  const alertFunction = value => {
    setScreenState(value);
  };
  return (
    // <ImageBackground
    //   source={IMAGES.LOGIN_BOTTOM_BG}
    //   style={{flex: 1, resizeMode: 'cover'}}>
    <SafeAreaView style={styles.container}>
    <View style={[styles.container]}>
      <View style={[styles.wrapper]}>
        <View>
          <Image source={IMAGES.RUDE_RAMIN_LOGO} />
        </View>
        <ScrollView style={{width: '100%'}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'stretch',
                justifyContent: 'space-around',
                marginVertical: 20,
              }}>
              <Text
                style={[
                  styles.textStyle,
                  {color: `${screenState === 1 ? '#ffffff' : '#545D66'}`},
                ]}
                onPress={() => alertFunction(1)}>
                Login
              </Text>
              <Text
                style={[
                  styles.textStyle,
                  {
                    color: `${
                      screenState === 2 || screenState === 3
                        ? '#ffffff'
                        : '#545D66'
                    }`,
                  },
                ]}
                onPress={() => alertFunction(2)}>
                Sign Up
              </Text>
            </View>
            <View>
              {screenState === 1 && (
                <Login
                  setScreenState={setScreenState}
                  navigation={navigation}
                />
              )}
              {screenState === 2 && (
                <Register
                  setScreenState={setScreenState}
                  navigation={navigation}
                />
              )}
              {screenState === 3 && (
                <RegisterAsResturant
                  setScreenState={setScreenState}
                  navigation={navigation}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
    {/* // </ImageBackground> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132333',
    // position: 'relative',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  wrapper: {
    padding: 30,
    alignItems: 'center',
  },
});

export default Authentication;
