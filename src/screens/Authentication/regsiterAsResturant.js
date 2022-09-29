import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  ToastAndroid,
  Platform,
  AlertIOS,
  KeyboardAvoidingView
} from 'react-native';
import { Spinner, TextField } from '../../components';
import * as yup from 'yup';
import { Formik } from 'formik';
import {
  MESSAGES,
  PASSWORD_MATCH_REGEX,
  PHONE_NUMBER_REGEX,
  ROLEID,
} from '../../constants';
import { Alert } from 'native-base';
import { createUserWithEmail } from '../../services/CloudFunction/auth';
import { notifyMessage } from '../../utils/utils';
import { AuthenticationContext } from '../../services/AuthServices/authServicecontext';

const loginValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .max(30, 'Name must be under 30 characters'),
  address: yup
    .string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .max(30, 'Address must be under 30 characters'),
  email: yup
    .string()
    .email('Please enter valid email')
    .required(MESSAGES.GENERIC_REQUIRED_FIELD),
  phone: yup
    .string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .matches(PHONE_NUMBER_REGEX, 'Phone number is not valid')
    .min(11, 'Minimum 11 digits required')
    .max(15, 'Maximum 15 digits required'),
  password: yup
    .string()
    // .string()
    // .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .matches(PASSWORD_MATCH_REGEX, MESSAGES.PASSWORD_MATCH_ERROR_MESSAGE),
  confirmPassword: yup.string().when('password', {
    is: val => (val && val.length > 0 ? true : false),
    then: yup
      .string()
      .oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});

const RegisterAsResturant = ({ setScreenState }) => {
  const { onRegister, isLoading, error } = useContext(AuthenticationContext);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const registerAsResturantHandler = (formValues, redirectScreen) => {
    // let finalPayload = {
    //   ...formValues,
    //   userType: ROLEID.ADMIN,
    // };

    let finalPayload = {
      ...formValues,
      userType: ROLEID.ADMIN,
    };

    onRegister(finalPayload, redirectScreen);

    // setLoading(true);
    // createUserWithEmail(finalPayload)
    //   .then(res => {
    //     setLoading(false);
    //     if (res.success) {
    //       notifyMessage('Register Successfully');
    //       setScreenState(1);
    //     } else {
    //       notifyMessage('Register Fail');
    //     }
    //   })
    //   .catch(error => {
    //     setLoading(false);
    //     notifyMessage('Register Fail');
    //   });
  };

  const redirectScreen = () => {
    setScreenState(1);
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{
          name: '',
          phone: '',
          address: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={(values, { resetForm }) =>
          registerAsResturantHandler(values, redirectScreen)
        }>
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
          <View style={styles.mainContainer}>
            <View style={styles.authBox}>
              <TextField
                Style={styles.inputParent}
                Style_1={[styles.inputStyle]}
                Style_2={[styles.inputIcon]}
                placeholder={'Restuarant Name'}
                placeholderTextColor="#CFCFCF"
                iconname={'user'}
                secure={false}
                size={22}
                keyboard={'email-address'}
                name="name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />

              {errors.name && (
                <Text style={{ fontSize: 15, paddingHorizontal: 10, color: 'red' }}>
                  {errors.name}
                </Text>
              )}

              <TextField
                Style={styles.inputParent}
                Style_1={[styles.inputStyle]}
                Style_2={[styles.inputIcon]}
                placeholder={'Address'}
                placeholderTextColor="#CFCFCF"
                iconname={'address-card'}
                secure={false}
                size={22}
                keyboard={'email-address'}
                name="address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
              />

              {errors.address && (
                <Text style={{ fontSize: 15, paddingHorizontal: 10, color: 'red' }}>
                  {errors.address}
                </Text>
              )}

              <TextField
                Style={styles.inputParent}
                Style_1={[styles.inputStyle]}
                Style_2={[styles.inputIcon]}
                placeholder={'Email'}
                placeholderTextColor="#CFCFCF"
                iconname={'envelope'}
                secure={false}
                size={22}
                keyboard={'email-address'}
                name="email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />

              {errors.email && (
                <Text style={{ fontSize: 15, paddingHorizontal: 10, color: 'red' }}>
                  {errors.email}
                </Text>
              )}

              <TextField
                Style={styles.inputParent}
                Style_1={[styles.inputStyle]}
                Style_2={[styles.inputIcon]}
                placeholder={'Phone'}
                placeholderTextColor="#CFCFCF"
                iconname={'phone'}
                secure={false}
                size={22}
                // keyboard={'email-address'}
                keyboardType="numeric"
                name="phone"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
              />

              {errors.phone && (
                <Text style={{ fontSize: 15, paddingHorizontal: 10, color: 'red' }}>
                  {errors.phone}
                </Text>
              )}

              <TextField
                Style={styles.inputParent}
                Style_1={[styles.inputStyle]}
                Style_2={[styles.inputIcon]}
                placeholder={'Password'}
                placeholderTextColor="#CFCFCF"
                iconname={'key'}
                secure={!showPassword}
                size={22}
                // keyboard={'email-address'}
                name="password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                extraIconObject={{
                  iconname: `${showPassword?"ios-eye":"ios-eye-off"}`,
                  size: 22,
                  Style_2: styles.specialIcon,
                  onPress: () => setShowPassword(!showPassword),
                }}
              />

              {errors.password && (
                <Text style={{ fontSize: 15, paddingHorizontal: 10, color: 'red' }}>
                  {errors.password}
                </Text>
              )}
              <TextField
                Style={styles.inputParent}
                Style_1={[styles.inputStyle]}
                Style_2={[styles.inputIcon]}
                placeholder={'Confirm Password'}
                placeholderTextColor="#CFCFCF"
                iconname={'key'}
                secure={!showConfirmPassword}
                size={22}
                // keyboard={'email-address'}
                name="confirmPassword"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                extraIconObject={{
                  iconname: `${showConfirmPassword?"ios-eye":"ios-eye-off"}`,
                  size: 22,
                  Style_2: styles.specialIcon,
                  onPress: () => setShowConfirmPassword(!showConfirmPassword),
                }}
              />

              {errors.confirmPassword && (
                <Text style={{ fontSize: 15, paddingHorizontal: 10, color: 'red' }}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
            <View style={{ marginVertical: 10, alignItems: 'center' }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}>
                Do you want<Text style={styles.tinyLink}> register</Text> as a
                customer?{' '}
                <Text onPress={() => setScreenState(2)} style={[styles.tinyLink]}>
                  Click here
                </Text>
              </Text>
            </View>
            {error && <Text>{error}</Text>}

            {isLoading ? (
              <Pressable style={styles.loginButton}>
                <Spinner color="primary.blue" />

                {/* <Text style={styles.btnText}>Saving...</Text> */}
              </Pressable>
            ) : (
              <Pressable
                style={styles.loginButton}
                onPress={() => handleSubmit()}>
                <Text style={styles.btnText}>Sign up</Text>
              </Pressable>
            )}
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  tinyLink: {
    color: '#4485C7',
  },
  mainContainer: {
    borderRadius: 5,
    alignSelf: 'stretch',
    borderRadius: 5,
    paddingVertical: 20,
  },
  authBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    alignSelf: 'stretch',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 20,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
  },
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    marginVertical: 5,
    borderRadius: 5,
    // elevation: 5,
    // shadowColor: 'rgba(0, 0, 0, 0.25)',

    backgroundColor: '#fff',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    elevation: 5,

  },

  inputIcon: {
    paddingLeft: 15,
    color: '#000000',
  },

  inputStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 55,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000000',
  },
  specialIcon: {
    paddingRight: 15,
    color: '#000000',
  },
  btnText: {
    color: '#132333',
    fontFamily: 'Lato-Bold',
    fontSize: 26,
  },
  loginButton: {
    backgroundColor: '#ffffff',
    // backgroundColor: '#132333',

    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 10,
  },
});

export default RegisterAsResturant;
