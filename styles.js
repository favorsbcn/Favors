import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bgLightGray: {
    backgroundColor: '#FAFAFA'
  },
  green: {
    color: '#00CBA8'
  },
  post: {
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 0.5,
    borderTopColor: '#E6E6E6',
  },
  postDescription: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 4
  },
  skillsTitle: {
    fontSize: 12,
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  start: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  end: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  space: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spaceAround: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row'
  },
  maxWidth: {
    width: width,
  },
  postWidth: {
    width: (width - 127)
  },
  conversationWidth: {
    width: (width - 87)
  },
  column: {
    flexDirection: 'column'
  },
  bold: {
    fontWeight: '700',
  },
  semibold: {
    fontWeight: '600',
  },
  light: {
    fontWeight: '400',
  },
  uppercase: {
    textTransform: 'uppercase'
  },
  white: {
    color: '#fff',
  },
  gray: {
    color: '#9B9B9B',
  },
  lightGray: {
    color: '#F2F2F2',
  },
  darkGray: {
    color: '#151515',
  },
  small: {
    fontSize: 11,
  },
  input: {
    width: width - 24,
    height: 40,
    marginTop: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 50,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  inputBox: {
    backgroundColor: '#F2F2F2',
    borderColor: '#F2F2F2',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    minHeight: 140,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  facebookButton: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 24,
    width: width - 36,
    flexDirection: 'row'
  },
  facebookButtonText: {
    color: '#151515',
    fontSize: 18,
    fontWeight: '500',
  },
  filterButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    zIndex: 1,
  },
  primaryButton: {
    zIndex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#00CBA8',
    borderRadius: 24,
    marginTop: 4,
    marginBottom: 18,
    paddingHorizontal: 24, // to ensure the text is never behind the icon
    backgroundColor: '#00CBA8',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  terciaryButton: {
    borderColor: '#00CBA8',
    borderWidth: 1.5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  fourthButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
  },
  termsText: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  conditionsText: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textDecorationLine: 'underline'
  },
  postButton: {
    // marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 18,
    alignItems: 'center',
    backgroundColor: '#00CBA8',
    borderColor: '#00CBA8',
    borderWidth: 1,
    borderRadius: 18,
  },
  border: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    textAlign: 'center'
  },
  postPhoto: {
    height: width,
    width: width,
  },
  postPhotoInsideInput: {
    borderRadius: 12,
    marginTop: 12,
    height: ((width - 115) / 16) * 9,
    width: width - 115,
  },
  postPhotoInside: {
    borderRadius: 12,
    marginTop: 12,
    height: ((width - 85) / 16) * 9,
    width: width - 85,
  },
  postContent: {
    width: (width - 85),
  },
  roundImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 12,
    backgroundColor: '#adadad'
  },
  roundSmallImage: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 12,
    backgroundColor: '#adadad'
  },
  squareImage: {
    width: 44,
    height: 44,
    backgroundColor: '#adadad'
  },
  roundBigImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    margin: 10,
    backgroundColor: '#adadad'
  },
  squareLarge: {
    width: width * .33,
    height: 125,
    margin: 1,
    backgroundColor: '#d3d3d3'
  },
  cameraButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginBottom: 40
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    width: 200
  },
  buttonSmall: {
    margin: 10,
    marginBottom: 0,
    padding: 5,
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    width: 125
  },
  buttonBig: {
    margin: 5,
    padding: 10,
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 20,
    width: (width - 40)
  },
  buttonBigPremium: {
    margin: 5,
    padding: 10,
    alignItems: 'center',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 20,
    width: (width - 40),
    backgroundColor: '#00CBA8'
  },
  myRangeWrap: {
    width: 350
  },
  sliderLabels: {
    fontSize: 25,
    fontWeight: '500',
    marginBottom: 8
  },
  backgroundSlider: {
    width: '100%'
  },
  // pickerSelectStyles: {
  //   margin: 10,
  // }
  slideStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width
  },
  titleStyle: {
    marginVertical: 12,
    textAlign: 'center',
    fontSize: 36,
    color: 'white'
  },
  textStyle: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
    color: 'white'
  },
  chatBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 12,
    maxWidth: width * 0.7,
  },
  photoMessage: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 12,
    height: ((width * 0.7) / 16) * 9,
    width: (width * 0.7) - 8,
  },
  bgLightGray: {
    backgroundColor: '#E6E6E6'
  },
  bgWhite: {
    backgroundColor: '#FFFFFF'
  },
  message: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#151515',
  },
  dateMessage: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
    color: '#9B9B9B',
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 32,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
