import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import {ROLEID} from '../../constants';
import {db} from '../../firebase/config';

async function getResturantsDetail(numberLimit) {
  const q = query(
    collection(db, 'users'),
    where('userType', '==', ROLEID.ADMIN),
    limit(numberLimit),
  );
  const querySnapshot = await getDocs(q);
  let restuarantsDetails = [];
  querySnapshot.forEach(doc => {
    restuarantsDetails.push({...doc.data(), uid: doc.id});
  });

  return restuarantsDetails;

  // console.log(' userDetails ', userDetails);
}

async function getResturantsDetailWithRestuarantIdsArray(array) {
  const q = query(collection(db, 'users'), where(documentId(), 'in', array));
  const querySnapshot = await getDocs(q);
  let resturantArray = [];
  querySnapshot.forEach(doc => {
    resturantArray.push({...doc.data(), uid: doc.id});
  });
  return resturantArray;
}

async function getResturantsMenuDetail(array) {
  // console.log('array', array);
  const q = query(
    collection(db, 'menu'),
    where('restaurantsUserId', 'in', array),
  );
  const querySnapshot = await getDocs(q);
  let resturantMenuDetail = [];
  querySnapshot.forEach(doc => {
    resturantMenuDetail.push({...doc.data(), uid: doc.id});
  });
  return resturantMenuDetail;
  // console.log('favResDetail', favResDetail);
}

async function addToFavourites(restuarants) {
  return await addDoc(collection(db, 'favourites'), {
    ...restuarants,
    createdAt: serverTimestamp(),
  });
}

async function delteFromFavourites(favouriteResturantUid, custommerUserId) {
  const q = query(
    collection(db, 'favourites'),
    where('restaurantsUserId', '==', favouriteResturantUid),
    where('custommerUserId', '==', custommerUserId),
  );
  const querySnapshot = await getDocs(q);
  let favResDetail = null;
  querySnapshot.forEach(doc => {
    favResDetail = {...doc.data(), uid: doc.id};
  });

  if (favResDetail) {
    return await deleteDoc(doc(db, 'favourites', favResDetail?.uid));
  }
}

async function getFavouritesRestuarants(custommerId) {
  const q = query(
    collection(db, 'favourites'),
    where('custommerUserId', '==', custommerId),
  );
  const querySnapshot = await getDocs(q);
  let favouritesRestuarants = [];
  querySnapshot.forEach(doc => {
    favouritesRestuarants.push({...doc.data(), uid: doc.id});
  });

  return favouritesRestuarants;
}

export {
  getResturantsDetail,
  delteFromFavourites,
  addToFavourites,
  getFavouritesRestuarants,
  getResturantsMenuDetail,
  getResturantsDetailWithRestuarantIdsArray,
};
