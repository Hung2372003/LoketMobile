import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

interface MenuItemProps {
  title: string;
  icon: string;
  onPress: () => void;
  isToggle?: boolean;
  isToggled?: boolean;
  isDanger?: boolean;
  showArrow?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
                                             title,
                                             icon,
                                             onPress,
                                             isToggle = false,
                                             isToggled = false,
                                             isDanger = false,
                                             showArrow = true,
                                           }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isToggle}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={[
          styles.title,
          isDanger && styles.dangerText
        ]}>
          {title}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {isToggle ? (
          <Switch
            value={isToggled}
            onValueChange={() => onPress()}
            trackColor={{ false: '#3A3A3C', true: '#FFA500' }}
            thumbColor="#FFFFFF"
          />
        ) : (
          showArrow && (
            <Text style={styles.arrow}>›</Text>
          )
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 50,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    color: '#8E8E93',
  },
  title: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  dangerText: {
    color: '#FF3B30',
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#8E8E93',
    fontWeight: '300',
  },
});

export default MenuItem;