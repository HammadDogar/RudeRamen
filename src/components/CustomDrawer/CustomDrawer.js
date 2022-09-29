import React, {useContext, useDebugValue} from 'react';
import {Image, SafeAreaView, ScrollView, Text, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import {IMAGES} from '../../assets/Images';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ROLEID} from '../../constants';
import {success, USER_REQUEST} from '../../redux/types';
import {signOutService} from '../../services/CloudFunction/auth';
import {notifyMessage} from '../../utils/utils';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';

import {ROUTES} from '../../navigation/Routes';

const CustomDrawer = ({role}) => {
  const navigation = useNavigation();
  let dispatch = useDispatch();
  const {onLogout, user} = useContext(AuthenticationContext);
  const logoutHandler = async () => {
    onLogout();
  };

  return (
    <View
      style={{
        paddingVertical: 20,
        // backgroundColor: 'yellow',
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 10,
          }}>
          <EntypoIcon
            name="menu"
            size={30}
            color="#000000"
            onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
          />
        </View>
        <View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                borderWidth: 10,
                borderColor: '#132333',
                // backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {user.profileImage ? (
                <Image
                  resizeMode="cover"
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 100,
                  }}
                  source={{uri: user.profileImage}}
                  // flex={1}
                />
              ) : (
                <AntDesign name="user" size={70} color="#000000" />
              )}
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#434343',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 25,
                color: '#132333',
                // marginTop: 10,
                fontFamily: 'Lato-Bold',
                textAlign: 'center',
              }}>
              {user?.name || ''}
              {/* Marvel’s Ramen */}
            </Text>
          </View>

          <SafeAreaView>
            <View>
              {role === ROLEID.ADMIN &&
                menList.map((menuItem, index) => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.dispatch(DrawerActions.closeDrawer());
                      navigation.navigate(`${menuItem.routeTo}`);
                    }}>
                    {/* > */}
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#434343',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }}>
                      <View style={{marginRight: 10}}>{menuItem?.icon}</View>
                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Lato-Bold',
                            color: '#132333',
                          }}>
                          {menuItem?.tittle}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ))}

              {role === ROLEID.CUSTOMER &&
                menListforUser.map((menuItem, index) => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.dispatch(DrawerActions.closeDrawer());
                      navigation.navigate(`${menuItem.routeTo}`);
                    }}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#434343',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }}>
                      <View style={{marginRight: 10}}>{menuItem?.icon}</View>
                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Lato-Bold',
                            color: '#132333',
                          }}>
                          {menuItem?.tittle}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
            </View>
          </SafeAreaView>
        </View>
      </View>
      <View>
        <TouchableWithoutFeedback onPress={() => logoutHandler()}>
          <View
            style={[
              {
                paddingHorizontal: 20,
                flexDirection: 'row',
                // height: 60,
                // backgroundColor: 'red',
                // justifyContent: 'flex-start',
                alignItems: 'center',
              },
            ]}>
            <EntypoIcon name="log-out" size={24} color="#132333" />
            <Text
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontFamily: 'Lato-Bold',
                marginLeft: 5,
                // fontSize: 25,
                color: '#132333',
              }}>
              Logout
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};
const menList = [
  {
    id: 1,
    icon: (
      <EntypoIcon
        name="text-document"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Dashboard',
    routeTo: 'admin-dashboard',
  },
  {
    id: 2,
    icon: (
      <AntDesign
        name="user"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Profile',
    routeTo: 'admin-profile',
  },
  {
    id: 3,
    icon: (
      <FontAwesome
        name="bank"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Payments',
    routeTo: 'admin-payments',
  },
  {
    id: 4,
    icon: (
      <EntypoIcon
        name="bowl"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Menu Creation',
    routeTo: 'admin-menu1',
  },
  {
    id: 5,
    icon: (
      <MaterialCommunityIcons
        name="silverware-fork-knife"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Ingredients & Add ons',
    routeTo: 'menu-list',
  },
  {
    id: 6,
    icon: (
      <MaterialIcons
        name="schedule"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    routeTo: 'schedule-managment',
    tittle: 'Schedule Management',
  },
  {
    id: 7,
    icon: '',
    tittle: 'Order Management',
    icon: (
      <MaterialIcons
        name="shopping-cart"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    routeTo: 'admin-orders',
  },
];

const menListforUser = [
  {
    id: 1,
    icon: (
      <EntypoIcon
        name="bowl"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Resturant',
    routeTo: 'Home',
  },
  {
    id: 2,
    icon: (
      <MaterialIcons
        name="favorite-outline"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Favourites',
    routeTo: 'Favourites',
  },
  {
    id: 3,
    icon: (
      <AntDesign
        name="user"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Profile',
    // routeTo: 'Profile',
    routeTo: ROUTES.CUSTOMMER_PROFILE_STACK,
  },
  {
    id: 4,
    icon: (
      <FontAwesome5Icon
        name="shopping-cart"
        size={25}
        color="#000000"
        onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
      />
    ),
    tittle: 'Cart',
    // routeTo: 'MyCart',
    routeTo: ROUTES.CUSTOMMER_CART,
  },
];
export default CustomDrawer;

// const removeValue = async () => {
//   try {
//     await AsyncStorage.removeItem('rude_ramen');
//   } catch (e) {
//     // remove error
//   }

// };
