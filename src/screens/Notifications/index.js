import React from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TextField} from '../../components';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',

    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',

    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    description:
      'Enriched with olives and egg plant with the mixture of soya beans ',
    price: '',
    picture: '',
  },
];

const Item = ({title, subTittle, description, navigation}) => (
  <TouchableWithoutFeedback
    onPress={() => {
      //   this.redirectToChatConverstion(item);
    }}>
    <View>
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: '#E8E8E8',
          borderBottomWidth: 1,
          //   marginVertical: 5,
          paddingVertical: 10,
          paddingHorizontal: 10,

          //   backgroundColor: 'red',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Image
            resizeMode="cover"
            style={{
              height: 60,
              width: 60,
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
          }}>
          <View>
            <Text
              style={{
                color: '#000000',
                fontSize: 13,
              }}>
              {description}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              //   marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                // fontWeight: 'bold',
                // textTransform: 'capitalize',
              }}>
              14 minutes ago
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                // fontWeight: 'bold',
                // textTransform: 'capitalize',
              }}>
              6-30-2022
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
);

const Notification = props => {
  let {navigation} = props;
  const renderItem = ({item}) => (
    <Item
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
              Notifications
            </Text>
          </View>
        </View>
        <FlatList
          // style={{padding: 15}}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    // padding: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    // paddingLeft: 16,
    // paddingRight: 14,
    // marginTop: 6,
    // marginBottom: 6,
    // marginLeft: 16,
    // marginRight: 16,
  },
  subCardView: {
    height: 80,
    width: 80,
    // borderRadius: 25,
    // backgroundColor: '#000000',
    // borderColor: '#000000',
    // borderWidth: 1,
    // borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CFCFCF',
    marginVertical: 5,
    borderRadius: 50,
    borderWidth: 1,
    // borderColor: 'red',
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
  },

  inputIcon: {
    paddingLeft: 15,
    color: '#ACACAC',
  },

  inputStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 55,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 20,
    paddingHorizontal: 10,
  },
});

export default Notification;
