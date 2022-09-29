import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
} from 'react-native';
import {IMAGES} from '../../assets/Images';
import {Spinner, TextField} from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  getFavouritesRestuarants,
  getResturantsDetailWithRestuarantIdsArray,
  getResturantsMenuDetail,
} from '../../services/CloudFunction/restuarants';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';
import {useIsFocused} from '@react-navigation/native';
import {getSchedulesWithResturantArray} from '../../services/CloudFunction/scheduleManagment';
import {checkResturantIsAvailabelOrNot, notifyMessage} from '../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen Original Ramen ',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
];

const Favourites = props => {
  let {navigation} = props;

  const focus = useIsFocused();
  const {user} = useContext(AuthenticationContext);

  const [isLoading, setIsLoading] = useState(false);
  const [allFavouritesResturantsDetails, setAllFavouritesResturantsDetails] =
    useState(null);
  const [structuredResturantData, setStructuredResturantData] = useState([]);

  useEffect(() => {
    const getFavuoritesResturantWithUserId = async () => {
      setIsLoading(true);
      let restuarantUserArray = [];
      await getFavouritesRestuarants(user.uid)
        .then(response => {
          // setIsLoading(false);
          if (response.length > 0) {
            let returantsIds = response.map(items => items.restaurantsUserId);
            const chunkSize = 1;
            for (let i = 0; i < returantsIds.length; i += chunkSize) {
              const chunk = returantsIds.slice(i, i + chunkSize);
              getResturantsDetailWithRestuarantIdsArray(chunk)
                .then(response => {
                  // setIsLoading(false);
                  if (response.length > 0) {
                    restuarantUserArray = restuarantUserArray.concat(response);
                  }
                  setAllFavouritesResturantsDetails(restuarantUserArray || []);
                })
                .catch(error => {
                  setIsLoading(false);
                });
            }
          } else {
            setIsLoading(false);
          }
          // console.log('restuarantUserArray::::::', restuarantUserArray);
        })
        .catch(error => {
          setIsLoading(false);
        });
    };
    getFavuoritesResturantWithUserId();
  }, [focus]);

  useEffect(() => {
    const getMenuDetailsChunkByChunk = async () => {
      const chunkSize = 10;
      let mainArray = [];
      let mainSchduleArray = [];

      if (allFavouritesResturantsDetails) {
        let idsArray = allFavouritesResturantsDetails.map(item => item.uid);
        for (let i = 0; i < idsArray.length; i += chunkSize) {
          const chunk = idsArray.slice(i, i + chunkSize);
          await getResturantsMenuDetail(chunk)
            .then(response => {
              setIsLoading(false);
              // setallFavouritesResturantsDetails(response);

              if (response.length > 0) {
                // console.log('response:::::', JSON.stringify(response, null, 2));
                mainArray = mainArray.concat(response);
              }
            })
            .catch(error => {
              setIsLoading(false);
              // console.log('error', error);
            });

          await getSchedulesWithResturantArray(chunk)
            .then(response => {
              setIsLoading(false);
              // setallFavouritesResturantsDetails(response);

              if (response.length > 0) {
                // console.log('response:::::', JSON.stringify(response, null, 2));
                mainSchduleArray = mainSchduleArray.concat(response);
              }
            })
            .catch(error => {
              setIsLoading(false);
              // console.log('error', error);
            });

          // mainArray.push(chunk);
          // do whatever
        }
        // console.log('mainSchduleArray', JSON.stringify(mainSchduleArray));
        let finalArray = allFavouritesResturantsDetails
          .map(resturantItem => {
            let findMenu = mainArray.find(
              menuItem => menuItem.restaurantsUserId === resturantItem.uid,
            );
            let findSchedule = mainSchduleArray.find(
              scheduleItem =>
                scheduleItem.restaurantsUserId === resturantItem.uid,
            );
            return {
              ...resturantItem,
              menuDetails: findMenu
                ? {
                    ...findMenu,
                  }
                : null,

              schduleDetails: findSchedule
                ? {
                    ...findSchedule,
                  }
                : null,
            };
          })
          .filter(item => item.menuDetails !== null);
        setStructuredResturantData(finalArray);
        // console.log('finalArray', finalArray);
      }

      // console.log('mainArray:::', mainArray);
    };
    getMenuDetailsChunkByChunk();
  }, [allFavouritesResturantsDetails]);

  const renderItem = ({item}) => (
    <Item
      data={item}
      title={item.title}
      subTittle={item.subTittle}
      description={item.description}
      navigation={navigation}
    />
  );

  return (
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
              Favourites
            </Text>
          </View>
        </View>
        {isLoading && <Spinner color="primary.blue" />}

        {structuredResturantData?.length > 0 ? (
          <FlatList
            style={{
              padding: 15,
            }}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={true}
            data={structuredResturantData ? structuredResturantData : []}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
            <Text>No favorites found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const Item = ({title, subTittle, description, navigation, data}) => {
  const orderNowHandler = async restuarantUid => {
    const value = await AsyncStorage.getItem('cart_Items');
    let cartItemInStorageInJson = JSON.parse(value);
    if (
      cartItemInStorageInJson === null ||
      cartItemInStorageInJson?.itemDetail?.restaurantsUserId === restuarantUid
    ) {
      navigation.navigate('Bowl creation', {
        resturantId: data.uid,
      });
    } else {
      notifyMessage('Please Clear your Cart, before proceeding');
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        //   this.redirectToChatConverstion(item);
      }}>
      <View>
        {/* {console.log('data:::::', data)} */}

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#E8E8E8',
            borderBottomWidth: 1,
            marginVertical: 10,
          }}>
          {/* <View style={styles.cardContainer}> */}
          {/* <IoniconsIcon
            style={{position: 'absolute', top: 5, right: 5, zIndex: 1}}
            name="heart"
            size={20}
            color="#F04C4C"
            // onPress={() => navigation.navigate('Profile')}
          /> */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {data?.menuDetails ? (
              <Image
                resizeMode="cover"
                style={{
                  height: 100,
                  width: 100,
                }}
                source={{uri: data?.menuDetails.bowlImage}}
              />
            ) : (
              <EntypoIcon name="image-inverted" size={100} color="#000000" />
            )}
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
              marginLeft: 10,
            }}>
            <View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 20,

                      color: '#000000',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}>
                    {/* {title} */}
                    {data?.name || ''}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.2,
                    alignItems: 'flex-end',
                  }}>
                  {/* <IoniconsIcon
                    // style={{position: 'absolute', top: 5, right: 5, zIndex: 1}}
                    // style={{flex: 1}}
                    name="heart"
                    size={20}
                    color="#F04C4C"
                    // onPress={() => navigation.navigate('Profile')}
                  /> */}
                  <FontAwesome
                    name="heart"
                    size={30}
                    // style={{flex: 0.2, textAlign: 'right'}}
                    color="red"
                  />
                </View>
              </View>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 16,
                  fontFamily: 'Lato-Regular',
                }}>
                {data?.menuDetails?.bowlDescription || ''}
              </Text>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 13,
                }}>
                {data?.address || ''}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#000000',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}>
                $ {data?.menuDetails?.bowlPrice}
              </Text>
              {checkResturantIsAvailabelOrNot(data?.schduleDetails) ? (
                <Pressable
                  style={{
                    // paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 50,
                    backgroundColor: '#000000',
                    maxWidth: 130,
                    width: '100%',
                  }}
                  onPress={() => orderNowHandler(data.uid)}>
                  <Text
                    color="#ffffff"
                    style={{
                      fontSize: 12,
                      fontFamily: 'Lato-Regular',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#ffffff',
                    }}>
                    Build your Bowl
                  </Text>
                </Pressable>
              ) : (
                <Text
                  style={{
                    color: '#DE4545',
                    fontSize: 14,
                    fontFamily: 'Lato-Bold',
                  }}>
                  Closed
                </Text>
              )}
            </View>
          </View>
          {/* </View> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  cardShadow: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 5,
    position: 'relative',

    // height: 100,
  },
  //   mainCardView: {
  //     // height: 90,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     backgroundColor: '#ffffff',
  //     borderRadius: 15,
  //     // shadowColor: Colors.shadow,
  //     shadowOffset: {width: 0, height: 0},
  //     shadowOpacity: 1,
  //     shadowRadius: 8,
  //     elevation: 8,
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  //     // padding: 20,
  //     marginHorizontal: 16,
  //     marginVertical: 6,
  //     // paddingLeft: 16,
  //     // paddingRight: 14,
  //     // marginTop: 6,
  //     // marginBottom: 6,
  //     // marginLeft: 16,
  //     // marginRight: 16,
  //   },
  //   subCardView: {
  //     height: 80,
  //     width: 80,
  //     // borderRadius: 25,
  //     // backgroundColor: '#000000',
  //     // borderColor: '#000000',
  //     // borderWidth: 1,
  //     // borderStyle: 'solid',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
});

export default Favourites;
