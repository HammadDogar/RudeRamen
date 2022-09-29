import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {IMAGES} from '../../assets/Images';
import {TextField} from '../../components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {metrics} from '../../assets/style';
import {Button, Checkbox} from 'native-base';

const MyCart = ({navigation}) => {
  const [showAddonsContainer, setShowAddonsContainer] = useState(false);
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
              onPress={() => navigation.navigate('Profile')}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#132333',
              }}>
              Completed Orders
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            // backgroundColor: 'red',
          }}>
          <View>
            {DATA?.map((itemData, index) => (
              <ItemCard
                navigation={navigation}
                title={itemData?.title}
                key={index + 1}
              />
            ))}
          </View>
        </ScrollView>
        {/* <View flexDirection="row" justifyContent="center" marginVertical={10}>
          <Button
            style={{
              backgroundColor: '#132333',
              width: metrics.deviceWidth * 0.95,
              height: 60,
            }}
            direction="row"
            onPress={() => navigation.navigate('Payment')}
            rightIcon={
              <FeatherIcon
                name="arrow-right"
                style={{textAlign: 'right'}}
                size={30}
                color="#ffffff"
              />
            }>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Lato-Bold',
                color: '#ffffff',
              }}>
              Proceed to Payment
            </Text>
          </Button>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

const ItemCard = ({title, navigation}) => {
  return (
    <TouchableWithoutFeedback>
      <View
        style={{borderColor: '#E8E8E8', borderWidth: 1, marginVertical: 10}}>
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
              source={IMAGES.RUDE_RAMIN_SPLASH_2}
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  {title}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontSize: 20,
                    color: '#000000',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}>
                  $12.34
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  {title}
                </Text>
              </View>
              <FlatList
                contentContainerStyle={{
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
                numColumns={3}
                horizontal={false}
                data={[
                  {key: 'Mashroom'},
                  {key: 'Onion'},
                  {key: 'Cucumber'},
                  {key: 'Tomatos'},
                  {key: 'Olives'},
                ]}
                renderItem={({item}) => (
                  <Text
                    style={{
                      marginVertical: 3,
                      color: '#000000',
                      marginHorizontal: 3,
                      fontSize: 12,
                    }}>
                    {'\u2B24' + ' '}
                    {item.key}
                  </Text>
                )}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <TouchableOpacity
            style={{
              borderColor: '#223040',
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 5,
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('completed-order-details')}>
            <Text
              style={{
                fontSize: 14,
                color: '#223040',
              }}>
              View Details
            </Text>
          </TouchableOpacity>
          <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
              borderRadius: 3,
              backgroundColor: '#AFAFAF',
              maxWidth: 150,
              width: '100%',
            }}>
            <Text
              color="#000000"
              style={{
                fontSize: 16,
                fontFamily: 'Lato-Regular',
                color: '#ffffff',
                // paddingHorizontal: 25,
              }}>
              Picked Up
            </Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  itemCardContainer: {},

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bottomBoxCopy: {
    backgroundColor: '#132333',
    borderRadius: 5,
    height: 60,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  mainCardView: {
    // height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    // shadowColor: Colors.shadow,
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

  shadow: {
    // marginHorizontal: 20,
    // marginVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  totalPriceBox: {
    backgroundColor: '#fff',
    borderRadius: 5,
    // height: 100,
    overflow: 'hidden',
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // paddingVertical: 5,
    // paddingHorizontal: 5,
    borderColor: '#E0E0E0',
    borderWidth: 2,
    // position: 'relative',

    // height: 100,
  },

  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    // backgroundColor: 'red',
    marginVertical: 5,
    borderRadius: 5,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
  },
  inputStyle: {
    flex: 1,
    // width: 200,
    // height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 12,
    paddingHorizontal: 10,
    color: '#000000',
  },
});

export default MyCart;

const ADDONS_DATA = [
  {addOnsName: 'Coke', price: 2.0},
  {addOnsName: 'Beer', price: 2.0},
  {addOnsName: 'Sprite', price: 2.0},
];

const DATA = [
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
