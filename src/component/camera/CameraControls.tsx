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
  onToggleFlash: () => void;
  onToggleCamera: () => void;
  flashMode: 'on' | 'off' | 'auto';
  isLoading: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
                                                         onTakePhoto,
                                                         onToggleFlash,
                                                         onToggleCamera,
                                                         flashMode,
                                                         isLoading,
                                                       }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.flashButton} onPress={onToggleFlash}>
        {flashMode === 'on' && (
          <Feather name="zap" size={24} color="#FFD700" style={styles.flashIcon} />
        )}
        {flashMode === 'off' && (
          <Feather name="youtube" size={24} color="#FFF" style={styles.flashIcon} />
        )}
        {flashMode === 'auto' && (
          <Feather name="zap" size={24} color="#AAA" style={styles.flashIcon} />
        )}
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
});

export default CameraControls;