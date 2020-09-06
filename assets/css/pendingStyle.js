import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  roundImageLarge: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#adadad',
    borderWidth: 7,
    borderColor: 'white'
  },
  roundContentImageLarge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: 'orange',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textLarge: {
    fontSize: 25,
    color: 'gray',
    marginHorizontal: 25,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center'
  }
});
