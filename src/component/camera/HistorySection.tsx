import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface HistorySectionProps {
  onHistoryPress: () => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({ onHistoryPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.historyButton} onPress={onHistoryPress}>
        <Text style={styles.historyText}>Lịch sử</Text>
        <Text style={styles.historyIcon}>⌄</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  historyButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
  },
  historyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  historyIcon: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default HistorySection;