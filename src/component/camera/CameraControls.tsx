import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

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
        <Text style={styles.flashIcon}>
          {flashMode === 'on' ? '⚡' : flashMode === 'off' ? 'on' : 'off'}
        </Text>
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
        <Text style={styles.flipIcon}>🔄</Text>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
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