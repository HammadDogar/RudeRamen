import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import uuid from 'uuid-random';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Pressable} from 'react-native';
import {Checkbox, Button} from 'native-base';
import * as yup from 'yup';
import {Formik} from 'formik';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {
  createSchedule,
  getSchedules,
  updateScheduleList,
} from '../../../services/CloudFunction/scheduleManagment';
import {
  getDateSlots,
  getExactError,
  getFormatedDatIntoYFromUtc,
  getFormatedTimeFromUtc,
  getTimeSlots,
  notifyMessage,
  remoteDateToDashFormate,
  remoteTimeToHoursMinutsFormat,
} from '../../../utils/utils';
import {metrics} from '../../../assets/style';
import {MESSAGES} from '../../../constants';
import {Spinner, TextField} from '../../../components';
import moment from 'moment';
import {async} from '@firebase/util';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const createMneuSchema = yup.object().shape({
  startDate: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  endDate: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  fromTime: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  toTime: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  orderLimit: yup
    .number()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .min(1, 'Limit must be greater then 1 ')
    .max(99, 'Limit must not exceed more than 2 digits '),
});

const updateMneuSchema = yup.object().shape({
  startDate: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  endDate: yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  orderLimit: yup
    .number()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .min(1, 'Limit must be greater then 1 ')
    .max(99, 'Limit must not exceed more than 2 digits '),
});

const ScheduleManagment = ({navigation, route}) => {
  const {user} = useContext(AuthenticationContext);
  const {schedule} = route.params;

  const [startDate, setStartDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());
  const [fromTime, setFromTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [clickState, setClickState] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [getScheduleIsLoading, setGetScheduleIsLoading] = useState(false);

  const [error, setError] = useState(false);
  const [schedulesDetails, setSchedulesDetails] = useState(null);

  useEffect(() => {
    const getSchedulesRemoteData = async () => {
      await getSchedules(user.uid)
        .then(response => {
          setGetScheduleIsLoading(false);
          setError(false);
          setSchedulesDetails(response);
        })
        .catch(error => {
          setGetScheduleIsLoading(false);
          setError(true);
        });
    };
    if (user && schedule) {
      setGetScheduleIsLoading(true);
      getSchedulesRemoteData();
    }

    return () => {
      setSchedulesDetails(null); // This worked for me
    };
  }, []);

  const onChange = (event, selectedDate, setFieldValue, values) => {
    const currentDate = selectedDate;

    setShow(false);

    if (event.type === 'set') {
      let formatedCurrentDate = remoteTimeToHoursMinutsFormat(
        selectedDate.toLocaleString(),
      );
      let changedFromTime = remoteTimeToHoursMinutsFormat(
        values.fromTime.toLocaleString(),
      );
      let changedToTime = remoteTimeToHoursMinutsFormat(
        values.toTime.toLocaleString(),
      );

      if (clickState === 'fromDate') {
        // setStartDate(currentDate);
        if (values.endDate) {
          let diffrenceWithEndTime = moment(
            getFormatedDatIntoYFromUtc(currentDate),
          ).diff(moment(getFormatedDatIntoYFromUtc(values.endDate)), 'days');
          if (diffrenceWithEndTime <= 0) {
            setFieldValue('startDate', currentDate);
          } else {
            notifyMessage('Start date must be less then End date ');
          }
        } else {
          setFieldValue('startDate', currentDate);
        }
      } else if (clickState === 'endDate') {
        if (values.startDate) {
          let diffrenceWithStartTime = moment(
            getFormatedDatIntoYFromUtc(currentDate),
          ).diff(moment(getFormatedDatIntoYFromUtc(values.startDate)), 'days');
          if (diffrenceWithStartTime >= 0) {
            setFieldValue('endDate', currentDate);
          } else {
            notifyMessage('End date must be greater then Start date ');
          }
        } else {
          setFieldValue('endDate', currentDate);
        }

        // setFromDate(currentDate);
      } else if (clickState === 'startTime') {
        if (formatedCurrentDate !== changedToTime) {
          setFieldValue('fromTime', currentDate);
        } else {
          notifyMessage('From To Time  cannot be Same ');
        }
        // setToTime(currentDate);
      } else if (clickState === 'endTime') {
        // setFromTime(currentDate);
        if (formatedCurrentDate !== changedFromTime) {
          setFieldValue('toTime', currentDate);
        } else {
          notifyMessage('From To Time  cannot be Same ');
        }
      } else {
        return;
      }
    }
    // } else {
    //   notifyMessage('From To Time  cannot be Same ');
    // }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = (type, clickState) => {
    showMode(type);
    setClickState(clickState);
  };

  const checkIsAvailable = (day, values) => {
    let dayname = day.toLowerCase();
    if (dayname === 'monday') {
      if (values.monday === true) {
        return true;
      } else {
        return false;
      }
    } else if (dayname === 'tuesday') {
      if (values.tuesday === true) {
        return true;
      } else {
        return false;
      }
    } else if (dayname === 'wednesday') {
      if (values.wednesday === true) {
        return true;
      } else {
        return false;
      }
    } else if (dayname === 'thursday') {
      if (values.thursday === true) {
        return true;
      } else {
        return false;
      }
    } else if (dayname === 'friday') {
      if (values.friday === true) {
        return true;
      } else {
        return false;
      }
    } else if (dayname === 'saturday') {
      if (values.saturday === true) {
        return true;
      } else {
        return false;
      }
    } else if (dayname === 'sunday') {
      if (values.sunday === true) {
        return true;
      } else {
        return false;
      }
    }
  };

  const getDefaultValue = (checkBoxName, initialValue) => {
    switch (checkBoxName) {
      case 'monday':
        return initialValue.monday;
      case 'tuesday':
        return initialValue.tuesday;
      case 'wednesday':
        return initialValue.wednesday;
      case 'thursday':
        return initialValue.thursday;
      case 'friday':
        return initialValue.friday;
      case 'saturday':
        return initialValue.saturday;
      case 'sunday':
        return initialValue.sunday;
      default:
        break;
    }
  };

  const createSchedulesHandler = async values => {
    setIsLoading(true);
    let tiemSlotsArray = getTimeSlots(values.fromTime, values.toTime);
    let startDateTest = values.startDate;
    let endDateTest = values.endDate;
    let getDateSlotsResult = getDateSlots(startDateTest, endDateTest);
    let finalPayload = getDateSlotsResult.map(item => ({
      ...item,
      dateSlotuuid: uuid(),
      date: new Date(item.date),
      fromTime: values.fromTime,
      toTime: values.toTime,
      isAvailable: checkIsAvailable(item.dayName, values),
      orderLimit: parseInt(values.orderLimit),
      time: tiemSlotsArray.map(item => ({
        ...item,
        orderLimit: parseInt(values.orderLimit),
      })),
      slotChunks: [],
    }));

    await createSchedule({
      orderLimit: parseInt(values.orderLimit),
      startDate: values.startDate,
      endDate: values.endDate,
      weekDays: [
        {
          dayName: 'Monday',
          isAvailable: values.monday,
          fromTime: values.fromTime,
          toTime: values.toTime,
          orderLimit: parseInt(values.orderLimit),
          slotChunks: [],
        },
        {
          dayName: 'Tuesday',
          isAvailable: values.tuesday,
          fromTime: values.fromTime,
          toTime: values.toTime,
          orderLimit: parseInt(values.orderLimit),

          slotChunks: [],
        },
        {
          dayName: 'Wednesday',
          isAvailable: values.wednesday,
          fromTime: values.fromTime,
          toTime: values.toTime,
          orderLimit: parseInt(values.orderLimit),
          slotChunks: [],
        },
        {
          dayName: 'Thursday',
          isAvailable: values.thursday,
          fromTime: values.fromTime,
          toTime: values.toTime,
          orderLimit: parseInt(values.orderLimit),
          slotChunks: [],
        },
        {
          dayName: 'Friday',
          isAvailable: values.friday,
          fromTime: values.fromTime,
          toTime: values.toTime,
          orderLimit: parseInt(values.orderLimit),
          slotChunks: [],
        },
        {
          dayName: 'Saturday',
          isAvailable: values.saturday,
          fromTime: values.fromTime,
          toTime: values.toTime,
          orderLimit: parseInt(values.orderLimit),
          slotChunks: [],
        },
        {
          dayName: 'Sunday',
          isAvailable: values.sunday,
          fromTime: values.fromTime,
          toTime: values.toTime,
          orderLimit: parseInt(values.orderLimit),
          slotChunks: [],
        },
      ],
      // monday: values.monday,
      // tuesday: values.tuesday,
      // wednesday: values.wednesday,
      // thursday: values.thursday,
      // friday: values.friday,
      // saturday: values.saturday,
      // sunday: values.sunday,
      // schedulesList: finalPayload,
      restaurantsUserId: user.uid,
      // globalAvailability: true,
    })
      .then(() => {
        setIsLoading(false);
        notifyMessage('Schedule created successfully');
        navigation.navigate('schedule-managment');
      })
      .catch(error => {
        setIsLoading(false);
        notifyMessage(getExactError(error));
      });
  };

  const updateScheduleHandler = async values => {
    setIsLoading(true);

    // let tiemSlotsArray = getTimeSlots(values.fromTime, values.toTime);
    // let startDateTest = values.startDate;
    // let endDateTest = values.endDate;
    // let getDateSlotsResult = getDateSlots(startDateTest, endDateTest);
    // let finalPayload = getDateSlotsResult.map(item => ({
    //   ...item,
    //   dateSlotuuid: uuid(),
    //   date: new Date(item.date),
    //   fromTime: values.fromTime,
    //   toTime: values.toTime,
    //   isAvailable: checkIsAvailable(item.dayName, values),
    //   orderLimit: parseInt(values.orderLimit),
    //   time: tiemSlotsArray.map(item => ({
    //     ...item,
    //     orderLimit: parseInt(values.orderLimit),
    //   })),
    //   slotChunks: [],
    // }));

    let finalPayload = {
      ...schedulesDetails,
      orderLimit: parseInt(values.orderLimit),
      startDate: values.startDate,
      endDate: values.endDate,
      weekDays: schedulesDetails?.weekDays?.map(weekItem => {
        return {
          ...weekItem,
          isAvailable: values[`${weekItem.dayName.toLowerCase()}`],
          orderLimit: parseInt(values.orderLimit),
        };
      }),
    };

    await updateScheduleList(finalPayload)
      .then(() => {
        setIsLoading(false);
        notifyMessage('Schedule updated successfully');
        navigation.navigate('schedule-managment');
      })
      .catch(error => {
        setIsLoading(false);
        // console.log('error', error);
        // notifyMessage(getExactError(error));
      });
  };

  const getDaysList = data => {
    let weekDays = [
      {id: 1, value: 'monday', flag: data.monday},
      {id: 2, value: 'tuesday', flag: data.tuesday},
      {id: 3, value: 'wednesday', flag: data.wednesday},
      {id: 4, value: 'thursday', flag: data.thursday},
      {id: 5, value: 'friday', flag: data.friday},
      {id: 6, value: 'saturday', flag: data.saturday},
      {id: 5, value: 'sunday', flag: data.sunday},
    ];
    return weekDays;
  };

  return (
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
              Texas,NV
            </Text>
          </View>

          <Ionicons
            name="notifications"
            size={30}
            color="#ffffff"
            onPress={() => navigation.navigate('notification')}
          />
        </View>

        {getScheduleIsLoading ? (
          <Spinner />
        ) : (
          <EditForm
            schedulesDetails={schedulesDetails}
            showDatepicker={showDatepicker}
            getDefaultValue={getDefaultValue}
            createSchedulesHandler={createSchedulesHandler}
            updateScheduleHandler={updateScheduleHandler}
            getDaysList={getDaysList}
            isLoading={isLoading}
            user={user}
            schedule={schedule}
            show={show}
            startDate={startDate}
            mode={mode}
            onChange={onChange}
            setShow={setShow}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const EditForm = ({
  schedulesDetails,
  showDatepicker,
  getDefaultValue,
  createSchedulesHandler,
  isLoading,
  updateScheduleHandler,
  getDaysList,
  user,
  schedule,
  show,
  startDate,
  mode,
  onChange,
  setShow,
}) => {
  const getWeekDayAvailablity = weekDay => {
    if (schedulesDetails && schedulesDetails?.weekDays?.length > 0) {
      let specifcWeekDayObject = schedulesDetails.weekDays.find(
        weekItem => weekItem.dayName === weekDay,
      );
      return specifcWeekDayObject ? specifcWeekDayObject.isAvailable : false;
    }
  };

  if (!schedulesDetails && schedule) {
    return <Spinner />;
  }
  return (
    <Formik
      validationSchema={user && !schedule ? createMneuSchema : updateMneuSchema}
      // enableReinitialize={true}
      initialValues={{
        orderLimit: schedulesDetails ? schedulesDetails.orderLimit : 0,
        startDate: schedulesDetails
          ? new Date(schedulesDetails.startDate.seconds * 1000)
          : '',

        endDate: schedulesDetails
          ? new Date(schedulesDetails.endDate.seconds * 1000)
          : '',
        fromTime: '',
        toTime: '',
        monday: schedulesDetails && getWeekDayAvailablity('Monday'),
        tuesday: schedulesDetails && getWeekDayAvailablity('Tuesday'),
        wednesday: schedulesDetails && getWeekDayAvailablity('Wednesday'),
        thursday: schedulesDetails && getWeekDayAvailablity('Thursday'),
        friday: schedulesDetails && getWeekDayAvailablity('Friday'),
        saturday: schedulesDetails && getWeekDayAvailablity('Saturday'),
        sunday: schedulesDetails && getWeekDayAvailablity('Sunday'),
      }}
      onSubmit={async values => {
        let tiemSlotsArray = getTimeSlots(values.fromTime, values.toTime);
        let startDateTest = values.startDate;
        let endDateTest = values.endDate;
        let getDateSlotsResult = getDateSlots(startDateTest, endDateTest);
        // let finalPayload = getDateSlotsResult.map(item => ({
        //   ...item,
        //   dateSlotuuid: uuid(),
        //   date: new Date(item.date),
        //   isAvailable: checkIsAvailable(item.dayName, values),
        //   time: tiemSlotsArray,
        // }));

        if (user && !schedule) {
          createSchedulesHandler(values);
        } else if (user && schedule) {
          updateScheduleHandler(values);
        }
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
        <>
          {show && (
            // <DateTimePicker
            //   testID="dateTimePicker"
            //   value={startDate}
            //   mode={mode}
            //   is24Hour={true}
            //   // display="default"
            //   onChange={(event, selectedDate) =>
            //     onChange(event, selectedDate, setFieldValue, values)
            //   }
            // />

            <DateTimePickerModal
              isVisible={show}
              testID="dateTimePicker"
              value={startDate}
              mode={mode}
              is24Hour={true}
              // display="default"
              onConfirm={selectedDate =>
                onChange({type: 'set'}, selectedDate, setFieldValue, values)
              }
              onCancel={() => setShow(false)}
            />
          )}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}>
            <View style={{}}>
              <View style={{marginVertical: 10}}>
                <Text
                  style={{
                    color: '#132333',
                    fontSize: 18,
                    textAlign: 'center',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Restaurant Schedule
                </Text>
              </View>

              <View style={{marginVertical: 10}}>
                <Text style={styles.formLable}>Start Date</Text>
                <Pressable
                  style={styles.formInputwraper}
                  onPress={() => showDatepicker('date', 'fromDate')}>
                  <View style={styles.formInputContainer}>
                    <Text style={styles.formLable}>
                      {values.startDate
                        ? remoteDateToDashFormate(
                            values.startDate.toLocaleString(),
                          )
                        : ''}
                    </Text>
                  </View>
                </Pressable>
                <View>
                  {errors.startDate && (
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'red',
                      }}>
                      {errors.startDate}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{marginVertical: 10}}>
                <Text style={styles.formLable}>End Date</Text>
                <Pressable
                  style={styles.formInputwraper}
                  onPress={() => showDatepicker('date', 'endDate')}>
                  <View style={styles.formInputContainer}>
                    <Text style={styles.formLable}>
                      {values.endDate
                        ? remoteDateToDashFormate(
                            values.endDate.toLocaleString(),
                          )
                        : ''}
                    </Text>
                  </View>
                </Pressable>
                <View>
                  {errors.endDate && (
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'red',
                      }}>
                      {errors.endDate}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{marginVertical: 10}}>
                <Text style={styles.formLable}>Order Limit</Text>
                <TextField
                  Style={styles.inputParent}
                  Style_1={[styles.inputStyle]}
                  Style_2={[styles.inputIcon]}
                  placeholder={'Enter Order Limit'}
                  placeholderTextColor="#CDCDCD"
                  iconname={'user'}
                  secure={false}
                  size={22}
                  isIcon={false}
                  // keyboard={'email-address'}
                  keyboardType="numeric"
                  name="orderLimit"
                  onChangeText={handleChange('orderLimit')}
                  onBlur={handleBlur('orderLimit')}
                  value={values.orderLimit.toString()}
                  //   onChangeText={handleChange('email')}
                  //   onBlur={handleBlur('email')}
                  //   value={values.email}
                  // keyboardType="email-address"
                />

                {errors.orderLimit && (
                  <Text
                    style={{
                      fontSize: 15,
                      paddingHorizontal: 10,
                      color: 'red',
                    }}>
                    {errors.orderLimit}
                  </Text>
                )}
              </View>

              {user && !schedule && (
                <View flexDirection="row">
                  <View style={{marginVertical: 10, marginRight: 10, flex: 1}}>
                    <Text style={styles.formLable}>From</Text>
                    <Pressable
                      style={styles.formInputwraper}
                      onPress={() => showDatepicker('time', 'startTime')}>
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
                      onPress={() => showDatepicker('time', 'endTime')}>
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
              )}

              <View style={[styles.testContainer]}>
                <FlatList
                  contentContainerStyle={
                    {
                      // flexDirection: 'row',
                      // flexWrap: 'wrap',
                    }
                  }
                  data={getDaysList(values)}
                  renderItem={({item}) => (
                    <View style={[styles.itemStyle, {margin: 5}]} key={item.id}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <Checkbox
                          accessibilityLabel="select week day"
                          name={item.value}
                          defaultIsChecked={item.flag}
                          onChange={value =>
                            setFieldValue(`${item.value}`, value)
                          }
                        />
                        <Text
                          style={{
                            color: '#484848',
                            fontSize: 14,
                            fontFamily: 'Lato-Bold',
                            marginHorizontal: 8,
                            textTransform: 'capitalize',
                          }}>
                          {item.value}
                        </Text>
                      </View>
                    </View>
                  )}
                  extraData={schedulesDetails}
                  keyExtractor={item => item.id}
                  numColumns={3}
                />
              </View>
            </View>
          </ScrollView>

          <View style={{paddingHorizontal: 20, marginVertical: 10}}>
            {isLoading ? (
              <Button
                colorScheme="success"
                style={{
                  backgroundColor: '#132333',
                  width: '100%',
                }}>
                {/* Saving... */}
                <Spinner color="primary.white" size="sm" />
              </Button>
            ) : (
              <Button
                type="submit"
                colorScheme="success"
                style={{
                  backgroundColor: '#132333',
                  width: '100%',
                }}
                onPress={() => handleSubmit()}
                // onPress={() => navigation.navigate('schedule-managment')}
              >
                Save
              </Button>
            )}
          </View>
        </>
      )}
    </Formik>
  );
};

const data = [
  {id: 1, value: 'monday'},
  {id: 2, value: 'tuesday'},
  {id: 3, value: 'wednesday'},
  {id: 4, value: 'thursday'},
  {id: 5, value: 'friday'},
  {id: 6, value: 'saturday'},
  {id: 5, value: 'sunday'},
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
});

export default ScheduleManagment;
