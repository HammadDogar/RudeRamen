import React from 'react';
import {Pressable, Text, View} from 'react-native';

const Splash = ({navigation}) => {
  return (
    <View>
      <Text>Splash</Text>
      <Pressable
        // style={styles.buttonStyle}
        onPress={() => navigation.navigate('Profile')}>
        <Text>Go To Detail Screen</Text>
      </Pressable>
    </View>
  );
};

export default Splash;
