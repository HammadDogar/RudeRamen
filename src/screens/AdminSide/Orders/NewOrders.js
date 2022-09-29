import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {color} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {IMAGES} from '../../../assets/Images';
import {metrics} from '../../../assets/style';
import {Spinner} from '../../../components';
import {ORDER_STATUS_IDS, ORDER_STATUS_WITH_LABELS} from '../../../constants';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {
  getOrdersByresturantUserId,
  getOrdersByresturantUserIdAndStatusId,
  updateOrderStatus,
} from '../../../services/CloudFunction/ordersManagment';
import {
  convet24HourTo12Hour,
  notifyMessage,
  showDateOrToday,
} from '../../../utils/utils';

const CompletedOrderDetailed = ({navigation}) => {
  const {user} = useContext(AuthenticationContext);
  const focus = useIsFocused();

  const [orderLoading, setOrderLoading] = useState(false);
  const [newOrders, setNewOrders] = useState([]);

  useEffect(() => {
    setOrderLoading(true);
    getOrdersByresturantUserIdAndStatusId(user.uid, ORDER_STATUS_IDS.NEW_ORDER)
      .then(response => {
        setOrderLoading(false);
        setNewOrders(response.reverse());
      })
      .catch(error => {
        setOrderLoading(false);
        console.log('error', error);
      });
  }, [focus]);

  const confirmOrderHandler = orderData => {
    let updatedOrderPayload = {
      ...orderData,
      orderStatus: ORDER_STATUS_IDS.CONFIRM_ORDER,
      orderStatusName: ORDER_STATUS_WITH_LABELS.CONFIRM_ORDER,
    };
    updateOrderStatus(orderData.uid, updatedOrderPayload)
      .then(() => {
        let updatedStateArray = newOrders.filter(
          orderItem => orderItem.uid !== orderData.uid,
        );
        setNewOrders(updatedStateArray);
        notifyMessage('Order Accepted Successfully');
      })
      .catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            // backgroundColor: 'red',
          }}>
          {orderLoading && (
            <View style={{marginVertical: 10}}>
              <Spinner color="primary.blue" />
            </View>
          )}
          {!orderLoading && (
            <View>
              {newOrders?.map((itemData, index) => (
                <ItemCard
                  orderItemData={itemData}
                  navigation={navigation}
                  key={index + 1}
                  confirmOrderHandler={confirmOrderHandler}
                />
              ))}
            </View>
          )}
          {newOrders.length === 0 && (
            <View>
              <Text style={{textAlign: 'center', marginVertical: 10}}>
                No Orders Found
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const ItemCard = ({navigation, orderItemData, confirmOrderHandler}) => {
  return (
    <TouchableWithoutFeedback>
      <View
        style={{borderColor: '#E8E8E8', borderWidth: 1, marginVertical: 10}}>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            backgroundColor: '#384B5D',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: '#ffffff',
                marginBottom: 5,
                fontFamily: 'Lato-Bold',
                fontSize: 16,
              }}>
              {orderItemData?.custommerDetail?.name}
            </Text>
            <Text
              style={{
                color: '#ffffff',
                marginBottom: 5,
                fontFamily: 'Lato-Bold',
                fontSize: 14,
              }}>
              {orderItemData &&
                orderItemData.orderDateAndTime &&
                showDateOrToday(
                  new Date(orderItemData.orderDateAndTime.seconds * 1000),
                )}{' '}
              at{' '}
              {orderItemData &&
                orderItemData.orderDateAndTime &&
                moment(
                  new Date(orderItemData.orderDateAndTime.seconds * 1000),
                ).format('HH:mm a')}
              {/* Today at 12:33 AM */}
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
              Order id#: {orderItemData?.orderno}
            </Text>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'right',
                fontFamily: 'Lato-Bold',
                marginBottom: 5,
                fontSize: 16,
              }}>
              Total: ${parseFloat(orderItemData?.grandTotal)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
          }}>
          {/* <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              resizeMode="cover"
              style={{
                height: 130,
                width: 130,
              }}
              source={IMAGES.RUDE_RAMIN_SPLASH_2}
              // flex={1}
            />
          </View> */}
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
              marginLeft: 10,
              padding: metrics.tinyPadding,
              // backgroundColor: 'blue',
            }}>
            <View>
              <View style={{}}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  {orderItemData?.bowlName}
                </Text>
              </View>

              {orderItemData?.orderItems.map((orderItem, orderItemIndex) => (
                <View style={{paddingHorizontal: 10, marginVertical: 5}}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 16,
                      textTransform: 'capitalize',
                      alignSelf: 'flex-start',
                      borderBottomWidth: 2,
                      fontFamily: 'Lato-Bold',
                      borderBottomColor: '#000000',
                      marginBottom: 5,
                    }}>
                    Bowl {orderItemIndex + 1}
                  </Text>

                  <View style={{paddingHorizontal: 10}}>
                    <View>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: '#000000',
                          fontFamily: 'Lato-Bold',
                          textTransform: 'capitalize',
                        }}>
                        Ingredients:
                      </Text>
                    </View>
                    <Text>
                      {/* {console.log(
                        'orderItem.ingredients',
                        JSON.stringify(orderItem.ingredients, null, 2),
                      )} */}
                      {/* {orderItem.ingredients.length == 0 && ( */}
                      {orderItem.ingredients.length > 0 && (
                        <View>
                          {orderItem?.ingredients?.map(
                            orderItemIngredient =>
                              orderItemIngredient?.categoryValue?.length >
                                0 && (
                                <View
                                  style={{
                                    paddingHorizontal: 10,
                                  }}>
                                  <Text
                                    style={{
                                      color: '#000000',
                                      fontFamily: 'Lato-Bold',
                                      fontSize: 16,
                                    }}>
                                    {orderItemIngredient?.categoryName} : {''}
                                    {orderItemIngredient.isMultiSelect ===
                                    true ? (
                                      orderItemIngredient.categoryValue.map(
                                        (
                                          ingredientObject,
                                          ingredientObjectIndex,
                                        ) => (
                                          <View style={{marginHorizontal: 10}}>
                                            <Text
                                              style={{
                                                color: '#484848',
                                                fontSize: 16,
                                                fontFamily: 'Lato-Regular',
                                              }}>
                                              {ingredientObject}
                                              {ingredientObjectIndex !==
                                                orderItemIngredient
                                                  .categoryValue.length -
                                                  1 && <Text>, {''}</Text>}
                                            </Text>
                                          </View>
                                        ),
                                      )
                                    ) : (
                                      <Text
                                        style={{
                                          color: '#484848',
                                          fontFamily: 'Lato-Regular',
                                          fontSize: 16,
                                        }}>
                                        {orderItemIngredient.categoryValue}
                                      </Text>
                                    )}
                                  </Text>
                                </View>
                              ),
                          )}
                        </View>
                      )}
                    </Text>
                  </View>
                </View>
              ))}

              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderTopColor: '#ABABAB',
                  // borderTopWidth: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Lato-Bold',
                    color: '#132333',
                  }}>
                  Special Instructions
                </Text>

                <Text style={{fontSize: 14, color: '#484848'}}>
                  {orderItemData?.specialInstruction || 'N/A'}
                </Text>
              </View>

              {/* specialInstruction */}

              <View style={{marginTop: 10}}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  Addons:
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  backgroundColor: '#132333',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Lato-Bold',
                      color: '#ffffff',
                      textAlign: 'left',
                    }}>
                    Quantity
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Lato-Bold',
                      color: '#ffffff',
                      textAlign: 'left',
                    }}>
                    Addon Name
                  </Text>
                </View>
              </View>

              {orderItemData?.addonsList.length > 0 ? (
                orderItemData.addonsList.map((addonsItem, addOnsIndex) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      paddingHorizontal: 10,
                      // paddingVertical: 5,
                    }}>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Lato-Bold',
                          color: '#484848',
                          textAlign: 'left',
                        }}>
                        {addonsItem?.quantity}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Lato-Bold',
                          color: '#484848',
                          textAlign: 'left',
                        }}>
                        {addonsItem?.addOnsName}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#484848',
                      textAlign: 'left',
                    }}>
                    {'No Addons Added '}
                  </Text>
                </View>
              )}

              {/* {orderItemData?.addonsList.length > 0 ? (
                <FlatList
                  horizontal={false}
                  data={orderItemData?.addonsList}
                  renderItem={({item}) => (
                    <Text
                      style={{
                        marginVertical: 3,
                        color: '#000000',
                        marginHorizontal: 3,
                        fontSize: 12,
                      }}>
                      {`${item.quantity}`} {''}
                      {item.addOnsName}
                    </Text>
                  )}
                />
              ) : (
                <View>
                  <Text
                    style={{
                      color: '#000000',
                      marginVertical: 5,
                      fontSize: 12,
                    }}>
                    No Addons Added
                  </Text>
                </View>
              )} */}
            </View>
          </View>
        </View>
        {/* <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderTopColor: '#ABABAB',
            borderTopWidth: 1,
          }}>
          <Text
            style={{fontSize: 16, fontFamily: 'Lato-Bold', color: '#132333'}}>
            Special Instructions
          </Text>

          <Text style={{fontSize: 14, color: '#737373'}}>
            Please add more soup in my ramen thank you!
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
            paddingHorizontal: 10,
          }}>
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: '#132333',
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            onPress={() =>
              navigation.navigate('Order Details', {
                orderDetails: orderItemData,
              })
            }>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'Lato-Bold',
                color: '#353535',
              }}>
              View details
            </Text>
          </Pressable>
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: '#2AC242',
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: '#2AC242',
            }}
            onPress={() => confirmOrderHandler(orderItemData)}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'Lato-Bold',
                color: '#ffffff',
              }}>
              Confirm Order
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            backgroundColor: '#384B5D',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: '#ffffff',
                // marginBottom: 5,
                fontFamily: 'Lato-Bold',
                fontSize: 16,
              }}>
              Pick up Slot:
            </Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 30,
                borderRadius: 5,
                borderColor: '#AFAFAF',
                borderWidth: 1,
                // maxWidth: 100,
                // width: '100%',
                paddingHorizontal: 10,
                marginHorizontal: 10,
              }}
              onPress={() => navigation.navigate('MyCart')}>
              <Text
                color="#000000"
                style={{
                  fontSize: 14,
                  fontFamily: 'Lato-Bold',
                  color: '#ffffff',
                }}>
                {orderItemData &&
                  orderItemData.slot &&
                  orderItemData &&
                  orderItemData.slot.from &&
                  convet24HourTo12Hour(orderItemData?.slot?.from)}{' '}
                -{' '}
                {orderItemData &&
                  orderItemData.slot &&
                  orderItemData &&
                  orderItemData.slot.to &&
                  convet24HourTo12Hour(orderItemData?.slot?.to)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#384B5D',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardHeaderText: {
    color: '#ffffff',
    fontFamily: 'Lato-Bold',
  },
});

export default CompletedOrderDetailed;
