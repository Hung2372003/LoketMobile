import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { PreviewCardTheme } from './preview-card.theme.interface';


export const PreviewCardStyles = (theme: PreviewCardTheme) => {
  const {
    backgroundColor = '',
    titleColor = 'white',
    titleSize = 17,
    contentColor = 'white',
    contentApprovedColor = '#a5a5a5d6',
    borderOnlineDotColor = '#ffffff',
    avatarSize = 40,
    avartarBorder = '#363636d1',
  } = theme;

  return StyleSheet.create({
    container: {
      flexShrink:1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'flex-start',
      gap: 7,
      padding: 7,
      paddingLeft:10,
      paddingRight:10,
      borderRadius: 10,
      backgroundColor: backgroundColor,
      width:'100%',
    } as ViewStyle,
    avatarContainer: {
      height: avatarSize,
      aspectRatio:1 / 1,
      position: 'relative',
      borderRadius: avatarSize / 2,
    } as ViewStyle,
    avatarBoder:{
      borderWidth:3,
      borderStyle:'solid',
      borderColor:avartarBorder,
    } as ViewStyle,
    avatar: {
      borderWidth:2,
      borderStyle:'solid',
      borderRadius: avatarSize / 2,
      height: '100%',
      aspectRatio:1 / 1,
    } as ViewStyle,
    avatarImage:{
        height:'100%',
        aspectRatio:1 / 1,
        borderRadius: avatarSize / 2,
    } as ImageStyle,
    onlineDot: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#009f00',
      borderWidth: 3,
      borderColor: borderOnlineDotColor,
      bottom: 0,
      right: '-7%',
    } as ViewStyle,
    contentContainer: {
      overflow: 'hidden',
      flexDirection:'column',
      flexGrow:1,
      flexShrink:1,
      flexBasis:'auto',
      gap:3,
    } as ViewStyle,
    title: {
        overflow:'hidden',
        flexDirection:'row',
        alignItems:'center',
        gap:7,
    } as ViewStyle,
    titleText:{
      fontSize: titleSize,
      fontWeight: '500',
      color: titleColor,
      overflow:'hidden',
      flexWrap: 'nowrap',
      flexGrow:1,
      flexShrink:1,
      flexBasis:'auto',
    } as TextStyle,
    content: {
      flexDirection: 'row',
      gap: 3,
      alignItems:'center',
    } as ViewStyle,
    approved: {
      color: contentApprovedColor,
      fontWeight: '600',
    } as TextStyle,
    mainContent: {
      flexShrink: 1,
      fontSize: titleSize - 3,
      fontWeight: 'bold',
      color: contentColor,
      flexWrap: 'nowrap',
    } as TextStyle,
    time:{
      flexGrow:0,
      flexShrink:0,
      flexBasis:'auto',
      color: contentColor,
      fontSize: titleSize,
      fontWeight: 'bold',

    } as TextStyle,
    timeContainer:{
      justifyContent:'flex-end',
    } as ViewStyle,
  });
};
