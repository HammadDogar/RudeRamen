import React from 'react';
import {TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const TextField = ({
  onChangeHandler,
  placeholder,
  type,
  placeholderTextColor,
  isIcon,
  iconPosition,
  iconLib,
  extraIconObject,
  ...props
}) => {
  return (
    // <TextInput
    //   onChangeText={onChangeHandler}
    //   value={number}
    //   placeholder={placeholder}
    //   keyboardType={type}
    //   {...props}
    // />
    <View style={props.Style}>
      {isIcon &&
        iconPosition === 'left' &&
        (iconLib === 'MaterialIcons' ? (
          <MaterialIcons
            style={[props.Style_2]}
            name={props.iconname}
            size={props.size}
            color={props.placeholder_color}
          />
        ) : (
          <Icon
            style={[props.Style_2]}
            name={props.iconname}
            size={props.size}
            color={props.placeholder_color}
          />
        ))}

      <TextInput
        style={[props.Style_1]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
        value={props.value}
        keyboardType={props.keyboard}
        secureTextEntry={props.secure}
        {...props}
      />
      {extraIconObject && (
        <Ionicons
          style={[extraIconObject.Style_2]}
          name={extraIconObject.iconname}
          size={extraIconObject.size}
          // color={extraIconObject.placeholder_color}
          onPress={extraIconObject.onPress}
        />
      )}

      {isIcon &&
        iconPosition === 'right' &&
        (iconLib === 'MaterialIcons' ? (
          <MaterialIcons
            style={[props.Style_2]}
            name={props.iconname}
            size={props.size}
            color={props.placeholder_color}
          />
        ) : (
          <Icon
            style={[props.Style_2]}
            name={props.iconname}
            size={props.size}
            color={props.placeholder_color}
          />
        ))}
    </View>
  );
};

TextField.defaultProps = {
  isIcon: true,
  iconPosition: 'left',
  iconLib: 'FontAwesome',
  extraIconObject: null,
};

export {TextField};
