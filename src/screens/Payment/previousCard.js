import {Box, Center, CheckIcon, FormControl, Input, Select} from 'native-base';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {IMAGES} from '../../assets/Images';

const PreviousCard = () => {
  return (
    <View style={{marginVertical: 20}}>
      <Text style={{fontSize: 16, fontFamily: 'Lato-Bold', color: '#132333'}}>
        Pick your card
      </Text>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Image source={IMAGES.VISA} style={{marginRight: 15}} />
          <Text style={{color: '#000000'}}>1003939</Text>
        </View>
      </View>

      {/* <Example /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 5,
    marginVertical: 20,
  },
});

export default PreviousCard;
