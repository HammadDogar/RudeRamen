import React, {useContext, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Spinner, TextField} from '../../../components';
import {Formik, Form, FieldArray} from 'formik';

import * as Yup from 'yup';
import {Button, CheckIcon, Radio, Select, Stack} from 'native-base';
import {MESSAGES, SPACE_NOT_ALLOWED_REGEX} from '../../../constants';
import {
  addIngredientsToMenu,
  getMneuDetail,
  updateIngredientsToMenu,
  updateMenu,
} from '../../../services/CloudFunction/menu';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {getExactError, notifyMessage} from '../../../utils/utils';

const ingredientsSchema = Yup.object().shape({
  categoryName: Yup.string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .matches(SPACE_NOT_ALLOWED_REGEX, MESSAGES.GENERIC_REQUIRED_FIELD)
    .max(15, 'Category must be under 15 characters'),
  isRequired: Yup.bool().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  ingredients: Yup.array().of(
    Yup.object().shape({
      ingredientsName: Yup.string()
        .required(MESSAGES.GENERIC_REQUIRED_FIELD)
        .matches(SPACE_NOT_ALLOWED_REGEX, MESSAGES.GENERIC_REQUIRED_FIELD)
        .max(15, 'Ingredient name must be under 15 characters'),
    }),
  ),
  selectPermisson: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
});

const AddIngredientsModal = ({
  show,
  onHide,
  regetRecord,
  ingredientsToEdit,
  setRegetRecord,
}) => {
  const {user} = useContext(AuthenticationContext);

  const [isLoading, setIsLoading] = useState(false);

  const onSelectTimeSlot = value => {
    // setPickupTime(value);
    // onHide();
  };

  const addIngredientsHandler = values => {
    setIsLoading(true);
    getMneuDetail(user.uid)
      .then(response => {
        addIngredientsToMenu(response.uid, values)
          .then(res => {
            setIsLoading(false);
            notifyMessage('Ingredients added successfully');
            onHide();
            setRegetRecord(!regetRecord);
          })
          .catch(error => {
            setIsLoading(false);
            notifyMessage(getExactError(error));
          });
      })
      .catch(error => {
        setIsLoading(false);
        notifyMessage(getExactError(error));
      });
  };

  const updateIngredients = values => {
    setIsLoading(true);
    getMneuDetail(user.uid)
      .then(response => {
        updateIngredientsToMenu(response.uid, ingredientsToEdit.uid, values)
          .then(res => {
            setIsLoading(false);
            notifyMessage('Ingredients updated successfully');
            onHide();
            setRegetRecord(!regetRecord);
          })
          .catch(error => {
            setIsLoading(false);
            notifyMessage(getExactError(error));
          });
      })
      .catch(error => {
        setIsLoading(false);
        notifyMessage(getExactError(error));
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={onHide}>
      <Formik
        initialValues={{
          categoryName: ingredientsToEdit?.categoryName || '',
          isRequired: ingredientsToEdit?.isRequired,
          selectPermisson: ingredientsToEdit?.selectPermisson || 'false',
          ingredients: ingredientsToEdit?.ingredients || [
            {
              ingredientsName: '',
            },
          ],
        }}
        validationSchema={ingredientsSchema}
        onSubmit={values =>
          ingredientsToEdit
            ? updateIngredients(values)
            : addIngredientsHandler(values)
        }>
        {({
          errors,
          values,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
        }) => (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                <TouchableOpacity onPress={onHide}>
                  <AntIcon
                    name="close"
                    size={20}
                    color="#2285E8"
                    style={{marginHorizontal: 5}}
                    // onPress={onHide}
                  />
                </TouchableOpacity>
              </View>
              <View marginBottom={15}>
                <Text
                  style={{
                    color: '#132333',
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {' '}
                  {ingredientsToEdit ? 'Update Ingredients' : 'Add Ingredients'}
                </Text>
              </View>
              <ScrollView>
                <View>
                  <View>
                    <View>
                      <TextField
                        Style={styles.inputParent}
                        Style_1={[styles.inputStyle]}
                        Style_2={[styles.inputIcon]}
                        placeholder={'Add Category'}
                        placeholderTextColor="#132333"
                        iconname={'user'}
                        secure={false}
                        size={22}
                        isIcon={false}
                        keyboard={'email-address'}
                        name="categoryName"
                        onChangeText={handleChange('categoryName')}
                        onBlur={handleBlur('categoryName')}
                        value={values.categoryName}
                        keyboardType="email-address"
                      />

                      {errors.categoryName && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: 'red',
                          }}>
                          {errors.categoryName}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Radio.Group
                        name={`isRequired`}
                        accessibilityLabel={`isRequired`}
                        defaultValue={values.isRequired}
                        onChange={nextValue => {
                          setFieldValue('isRequired', nextValue);
                          // setValue(
                          //   `menuItems[${itemIndex}].ingredients[${categoryIndex}]`,
                          //   {
                          //     categoryName:
                          //       ingredientItem.categoryName,
                          //     isMultiSelect: false,
                          //     categoryValue: nextValue,
                          //   },
                          // );
                        }}>
                        <View style={{flex: 1}}>
                          <Radio value={true} my={1}>
                            <Text
                              style={{
                                color: '#484848',
                                fontSize: 12,
                                fontFamily: 'Lato-Bold',
                              }}>
                              Required
                            </Text>
                          </Radio>

                          <Radio value={false} my={1}>
                            <Text
                              style={{
                                color: '#484848',
                                fontSize: 12,
                                fontFamily: 'Lato-Bold',
                              }}>
                              Optional
                            </Text>
                          </Radio>
                        </View>
                      </Radio.Group>
                      {errors.isRequired && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: 'red',
                          }}>
                          {errors.isRequired}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Select
                        accessibilityLabel="Selection"
                        placeholder="Select Permission"
                        borderColor={'primary.blue'}
                        backgroundColor={'primary.grey100'}
                        color={'primary.black'}
                        minWidth={150}
                        width={'100%'}
                        placeholderTextColor="primary.blue"
                        // height={'8'}
                        fontSize={'sm'}
                        _selectedItem={{
                          bg: '#CFCFCF',
                          color: 'primary.grey100',
                          endIcon: <CheckIcon color="#primary." size="4" />,
                        }}
                        selectedValue={values.selectPermisson}
                        value={values.selectPermisson}
                        defaultValue={values.selectPermisson}
                        onValueChange={itemValue =>
                          setFieldValue('selectPermisson', itemValue)
                        }
                        mt={1}>
                        <Select.Item label="Single Select" value={'false'} />
                        <Select.Item label="Multi Select" value={'true'} />
                      </Select>
                      {errors.selectPermisson && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: 'red',
                          }}>
                          {errors.selectPermisson}
                        </Text>
                      )}
                    </View>
                    {/* selectPermisson */}
                    <FieldArray
                      // style={{marginTop: 10}}
                      name={`ingredients`}
                      render={arrayHelper => (
                        <View>
                          {values.ingredients.map((data, ingredientIndex) => (
                            <View
                              style={{
                                //   flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View style={{flex: 1}}>
                                <TextField
                                  Style={styles.inputParent}
                                  Style_1={[styles.inputStyle]}
                                  Style_2={[styles.inputIcon]}
                                  placeholder={'Add Option'}
                                  placeholderTextColor="#132333"
                                  iconname={'user'}
                                  secure={false}
                                  size={22}
                                  isIcon={false}
                                  keyboard={'email-address'}
                                  name={`ingredients[${ingredientIndex}].ingredientsName`}
                                  onChangeText={handleChange(
                                    `ingredients[${ingredientIndex}].ingredientsName`,
                                  )}
                                  onBlur={handleBlur(
                                    `ingredients[${ingredientIndex}].ingredientsName`,
                                  )}
                                  value={
                                    values.ingredients[ingredientIndex]
                                      .ingredientsName
                                  }
                                  keyboardType="email-address"
                                />

                                {errors &&
                                errors.ingredients &&
                                errors.ingredients[ingredientIndex] &&
                                errors.ingredients[ingredientIndex]
                                  .ingredientsName &&
                                touched &&
                                touched.ingredients &&
                                touched.ingredients[ingredientIndex] &&
                                touched.ingredients[ingredientIndex]
                                  .ingredientsName ? (
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      color: 'red',
                                    }}>
                                    {
                                      errors.ingredients[ingredientIndex]
                                        .ingredientsName
                                    }
                                  </Text>
                                ) : null}
                              </View>

                              {ingredientIndex > 0 && (
                                <View
                                  style={{
                                    flex: 0.2,
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                  }}>
                                  {/* <AiFillDelete
                                  className="d-inline text-danger dynamic-field-icons cursor"
                                  onClick={() => arrayHelper.remove(ingredientIndex)}
                                /> */}
                                  <AntIcon
                                    name="delete"
                                    size={20}
                                    color="red"
                                    style={{marginHorizontal: 5}}
                                    onPress={() =>
                                      arrayHelper.remove(ingredientIndex)
                                    }
                                  />
                                </View>
                              )}
                            </View>
                          ))}

                          <TouchableOpacity
                            style={{
                              alignSelf: 'flex-end',
                            }}
                            onPress={() =>
                              arrayHelper.push({
                                ingredientsName: '',
                              })
                            }>
                            <Text
                              style={{
                                fontSize: 16,
                                color: '#2285E8',
                              }}>
                              Add more
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    />

                    {/*  */}
                  </View>
                </View>
              </ScrollView>
              <View
                flexDirection="row"
                justifyContent="center"
                marginVertical={10}>
                {isLoading ? (
                  <Button
                    style={{
                      backgroundColor: '#132333',

                      borderRadius: 5,
                      minWidth: 70,
                    }}
                    flexDirection="row">
                    <Spinner color="primary.white" size={'sm'} />

                    {/* <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Lato-Bold',
                        color: '#ffffff',
                      }}>
                      Saving...
                    </Text> */}
                  </Button>
                ) : (
                  <Button
                    style={{
                      backgroundColor: '#132333',

                      borderRadius: 5,
                      minWidth: 70,
                    }}
                    flexDirection="row"
                    onPress={() => handleSubmit()}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Lato-Bold',
                        color: '#ffffff',
                      }}>
                      {ingredientsToEdit ? 'Update' : 'Save'}
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </View>
        )}
      </Formik>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    maxHeight: 500,
    alignSelf: 'stretch',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },

  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#132333',
    backgroundColor: '#F7F7F7',
  },

  inputIcon: {
    paddingLeft: 15,
    color: '#000000',
  },

  inputStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 55,
    // height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
    paddingHorizontal: 10,
    color: '#000000',
    ...Platform.select({
      ios: {
        height: 40,
      },
    }),
  },
});

export default AddIngredientsModal;
