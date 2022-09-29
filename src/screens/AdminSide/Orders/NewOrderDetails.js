import React, {useEffect, useState} from 'react';
import {CheckIcon, Select} from 'native-base';

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
import {notifyMessage, showDateOrToday} from '../../../utils/utils';
import moment from 'moment';
import {ORDER_STATUS_IDS, ORDER_STATUS_WITH_LABELS} from '../../../constants';
import {Spinner} from '../../../components';
import {updateOrderStatus} from '../../../services/CloudFunction/ordersManagment';

const NewOrderDetails = ({navigation, route}) => {
  let {orderDetails} = route.params;
  const [orderDetailsState, setOrderDetailsState] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

  console.log('orderDetails:::::', JSON.stringify(orderDetails, null, 2));

  useEffect(() => {
    setOrderDetailsState(orderDetails);
  }, [orderDetails]);

  const changeStatusHandler = values => {
    console.log('values', values);

    let updatedOrderPayload = {
      ...orderDetailsState,
      orderStatus: values,
      orderStatusName:
        values === ORDER_STATUS_IDS.CONFIRM_ORDER
          ? ORDER_STATUS_WITH_LABELS.CONFIRM_ORDER
          : values === ORDER_STATUS_IDS.NEW_ORDER
          ? ORDER_STATUS_WITH_LABELS.NEW_ORDER
          : values === ORDER_STATUS_IDS.PICKED_UP
          ? ORDER_STATUS_WITH_LABELS.PICKED_UP
          : values === ORDER_STATUS_IDS.READY_TO_PICK_UP
          ? ORDER_STATUS_WITH_LABELS.READY_TO_PICK_UP
          : '',
    };
    setUpdateLoading(true);
    updateOrderStatus(orderDetailsState.uid, updatedOrderPayload)
      .then(() => {
        setOrderDetailsState(prev => ({
          ...prev,
          orderStatus: values,
          orderStatusName:
            values === ORDER_STATUS_IDS.CONFIRM_ORDER
              ? ORDER_STATUS_WITH_LABELS.CONFIRM_ORDER
              : values === ORDER_STATUS_IDS.NEW_ORDER
              ? ORDER_STATUS_WITH_LABELS.NEW_ORDER
              : values === ORDER_STATUS_IDS.PICKED_UP
              ? ORDER_STATUS_WITH_LABELS.PICKED_UP
              : values === ORDER_STATUS_IDS.READY_TO_PICK_UP
              ? ORDER_STATUS_WITH_LABELS.READY_TO_PICK_UP
              : '',
        }));
        setUpdateLoading(false);
        notifyMessage('Order Status Changed Successfully');
      })
      .catch(() => {
        setUpdateLoading(false);
        notifyMessage('Error While Updating Order');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {updateLoading === true && <Spinner color={'primary.blue'} />}
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
              onPress={() => navigation.navigate('New orders')}
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
        <ScrollView contentContainerStyle={{}}>
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
                  {orderDetailsState?.custommerDetail?.name}
                </Text>
                <Text
                  style={{
                    color: '#ffffff',
                    marginBottom: 5,
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  {orderDetailsState &&
                    orderDetailsState.orderDateAndTime &&
                    showDateOrToday(
                      new Date(
                        orderDetailsState.orderDateAndTime.seconds * 1000,
                      ),
                    )}{' '}
                  at{' '}
                  {orderDetailsState &&
                    orderDetailsState.orderDateAndTime &&
                    moment(
                      new Date(
                        orderDetailsState.orderDateAndTime.seconds * 1000,
                      ),
                    ).format('HH:mm a')}
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
                  Order id#: {orderDetailsState?.orderno}
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
            <View style={{paddingVertical: 10}}>
              {orderDetailsState &&
                orderDetailsState.orderItems &&
                orderDetailsState.orderItems?.map(
                  (orderItemObject, orderItemIndex) => (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: 5,
                          backgroundColor: '#132333',
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                        }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#ffffff',
                              fontFamily: 'Lato-Bold',
                            }}>
                            Bowl {orderItemIndex + 1}
                          </Text>
                        </View>
                      </View>
                      {orderItemObject?.ingredients.map(
                        (ingredientItem, ingredientIndex) =>
                          ingredientItem.categoryValue.length > 0 && (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 5,
                                paddingHorizontal: 20,
                                // paddingVertical: ,
                              }}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: '#353535',
                                    fontFamily: 'Lato-Bold',
                                  }}>
                                  {ingredientItem?.categoryName}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: '#353535',
                                    fontFamily: 'Lato-Bold',
                                  }}>
                                  {ingredientItem.isMultiSelect === true ? (
                                    ingredientItem.categoryValue.map(
                                      ingredientObject => (
                                        <View style={{marginHorizontal: 10}}>
                                          <Text style={{color: '#353535'}}>
                                            {ingredientObject}, {''}
                                          </Text>
                                        </View>
                                      ),
                                    )
                                  ) : (
                                    <Text
                                      style={{
                                        fontFamily: 'Lato-Regular',
                                        fontSize: 16,
                                      }}>
                                      {ingredientItem.categoryValue}
                                    </Text>
                                  )}
                                </Text>
                              </View>
                            </View>
                          ),
                      )}
                    </View>
                  ),
                )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                  backgroundColor: '#132333',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#ffffff',
                      fontFamily: 'Lato-Bold',
                    }}>
                    {'Add ons'}
                  </Text>
                </View>
              </View>
              {orderDetailsState &&
              orderDetailsState.addonsList &&
              orderDetailsState.addonsList.length > 0 ? (
                orderDetailsState.addonsList.map((addOnsItem, index) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 5,
                      paddingHorizontal: 20,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#132333',
                          fontFamily: 'Lato-Bold',
                        }}>
                        {addOnsItem?.addOnsName} {'  '} X {addOnsItem?.quantity}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#353535',
                          fontFamily: 'Lato-Bold',
                        }}>
                        ${' '}
                        {parseFloat(addOnsItem?.addOnsCost) *
                          parseFloat(addOnsItem?.quantity)}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#353535',
                      fontFamily: 'Lato-Bold',
                    }}>
                    No Addons Added
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
                backgroundColor: '#132333',
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  color: '#ffffff',
                }}>
                Special Instructions
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 20,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  color: '#132333',
                }}>
                {orderDetailsState?.specialInstruction || 'N/A'}
              </Text>
            </View>
          </View>

          <View
            style={{
              borderTopColor: '#000000',
              borderTopWidth: 1,
              marginTop: 10,
              paddingVertical: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
                paddingHorizontal: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#132333',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Total
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#353535',
                    fontFamily: 'Lato-Bold',
                  }}>
                  ${orderDetailsState?.total || 0}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
                paddingHorizontal: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#132333',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Addons Total
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#353535',
                    fontFamily: 'Lato-Bold',
                  }}>
                  ${orderDetailsState?.addOnsTotal || 0}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
                paddingHorizontal: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#132333',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Discount
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#353535',
                    fontFamily: 'Lato-Bold',
                  }}>
                  ${orderDetailsState?.rewardCodeDiscount || 0}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
                paddingHorizontal: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#132333',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Grand Total
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#353535',
                    fontFamily: 'Lato-Bold',
                  }}>
                  ${orderDetailsState?.grandTotal || 0}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Lato-Bold',
                marginRight: 5,
                color: '#353535',
              }}>
              Order Status :
            </Text>

            <View>
              <Select
                accessibilityLabel="status"
                placeholder="Status"
                borderColor={'primary.blue'}
                backgroundColor={'primary.grey100'}
                color={'primary.black'}
                minWidth={150}
                width={'100%'}
                selectedValue={orderDetailsState.orderStatus}
                placeholderTextColor="primary.black"
                fontSize={'xs'}
                _selectedItem={{
                  bg: 'primary.white',
                  endIcon: <CheckIcon color="#primary." size="4" />,
                }}
                mt={1}
                onValueChange={itemValue => changeStatusHandler(itemValue)}>
                <Select.Item
                  label="Pending"
                  value={ORDER_STATUS_IDS.NEW_ORDER}
                />
                <Select.Item
                  label="Confirmed"
                  value={ORDER_STATUS_IDS.CONFIRM_ORDER}
                />
                <Select.Item
                  label="Ready To Pick up"
                  value={ORDER_STATUS_IDS.READY_TO_PICK_UP}
                />
                <Select.Item
                  label="Picked up"
                  value={ORDER_STATUS_IDS.PICKED_UP}
                />
              </Select>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const itemsList = [
  {
    itemName: 'Bowl1',
    price: 100,
    ingredients: ['Cucumber', 'Olives', 'Onions', 'Tomatos'],
    addOns: [
      {
        addOnsName: 'Heniken Beer',
        price: 5.0,
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10,
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

export default NewOrderDetails;
