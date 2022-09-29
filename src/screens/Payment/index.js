import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {IMAGES} from '../../assets/Images';
import {TextField} from '../../components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Button} from 'native-base';
import {metrics} from '../../assets/style';
import PreviousCard from './previousCard';
import NewCardEntry from './newCardEntry';
const Payment = ({navigation}) => {
  const [view, setView] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: 60,
            justifyContent: 'center',
            paddingHorizontal: 20,
            // backgroundColor: 'red',
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
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#132333',
              }}>
              Payment Method
            </Text>
          </View>
        </View>
        <View
          style={{
            // backgroundColor: 'red',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View style={{paddingHorizontal: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 20,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#132333',
                  fontFamily: 'Lato-Bold',
                }}>
                Amount Payable
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#132333',
                  fontFamily: 'Lato-Bold',
                }}>
                $34{' '}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderColor: '#132333',
                borderWidth: 2,
                borderRadius: 50,
                height: 60,
              }}>
              <Button
                style={[
                  view === 0 ? styles.activeButtonBg : styles.inActiveButtonBg,
                  {
                    flex: 1,
                    flexDirection: 'column',

                    borderRadius: 50,
                  },
                ]}
                key={'xs'}
                size={'xs'}
                onPress={() => setView(0)}>
                <Text
                  style={[
                    view === 0
                      ? styles.activeButtonText
                      : styles.inActiveButtonText,
                    {fontFamily: 'Lato-Bold'},
                  ]}>
                  Pick your card
                </Text>
              </Button>
              <Button
                style={[
                  view === 1 ? styles.activeButtonBg : styles.inActiveButtonBg,
                  {
                    flex: 1,
                    borderRadius: 50,
                    fontSize: 18,
                  },
                ]}
                key={'xs'}
                size={'xs'}
                onPress={() => setView(1)}>
                <Text
                  style={[
                    view === 1
                      ? styles.activeButtonText
                      : styles.inActiveButtonText,
                    {fontFamily: 'Lato-Bold'},
                  ]}>
                  Add new card
                </Text>
              </Button>
            </View>

            <ScrollView
              contentContainerStyle={
                {
                  // paddingHorizontal: 20,
                  // backgroundColor: 'red',
                }
              }>
              {view === 0 ? <PreviousCard /> : <NewCardEntry />}
            </ScrollView>
          </View>
          <View flexDirection="row" justifyContent="center" marginVertical={10}>
            <Button
              style={{
                backgroundColor: '#132333',
                width: metrics.deviceWidth * 0.95,
                height: 60,
              }}
              flexDirection="row"
              onPress={() => navigation.navigate('Payment')}
              rightIcon={
                <FeatherIcon
                  name="arrow-right"
                  style={{textAlign: 'right'}}
                  size={30}
                  color="#ffffff"
                />
              }>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  color: '#ffffff',
                }}>
                Pay
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: '#ffffff',
  //   },
  activeButtonBg: {
    backgroundColor: '#132333',
  },
  inActiveButtonBg: {
    backgroundColor: '#ffffff',
  },
  activeButtonText: {
    color: '#ffffff',
  },
  inActiveButtonText: {
    color: '#132333',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E6E6E6',
    borderBottomWidth: 2,
  },

  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
  mainCardView: {
    // height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    // shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // padding: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    // paddingLeft: 16,
    // paddingRight: 14,
    // marginTop: 6,
    // marginBottom: 6,
    // marginLeft: 16,
    // marginRight: 16,
  },
  subCardView: {
    height: 80,
    width: 80,
    // borderRadius: 25,
    // backgroundColor: '#000000',
    // borderColor: '#000000',
    // borderWidth: 1,
    // borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#132333',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    // marginVertical: 5,
  },

  checkoutBoxContainer: {
    backgroundColor: '#132333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    // marginVertical: 5,
  },
});

export default Payment;
