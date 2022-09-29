import React, {useState, createContext, useEffect} from 'react';

import {loginRequest} from './authentication.service';
import {auth, db} from '../../firebase/config';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import {
  getUserDetailsWithemail,
  getUserDetailsWithId,
} from '../CloudFunction/auth';
import {addDoc, collection} from 'firebase/firestore/lite';
import {getExactError, notifyMessage} from '../../utils/utils';

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        if (user.emailVerified === true) {
          let currentUser = auth.currentUser;
          await getUserDetailsWithemail(currentUser.email)
            .then(dataRes => {
              setUser(dataRes);
              setIsLoading(false);
            })
            .catch(error => {
              notifyMessage(error.toString());
            });
        } else {
          setIsLoading(false);
          // notifyMessage('Please verified your Email');
        }
      }
    });
  }, []);

  const onLogin = (email, password) => {
    setIsLoading(true);
    loginRequest(email, password)
      .then(u => {
        if (u.user.emailVerified === true) {
          getUserDetailsWithemail(u.user.email)
            .then(dataRes => {
              setUser(dataRes);
              setIsLoading(false);
            })
            .catch(error => {
              notifyMessage(error.toString());
            });
        } else {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              // Email verification sent!
              notifyMessage('Check your Email for Verification');
              onLogout();
              setIsLoading(false);
            })
            .catch(error => {
              notifyMessage(getExactError(error));
              setIsLoading(false);
            });
          // onLogout();
          // setIsLoading(false);
          // notifyMessage('Please verified your Email');
        }
      })
      .catch(error => {
        setIsLoading(false);
        // setError(error.toString());

        notifyMessage(getExactError(error));
      });
  };

  const onRegister = (userPayload, redirectScreen) => {
    let {email, password} = userPayload;
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async u => {
        try {
          let response = await addDoc(collection(db, 'users'), {
            ...userPayload,
          });
          sendEmailVerification(auth.currentUser).then(() => {
            // Email verification sent!
            notifyMessage('Please verify your Email');
            redirectScreen();
            onLogout();
            // ...
          });

          // await getUserDetailsWithId(response.id)
          //   .then(dataRes => {
          //     setUser(dataRes);
          //     setIsLoading(false);
          //   })
          //   .catch(error => {
          //     setIsLoading(false);
          //     setError(error.toString());
          //     onLogout();
          //   });
        } catch (error) {
          setIsLoading(false);
          notifyMessage(getExactError(error));
          // setError(error.toString());
          onLogout();
        }
      })
      .catch(error => {
        setIsLoading(false);
        notifyMessage(getExactError(error));

        // setError(error.toString());
        onLogout();
      });
  };

  const onLogout = () => {
    setUser(null);
    signOut(auth);
  };

  const getUpdatedUserData = async () => {
    if (user) {
      await getUserDetailsWithemail(user.email)
        .then(dataRes => {
          setUser(dataRes);
          setIsLoading(false);
        })
        .catch(error => {});
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        error,
        onLogin,
        onRegister,
        onLogout,
        getUpdatedUserData,
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
