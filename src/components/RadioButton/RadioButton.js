import React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';

const RadioButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={{marginVertical: 5}}>
      <View style={{flexDirection: 'row', alignItems: 'center', zIndex: 10000}}>
        <View
          style={[
            {
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
            },
            props.style,
          ]}>
          {props.selected ? (
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#000',
              }}
            />
          ) : null}
        </View>
        {props?.label && (
          <Text
            style={{
              marginHorizontal: 10,
              fontSize: 30,
              color: '#484848',
              fontFamily: 'Lato-Bold',
              fontSize: 20,
            }}>
            {props?.label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export {RadioButton};
