import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  ImageBackground,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';

import {ErrorContainer, Spinner, TextField} from '../../components';
import CheckBox from '@react-native-community/checkbox';
import {IMAGES} from '../../assets/Images';
import {useDispatch} from 'react-redux';
import {success, USER_REQUEST} from '../../redux/types';
import {ROLEID} from '../../constants';
import {Checkbox} from 'native-base';
import {
  createUserWithEmail,
  testingFunc,
} from '../../services/CloudFunction/auth';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

const Login = props => {
  let {navigation} = props;
  const {onLogin, isLoading, error} = useContext(AuthenticationContext);
  const [showPassword, setShowPassword] = useState(false);

  let dispatch = useDispatch();

  const loginSubmitHandler = async formValues => {
    onLogin(formValues.email, formValues.password);
  };

  return (
    <Formik
      validationSchema={loginValidationSchema}
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={values => loginSubmitHandler(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
        <View style={styles.mainContainer}>
          <View style={styles.authBox}>
            <TextField
              Style={styles.inputParent}
              Style_1={[styles.inputStyle]}
              Style_2={[styles.inputIcon]}
              placeholder={'Email'}
              autoComplete="off"
              placeholderTextColor="#CFCFCF"
              iconname={'user'}
              secure={false}
              size={22}
              keyboard={'email-address'}
              name="email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
            />

            {errors.email && (
              <Text style={{fontSize: 15, paddingHorizontal: 10, color: 'red'}}>
                {errors.email}
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
              extraIconObject={{
                iconname: `${showPassword?"ios-eye":"ios-eye-off"}`,
                size: 22,
                Style_2: styles.specialIcon,
                onPress: () => setShowPassword(!showPassword),
              }}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />

            {errors.password && (
              <Text style={{fontSize: 15, paddingHorizontal: 10, color: 'red'}}>
                {errors.password}
              </Text>
            )}

            <View style={{marginVertical: 20}}>
              <Checkbox
                value="test"
                accessibilityLabel="Remember me"
                defaultIsChecked>
                <Text style={[styles.tinyLink, {alignSelf: 'flex-end'}]}>
                  Remember me
                </Text>
              </Checkbox>
            </View>
          </View>
          <View style={{marginVertical: 10}}>
            <Text
              style={[styles.tinyLink, {alignSelf: 'flex-end'}]}
              onPress={() => navigation.navigate('RecoverPassword')}>
              Forgot password
            </Text>
          </View>

          {isLoading ? (
            <Pressable style={styles.loginButton}>
              {/* <Text style={styles.btnText}>Saving...</Text> */}
              <Spinner color="primary.blue" />
            </Pressable>
          ) : (
            <Pressable
              style={styles.loginButton}
              onPress={() => handleSubmit()}>
              <Text style={styles.btnText}>Login</Text>
            </Pressable>
          )}

          {error && <Text style={{fontSize: 12, color: 'red'}}>{error}</Text>}

          <View style={{marginVertical: 10, alignItems: 'center'}}>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 16}}>
              Do you want
              <Text
                style={styles.tinyLink}
                onPress={() => props.setScreenState(2)}>
                {' '}
                register
              </Text>{' '}
              as a restaurant?
              <Text
                style={styles.tinyLink}
                onPress={() => props.setScreenState(3)}>
                {' '}
                Click here
              </Text>
            </Text>
          </View>
        </View>
      )}
    </Formik>
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
    // minHeight: 350,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
  },
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    // marginVertical: 5,
    marginVertical: 10,
    borderRadius: 5,
    // shadowColor: 'rgba(0, 0, 0, 0.25)',

    backgroundColor: '#fff',
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

  specialIcon: {
    paddingRight: 15,
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

export default Login;
