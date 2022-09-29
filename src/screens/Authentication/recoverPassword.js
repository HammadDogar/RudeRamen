import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import metrics from '../../assets/style/metrics';
import {Spinner, TextField} from '../../components';
import {sendPasswordResetEmailService} from '../../services/CloudFunction/auth';
import {notifyMessage,getExactError} from '../../utils/utils';


import * as yup from 'yup';
import {Formik} from 'formik';

const recoverPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
});

const RecoverPassword = ({navigation}) => {
  const [isloading, setIsLoading] = useState(false);
  const sendEmailHandler = formValues => {
    setIsLoading(true);
    sendPasswordResetEmailService(formValues.email)
      .then(response => {
        setIsLoading(false);
        notifyMessage('Please Check your Email');
        navigation.navigate('Authentication');
      })
      .catch(error => {
        setIsLoading(false);
        notifyMessage(getExactError(error));
      });
  };
  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#fffff"}}>
    <Formik
      validationSchema={recoverPasswordSchema}
      initialValues={{
        email: '',
      }}
      onSubmit={values => sendEmailHandler(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
        <View style={styles.container}>
          <View
            style={{
              position: 'relative',
            }}>
            <Icon
              style={{position: 'absolute', top: 0, left: 0, zIndex: 1}}
              name="chevron-left"
              size={30}
              color="#000000"
              onPress={() => navigation.navigate('Authentication')}
            />
            <Text
              style={{
                fontSize: 28,
                alignSelf: 'stretch',
                width: '100%',
                textAlign: 'center',
                color: '#474747',
                fontWeight: '600',
                fontFamily: 'Lato-Bold',
              }}>
              Forgot Password
            </Text>
          </View>
          <View style={{marginVertical: 25}}>
            <Text style={{fontSize: 20, color: '#3C3C3C'}}>
              Please enter your email that we can send you a verification code
            </Text>
          </View>
          <View>
            <TextField
              Style={styles.inputParent}
              Style_1={[styles.inputStyle]}
              Style_2={[styles.inputIcon]}
              placeholder={'E-mail '}
              placeholderTextColor="#A5A5A5"
              //   iconname={'user'}
              secure={false}
              isIcon={false}
              size={22}
              name="email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboard={'email-address'}
            />

            {errors.email && (
              <Text style={{fontSize: 15, color: 'red'}}>{errors.email}</Text>
            )}
          </View>
          {isloading ? (
            <Pressable style={styles.buttonStyle}>
              <Spinner color="primary.white" />

              {/* <Text style={styles.buttonText}>Sending...</Text> */}
            </Pressable>
          ) : (
            <Pressable
              style={styles.buttonStyle}
              onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Send</Text>
            </Pressable>
          )}
        </View>
      )}
    </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E6E6E6',
    borderBottomWidth: 2,
  },

  inputStyle: {
    flex: 1,
    fontSize: 18,
    ...Platform.select({
      ios: {
        height: 40,
      },
    })
    
  },
  buttonStyle: {
    // backgroundColor: '#132333',
    // borderRadius: 5,
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderRadius: 10,
    marginVertical: metrics.baseMargin,

    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    flexDirection:"row",
    borderRadius: 10,
    
    backgroundColor:"#132333"
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    // padding: metrics.basePadding,
  },
});

export default RecoverPassword;
