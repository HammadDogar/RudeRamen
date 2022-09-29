import React, {useContext, useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';

import {IMAGES} from '../../assets/Images';
import {TextField, RadioButton, Spinner} from '../../components';
import ScheduleModal from './scheduleModal';
import {metrics} from '../../assets/style';
import {Box, Button, Checkbox, Radio, TextArea} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {ROUTES} from '../../navigation/Routes';
import {getMneuDetail} from '../../services/CloudFunction/menu';
import moment from 'moment';
import * as yup from 'yup';
import {Formik, Field, Form, FieldArray} from 'formik';
import {MESSAGES} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {notifyMessage} from '../../utils/utils';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';

const BowlCreation = ({navigation, route}) => {
  let {resturantId} = route.params;

  const [counter, setCounter] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickupTime, setPickupTime] = useState(null);
  const [value, setValue] = useState('one');
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [error, setError] = useState(false);
  const [menuDetails, setMenuDetails] = useState(null);
  const [alreadySaveSlot, setAlreadySaveSlot] = useState('');
  const [validateSchema, setValidateSchema] = useState({
    slot: yup.object().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  });
  const [isLoadingAddingItemIntoCart, setIsLoadingAddingItemIntoCart] =
    useState(false);

  const validationSchemaObject = yup.object().shape(validateSchema);

  useEffect(() => {
    setIsLoadingMenu(true);
    setError(false);
    getMneuDetail(resturantId)
      .then(response => {
        setMenuDetails(response || null);
        setIsLoadingMenu(false);
        setError(false);
      })
      .catch(() => {
        setIsLoadingMenu(false);
        setError(true);
      });
  }, []);

  const createBowlSchema = yup.object().shape(validateSchema);

  useEffect(() => {
    const getDataFromLocalStorage = async () => {
      let cartDataInLocalStorage = await AsyncStorage.getItem('cart_Items');
      cartDataInLocalStorage = JSON.parse(cartDataInLocalStorage);
      setAlreadySaveSlot(cartDataInLocalStorage?.slot);
      setPickupTime(cartDataInLocalStorage?.slot);
    };
    getDataFromLocalStorage();
  }, []);

  return (
    <Formik
      validationSchema={createBowlSchema}
      initialValues={{
        specialInstruction: '',
        slot: alreadySaveSlot,
        menuItems: [{}],
      }}
      onSubmit={async values => {
        setIsLoadingAddingItemIntoCart(true);

        // try {
        //   const value = await AsyncStorage.removeItem('cart_Items');
        // } catch (error) {}
        // return;
        let ItemDetails = {
          bowlPrice: menuDetails?.bowlPrice,
          bowlName: menuDetails?.bowlName,
          bowlDescription: menuDetails?.bowlDescription,
          restaurantsUserId: menuDetails?.restaurantsUserId,
          bowlImage: menuDetails?.bowlImage,
          menuUid: menuDetails?.uid,
        };
        try {
          const value = await AsyncStorage.getItem('cart_Items');

          if (value !== null) {
            let asynValueInJson = JSON.parse(value);
            let valuesWithoutSlotKey = [values].map(({slot, ...rest}) => ({
              ...rest,
              count: counter,
            }));
            try {
              await AsyncStorage.setItem(
                'cart_Items',
                JSON.stringify({
                  ...asynValueInJson,
                  cartItem: [
                    ...asynValueInJson.cartItem,
                    ...valuesWithoutSlotKey,
                  ],
                }),
              );
              setIsLoadingAddingItemIntoCart(false);
              navigation.navigate(ROUTES.CUSTOMMER_CART);
            } catch (error) {
              setIsLoadingAddingItemIntoCart(false);
            }
          } else {
            let valuesWithoutSlotKey = [values].map(({slot, ...rest}) => ({
              ...rest,
              count: counter,
            }));

            try {
              await AsyncStorage.setItem(
                'cart_Items',
                JSON.stringify({
                  itemDetail: ItemDetails,
                  slot: values.slot,
                  cartItem: valuesWithoutSlotKey,
                }),
              );
              setIsLoadingAddingItemIntoCart(false);
              navigation.navigate(ROUTES.CUSTOMMER_CART);
            } catch (e) {
              setIsLoadingAddingItemIntoCart(false);
            }
          }
        } catch (e) {
          setIsLoadingAddingItemIntoCart(false);
        }
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        isValid,
      }) => (
        <SafeAreaView style={styles.container}>
          <View style={{flex: 1}}>
            <View
              style={{
                height: 60,
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <Icon
                name="chevron-left"
                size={30}
                color="#000000"
                onPress={() => navigation.goBack()}
              />
            </View>
            {isLoadingMenu && (
              <View>
                <Spinner color="primary.blue" />
              </View>
            )}
            {!isLoadingMenu && (
              <FieldArray
                name={`menuItems`}
                render={arrayHelper => (
                  <View style={{flex: 1}}>
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                      showsHorizontalScrollIndicator={true}
                      contentContainerStyle={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles.itemDetailsBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              color: '#484848',
                              fontSize: 20,
                              fontFamily: 'Lato-Bold',
                            }}>
                            {menuDetails && menuDetails.bowlName}
                          </Text>
                          <Text
                            style={{
                              color: '#484848',
                              fontSize: 20,
                              fontFamily: 'Lato-Bold',
                            }}>
                            $ {menuDetails && menuDetails.bowlPrice}
                          </Text>
                        </View>

                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            resizeMode="cover"
                            style={{
                              height: 200,
                              width: 200,
                              borderRadius: 100,
                              marginVertical: 10,
                            }}
                            source={{
                              uri: menuDetails && menuDetails.bowlImage,
                            }}
                          />
                        </View>
                        <View
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="center">
                          <Icon
                            name="minus-circle"
                            size={30}
                            color="#D9D9D9"
                            onPress={() => {
                              if (counter > 1) {
                                setCounter(counter - 1);
                                // arrayHelper.remove(values.menuItems.length - 1);
                              } else {
                                setCounter(1);
                              }
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 'bold',
                              color: '#000000',
                              marginHorizontal: 20,
                            }}>
                            {counter}
                          </Text>
                          <Icon
                            name="plus-circle"
                            size={30}
                            color="#000000"
                            onPress={() => {
                              setCounter(counter + 1);
                              // arrayHelper.push(values.menuItems[0]);
                            }}
                          />
                        </View>
                        <View>
                          <Text style={styles.descriptionTittle}>
                            Description
                          </Text>
                          <Text style={styles.descriptionDetails}>
                            {menuDetails && menuDetails.bowlDescription}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderBottomColor: '#E0E0E0',
                            borderBottomWidth: 1,
                            paddingVertical: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                            onPress={() =>
                              !alreadySaveSlot
                                ? setModalVisible(true)
                                : notifyMessage('Please Empty Cart First')
                            }>
                            <Text
                              style={{
                                fontSize: 16,
                                color: '#2285E8',
                              }}>
                              Pick your time slot
                            </Text>
                            <AntIcon
                              name="edit"
                              size={22}
                              color="#2285E8"
                              style={{marginHorizontal: 10}}
                            />
                          </TouchableOpacity>

                          {pickupTime && (
                            <View style={styles.timeBox}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: '#484848',
                                }}>
                                <Text>
                                  {pickupTime.from}

                                  {/* {moment(
                                new Date(pickupTime.from.seconds * 1000),
                              ).format('hh:mm a')} */}
                                </Text>{' '}
                                -{' '}
                                <Text>
                                  {pickupTime.to}
                                  {/* {moment(
                                new Date(pickupTime.to.seconds * 1000),
                              ).format('hh:mm a')} */}
                                </Text>
                              </Text>
                            </View>
                          )}

                          {errors && errors.slot && touched && touched.slot ? (
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: 'red',
                                }}>
                                {errors.slot}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        {values?.menuItems?.map((menuItem, itemIndex) => (
                          <View
                            style={{
                              paddingVertical: 10,
                              borderBottomColor: '#E0E0E0',
                              borderBottomWidth: 1,
                              paddingVertical: 10,
                            }}>
                            {menuDetails &&
                              menuDetails.ingredients &&
                              menuDetails.ingredients.length > 0 &&
                              menuDetails.ingredients.map(
                                (ingredientItem, categoryIndex) => (
                                  <View>
                                    <View
                                      flexDirection="row"
                                      justifyContent="space-between">
                                      <Text style={styles.descriptionTittle}>
                                        {ingredientItem?.categoryName}
                                      </Text>
                                      <Text
                                        style={{
                                          fontFamily: 'Lato-Bold',
                                          backgroundColor: '#EDEDED',
                                          borderRadius: 30,
                                          fontSize: 12,
                                          color: '#848484',
                                          padding: 5,
                                        }}>
                                        {ingredientItem.ingredientItemselectPermisson ===
                                        true
                                          ? '1 Required'
                                          : 'Optional'}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        marginVertical: 5,
                                      }}>
                                      {ingredientItem &&
                                      ingredientItem.selectPermisson ===
                                        'false' ? (
                                        <Radio.Group
                                          name={`menuItems[${itemIndex}].ingredients[${categoryIndex}]`}
                                          accessibilityLabel={`${ingredientItem.categoryName}`}
                                          onChange={nextValue => {
                                            setFieldValue(
                                              `menuItems[${itemIndex}].ingredients[${categoryIndex}]`,
                                              {
                                                categoryName:
                                                  ingredientItem.categoryName,
                                                categoryValue: [nextValue],
                                              },
                                            );
                                          }}>
                                          {ingredientItem &&
                                            ingredientItem.ingredients.length >
                                              0 &&
                                            ingredientItem.ingredients.map(
                                              ingredientSub => (
                                                <Radio
                                                  value={`${ingredientSub.ingredientsName}`}
                                                  my={1}>
                                                  <Text
                                                    style={{
                                                      color: '#484848',
                                                      fontSize: 12,
                                                      fontFamily: 'Lato-Bold',
                                                    }}>
                                                    {
                                                      ingredientSub.ingredientsName
                                                    }
                                                  </Text>
                                                </Radio>
                                              ),
                                            )}
                                        </Radio.Group>
                                      ) : (
                                        <Checkbox.Group
                                          // value={groupValues}
                                          name={`menuItems[${itemIndex}].ingredients[${categoryIndex}]`}
                                          accessibilityLabel={`${ingredientItem.categoryName}`}
                                          onChange={values =>
                                            setFieldValue(
                                              `menuItems[${itemIndex}].ingredients[${categoryIndex}]`,
                                              {
                                                categoryName:
                                                  ingredientItem.categoryName,
                                                categoryValue: values,
                                              },
                                            )
                                          }>
                                          {/* {ingredientItem &&
                                            ingredientItem.ingredients.length >
                                              0 &&
                                            ingredientItem.ingredients.map(
                                              ingredientSub => (
                                                
                                              )} */}
                                          {ingredientItem &&
                                            ingredientItem.ingredients.length >
                                              0 &&
                                            ingredientItem.ingredients.map(
                                              ingredientSub => (
                                                <Checkbox
                                                  value={`${ingredientSub.ingredientsName}`}
                                                  accessibilityLabel={`${ingredientSub.ingredientsName}`}
                                                  my={2}>
                                                  <Text
                                                    style={{
                                                      color: '#484848',
                                                      fontSize: 12,
                                                      fontFamily: 'Lato-Bold',
                                                    }}>
                                                    {
                                                      ingredientSub.ingredientsName
                                                    }
                                                  </Text>
                                                </Checkbox>
                                              ),
                                            )}
                                        </Checkbox.Group>
                                      )}
                                    </View>
                                  </View>
                                ),
                              )}
                          </View>
                        ))}
                        <Box
                          w="100%"
                          style={{
                            paddingVertical: 10,
                          }}>
                          <Text style={[styles.descriptionTittle]}>
                            Special Instructions{' '}
                          </Text>
                          <Text style={styles.descriptionDetails}>
                            (Please let us know if you are allergic to anything
                            or if we need to avoid anything.)
                          </Text>
                          <TextArea
                            h={40}
                            placeholder=""
                            w="100%"
                            onChangeText={text =>
                              setFieldValue('specialInstruction', text)
                            }
                          />
                        </Box>
                      </View>
                    </ScrollView>
                    <View style={[styles.shadow]}>
                      <View style={styles.bottomBoxCopy}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: '#2285E8',
                          }}>
                          Create another bowl
                        </Text>

                        {isLoadingAddingItemIntoCart ? (
                          <Button
                            style={{
                              backgroundColor: '#132333',
                              maxWidth: 150,
                              width: '100%',
                            }}
                            flexDirection="row">
                            <Spinner color="primary.white" size={'sm'} />
                          </Button>
                        ) : (
                          <Button
                            style={{
                              backgroundColor: '#132333',
                              maxWidth: 150,
                              width: '100%',
                            }}
                            flexDirection="row"
                            onPress={() => handleSubmit()}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: 'Lato-Bold',
                                color: '#ffffff',
                              }}>
                              Add to cart
                            </Text>
                          </Button>
                        )}
                      </View>
                    </View>
                  </View>
                )}
              />
            )}

            {modalVisible && (
              <ScheduleModal
                show={modalVisible}
                setPickupTime={setPickupTime}
                onHide={() => setModalVisible(false)}
                resturantId={resturantId}
                setFieldValue={setFieldValue}
              />
            )}
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#ffffff',
  },
  bottomBox: {
    height: 120,
    // marginTop: 10,
    // marginBottom: 30,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  itemDetailsBox: {
    paddingHorizontal: 20,
  },
  heading1: {
    fontSize: 20,
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
  bottomBoxCopy: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 100,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor: '#E0E0E0',
    borderWidth: 2,
  },
  tittleStyle: {
    fontSize: 30,
    color: '#484848',
    fontFamily: 'Lato-Bold',
  },
  subTittle: {
    fontSize: 16,
    color: '#484848',
    fontFamily: 'Lato-Bold',
  },
  descriptionTittle: {
    fontSize: 16,
    color: '#484848',
    fontFamily: 'Lato-Bold',
  },
  descriptionDetails: {
    fontSize: 14,
    color: '#484848',
    fontFamily: 'Lato-Regular',
    marginVertical: 5,
  },
  timeBox: {
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  inputParent: {
    // flexDirection: 'row',
    // alignItems: 'center',
    borderColor: '#D9D9D9',
    borderWidth: 1,
  },
  inputStyle: {
    // flex: 1,
    textAlignVertical: 'top',
    fontSize: 18,
  },
});

export default BowlCreation;
