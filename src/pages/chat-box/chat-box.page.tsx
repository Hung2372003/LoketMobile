
import React, { useState,useEffect } from 'react';
import {Message} from '../../component/message/message.component';
import { TextInput, TouchableOpacity, View ,FlatList} from 'react-native';
import { PreviewCard } from '../../component/preview-card/preview-card.component';
import Feather from '@react-native-vector-icons/feather';
import { ChatBoxStyles } from './chat-box.style';
// import { ImageCard } from '../../component/image-card/image-card.component';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigation';
import ChatService from '../../services/chat.service';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ImageCard } from '../../component/image-card/image-card.component';


type ChatBoxRouteProp = RouteProp<RootStackParamList, 'ChatBox'>;
type ChatBoxNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatBox'>;

interface Message {
  id: number,
  createdBy: number,
  content: string,
  createdTime:string,
  fileCode: number,
  listFile:Array<{
          id: number,
          name: string,
          path: string,
          type: string,
          groupDouble: true
        }>,
}
export const ChatBox:React.FC <{}> = () =>{
  const navigation = useNavigation<ChatBoxNavigationProp>();
  const route = useRoute<ChatBoxRouteProp>();
  const { groupChatId ,groupAvatar,groupName,listUser} = route.params;
  const [message, setMessage] = useState<Array<Message>>([]);

   useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        console.log('Gọi API getChatHistory...');
        const data = await ChatService.createChatBox({groupChatId:groupChatId});
        console.log('Dữ liệu chat:', data);
        setMessage(data);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchChatHistory();
  }, [groupChatId]);


  const typrMessage = (createdBy:number)=>{
    let check:boolean = true;
    if(listUser){
      listUser.forEach(x => {
        // eslint-disable-next-line eqeqeq
        if(x == createdBy){
          check = false;
        }
      });
    }
    return check;
  };

  const styles = ChatBoxStyles;
  const [text, setText] = useState('');

 return (
    <View style={[styles.chatBoxContainer]}>
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={27} color={'white'} />
        </TouchableOpacity>
        <View>
          <PreviewCard
              avatar={groupAvatar}
              title={groupName}
              isRead={true}
          />
        </View>
      </View>
      {/* <ScrollView style={[styles.section]}> */}
        {/* <ImageCard
            image="https://i.imgur.com/2nCt3Sbl.jpg"
            avatar="https://i.imgur.com/2nCt3Sbl.jpg"
            name="Nguyên Văn Ô"
            time="4 ngày"
            content="ahihiih hehehesdjkfgjskfgjehksdg"
        /> */}

         <FlatList
         style={[styles.section]}
          data={message}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              if(item.listFile.length === 0){
                return (
                  <Message
                      avatar={groupAvatar}
                      content={item.content}
                      time={ChatService.formatDateTime(item.createdTime)}
                      sentMessage={typrMessage(item.createdBy)}
                      startMessage={ (item.createdBy !== message[index + 1]?.createdBy || ChatService.setDateMessage(item.createdTime,message[index + 1]?.createdTime) !== false) ? false : true }
                      endMessage={ (item.createdBy !== message[index - 1]?.createdBy || ChatService.setDateMessage(item.createdTime,message[index - 1]?.createdTime) !== false) ? false : true }
                      displayTime={ChatService.setDateMessage(item.createdTime,message[index - 1]?.createdTime) !== false}
                    />
                );
              }
              return (
                <ImageCard
                    image={item.listFile[0].path}
                    avatar={groupAvatar}
                    name={groupName}
                    time={ChatService.setDate(item.createdTime)}
                    content={item.content}
                />
              );
          }}
         />

      {/* </ScrollView> */}
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
              <TouchableOpacity style={[styles.button]}>
                <Feather name="send" size={28} color={'#232323d6'} />
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
 );
};
