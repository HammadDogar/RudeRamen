import {Box, Button, Progress} from 'native-base';
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const EarnedRewards = ({navigation}) => {
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
              Earned Rewards
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={
            {
              // paddingHorizontal: 20,
              // backgroundColor: 'red',
            }
          }>
          <View style={{flex: 1}}>
            <View style={{backgroundColor: '#132333', height: 15}}></View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor: '#132333',
                  alignSelf: 'flex-start',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontFamily: 'Lato-Bold',
                    paddingHorizontal: 10,
                  }}>
                  Reward 1
                </Text>
              </View>
            </View>
            <View style={{backgroundColor: '#132333', height: 15}}></View>
          </View>

          <View
            style={{
              flex: 1,
              //   backgroundColor: 'red',
              marginHorizontal: 10,
              marginVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#2CC228',
                padding: 5,
                borderRadius: 5,
                top: 0,
                right: 0,
                maxWidth: 70,
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}>
                Earned
              </Text>
            </View>
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#132333',
                textDecorationLine: 'underline',
              }}>
              RUDEFREEBOWL
            </Text>
            <Button
              style={{
                width: '100%',
                backgroundColor: '#132333',
                borderRadius: 5,
                marginVertical: 10,
                maxWidth: 100,
              }}>
              Copy
            </Button>
          </View>

          <View style={{flex: 1}}>
            <View style={{backgroundColor: '#132333', height: 15}}></View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor: '#132333',
                  alignSelf: 'flex-start',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontFamily: 'Lato-Bold',
                    paddingHorizontal: 10,
                  }}>
                  Reward 1
                </Text>
              </View>
            </View>
            <View style={{backgroundColor: '#132333', height: 15}}></View>
          </View>

          <View
            style={{
              flex: 1,
              //   backgroundColor: 'red',
              marginHorizontal: 10,
              marginVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#AFAFAF',
                padding: 5,
                borderRadius: 5,
                top: 0,
                right: 0,
                maxWidth: 70,
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}>
                Used
              </Text>
            </View>
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#132333',
                textDecorationLine: 'underline',
              }}>
              RUDEFREEBOWL
            </Text>
            <Button
              style={{
                width: '100%',
                backgroundColor: '#132333',
                borderRadius: 5,
                marginVertical: 10,
                maxWidth: 100,
              }}>
              Copy
            </Button>
          </View>

          {/* <Text
            style={{
              color: '#132333',
              textAlign: 'center',
              fontSize: 24,
              fontFamily: 'Lato-Bold',
              marginVertical: 10,
            }}>
            Earn Point
          </Text>
          <Text
            style={{
              color: '#132333',
              textAlign: 'center',
              fontSize: 18,
              fontFamily: 'Lato-Bold',
            }}>
            Invite 5 more friends to get a free bowl
          </Text>
          <View style={{marginVertical: 10}}>
            <Box w="90%" maxW="400">
              <Progress
                bg="#D9D9D9"
                _filledTrack={{
                  bg: '#132333',
                }}
                value={75}
                mx="5"
                size="md"
              />
            </Box>
          </View>
          <View>
            <Text
              style={{
                color: '#132333',
                textAlign: 'center',
                fontSize: 18,
                fontFamily: 'Lato-Bold',
              }}>
              5/10 friends
            </Text>
          </View> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemCardContainer: {},

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default EarnedRewards;
