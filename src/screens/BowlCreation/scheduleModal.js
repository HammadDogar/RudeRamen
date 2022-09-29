import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  FlatList,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Spinner} from '../../components';
import {ORDER_STATUS_IDS} from '../../constants';
import {
  createOrder,
  getOrdersByStatusId,
} from '../../services/CloudFunction/ordersManagment';
import {getCurrentDaySchedule} from '../../services/CloudFunction/scheduleManagment';
import {
  getTimeSlots,
  notifyMessage,
  testingGetTimeSlots,
} from '../../utils/utils';

const ScheduleModal = ({
  show,
  onHide,
  resturantId,
  setPickupTime,
  setFieldValue,
  clearErrors,
}) => {
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [error, setError] = useState(false);
  const [timeSlotsData, setTimeSlotsData] = useState(null);

  useEffect(() => {
    let currentDay = moment().format('dddd');
    setIsLoadingTimeSlots(true);

    // getOrdersByStatusId

    // let getCurrentDayScheduleApi = Promise.resolve(
    //   getCurrentDaySchedule(resturantId, currentDay),
    // );
    // let getOrdersByStatusIdApi = Promise.resolve(
    //   getOrdersByStatusId(resturantId, ''),
    // );

    // Promise.all([getCurrentDayScheduleApi, getOrdersByStatusIdApi])
    //   .then(values => {
    //     console.log('Promise Values=>', values); // [3, 1337, "foo"]
    //   })
    //   .catch(error => {
    //     console.log('error=>', error);
    //   });

    getCurrentDaySchedule(resturantId, currentDay)
      .then(response => {
        let formatedStartDate = new Date(response.fromTime.seconds * 1000);
        let formatedEndDate = new Date(response.toTime.seconds * 1000);
        // console.log('formatedStartDate', formatedStartDate);
        let tiemSlotsArray = testingGetTimeSlots(
          formatedStartDate,
          formatedEndDate,
          response.orderLimit,
        );

        getOrdersByStatusId(resturantId, ORDER_STATUS_IDS.READY_TO_PICK_UP)
          .then(response => {
            let finalSlots =
              tiemSlotsArray &&
              tiemSlotsArray.length > 0 &&
              tiemSlotsArray.map(item => {
                let orderInProcessCount = response.filter(
                  orderItem =>
                    orderItem.slot.from === item.from &&
                    orderItem.slot.to === item.to,
                ).length;
                if (orderInProcessCount < item.orderLimit) {
                  return {
                    ...item,
                    isSlotAvailable: true,
                  };
                } else {
                  return {
                    ...item,
                    isSlotAvailable: false,
                  };
                }
              });
            setTimeSlotsData(finalSlots || null);
            setIsLoadingTimeSlots(false);
            setError(false);
          })
          .catch(error => {
            // console.log('error=>', error);
          });
      })
      .catch(() => {
        setIsLoadingTimeSlots(false);
        setError(true);
      });
  }, []);

  const onSelectTimeSlot = value => {
    setPickupTime(value);
    setFieldValue(
      'slot',
      JSON.stringify({
        from: value.from,
        to: value.to,
      }),
    );
    clearErrors('slot');
    onHide();
    // let finalPayloadForOrder = {
    //   resturantUserId: resturantId,
    //   orderStatus: ORDER_STATUS_IDS.NEW_ORDER,
    //   slot: {
    //     from: value.from,
    //     to: value.to,
    //   },
    // };
    // console.log('finalPayloadForOrder', finalPayloadForOrder);
    // createOrder(finalPayloadForOrder)
    //   .then(() => {
    //     notifyMessage('Order Created Successfully');
    //   })
    //   .catch(() => {
    //     notifyMessage('Error while Creating Order');
    //   });
    // onHide();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={onHide}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
            <AntIcon
              name="close"
              size={20}
              color="#2285E8"
              style={{marginHorizontal: 5}}
              onPress={onHide}
            />
          </View>
          <View>
            <Text
              style={{
                color: '#132333',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {' '}
              Time Slots
            </Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {isLoadingTimeSlots && <Spinner color="primary.blue" />}
            <FlatList
              contentContainerStyle={{
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginVertical: 10,
              }}
              horizontal={false}
              data={timeSlotsData}
              renderItem={({item}) => (
                <Text
                  style={[
                    styles.timeSlotStyle,
                    {
                      marginVertical: 5,
                      color: `${!item.isSlotAvailable ? 'grey' : '#132333'}`,
                    },
                  ]}
                  onPress={() =>
                    item.isSlotAvailable && onSelectTimeSlot(item)
                  }>
                  <Text>{item.from}</Text> - <Text>{item.to}</Text>
                </Text>
              )}
            />
            {/* {timeSlotsData?.time.map((timeSlot, index) => (
              <Text
                key={index + 1}
                style={styles.timeSlotStyle}
                onPress={() => onSelectTimeSlot(timeSlot)}>
                {timeSlot.orderLimit}
              </Text>
            ))} */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const timeSlots = ['11:10 PM', '11:20 PM', '11:30 PM', '11:40 PM', '11:50 PM'];

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
    // backgroundColor: 'red',
    height: 400,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    alignSelf: 'stretch',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  timeSlotStyle: {
    fontSize: 22,
    fontWeight: 'Lato-Bold',
    marginVertical: 10,
  },
});

export default ScheduleModal;
