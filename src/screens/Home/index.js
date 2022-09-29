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
import {Spinner, TextField} from '../../components';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ROUTES} from '../../navigation/Routes';
import {
  addToFavourites,
  delteFromFavourites,
  getFavouritesRestuarants,
  getResturantsDetail,
  getResturantsMenuDetail,
} from '../../services/CloudFunction/restuarants';
import {useIsFocused} from '@react-navigation/native';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';
import {checkResturantIsAvailabelOrNot, notifyMessage} from '../../utils/utils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getSchedulesWithResturantArray} from '../../services/CloudFunction/scheduleManagment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = props => {
  let {navigation} = props;
  const focus = useIsFocused();
  const {user} = useContext(AuthenticationContext);

  const [getResturantLimit, setGetResturantLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [addToFavIsLoading, setAddToFavIsLoading] = useState(false);
  const [allResturantsDetails, setAllResturantsDetails] = useState(null);
  const [structuredResturantData, setStructuredResturantData] = useState([]);
  const [allFavouritesResturantsDetails, setAllFavouritesResturantsDetails] =
    useState(null);
  const [favouritesResIds, setFavouritesResIds] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getResturantsDetail(getResturantLimit)
      .then(response => {
        // setIsLoading(false);
        setAllResturantsDetails(response);
      })
      .catch(error => {
        setIsLoading(false);
      });
  }, [focus, addToFavIsLoading]);

  useEffect(() => {
    setIsLoading(true);
    getFavouritesRestuarants(user.uid)
      .then(response => {
        // setIsLoading(false);
        setAllFavouritesResturantsDetails(response);
      })
      .catch(error => {
        setIsLoading(false);
      });
  }, [focus, addToFavIsLoading]);

  useEffect(() => {
    let favouritsResturantsIdsArray = allFavouritesResturantsDetails?.map(
      item => item.restaurantsUserId,
    );
    setFavouritesResIds(favouritsResturantsIdsArray);
  }, [allResturantsDetails, allFavouritesResturantsDetails]);

  useEffect(() => {
    const getMenuDetailsChunkByChunk = async () => {
      const chunkSize = 10;
      let mainArray = [];
      let mainSchduleArray = [];

      if (allResturantsDetails) {
        let idsArray = allResturantsDetails.map(item => item.uid);
        for (let i = 0; i < idsArray.length; i += chunkSize) {
          const chunk = idsArray.slice(i, i + chunkSize);
          await getResturantsMenuDetail(chunk)
            .then(response => {
              if (response.length > 0) {
                mainArray = mainArray.concat(response);
              }
            })
            .catch(error => {
              setIsLoading(false);
            });

          await getSchedulesWithResturantArray(chunk)
            .then(response => {
              // setIsLoading(false);
              if (response.length > 0) {
                mainSchduleArray = mainSchduleArray.concat(response);
              }
            })
            .catch(error => {
              setIsLoading(false);
              // console.log('error', error);
            });
        }
        let finalArray = allResturantsDetails
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
        // console.log('finalArray', JSON.stringify(finalArray, null, 2));
        setIsLoading(false);
      }
    };
    getMenuDetailsChunkByChunk();
  }, [allResturantsDetails]);

  const checkIsFavourite = resturant => {
    let isFavourite = favouritesResIds?.find(item => item === resturant.uid);
    return isFavourite;
  };

  const loadMoreOlderResturants = () => {
    setGetResturantLimit(getResturantLimit + 10);
    getResturantsDetail(getResturantLimit + 10)
      .then(response => {
        // setIsLoading(false);
        setAllResturantsDetails(response);
      })
      .catch(error => {
        setIsLoading(false);
      });
  };

  const addToFavouritesAndViceVersa = async favouriteItem => {
    let finalPyalod = {
      custommerUserId: user.uid,
      restaurantsUserId: favouriteItem.uid,
    };
    setAddToFavIsLoading(true);
    await addToFavourites(finalPyalod)
      .then(() => {
        setAddToFavIsLoading(false);
        notifyMessage('Added to My Favorites');
      })
      .catch(error => {
        setAddToFavIsLoading(false);
        // console.log('error', error);
        notifyMessage(getExactError(error));
      });
  };

  const deleteFromFavourites = async favouriteItem => {
    setAddToFavIsLoading(true);
    await delteFromFavourites(favouriteItem.uid, user.uid)
      .then(() => {
        setAddToFavIsLoading(false);
        notifyMessage('Removed from My Favorites');
      })
      .catch(error => {
        setAddToFavIsLoading(false);
        notifyMessage(error);
      });
  };

  const renderItem = ({item}) => (
    <Item
      data={item}
      navigation={navigation}
      addToFavouritesAndViceVersa={addToFavouritesAndViceVersa}
      deleteFromFavourites={deleteFromFavourites}
      checkIsFavourite={checkIsFavourite}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{margin: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <EntypoIcon
              name="menu"
              size={30}
              color="#ffffff"
              onPress={() => navigation.openDrawer()}
            />
          </View>
          <View>
            <Ionicons
              name="notifications"
              size={30}
              color="#ffffff"
              onPress={() =>
                navigation.navigate(ROUTES.CUSTOMMER_PROFILE_STACK, {
                  screen: 'notification',
                })
              }
            />
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 10,
          }}>
          <TextField
            Style={styles.inputParent}
            Style_1={[styles.inputStyle]}
            Style_2={[styles.inputIcon]}
            placeholder={'Search'}
            placeholderTextColor="#ACACAC"
            iconname={'search'}
            secure={false}
            size={22}
            keyboard={'email-address'}
          />
        </View>
      </View>
      {isLoading && <Spinner color="primary.white" />}
      {structuredResturantData?.length > 0 ? (
        <FlatList
          style={{
            padding: 15,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          data={structuredResturantData ? structuredResturantData : []}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={loadMoreOlderResturants}
        />
      ) : (
        <View
          style={{
            padding: 15,
            flex: 1,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: 'center',
          }}>
          <Text style={{color: '#132333'}}>No restaurants found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const Item = ({
  navigation,
  data,
  addToFavouritesAndViceVersa,
  checkIsFavourite,
  deleteFromFavourites,
}) => {
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
    <TouchableWithoutFeedback>
      <View>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#E8E8E8',
            borderBottomWidth: 1,
            marginVertical: 10,
          }}>
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
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#000000',
                    flex: 1,
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}>
                  {data?.name || ''}
                </Text>
                {checkIsFavourite(data) ? (
                  <FontAwesome
                    name="heart"
                    size={30}
                    style={{flex: 0.3, textAlign: 'right'}}
                    color="red"
                    onPress={() => deleteFromFavourites(data)}
                  />
                ) : (
                  <FontAwesome
                    name="heart-o"
                    size={30}
                    style={{flex: 0.3, textAlign: 'right'}}
                    color="#000000"
                    onPress={() => addToFavouritesAndViceVersa(data)}
                  />
                )}
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
              {/* {console.log('data', data)} */}
              {checkResturantIsAvailabelOrNot(data?.schduleDetails) ? (
                <Pressable
                  style={{
                    // paddingHorizontal: 40,
                    paddingVertical: 10,
                    borderRadius: 50,
                    backgroundColor: '#132333',
                    maxWidth: 130,
                    width: '100%',
                  }}
                  onPress={() => orderNowHandler(data.uid)}>
                  <Text
                    color="#ffffff"
                    style={{
                      fontSize: 14,
                      fontFamily: 'Lato-Regular',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      textAlign: 'center',
                    }}>
                    Order Now
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132333',
  },
  mainCardView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 6,
  },
  subCardView: {
    height: 80,
    width: 80,

    alignItems: 'center',
    justifyContent: 'center',
  },
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 50,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    paddingLeft: 15,
    color: '#ACACAC',
  },
  inputStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 55,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    color: '#000000',
    ...Platform.select({
      ios: {
        height: 40,
      },
    }),
  },
});

export default Home;
