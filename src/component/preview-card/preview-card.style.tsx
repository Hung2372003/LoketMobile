import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { PreviewCardTheme } from './preview-card.theme.interface';


export const PreviewCardStyles = (theme: PreviewCardTheme) => {
  const {
    // backgroundColor = '#fff',
    titleColor = 'white',
    titleSize = 17,
    contentColor = 'black',
    contentApprovedColor = '#898989',
    borderOnlineDotColor = '#ffffff',
    avatarSize = 40,
  } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      padding: 7,
      borderRadius: 10,
    //   backgroundColor: backgroundColor,
      width: '100%',
    } as ViewStyle,
    avatarContainer: {
      height: avatarSize,
      aspectRatio:1 / 1,
      position: 'relative',
    } as ViewStyle,
    avatar: {
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
      flexGrow:1,
      flexShrink:1,
      flexBasis:'auto',
      overflow: 'hidden',
    } as ViewStyle,
    title: {
        overflow:'hidden',
        width:'100%',
    } as ViewStyle,
    titleText:{
      fontSize: titleSize,
      fontWeight: '500',
      color: titleColor,
       overflow:'hidden',

    } as TextStyle,
    content: {
      flexDirection: 'row',
      gap: 3,
      fontSize: titleSize - 5,
      fontWeight: 'bold',
      color: contentColor,
      flexWrap: 'nowrap',
    } as TextStyle,
    approved: {
      color: contentApprovedColor,
      fontWeight: '600',
    } as TextStyle,
      mainContent: {
      flexShrink: 1,
    } as TextStyle,
  });
};
