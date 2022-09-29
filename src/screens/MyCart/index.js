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
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {IMAGES} from '../../assets/Images';
import {Spinner, TextField} from '../../components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {metrics} from '../../assets/style';
import {Button, Checkbox} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getMneuDetail} from '../../services/CloudFunction/menu';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {generateUniqOrderNumber, notifyMessage} from '../../utils/utils';
import AddOnsContainer from './addOnsContainer';
import {async} from '@firebase/util';
import {createOrder} from '../../services/CloudFunction/ordersManagment';
import {ORDER_STATUS_IDS, ORDER_STATUS_WITH_LABELS} from '../../constants';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';
import {useIsFocused} from '@react-navigation/native';

const MyCart = ({navigation}) => {
  const {user} = useContext(AuthenticationContext);
  const focus = useIsFocused();

  const [showAddonsContainer, setShowAddonsContainer] = useState(false);
  const [cartItemState, setCartItemState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuDetailsAddons, setMenuDetailsAddons] = useState(null);
  const [totalWithoutDiscount, setTotalWithoutDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const [addOnsTotal, setAddOnsTotal] = useState(0);
  const [subTotalWithAddonsPrice, setSubTotalWithAddons] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [orderCreatedLoading, setOrderCreatedLoading] = useState(false);

  useEffect(() => {
    const getcartItemFromLocal = async () => {
      setIsLoading(true);
      const value = await AsyncStorage.getItem('cart_Items');
      let cartItemInStorageInJson = JSON.parse(value);
      setCartItemState(cartItemInStorageInJson);
      if (cartItemInStorageInJson) {
        getMneuDetail(cartItemInStorageInJson?.itemDetail?.restaurantsUserId)
          .then(response => {
            let finalAddons = response?.addOnsObject?.addOnsList?.map(
              addonsItem => ({
                ...addonsItem,
                checked: false,
                quantity: 0,
              }),
            );
            setMenuDetailsAddons(finalAddons);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
      setIsLoading(false);
    };
    getcartItemFromLocal();
  }, [focus]);

  useEffect(() => {
    // let cartItemTotalWithoutDisscount = cartItemState?.menuItems.map(
    //   item =>
    //     item?.menuItems?.length *
    //     parseFloat(cartItemState.itemDetail.bowlPrice),
    // );

    // cartItemTotalWithoutDisscount = cartItemTotalWithoutDisscount?.reduce(
    //   (acc, next) => acc + next,
    //   0,
    // );
    let cartItemTotalWithoutDisscount =
      parseInt(cartItemState?.count) *
      parseFloat(cartItemState?.itemDetail?.bowlPrice);
    setTotalWithoutDiscount(cartItemTotalWithoutDisscount || 0);
    setSubTotalWithAddons(cartItemTotalWithoutDisscount || 0);
    setGrandTotal(cartItemTotalWithoutDisscount || 0);
  }, [cartItemState, focus]);

  useEffect(() => {
    let addOnsPrice =
      menuDetailsAddons &&
      menuDetailsAddons.length > 0 &&
      menuDetailsAddons.map(addOnsItem => {
        if (addOnsItem.checked) {
          return (
            parseInt(addOnsItem.addOnsCost) * parseInt(addOnsItem.quantity)
          );
        } else {
          return 0;
        }
      });
  }, [menuDetailsAddons, focus]);

  const changeInAddonsOption = (value, addOnsItem, index) => {
    let previousArrayInString = JSON.stringify(menuDetailsAddons);
    let previousArrayInJson = JSON.parse(previousArrayInString);
    previousArrayInJson[index] = {
      ...addOnsItem,
      checked: value,
    };
    setMenuDetailsAddons(previousArrayInJson);
  };

  const addOnsIncrementDecrement = (type, addOnsItem, index) => {
    let previousArrayInString = JSON.stringify(menuDetailsAddons);
    let previousArrayInJson = JSON.parse(previousArrayInString);

    if (type === 'increment') {
      previousArrayInJson[index] = {
        ...addOnsItem,
        quantity: parseInt(addOnsItem.quantity) + 1,
      };
      setMenuDetailsAddons(previousArrayInJson);
    } else if (type === 'decrement') {
      previousArrayInJson[index] = {
        ...addOnsItem,
        quantity: addOnsItem.quantity === 0 ? 1 : addOnsItem.quantity - 1,
      };
      setMenuDetailsAddons(previousArrayInJson);
    }
  };

  const removeItemFromCart = async (data, index) => {
    // console.log('data', JSON.stringify(data, null, 2));
    // cartItemState;
    // if (cartItemState?.cartItem?.length > 1) {
    //   let updatedCart = cartItemState?.cartItem?.filter(
    //     (cartItemObj, cartItemIndex) => cartItemIndex !== index,
    //   );
    //   let updatedAsynStorageCartItem = {
    //     ...cartItemState,
    //     cartItem: updatedCart,
    //   };

    //   try {
    //     await AsyncStorage.setItem(
    //       'cart_Items',
    //       JSON.stringify(updatedAsynStorageCartItem),
    //     );
    //     setCartItemState(updatedAsynStorageCartItem);
    //   } catch (error) {}
    // } else {
    try {
      await AsyncStorage.removeItem('cart_Items');
      setCartItemState(null);
    } catch (error) {}
    // }
  };

  const calculationHandler = addonsTotal => {
    setAddOnsTotal(addonsTotal);
    setSubTotalWithAddons(addonsTotal + totalWithoutDiscount);
    setGrandTotal(addonsTotal + totalWithoutDiscount);
  };

  const submitOrderHandler = () => {
    setOrderCreatedLoading(true);
    let finalPayload = {
      orderno: generateUniqOrderNumber(),
      orderDateAndTime: new Date(),
      custommerDetail: {
        name: user.name,
        email: user.email,
        address: user.address,
        customerUid: user.uid,
      },
      bowlName: cartItemState?.itemDetail?.bowlName,
      bowlDescription: cartItemState?.itemDetail?.bowlDescription,
      restaurantsUserId: cartItemState?.itemDetail?.restaurantsUserId,
      bowlImage: cartItemState?.itemDetail?.bowlImage,
      slot: cartItemState?.slot,
      orderItems: [...cartItemState.menuItems],
      addonsList: selectedAddons.filter(addonsItem => addonsItem.quantity > 0),
      total: totalWithoutDiscount,
      addOnsTotal: addOnsTotal,
      totalWithAddons: subTotalWithAddonsPrice,
      rewardCodeDiscount: 0,
      rewardCode: null,
      grandTotal: grandTotal,
      orderStatus: ORDER_STATUS_IDS.NEW_ORDER,
      orderStatusName: ORDER_STATUS_WITH_LABELS.NEW_ORDER,
      specialInstruction: cartItemState?.specialInstruction,
    };

    createOrder(finalPayload)
      .then(async () => {
        setOrderCreatedLoading(false);
        notifyMessage('Order has been placed successfully');

        try {
          await AsyncStorage.removeItem('cart_Items');
          setCartItemState(null);
        } catch (error) {}
      })
      .catch(() => {
        setOrderCreatedLoading(false);
        notifyMessage('Error while placing Order');
      });
  };

  const goBackHandler = () => {
    console.log(
      'cartItemState.restaurantsUserId',
      JSON.stringify(cartItemState, null, 2),
    );
    if (cartItemState?.itemDetail?.restaurantsUserId) {
      navigation.navigate('Bowl creation', {
        resturantId: cartItemState.itemDetail.restaurantsUserId,
      });
    } else {
      navigation.goBack();
    }
  };
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
              onPress={() => goBackHandler()}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#132333',
              }}>
              My Cart
            </Text>
          </View>
        </View>
        {isLoading && (
          <View>
            <Spinner color="primary.blue" />
          </View>
        )}

        {!isLoading &&
        cartItemState &&
        cartItemState.menuItems &&
        cartItemState.menuItems.length > 0 ? (
          <View style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                // backgroundColor: 'red',
              }}>
              <View>
                {/* {cartItemState?.menuItems?.map((itemData, index) => ( */}
                <ItemCard
                  itemDetails={cartItemState?.itemDetail}
                  itemData={cartItemState?.menuItems}
                  // key={index + 1}
                  removeItemFromCart={removeItemFromCart}
                  totalWithoutDiscount={totalWithoutDiscount}
                  // index={index}
                />
                {/* ))} */}
                <View>
                  <AddOnsContainer
                    menuDetailsAddons={menuDetailsAddons}
                    calculationHandler={calculationHandler}
                    setSelectedAddons={setSelectedAddons}
                  />

                  <View style={[styles.shadow, {marginVertical: 10}]}>
                    <View style={[styles.totalPriceBox, {padding: 10}]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                        }}>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: 'Lato-Bold',
                              color: '#484848',
                            }}>
                            Options
                          </Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Lato-Bold',
                              color: '#484848',
                            }}>
                            Quantity
                          </Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Lato-Bold',
                              color: '#484848',
                            }}>
                            Price
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          // justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#484848',
                              fontSize: 14,
                              fontFamily: 'Lato-Bold',
                              marginHorizontal: 8,
                            }}>
                            Total Bowls
                          </Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                              color: '#000000',
                              marginHorizontal: 20,
                            }}>
                            {cartItemState.count}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            // backgroundColor: 'red',
                            // textAlign: 'right',
                            // justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: '#484848',
                              fontSize: 14,
                              fontFamily: 'Lato-Bold',
                            }}>
                            ${parseFloat(totalWithoutDiscount)}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          // justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#484848',
                              fontSize: 14,
                              fontFamily: 'Lato-Bold',
                              marginHorizontal: 8,
                            }}>
                            Addons
                          </Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                              color: '#000000',
                              marginHorizontal: 20,
                            }}></Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            // backgroundColor: 'red',
                            // textAlign: 'right',
                            // justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: '#484848',
                              fontSize: 14,
                              fontFamily: 'Lato-Bold',
                            }}>
                            ${parseFloat(addOnsTotal)}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          // justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#484848',
                              fontSize: 14,
                              fontFamily: 'Lato-Bold',
                              marginHorizontal: 8,
                            }}>
                            Sub total
                          </Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                              color: '#000000',
                              marginHorizontal: 20,
                            }}></Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            // backgroundColor: 'red',
                            // textAlign: 'right',
                            // justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: '#484848',
                              fontSize: 16,
                              fontFamily: 'Lato-Bold',
                            }}>
                            ${parseFloat(subTotalWithAddonsPrice)}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Lato-Bold',
                            fontSize: 14,
                            color: '#132333',
                            flex: 2,
                          }}>
                          Reward Code
                        </Text>
                        <TextField
                          Style={[styles.inputParent, {flex: 1}]}
                          Style_1={[styles.inputStyle]}
                          Style_2={[styles.inputIcon]}
                          placeholder={'Reward code'}
                          placeholderTextColor="#CFCFCF"
                          secure={false}
                          isIcon={false}
                          size={22}
                          // keyboard={'email-address'}
                          name="password"
                          // onChangeText={handleChange('password')}
                          // onBlur={handleBlur('password')}
                          // value={values.password}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Lato-Bold',

                            fontSize: 20,
                            color: '#132333',
                          }}>
                          Total
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Lato-Bold',
                            fontSize: 22,
                            color: '#132333',
                          }}>
                          $ {parseFloat(grandTotal)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View
              flexDirection="row"
              justifyContent="center"
              marginVertical={10}>
              {orderCreatedLoading ? (
                <Button
                  style={{
                    backgroundColor: '#132333',
                    width: metrics.deviceWidth * 0.95,
                    height: 60,
                  }}
                  flexDirection="row"
                  // onPress={() => navigation.navigate('Payment')}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Lato-Bold',
                      color: '#ffffff',
                    }}>
                    <Spinner color="primary.white" />
                  </Text>
                </Button>
              ) : (
                <Button
                  style={{
                    backgroundColor: '#132333',
                    width: metrics.deviceWidth * 0.95,
                    height: 60,
                  }}
                  flexDirection="row"
                  // onPress={() => navigation.navigate('Payment')}
                  onPress={submitOrderHandler}
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
                    Proceed to Payment
                  </Text>
                </Button>
              )}
            </View>
          </View>
        ) : (
          <View
            style={{
              padding: 15,
              flex: 1,
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              alignItems: 'center',
            }}>
            <Text style={{color: '#132333', fontSize: 16}}>
              No Item found in cart
            </Text>

            <View>
              {/*  */}
              <MaterialCommunityIcon
                style={{textAlign: 'center', marginVertical: 10}}
                name="cart-remove"
                size={50}
                color="#132333"
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const ItemCard = ({
  itemDetails,
  index,
  itemData,
  removeItemFromCart,
  totalWithoutDiscount,
}) => {
  return (
    <TouchableWithoutFeedback>
      <View>
        <View
          style={{
            flexDirection: 'row',
            borderColor: '#E8E8E8',
            borderWidth: 1,
            marginVertical: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              resizeMode="cover"
              style={{
                height: 100,
                width: 100,
              }}
              // source={IMAGES.RUDE_RAMIN_SPLASH_2}
              source={{uri: itemDetails && itemDetails.bowlImage}}
              // flex={1}
            />
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
              marginLeft: 10,
              padding: metrics.tinyPadding,
              // backgroundColor: 'blue',
            }}>
            <View>
              <AntDesignIcon
                style={{textAlign: 'right'}}
                name="close"
                size={20}
                color="#757575"
                onPress={() => removeItemFromCart(itemData)}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: '#000000',
                  fontFamily: 'Lato-Bold',
                  textTransform: 'capitalize',
                }}>
                {itemDetails?.bowlName}
              </Text>

              {itemData &&
                itemData.map((bowlItem, index) => (
                  <View>
                    <Text
                      style={{color: '#000000', fontSize: 16, marginTop: 5}}>
                      Bowl {index + 1} Options
                    </Text>

                    {bowlItem?.ingredients?.map(ingredientItem => (
                      <View>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 16,
                            fontFamily: 'Lato-Bold',
                          }}>
                          {ingredientItem.categoryName}
                        </Text>
                        <FlatList
                          contentContainerStyle={{
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                          }}
                          numColumns={3}
                          horizontal={false}
                          data={
                            ingredientItem.isMultiSelect === true
                              ? ingredientItem.categoryValue
                              : ingredientItem.isMultiSelect === false
                              ? [ingredientItem.categoryValue]
                              : []
                          }
                          renderItem={({item}) => (
                            <Text
                              style={{
                                marginVertical: 3,
                                color: '#000000',
                                marginHorizontal: 3,
                                fontSize: 12,
                              }}>
                              {'\u2B24' + ' '}
                              {item}
                            </Text>
                          )}
                        />
                      </View>
                    ))}
                  </View>
                ))}

              {/* <FlatList
                contentContainerStyle={{
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
                numColumns={3}
                horizontal={false}
                data={[
                  {key: 'Mashroom'},
                  {key: 'Onion'},
                  {key: 'Cucumber'},
                  {key: 'Tomatos'},
                  {key: 'Olives'},
                ]}
                renderItem={({item}) => (
                  <Text
                    style={{
                      marginVertical: 3,
                      color: '#000000',
                      marginHorizontal: 3,
                      fontSize: 12,
                    }}>
                    {'\u2B24' + ' '}
                    {item.key}
                  </Text>
                )}
              /> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="center">
                {/* <Icon name="minus-circle" size={20} color="#D9D9D9" /> */}
                {/* <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#000000',
                    marginHorizontal: 20,
                  }}>
                  1
                </Text> */}
                {/* <Icon
                  name="plus-circle"
                  size={20}
                  color="#000000"
                  // onPress={() => setCounter(counter + 1)}
                /> */}
              </View>

              <Text
                style={{
                  fontSize: 20,
                  color: '#000000',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}>
                ${totalWithoutDiscount || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  itemCardContainer: {},
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bottomBoxCopy: {
    backgroundColor: '#132333',
    borderRadius: 5,
    height: 60,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    marginHorizontal: 16,
    marginVertical: 6,
  },
  subCardView: {
    height: 80,
    width: 80,

    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    // marginHorizontal: 20,
    // marginVertical: 10,
    borderRadius: 20,
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
  totalPriceBox: {
    backgroundColor: '#fff',
    borderRadius: 5,
    // height: 100,
    overflow: 'hidden',
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // paddingVertical: 5,
    // paddingHorizontal: 5,
    borderColor: '#E0E0E0',
    borderWidth: 2,
    // position: 'relative',

    // height: 100,
  },
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    // backgroundColor: 'red',
    marginVertical: 5,
    borderRadius: 5,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
  },
  inputStyle: {
    flex: 1,
    // width: 200,
    // height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 12,
    paddingHorizontal: 10,
    color: '#000000',
  },
});

export default MyCart;
