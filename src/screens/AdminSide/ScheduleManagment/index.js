import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, Switch } from 'native-base';
import {
  getSchedules,
  updateScheduleList,
} from '../../../services/CloudFunction/scheduleManagment';
import { AuthenticationContext } from '../../../services/AuthServices/authServicecontext';
import { Spinner } from '../../../components';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { Timestamp } from 'firebase/firestore/lite';
import {
  getExactError,
  getFormatedTimeFromUtc,
  notifyMessage,
  remoteTimeToHoursMinutsFormat,
} from '../../../utils/utils';
import { MESSAGES } from '../../../constants';

const EditSchedule = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const [schedulesDetails, setSchedulesDetails] = useState(null);
  const [currentWeekDetails, setCurrentWeekDetails] = useState([]);

  const [availabilityState, setAvailabilityState] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(false);
  const focus = useIsFocused();

  useEffect(() => {
    const getSchedulesRemoteData = async () => {
      await getSchedules(user.uid)
        .then(response => {
          setIsLoading(false);
          setError(false);
          setSchedulesDetails(response);
          setAvailabilityState(
            response?.weekDays.some(item =>
              item.isAvailable === true ? true : false,
            ),
          );
        })
        .catch(error => {
          setIsLoading(false);
          setError(true);
        });
    };
    if (user) {
      setIsLoading(true);
      getSchedulesRemoteData();
    }
  }, [focus, availabilityState]);

  useEffect(() => {
    let startDateOfTheWeek = moment(new Date());
    let lastDayOfTheWeek = moment(new Date()).add(7, 'days');
    let currentWeekData = schedulesDetails?.schedulesList
      ?.filter(item => {
        if (
          moment(new Date(item.date.seconds * 1000), 'MM/DD/YYYY').valueOf() <=
          lastDayOfTheWeek &&
          moment(new Date(item.date.seconds * 1000), 'MM/DD/YYYY').valueOf() >=
          startDateOfTheWeek
        ) {
          return { ...item };
        }
      })
      .map(weekItem => ({
        ...weekItem,
        date: moment(new Date(weekItem.date.seconds * 1000)),
        time: weekItem.time.map(timeItem => ({
          to: moment(new Date(timeItem.to.seconds * 1000)),
          from: moment(new Date(timeItem.from.seconds * 1000)),
        })),
      }));
    if (currentWeekData) {
      setCurrentWeekDetails(currentWeekData);
    }
  }, [schedulesDetails]);

  const setAvailablityHandler = async () => {
    setAvailabilityState(!availabilityState);
    let weekDaysList = schedulesDetails?.weekDays?.map(scheduleObject => ({
      ...scheduleObject,
      isAvailable: !availabilityState,
    }));

    let updatedPayload = {
      ...schedulesDetails,
      weekDays: weekDaysList,
    };

    await updateScheduleList(updatedPayload)
      .then(response => {
        setIsLoading(false);
        notifyMessage(MESSAGES.UPDATED_SUCCESSFULLY_MESSAGE);
        // navigation.navigate('admin-menu');
      })
      .catch(error => {
        setIsLoading(false);
        // notifyMessage(getExactError(error));
        notifyMessage(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
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
        {isLoading === true && <Spinner color="primary.blue" />}
        {isLoading === false && schedulesDetails && error === false && (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}>
            <View style={{}}>
              <View style={{ marginVertical: 10 }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontFamily: 'Lato-Bold',
                    color: '#132333',
                  }}>
                  Schedule Management
                </Text>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#132333',
                      fontSize: 16,
                      // textAlign: 'center',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Orders Pick up settings
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    // flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: '#132333',
                      fontSize: 14,
                      // textAlign: 'center',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Availability:
                  </Text>
                  <Switch
                    size="lg"
                    style={{ marginLeft: 10 }}
                    isChecked={availabilityState}
                    onToggle={setAvailablityHandler}
                  />
                </View>
              </View>
              {/* <View>
                <View style={styles.formInputwraper}>
                  <View style={styles.formInputContainer}>
                    <View style={{flex: 1, paddingVertical: 10}}>
                      <Text style={[styles.formLable, {marginBottom: 10}]}>
                        20 Minutes
                      </Text>
                      <Text
                        style={[
                          styles.formLable,
                          {fontSize: 12, fontFamily: 'Lato-Regular'},
                        ]}>
                        Default Preparation time
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <TouchableOpacity
                        style={{
                          alignSelf: 'flex-end',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#3488DC',
                          }}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View> */}

              <View>
                <View style={styles.formInputwraper}>
                  <View style={styles.formInputContainer}>
                    <View style={{ flex: 1, paddingVertical: 10 }}>
                      <Text style={[styles.formLable, { marginBottom: 10 }]}>
                        10 Minutes
                      </Text>
                      <Text
                        style={[
                          styles.formLable,
                          { fontSize: 12, fontFamily: 'Lato-Regular' },
                        ]}>
                        Pickup Time Slot Duration
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginVertical: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: '#132333',
                    fontSize: 16,
                    fontFamily: 'Lato-Bold',
                  }}>
                  Pickup hours
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="edit"
                    size={20}
                    color="#000000"
                    style={{ textAlign: 'right' }}
                    onPress={() =>
                      navigation.navigate('edit-schedule-managment', {
                        schedule: schedulesDetails,
                      })
                    }
                  />
                </View>
              </View>

              {/* {currentWeekDetails.length === 0 && (
                <Text>No schedules found in this current weeks </Text>
              )} */}
              {schedulesDetails?.weekDays?.length > 0 &&
                schedulesDetails.weekDays.map(weekSingleItem => (
                  <View style={[styles.formInputwraper]}>
                    <View
                      style={[
                        styles.formInputContainer,

                        {
                          borderLeftColor: `${weekSingleItem.isAvailable ? 'green' : '#818589'
                            }`,
                          borderLeftWidth: 3,
                          flexDirection: 'row',
                          paddingVertical: 20,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flex: 1,
                        },
                      ]}>
                      <Text style={[styles.formLable, { flex: 0.6 }]}>
                        {weekSingleItem?.dayName}
                        {/* {`${weekSingleItem.isAvailable}`} */}
                      </Text>
                      <Text style={[styles.formLable, { flex: 1 }]}>
                        {remoteTimeToHoursMinutsFormat(
                          new Date(weekSingleItem?.fromTime?.seconds * 1000),
                        )}{' '}
                        -{' '}
                        {remoteTimeToHoursMinutsFormat(
                          new Date(weekSingleItem?.toTime?.seconds * 1000),
                        )}
                        {/* {getFormatedTimeFromUtc(weekSingleItem?.date || '')} */}
                      </Text>
                      <TouchableOpacity
                        style={{
                          alignItems: 'flex-end',
                          flex: 0.2,
                        }}
                        onPress={() =>
                          navigation.navigate(
                            'edit-schedule-managment-single',
                            {
                              editWeeklyRecord1: weekSingleItem,
                              // slotDayToEditId: weekSingleItem.dateSlotuuid,
                              slotDayToEditId: weekSingleItem,
                              schedules: schedulesDetails,
                            },
                          )
                        }>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#3488DC',
                          }}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

              {/* <View style={styles.formInputwraper}>
                <View
                  style={[
                    styles.formInputContainer,
                    {
                      flexDirection: 'row',
                      paddingVertical: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[styles.formLable]}>Monday</Text>
                  <Text style={[styles.formLable]}>11:00 AM to 10:00 pm</Text>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() =>
                      navigation.navigate('edit-schedule-managment-single')
                    }>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#3488DC',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formInputwraper}>
                <View
                  style={[
                    styles.formInputContainer,
                    {
                      flexDirection: 'row',
                      paddingVertical: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[styles.formLable]}>Tuesday</Text>
                  <Text style={[styles.formLable]}>11:00 AM to 10:00 pm</Text>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() =>
                      navigation.navigate('edit-schedule-managment-single')
                    }>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#3488DC',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formInputwraper}>
                <View
                  style={[
                    styles.formInputContainer,
                    {
                      flexDirection: 'row',
                      paddingVertical: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[styles.formLable]}>Wednesday</Text>
                  <Text style={[styles.formLable]}>11:00 AM to 10:00 pm</Text>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() =>
                      navigation.navigate('edit-schedule-managment-single')
                    }>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#3488DC',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formInputwraper}>
                <View
                  style={[
                    styles.formInputContainer,
                    {
                      flexDirection: 'row',
                      paddingVertical: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[styles.formLable]}>Thursday</Text>
                  <Text style={[styles.formLable]}>11:00 AM to 10:00 pm</Text>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() =>
                      navigation.navigate('edit-schedule-managment-single')
                    }>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#3488DC',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formInputwraper}>
                <View
                  style={[
                    styles.formInputContainer,
                    {
                      flexDirection: 'row',
                      paddingVertical: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[styles.formLable]}>Friday</Text>
                  <Text style={[styles.formLable]}>11:00 AM to 10:00 pm</Text>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() =>
                      navigation.navigate('edit-schedule-managment-single')
                    }>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#3488DC',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formInputwraper}>
                <View
                  style={[
                    styles.formInputContainer,
                    {
                      flexDirection: 'row',
                      paddingVertical: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[styles.formLable]}>Saturday</Text>
                  <Text style={[styles.formLable]}>11:00 AM to 10:00 pm</Text>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() =>
                      navigation.navigate('edit-schedule-managment-single')
                    }>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#3488DC',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formInputwraper}>
                <View
                  style={[
                    styles.formInputContainer,
                    {
                      flexDirection: 'row',
                      paddingVertical: 20,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[styles.formLable]}>Sunday</Text>
                  <Text style={[styles.formLable]}>11:00 AM to 10:00 pm</Text>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() =>
                      navigation.navigate('edit-schedule-managment-single')
                    }>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#3488DC',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View> */}
            </View>
          </ScrollView>
        )}
        {isLoading === false && !schedulesDetails && error === false && (
          <View>
            <Text
              style={{
                paddingHorizontal: 20,
                marginVertical: 10,
                fontFamily: 'Lato-Bold',
                color: '#132333',
              }}>
              No schedules found
            </Text>
            <View style={{ paddingHorizontal: 20, marginVertical: 10 }}>
              <Button
                colorScheme="success"
                style={{
                  backgroundColor: '#132333',
                  width: '100%',
                }}
                onPress={() =>
                  navigation.navigate('edit-schedule-managment', {
                    schedule: null,
                  })
                }>
                Create Schedule
              </Button>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    // height: 50,
  },
});

export default EditSchedule;
