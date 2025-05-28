import { StyleSheet } from 'react-native';
export const MessageStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 7,
    marginTop: 2,
    alignItems: 'center',
  },
  space:{
    marginTop:13,
  },
  time: {
    marginVertical: 17,
  },
  messageContainer: {
    flexDirection:'row',
    alignItems: 'flex-end',
    width: '100%',
    gap: 7,
  },
  sent: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    height: 30,
    aspectRatio: 1,
  },

  avatarImage:{
    height:30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7C7C7C',
  },
  main: {
   flex:1,
  },
  nameContainer: {
    padding: 7,
  },
  name: {
    fontSize: 14,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  content: {
    borderRadius: 23,
    paddingVertical: 7,
    paddingHorizontal: 17,
    maxWidth: '75%',
  },
  startSent: {
    borderBottomRightRadius: 7,
  },
  endSent: {
    borderTopRightRadius: 7,
  },
  startReceived: {
    borderBottomLeftRadius: 7,
  },
  endReceived: {
    borderTopLeftRadius: 7,
  },
  actions: {
    flexDirection: 'row',
    opacity: 0.7,
  },
  actionItem: {
    padding: 5,
    borderRadius: 20,
    marginLeft: 4,
  },
  text:{
    lineHeight:20,
    fontSize:17,
     fontFamily: 'Roboto',
     fontWeight:'600',
  },
});

