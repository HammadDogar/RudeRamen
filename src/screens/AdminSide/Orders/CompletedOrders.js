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
import {ORDER_STATUS_IDS} from '../../../constants';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {getOrdersByresturantUserIdAndStatusId} from '../../../services/CloudFunction/ordersManagment';
import {showDateOrToday} from '../../../utils/utils';

const CompletedOrder = ({navigation}) => {
  const {user} = useContext(AuthenticationContext);
  const focus = useIsFocused();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [pickedUpOrders, setPickedUpOrders] = useState([]);

  useEffect(() => {
    setOrderLoading(true);
    getOrdersByresturantUserIdAndStatusId(user.uid, ORDER_STATUS_IDS.PICKED_UP)
      .then(response => {
        setOrderLoading(false);
        setPickedUpOrders(response.reverse());
      })
      .catch(() => {
        setOrderLoading(false);
        // console.log('error', error);
      });
  }, [focus]);

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
          {!orderLoading && pickedUpOrders.length > 0 && (
            <View>
              {pickedUpOrders?.map((itemData, index) => (
                <ItemCard
                  title={'jsfvcj'}
                  orderItemData={itemData}
                  navigation={navigation}
                  key={index + 1}
                />
              ))}
            </View>
          )}

          {pickedUpOrders.length === 0 && (
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

const ItemCard = ({title, navigation, orderItemData}) => {
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
                                                fontFamily: 'Lato-Regular',
                                                color: '#484848',
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
                                          fontSize: 16,
                                          color: '#484848',
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
            alignItems: 'center',
            marginVertical: 10,
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Lato-Bold',
              marginRight: 5,
              color: '#2AC242',
              textTransform: 'capitalize',
            }}>
            Order Status : {orderItemData?.orderStatusName || ''}
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: '#132333',
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                // maxWidth: 100,
              }}
              onPress={() =>
                navigation.navigate('complete-order-details', {
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

export default CompletedOrder;
