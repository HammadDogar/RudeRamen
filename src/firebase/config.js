import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
} from 'firebase/firestore/lite';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBOrdKhvdOoMNGaZBwEo6paBWb0rRxGJWA',
  authDomain: 'ruderamen2.firebaseapp.com',
  projectId: 'ruderamen2',
  storageBucket: 'ruderamen2.appspot.com',
  messagingSenderId: '960753111165',
  appId: '1:960753111165:web:43522ae035c93447b5a114',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();

async function getCities() {
  let citiesCol = collection(db, 'cities');
  const userCol = collection(db, 'users');

  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());

  return cityList;
}

export {app, getCities, db, auth};
