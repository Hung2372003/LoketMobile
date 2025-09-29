import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';

interface CameraControlsProps {
  onTakePhoto: () => void;
  onToggleCamera: () => void;
  onSelectFromAlbum: () => void;
  isLoading: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
                                                         onTakePhoto,
                                                         onToggleCamera,
                                                         onSelectFromAlbum,
                                                         isLoading,
                                                       }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onSelectFromAlbum} style={styles.sideButton}>
        <Feather name="image" size={28} color="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.captureButton}
        onPress={onTakePhoto}
        disabled={isLoading}
      >
        <View style={styles.captureButtonInner}>
          {isLoading && (
            <View style={styles.loadingRing} />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.flipButton} onPress={onToggleCamera}>
        {/*<Text style={styles.flipIcon}>🔄</Text>*/}
        <Feather name="refresh-ccw" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashIcon: {
    fontSize: 24,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  loadingRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFA500',
    borderTopColor: 'transparent',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipIcon: {
    fontSize: 20,
  },
  sideButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraControls;