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
import uuid from 'uuid-random';
import {updateScheduleList} from '../../../services/CloudFunction/scheduleManagment';
import {async} from '@firebase/util';

const ingredientsSchema = Yup.object().shape({
  toTime: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  fromTime: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
  orderLimit: Yup.number()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .min(1, 'Limit must be greater then 1 ')
    .max(99, 'Limit must not exceed more than 2 digits '),
});

const DeleteChunk = ({
  show,
  regetAddonsRecord,
  setRegetAddonsRecord,
  onHide,
  editWeeklyRecord,
  schedules,
  chunkToDelete,
  setRerenderState,
  reRenderState,
}) => {
  const {user} = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeCompo, setShowTimeCompo] = useState(false);
  const [mode, setMode] = useState('date');
  const [clickState, setClickState] = useState(null);

  const addAddonsHandler = async values => {
    let finalPayload = {
      ...schedules,
      weekDays: schedules.weekDays.map(itemObject => {
        if (itemObject.dayName === editWeeklyRecord.dayName) {
          return {
            ...itemObject,
            slotChunks: editWeeklyRecord.slotChunks.filter(
              chunkObject => chunkObject.chunkId !== chunkToDelete.chunkId,
            ),
          };
        } else {
          return {
            ...itemObject,
          };
        }
      }),
      // schedulesList: schedules.schedulesList.map(itemObject => {
      //   if (itemObject.dayName === editWeeklyRecord.dayName) {
      //     return {
      //       ...itemObject,
      //       slotChunks: editWeeklyRecord.slotChunks.filter(
      //         chunkObject => chunkObject.chunkId !== chunkToDelete.chunkId,
      //       ),
      //       time: itemObject.time.map(timeObject => {
      //         if (
      //           moment(new Date(timeObject.from.seconds * 1000)).format(
      //             'HH:mm',
      //           ) >= moment(values.fromTime).format('HH:mm') &&
      //           moment(new Date(timeObject.to.seconds * 1000)).format(
      //             'HH:mm',
      //           ) <= moment(values.toTime).format('HH:mm')
      //         ) {
      //           return {
      //             ...timeObject,
      //             orderLimit: schedules.orderLimit,
      //           };
      //         } else {
      //           return {
      //             ...timeObject,
      //           };
      //         }
      //       }),
      //     };
      //   } else {
      //     return {
      //       ...itemObject,
      //     };
      //   }
      // }),
      // uid: schedules.uid,
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

        // navigation.navigate('schedule-managment');
      })
      .catch(error => {
        setIsLoading(false);

        // notifyMessage(getExactError(error));
      });
    // console.log('values:::::', JSON.stringify(finalPayload, null, 2));
  };

  const onChange = (event, selectedDate, setFieldValue, ingredientIndex) => {
    const currentDate = selectedDate;
    setShowTimeCompo(false);
    if (clickState === 'fromTime') {
      setFieldValue(`fromTime`, currentDate);
    } else if (clickState === 'toTime') {
      setFieldValue(`toTime`, currentDate);
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
          fromTime: chunkToDelete
            ? new Date(chunkToDelete.fromTime.seconds * 1000)
            : '',
          toTime: chunkToDelete
            ? new Date(chunkToDelete.toTime.seconds * 1000)
            : '',
          orderLimit: chunkToDelete ? chunkToDelete.orderLimit : 0,
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
                    // color: '#132333',
                    color: '#D70040',
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {' '}
                  Are you sure you want to delete?
                </Text>
                <Text
                  style={{
                    color: '#132333',
                    fontSize: 16,
                    marginVertical: 10,
                    fontWeight: 'normal',
                    textAlign: 'center',
                  }}>
                  Deleting these slots will reset the settings
                </Text>
              </View>

              {isLoading ? (
                <Spinner color="primary.blue" size={'sm'} />
              ) : (
                <View
                  flexDirection="row"
                  justifyContent="center"
                  marginVertical={5}>
                  <Button
                    style={{
                      backgroundColor: '#132333',
                      marginHorizontal: 10,
                      borderRadius: 5,
                      minWidth: 70,
                    }}
                    flexDirection="row"
                    onPress={() => onHide()}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Lato-Bold',
                        color: '#ffffff',
                      }}>
                      cancel
                    </Text>
                  </Button>
                  {/* {isLoading ? (
                  <Button
                    style={{
                      backgroundColor: '#132333',

                      borderRadius: 5,
                      minWidth: 70,
                    }}
                    direction="row">
                    <Spinner color="primary.white" size={'sm'} />
                  </Button>
                ) : ( */}
                  <Button
                    style={{
                      backgroundColor: '#D70040',
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
                      Delete
                    </Text>
                  </Button>
                  {/* ) */}
                  {/* } */}
                </View>
              )}
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
    backgroundColor: '#ececec',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 20,
    position: 'relative',
    alignItems: 'center',
    height: 50,
  },
});

export default DeleteChunk;
