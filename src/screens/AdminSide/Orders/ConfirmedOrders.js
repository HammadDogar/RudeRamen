import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {CheckIcon, Select} from 'native-base';
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
  getOrdersByresturantUserIdAndStatusId,
  updateOrderStatus,
} from '../../../services/CloudFunction/ordersManagment';
import {
  convet24HourTo12Hour,
  notifyMessage,
  showDateOrToday,
} from '../../../utils/utils';

const COnfirmedOrder = ({navigation}) => {
  const {user} = useContext(AuthenticationContext);
  const focus = useIsFocused();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [confirmOrders, setConfirmOrders] = useState([]);

  useEffect(() => {
    setOrderLoading(true);
    getOrdersByresturantUserIdAndStatusId(
      user.uid,
      ORDER_STATUS_IDS.CONFIRM_ORDER,
    )
      .then(response => {
        setOrderLoading(false);
        setConfirmOrders(response.reverse());
      })
      .catch(() => {
        setOrderLoading(false);
        // console.log('error', error);
      });
  }, [focus]);

  const changeStatusHandler = (values, orderData) => {
    console.log('values', values);

    if (values === ORDER_STATUS_IDS.CONFIRM_ORDER) {
      return;
    }

    let updatedOrderPayload = {
      ...orderData,
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
    updateOrderStatus(orderData.uid, updatedOrderPayload)
      .then(() => {
        let updatedStateArray = confirmOrders.filter(
          orderItem => orderItem.uid !== orderData.uid,
        );
        setConfirmOrders(updatedStateArray);
        setUpdateLoading(false);
        notifyMessage('Order Status updated Successfully');
      })
      .catch(error => {
        setUpdateLoading(false);
        // notifyMessage('Error While Updating Order');
        console.log('error', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            // backgroundColor: 'red',
          }}>
          {updateLoading === true && <Spinner color={'primary.blue'} />}

          {orderLoading && (
            <View style={{marginVertical: 10}}>
              <Spinner color="primary.blue" />
            </View>
          )}
          {!orderLoading && confirmOrders.length > 0 && (
            <View>
              {confirmOrders?.map((itemData, index) => (
                <ItemCard
                  title={'jsfvcj'}
                  orderItemData={itemData}
                  navigation={navigation}
                  key={index + 1}
                  changeStatusHandler={changeStatusHandler}
                />
              ))}
            </View>
          )}

          {confirmOrders.length === 0 && (
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

const ItemCard = ({title, navigation, orderItemData, changeStatusHandler}) => {
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
                      {/* {orderItem.ingredients.length == 0 && ( */}
                      {orderItem.ingredients.length > 0 && (
                        <View>
                          {orderItem?.ingredients?.map(
                            orderItemIngredient =>
                              orderItemIngredient?.categoryValue?.length >
                                0 && (
                                <View style={{paddingHorizontal: 10}}>
                                  {/* {console.log(
                                     'orderItemIngredient?.categoryValue',
                                     orderItemIngredient?.categoryValue,
                                   )} */}
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
                                                fontSize: 16,
                                                color: '#484848',
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
                                          fontFamily: 'Lato-Regular',
                                          color: '#484848',
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

              {/* <View
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

                <Text style={{fontSize: 14, color: '#737373'}}>
                  {orderItemData?.specialInstruction || 'N/A'}
                </Text>
              </View> */}
            </View>
          </View>
        </View>
        <View
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

          <Text style={{fontSize: 14, color: '#484848'}}>
            {orderItemData?.specialInstruction || 'N/A'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
            paddingHorizontal: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Lato-Bold',
                marginRight: 5,
                color: '#353535',
              }}>
              Order Status :
            </Text>
            <View>
              {/* <View> */}
              <Select
                accessibilityLabel="status"
                placeholder="Status"
                borderColor={'primary.blue'}
                backgroundColor={'primary.grey100'}
                color={'primary.black'}
                minWidth={150}
                width={'100%'}
                placeholderTextColor="primary.black"
                // height={'8'}
                selectedValue={orderItemData.orderStatus}
                fontSize={'xs'}
                _selectedItem={{
                  bg: 'primary.white',
                  endIcon: <CheckIcon color="#primary." size="4" />,
                }}
                onValueChange={itemValue =>
                  changeStatusHandler(itemValue, orderItemData)
                }
                mt={1}>
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
              {/* </View> */}
            </View>
          </View>
          <View
            style={{
              // flex: 0.5,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Pressable
              style={{
                // flex: 1,
                // backgroundColor: 'blue',
                borderWidth: 1,
                borderColor: '#132333',
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                // maxWidth: 100,
              }}
              onPress={() =>
                navigation.navigate('confirm-order-details', {
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
          </View>
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
                paddingHorizontal: 10,
                // width: '100%',
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

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
    ingredients: [
      {ingredientName: 'Mashrooms'},
      {ingredientName: 'Onions'},
      {ingredientName: 'Cucumber'},
      {ingredientName: 'Tomatos'},
      {ingredientName: 'Olives'},
    ],
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
    ingredients: [
      {ingredientName: 'Mashrooms'},
      {ingredientName: 'Onions'},
      {ingredientName: 'Cucumber'},
      {ingredientName: 'Tomatos'},
      {ingredientName: 'Olives'},
    ],
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
    ingredients: [
      {ingredientName: 'Mashrooms'},
      {ingredientName: 'Onions'},
      {ingredientName: 'Cucumber'},
      {ingredientName: 'Tomatos'},
      {ingredientName: 'Olives'},
    ],
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
    ingredients: [
      {ingredientName: 'Mashrooms'},
      {ingredientName: 'Onions'},
      {ingredientName: 'Cucumber'},
      {ingredientName: 'Tomatos'},
      {ingredientName: 'Olives'},
    ],
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
    ingredients: [
      {ingredientName: 'Mashrooms'},
      {ingredientName: 'Onions'},
      {ingredientName: 'Cucumber'},
      {ingredientName: 'Tomatos'},
      {ingredientName: 'Olives'},
    ],
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
    ingredients: [
      {ingredientName: 'Mashrooms'},
      {ingredientName: 'Onions'},
      {ingredientName: 'Cucumber'},
      {ingredientName: 'Tomatos'},
      {ingredientName: 'Olives'},
    ],
  },
];

export default COnfirmedOrder;
