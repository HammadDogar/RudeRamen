import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import {db} from '../../firebase/config';

const getMenuIngredientsList = async menuDetail => {
  const q = query(collection(db, 'menu', menuDetail.uid, 'ingredients'));
  const querySnapshot = await getDocs(q);
  let ingredientsArray = [];
  querySnapshot.forEach(doc => {
    ingredientsArray.push({...doc.data(), uid: doc.id});
  });
  return ingredientsArray;
};

const getMenuAddonsList = async menuDetail => {
  const q = query(collection(db, 'menu', menuDetail.uid, 'addons'));
  const querySnapshot = await getDocs(q);
  let addonsObject = null;
  querySnapshot.forEach(doc => {
    addonsObject = {...doc.data(), uid: doc.id};
  });
  return addonsObject;
};

const getOnlyMenuDetails = async loginUserId => {
  const q = query(
    collection(db, 'menu'),
    where('restaurantsUserId', '==', loginUserId),
  );
  const querySnapshot = await getDocs(q);
  let menuDetail = null;
  querySnapshot.forEach(doc => {
    menuDetail = {...doc.data(), uid: doc.id};
  });
  return menuDetail;
};

async function getMneuDetail(loginUserId) {
  let menuDetail = await getOnlyMenuDetails(loginUserId);
  let ingredientsData = await getMenuIngredientsList(menuDetail);
  let addOnsRemoteList = await getMenuAddonsList(menuDetail);
  return {
    ...menuDetail,
    ingredients: ingredientsData,
    addOnsObject: addOnsRemoteList,
    // addOnsRemoteList.addOnsList
  };
}

async function createMenu(menuPayload) {
  return await addDoc(collection(db, 'menu'), {
    ...menuPayload,
    createdAt: serverTimestamp(),
  });
}

async function updateMenu(menuId, updatedData) {
  return await updateDoc(doc(db, 'menu', menuId), {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
}

async function addIngredientsToMenu(menuId, updatedData) {
  // return await updateDoc(doc(db, 'menu', menuId), {
  //   ingredients: arrayUnion(updatedData),
  // });

  return await addDoc(collection(db, 'menu', menuId, 'ingredients'), {
    ...updatedData,
    createdAt: serverTimestamp(),
  });
}

async function updateIngredientsToMenu(menuId, ingredientsId, updatedData) {
  return await updateDoc(
    doc(db, 'menu', menuId, 'ingredients', ingredientsId),
    {
      ...updatedData,
      updatedAt: serverTimestamp(),
    },
  );
}

async function updateAddonsToMenu(menuId, addonsId, updatedData) {
  return await updateDoc(doc(db, 'menu', menuId, 'addons', addonsId), {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
}

async function addAddonsToMenu(menuId, updatedData) {
  // return await updateDoc(doc(db, 'menu', menuId), {
  //   addOnsList: arrayUnion(...updatedData),
  // });

  const q = query(collection(db, 'menu', menuId, 'addons'));
  const querySnapshot = await getDocs(q);
  let addOnsdocument = null;
  querySnapshot.forEach(doc => {
    addOnsdocument = {...doc.data(), uid: doc.id};
  });

  if (addOnsdocument === null) {
    return await addDoc(collection(db, 'menu', menuId, 'addons'), {
      addOnsList: arrayUnion(...updatedData),
    });
  } else {
    return await updateDoc(
      doc(db, 'menu', menuId, 'addons', addOnsdocument.uid),
      {
        addOnsList: arrayUnion(...updatedData),
      },
    );
  }
}
export {
  getMneuDetail,
  createMenu,
  updateMenu,
  addIngredientsToMenu,
  addAddonsToMenu,
  updateIngredientsToMenu,
  updateAddonsToMenu,
};
