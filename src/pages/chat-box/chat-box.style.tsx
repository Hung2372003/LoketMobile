import { StyleSheet } from 'react-native';

export const ChatBoxStyles = StyleSheet.create({
  chatBoxContainer:{
        backgroundColor:'black',
        height:'100%',
        flex:1,

  },
  header:{
    paddingLeft:10,
    paddingRight:10,
    flexGrow:0,
    flexShrink:0,
    flexBasis:'auto',
    flexDirection:'row',
    alignItems:'center',
    gap:5,

  },
  section:{
    flexGrow:1,
    flexShrink:1,
    flexBasis:'auto',
  },
  footer:{
    flexGrow:0,
    flexShrink:0,
    flexBasis:'auto',
    borderRadius:23,
    marginLeft:13,
    marginRight:13,
    minHeight:50,
    maxHeight:'70%',
    paddingTop:10,
    paddingBottom:10,

  },
  input:{
    backgroundColor:'#363636d1',
    width:'100%',
    color:'white',
    borderRadius:26,
    paddingTop:17,
    paddingLeft:23,
    paddingBottom:17,
    paddingRight:23,
    fontSize:17,
    fontWeight:500,
    alignItems:'center',
    flexDirection:'row',
    textAlignVertical: 'center',
  },
});

