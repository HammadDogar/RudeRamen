import React, {useContext, useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {IMAGES} from '../../../assets/Images';
import {Spinner, TextField} from '../../../components';
import {Button} from 'native-base';
import {metrics} from '../../../assets/style';
import Feather from 'react-native-vector-icons/Feather';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'react-native-image-picker';

import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import * as yup from 'yup';
import {Formik} from 'formik';
import {
  MESSAGES,
  PHONE_NUMBER_REGEX,
  SPACE_NOT_ALLOWED_REGEX,
} from '../../../constants';
import {updateProfile} from '../../../services/CloudFunction/auth';
import {serverTimestamp} from 'firebase/firestore/lite';

import EntypoIcon from 'react-native-vector-icons/Entypo';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import {
  getExactError,
  getInitialName,
  notifyMessage,
} from '../../../utils/utils';

const updateAdminProfileSchema = yup.object().shape({
  name: yup
    .string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .matches(SPACE_NOT_ALLOWED_REGEX, MESSAGES.GENERIC_REQUIRED_FIELD)
    .max(30, 'Name must be under 30 characters'),
  address: yup
    .string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .matches(SPACE_NOT_ALLOWED_REGEX, MESSAGES.GENERIC_REQUIRED_FIELD)
    .max(30, 'Address must be under 30 characters'),
  phone: yup
    .string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .matches(PHONE_NUMBER_REGEX, 'Phone number is not valid')
    .min(11, 'Minimum 11 digits required')
    .max(15, 'Maximum 15 digits required'),
});

const ProfileInner = ({navigation}) => {
  const {user, getUpdatedUserData} = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);

  const storage = getStorage();
  const storageRef = ref(storage, `/files/`);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const updateAdminProfileHandler = formValues => {
    setIsLoading(true);

    updateProfile(user.uid, formValues)
      .then(response => {
        setIsLoading(false);
        getUpdatedUserData();
        notifyMessage(MESSAGES.UPDATED_SUCCESSFULLY_MESSAGE);
      })
      .catch(error => {
        setIsLoading(false);
        notifyMessage(getExactError(error));
      });
    // onRegister(finalPayload);
  };

  const selectImg = setFieldValue => {
    ImagePicker.launchImageLibrary(
      {
        maxWidth: 20000,
        maxHeight: 20000,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      async response => {
        setUploading(true);
        if (response.didCancel) {
          setUploading(false);
          notifyMessage('Error while upload image');
        } else if (response.error) {
          setUploading(false);
          notifyMessage('Error while upload image');
        } else if (response.customButton) {
          setUploading(false);
          notifyMessage('Error while upload image');
        } else {
          const source = {uri: response.assets[0].uri};
          // console.log("source>>>>>:::", source)
          // setImage(source);
          const filename = response.assets[0].uri.substring(
            response.assets[0].uri.lastIndexOf('/') + 1,
          );
          const storageRef = ref(storage, filename);
          const img = await fetch(response.assets[0].uri);
          const bytes = await img.blob();
          let uploadTask = await uploadBytes(storageRef, bytes, {
            contentType: 'image/jpeg',
          }).then(snapshot => {
            return getDownloadURL(snapshot.ref);
          });
          setUploading(false);
          setImage(uploadTask);
          setFieldValue('profileImage', uploadTask);
        }
      },
    );
  };

  return (
    <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
      <Formik
        validationSchema={updateAdminProfileSchema}
        initialValues={{
          profileImage: user?.profileImage || '',
          name: user?.name || '',
          phone: user.phone || '',
          address: user?.address || '',
          email: user?.email || '',
        }}
        onSubmit={values => updateAdminProfileHandler(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          isValid,
        }) => (
          <SafeAreaView style={styles.container}>
            <View style={{flex: 1}}>
              <View
                style={{
                  height: 60,
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                }}>
                <View style={{position: 'relative'}}>
                  <Icon
                    name="chevron-left"
                    size={30}
                    color="#000000"
                    style={{
                      position: 'absolute',
                      alignSelf: 'flex-start',
                      zIndex: 9999,
                    }}
                    onPress={() => navigation.goBack()}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontFamily: 'Lato-Bold',
                      color: '#132333',
                    }}>
                    Profile Setting
                  </Text>
                </View>
              </View>
              <ScrollView
                contentContainerStyle={{
                  paddingHorizontal: 20,
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      position: 'relative',
                      height: 200,
                      width: 200,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: 'black',
                      borderRadius: 5,
                    }}>
                    {values.profileImage ? (
                      <Image
                        resizeMode="cover"
                        style={{
                          height: 200,
                          width: 200,
                          borderRadius: 5,
                        }}
                        source={{uri: values.profileImage}}
                      />
                    ) : (
                      <EntypoIcon
                        name="image-inverted"
                        size={100}
                        color="#000000"
                      />
                    )}

                    <Feather
                      name="upload-cloud"
                      size={30}
                      color={`${values.profileImage ? '#ffffff' : '#000000'}`}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                      }}
                      onPress={() => selectImg(setFieldValue)}
                    />
                  </View>
                </View>
                {uploading === true && <Spinner color="primary.blue" />}
                <View style={{marginVertical: 10}}>
                  <View style={{marginBottom: 15}}>
                    <Text style={styles.inputLable}>Restaurant Name</Text>
                    <TextField
                      Style={styles.inputParent}
                      Style_1={[styles.inputStyle]}
                      Style_2={[styles.inputIcon]}
                      placeholder={'Restaurant Name'}
                      defaultValue="Jessica Mark"
                      placeholderTextColor="#5C5C5C"
                      secure={false}
                      isIcon={false}
                      size={22}
                      name="name"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      keyboard={'default'}
                    />

                    {errors.name && (
                      <Text
                        style={{
                          fontSize: 15,

                          color: 'red',
                        }}>
                        {errors.name}
                      </Text>
                    )}
                  </View>

                  <View style={{marginBottom: 15}}>
                    <Text style={styles.inputLable}>Phone</Text>
                    <TextField
                      Style={styles.inputParent}
                      Style_1={[styles.inputStyle]}
                      Style_2={[styles.inputIcon]}
                      placeholder={'Phone Number'}
                      defaultValue="+92939939393"
                      placeholderTextColor="#5C5C5C"
                      secure={false}
                      isIcon={false}
                      size={22}
                      keyboardType="numeric"
                      // keyboard={'email-address'}
                      name="phone"
                      onChangeText={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      value={values.phone}
                    />

                    {errors.phone && (
                      <Text
                        style={{
                          fontSize: 15,

                          color: 'red',
                        }}>
                        {errors.phone}
                      </Text>
                    )}
                  </View>

                  <View style={{marginBottom: 15}}>
                    <Text style={styles.inputLable}>Email</Text>
                    <TextField
                      Style={[styles.inputParent, {backgroundColor: '#D3D3D3'}]}
                      Style_1={[styles.inputStyle]}
                      Style_2={[styles.inputIcon]}
                      placeholder={'Email'}
                      defaultValue="demo@gmail.com"
                      placeholderTextColor="#5C5C5C"
                      secure={false}
                      isIcon={false}
                      size={22}
                      keyboard={'email-address'}
                      name="email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      editable={false}
                    />
                  </View>

                  <View style={{marginBottom: 15}}>
                    <Text style={styles.inputLable}>Address</Text>
                    <TextField
                      Style={styles.inputParent}
                      Style_1={[styles.inputStyle]}
                      Style_2={[styles.inputIcon]}
                      placeholder={'Address'}
                      defaultValue="Avenue st. 12, NY. USA"
                      placeholderTextColor="#5C5C5C"
                      secure={false}
                      isIcon={false}
                      size={22}
                      keyboard={'email-address'}
                      name="address"
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      value={values.address}
                    />

                    {errors.address && (
                      <Text
                        style={{
                          fontSize: 15,

                          color: 'red',
                        }}>
                        {errors.address}
                      </Text>
                    )}
                  </View>

                  <View
                    flexDirection="row"
                    justifyContent="center"
                    marginVertical={10}>
                    {isLoading ? (
                      <Button
                        style={{
                          backgroundColor: '#132333',
                          width: metrics.deviceWidth * 0.95,
                          height: 60,
                        }}
                        flexDirection="row"
                        // onPress={() => navigation.navigate('Profile')}
                      >
                        <Spinner color="primary.white" />

                        {/* <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Lato-Bold',
                          color: '#ffffff',
                        }}>
                        Saving...
                      </Text> */}
                      </Button>
                    ) : (
                      <Button
                        style={{
                          backgroundColor: '#132333',
                          width: metrics.deviceWidth * 0.95,
                          height: 60,
                        }}
                        flexDirection="row"
                        onPress={() => handleSubmit()}
                        // onPress={() => navigation.navigate('Profile')}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Lato-Bold',
                            color: '#ffffff',
                          }}>
                          Save Changes
                        </Text>
                      </Button>
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  inputLable: {
    fontSize: 12,
    color: '#9C9C9C',
    fontFamily: 'Lato-Regular',
  },

  inputParent: {
    borderColor: '#132333',
    borderBottomWidth: 2,
  },

  inputStyle: {
    flex: 1,
    fontSize: 16,
    color: '#5C5C5C',
    padding: 0,
    ...Platform.select({
      ios: {
        height: 40,
      },
    }),
  },
});

export default ProfileInner;
