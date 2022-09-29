import {ScrollView} from 'native-base';
import React, {useState} from 'react';
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

const Authentication = ({navigation}) => {
  const [screenState, setScreenState] = useState(1);
  const alertFunction = value => {
    setScreenState(value);
  };
  return (
    <ImageBackground
      source={IMAGES.LOGIN_BOTTOM_BG}
      style={{flex: 1, resizeMode: 'cover'}}>
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
                    {color: `${screenState === 2 ? '#ffffff' : '#545D66'}`},
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
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#132333',
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
