import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import { PreviewCard } from '../preview-card/preview-card.component';
import { PreviewCardTheme } from '../preview-card/preview-card.theme.interface';


interface ImageCardProps {
    avatar?:string,
    name?:string
    image?:string,
    content?:string,
    title?:string,
    time?:string
}

export const ImageCard: React.FC<ImageCardProps> = ({
    avatar,
    name,
    time,
    image,
    content,
}) => {
    const theme : PreviewCardTheme = {
        avartarBorder:'#000000a1',
        avatarSize:30,
        backgroundColor:'#000000a1',
    };
  return (
    <View  style={styles.imageComtainer}>
        <ImageBackground
            style={[styles.image]}
            source={{uri:image}}
            resizeMode="cover"
        >
            {avatar && (
                <View style={styles.titleContainer} >
                    <View style={[styles.title]}>
                        <PreviewCard
                            avatar={avatar}
                            title={name}
                            time={time}
                            isRead={true}
                            theme={theme}
                            avartarBoder={false}
                        />
                    </View>
                </View>
            )}

            {content && (
                <View style={styles.contentContainer}>
                    <Text  numberOfLines={1} style={styles.content}>{content}</Text>
               </View>
             )}
        </ImageBackground>
    </View>

  );
};
const styles = StyleSheet.create({
    imageComtainer:{
        width:'100%',
        aspectRatio:1 / 1,
        padding:7,
    },
    image:{
        width:'100%',
        aspectRatio:1 / 1,
        borderRadius:40,
        overflow:'hidden',
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'flex-end',
    },
    titleContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'flex-start',
        padding:17,
    },
    title:{
       overflow:'hidden',
       flexGrow:0,
       borderRadius:70,
       maxWidth:'80%',
    },
    contentContainer:{
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        padding:10,
    },
    content:{
        maxWidth:'80%',
        borderRadius:30,
        overflow:'hidden',
        color:'white',
        backgroundColor:'#000000a1',
        paddingLeft:17,
        paddingRight:17,
        paddingBottom:10,
        paddingTop:10,
        fontWeight:'bold',
    },

});
