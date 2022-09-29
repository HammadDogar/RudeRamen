import { Platform, Alert, ToastAndroid } from 'react-native';
import moment from 'moment';
import uuid from 'uuid-random';

function createImageFromInitials(size, name, color) {
  if (name == null) return;
  name = getInitialName(name);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = canvas.height = size;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);
  context.fillStyle = `${color}50`;
  context.fillRect(0, 0, size, size);
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.font = `${size / 2}px Roboto`;
  context.fillText(name, size / 2, size / 2);
  return canvas.toDataURL();
}

function getInitialName(name) {
  let initials;
  const nameSplit = name.split(' ');
  const nameLength = nameSplit.length;
  if (nameLength > 1) {
    initials =
      nameSplit[0].substring(0, 1) + nameSplit[nameLength - 1].substring(0, 1);
  } else if (nameLength === 1) {
    initials = nameSplit[0].substring(0, 1);
  } else return;
  return initials.toUpperCase();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
}

function getProperErrorMessage(authCode) {
  switch (authCode) {
    case 'auth/invalid-password':
      return 'Password provided is not corrected';

    case 'auth/invalid-email':
      return 'Email provided is invalid';

    // Many more authCode mapping here...

    default:
      return '';
  }
}

function remoteDateToDashFormate(data) {
  var formatedDate = moment(data).format('DD-MM-YYYY');
  return formatedDate;
}

function remoteTimeToHoursMinutsFormat(data) {
  var formatedDate = moment(data).format('hh:mm a');
  return formatedDate;
}

function remoteTimeToHoursMinutsWithAmAndPmFormat(data) {
  var formatedDate = moment(data).format('HH:mm a');
  return formatedDate;
}

function getTimeDateDetailsObject(data) {
  var formatedDateAmPm = moment(data).format('a');
  var formatedDateHour = parseInt(moment(data).format('hh'));
  var formatedDateMinutes = parseInt(moment(data).format('mm'));

  let hourIntoMinutes = formatedDateHour * 60;
  let totalMinutes = hourIntoMinutes + formatedDateMinutes;
  let totalHourFromMinutes = totalMinutes / 60;
  let object = {
    hour: totalHourFromMinutes,
    timeStatus: formatedDateAmPm,
    minutes: formatedDateMinutes,
    totalTimeInMinutes: totalMinutes,
  };
  return object;
}

function get24HourTimeFromDate(data) {
  var timeStatus = moment(data).format('a');
  var convertedTime = moment(data).format('HH:mm');
  console.log("convertedTime", convertedTime)
  var finalTimeHour = moment.duration(convertedTime).asHours();

  // var formatedDateMinutes = parseInt(moment(data).format('mm'));

  // let hourIntoMinutes = formatedDateHour * 60;
  // let totalMinutes = hourIntoMinutes + formatedDateMinutes;
  // let totalHourFromMinutes = totalMinutes / 60;
  // let object = {
  //   hour: totalHourFromMinutes,
  //   timeStatus: formatedDateAmPm,
  //   minutes: formatedDateMinutes,
  //   totalTimeInMinutes: totalMinutes,
  // };
  // return object;
  return finalTimeHour
}

function getExactError(error) {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'This user does not exists';
    case 'auth/wrong-password':
      return 'Incorrect Password';
    case 'auth/email-already-in-use':
      return 'This email already exists';
    case 'auth/too-many-requests':
      return 'Please Check Your Email';
    default:
      return error.code;
  }
}

function getTimeSlots(start, end) {
  var startTime = moment(start, 'HH:mm');
  var endTime = moment(end, 'HH:mm');
  if (endTime.isBefore(startTime)) {
    endTime.add(1, 'day');
  }
  var timeSlots = [];
  while (startTime < endTime) {
    timeSlots.push({
      uuid: uuid(),
      from: new Date(moment(startTime)),
      to: new Date(moment(startTime.add(10, 'minutes'))),
    });

    startTime.add(0, 'minutes');
  }
  return timeSlots;
}

function testingGetTimeSlots(start, end, orderLimit) {
  var startTime = moment(start, 'HH:mm');
  var endTime = moment(end, 'HH:mm');
  if (endTime.isBefore(startTime)) {
    endTime.add(1, 'day');
  }
  var timeSlots = [];
  while (startTime < endTime) {
    timeSlots.push({
      // uuid: uuid(),
      from: moment(startTime).format('HH:mm'),
      to: moment(startTime.add(10, 'minutes')).format('HH:mm'),
      orderLimit: orderLimit,
    });

    startTime.add(0, 'minutes');
  }
  return timeSlots;
}

function getDateSlots(startDate, endDate, startTime, endTime) {
  let pickupSlots = [];
  while (
    moment(startDate, 'MM/DD/YYYY').valueOf() <=
    moment(endDate, 'DD/MM/YYYY').valueOf()
  ) {
    let obj = {
      date: moment(startDate),
      dayName: moment(startDate, 'MM/DD/YYYY').format('dddd'),
    };
    pickupSlots.push(obj);
    startDate = moment(startDate).add(1, 'days');
  }
  return pickupSlots;
}

function getFormatedTimeFromUtc(date) {
  return moment(date).format('DD-MM-YYYY');
}

function getFormatedDatIntoYFromUtc(date) {
  return moment(date).format('YYYY-MM-DD');
}

function checkResturantIsAvailabelOrNot(schduleDetails) {
  let currentDate = moment().format('dddd');
  let isAvailable = schduleDetails?.weekDays?.find(item => {
    // let itemDate = moment(new Date(item.date.seconds * 1000)).format(
    //   'DD-MM-YYYY',
    // );
    if (currentDate === item.dayName) {
      if (item.isAvailable === true) {
        return item;
      }
    }
  });

  if (isAvailable) {
    return true;
  } else {
    return false;
  }
}

const generateUniqOrderNumber = () => {
  return new Date().valueOf();
};

const convet24HourTo12Hour = hours => {
  return moment(hours, ['HH:mm']).format('hh:mm a');
};

const showDateOrToday = date => {
  let commingDate = moment(date).format('YYYY-MM-DD');
  let todayDate = moment(new Date()).format('YYYY-MM-DD');
  if (commingDate === todayDate) {
    return 'Today';
  } else {
    return commingDate;
  }
};
export {
  notifyMessage,
  createImageFromInitials,
  getRandomColor,
  getInitialName,
  getProperErrorMessage,
  remoteTimeToHoursMinutsFormat,
  remoteDateToDashFormate,
  getExactError,
  getTimeSlots,
  getDateSlots,
  getFormatedTimeFromUtc,
  checkResturantIsAvailabelOrNot,
  remoteTimeToHoursMinutsWithAmAndPmFormat,
  getTimeDateDetailsObject,
  getFormatedDatIntoYFromUtc,
  testingGetTimeSlots,
  generateUniqOrderNumber,
  convet24HourTo12Hour,
  showDateOrToday,
  get24HourTimeFromDate
};
