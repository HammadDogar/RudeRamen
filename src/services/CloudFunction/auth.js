import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import {auth, db} from '../../firebase/config';

async function createUserWithEmail(data) {
  let {email, password} = data;
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async userCredential => {
      return await addDoc(collection(db, 'users'), {
        ...data,
      })
        .then(response => {
          return {
            error: null,
            success: true,
            data: null,
          };
        })
        .catch(() => {
          return {
            error: error.message,
            success: false,
            data: null,
          };
        });
    })
    .catch(error => {
      return {
        error: error.message,
        success: false,
        data: null,
      };
    });
}

async function loginWithEmailAndPassword(data) {
  let {email, password} = data;
  return signInWithEmailAndPassword(auth, email, password)
    .then(async userCredential => {
      return {
        error: null,
        success: true,
        data: userCredential.user,
      };
    })
    .catch(error => {
      return {
        error: error.message,
        success: false,
        data: null,
      };
    });
}

async function getLogedInUserDetails() {
  onAuthStateChanged(auth, user => {
    return user;
  });
}

async function getUserDetailsWithemail(email) {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  let userDetails = null;
  querySnapshot.forEach(doc => {
    userDetails = {...doc.data(), uid: doc.id};
  });

  return userDetails;
}

async function getUserDetailsWithId(id) {
  const snap = await getDoc(doc(db, 'users', id));
  if (snap.exists()) {
    return snap.data();
  }
}

async function signOutService() {
  return await signOut(auth);
}

async function sendPasswordResetEmailService(email) {
  return await sendPasswordResetEmail(auth, email);
}

async function updateProfile(userId, updatedData) {
  return await updateDoc(doc(db, 'users', userId), {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
}

export {
  createUserWithEmail,
  loginWithEmailAndPassword,
  getLogedInUserDetails,
  getUserDetailsWithemail,
  signOutService,
  getUserDetailsWithId,
  sendPasswordResetEmailService,
  updateProfile,
};
