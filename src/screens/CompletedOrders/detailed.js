import React from 'react';
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
import {color} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {IMAGES} from '../../assets/Images';
import {metrics} from '../../assets/style';

const CompletedOrderDetailed = ({navigation}) => {
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
              onPress={() => navigation.navigate('completed-order')}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Lato-Bold',
                color: '#132333',
              }}>
              Order Details
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
              <ItemCard title={itemData?.title} key={index + 1} />
            ))}
          </View>
        </ScrollView>
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
            padding: 10,
            backgroundColor: '#384B5D',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: '#ffffff',
                marginBottom: 5,
                fontFamily: 'Lato-Bold',
                fontSize: 16,
              }}>
              Angel James
            </Text>
            <Text
              style={{
                color: '#ffffff',
                marginBottom: 5,
                fontFamily: 'Lato-Bold',
                fontSize: 14,
              }}>
              Today at 12:33 AM
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'right',
                fontFamily: 'Lato-Bold',
                marginBottom: 5,
                fontSize: 14,
              }}>
              Order id#: 455
            </Text>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'right',
                fontFamily: 'Lato-Bold',
                marginBottom: 5,
                fontSize: 16,
              }}>
              Total: $12.00
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
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
                height: 130,
                width: 130,
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
              <View style={{flexDirection: 'row'}}>
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
                    fontSize: 14,
                    color: '#000000',
                    textAlign: 'right',
                    fontFamily: 'Lato-Bold',
                    textAlign: 'right',
                    textTransform: 'capitalize',
                  }}>
                  $ 100
                </Text>
              </View>
              <View style={{marginTop: 10}}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  Ingredients:
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

              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  Add Ons:
                </Text>

                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#000000',
                    textAlign: 'right',
                    fontFamily: 'Lato-Bold',
                    textAlign: 'right',
                    textTransform: 'capitalize',
                  }}>
                  $ 100
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
            flexDirection: 'row',
            marginVertical: 10,
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
                height: 130,
                width: 130,
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
              <View style={{flexDirection: 'row'}}>
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
                    fontSize: 14,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textAlign: 'right',
                    textTransform: 'capitalize',
                  }}>
                  $ 100
                </Text>
              </View>
              <View style={{marginTop: 10}}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  Ingredients:
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

              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  Add Ons:
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    textAlign: 'right',
                    color: '#000000',
                    fontFamily: 'Lato-Bold',
                    textTransform: 'capitalize',
                  }}>
                  $45.7
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
    // marginBottom: 10,
    // marginHorizontal: 10,

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
  },
  cardHeader: {
    backgroundColor: '#384B5D',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardHeaderText: {
    color: '#ffffff',
    fontFamily: 'Lato-Bold',
  },
});

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Original Ramen',
    subTittle: 'Origami Restaurant',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
    ingredients: [
      {ingredientName: 'Mashrooms'},
      {ingredientName: 'Onions'},
      {ingredientName: 'Cucumber'},
      {ingredientName: 'Tomatos'},
      {ingredientName: 'Olives'},
    ],
  },
];

export default CompletedOrderDetailed;
