import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { PreviewCard } from '../../component/preview-card/preview-card.component';
import { PreviewCardTheme } from '../../component/preview-card/preview-card.theme.interface';
import Feather from '@react-native-vector-icons/feather';
interface Message {
  id: string;
  name: string;
  message: string;
  time?: string;
  avatar: string;
}

const messages: Message[] = [
  { id: '1', name: 'Huy Phúc', message: 'Cơ mà phản hồi kiểu này thì nó sàgsjfgjhsdgfjshdfgjshdfgjsdhfgjsdhfgsjhfgyausdtuastuvẫn...', time: '2d', avatar: 'https://picsum.photos/id/1015/300/200' },
  { id: '2', name: 'Chi Chi', message: 'Chưa có câu trả lời nào!', time: '2d',avatar: 'https://picsum.photos/id/1016/300/200' },
  { id: '3', name: 'Thanh Trí', message: 'Chưa có câu trả lời nào!',time: '2d', avatar: 'https://picsum.photos/id/1020/300/200' },
  { id: '4', name: 'Thùy Nguyễn', message: 'Chưa có câu trả lời nào!', time: '2d',avatar: 'https://picsum.photos/id/1024/300/200' },
  { id: '5', name: 'Viet N', message: 'Chưa có câu trả lời nào!',time: '2d', avatar: 'https://picsum.photos/id/1035/300/200' },
  { id: '6', name: 'Vũ Đông', message: 'Chưa có câu trả lời nào!',time: '2d', avatar: 'https://picsum.photos/id/1041/300/200' },
  { id: '7', name: '💖 tnguynn🐳', message: 'Chưa có câu trả lời nào!',time: '2d', avatar: 'https://picsum.photos/id/1050/300/200' },
  { id: '8', name: 'Công Anh', message: 'Chưa có câu trả lời nào!', time: '2d',avatar: 'https://picsum.photos/id/1050/300/200' },
    { id: '9', name: '💖 tnguynn🐳', message: 'Chưa có câu trả lời nào!',time: '2d', avatar: 'https://picsum.photos/id/1050/300/200' },
  { id: '38', name: 'Công Anh', message: 'Chưa có câu trả lời nào!', time: '2d',avatar: 'https://picsum.photos/id/1050/300/200' },
    { id: '37', name: '💖 tnguynn🐳', message: 'Chưa có câu trả lời nào!',time: '2d', avatar: 'https://picsum.photos/id/1050/300/200' },
  { id: '86', name: 'Công Anh', message: 'Chưa có câu trả lời nào!', time: '2d',avatar: 'https://picsum.photos/id/1050/300/200' },
];

export const ChatHistory: React.FC = () => {

  const previewCardTheme: PreviewCardTheme = {
    avatarSize:60,
  };
  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
          <TouchableOpacity>
            <Feather name="arrow-left" size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={[styles.text]}>Tin Nhắn</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
          >
            <PreviewCard
              avatar={item.avatar}
              title={item.name}
              content={item.message}
              isRead={true}
              time={item.time}
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
    flexBasis:0,
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    paddingTop:17,
    paddingBottom:17,
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

