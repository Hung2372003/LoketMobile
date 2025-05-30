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
  avartarBoder?:boolean;
  theme?: PreviewCardTheme;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  avatar,
  avartarBoder,
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
        <View style={[styles.avatarContainer,avartarBoder && styles.avatarBoder]}>
            <View style={styles.avatar}>
                 <Image source={{ uri: avatar }} style={styles.avatarImage} />
                 {isOnline && <View style={styles.onlineDot} />}
            </View>
        </View>
      )}

      {title &&  (
          <View style={styles.contentContainer}>
              <View style={styles.title}>
                  <Text numberOfLines={1}  ellipsizeMode="tail" style={styles.titleText}>{title}</Text>
                  {time && (
                    <View style={[styles.timeContainer]}>
                        <Text style={[styles.time, isRead && styles.approved]}>{time}</Text>
                    </View>
                    )}
              </View>
              {content && (
                <View style={[styles.content]}>
                  <Text style={[styles.mainContent, isRead && styles.approved]} numberOfLines={1}>{content}</Text>
                </View>
              )}
          </View>
        )}
    </View>
  );
};
