import React, {useContext, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button, TextArea} from 'native-base';
import {Spinner, TextField} from '../../../components';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'react-native-image-picker';
import * as yup from 'yup';
import {Formik} from 'formik';
import {
  MESSAGES,
  PASSWORD_MATCH_REGEX,
  SPACE_NOT_ALLOWED_REGEX,
} from '../../../constants';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {createMenu, updateMenu} from '../../../services/CloudFunction/menu';
import {getExactError, notifyMessage} from '../../../utils/utils';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from 'firebase/storage';

const createMneuSchema = yup.object().shape({
  bowlImage: yup.string().required(MESSAGES.BOWL_IMAGE_REQUIRED_FIELD),
  bowlName: yup
    .string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .matches(SPACE_NOT_ALLOWED_REGEX, MESSAGES.GENERIC_REQUIRED_FIELD),
  bowlPrice: yup
    .string()
    .trim()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .test(
      'Is positive?',
      `${MESSAGES.NEGATIVE_NUMBER_VALIDATION}`,
      value => value > 0,
    ),
  bowlDescription: yup
    .string()
    .required(MESSAGES.GENERIC_REQUIRED_FIELD)
    .matches(SPACE_NOT_ALLOWED_REGEX, MESSAGES.GENERIC_REQUIRED_FIELD)
    .max(150, 'Description must be under 150 characters'),
});

const CreateMenu = ({route, navigation}) => {
  const {user} = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const {menu} = route.params;
  const storage = getStorage();
  const storageRef = ref(storage, `/files/`);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

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
        } else if (response.error) {
          setUploading(false);
        } else if (response.customButton) {
          setUploading(false);
        } else {
          const source = {uri: response.assets[0].uri};
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
          setFieldValue('bowlImage', uploadTask);
        }
      },
    );
  };

  const createMenuHandler = async formValues => {
    let finalPyalod = {
      ...formValues,
      bowlImage: image,
      restaurantsUserId: user.uid,
    };
    setIsLoading(true);
    await createMenu(finalPyalod)
      .then(() => {
        setIsLoading(false);
        notifyMessage('Menu created successfully');
        navigation.navigate('admin-menu');
      })
      .catch(error => {
        setIsLoading(false);
        notifyMessage(getExactError(error));
        // notifyMessage(error);
      });
  };

  const updateMenuHandler = async formValues => {
    setIsLoading(true);
    await updateMenu(menu.uid, formValues)
      .then(() => {
        setIsLoading(false);
        notifyMessage(MESSAGES.UPDATED_SUCCESSFULLY_MESSAGE);
        navigation.navigate('admin-menu');
      })
      .catch(error => {
        setIsLoading(false);
        notifyMessage(getExactError(error));
      });
  };

  return (
    // <KeyboardAvoidingView behavior="height" style={{flex:1}}>
    <Formik
      validationSchema={createMneuSchema}
      initialValues={{
        bowlImage: menu?.bowlImage || '',
        bowlName: menu?.bowlName || '',
        bowlPrice: menu?.bowlPrice || '',
        bowlDescription: menu?.bowlDescription || '',
      }}
      onSubmit={values =>
        menu !== null ? updateMenuHandler(values) : createMenuHandler(values)
      }>
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
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                backgroundColor: '#132333',
              }}>
              <Icon
                name="chevron-left"
                size={30}
                color="#ffffff"
                onPress={() => navigation.goBack()}
              />

              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontFamily: 'Lato-Bold',
                    color: '#ffffff',
                  }}>
                  Menu creation
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontFamily: 'Lato-Bold',
                    color: '#ffffff',
                  }}>
                  Texas, NV
                </Text>
              </View>

              <Ionicons
                name="notifications"
                size={30}
                color="#ffffff"
                onPress={() => navigation.navigate('notification')}
              />
            </View>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}>
              <View style={{}}>
                <View style={{marginVertical: 10}}>
                  <View>
                    <View
                      style={[
                        styles.inputParent,
                        {marginBottom: 5, height: 150},
                      ]}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                        }}>
                        {values.bowlImage && uploading === false ? (
                          <Image
                            source={{
                              uri: values.bowlImage,
                            }}
                            style={{width: 100, height: 100}}
                          />
                        ) : uploading === true ? (
                          <Spinner color="primary.blue" />
                        ) : (
                          <EntypoIcon
                            name="image-inverted"
                            size={100}
                            color="#000000"
                          />
                        )}
                      </View>

                      <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => selectImg(setFieldValue)}>
                        <Text
                          style={{
                            fontSize: 20,
                            color: '#132333',
                            fontFamily: 'Lato-Bold',
                          }}>
                          Upload image
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {errors.bowlImage && (
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'red',
                        }}>
                        {errors.bowlImage}
                      </Text>
                    )}
                    <View style={{marginBottom: 5}}>
                      <TextField
                        Style={styles.inputParent}
                        Style_1={[styles.inputStyle, {paddingRight: 10}]}
                        Style_2={[styles.inputIcon]}
                        placeholder={'Enter Bowl Name'}
                        defaultValue=""
                        placeholderTextColor="#B8B8B8"
                        iconname={'gps-fixed'}
                        secure={false}
                        isIcon={false}
                        iconPosition={'right'}
                        size={18}
                        iconLib="MaterialIcons"
                        keyboard={'email-address'}
                        name="bowlName"
                        onChangeText={handleChange('bowlName')}
                        onBlur={handleBlur('bowlName')}
                        value={values.bowlName}
                        pattern={'^[a-zA-Z][sa-zA-Z]*'}
                      />
                      {errors.bowlName && (
                        <Text
                          style={{
                            fontSize: 15,
                            color: 'red',
                          }}>
                          {errors.bowlName}
                        </Text>
                      )}
                    </View>

                    <View style={{marginBottom: 5}}>
                      <TextField
                        Style={styles.inputParent}
                        Style_1={[styles.inputStyle, {paddingRight: 10}]}
                        Style_2={[styles.inputIcon]}
                        placeholder={'Enter Bowl Price'}
                        defaultValue=""
                        placeholderTextColor="#B8B8B8"
                        iconname={'gps-fixed'}
                        secure={false}
                        isIcon={false}
                        iconPosition={'right'}
                        size={18}
                        iconLib="MaterialIcons"
                        // keyboard={'email-address'}
                        keyboardType="numeric"
                        name="bowlPrice"
                        onChangeText={handleChange('bowlPrice')}
                        onBlur={handleBlur('bowlPrice')}
                        value={values.bowlPrice}
                      />

                      {errors.bowlPrice && (
                        <Text
                          style={{
                            fontSize: 15,

                            color: 'red',
                          }}>
                          {errors.bowlPrice}
                        </Text>
                      )}
                    </View>

                    <View style={{marginBottom: 5}}>
                      <TextArea
                        placeholderTextColor={'#B8B8B8'}
                        style={[{fontSize: 14}]}
                        h={40}
                        placeholder="Add Description"
                        w="100%"
                        name="bowlDescription"
                        onChangeText={handleChange('bowlDescription')}
                        onBlur={handleBlur('bowlDescription')}
                        value={values.bowlDescription}
                      />

                      {errors.bowlDescription && (
                        <Text
                          style={{
                            fontSize: 15,

                            color: 'red',
                          }}>
                          {errors.bowlDescription}
                        </Text>
                      )}
                    </View>
                  </View>

                  {isLoading ? (
                    <Button
                      colorScheme="success"
                      style={{
                        backgroundColor: '#132333',
                        width: '100%',
                      }}>
                      {/* Saving... */}
                      <Spinner color="primary.white" size="sm" />
                    </Button>
                  ) : (
                    <Button
                      colorScheme="success"
                      onPress={() => handleSubmit()}
                      style={{
                        backgroundColor: '#132333',
                        width: '100%',
                      }}>
                      Save
                    </Button>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </Formik>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: '#E6E6E6',
    borderWidth: 2,
  },

  inputIcon: {
    paddingLeft: 15,
    color: '#000000',
  },

  inputStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 55,
    // height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
    paddingHorizontal: 10,
    color: '#000000',
    ...Platform.select({
      ios: {
        height: 40,
      },
    })
  },
});

export default CreateMenu;
