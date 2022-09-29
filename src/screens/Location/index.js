import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {metrics} from '../../assets/style';
import {TextField} from '../../components';

const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
const Location = props => {
  let {navigation} = props;
  return (
    <View style={styles.container}>
      <View style={styles.addressDetailBox}>
        {/* <View style={{marginVertical: 15}}>
          <SelectDropdown
            data={countries}
            onSelect={(selectedItem, index) => {
            }}
            defaultButtonText="Area"
            buttonStyle={{
              backgroundColor: '#FFFFFF',
              alignSelf: 'stretch',
              width: '100%',
              borderRadius: 5,
            }}
            buttonTextStyle={{}}
            renderDropdownIcon={() => (
              <Icon name="chevron-down" size={20} color="#000000" />
            )}
            dropdownIconPosition="right"
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
            }}
          />
        </View> */}
        <View style={{marginVertical: 15}}>
          <TextField
            Style={styles.inputParent}
            Style_1={[styles.inputStyle]}
            Style_2={[styles.inputIcon]}
            placeholder={'Add address'}
            placeholderTextColor="#A5A5A5"
            iconname={'gps-fixed'}
            secure={false}
            isIcon={true}
            iconLib="MaterialIcons"
            iconPosition={'right'}
            size={18}
            keyboard={'email-address'}
          />
        </View>
        <View style={{marginVertical: 15}}>
          <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 50,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
            }}
            onPress={() => navigation.navigate('Home')}>
            <Text
              color="#000000"
              style={{
                fontSize: 20,
                fontFamily: 'Lato-Regular',
                fontWeight: 'bold',
                color: '#000000',
              }}
              // size={20}
              // align="center"
              // fontFamily="Lato-Bold"
              // style={styles.text}
            >
              Search
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // position: 'relative',
  },

  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E6E6E6',
    borderWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: metrics.basePadding,
  },

  inputStyle: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    ...Platform.select({
      ios: {
        height: 60,
      },
    })
  },
  inputIcon: {
    color: '#000000',
  },

  addressDetailBox: {
    backgroundColor: '#132333',
    // height: 400,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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

export default Location;
