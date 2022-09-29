import React, {useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {IMAGES} from '../../assets/Images';
import {metrics} from '../../assets/style';
import {
  Button,
  ImageBackground,
  ViewWithBackgroundColor,
  Text,
  View,
} from '../../components';
import {Splash2} from './Splash2';
import {Splash3} from './Splash3';
import {Splash4} from './Splash4';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({navigation}) => {
  const [screen, setScreen] = useState(0);
  const onPressLearnMore = no => {
    setScreen(no);
  };

  return (
    <>
      {screen === 0 && (
        <Spalsh1 setScreen={setScreen} navigation={navigation} />
      )}
      {screen === 1 && (
        <Splash2 setScreen={setScreen} navigation={navigation} />
      )}
      {screen === 2 && (
        <Splash3 setScreen={setScreen} navigation={navigation} />
      )}
      {screen === 3 && (
        <Splash4 setScreen={setScreen} navigation={navigation} />
      )}
    </>
  );
};

const Spalsh1 = ({setScreen}) => {
  const storeData = async value => {
    try {
      await AsyncStorage.setItem('splash_run', 'true');
      setScreen(1);
    } catch (e) {
      // saving error
    }
  };
  return (
    <View>
      <ImageBackground source={IMAGES.RUDE_RAMIN_SPLASH_1} resizeMode="cover">
        <ViewWithBackgroundColor bgColor="#000000c0">
          <View
            paddingTop={40}
            paddingBottom={40}
            containerStyle={styles?.spaceBetween}>
            <View
              paddingLeft={20}
              paddingRight={20}
              width={metrics.deviceWidth * 0.7}>
              <Text
                color="#ffffff"
                size={30}
                align="center"
                fontFamily="Lato-Regular">
                Find your Favourite Ramen
              </Text>

              <Text
                color="#ffffff"
                size={18}
                align="center"
                fontFamily="Lato-Regular"
                marginTop={8}>
                experiencing the amazing taste of various ramen
              </Text>
            </View>

            <Pressable
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 50,
                borderRadius: 10,
                backgroundColor: '#FFFFFF',
              }}
              onPress={() => {
                storeData();
              }}>
              <Text
                color="#000000"
                size={20}
                align="center"
                fontFamily="Lato-Bold"
                style={styles.text}>
                Get Started
              </Text>
            </Pressable>
          </View>
        </ViewWithBackgroundColor>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  spaceBetween: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  getStartedButton: {
    height: 35,
    width: 100,
  },
});

export {Splash};
