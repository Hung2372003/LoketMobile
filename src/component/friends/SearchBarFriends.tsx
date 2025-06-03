// src/components/features/friends/SearchBarFriends.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchBarFriendsProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

const SearchBarFriends: React.FC<SearchBarFriendsProps> = ({
  placeholder = "Thêm một người bạn mới",
  onChangeText,
  value,
}) => {
  return (
    <View style={styles.searchSection}>
      <Icon name="search-outline" size={20} color="#8E8E93" style={styles.searchIcon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        style={styles.searchInput}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12, // Hoặc dùng height cố định
  },
});

export default SearchBarFriends;