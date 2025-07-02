import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { PreviewCard } from '../../component/preview-card/preview-card.component';
import { PreviewCardTheme } from '../../component/preview-card/preview-card.theme.interface';
import Feather from '@react-native-vector-icons/feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigation';
import { useNavigation } from '@react-navigation/native';
import ChatService from '../../services/chat.service';
import { chatManagementApi, ListFriend, MessageReponse } from '../../api/endpoint.api';

type ChatHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatHistory'>;
interface ListUser {
    userCode:number,
    name:string,
    avatar:string,
}

export const ChatHistory: React.FC = () => {

  const navigation = useNavigation<ChatHistoryNavigationProp>();
  const [message, setMessage] = useState<Array<MessageReponse>>([]); // bạn nên định nghĩa rõ type cho message nếu có
  const [friendNoMess, setFriendNoMess] = useState<Array<ListFriend>>([]);
  useEffect(() => {

    const fetchChatHistory = async () => {
      try {
        const data = await chatManagementApi.newMessageAllGroup();
        setMessage(data.object ?? []);
       const objectList = Array.isArray(data.object) ? data.object : [];

      // Lấy tất cả userCode từ listUser trong từng group (nếu có)
      const userCodesInMessageGroups = new Set(
        objectList.flatMap(group =>
          Array.isArray(group.listUser)
            ? group.listUser.map(user => user.userCode)
            : []
        )
      );

        const data2 : Array<ListFriend> = await chatManagementApi.getListFriend();

       const filteredFriends = data2.filter(friend => !userCodesInMessageGroups.has(friend.userCode));

        setFriendNoMess(filteredFriends);

      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchChatHistory();
  }, []);

  const startNewChat = (friend: ListFriend) => {
    goToChat(friend.userCode,undefined ,friend.path, friend.name,undefined);
  };

  const goToChat = (userCode?:number, groupChatId?:number,groupAvatar?:string,groupName?:string,listUser?:Array<ListUser>)=>{
    const newList:Array<number> = [];
    if(listUser){
      listUser.forEach(x => {
        newList.push(x.userCode);
      });
    }else{
      newList.push(userCode!);
    }
     navigation.navigate('ChatBox', {
      userCode:userCode,
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
        data={[...message, ...friendNoMess]}
        keyExtractor={(item, index) => {
          return 'groupChatId' in item
            ? `msg-${item.groupChatId}`
            : `friend-${item.userCode ?? index}`;
        }}
        renderItem={({ item }) => {
          const isMessage = 'groupChatId' in item;

          const avatar = isMessage ? item.groupAvatar : item.path;
          const title = isMessage ? item.groupName : item.name;
          const content = isMessage ? item.newMessage?.content : 'Hãy bắt đầu trò chuyện';
          const isRead = isMessage ? item.status : true;
          const time = isMessage ? ChatService.setDate(item.newMessage.createdTime) : undefined;

          return (
            <TouchableOpacity
              onPress={() =>
                isMessage
                  ? goToChat(undefined,item.groupChatId, item.groupAvatar, item.groupName, item.listUser)
                  : startNewChat(item)
              }
              style={styles.card}
            >
              <PreviewCard
                avatar={avatar}
                title={title}
                content={content}
                isRead={isRead}
                time={time}
                theme={previewCardTheme}
              />
            </TouchableOpacity>
          );
        }}
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

