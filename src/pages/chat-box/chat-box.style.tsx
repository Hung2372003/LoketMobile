import { StyleSheet } from 'react-native';

export const ChatBoxStyles = StyleSheet.create({
  chatBoxContainer:{
        backgroundColor:'black',
        height:'100%',
        flex:1,


  },
  header:{
    paddingTop:40,
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
    maxHeight:'60%',
    paddingTop:10,
    paddingBottom:10,

  },
  sendContainer:{
     backgroundColor:'#363636d1',
     borderRadius:26,
     flexDirection:'row',
     alignItems:'flex-end',
  },
  inputContainer:{
    flexGrow:1,
    flexShrink:0,
    flexBasis:0,
  },
  input:{
    width:'100%',
    color:'white',
    paddingTop:17,
    paddingLeft:23,
    paddingBottom:17,
    paddingRight:10,
    fontSize:17,
    fontWeight:500,
    alignItems:'center',
    flexDirection:'row',
    textAlignVertical: 'center',
  },
  sendButton:{
    flexGrow:0,
    flexShrink:0,
    height:45,
    aspectRatio:1 / 1,
    backgroundColor:'#d3d3d36e',
    marginRight:7,
    marginBottom:6,
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center',
  },
  button:{

  },
});

