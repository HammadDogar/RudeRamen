import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {IMAGES} from '../../assets/Images';
import {success, USER_REQUEST} from '../../redux/types';
import {useDispatch} from 'react-redux';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';
const Contact = ({navigation}) => {
  const [openMenu, setMenuOpen] = useState({});
  const {onLogout, user} = useContext(AuthenticationContext);

  let dispatch = useDispatch();
  useEffect(() => {
    setMenuOpen({});
  }, []);

  const onPressMenuItem = menuItemData => {
    // if (openMenu && menuItemData) {
    //   menuItemData.id === openMenu.id
    //     ? setMenuOpen(null)
    //     : setMenuOpen(menuItemData);
    // }
    if (menuItemData?.child?.length === 0) {
      navigation.navigate(`${menuItemData?.redirectScreen}`);
      setMenuOpen({});
    } else {
      let isMenuDataPresentAlready = openMenu?.id === menuItemData.id;
      if (!isMenuDataPresentAlready) {
        setMenuOpen(menuItemData);
      } else {
        setMenuOpen({});
      }
    }
  };

  const onPressSubMenuItem = subMenuItemData => {
    navigation.navigate(`${subMenuItemData?.redirectScreen}`);
    setMenuOpen({});
  };

  const logoutHandler = () => {
    onLogout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: 60,
            justifyContent: 'center',
            paddingHorizontal: 20,
            // backgroundColor: 'red',
          }}>
          <View style={{position: 'relative'}}>
            <Icon
              name="chevron-left"
              size={30}
              color="#000000"
              style={{
                position: 'absolute',
                alignSelf: 'flex-start',
                zIndex: 1,
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
              My Profile
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            // backgroundColor: 'red',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              {user.profileImage ? (
                <Image
                  resizeMode="cover"
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 5,
                  }}
                  source={{uri: user.profileImage}}
                  // flex={1}
                />
              ) : (
                <View
                  style={{
                    borderWidth: 2,
                    borderColor: 'black',
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                    width: 120,
                  }}>
                  <AntDesignIcon name="user" size={50} color="#000000" />
                </View>
              )}
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Lato-Bold',
                  color: '#132333',
                }}>
                {user?.name || ''}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  color: '#132333',
                }}>
                {user?.email || ''}
              </Text>
            </View>
          </View>
          <View style={styles.menuContainer}>
            {profileSettingMenuArray?.map((profileMenu, index) => (
              <>
                <TouchableWithoutFeedback
                  key={`${profileMenu?.tittle} ${index + 1}`}
                  onPress={() => onPressMenuItem(profileMenu)}>
                  <View
                    flexDirection="row"
                    style={[
                      styles.borderBottom,
                      {
                        height: 60,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      {profileMenu?.iconComponent}
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 20,
                          fontWeight: 'bold',
                          fontFamily: 'Lato-Regular',
                          marginHorizontal: 10,
                        }}>
                        {profileMenu?.tittle}
                      </Text>
                    </View>
                    {profileMenu?.child?.length > 0 && (
                      <Icon
                        name={`chevron-${
                          profileMenu?.child?.length > 0 &&
                          openMenu?.id === profileMenu?.id
                            ? 'down'
                            : 'right'
                        }`}
                        size={30}
                        color="#ffffff"
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>

                {profileMenu?.child?.length > 0 &&
                  openMenu?.id === profileMenu?.id &&
                  profileMenu?.child.map((subMenu, subMenuIndex) => (
                    <TouchableWithoutFeedback
                      key={`${subMenu?.tittle} ${subMenuIndex + 1}`}
                      onPress={() => onPressSubMenuItem(subMenu)}>
                      <View
                        flexDirection="row"
                        style={[
                          styles.borderBottom,
                          {
                            height: 60,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginLeft: 25,
                          },
                        ]}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {subMenu?.iconComponent}
                          <Text
                            style={{
                              color: '#ffffff',
                              fontSize: 16,
                              // fontWeight: 'bold',
                              fontFamily: 'Lato-Regular',
                              marginHorizontal: 10,
                            }}>
                            {subMenu?.tittle}
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
              </>
            ))}
            <TouchableWithoutFeedback onPress={logoutHandler}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    height: 60,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  },
                ]}>
                <EntypoIcon name="log-out" size={30} color="#ffffff" />
                <Text style={{color: '#ffffff', fontSize: 20, marginLeft: 5}}>
                  Logout
                </Text>
              </View>
            </TouchableWithoutFeedback>
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

  menuContainer: {
    backgroundColor: '#132333',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
  },
  borderBottom: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
});

export default Contact;

const profileSettingMenuArray = [
  {
    id: 1,
    tittle: 'Profile settings',
    redirectScreen: 'ProfileInner',
    iconComponent: <AntDesignIcon name="setting" size={30} color="#ffffff" />,
    child: [],
  },
  {
    id: 2,
    tittle: 'All orders',
    iconComponent: <EntypoIcon name="bowl" size={30} color="#ffffff" />,

    child: [
      {
        parentId: 2,
        redirectScreen: 'completed-order',
        id: 12,
        tittle: 'Completed Orders',
        iconComponent: (
          <EntypoIcon name="thumbs-up" size={20} color="#ffffff" />
        ),
      },
      {
        parentId: 2,
        redirectScreen: 'order-track',
        id: 22,
        tittle: 'Track Orders',
        iconComponent: (
          <MaterialIcons name="my-location" size={20} color="#ffffff" />
        ),
      },
    ],
  },
  {
    id: 3,
    tittle: 'Notifications',
    redirectScreen: 'notification',
    iconComponent: (
      <MaterialIcons name="notifications-none" size={30} color="#ffffff" />
    ),
    child: [],
  },
  {
    id: 4,
    tittle: 'Payments',
    redirectScreen: 'PaymentSetting',
    iconComponent: (
      <AntDesignIcon name="creditcard" size={30} color="#ffffff" />
    ),
    child: [],
  },

  {
    id: 5,
    tittle: 'Rewards',
    iconComponent: (
      <IoniconsIcon name="md-medal-outline" size={30} color="#ffffff" />
    ),
    child: [
      {
        parentId: 6,
        redirectScreen: 'earned-rewards',
        id: 14,
        tittle: 'Earned Rewards',
        iconComponent: (
          <EntypoIcon name="thumbs-up" size={20} color="#ffffff" />
        ),
      },
      {
        parentId: 6,
        redirectScreen: 'accepted-invites',
        id: 15,
        tittle: 'Accepted Invites',
        iconComponent: (
          <MaterialIcons name="my-location" size={20} color="#ffffff" />
        ),
      },
    ],
  },
  {
    id: 6,
    tittle: 'Invite Friends',
    redirectScreen: 'invite-friends',
    iconComponent: <FeatherIcon name="users" size={30} color="#ffffff" />,
    child: [],
  },
];
