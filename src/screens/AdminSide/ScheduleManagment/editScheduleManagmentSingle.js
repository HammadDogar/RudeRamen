import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {metrics} from '../../../assets/style';
import DateTimePicker from '@react-native-community/datetimepicker';
// import {Button} from 'react-native';
import {Pressable} from 'react-native';
import {Checkbox, Button, Switch, Select, CheckIcon} from 'native-base';
import {
  getTimeSlots,
  notifyMessage,
  remoteTimeToHoursMinutsFormat,
  remoteTimeToHoursMinutsWithAmAndPmFormat,
} from '../../../utils/utils';
import moment from 'moment';
import {
  getSchedules,
  updateScheduleList,
} from '../../../services/CloudFunction/scheduleManagment';
import {MESSAGES} from '../../../constants';
import UpdateOrderLimitedInTimeSlotModal from './addTimeChunks';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EditChunk from './editScheduleChunkModal';
import DeleteChunk from './deleteChunkModal';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {Spinner} from '../../../components';
import {useIsFocused} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const countries = ['Today'];

const EditScheduleSingle = ({navigation, route}) => {
  let {slotDayToEditId, editWeeklyRecord1, schedules} = route.params;

  const focus = useIsFocused();

  const [toTime, setToTime] = useState(new Date(1598051730000));
  const [fromTime, setFromTime] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [clickState, setClickState] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditChunkModal, setEditChunkModal] = useState(false);
  const [chunkToEdit, setChunkToEdit] = useState(null);
  const [deleteChunk, setDeleteChunk] = useState(false);
  const [chunkToDelete, setChunkToDelete] = useState(null);
  const [getScheduleIsLoading, setGetScheduleIsLoading] = useState(false);

  const [reRenderState, setRerenderState] = useState(false);

  const [error, setError] = useState(false);
  const [editWeeklyRecord, setEditWeeklyRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schedulesDetails, setSchedulesDetails] = useState(null);
  const {user} = useContext(AuthenticationContext);

  useEffect(() => {
    const getSchedulesRemoteData = async () => {
      await getSchedules(user.uid)
        .then(response => {
          setGetScheduleIsLoading(false);
          setError(false);
          let filteredResponse = response?.weekDays?.find(
            scheduleListItem =>
              scheduleListItem.dayName === slotDayToEditId.dayName,
          );
          setEditWeeklyRecord(filteredResponse);
          setSchedulesDetails(response);
        })
        .catch(error => {
          setGetScheduleIsLoading(false);
          setError(true);
        });
    };
    if (user) {
      setGetScheduleIsLoading(true);
      getSchedulesRemoteData();
    }

    return () => {
      setEditWeeklyRecord(null); // This worked for me
    };
  }, [focus, reRenderState]);

  const onChange = (event, selectedDate, setFieldValue, values) => {
    const currentDate = selectedDate;
    setShow(false);

    if (event.type === 'set') {
      if (editWeeklyRecord?.slotChunks?.length === 0) {
        let formatedCurrentDate = remoteTimeToHoursMinutsFormat(
          selectedDate.toLocaleString(),
        );

        let changedFromTime = remoteTimeToHoursMinutsFormat(
          values.fromTime.toLocaleString(),
        );
        let changedToTime = remoteTimeToHoursMinutsFormat(
          values.toTime.toLocaleString(),
        );

        // setShow(false);
        if (clickState === 'toTime') {
          // setToTime(currentDate);
          if (formatedCurrentDate !== changedFromTime) {
            setFieldValue('toTime', currentDate);
          } else {
            notifyMessage('From To Time  cannot be Same ');
          }
        } else if (clickState === 'fromTime') {
          if (formatedCurrentDate !== changedToTime) {
            setFieldValue('fromTime', currentDate);
          } else {
            notifyMessage('From To Time  cannot be Same ');
          }
          // setFromTime(currentDate);
        } else {
          return;
        }
      } else {
        notifyMessage('Slots already created in this time range');
      }
    }
    // setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = clickValue => {
    showMode('time');
    setClickState(clickValue);
    //     toTime
    // fromTime
  };

  const createMneuSchema = yup.object().shape({
    // startDate: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
    // endDate: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
    // fromTime: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
    // toTime: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  });

  const onChangeDay = (setFieldValue, itemValue) => {
    setFieldValue('dayName', itemValue);
  };

  return (
    <Formik
      validationSchema={createMneuSchema}
      enableReinitialize={true}
      initialValues={{
        dayName: slotDayToEditId?.dayName,
        fromTime: slotDayToEditId
          ? new Date(slotDayToEditId.fromTime.seconds * 1000)
          : '',
        toTime: slotDayToEditId
          ? new Date(slotDayToEditId.toTime.seconds * 1000)
          : '',
        availablity: slotDayToEditId?.isAvailable,
      }}
      onSubmit={async values => {
        let tiemSlotsArray = getTimeSlots(values.fromTime, values.toTime);

        // let finalPayload = {
        //   ...schedules,
        //   schedulesList: schedules.schedulesList.map(itemObject => {
        //     if (itemObject.dayName === values.dayName) {
        //       if (itemObject.dateSlotuuid === slotDayToEditId) {
        //         // editWeeklyRecord.slotChunks
        //         return {
        //           ...itemObject,
        //           isAvailable: values.availablity,
        //           toTime: values.toTime,
        //           fromTime: values.fromTime,
        //           time: tiemSlotsArray,
        //           slotChunks: editWeeklyRecord.slotChunks,
        //         };
        //       } else {
        //         return {
        //           ...itemObject,
        //           isAvailable: values.availablity,
        //           toTime: values.toTime,
        //           fromTime: values.fromTime,
        //           time: tiemSlotsArray,
        //         };
        //       }
        //     } else {
        //       return {
        //         ...itemObject,
        //       };
        //     }
        //   }),
        //   uid: schedules.uid,
        // };
        let finalPayload = {
          ...schedulesDetails,
          weekDays: schedulesDetails.weekDays.map(itemObject => {
            if (itemObject.dayName === values.dayName) {
              return {
                ...itemObject,
                toTime: values.toTime,
                fromTime: values.fromTime,
                isAvailable: values.availablity,
              };
            } else {
              return {
                ...itemObject,
              };
            }
          }),
        };
        setIsLoading(true);
        await updateScheduleList(finalPayload)
          .then(response => {
            setIsLoading(false);
            notifyMessage(MESSAGES.UPDATED_SUCCESSFULLY_MESSAGE);
            // navigation.navigate('admin-menu');
            setRerenderState(!reRenderState);
          })
          .catch(error => {
            setIsLoading(false);
            // notifyMessage(getExactError(error));
            notifyMessage(error);
          });
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        isValid,
      }) => (
        <SafeAreaView style={styles.container}>
          <View style={{flex: 1}}>
            <View
              style={{
                height: 60,
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                backgroundColor: '#132333',
              }}>
              <Icon
                name="chevron-left"
                size={30}
                color="#ffffff"
                onPress={() => navigation.goBack()}
              />

              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontFamily: 'Lato-Bold',
                    color: '#ffffff',
                  }}>
                  Marvel’s Ramen
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontFamily: 'Lato-Bold',
                    color: '#ffffff',
                  }}>
                  Texas, NV
                </Text>
              </View>

              <Ionicons
                name="notifications"
                size={30}
                color="#ffffff"
                onPress={() => navigation.navigate('notification')}
              />
            </View>
            <View>
              {show && (
                // <DateTimePicker
                //   testID="dateTimePicker"
                //   value={new Date()}
                //   mode={mode}
                //   is24Hour={true}
                //   onChange={(event, selectedDate) =>
                //     onChange(event, selectedDate, setFieldValue, values)
                //   }
                // />

                <DateTimePickerModal
                  isVisible={show}
                  testID="dateTimePicker"
                  value={new Date()}
                  mode={mode}
                  is24Hour={true}
                  // display="default"
                  onConfirm={selectedDate =>
                    onChange({type: 'set'}, selectedDate, setFieldValue, values)
                  }
                  onCancel={() => setShow(false)}
                />
              )}
            </View>
            {getScheduleIsLoading === true ? (
              <Spinner size={'sm'} />
            ) : (
              <ScrollView
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  //
                }}>
                <View style={{}}>
                  {/* <View style={{marginVertical: 10}}>
              <Text
                style={{
                  color: '#132333',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'Lato-Bold',
                }}>
                Restaurant Schedule
              </Text>
            </View> */}

                  <View>
                    <Select
                      accessibilityLabel="Choose Service"
                      placeholder="Day"
                      borderColor={'primary.blue'}
                      backgroundColor={'primary.blue'}
                      color={'primary.white'}
                      width={'100%'}
                      placeholderTextColor="primary.white"
                      maxW="200"
                      // selectedValue="mon"
                      height={'12'}
                      fontSize={'md'}
                      _selectedItem={{
                        bg: 'primary.blue',
                        _text: {
                          color: 'primary.white',
                        },
                        endIcon: <CheckIcon color="primary.white" size="5" />,
                      }}
                      isDisabled={true}
                      onValueChange={itemValue =>
                        onChangeDay(setFieldValue, itemValue)
                      }
                      selectedValue={values.dayName}
                      mt={1}>
                      <Select.Item label="Monday" value="Monday" />
                      <Select.Item label="Tuesday" value="Tuesday" />
                      <Select.Item label="Wednesday" value="Wednesday" />
                      <Select.Item label="Thursday" value="Thursday" />
                      <Select.Item label="Friday" value="Friday" />
                      <Select.Item label="Saturday" value="Saturday" />
                      <Select.Item label="Sunday" value="Sunday" />
                    </Select>
                  </View>

                  <View flexDirection="row">
                    <View
                      style={{marginVertical: 10, marginRight: 10, flex: 1}}>
                      <Text style={styles.formLable}>From</Text>
                      <Pressable
                        style={styles.formInputwraper}
                        onPress={() => showTimepicker('fromTime')}>
                        <View style={styles.formInputContainer}>
                          <Text style={styles.formLable}>
                            {values.fromTime
                              ? remoteTimeToHoursMinutsFormat(
                                  values.fromTime.toLocaleString(),
                                )
                              : ''}
                          </Text>
                        </View>
                      </Pressable>
                      <View>
                        {errors.fromTime && (
                          <Text
                            style={{
                              fontSize: 15,
                              color: 'red',
                            }}>
                            {errors.fromTime}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={{marginVertical: 10, marginLeft: 10, flex: 1}}>
                      <Text style={styles.formLable}>To</Text>
                      <Pressable
                        style={styles.formInputwraper}
                        onPress={() => showTimepicker('toTime')}>
                        <View style={styles.formInputContainer}>
                          <Text style={styles.formLable}>
                            {values.toTime
                              ? remoteTimeToHoursMinutsFormat(
                                  values.toTime.toLocaleString(),
                                )
                              : ''}
                          </Text>
                        </View>
                      </Pressable>
                      <View>
                        {errors.toTime && (
                          <Text
                            style={{
                              fontSize: 15,
                              color: 'red',
                            }}>
                            {errors.toTime}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: 10,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#132333',
                        fontSize: 14,
                        // textAlign: 'center',
                        fontFamily: 'Lato-Bold',
                      }}>
                      Show Availability:
                    </Text>
                    <Switch
                      size="lg"
                      style={{marginLeft: 10}}
                      isChecked={values.availablity}
                      onToggle={() => {
                        setFieldValue('availablity', !values.availablity);
                      }}
                    />
                  </View>

                  <View>
                    <TouchableOpacity
                      style={{
                        alignSelf: 'flex-end',
                      }}
                      onPress={() => setShowModal(true)}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#2285E8',
                        }}>
                        Update order limit in slots
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{marginVertical: 10}}>
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
                      Saving
                    </Text> */}
                      </Button>
                    ) : (
                      <Button
                        colorScheme="success"
                        style={{
                          backgroundColor: '#132333',
                          // maxWidth: ,
                          width: '100%',
                        }}
                        onPress={() => handleSubmit()}
                        // onPress={() => navigation.navigate('schedule-managment')}
                      >
                        Save
                      </Button>
                    )}
                  </View>
                  {console.log(
                    'editWeeklyRecord',
                    JSON.stringify(editWeeklyRecord, null, 2),
                  )}
                  {editWeeklyRecord &&
                    editWeeklyRecord.slotChunks &&
                    editWeeklyRecord.slotChunks.length > 0 && (
                      <View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#132333',
                            padding: 10,
                          }}>
                          <View
                            style={{
                              flex: 1,

                              alignItems: 'center',
                            }}>
                            <Text style={styles.tabelHeadCell}>From</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,

                              alignItems: 'center',
                            }}>
                            <Text style={styles.tabelHeadCell}>To</Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                            }}>
                            <Text style={styles.tabelHeadCell}>
                              Order Limit
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                            }}>
                            <Text style={styles.tabelHeadCell}>Action</Text>
                          </View>
                        </View>
                        {editWeeklyRecord?.slotChunks.map(chunkItem => (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              // backgroundColor: '#132333',
                              padding: 10,
                              borderWidth: 1,
                              borderColor: '#132333',
                            }}
                            key={chunkItem.chunkId}>
                            <View style={{flex: 1, alignItems: 'center'}}>
                              <Text style={styles.tabelBodyCell}>
                                {remoteTimeToHoursMinutsFormat(
                                  new Date(
                                    chunkItem.fromTime.seconds * 1000,
                                  ).toLocaleString(),
                                )}
                              </Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                              <Text style={styles.tabelBodyCell}>
                                {remoteTimeToHoursMinutsFormat(
                                  new Date(
                                    chunkItem.toTime.seconds * 1000,
                                  ).toLocaleString(),
                                )}
                              </Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                              <Text style={styles.tabelBodyCell}>
                                {chunkItem.orderLimit}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                alignItems: 'center',
                              }}>
                              {/* <Text style={styles.tabelBodyCell}> */}
                              {/* edit delete */}

                              <View
                                style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                  justifyContent: 'center',
                                }}>
                                <View
                                  style={{
                                    flex: 1,
                                    alignItems: 'center',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setEditChunkModal(true),
                                        setChunkToEdit(chunkItem);
                                    }}>
                                    <AntDesign
                                      name="edit"
                                      size={20}
                                      color="#000000"
                                    />
                                  </TouchableOpacity>
                                </View>

                                <View style={{flex: 1, alignItems: 'center'}}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setDeleteChunk(true);
                                      setChunkToDelete(chunkItem);
                                    }}>
                                    <AntDesign
                                      name="delete"
                                      size={20}
                                      color="#D70040"
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                              {/* </Text> */}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                </View>
              </ScrollView>
            )}
          </View>
          {showModal && (
            <UpdateOrderLimitedInTimeSlotModal
              show={showModal}
              editWeeklyRecord={editWeeklyRecord}
              schedules={schedulesDetails}
              onHide={() => setShowModal(false)}
              reRenderState={reRenderState}
              setRerenderState={setRerenderState}
            />
          )}
          {showEditChunkModal && (
            <EditChunk
              show={showEditChunkModal}
              editWeeklyRecord={editWeeklyRecord}
              schedules={schedules}
              chunkToEdit={chunkToEdit}
              onHide={() => setEditChunkModal(false)}
              reRenderState={reRenderState}
              setRerenderState={setRerenderState}
            />
          )}

          {
            <DeleteChunk
              show={deleteChunk}
              editWeeklyRecord={editWeeklyRecord}
              schedules={schedules}
              chunkToDelete={chunkToDelete}
              onHide={() => setDeleteChunk(false)}
              reRenderState={reRenderState}
              setRerenderState={setRerenderState}
            />
          }
        </SafeAreaView>
      )}
    </Formik>
  );
};

const data = [
  {id: 1, value: 'Monday'},
  {id: 2, value: 'Tuesday'},
  {id: 3, value: 'Wednesday'},
  {id: 4, value: 'Thursday'},
  {id: 5, value: 'Friday'},
  {id: 6, value: 'Saturday'},
  {id: 5, value: 'Sunday'},
];

const styles = StyleSheet.create({
  testContainer: {
    width: metrics.deviceWidth - 40,
  },
  itemStyle: {
    width: (metrics.deviceWidth - 40 - 30) / 3,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formLable: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    color: '#000000',
  },
  formInputwraper: {
    marginVertical: 10,
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
  tabelHeadCell: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Lato-Bold',
  },

  tabelBodyCell: {
    color: '#132333',
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
});

export default EditScheduleSingle;
