import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import {onSnapshot} from 'firebase/firestore';
import {db} from '../../firebase/config';

import {getDatabase, ref, set} from 'firebase/database';
import moment from 'moment';
import {ORDER_STATUS_IDS} from '../../constants';

async function getOrdersByStatusId(restuarantUserId, orderStatusId) {
  const q = query(
    collection(db, 'orders'),
    // where('orderStatus', '!=', orderStatusId),
    where('restaurantsUserId', '==', restuarantUserId),
  );
  const querySnapshot = await getDocs(q);
  let restuarantOrdersArray = [];
  querySnapshot.forEach(doc => {
    if (doc.data().orderStatus !== ORDER_STATUS_IDS.PICKED_UP) {
      restuarantOrdersArray.push({...doc.data(), uid: doc.id});
    }
  });
  return restuarantOrdersArray;
}

async function getOrdersByresturantUserId(restuarantUserId) {
  const q = query(
    collection(db, 'orders'),
    where('restaurantsUserId', '==', restuarantUserId),
  );
  const querySnapshot = await getDocs(q);
  let restuarantOrdersArray = [];
  querySnapshot.forEach(doc => {
    restuarantOrdersArray.push({...doc.data(), uid: doc.id});
  });
  return restuarantOrdersArray;
}

async function getOrdersByresturantUserIdAndStatusId(
  restuarantUserId,
  statusId,
) {
  const q = query(
    collection(db, 'orders'),
    where('restaurantsUserId', '==', restuarantUserId),
    where('orderStatus', '==', statusId),
  );
  const querySnapshot = await getDocs(q);
  let restuarantOrdersArray = [];
  querySnapshot.forEach(doc => {
    restuarantOrdersArray.push({...doc.data(), uid: doc.id});
  });
  return restuarantOrdersArray;
}

async function createOrder(orderPayload) {
  return await addDoc(collection(db, 'orders'), {
    ...orderPayload,
    createdAt: serverTimestamp(),
  });
}

async function updateOrderStatus(orderUid, updatedData) {
  return await updateDoc(doc(db, 'orders', orderUid), {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
}

export {
  getOrdersByStatusId,
  createOrder,
  getOrdersByresturantUserId,
  getOrdersByresturantUserIdAndStatusId,
  updateOrderStatus,
};
