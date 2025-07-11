import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {NativeStackNavigationProp} from 'react-native-screens/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigation.tsx';
import {useNavigation} from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';

interface HistorySectionProps {
  onHistoryPress: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FeedScreen'>;

const HistorySection: React.FC<HistorySectionProps> = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleHistoryPress = () => {
    navigation.navigate('FeedScreen');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.historyButton} onPress={handleHistoryPress}>
        <Text style={styles.historyText}>Lịch sử</Text>
        {/*<Text style={styles.historyIcon}>⌄</Text>*/}
        icon: <Feather name="chevron-down" size={22} color={'#FFF'}/>,
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
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
  },
  historyIcon: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default HistorySection;