import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TextField} from '../../components';

const NewCardEntry = () => {
  return (
    <View style={{marginVertical: 20}}>
      <Text style={{fontSize: 16, fontFamily: 'Lato-Bold', color: '#132333'}}>
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
                keyboardType="numeric"
                name="email"
                //   onChangeText={handleChange('email')}
                //   onBlur={handleBlur('email')}
                //   value={values.email}
                // keyboardType="email-address"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default NewCardEntry;
