import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {IMAGES} from '../../assets/Images';
import {metrics} from '../../assets/style';
import {Button} from 'native-base';

const PaymentSetting = ({navigation}) => {
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
              Payments
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            padding: 20,
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <Image
              resizeMode="cover"
              style={{
                flex: 1,
                borderRadius: 5,
                marginBottom: 10,
              }}
              source={IMAGES.CREDIT_CARD}
            />
            <Image
              resizeMode="cover"
              style={{
                borderRadius: 5,
                marginBottom: 10,
              }}
              source={IMAGES.CREDIT_CARD}
            />

            <Image
              resizeMode="cover"
              style={{
                borderRadius: 5,
                marginBottom: 10,
              }}
              source={IMAGES.CREDIT_CARD}
            />
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
              Add Card
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
});

export default PaymentSetting;
