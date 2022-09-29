import React from 'react';
import {Button, CheckIcon, Select} from 'native-base';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {metrics} from '../../../assets/style';

const ReacyToPickUpOrderDetails = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: 60,
            justifyContent: 'center',
            paddingHorizontal: 20,
            backgroundColor: '#132333',
          }}>
          <View style={{position: 'relative'}}>
            <Icon
              name="chevron-left"
              size={30}
              color="#ffffff"
              style={{
                position: 'absolute',
                alignSelf: 'flex-start',
                zIndex: 1,
              }}
              onPress={() => navigation.navigate('Ready to pick up')}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#ffffff',
              }}>
              Order Details
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={
            {
              // paddingHorizontal: 20,
              // backgroundColor: 'red',
            }
          }>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: '#384B5D',
              }}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: '#ffffff',
                    marginBottom: 5,
                    fontFamily: 'Lato-Bold',
                    fontSize: 16,
                  }}>
                  Angel James
                </Text>
                <Text
                  style={{
                    color: '#ffffff',
                    marginBottom: 5,
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  Today at 12:33 AM
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: '#ffffff',
                    textAlign: 'right',
                    fontFamily: 'Lato-Bold',
                    marginBottom: 5,
                    fontSize: 14,
                  }}>
                  Order id#: 455
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomColor: '#CCCCCC',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderBottomWidth: 1,
            }}>
            <View flexDirection="row" alignItems="center">
              <Icon
                name="envelope"
                size={30}
                color="#000000"
                style={{
                  alignSelf: 'flex-start',
                  zIndex: 1,
                }}
                onPress={() => navigation.goBack()}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  marginHorizontal: 10,
                  color: '#353535',
                }}>
                {orderDetailsState?.custommerDetail?.email || ''}
              </Text>
            </View>
            <View>
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: '#132333',
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  minWidth: 90,
                  width: '100%',
                }}
                // onPress={() => navigation.navigate('Order Details')}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Lato-Bold',
                    color: '#353535',
                  }}>
                  Email
                </Text>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Lato-Bold',
                      // marginHorizontal: 10,
                      color: '#353535',
                    }}>
                    Send Email:
                  </Text>
                </View>

                <AntDesign
                  style={{flex: 1, textAlign: 'right'}}
                  name="edit"
                  size={20}
                  color="#000000"
                  // onPress={() => navigation.navigate('Confirmed orders')}
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Regular',
                  // marginHorizontal: 10,
                  marginTop: 5,
                  color: '#353535',
                }}>
                Hi, Please add more soup in my ramen thank you!
              </Text>
            </View>
          </View>

          <View>
            <View
              style={[
                styles.cardShadow,
                {backgroundColor: '#EDEDED', padding: 20},
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
                    Items
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Price
                  </Text>
                </View>
              </View>
            </View>
            <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
              {itemsList?.map((items, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#353535',
                        fontFamily: 'Lato-Bold',
                      }}>
                      {items?.itemName}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#353535',
                        fontFamily: 'Lato-Bold',
                      }}>
                      $ {items?.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View
              style={[
                styles.cardShadow,
                {backgroundColor: '#EDEDED', padding: 20},
              ]}>
              <View
                style={[
                  styles.cardContainer,
                  {
                    flexDirection: 'row',
                    marginBottom: 5,
                    justifyContent: 'space-between',
                  },
                ]}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Bowl 1
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    : $10.00
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.cardContainer,
                  {
                    flexDirection: 'row',
                    marginBottom: 5,
                    justifyContent: 'space-between',
                  },
                ]}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Add ons
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    : $6.00
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.cardContainer,
                  {
                    flexDirection: 'row',
                    marginBottom: 5,
                    justifyContent: 'space-between',
                  },
                ]}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Reward Code
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    : $4.00
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.cardContainer,
                  {
                    flexDirection: 'row',
                    marginBottom: 5,
                    justifyContent: 'space-between',
                  },
                ]}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Subtotal
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    : - $20.00
                  </Text>
                </View>
              </View>
              <View
                flexDirection="row"
                marginTop={10}
                justifyContent="flex-end">
                <Text
                  style={{
                    fontSize: 26,
                    marginRight: 10,
                    color: '#353535',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Total:
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    color: '#353535',
                    fontFamily: 'Lato-Bold',
                  }}>
                  $ 46.00
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              style={{fontSize: 14, fontFamily: 'Lato-Bold', color: '#2AC242'}}>
              Order Status: Picked Up
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const itemsList = [
  {itemName: 'Bowl1', price: 100},
  {itemName: 'Cucumber', price: 100},
  {itemName: 'Olives', price: 100},
  {itemName: 'Onions', price: 100},
  {itemName: 'Tomatos', price: 100},
  {itemName: 'Bowl', price: 100},
];

const addonsList = [
  {itemName: 'heniken Beer', price: 100},
  {itemName: 'Drink', price: 100},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#ffffff',
  },
  cardShadow: {
    // marginBottom: 10,
    // marginHorizontal: 10,

    borderRadius: 5,
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
  topHeader: {
    backgroundColor: '#384B5D',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  topHeaderText: {
    color: '#ffffff',
    fontFamily: 'Lato-Bold',
  },
});

export default ReacyToPickUpOrderDetails;
