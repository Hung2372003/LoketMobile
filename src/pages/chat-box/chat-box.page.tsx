import React, { useState, useEffect, useRef} from 'react';
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ChatBoxStyles } from './chat-box.style';
import { Message } from '../../component/message/message.component';
import { PreviewCard } from '../../component/preview-card/preview-card.component';
import { ImageCard } from '../../component/image-card/image-card.component';
import ChatService from '../../services/chat.service';
import {
  connectToChatHub,
  joinGroup,
  onReceiveMessage,
  offReceiveMessage,
} from '../../services/signalR.service';
import { RootStackParamList } from '../../navigation/AppNavigation';
import { chatManagementApi, ReqestChatBox } from '../../api/endpoint.api';

type ChatBoxRouteProp = RouteProp<RootStackParamList, 'ChatBox'>;
type ChatBoxNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatBox'>;

interface MessageType {
  id: number;
  createdBy: number;
  content: string;
  createdTime: string;
  fileCode?: number;
  listFile?: any[];
}

export const ChatBox: React.FC = () => {
  const navigation = useNavigation<ChatBoxNavigationProp>();
  const route = useRoute<ChatBoxRouteProp>();
  const {userCode, groupChatId, groupAvatar, groupName, listUser } = route.params;

  const [groupChatIdMain,setGroupChatIdMain] = useState<number>();
  const [message, setMessage] = useState<Array<MessageType>>([]);
  const [text, setText] = useState('');
const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    // Khi nhận route -> set lại groupChatIdMain
    if (groupChatId != null && groupChatId !== undefined) {
      setGroupChatIdMain(groupChatId);
    }
  }, [groupChatId]);
  useEffect( () => {
  if (groupChatIdMain == null && userCode == null) {return;}
    const fetchChatHistory = async () => {
      try {

          let dataRequest:ReqestChatBox = {};
          if(userCode){
            dataRequest.userCode = userCode;
          }
          if(groupChatIdMain){
            dataRequest.groupChatId = groupChatIdMain;
          }
          console.log(dataRequest);
          const data = await chatManagementApi.createChatBox(dataRequest);
          // await chatManagementApi.setStatusMess(data.preventiveObject.groupChatId);
          console.log(dataRequest);
          console.log(data);
          const newGroupId = data?.preventiveObject?.groupChatId;
          if (newGroupId != null && newGroupId != '') {
            setGroupChatIdMain(newGroupId);
          }

          // Nếu có object chứa tin nhắn, thì set lại
          if (Array.isArray(data?.object) && data.object.length > 0) {
            setMessage(data.object);
          }
        } catch (error) {
        console.error('Lỗi khi lấy lịch sử chat:', error);
      }
    };
    fetchChatHistory();
    const handler = (_groupChatId: string, content: string, _userCode: string, listFile: any[]) => {
      _groupChatId.replace(/groupChat_/gi, '');
      const safeListFile = Array.isArray(listFile) ? listFile : [];
      const messIdString = safeListFile[0]?.messId ?? Date.now().toString();
      const addMessage: MessageType = {
        id: parseInt(messIdString,10) || Date.now(),
        content,
        createdTime: new Date(Date.now() - 7 * 60 * 60 * 1000).toString(),
        createdBy: parseInt(_userCode, 10),
        listFile: safeListFile,
      };

      setMessage(prev => [...prev, addMessage]);
    };

    const setup = async () => {
      await connectToChatHub();
      await joinGroup('groupChat_' + groupChatIdMain!.toString());
      onReceiveMessage(handler);
    };

    setup();
    return () => {
      offReceiveMessage(handler);
    };
  }, [groupChatId, groupChatIdMain, userCode,route.params]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [message]);

  const typrMessage = (createdBy: number) => {
     return !listUser?.includes(createdBy);
  };

  const submit = async () => {
    if(text == null || text === ''){
      return;
    }
    try {
      const submittedValue = text;
      setText('');
      console.log(groupChatIdMain,submittedValue);
     await ChatService.updateMessage({ groupChatId: groupChatIdMain!, content: submittedValue });

    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };

  const styles = ChatBoxStyles;

  return (
    <View style={[styles.chatBoxContainer]}>
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={27} color={'white'} />
        </TouchableOpacity>
        <View>
          <PreviewCard avatar={groupAvatar} title={groupName} isRead={true} />
        </View>
      </View>

      <FlatList
       ref={flatListRef}
        style={[styles.section]}
        data={message}
        keyExtractor={(item,index) => index.toString()}
        renderItem={({ item, index }) => {
          const prev = message[index - 1];
          const next = message[index + 1];
          const isStart = item.createdBy !== next?.createdBy || ChatService.setDateMessage(item.createdTime, next?.createdTime) !== false;
          const isEnd = item.createdBy !== prev?.createdBy || ChatService.setDateMessage(item.createdTime, prev?.createdTime) !== false;
          const displayTime = ChatService.setDateMessage(item.createdTime, prev?.createdTime) !== false;

          if (!item.listFile || item.listFile.length === 0) {
            return (
              <Message
                avatar={groupAvatar}
                content={item.content}
                time={ChatService.formatDateTime(item.createdTime)}
                sentMessage={typrMessage(item.createdBy)}
                startMessage={!isStart}
                endMessage={!isEnd}
                displayTime={displayTime}
              />
            );
          }

          return (
            <ImageCard
              image={item.listFile[0]?.path}
              avatar={groupAvatar}
              name={groupName}
              time={ChatService.formatDateTime(item.createdTime)}
              content={item.content}
            />
          );
        }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}

      />

      <View style={[styles.footer]}>
        <View style={[styles.sendContainer]}>
          <View style={[styles.inputContainer]}>
            <TextInput
              style={[styles.input]}
              placeholder="Gửi tin nhắn..."
              placeholderTextColor="#ccc"
              value={text}
              onChangeText={setText}
              multiline={true}
              textAlignVertical="top"
              blurOnSubmit={false}
              returnKeyType="default"
            />
          </View>
          <View style={[styles.sendButton]}>
            <TouchableOpacity style={[styles.button]} onPress={submit}>
              <Feather name="send" size={28} color={'#232323d6'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
