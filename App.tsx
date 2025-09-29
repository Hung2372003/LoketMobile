// App.tsx
// import React, {useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import CameraComponent from './component/testCameraComponent/CameraTest';
// import MessageScreen from './component/testComponent/ListFriend';

// export default function App() {
//   const [photoUri, setPhotoUri] = useState<string | null>(null);

//   const handlePhotoCaptured = (uri: string) => {
//     setPhotoUri(uri);
//   };

//   return (
//     <SafeAreaView style={styles.fullScreen}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
//       <View style={styles.fullWidth}>
//         <CameraComponent onPhotoCaptured={handlePhotoCaptured} />
//         {photoUri && (
//           <Text style={styles.text}>Ảnh đã chụp: {photoUri}</Text>
//         )}
//       </View>

//       <View style={styles.fullWidth}>
//         <MessageScreen />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   fullScreen: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   fullWidth: {
//     width: '100%',
//     height:'100%',
//     padding: 10,
//   },
//   text: {
//     marginTop: 10,
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });


import React, { useEffect } from 'react';
import {StyleSheet, StatusBar, SafeAreaView, Alert, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import 'react-native-url-polyfill/auto';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import messaging from "@react-native-firebase/messaging";
import { FirebasePushService } from './src/services/FirebasePushService';

const pushService = new FirebasePushService();
const App: React.FC = () => {
  useEffect(() => {
    (async () => {
      const granted = await pushService.requestPermission();
      if (granted) {
        const token = await pushService.getToken();
        console.log("FCM Token:", token);
        if (token) {
          
          await pushService.sendTokenToServer(token);
        }
      }

      // Foreground
      pushService.onMessage((msg) => {
        console.log("Foreground message:", msg);
      });

      // Background click
      pushService.onNotificationOpened((msg) => {
        console.log("Notification opened:", msg);
      });

      // App killed → open from notif
      pushService.getInitialNotification((msg) => {
        console.log("Opened app from killed state:", msg);
      });

      // Refresh token
      pushService.onTokenRefresh(async (newToken) => {
        console.log("Token refreshed:", newToken);
        await pushService.sendTokenToServer(newToken);
      });
    })();
  }, []);
  return (
    <Provider store={store}>
      <AlertNotificationRoot>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </SafeAreaView>
      </AlertNotificationRoot>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;

