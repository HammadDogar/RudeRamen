import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {IMAGES} from '../../assets/Images';
import metrics from '../../assets/style/metrics';
import {TextField} from '../../components';

const Verification = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
        }}>
        <Icon
          style={{position: 'absolute', top: 0, left: 0, zIndex: 1}}
          name="chevron-left"
          size={30}
          color="#000000"
          onPress={() => navigation.navigate('RecoverPassword')}
        />
        <Text
          style={{
            fontSize: 28,
            alignSelf: 'stretch',
            width: '100%',
            textAlign: 'center',
            color: '#474747',
            fontWeight: '600',
            fontFamily: 'Lato-Bold',
          }}>
          Verification
        </Text>
      </View>
      <View
        style={{
          marginVertical: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={IMAGES.OTP_IMAGE} />
      </View>
      <View style={{marginBottom: 10}}>
        <Text
          style={{
            fontSize: 28,
            alignSelf: 'stretch',
            width: '100%',
            textAlign: 'center',
            color: '#474747',
            // fontWeight: '600',
            fontFamily: 'Lato-Regular',
          }}>
          Verification
        </Text>
        <Text
          style={{
            fontSize: 18,
            alignSelf: 'stretch',
            width: '100%',
            textAlign: 'center',
            marginTop: 10,
            color: '#2AC242',
            fontWeight: '600',
            fontFamily: 'Lato-Regular',
          }}>
          The code has been sent on your{' '}
          <Text style={{color: '#2AC242'}}>Email</Text>
        </Text>
      </View>
      <View style={{}}>
        <TextField
          Style={styles.inputParent}
          Style_1={[styles.inputStyle]}
          Style_2={[styles.inputIcon]}
          placeholder={'Enter 4 digit code'}
          placeholderTextColor="#A5A5A5"
          //   iconname={'user'}
          secure={false}
          isIcon={false}
          size={22}
          keyboard={'email'}
        />
      </View>
      <Pressable
        style={styles.buttonStyle}
        onPress={() => navigation.navigate('enter-new-password')}>
        <Text style={styles.buttonText}>Verify</Text>
      </Pressable>
      <Text
        style={{
          textAlign: 'center',
          textAlign: 'left',
          color: '#000000',
        }}>
        Didn’t receieve the verification OTP?{' '}
        <Text style={{color: '#1B81E8'}}>Resend again</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D0D0D0',
    borderWidth: 2,
    borderRadius: 5,
  },

  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
  buttonStyle: {
    backgroundColor: '#132333',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // height: 55,
    borderRadius: 10,
    marginVertical: metrics.baseMargin,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    padding: metrics.basePadding,
  },
});

export default Verification;
