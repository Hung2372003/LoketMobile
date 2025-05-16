import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

interface Message {
  id: string;
  name: string;
  message: string;
  time?: string;
  avatar: string;
}

const messages: Message[] = [
  { id: '1', name: 'Huy Phúc', message: 'Cơ mà phản hồi kiểu này thì nó vẫn...', time: '2d', avatar: 'https://picsum.photos/id/1015/300/200' },
  { id: '2', name: 'Chi Chi', message: 'Chưa có câu trả lời nào!', avatar: 'https://picsum.photos/id/1016/300/200' },
  { id: '3', name: 'Thanh Trí', message: 'Chưa có câu trả lời nào!', avatar: 'https://picsum.photos/id/1020/300/200' },
  { id: '4', name: 'Thùy Nguyễn', message: 'Chưa có câu trả lời nào!', avatar: 'https://picsum.photos/id/1024/300/200' },
  { id: '5', name: 'Viet N', message: 'Chưa có câu trả lời nào!', avatar: 'https://picsum.photos/id/1035/300/200' },
  { id: '6', name: 'Vũ Đông', message: 'Chưa có câu trả lời nào!', avatar: 'https://picsum.photos/id/1041/300/200' },
  { id: '7', name: '💖 tnguynn🐳', message: 'Chưa có câu trả lời nào!', avatar: 'https://picsum.photos/id/1050/300/200' },
  { id: '8', name: 'Công Anh', message: 'Chưa có câu trả lời nào!', avatar: 'https://picsum.photos/id/1050/300/200' },
];

const MessageScreen: React.FC = () => {
  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      {item.time ? <Text style={styles.time}>{item.time}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    color: '#AAA',
    fontSize: 14,
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
});

export default MessageScreen;