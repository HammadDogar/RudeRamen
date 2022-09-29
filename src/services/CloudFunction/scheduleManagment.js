import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import {db} from '../../firebase/config';

import {getDatabase, ref, set} from 'firebase/database';
import moment from 'moment';

async function getSchedules(loginUserId) {
  const q = query(
    collection(db, 'schedules'),
    where('restaurantsUserId', '==', loginUserId),
  );
  const querySnapshot = await getDocs(q);
  let schedulesDetails = null;
  querySnapshot.forEach(doc => {
    schedulesDetails = {...doc.data(), uid: doc.id};
  });
  return schedulesDetails;
}

async function getSchedulesWithResturantArray(array) {
  const q = query(
    collection(db, 'schedules'),
    where('restaurantsUserId', 'in', array),
  );
  const querySnapshot = await getDocs(q);
  let resturantSchduleDetails = [];
  querySnapshot.forEach(doc => {
    resturantSchduleDetails.push({...doc.data(), uid: doc.id});
  });
  return resturantSchduleDetails;
  // console.log('favResDetail', favResDetail);
}

async function createSchedule(schedulePayload) {
  return await addDoc(collection(db, 'schedules'), {
    ...schedulePayload,
    createdAt: serverTimestamp(),
  });
}

async function updateScheduleList(updatedSchedulePayload) {
  // return await set(
  //   ref(db, 'schedules/' + updatedSchedulePayload.uid),
  //   updatedSchedulePayload,
  // );

  return await setDoc(
    doc(db, 'schedules', updatedSchedulePayload.uid),
    {
      ...updatedSchedulePayload,
      updatedAt: serverTimestamp(),
    },
    {marge: true},
  );
}

async function getCurrentDaySchedule(userId, currentDay) {
  const q = query(
    collection(db, 'schedules'),
    where('restaurantsUserId', '==', userId),
  );
  const westCoastCities = await getDocs(q);
  let resturantArray = null;
  westCoastCities.forEach(doc => {
    resturantArray = {...doc.data(), uid: doc.id};
  });
  let currentDateSlotsObject = resturantArray?.weekDays?.find(
    item => item.dayName === currentDay,
  );
  return currentDateSlotsObject;
}

export {
  getSchedules,
  createSchedule,
  updateScheduleList,
  getSchedulesWithResturantArray,
  getCurrentDaySchedule,
};
