// src/components/features/friends/FriendItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

interface FriendItemProps {
  id: string;
  avatar: string;
  name: string;
  onRemove?: (id: string) => void; // `onRemove` là tùy chọn
  children?: React.ReactNode;
}

const FriendItem: React.FC<FriendItemProps> = ({ id, avatar, name, onRemove, children }) => {
  return (
    <View style={styles.friendItem}>
      <Image source={{uri: avatar}} style={styles.friendAvatar} />
      <Text style={styles.friendName}>{name}</Text>
      {children ? (
        <View style={styles.actionsContainer}>
            {children}
        </View>
      ) : (
        // Nếu không, hãy render nút "Xóa" mặc định (chỉ khi có hàm onRemove)
        onRemove && (
          <TouchableOpacity onPress={() => onRemove(id)} style={styles.removeButton}>
            <Feather name="x" size={24} color="#A0A0A0" />
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    // backgroundColor: '#2C2C2E', // Cân nhắc bỏ nền nếu list có nền chung
    // borderRadius: 8,
    marginBottom: 10,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#4A4A4A',
  },
  friendName: {
    flex: 1,
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FriendItem;