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
// import {Formik, Field, Form, FieldArray} from 'formik';
import {MESSAGES, SPACE_NOT_ALLOWED_REGEX} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {notifyMessage} from '../../utils/utils';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';

import {Formik, Field, Form, FieldArray} from 'formik';
import {useForm, Controller, useFieldArray, set} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

const BowlCreation = ({navigation, route}) => {
  let {resturantId} = route.params;

  const [counter, setCounter] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickupTime, setPickupTime] = useState(null);
  // const [value, setValue] = useState('one');
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [error, setError] = useState(false);
  const [menuDetails, setMenuDetails] = useState(null);
  const [alreadySaveSlot, setAlreadySaveSlot] = useState('');
  const [color, setColor] = useState(null);

  const [validateSchema, setValidateSchema] = useState({
    slot: yup.string().required('This Field is required'),
    specialInstruction: yup
      .string()
      .max(150, 'Instruction must be under 150 characters'),
  });

  const [orderData, setOrderData] = useState([]);
  const [isLoadingAddingItemIntoCart, setIsLoadingAddingItemIntoCart] =
    useState(false);

  const validationSchemaObject = yup.object().shape(validateSchema);

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: {errors},
    clearErrors,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchemaObject),
    defaultValues: {
      specialInstruction: '',
      slot: alreadySaveSlot,
      count: 1,
      menuItems: [
        {
          name: 'usam',
          ingredients: [],
        },
      ],
    },
  });

  const {fields, append, prepend, remove, swap, move, insert} = useFieldArray({
    control,
    name: 'menuItems',
  });

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
      setOrderData(cartDataInLocalStorage);
      setAlreadySaveSlot(JSON.stringify(cartDataInLocalStorage?.slot));
      setPickupTime(cartDataInLocalStorage?.slot);

      if (cartDataInLocalStorage?.slot) {
        setValue('slot', JSON.stringify(cartDataInLocalStorage?.slot));
      }
    };
    getDataFromLocalStorage();
  }, []);

  useEffect(() => {
    if (orderData && orderData.menuItems) {
      setValue('specialInstruction', orderData?.specialInstruction);
      setValue('menuItems', orderData?.menuItems);
      setCounter(orderData?.count);
    } else {
      let menuItemToSet = menuDetails?.ingredients?.map(menuItemObj => {
        if (menuItemObj.selectPermisson === 'false') {
          return {
            categoryName: menuItemObj.categoryName,
            isMultiSelect: false,
            isRequired: menuItemObj.isRequired,
            categoryValue: '',
          };
        } else {
          return {
            categoryName: menuItemObj.categoryName,
            isMultiSelect: true,
            isRequired: menuItemObj.isRequired,
            categoryValue: [],
          };
        }
      });
      setValue('menuItems', [
        {
          ingredients: menuItemToSet,
        },
      ]);
    }
  }, [orderData, menuDetails?.ingredients]);

  // useEffect(() => {
  //   let isRequiredOptions = menuDetails?.ingredients?.filter((item, index) => {
  //     return item?.isRequired === true;
  //   });
  //   let validationCustom = {};
  //   let finalValidationObject;
  //   if (isRequiredOptions?.length > 0) {
  //     for (let i = 0; i < isRequiredOptions.length; i++) {
  //       let name = isRequiredOptions[i]?.categoryName.replace(/\s/g, '');
  //       validationCustom = {
  //         ...validationCustom,
  //         [name]: yup.string().required('Chose atleast one option'),
  //       };
  //     }
  //     finalValidationObject = yup.array().of(
  //       yup.object().shape({
  //         ...validationCustom,
  //       }),
  //     );
  //   }
  //   setValidateSchema(prev => ({
  //     ...prev,
  //     menuItems: yup.array().of(
  //       yup.object().shape({
  //         ingredients: finalValidationObject,
  //       }),
  //     ),
  //   }));
  // }, [menuDetails]);

  const onSubmit = async values => {
    setIsLoadingAddingItemIntoCart(true);

    // try {
    //   const value = await AsyncStorage.removeItem('cart_Items');
    // } catch (error) {}
    let fieldFillOrnot = values.menuItems.find(menuItemObj => {
      let ingredientsNotFill = menuItemObj.ingredients.find(subObject => {
        if (subObject.isRequired && subObject.categoryValue.length === 0) {
          return subObject;
        }
      });
      if (ingredientsNotFill) {
        setColor('red');
        return ingredientsNotFill;
      } else {
        setColor(null);
        return null;
      }
    });
    // return;

    if (fieldFillOrnot) {
      notifyMessage('Please Fill Required Options');
      setIsLoadingAddingItemIntoCart(false);
      return;
    }
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

      // if (value !== null) {
      //   let asynValueInJson = JSON.parse(value);

      //   let valuesWithoutSlotKey = [values].map(({slot, ...rest}) => ({
      //     ...rest,
      //     count: counter,
      //   }));
      //   try {
      //     await AsyncStorage.setItem(
      //       'cart_Items',
      //       JSON.stringify({
      //         ...asynValueInJson,
      //         cartItem: [...asynValueInJson.cartItem, ...valuesWithoutSlotKey],
      //       }),
      //     );
      //     setIsLoadingAddingItemIntoCart(false);
      //     navigation.navigate(ROUTES.CUSTOMMER_CART);
      //   } catch (error) {
      //     setIsLoadingAddingItemIntoCart(false);
      //   }
      // } else {

      // let valuesWithoutSlotKey = [values].map(({slot, ...rest}) => ({
      //   ...rest,
      //   count: counter,
      // }));
      let slotInJson = JSON.parse(values.slot);

      try {
        let finalPayload = {
          ...values,
          itemDetail: ItemDetails,
          slot: slotInJson,
          count: fields.length,
        };

        // console.log('values>>>>>', JSON.stringify(finalPayload, null, 2));
        // return;

        await AsyncStorage.setItem('cart_Items', JSON.stringify(finalPayload));

        setIsLoadingAddingItemIntoCart(false);
        navigation.navigate(ROUTES.CUSTOMMER_CART);
      } catch (e) {
        setIsLoadingAddingItemIntoCart(false);
      }
      // }
    } catch (e) {
      setIsLoadingAddingItemIntoCart(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {console.log('getValues>>>>', getValues('menuItems'))}
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
                      let countValues = getValues('count');
                      if (fields.length > 1) {
                        remove(fields.length - 1);
                        // setValue("count", countValues - 1);
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
                    {fields.length}
                  </Text>
                  <Icon
                    name="plus-circle"
                    size={30}
                    color="#000000"
                    onPress={() => {
                      let countValues = getValues('count');
                      // setValue("count", countValues + 1);
                      append({
                        ingredients: fields[0]?.ingredients,
                      });
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.descriptionTittle}>Description</Text>
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
                  {/* <Text> */}
                  {pickupTime && (
                    <View style={styles.timeBox}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#484848',
                        }}>
                        <Text>{pickupTime.from}</Text>-{''}
                        <Text>{pickupTime.to}</Text>
                      </Text>
                    </View>
                  )}
                  {/* </Text> */}

                  {errors && errors.slot ? (
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'red',
                        }}>
                        {errors.slot.message}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {console.log('fields', JSON.stringify(fields, null, 2))}

                {console.log('ERROR', JSON.stringify(errors, null, 2))}

                {fields?.map((menuItem, itemIndex) => (
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
                                {ingredientItem.isRequired ? (
                                  <Text
                                    style={{
                                      color:
                                        color &&
                                        menuItem.ingredients[categoryIndex]
                                          ?.categoryValue.length === 0
                                          ? color
                                          : '#848484',
                                    }}>
                                    Required
                                  </Text>
                                ) : (
                                  'Optional'
                                )}
                              </Text>
                            </View>
                            {/* {errors &&
                            errors.menuItems &&
                            errors.menuItems[itemIndex] &&
                            errors.menuItems[itemIndex][
                              `${ingredientItem?.categoryName}`
                            ] ? (
                              <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: 'red',
                                  }}>
                                  {errors &&
                                    errors.menuItems &&
                                    errors.menuItems[itemIndex] &&
                                    errors.menuItems[itemIndex][
                                      `${ingredientItem?.categoryName}`
                                    ]?.message}
                                </Text>
                              </View>
                            ) : null} */}
                            <View
                              style={{
                                marginVertical: 5,
                              }}>
                              {ingredientItem &&
                              ingredientItem.selectPermisson === 'false' ? (
                                <Radio.Group
                                  name={`menuItems[${itemIndex}].ingredients[${categoryIndex}]`}
                                  accessibilityLabel={`${ingredientItem.categoryName}`}
                                  defaultValue={
                                    menuItem && menuItem.ingredients
                                      ? menuItem?.ingredients[categoryIndex]
                                          ?.categoryValue
                                      : ''
                                  }
                                  onChange={nextValue => {
                                    setValue(
                                      `menuItems[${itemIndex}].ingredients[${categoryIndex}]`,
                                      {
                                        categoryName:
                                          ingredientItem.categoryName,
                                        isMultiSelect: false,
                                        isRequired: ingredientItem.isRequired,
                                        categoryValue: nextValue,
                                      },
                                    );
                                    clearErrors(
                                      `menuItems[${itemIndex}][${ingredientItem?.categoryName}]`,
                                    );
                                  }}>
                                  {ingredientItem &&
                                    ingredientItem.ingredients.length > 0 &&
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
                                            {ingredientSub.ingredientsName}
                                          </Text>
                                        </Radio>
                                      ),
                                    )}
                                </Radio.Group>
                              ) : (
                                <Checkbox.Group
                                  name={`menuItems[${itemIndex}].ingredients[${categoryIndex}]`}
                                  accessibilityLabel={`${ingredientItem.categoryName}`}
                                  defaultValue={
                                    menuItem && menuItem.ingredients
                                      ? menuItem?.ingredients[categoryIndex]
                                          ?.categoryValue
                                      : ''
                                  }
                                  onChange={values => {
                                    setValue(
                                      `menuItems[${itemIndex}].ingredients[${categoryIndex}]`,
                                      {
                                        categoryName:
                                          ingredientItem.categoryName,
                                        categoryValue: values,
                                        isRequired: ingredientItem.isRequired,
                                        isMultiSelect: true,
                                      },
                                    );
                                    clearErrors(
                                      `menuItems[${itemIndex}][${ingredientItem?.categoryName}]`,
                                    );
                                  }}>
                                  {ingredientItem &&
                                    ingredientItem.ingredients.length > 0 &&
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
                                            {ingredientSub.ingredientsName}
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
                    (Please let us know if you are allergic to anything or if we
                    need to avoid anything.)
                  </Text>

                  <TextArea
                    h={40}
                    placeholder=""
                    w="100%"
                    defaultValue={getValues('specialInstruction')}
                    onChangeText={text => setValue('specialInstruction', text)}
                  />

                  {errors && errors.specialInstruction ? (
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'red',
                        }}>
                        {errors.specialInstruction.message}
                      </Text>
                    </View>
                  ) : null}
                </Box>
              </View>
            </ScrollView>
            <View style={[styles.shadow]}>
              <View style={styles.bottomBoxCopy}>
                {/* <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#2285E8',
                  }}>
                  Create another bowl
                </Text> */}

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
                    onPress={handleSubmit(onSubmit)}>
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

        {modalVisible && (
          <ScheduleModal
            show={modalVisible}
            setPickupTime={setPickupTime}
            onHide={() => setModalVisible(false)}
            resturantId={resturantId}
            setFieldValue={setValue}
            clearErrors={clearErrors}
          />
        )}
      </View>
    </SafeAreaView>
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
