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
import {Spinner} from '../../../components';
import {useIsFocused} from '@react-navigation/native';
const countries = ['Today'];

const AdminMenu = ({navigation}) => {
  const {user} = useContext(AuthenticationContext);
  const focus = useIsFocused();

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuDetail, setMneuDetails] = useState(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getMneuDetail(user.uid)
        .then(response => {
          setIsLoading(false);
          setMneuDetails(response);
        })
        .catch(error => {
          setIsLoading(false);
        });
    }
  }, [focus]);

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
            // backgroundColor: 'red',
          }}>
          <View style={{}}>
            {isLoading && <Spinner color="primary.blue" />}

            {menuDetail !== null && (
              <View style={[styles.profileCard, {marginVertical: 10}]}>
                <View style={[styles.imgContainerStyle]}>
                  <Image
                    style={{borderTopLeftRadius: 5, borderTopRightRadius: 5}}
                    source={
                      menuDetail?.bowlImage
                        ? {uri: menuDetail.bowlImage}
                        : IMAGES.RUDE_RAMIN_SPLASH_2
                    }
                    width="100%"
                    height={300}
                    resizeMode={'cover'}
                  />
                </View>
                <View style={[styles.infoDetailContainerStyle]}>
                  <View style={{padding: 10}}>
                    <View>
                      <Icon
                        name="edit"
                        size={20}
                        color="#ffffff"
                        style={{textAlign: 'right'}}
                        onPress={() =>
                          navigation.navigate('create-Menu', {
                            menu: menuDetail,
                          })
                        }
                      />
                    </View>
                    <Text style={[styles.infoDetailText, {fontSize: 20}]}>
                      {menuDetail?.bowlName || ''}
                    </Text>
                    <Text
                      style={[
                        styles.infoDetailText,
                        {fontFamily: 'Lato-Regular', fontSize: 16},
                      ]}>
                      {menuDetail?.bowlDescription || ''}
                    </Text>
                    <Text style={[styles.infoDetailText, {textAlign: 'right'}]}>
                      $ {''} {menuDetail?.bowlPrice || ''}
                    </Text>
                    {/* <Text style={styles.infoDetailText}>128 Marvin St </Text> */}
                  </View>
                </View>
              </View>
            )}

            {isLoading === false && menuDetail === null && (
              <View style={{marginTop: 20}}>
                <Button
                  colorScheme="success"
                  style={{
                    backgroundColor: '#132333',
                    width: '100%',
                  }}
                  onPress={() =>
                    navigation.navigate('create-Menu', {menu: null})
                  }>
                  Create Menu
                </Button>
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
    // flex: 1,
    // flexDirection: 'row',
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

export default AdminMenu;
