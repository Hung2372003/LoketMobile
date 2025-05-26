export interface MenuItemType {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  isToggle?: boolean;
  isToggled?: boolean;
  isDanger?: boolean;
}

export interface MenuSectionType {
  title: string;
  items: MenuItemType[];
}