import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuItem from './MenuItem';
import { MenuItemType } from '../../types';

interface MenuSectionProps {
  title?: string;
  items: MenuItemType[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, items }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <View key={item.id}>
            <MenuItem
              title={item.title}
              icon={item.icon}
              onPress={item.onPress}
              isToggle={item.isToggle}
              isToggled={item.isToggled}
              isDanger={item.isDanger}
            />
            {index < items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: '#3A3A3C',
    marginLeft: 60,
  },
});

export default MenuSection;