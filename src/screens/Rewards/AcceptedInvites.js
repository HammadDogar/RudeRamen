import {Box, Progress} from 'native-base';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {IMAGES} from '../../assets/Images';

const AcceptedInvites = ({navigation}) => {
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
              Accepted invites
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            // backgroundColor: 'red',
          }}>
          <Image
            source={IMAGES.TROPHY}
            style={{width: '100%', marginVertical: 10}}
            resizeMode="contain"
          />
          <Text
            style={{
              color: '#132333',
              textAlign: 'center',
              fontSize: 24,
              fontFamily: 'Lato-Bold',
              marginVertical: 10,
            }}>
            Earned Points
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
          <View style={{marginVertical: 10, alignItems: 'center'}}>
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
          </View>
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

export default AcceptedInvites;
