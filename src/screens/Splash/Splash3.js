import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Alert,
  ImageBackground,
} from 'react-native';
import {IMAGES} from '../../assets/Images';
import Icon from 'react-native-vector-icons/AntDesign';

const Splash3 = ({setScreen, navigation}) => {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: 'column',
        },
      ]}>
      <Image
        style={{width: 400, height: 300, marginVertical: 50}}
        resizeMode="contain"
        source={IMAGES.RUDE_RAMIN_SPLASH_3}
      />
      <View>
        <Text style={{fontSize: 20, color: '#ffffff', textAlign: 'center'}}>
          Prepare your bowl
        </Text>
        <Text style={{fontSize: 20, color: '#ffffff', textAlign: 'center'}}>
          Choose your favourite bowl to order and get it ready to quench your
          starve
        </Text>
      </View>
      <Text
        style={styles.bottomSkipButton}
        onPress={() => navigation.navigate('Authentication')}>
        Skip
      </Text>
      <ImageBackground source={IMAGES.SKIP_BG} style={styles.bottomNextButton}>
        <View
          style={{
            width: 100,
            height: 100,
            position: 'relative',
          }}>
          <Icon
            name="arrowright"
            size={45}
            color="#000000"
            onPress={() => setScreen(3)}
            style={{position: 'absolute', bottom: 10, right: 10}}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#132333',
    position: 'relative',
  },
  bottomSkipButton: {
    position: 'absolute',
    color: '#ffffff',
    padding: 20,
    bottom: 0,
    left: 0,
  },

  bottomNextButton: {
    position: 'absolute',
    color: '#000000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    bottom: 0,
    right: 0,
  },
});

export {Splash3};
