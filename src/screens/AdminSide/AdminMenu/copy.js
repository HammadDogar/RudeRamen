import React, {useContext, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {TextField} from '../../../components';
import {Formik, Form, FieldArray} from 'formik';

import * as Yup from 'yup';
import {Button} from 'native-base';
import {MESSAGES} from '../../../constants';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {
  addAddonsToMenu,
  getMneuDetail,
} from '../../../services/CloudFunction/menu';
import {notifyMessage} from '../../../utils/utils';

const ingredientsSchema = Yup.object().shape({
  ingredients: Yup.array().of(
    Yup.object().shape({
      addOnsName: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
      addOnsCost: Yup.string().required(MESSAGES.GENERIC_REQUIRED_FIELD),
    }),
  ),
});

const AddAddonsModal = ({
  show,
  regetAddonsRecord,
  setRegetAddonsRecord,
  onHide,
}) => {
  const {user} = useContext(AuthenticationContext);

  const [isLoading, setIsLoading] = useState(false);

  const addAddonsHandler = values => {
    setIsLoading(true);
    getMneuDetail(user.uid)
      .then(response => {
        addAddonsToMenu(response.uid, values.addOnsList)
          .then(res => {
            setIsLoading(false);
            notifyMessage('Addons addedd successfully');
            onHide();
            setRegetAddonsRecord(!regetAddonsRecord);
          })
          .catch(error => {
            setIsLoading(false);
          });
      })
      .catch(error => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={onHide}>
      <Formik
        initialValues={{
          addOnsList: [
            {
              addOnsName: '',
              addOnsCost: '',
            },
          ],
        }}
        validationSchema={ingredientsSchema}
        onSubmit={values => addAddonsHandler(values)}>
        {({
          errors,
          values,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
        }) => (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                <TouchableOpacity onPress={onHide}>
                  <AntIcon
                    name="close"
                    size={20}
                    color="#2285E8"
                    style={{marginHorizontal: 5}}
                  />
                </TouchableOpacity>
              </View>
              <View marginBottom={15}>
                <Text
                  style={{
                    color: '#132333',
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {' '}
                  Add AddOns
                </Text>
              </View>
              <ScrollView>
                <View>
                  <View>
                    <FieldArray
                      name={`ingredients`}
                      render={arrayHelper => (
                        <View>
                          {values.addOnsList.map((data, ingredientIndex) => (
                            <View
                              style={{
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: 'black',
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 5,
                              }}>
                              {values.addOnsList.length > 1 && (
                                <View style={{alignSelf: 'flex-end'}}>
                                  <AntIcon
                                    name="delete"
                                    size={20}
                                    color="red"
                                    style={{marginHorizontal: 5}}
                                    onPress={() =>
                                      arrayHelper.remove(ingredientIndex)
                                    }
                                  />
                                </View>
                              )}

                              <View>
                                <TextField
                                  Style={styles.inputParent}
                                  Style_1={[styles.inputStyle]}
                                  Style_2={[styles.inputIcon]}
                                  placeholder={'Add Name'}
                                  placeholderTextColor="#132333"
                                  iconname={'user'}
                                  secure={false}
                                  size={22}
                                  isIcon={false}
                                  keyboard={'email-address'}
                                  name={`addOnsList[${ingredientIndex}].addOnsName`}
                                  //   onChangeText={handleChange('email')}
                                  //   onBlur={handleBlur('email')}
                                  //   value={values.email}

                                  onChangeText={handleChange(
                                    `addOnsList[${ingredientIndex}].addOnsName`,
                                  )}
                                  onBlur={handleBlur(
                                    `addOnsList[${ingredientIndex}].addOnsName`,
                                  )}
                                  value={
                                    values.addOnsList[ingredientIndex]
                                      .addOnsName
                                  }
                                  keyboardType="email-address"
                                />

                                {errors &&
                                errors.addOnsList &&
                                errors.addOnsList[ingredientIndex] &&
                                errors.addOnsList[ingredientIndex].addOnsName &&
                                touched &&
                                touched.addOnsList &&
                                touched.addOnsList[ingredientIndex] &&
                                touched.addOnsList[ingredientIndex]
                                  .addOnsName ? (
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      color: 'red',
                                    }}>
                                    {
                                      errors.addOnsList[ingredientIndex]
                                        .addOnsName
                                    }
                                  </Text>
                                ) : null}
                              </View>

                              <View>
                                <TextField
                                  Style={styles.inputParent}
                                  Style_1={[styles.inputStyle]}
                                  Style_2={[styles.inputIcon]}
                                  placeholder={'Add Cost'}
                                  placeholderTextColor="#132333"
                                  iconname={'user'}
                                  secure={false}
                                  size={22}
                                  isIcon={false}
                                  keyboard={'email-address'}
                                  name={`addOnsList[${ingredientIndex}].addOnsCost`}
                                  //   onChangeText={handleChange('email')}
                                  //   onBlur={handleBlur('email')}
                                  //   value={values.email}
                                  keyboardType="email-address"
                                  onChangeText={handleChange(
                                    `addOnsList[${ingredientIndex}].addOnsCost`,
                                  )}
                                  onBlur={handleBlur(
                                    `addOnsList[${ingredientIndex}].addOnsCost`,
                                  )}
                                  value={
                                    values.addOnsList[ingredientIndex]
                                      .addOnsCost
                                  }
                                />

                                {errors &&
                                errors.addOnsList &&
                                errors.addOnsList[ingredientIndex] &&
                                errors.addOnsList[ingredientIndex].addOnsCost &&
                                touched &&
                                touched.addOnsList &&
                                touched.addOnsList[ingredientIndex] &&
                                touched.addOnsList[ingredientIndex]
                                  .addOnsCost ? (
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      color: 'red',
                                    }}>
                                    {
                                      errors.addOnsList[ingredientIndex]
                                        .addOnsCost
                                    }
                                  </Text>
                                ) : null}
                              </View>

                              {ingredientIndex > 0 && (
                                <View
                                  style={{
                                    flex: 0.2,
                                    alignItems: 'flex-end',
                                  }}>
                                  {/* <AiFillDelete
                                  className="d-inline text-danger dynamic-field-icons cursor"
                                  onClick={() => arrayHelper.remove(ingredientIndex)}
                                /> */}
                                </View>
                              )}
                            </View>
                          ))}

                          <TouchableOpacity
                            style={{
                              alignSelf: 'flex-end',
                            }}
                            onPress={() =>
                              arrayHelper.push({
                                addOnsName: '',
                                addOnsCost: '',
                              })
                            }>
                            <Text
                              style={{
                                fontSize: 16,
                                color: '#2285E8',
                              }}>
                              Add more
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    />

                    {/*  */}
                  </View>
                </View>
              </ScrollView>
              <View
                flexDirection="row"
                justifyContent="center"
                marginVertical={10}>
                {isLoading ? (
                  <Button
                    style={{
                      backgroundColor: '#132333',

                      borderRadius: 5,
                      minWidth: 70,
                    }}
                    direction="row">
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Lato-Bold',
                        color: '#ffffff',
                      }}>
                      Saving
                    </Text>
                  </Button>
                ) : (
                  <Button
                    style={{
                      backgroundColor: '#132333',

                      borderRadius: 5,
                      minWidth: 70,
                    }}
                    direction="row"
                    onPress={() => handleSubmit()}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Lato-Bold',
                        color: '#ffffff',
                      }}>
                      Save
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </View>
        )}
      </Formik>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    maxHeight: 400,
    alignSelf: 'stretch',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#132333',
    backgroundColor: '#F7F7F7',
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
  },
});

export default AddAddonsModal;
