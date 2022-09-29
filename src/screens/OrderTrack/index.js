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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const OrderTrack = ({navigation}) => {
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
              Track Orders
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            padding: 20,
          }}>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: '#223040',
              }}>
              Order Id #:{' '}
              <Text style={{fontFamily: 'Lato-Regular'}}>542135</Text>
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Lato-Bold',
                marginBottom: 10,
                color: '#223040',
              }}>
              Estimated Preparation time:{' '}
              <Text style={{fontFamily: 'Lato-Regular'}}> 20 min</Text>
            </Text>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons
                name="truck-delivery"
                size={50}
                color="#000000"
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Lato-Bold',
                  color: '#223040',
                  marginHorizontal: 10,
                }}>
                Pick up time:{' '}
                <Text style={{fontFamily: 'Lato-Regular'}}>
                  14:00 PM - 14:10 PM
                </Text>
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Lato-Bold',
                  marginBottom: 10,
                  color: '#223040',
                }}>
                Pick up address:{' '}
                <Text style={{fontFamily: 'Lato-Regular'}}>
                  {' '}
                  2009 Wellington Street Ontario Toronto
                </Text>
              </Text>
            </View>

            <View style={{flex: 1}}>
              {orderState?.map((data, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 5,
                  }}>
                  <View
                    style={[
                      styles.iconContainer,
                      data.flag === true && styles.orderActiveStateStyle,
                    ]}>
                    <Text
                      style={{
                        // marginHorizontal: 10,
                        fontSize: 16,
                        color: '#223040',
                        fontFamily: 'Lato-Bold',
                      }}>
                      {data.flag ? (
                        <Icon
                          name="check"
                          // size={20}
                          color="#000000"
                          onPress={() => navigation.navigate('Profile')}
                        />
                      ) : (
                        index + 1
                      )}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginHorizontal: 10,
                      flex: 1,
                      fontSize: 16,
                      color: '#223040',
                      fontFamily: 'Lato-Regular',
                    }}>
                    {data?.tittle}
                  </Text>
                </View>
              ))}
            </View>
            {/* <View style={{marginTop: 10}}>
              <View style={styles.cardShadow}>
                <View style={styles.cardContainer}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#223040',
                      fontSize: 20,
                      fontFamily: 'Lato-Bold',
                      fontWeight: 'bold',
                      marginVertical: 10,
                    }}>
                    Need any Support?
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#223040',
                      fontSize: 18,
                      fontFamily: 'Lato-Regular',
                      marginVertical: 10,
                    }}>
                    lorem ipsumdoler sit amet lol to do federation all new lorem
                    ipsumdoler sit
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#F04C4C',
                      fontSize: 20,
                      fontFamily: 'Lato-Bold',
                      fontWeight: 'bold',
                      marginVertical: 10,
                    }}>
                    Contact Us
                  </Text>
                </View>
              </View>
            </View> */}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const orderState = [
  {
    id: 1,
    flag: true,
    tittle: 'Order has been placed',
  },
  {
    id: 1,
    flag: false,
    tittle: 'Your food is cooking',
  },
  {
    id: 1,
    flag: false,
    tittle: 'Food is ready to pick up',
  },
  {
    id: 1,
    flag: false,
    tittle: 'Thank you for Picking up your order ',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    // backgroundColor: 'red',
  },

  wrapper: {
    marginVertical: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    width: 48,
    height: 48,
    borderRadius: 50,
  },
  orderActiveStateStyle: {
    borderWidth: 6,
    borderColor: '#132333',
  },

  cardShadow: {
    borderRadius: 5,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor: '#E0E0E0',
    borderWidth: 2,
  },
});

export default OrderTrack;
