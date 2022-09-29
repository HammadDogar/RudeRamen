import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  ListView,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {metrics} from '../../../assets/style';
import DateTimePicker from '@react-native-community/datetimepicker';
// import {Button} from 'react-native';
import {Pressable} from 'react-native';
import {Checkbox, Button, Radio} from 'native-base';
import {IMAGES} from '../../../assets/Images';
import AddIngredientsModal from './addIngredientsModal';
import AddAddonsModal from './addAddonsModal';
import {getMneuDetail} from '../../../services/CloudFunction/menu';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {Spinner} from '../../../components';
const countries = ['Today'];

const IngredientsAndAddonsDetails = ({navigation}) => {
  const {user} = useContext(AuthenticationContext);

  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [regetRecord, setRegetRecord] = useState(false);

  const [addOnsObject, setAddOnsObject] = useState([]);
  const [isLoadingAddons, setIsLoadingAddons] = useState([]);
  const [regetAddonsRecord, setRegetAddonsRecord] = useState(false);

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [addIngredientModalShow, setAddIngredientModalShow] = useState(false);
  const [addAddonsModalShow, setAddAddonsModalShow] = useState(false);
  const [ingredientsToEdit, setIngredientsToEdit] = useState(null);
  const [addonsToEdit, setAddonsToEdit] = useState(null);

  useEffect(() => {
    setIsLoadingIngredients(true);
    getMneuDetail(user.uid)
      .then(response => {
        setIngredientsList(response.ingredients || []);
        setIsLoadingIngredients(false);
      })
      .catch(error => {
        setIsLoadingIngredients(false);
      });
  }, [regetRecord]);

  useEffect(() => {
    setIsLoadingAddons(true);
    getMneuDetail(user.uid)
      .then(response => {
        setAddOnsObject(response.addOnsObject || null);
        setIsLoadingAddons(false);
      })
      .catch(() => {
        setIsLoadingAddons(false);
      });
  }, [regetAddonsRecord]);

  const clickOnEditIconOnIngredientRow = selectedIngredientItem => {
    setIngredientsToEdit(selectedIngredientItem);
    setAddIngredientModalShow(true);
  };

  const clickOnEditIconOnAddontRow = selectedAddonItem => {
    setAddonsToEdit(selectedAddonItem);
    setAddAddonsModalShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
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
              Ingredients & Addons
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
            paddingBottom: 20,
            // backgroundColor: 'red',
          }}>
          <View>
            <View
              style={{
                marginVertical: 10,
              }}>
              <View style={{paddingHorizontal: 10}}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                    marginBottom: 5,
                    textAlign: 'center',
                  }}>
                  Ingredients
                </Text>

                {isLoadingIngredients && (
                  <Spinner color="primary.blue" size={'sm'} />
                )}
                {ingredientsList.length > 0 &&
                  isLoadingIngredients === false &&
                  ingredientsList.map((ingredientItem, index) => (
                    <View
                      style={{
                        // borderBottomWidth:
                        //   index === ingredientItem.length - 1 ? 0 : 1,
                        paddingVertical: 5,
                        borderBottomColor: '#E7E7E7',
                      }}
                      key={`${ingredientItem.categoryName} + ${index + 1}`}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#000000',
                            fontFamily: 'Lato-Bold',
                            textTransform: 'capitalize',
                            marginBottom: 5,
                            // backgroundColor: 'red',
                            alignSelf: 'flex-start',
                            borderBottomWidth: 2,
                            borderBottomColor: '#000000',
                            // textDecorationLine: 'underline',
                          }}>
                          {ingredientItem.categoryName}
                        </Text>

                        <Icon
                          name="edit"
                          size={18}
                          color="#000000"
                          style={{textAlign: 'right'}}
                          onPress={() =>
                            clickOnEditIconOnIngredientRow(ingredientItem)
                          }
                        />
                      </View>

                      <View style={[styles.testContainer]}>
                        <FlatList
                          contentContainerStyle={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                          }}
                          data={ingredientItem.ingredients}
                          renderItem={({item}) => (
                            <View
                              style={[
                                styles.itemStyle,
                                {marginHorizontal: 5, marginVertical: 5},
                              ]}>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                }}>
                                <Text
                                  style={{
                                    color: '#484848',
                                    fontSize: 12,
                                    fontFamily: 'Lato-Bold',
                                    marginHorizontal: 8,
                                  }}>
                                  {'\u2B24' + ' '}
                                  {item.ingredientsName}
                                </Text>
                              </View>
                            </View>
                          )}
                          keyExtractor={item => item.ingredientsName}
                          numColumns={3}
                        />
                      </View>
                    </View>
                  ))}
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => setAddIngredientModalShow(true)}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#2285E8',
                    }}>
                    Add category
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{paddingHorizontal: 10}}>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#000000',
                        fontFamily: 'Lato-Bold',
                        textTransform: 'capitalize',
                        marginBottom: 5,
                        // textAlign: 'right',
                      }}>
                      AddOns
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Icon
                      name="edit"
                      size={18}
                      color="#000000"
                      style={{textAlign: 'right'}}
                      onPress={() => clickOnEditIconOnAddontRow(addOnsObject)}
                    />
                  </View>
                </View>
                {isLoadingAddons && (
                  <Spinner color="primary.blue" size={'sm'} />
                )}

                <View>
                  <View style={[styles.testContainer]}>
                    {addOnsObject?.addOnsList?.length > 0 &&
                      isLoadingAddons === false && (
                        <FlatList
                          contentContainerStyle={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                          }}
                          data={addOnsObject?.addOnsList}
                          renderItem={({item}) => (
                            <View
                              style={[styles.itemStyle, {marginHorizontal: 5}]}>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                }}>
                                <Text
                                  style={{
                                    color: '#484848',
                                    fontSize: 12,
                                    fontFamily: 'Lato-Bold',
                                    marginHorizontal: 8,
                                    marginVertical: 5,
                                  }}>
                                  {'\u2B24' + ' '}
                                  {item.addOnsName}
                                </Text>
                              </View>
                            </View>
                          )}
                          keyExtractor={item => item.addonsId}
                          numColumns={3}
                        />
                      )}
                  </View>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() => setAddAddonsModalShow(true)}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#2285E8',
                      }}>
                      Add more
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <View>
                  <View style={[styles.testContainer]}>
                    <FlatList
                      contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}
                      data={menuItem.addOns}
                      renderItem={({item}) => (
                        <View style={[styles.itemStyle, {marginHorizontal: 5}]}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: '#484848',
                                fontSize: 12,
                                fontFamily: 'Lato-Bold',
                                marginHorizontal: 8,
                                marginVertical: 5,
                              }}>
                              {'\u2B24' + ' '}
                              {item.addOnsName}
                            </Text>
                          </View>
                        </View>
                      )}
                      keyExtractor={item => item.addonsId}
                      numColumns={3}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() => setAddAddonsModalShow(true)}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#2285E8',
                      }}>
                      Add more
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>

            {/* <View style={{}}>
              <Button
                colorScheme="success"
                style={{
                  backgroundColor: '#132333',
                  // maxWidth: ,
                  width: '100%',
                }}
                onPress={() => navigation.navigate('menu-list')}>
                Save
              </Button>
            </View> */}
          </View>
        </ScrollView>
      </View>

      {addIngredientModalShow && (
        <AddIngredientsModal
          show={addIngredientModalShow}
          setRegetRecord={setRegetRecord}
          regetRecord={regetRecord}
          ingredientsToEdit={ingredientsToEdit}
          onHide={() => {
            setIngredientsToEdit(null), setAddIngredientModalShow(false);
          }}
        />
      )}

      {addAddonsModalShow && (
        <AddAddonsModal
          show={addAddonsModalShow}
          regetAddonsRecord={regetAddonsRecord}
          setRegetAddonsRecord={setRegetAddonsRecord}
          addonsToEdit={addonsToEdit}
          onHide={() => {
            setAddonsToEdit(null), setAddAddonsModalShow(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileCard: {
    backgroundColor: '#132333',
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
  },
  imgContainerStyle: {
    flex: 1,

    // backgroundColor: 'yellow',
  },
  infoDetailContainerStyle: {
    flex: 1,
    // backgroundColor: 'blue',
  },
  infoDetailText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Lato-Bold',
    color: '#ffffff',
  },

  testContainer: {
    width: metrics.deviceWidth - 40 - 20,
  },
  itemStyle: {
    width: (metrics.deviceWidth - 40 - 20 - 30) / 3,
  },
});

const menuItem = {
  menuImage: '',
  tittle: 'Spicy Shrimps Ramens',
  description:
    'Special Marvel ramen from the natives of Okinawa, made with love of American dream. Flavoured chiken is must for everyone. ',
  ingredients: [
    {
      category: 'Flavour',
      ingredientsChild: [
        {
          ingredientName: 'Chiken',
        },
        {
          ingredientName: 'Shrimps',
        },
        {
          ingredientName: 'Beef',
        },
      ],
    },
  ],
  addOns: [
    {addonsId: 1, addOnsName: 'coke', addOnsCost: 200},
    {addonsId: 2, addOnsName: 'Beer', addOnsCost: 200},
    {addonsId: 3, addOnsName: 'Others', addOnsCost: 200},
    {addonsId: 4, addOnsName: 'coke', addOnsCost: 200},
    {addonsId: 5, addOnsName: 'Beer', addOnsCost: 200},
  ],
};

export default IngredientsAndAddonsDetails;
