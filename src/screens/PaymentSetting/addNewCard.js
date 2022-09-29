import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NewCardEntry from '../Payment/newCardEntry';
import {TextField} from '../../components';
import {Button} from 'native-base';
import {metrics} from '../../assets/style';

const AddNewCard = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: 60,
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}>
          <View style={{position: 'relative'}}>
            <Icon
              name="chevron-left"
              size={30}
              color="#000000"
              style={{
                position: 'absolute',
                alignSelf: 'flex-start',
                zIndex: 1,
              }}
              onPress={() => navigation.navigate('PaymentSetting')}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#132333',
              }}>
              Payment Settings
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}>
          <View style={{marginVertical: 20}}>
            <Text
              style={{fontSize: 16, fontFamily: 'Lato-Bold', color: '#132333'}}>
              Enter Card Details
            </Text>
            <View style={{marginTop: 20}}>
              <View style={{marginBottom: 10}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Lato-Regular',
                    color: '#132333',
                  }}>
                  Card Number
                </Text>
                <TextField
                  Style={styles.inputParent}
                  Style_1={[styles.inputStyle]}
                  Style_2={[styles.inputIcon]}
                  placeholder={'Enter 10 digit Card Number'}
                  placeholderTextColor="#CDCDCD"
                  iconname={'user'}
                  secure={false}
                  size={22}
                  isIcon={false}
                  // keyboard={'email-address'}
                  keyboardType="numeric"
                  name="email"
                  //   onChangeText={handleChange('email')}
                  //   onBlur={handleBlur('email')}
                  //   value={values.email}
                  // keyboardType="email-address"
                />
              </View>
              <View style={{marginBottom: 10}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Lato-Regular',
                    color: '#132333',
                  }}>
                  Card holder name
                </Text>
                <TextField
                  Style={styles.inputParent}
                  Style_1={[styles.inputStyle]}
                  Style_2={[styles.inputIcon]}
                  placeholder={'User Name'}
                  placeholderTextColor="#CDCDCD"
                  iconname={'user'}
                  secure={false}
                  size={22}
                  isIcon={false}
                  keyboard={'email-address'}
                  name="email"
                  //   onChangeText={handleChange('email')}
                  //   onBlur={handleBlur('email')}
                  //   value={values.email}
                  keyboardType="email-address"
                />
              </View>
              <View style={{marginBottom: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginRight: 5}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Lato-Regular',
                        color: '#132333',
                      }}>
                      Expiry Date
                    </Text>
                    <TextField
                      Style={styles.inputParent}
                      Style_1={[styles.inputStyle]}
                      Style_2={[styles.inputIcon]}
                      placeholder={'mm/yy'}
                      placeholderTextColor="#CDCDCD"
                      iconname={'user'}
                      secure={false}
                      size={22}
                      isIcon={false}
                      keyboard={'email-address'}
                      name="email"
                      //   onChangeText={handleChange('email')}
                      //   onBlur={handleBlur('email')}
                      //   value={values.email}
                      keyboardType="email-address"
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 5}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Lato-Regular',
                        color: '#132333',
                      }}>
                      CVV
                    </Text>
                    <TextField
                      Style={styles.inputParent}
                      Style_1={[styles.inputStyle]}
                      Style_2={[styles.inputIcon]}
                      placeholder={'CVV'}
                      placeholderTextColor="#CDCDCD"
                      iconname={'user'}
                      secure={false}
                      size={22}
                      isIcon={false}
                      // keyboard={'email-address'}
                      name="email"
                      //   onChangeText={handleChange('email')}
                      //   onBlur={handleBlur('email')}
                      //   value={values.email}
                      // keyboardType="email-address"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View flexDirection="row" justifyContent="center" marginVertical={10}>
          <Button
            style={{
              backgroundColor: '#132333',
              width: metrics.deviceWidth * 0.95,
              height: 60,
            }}
            flexDirection="row"
            onPress={() => navigation.navigate('add-new-card')}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Lato-Bold',
                color: '#ffffff',
              }}>
              Save
            </Text>
          </Button>
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
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#132333',
  },

  inputIcon: {
    paddingLeft: 15,
    color: '#000000',
  },

  inputStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 55,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
    paddingHorizontal: 10,
    color: '#000000',
  },
});

export default AddNewCard;
