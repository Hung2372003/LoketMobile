import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { MessageStyles } from './message.style';
interface MessageProps {
  avatar?: string;
  name?: string;
  content?: string;
  time?: string;
  sentMessage?: boolean;
  startMessage?: boolean;
  endMessage?: boolean;
  displayTime?: boolean;
  displayAction?:boolean;
  theme?: {
    messageSentBackgroundColor?: string;
    messageReceivedBackgroundColor?: string;
    messageSentColor?: string;
    messageReceivedColor?: string;
    hoverIcon?: string;
    colorIcon?: string;
  };
}

export const Message: React.FC<MessageProps> = ({
  avatar,
  name,
  content,
  time,
  sentMessage,
  startMessage,
  endMessage,
  displayTime,
  displayAction,
  theme,
  }) => {
  const styles = MessageStyles;
  const appliedTheme = theme ?? {
    messageSentBackgroundColor: '#e3e3e3d6',
    messageReceivedBackgroundColor: '#363636d1',
    messageSentColor: 'black',
    messageReceivedColor: 'white',
    hoverIcon: 'rgba(227, 227, 227, 0.7)',
    colorIcon: '#898989',
  };
  const containerStyle = [
    styles.messageContainer,
    sentMessage && styles.sent,
  ];
  const space = [
     ((!startMessage && !endMessage ) || (startMessage && !endMessage)) && styles.space,
  ];
  const avatarShouldDisplay = (endMessage && !startMessage) || (!endMessage && !startMessage);

  return (
    <View style={[
      styles.wrapper,
      space,
      ]}>
      {displayTime && <Text style={styles.time}>{time}</Text>}

      <View style={containerStyle}>
        {!sentMessage && <View style={styles.avatar}>
          {avatarShouldDisplay && !sentMessage && (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          )}
        </View>}
        <View style={styles.main}>
          {name && (
            <View style={[styles.nameContainer, sentMessage && styles.sent]}>
              <Text style={[styles.name, { color: appliedTheme.colorIcon }]}>
                {name}
              </Text>
            </View>
          )}
          <View style={[styles.mainContent, sentMessage && styles.sent]}>
            <View
              style={[
                styles.content,
                {
                  backgroundColor: sentMessage
                    ? appliedTheme.messageSentBackgroundColor
                    : appliedTheme.messageReceivedBackgroundColor,
                },
                startMessage && (sentMessage ? styles.startSent : styles.startReceived),
                endMessage && (sentMessage ? styles.endSent : styles.endReceived),
              ]}
            >
              <Text
                style={[
                  styles.text,
                  {
                  color: sentMessage
                    ? appliedTheme.messageSentColor
                    : appliedTheme.messageReceivedColor,
                }]}
              >
                {content?.replace(/\\n/g, '\n')}
              </Text>
            </View>
            {displayAction && <View style={styles.actions}>
              <TouchableOpacity style={styles.actionItem}>
                <FontAwesome5 name="smile" size={16} color={appliedTheme.colorIcon} iconStyle="solid" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                <FontAwesome5 name="share" size={16} color={appliedTheme.colorIcon} iconStyle="solid" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                <FontAwesome5 name="ellipsis-v" size={16} color={appliedTheme.colorIcon} iconStyle="solid"/>
              </TouchableOpacity>
            </View>}
          </View>
        </View>
      </View>
    </View>
  );
};

