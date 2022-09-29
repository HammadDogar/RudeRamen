import React, {useContext, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Spinner, TextField} from '../../../components';
import {Formik, FieldArray} from 'formik';

import * as Yup from 'yup';
import {Button} from 'native-base';
import {MESSAGES} from '../../../constants';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {
  addAddonsToMenu,
  getMneuDetail,
} from '../../../services/CloudFunction/menu';
import {
  getExactError,
  notifyMessage,
  remoteTimeToHoursMinutsFormat,
} from '../../../utils/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const ingredientsSchema = Yup.object().shape({
  addOnsList: Yup.array().of(
    Yup.object().shape({
      toTime: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
      fromTime: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
      orderLimit: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
    }),
  ),
});

const UpdateOrderLimitedInTimeSlotModal = ({
  show,
  regetAddonsRecord,
  setRegetAddonsRecord,
  onHide,
  editWeeklyRecord,
}) => {
  const {user} = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeCompo, setShowTimeCompo] = useState(false);
  const [mode, setMode] = useState('date');
  const [clickState, setClickState] = useState(null);

  const addAddonsHandler = values => {};

  const onChange = (event, selectedDate, setFieldValue, ingredientIndex) => {
    const currentDate = selectedDate;
    setShowTimeCompo(false);
    if (clickState === 'fromTime') {
      // if (
      //   moment(selectedDate).format('HH:mm') >=
      //     moment(new Date(editWeeklyRecord.fromTime.seconds * 1000)).format(
      //       'HH:mm',
      //     ) &&
      //   moment(selectedDate).format('HH:mm') <=
      //     moment(new Date(editWeeklyRecord.toTime.seconds * 1000)).format(
      //       'HH:mm',
      //     )
      // ) {
      //   setFieldValue(`addOnsList[${ingredientIndex}].fromTime`, currentDate);
      // } else {
      //   notifyMessage(`from time must be in between available time`);
      // }
      setFieldValue(`addOnsList[${ingredientIndex}].fromTime`, currentDate);
    } else if (clickState === 'toTime') {
      setFieldValue(`addOnsList[${ingredientIndex}].toTime`, currentDate);

      // if (
      //   moment(selectedDate).format('HH:mm') >=
      //     moment(new Date(editWeeklyRecord.fromTime.seconds * 1000)).format(
      //       'HH:mm',
      //     ) &&
      //   moment(selectedDate).format('HH:mm') >
      //     moment(values.addOnsList[ingredientIndex].fromTime).format('HH:mm') &&
      //   moment(selectedDate).format('HH:mm') <=
      //     moment(new Date(editWeeklyRecord.toTime.seconds * 1000)).format(
      //       'HH:mm',
      //     )
      // ) {
      //   console.log('clickState:::', clickState);
      //   setFieldValue(`addOnsList[${ingredientIndex}].toTime`, currentDate);
      // } else {
      //   notifyMessage('to Time must be in between available time');
      // }
    } else {
      return;
    }
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShowTimeCompo(true);
    setMode(currentMode);
  };

  const showTimepicker = clickValue => {
    showMode('time');
    setClickState(clickValue);
    //     toTime
    // fromTime
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={onHide}>
      <Formik
        initialValues={{
          addOnsList: [
            {
              fromTime: '',
              toTime: '',
            },
          ],
        }}
        validationSchema={ingredientsSchema}
        onSubmit={values => addAddonsHandler(values)}>
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
                  Update Order Limit
                </Text>
              </View>

              <ScrollView>
                <View>
                  <View>
                    <FieldArray
                      name={`addOnsList`}
                      render={arrayHelper => (
                        <View>
                          {values.addOnsList.map((data, ingredientIndex) => (
                            <View
                              style={{
                                marginBottom: 10,
                                borderWidth: 2,
                                borderColor: 'black',
                                paddingHorizontal: 5,
                                // paddingVertical: 10,
                                borderRadius: 5,
                              }}>
                              {showTimeCompo && (
                                <DateTimePicker
                                  testID="dateTimePicker2"
                                  value={new Date()}
                                  mode={mode}
                                  is24Hour={true}
                                  onChange={(event, selectedDate) =>
                                    onChange(
                                      event,
                                      selectedDate,
                                      setFieldValue,
                                      ingredientIndex,
                                    )
                                  }
                                />
                              )}

                              {values.addOnsList.length > 1 && (
                                <View style={{alignSelf: 'flex-end'}}>
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

                              <View
                                style={{
                                  //   marginVertical: 10,
                                  //   marginLeft: 10,
                                  flex: 1,
                                }}>
                                {/* <Text style={styles.formLable}>To</Text> */}
                                <Pressable
                                  style={styles.formInputwraper}
                                  onPress={() => showTimepicker('fromTime')}>
                                  <View style={styles.formInputContainer}>
                                    <Text style={styles.formLable}>
                                      {values.addOnsList[ingredientIndex]
                                        .fromTime
                                        ? remoteTimeToHoursMinutsFormat(
                                            values.addOnsList[
                                              ingredientIndex
                                            ].fromTime.toLocaleString(),
                                          )
                                        : 'From'}
                                    </Text>
                                  </View>
                                </Pressable>
                                <View>
                                  {errors &&
                                  errors.addOnsList &&
                                  errors.addOnsList[ingredientIndex] &&
                                  errors.addOnsList[ingredientIndex].fromTime &&
                                  touched &&
                                  touched.addOnsList &&
                                  touched.addOnsList[ingredientIndex] &&
                                  touched.addOnsList[ingredientIndex]
                                    .fromTime ? (
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color: 'red',
                                      }}>
                                      {
                                        errors.addOnsList[ingredientIndex]
                                          .fromTime
                                      }
                                    </Text>
                                  ) : null}
                                </View>
                              </View>

                              <View
                                style={{
                                  //   marginVertical: 10,
                                  //   marginLeft: 10,
                                  flex: 1,
                                }}>
                                {/* <Text style={styles.formLable}>To</Text> */}
                                <Pressable
                                  style={styles.formInputwraper}
                                  onPress={() => showTimepicker('toTime')}>
                                  <View style={styles.formInputContainer}>
                                    <Text style={styles.formLable}>
                                      {values.addOnsList[ingredientIndex].toTime
                                        ? remoteTimeToHoursMinutsFormat(
                                            values.addOnsList[
                                              ingredientIndex
                                            ].toTime.toLocaleString(),
                                          )
                                        : 'To'}
                                    </Text>
                                  </View>
                                </Pressable>
                                <View>
                                  {errors &&
                                  errors.addOnsList &&
                                  errors.addOnsList[ingredientIndex] &&
                                  errors.addOnsList[ingredientIndex].toTime &&
                                  touched &&
                                  touched.addOnsList &&
                                  touched.addOnsList[ingredientIndex] &&
                                  touched.addOnsList[ingredientIndex].toTime ? (
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color: 'red',
                                      }}>
                                      {
                                        errors.addOnsList[ingredientIndex]
                                          .toTime
                                      }
                                    </Text>
                                  ) : null}
                                </View>
                              </View>

                              <View>
                                <TextField
                                  Style={styles.inputParent}
                                  Style_1={[
                                    styles.inputStyle,
                                    styles.formLable,
                                  ]}
                                  Style_2={[styles.inputIcon]}
                                  placeholder={'Order Limits'}
                                  placeholderTextColor="#132333"
                                  iconname={'user'}
                                  secure={false}
                                  size={22}
                                  isIcon={false}
                                  // keyboard={'email-address'}

                                  keyboardType="numeric"
                                  name={`addOnsList[${ingredientIndex}].addOnsCost`}
                                  //   onChangeText={handleChange('email')}
                                  //   onBlur={handleBlur('email')}
                                  //   value={values.email}
                                  onChangeText={handleChange(
                                    `addOnsList[${ingredientIndex}].addOnsCost`,
                                  )}
                                  onBlur={handleBlur(
                                    `addOnsList[${ingredientIndex}].addOnsCost`,
                                  )}
                                  value={
                                    values.addOnsList[ingredientIndex]
                                      .addOnsCost
                                  }
                                />

                                {errors &&
                                errors.addOnsList &&
                                errors.addOnsList[ingredientIndex] &&
                                errors.addOnsList[ingredientIndex].addOnsCost &&
                                touched &&
                                touched.addOnsList &&
                                touched.addOnsList[ingredientIndex] &&
                                touched.addOnsList[ingredientIndex]
                                  .addOnsCost ? (
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      color: 'red',
                                    }}>
                                    {
                                      errors.addOnsList[ingredientIndex]
                                        .addOnsCost
                                    }
                                  </Text>
                                ) : null}
                              </View>

                              {ingredientIndex > 0 && (
                                <View
                                  style={{
                                    flex: 0.2,
                                    alignItems: 'flex-end',
                                  }}>
                                  {/* <AiFillDelete
                                  className="d-inline text-danger dynamic-field-icons cursor"
                                  onClick={() => arrayHelper.remove(ingredientIndex)}
                                /> */}
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
                                fromTime: '',
                                toTime: '',
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
                    direction="row">
                    <Spinner color="primary.white" size={'sm'} />

                    {/* <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Lato-Bold',
                        color: '#ffffff',
                      }}>
                      Saving
                    </Text> */}
                  </Button>
                ) : (
                  <Button
                    style={{
                      backgroundColor: '#132333',

                      borderRadius: 5,
                      minWidth: 70,
                    }}
                    direction="row"
                    onPress={() => handleSubmit()}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Lato-Bold',
                        color: '#ffffff',
                      }}>
                      Save
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
    maxHeight: 400,
    alignSelf: 'stretch',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },

  inputParent: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 0,
    borderColor: '#132333',
  },

  inputIcon: {
    paddingLeft: 15,
    color: '#000000',
  },

  inputStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 55,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
    paddingHorizontal: 10,
    color: '#000000',
  },

  formLable: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    color: '#000000',
  },
  formInputwraper: {
    marginVertical: 5,
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
  formInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 20,
    position: 'relative',
    alignItems: 'center',
    height: 50,
  },
});

export default UpdateOrderLimitedInTimeSlotModal;
