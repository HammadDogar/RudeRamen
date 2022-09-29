import {useNavigation} from '@react-navigation/native';
import {CheckIcon, Select} from 'native-base';
import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DateTimePicker from '@react-native-community/datetimepicker';
import {remoteDateToDashFormate} from '../../../utils/utils';

const AdminPayments = () => {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showDatepicker = (type, clickState) => {
    // showMode(type);
    setShow(true);
    // setClickState(clickState);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setStartDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: 60,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            backgroundColor: '#132333',
          }}>
          <EntypoIcon
            name="menu"
            size={30}
            color="#ffffff"
            onPress={() => navigation.openDrawer()}
          />

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode={'date'}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#ffffff',
              }}>
              Payments
            </Text>
            {/* <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#ffffff',
              }}>
              Texas, NV
            </Text> */}
          </View>

          <Ionicons
            name="notifications"
            size={30}
            color="#ffffff"
            onPress={() => navigation.navigate('notification')}
          />
        </View>

        {/* <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
          <Select
            accessibilityLabel="Choose Service"
            placeholder="Day"
            borderColor={'primary.blue'}
            backgroundColor={'primary.white'}
            color={'primary.blue'}
            width={'100%'}
            placeholderTextColor="primary.blue"
            maxW="200"
            // selectedValue="mon"
            height={'12'}
            fontSize={'md'}
            _selectedItem={{
              bg: 'primary.blue',
              _text: {
                color: 'primary.white',
              },
              endIcon: <CheckIcon color="primary.white" size="5" />,
            }}
            mt={1}>
            <Select.Item label="Today" value="mon" />
            <Select.Item label="Tomorrow" value="tues" />
          </Select>
        </View> */}
        <View style={{margin: 15}}>
          <Text style={styles.formLable}>Select Date </Text>
          <Pressable
            style={[styles.formInputwraper]}
            onPress={() => showDatepicker('date')}>
            <View style={styles.formInputContainer}>
              <Text style={styles.formLable}>
                {remoteDateToDashFormate(startDate.toLocaleString())}
              </Text>
            </View>
          </Pressable>
        </View>

        <View>
          <View
            style={[
              styles.cardShadow,
              {backgroundColor: '#132333', padding: 10},
            ]}>
            <View
              style={[
                styles.cardContainer,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#ffffff',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Order id#
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#ffffff',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Customer name
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#ffffff',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Status
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#ffffff',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Amount
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              {
                padding: 20,
                borderBottomColor: '#E7E7E7',
                borderBottomWidth: 1,
              },
            ]}>
            <View
              style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
              <View style={{alignItems: 'center', flex: 1}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#353535',

                    fontFamily: 'Lato-Regular',
                  }}>
                  01
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#353535',
                    fontFamily: 'Lato-Regular',
                  }}>
                  Anthony
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#2AC242',
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#2AC242',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      fontFamily: 'Lato-Bold',
                      color: '#ffffff',
                    }}>
                    Picked up
                  </Text>
                </View>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#353535',
                    fontFamily: 'Lato-Regular',
                  }}>
                  $ 32.00
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.cardShadow,
              {backgroundColor: '#EDEDED', marginVertical: 20, padding: 20},
            ]}>
            <View
              style={[
                styles.cardContainer,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#353535',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Total Earnings:
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#353535',
                    fontFamily: 'Lato-Bold',
                  }}>
                  $ 1024
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  cardShadow: {
    // marginBottom: 10,
    // marginHorizontal: 10,

    // borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  cardContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  formInputwraper: {
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  formLable: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    color: '#000000',
  },
  formInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 20,
    position: 'relative',
    alignItems: 'center',
    height: 50,
  },
});

export default AdminPayments;
