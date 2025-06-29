import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { PreviewCard } from '../../component/preview-card/preview-card.component';
import { PreviewCardTheme } from '../../component/preview-card/preview-card.theme.interface';
import Feather from '@react-native-vector-icons/feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigation';
import { useNavigation } from '@react-navigation/native';
import ChatService from '../../services/chat.service';

type ChatHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatHistory'>;
interface ListUser {
    userCode:number,
    name:string,
    avatar:string,
}
interface Message {
  groupChatId: number;
  groupName: string;
  groupAvatar: string;
  status?: boolean;
  listUser:Array<ListUser>,
  newMessage:{
    id:number,
    content:string,
    createdBy:number,
    createdTime:string,
  }
}

export const ChatHistory: React.FC = () => {

  const navigation = useNavigation<ChatHistoryNavigationProp>();
  const [message, setMessage] = useState<Array<Message>>([]); // bạn nên định nghĩa rõ type cho message nếu có

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        console.log('Gọi API getChatHistory...');
        const data = await ChatService.getChatHistory();
        console.log('Dữ liệu chat:', data);
        setMessage(data);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchChatHistory();
  }, []);

  const goToChat = (groupChatId:number,groupAvatar:string,groupName:string,listUser:Array<ListUser>)=>{
    const newList:Array<number> = [];
    listUser.forEach(x => {
      newList.push(x.userCode);
    });
     navigation.navigate('ChatBox', {
      groupChatId:groupChatId,
      groupAvatar:groupAvatar,
      groupName:groupName,
      listUser:newList,
    });
  };
  const previewCardTheme: PreviewCardTheme = {
    avatarSize:60,
  };
  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={[styles.text]}>Tin Nhắn</Text>
      </View>
      <FlatList
        data={message}
        keyExtractor={item => item.groupChatId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={ () => goToChat(item.groupChatId,item.groupAvatar,item.groupName,item.listUser)}
            style={styles.card}
          >
            <PreviewCard
              avatar={item.groupAvatar}
              title={item.groupName}
              content={item.newMessage.content}
              isRead={item.status}
              time={ChatService.setDate(item.newMessage.createdTime)}
              theme={previewCardTheme}
             />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 10,
  },
  header:{

    flexGrow:0,
    flexShrink:0,
    flexBasis:'auto',
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    paddingTop:47,
    paddingBottom:27,
  },
  card:{
    paddingTop:5,
    paddingBottom:5,
  },
  text:{
    color:'white',
    fontSize:20,
    fontWeight:'500',
  },
});

