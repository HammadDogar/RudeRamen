import {Button} from 'native-base';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {IMAGES} from '../../assets/Images';
import {metrics} from '../../assets/style';
import {TextField} from '../../components';

const InviteFriends = ({navigation}) => {
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
              onPress={() => navigation.navigate('Profile')}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#132333',
              }}>
              Invite Friends
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 0.2}}>
                <Image
                  resizeMode="cover"
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 5,
                  }}
                  source={IMAGES.ENVELOP_IMAGE}
                  // flex={1}
                />
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Lato-Bold',
                    color: '#132333',
                    marginHorizontal: 10,
                  }}>
                  Send via email
                </Text>
              </View>
            </View>
            <View style={{flex: 1}}>
              <TextField
                Style={styles.inputParent}
                Style_1={[styles.inputStyle]}
                Style_2={[styles.inputIcon]}
                placeholder={'Enter email address'}
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
            <View
              flexDirection="row"
              justifyContent="center"
              marginVertical={10}>
              <Button
                style={{
                  backgroundColor: '#132333',
                  width: metrics.deviceWidth * 0.9,
                  height: 60,
                }}
                flexDirection="row"
                onPress={() => navigation.navigate('Profile')}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Lato-Bold',
                    color: '#ffffff',
                  }}>
                  Send
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
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
    borderColor: '#CECECE',
  },

  inputIcon: {
    paddingLeft: 15,
    color: '#000000',
  },

  inputStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 55,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000000',
  },
});

export default InviteFriends;
