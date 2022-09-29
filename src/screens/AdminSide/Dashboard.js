import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ImageBackground} from '../../components';
import {IMAGES} from '../../assets/Images';
import {metrics} from '../../assets/style';
import {AuthenticationContext} from '../../services/AuthServices/authServicecontext';
import {getOrdersByresturantUserId} from '../../services/CloudFunction/ordersManagment';
import {ORDER_STATUS_IDS} from '../../constants';

const Dashboard = ({navigation}) => {
  const {user} = useContext(AuthenticationContext);

  const [orderStates, setOrderStates] = useState([
    {
      id: 3,
      name: 'Total no of Picked up orders',
      count: 0,
      routeTo: 'Picked up',
      routeIsTab: true,
    },
    {
      id: 3,
      name: 'Confirmed Orders',
      count: 0,
      routeTo: 'Confirmed orders',
      routeIsTab: true,
    },
    {
      id: 1,
      name: 'New Orders',
      count: 0,
      routeTo: 'New orders',
      routeIsTab: true,
    },
    {
      id: 4,
      name: 'Payments',
      count: 0,
      routeTo: 'admin-payments',
      routeIsTab: false,
    },
  ]);

  useEffect(() => {
    getOrdersByresturantUserId(user.uid)
      .then(response => {
        let newOrderCount = response.filter(
          orderItem => orderItem.orderStatus === ORDER_STATUS_IDS.NEW_ORDER,
        ).length;
        let confirmOrderCount = response.filter(
          orderItem => orderItem.orderStatus === ORDER_STATUS_IDS.CONFIRM_ORDER,
        ).length;
        let pickedUpOrderCount = response.filter(
          orderItem => orderItem.orderStatus === ORDER_STATUS_IDS.PICKED_UP,
        ).length;

        let updatedStatesArray = [
          {
            id: 3,
            name: 'Total no of Picked up orders',
            count: pickedUpOrderCount,
            routeTo: 'Picked up',
            routeIsTab: true,
          },
          {
            id: 3,
            name: 'Confirmed Orders',
            count: confirmOrderCount,
            routeTo: 'Confirmed orders',
            routeIsTab: true,
          },
          {
            id: 1,
            name: 'New Orders',
            count: newOrderCount,
            routeTo: 'New orders',
            routeIsTab: true,
          },
          {
            id: 4,
            name: 'Payments',
            count: 0,
            routeTo: 'admin-payments',
            routeIsTab: false,
          },
        ];
        setOrderStates(updatedStatesArray);
      })
      .catch(error => {
        // console.log('error', error);
      });
  }, []);

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
          <EntypoIcon
            name="menu"
            size={30}
            color="#ffffff"
            onPress={() => navigation.openDrawer()}
          />

          <Ionicons
            name="notifications"
            size={30}
            color="#ffffff"
            onPress={() => navigation.navigate('notification')}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <View style={{paddingHorizontal: 20}}>
            <View style={{marginVertical: 20}}>
              <Text
                style={{
                  fontSize: 26,
                  marginBottom: 10,
                  color: '#132333',
                }}>
                Good Morning!
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontFamily: 'Lato-Bold',
                  color: '#132333',
                }}>
                Hello, Anthony
              </Text>
            </View>

            <View>
              {orderStates?.map((mapItem, index) => (
                <TouchableWithoutFeedback
                  key={index + 1}
                  onPress={() =>
                    mapItem.routeIsTab === false
                      ? navigation?.navigate('admin-payments')
                      : navigation?.navigate('admin-orders', {
                          screen: `${mapItem.routeTo}`,
                        })
                  }>
                  <View style={{minHeight: 120, marginBottom: 10}}>
                    <ImageBackground
                      source={IMAGES.DASHBOARD_CARD1_BG}
                      style={{
                        borderRadius: 5,
                        overflow: 'hidden',
                        resizeMode: 'cover',
                        flex: 1,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          borderRadius: 5,
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                          justifyContent: 'space-between',
                          backgroundColor: 'rgba(19, 35, 51, 0.44)',
                        }}>
                        <View style={{width: '50%'}}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: 'Lato-Bold',
                              color: '#ffffff',
                            }}>
                            {mapItem.name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 30,
                            color: '#ffffff',
                            fontFamily: 'Lato-Bold',
                          }}>
                          {mapItem.count}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
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
  itemStyle: {
    width: (metrics.deviceWidth - 40 - 30) / 2,
  },
});

export default Dashboard;
