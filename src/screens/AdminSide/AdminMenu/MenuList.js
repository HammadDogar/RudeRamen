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
  Alert,
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
import {getMneuDetail} from '../../../services/CloudFunction/menu';
import {AuthenticationContext} from '../../../services/AuthServices/authServicecontext';
import {useIsFocused} from '@react-navigation/native';
import {Spinner} from '../../../components';
import {notifyMessage} from '../../../utils/utils';
const countries = ['Today'];

const MenuList = ({navigation}) => {
  const [date, setDate] = useState(new Date(1598051730000));
  const focus = useIsFocused();

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [menuDetails, setMenuDetails] = useState(null);
  const [error, setError] = useState(false);

  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const {user} = useContext(AuthenticationContext);

  useEffect(() => {
    setIsLoadingMenu(true);
    setError(false);
    getMneuDetail(user.uid)
      .then(response => {
        setMenuDetails(response || null);
        setIsLoadingMenu(false);
        setError(false);
      })
      .catch(() => {
        setIsLoadingMenu(false);
        setError(true);
      });
  }, [focus]);

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
              Marvel Ramen
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
            {/* <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#ffffff',
              }}>
              Texas, NV
            </Text> */}
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
            // backgroundColor: 'red',
          }}>
          <View style={{flex: 1}}>
            <View style={[styles.profileCard, {marginVertical: 10}]}>
              <View style={[styles.imgContainerStyle]}>
                <View
                  style={{
                    height: 150,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {user?.profileImage ? (
                    <Image
                      style={{
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                        height: '100%',
                        width: '100%',
                      }}
                      source={{uri: user?.profileImage}}
                      resizeMode={'contain'}
                    />
                  ) : (
                    <EntypoIcon
                      name="image-inverted"
                      size={100}
                      color="#ffffff"
                    />
                  )}
                </View>
              </View>
              <View style={[styles.infoDetailContainerStyle]}>
                <View style={{padding: 10}}>
                  {/* <View>
                    <Icon
                      name="edit"
                      size={20}
                      color="#ffffff"
                      style={{textAlign: 'right'}}
                      onPress={() => navigation.navigate('')}
                    />
                  </View> */}
                  <Text style={[styles.infoDetailText, {fontSize: 20}]}>
                    {user?.name || ''}
                  </Text>
                  <Text style={styles.infoDetailText}>
                    {user?.address || ''}
                  </Text>
                  {/* <Text style={styles.infoDetailText}>128 Marvin St </Text> */}
                </View>
              </View>
            </View>

            {menuDetails !== null &&
              menuDetails?.ingredients?.length > 0 &&
              isLoadingMenu === false && (
                <View
                  style={{
                    borderColor: '#E8E8E8',
                    borderWidth: 2,
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Image
                        resizeMode="cover"
                        style={{
                          height: 100,
                          width: 100,
                        }}
                        source={{uri: menuDetails?.bowlImage}}
                        // flex={1}
                      />
                    </View>

                    <View
                      style={{
                        justifyContent: 'space-between',
                        flex: 1,
                        marginLeft: 10,
                        padding: metrics.tinyPadding,
                        // backgroundColor: 'blue',
                      }}>
                      <View>
                        {/* <Icon
                      name="edit"
                      size={20}
                      color="#000000"
                      style={{textAlign: 'right'}}
                      onPress={() =>
                        navigation.navigate('add-and-edit-ingredients-addons')
                      }
                    /> */}
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#000000',
                            fontFamily: 'Lato-Bold',
                            textTransform: 'capitalize',
                            marginBottom: 5,
                          }}>
                          {menuDetails?.bowlName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#353535',
                            fontFamily: 'Lato-Regular',
                            textTransform: 'capitalize',
                          }}>
                          {menuDetails?.bowlDescription}
                        </Text>

                        <Text
                          style={{
                            fontSize: 16,
                            color: '#353535',
                            fontFamily: 'Lato-Bold',
                            textAlign: 'right',
                            textTransform: 'capitalize',
                          }}>
                          $ {menuDetails?.bowlPrice}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{paddingHorizontal: 10, marginVertical: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#000000',
                          fontFamily: 'Lato-Bold',
                          textTransform: 'capitalize',
                          marginBottom: 5,
                        }}>
                        Ingredients
                      </Text>

                      <Icon
                        name="edit"
                        size={20}
                        color="#000000"
                        style={{textAlign: 'right'}}
                        onPress={() =>
                          navigation.navigate('add-and-edit-ingredients-addons')
                        }
                      />
                    </View>
                    {menuDetails?.ingredients?.length > 0 &&
                      menuDetails?.ingredients?.map((ingredientItem, index) => (
                        <View
                          key={`${ingredientItem.categoryName} + ${index + 1}`}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#000000',
                              fontFamily: 'Lato-Bold',
                              textTransform: 'capitalize',
                              marginBottom: 5,
                              alignSelf: 'flex-start',
                              borderBottomWidth: 2,
                              borderBottomColor: '#000000',
                            }}>
                            {ingredientItem.categoryName}
                          </Text>

                          <View style={[styles.testContainer]}>
                            {/* <Radio.Group
                        name="myRadioGroup"
                        accessibilityLabel="favorite number"> */}

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
                                    {marginHorizontal: 5},
                                  ]}>
                                  <View
                                    style={{
                                      flex: 1,
                                      flexDirection: 'row',
                                    }}>
                                    {/* <Radio
                                  value={item.ingredientName}
                                  size={'sm'}
                                  my={1}> */}
                                    <Text
                                      style={{
                                        color: '#484848',
                                        fontSize: 12,
                                        fontFamily: 'Lato-Bold',
                                        marginHorizontal: 8,
                                        marginVertical: 5,
                                      }}>
                                      {'\u2B24' + ' '}
                                      {item.ingredientsName}
                                    </Text>
                                    {/* </Radio> */}
                                  </View>
                                </View>
                              )}
                              keyExtractor={item => item.ingredientsName}
                              numColumns={3}
                            />
                            {/* </Radio.Group> */}
                          </View>
                        </View>
                      ))}
                  </View>

                  <View style={{paddingHorizontal: 10}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#000000',
                        fontFamily: 'Lato-Bold',
                        textTransform: 'capitalize',
                        marginBottom: 5,
                      }}>
                      AddOns
                    </Text>
                    <View>
                      <View style={[styles.testContainer]}>
                        {/* <Radio.Group
                      name="myRadioGroup"
                      accessibilityLabel="favorite number"> */}

                        {menuDetails?.addOnsObject?.addOnsList?.length > 0 && (
                          <FlatList
                            contentContainerStyle={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                            }}
                            data={menuDetails?.addOnsObject?.addOnsList}
                            renderItem={({item}) => (
                              <View
                                style={[
                                  styles.itemStyle,
                                  {marginHorizontal: 5},
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
                                      marginVertical: 5,
                                    }}>
                                    {'\u2B24' + ' '}
                                    {item.addOnsName}
                                  </Text>
                                  {/* </Radio> */}
                                </View>
                              </View>
                            )}
                            // keyExtractor={item => item.addonsId}
                            numColumns={3}
                          />
                        )}

                        {/* </Radio.Group> */}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            {isLoadingMenu === false &&
              menuDetails !== null &&
              error === false &&
              !menuDetails?.ingredients?.length > 0 && (
                <View>
                  <View style={{marginVertical: 10, alignItems: 'center'}}>
                    <Image source={IMAGES.INGREDIENTS} resizeMode={'contain'} />
                    {/* <Image source={IMAGES.INGREDIENTS}/> */}
                  </View>

                  <View style={{marginVertical: 10}}>
                    <Button
                      colorScheme="success"
                      style={{
                        backgroundColor: '#132333',
                        // maxWidth: ,
                        width: '100%',
                      }}
                      onPress={() =>
                        navigation.navigate('add-and-edit-ingredients-addons')
                      }>
                      Add Ingredients
                    </Button>
                  </View>
                </View>
              )}

            {isLoadingMenu === false &&
              error === false &&
              menuDetails === null && (
                <View style={{marginVertical: 10}}>
                  <Button
                    colorScheme="success"
                    style={{
                      backgroundColor: '#132333',
                      // maxWidth: ,
                      width: '100%',
                    }}
                    onPress={() => notifyMessage('Please create Menu first.')}>
                    Add Ingredients
                  </Button>
                </View>
              )}

            {isLoadingMenu && (
              <View>
                <Spinner color="primary.blue" />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
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

export default MenuList;
