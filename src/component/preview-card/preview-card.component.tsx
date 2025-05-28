import React from 'react';
import {View, Text, Image} from 'react-native';
import { PreviewCardTheme } from './preview-card.theme.interface';
import { PreviewCardStyles } from './preview-card.style';


interface PreviewCardProps {
  avatar?: string;
  title?: string;
  content?: string;
  time?: string;
  isOnline?: boolean;
  isRead?: boolean;
  notifi?: boolean;
  theme?: PreviewCardTheme;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  avatar,
  title,
  content,
  time,
  isOnline,
  isRead,
  theme = {},
}) => {
  const styles = PreviewCardStyles(theme);

  return (
    <View style={styles.container}>
      {avatar && (
        <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
                 <Image source={{ uri: avatar }} style={styles.avatarImage} />
                 {isOnline && <View style={styles.onlineDot} />}
            </View>
        </View>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.title}>
             <Text numberOfLines={1}  ellipsizeMode="tail" style={styles.titleText}>{title}</Text>
        </View>
        {content && (
          <View style={[styles.content, isRead && styles.approved]}>
            <Text style={styles.mainContent} numberOfLines={1}>{content}</Text>
            <Text>·</Text>
            <Text>{time}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
