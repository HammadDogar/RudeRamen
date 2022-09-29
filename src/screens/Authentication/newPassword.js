import React from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {metrics} from '../../assets/style';
import {TextField} from '../../components';

const NewPassword = ({navigation}) => {
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
          Enter new password
        </Text>
      </View>
      <View style={{marginTop: metrics.baseMargin}}>
        <TextField
          Style={styles.inputParent}
          Style_1={[styles.inputStyle]}
          Style_2={[styles.inputIcon]}
          placeholder={'New password'}
          placeholderTextColor="#A5A5A5"
          //   iconname={'user'}
          secure={false}
          isIcon={false}
          size={22}
          keyboard={'email-address'}
        />
        <TextField
          Style={styles.inputParent}
          Style_1={[styles.inputStyle]}
          Style_2={[styles.inputIcon]}
          placeholder={'Confirm password'}
          placeholderTextColor="#A5A5A5"
          //   iconname={'user'}
          secure={false}
          isIcon={false}
          size={22}
          keyboard={'email-address'}
        />
      </View>

      <Pressable
        style={styles.buttonStyle}
        onPress={() => navigation.navigate('Authentication')}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
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
    borderColor: '#E6E6E6',
    borderBottomWidth: 2,
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

export default NewPassword;
