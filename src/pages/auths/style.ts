import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    color: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    color: '#fff',
    flex: 3,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regis: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_register :{
    backgroundColor: '#ffb700',
    padding: 12,
    borderRadius: 30,
    marginBottom: 5,
  },
  button_login :{
    padding: 12,
    borderRadius: 30,
  },
  general: {
    width: '48%',
    marginVertical: 60,
    flex: 1,
    transform: [{ rotate: '8deg' }], // xoay khối đứng nghiêng
    borderRadius: 35,
    borderWidth: 9,
    borderColor: '#817d7c',
  },
  general_top: {
    flex: 2,
    borderRadius: 15,
    backgroundColor: '#5b5253',
    margin: 15,
  },
  genera_central: {
    flex: 7,
    borderRadius: 15,
    marginHorizontal: 15,
    gap:8,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  general_bot: {
    // flex: 1,
    backgroundColor: '#3e3c3d',
    borderRadius: 12,
    margin: 10,
    marginHorizontal: 11,
    padding: 17,
  },
  block: {
    width: '20%',
    height: 25,
    backgroundColor: '#5b5555',
    borderRadius: 7,
  },
  title: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 15,
    borderRadius: 8,
  },
});

export default styles;
