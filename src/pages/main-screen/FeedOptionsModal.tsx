import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

type FeedOptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  onMenuAction: (action: string) => void;
  fadeAnim: Animated.Value;
};

const FeedOptionsModal = ({
                            visible,
                            onClose,
                            onMenuAction,
                            fadeAnim
                          }: FeedOptionsModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.popupContainer,
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              }
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onMenuAction('share')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuText}>Chia sẻ</Text>
            </TouchableOpacity>

            <View style={styles.menuSeparator} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onMenuAction('download')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuText}>Tải về</Text>
            </TouchableOpacity>

            <View style={styles.menuSeparator} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onMenuAction('delete')}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuText, styles.deleteText]}>Xóa</Text>
            </TouchableOpacity>

            <View style={styles.menuSeparator} />

            <View style={styles.menuSeparatorLarge} />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  popupContainer: {
    backgroundColor: '#2C2C2C',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 50,
    overflow: 'hidden',
    width: width - 40,
  },

  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  menuText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
  },

  deleteText: {
    color: '#FF6B6B',
  },

  menuSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },

  menuSeparatorLarge: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  cancelButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
  },

  cancelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FeedOptionsModal;