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
import {Formik} from 'formik';

import * as Yup from 'yup';
import {Button} from 'native-base';
import {MESSAGES} from '../../../constants';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {
  notifyMessage,
  remoteTimeToHoursMinutsFormat,
  remoteTimeToHoursMinutsWithAmAndPmFormat,
  getTimeDateDetailsObject,
  get24HourTimeFromDate,
} from '../../../utils/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import uuid from 'uuid-random';
import {updateScheduleList} from '../../../services/CloudFunction/scheduleManagment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ingredientsSchema = Yup.object().shape({
  toTime: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  fromTime: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  orderLimit: Yup.number()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .min(1, 'Limit must be greater then 1 ')
    .max(99, 'Limit must not exceed more than 2 digits '),
});

const UpdateOrderLimitedInTimeSlotModal = ({
  show,
  onHide,
  editWeeklyRecord,
  schedules,
  setRerenderState,
  reRenderState,
}) => {
  const {user} = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeCompo, setShowTimeCompo] = useState(false);
  const [mode, setMode] = useState('date');
  const [clickState, setClickState] = useState(null);

  const addAddonsHandler = async values => {
    let fromTimeObject = getTimeDateDetailsObject(
      new Date(editWeeklyRecord.fromTime.seconds * 1000),
    );
    let toTimeObject = getTimeDateDetailsObject(
      new Date(editWeeklyRecord.toTime.seconds * 1000),
    );

    let hourDiffrenceglobal = 0;
    if (fromTimeObject.hour < toTimeObject.hour) {
      hourDiffrenceglobal = fromTimeObject.hour - toTimeObject.hour;
    } else if (
      fromTimeObject.hour > toTimeObject.hour &&
      fromTimeObject.timeStatus !== toTimeObject.timeStatus
    ) {
      hourDiffrenceglobal = toTimeObject.hour + 12 - fromTimeObject.hour;
    } else if (
      fromTimeObject.hour > toTimeObject.hour &&
      fromTimeObject.timeStatus === toTimeObject.timeStatus
    ) {
      if (fromTimeObject.timeStatus === 'am') {
        if (fromTimeObject.hour === 12 && fromTimeObject.timeStatus === 'am') {
          hourDiffrenceglobal = toTimeObject.hour - 0;
        } else {
          hourDiffrenceglobal = toTimeObject.hour + 24 - fromTimeObject.hour;
        }
      } else if (fromTimeObject.timeStatus === 'pm') {
        if (fromTimeObject.hour < toTimeObject.hour) {
          hourDiffrenceglobal = toTimeObject.hour - fromTimeObject.hour;
        } else if (fromTimeObject.hour > toTimeObject.hour) {
          hourDiffrenceglobal = toTimeObject.hour + 24 - fromTimeObject.hour;
        }
      }
    } else {
      hourDiffrenceglobal = toTimeObject.hour + 12 - fromTimeObject.hour;
    }

    let selectedFromTime = getTimeDateDetailsObject(values.fromTime);
    let selectedToTime = getTimeDateDetailsObject(values.toTime);

    let diffrenceBetween = fromTimeObject.hour - selectedFromTime.hour;
    let diffrenceBetweenSelectedTime =
      selectedToTime.hour - selectedFromTime.hour;

    let finalHour =
      Math.abs(diffrenceBetween) + Math.abs(diffrenceBetweenSelectedTime);

    console.log('finalHour', finalHour);
    // console.log(finalHour, Math.abs(hourDiffrenceglobal)

    // if (finalHour <= Math.abs(hourDiffrenceglobal)) {
    let chunkIsPresent = editWeeklyRecord?.slotChunks?.filter(items => {
      if (
        moment(new Date(items.fromTime.seconds * 1000)).format('hh:mm a') ===
          remoteTimeToHoursMinutsFormat(values.fromTime.toLocaleString()) &&
        moment(new Date(items.toTime.seconds * 1000)).format('hh:mm a') ===
          remoteTimeToHoursMinutsFormat(values.toTime.toLocaleString())
      ) {
        return items;
      } else {
        return false;
      }
    });
    if (chunkIsPresent.length === 0) {
      let finalPayload = {
        ...schedules,
        weekDays: schedules.weekDays.map(itemObject => {
          if (itemObject.dayName === editWeeklyRecord.dayName) {
            return {
              ...itemObject,
              slotChunks: [
                ...itemObject.slotChunks,
                {
                  ...values,
                  chunkId: uuid(),
                },
              ],
            };
          } else {
            return {
              ...itemObject,
            };
          }
        }),
      };
      setIsLoading(true);
      await updateScheduleList({
        ...finalPayload,
      })
        .then(() => {
          setIsLoading(false);
          notifyMessage('Schedule updated successfully');
          onHide();
          setRerenderState(!reRenderState);
        })
        .catch(error => {
          setIsLoading(false);
        });
    } else {
      notifyMessage('Slot already exists');
    }
    // } else {
    //   notifyMessage(
    //     `Please selct time between ${remoteTimeToHoursMinutsFormat(
    //       new Date(editWeeklyRecord.fromTime.seconds * 1000),
    //     )} to ${remoteTimeToHoursMinutsFormat(
    //       new Date(editWeeklyRecord.toTime.seconds * 1000),
    //     )}`,
    //   );
    // }
  };
  const onChange = (event, selectedDate, setFieldValue, values) => {
    const currentDate = selectedDate;
    setShowTimeCompo(false);
    let globalFromTime = remoteTimeToHoursMinutsWithAmAndPmFormat(
      new Date(editWeeklyRecord.fromTime.seconds * 1000),
    );
    let globalToTime = remoteTimeToHoursMinutsWithAmAndPmFormat(
      new Date(editWeeklyRecord.toTime.seconds * 1000),
    );

    if (event.type === 'set') {
      let formatedCurrentDate = remoteTimeToHoursMinutsWithAmAndPmFormat(
        selectedDate.toLocaleString(),
      );
      let changedFromTime = remoteTimeToHoursMinutsWithAmAndPmFormat(
        values.fromTime.toLocaleString(),
      );
      let changedToTime = remoteTimeToHoursMinutsWithAmAndPmFormat(
        values.toTime.toLocaleString(),
      );
      if (clickState === 'fromTime') {
        if (formatedCurrentDate !== changedToTime) {
          // if (
          //   formatedCurrentDate >= globalFromTime &&
          //   formatedCurrentDate <= globalToTime
          // ) {
          // setFieldValue(`fromTime`, currentDate);
          // } else {
          //   notifyMessage(
          //     `Time will be in between ${globalFromTime} and ${globalToTime}`,
          //   );
          // }

          let fromTimeObject = get24HourTimeFromDate(
            new Date(editWeeklyRecord.fromTime.seconds * 1000),
          );
          let toTimeObject = get24HourTimeFromDate(
            new Date(editWeeklyRecord.toTime.seconds * 1000),
          );
          console.log('formatedCurrentDate', selectedDate);
          let selectedFromTime = get24HourTimeFromDate(selectedDate);
          let selectedToTime = get24HourTimeFromDate(values.toTime);

          if (
            selectedFromTime >= fromTimeObject &&
            selectedFromTime <= toTimeObject
          ) {
            setFieldValue(`fromTime`, currentDate);
          } else {
            notifyMessage('From Time is not Valid');
          }
        } else {
          notifyMessage('From To Time  cannot be Same ');
        }
        // setFieldValue(`fromTime`, currentDate);
      } else if (clickState === 'toTime') {
        if (formatedCurrentDate !== changedFromTime) {
          // if (
          //   formatedCurrentDate >= globalFromTime &&
          //   formatedCurrentDate <= globalToTime
          // ) {
          // setFieldValue(`toTime`, currentDate);
          // } else {
          //   notifyMessage(
          //     `Time will be in between ${globalFromTime} and ${globalToTime}`,
          //   );
          // }

          let fromTimeObject = get24HourTimeFromDate(
            new Date(editWeeklyRecord.fromTime.seconds * 1000),
          );
          let toTimeObject = get24HourTimeFromDate(
            new Date(editWeeklyRecord.toTime.seconds * 1000),
          );
          let selectedFromTime = get24HourTimeFromDate(values.fromTime);
          let selectedToTime = get24HourTimeFromDate(selectedDate);

          if (
            selectedToTime >= fromTimeObject &&
            selectedToTime > selectedFromTime &&
            selectedToTime <= toTimeObject
          ) {
            setFieldValue(`toTime`, currentDate);
          } else {
            notifyMessage('To Time is not Valid');
          }
        } else {
          notifyMessage('From To Time  cannot be Same ');
        }
      } else {
        return;
      }
      // setDate(currentDate);
    }
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
          fromTime: '',
          toTime: '',
          orderLimit: '',
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
                    <View>
                      <View
                        style={{
                          marginBottom: 10,
                          borderWidth: 2,
                          borderColor: 'black',
                          paddingHorizontal: 5,
                          borderRadius: 5,
                        }}>
                        {showTimeCompo && (
                          // <DateTimePicker
                          //   testID="dateTimePicker2"
                          //   value={new Date()}
                          //   mode={mode}
                          //   is24Hour={true}
                          //   onChange={(event, selectedDate) =>
                          //     onChange(
                          //       event,
                          //       selectedDate,
                          //       setFieldValue,
                          //       values,
                          //     )
                          //   }
                          // />

                          <DateTimePickerModal
                            isVisible={showTimeCompo}
                            testID="dateTimePicker"
                            value={new Date()}
                            mode={mode}
                            is24Hour={true}
                            // display="default"
                            onConfirm={selectedDate =>
                              onChange(
                                {type: 'set'},
                                selectedDate,
                                setFieldValue,
                                values,
                              )
                            }
                            onCancel={() => setShowTimeCompo(false)}
                          />
                        )}

                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Pressable
                            style={styles.formInputwraper}
                            onPress={() => showTimepicker('fromTime')}>
                            <View style={styles.formInputContainer}>
                              <Text style={styles.formLable}>
                                {values.fromTime
                                  ? remoteTimeToHoursMinutsFormat(
                                      values.fromTime.toLocaleString(),
                                    )
                                  : 'From'}
                              </Text>
                            </View>
                          </Pressable>
                          <View>
                            {errors &&
                            errors.fromTime &&
                            touched &&
                            touched.fromTime ? (
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: 'red',
                                }}>
                                {errors.fromTime}
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Pressable
                            style={styles.formInputwraper}
                            onPress={() => showTimepicker('toTime')}>
                            <View style={styles.formInputContainer}>
                              <Text style={styles.formLable}>
                                {values.toTime
                                  ? remoteTimeToHoursMinutsFormat(
                                      values.toTime.toLocaleString(),
                                    )
                                  : 'To'}
                              </Text>
                            </View>
                          </Pressable>
                          <View>
                            {errors &&
                            errors.toTime &&
                            touched &&
                            touched.toTime ? (
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: 'red',
                                }}>
                                {errors.toTime}
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <View>
                          <TextField
                            Style={styles.inputParent}
                            Style_1={[styles.inputStyle, styles.formLable]}
                            Style_2={[styles.inputIcon]}
                            placeholder={'Enter Order Limit'}
                            placeholderTextColor="#132333"
                            iconname={'user'}
                            secure={false}
                            size={22}
                            isIcon={false}
                            keyboardType="numeric"
                            name={`orderLimit`}
                            onChangeText={handleChange(`orderLimit`)}
                            onBlur={handleBlur(`orderLimit`)}
                            value={values.orderLimit}
                          />

                          <View style={{marginBottom: 5}}>
                            {errors &&
                            errors.orderLimit &&
                            touched &&
                            touched.orderLimit ? (
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: 'red',
                                }}>
                                {errors.orderLimit}
                              </Text>
                            ) : null}
                          </View>
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
                {isLoading ? (
                  <Button
                    style={{
                      backgroundColor: '#132333',

                      borderRadius: 5,
                      minWidth: 70,
                    }}
                    flexDirection="row">
                    <Spinner color="primary.white" size={'sm'} />
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
    maxHeight: 500,
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
    fontSize: 14,
    fontFamily: 'Lato-Regular',
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
