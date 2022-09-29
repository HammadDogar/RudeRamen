import {StyleSheet} from 'react-native';

export const STYLES = StyleSheet.create({
  containerWithBlueBg: {
    flex: 1,
    backgroundColor: '#132333',
  },
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    // width: Dimensions.get('window').width - 55,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
});
