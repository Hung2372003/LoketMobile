

import notifee, { AndroidImportance } from '@notifee/react-native';
import React, { useEffect, useState } from 'react';
import {StyleSheet, StatusBar, SafeAreaView, Alert, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation, { RootStackParamList } from './src/navigation/AppNavigation';
import 'react-native-url-polyfill/auto';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import messaging from "@react-native-firebase/messaging";
import { FirebasePushService } from './src/services/FirebasePushService';
import storage, { storageEvents } from './src/api/storage';
import tokenService from './src/api/storage';
import { connectToChatHub, disconnectChatHub, joinGroup } from './src/services/signalR.service';

const pushService = new FirebasePushService();
const App: React.FC = () => {
const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | undefined>(undefined);
    async function createMessageChannel() {
      const channelId = await notifee.createChannel({
        id: 'message_channel',
        name: 'Tin nhắn',
        sound: 'default',
        importance: AndroidImportance.HIGH,
      });

      return channelId;
    }
  useEffect(() => {
    (async () => {
      // Foreground
         pushService.onMessage(async (msg) => {
          console.log("Foreground message:", msg);
          // const channelId = await createMessageChannel();

          // // vì server gửi qua data
          // const title = msg.data?.title.toString() || msg.notification?.title || "Thông báo";
          // const body  = msg.data?.body.toString()  || msg.notification?.body  || "";

          // await notifee.displayNotification({
          //   title,
          //   body,
          //   android: {
          //     channelId,
          //     smallIcon: msg.notification?.image, 
          //     sound: "default",
          //     importance: AndroidImportance.HIGH,
          //     pressAction: { id: "default" },
          //   },
          // });
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
  
useEffect(() => {
  let currentToken: string | null = null;

  async function init() {
    currentToken = await tokenService.getAccessToken();
    if (currentToken) {
      setInitialRoute("MainScreen");
      await connectToChatHub();
      const userId = await tokenService.getUserId();
      if (userId) {
        await joinGroup("user_" + userId);
      }
    } else {
      setInitialRoute("HomeRegister");
    }
  }

  storageEvents.on("TOKEN_CHANGED", async (newToken) => {
    if (newToken !== currentToken) {
      currentToken = newToken;

      if (newToken) {
        await disconnectChatHub();
        await connectToChatHub();
        const userId = await tokenService.getUserId();
        if (userId) {
          await joinGroup("user_" + userId);
        }
        setInitialRoute("MainScreen");
      } else {
        await disconnectChatHub();
        setInitialRoute("HomeRegister");
      }
    }
  });

  init();

  return () => {
    storageEvents.off("TOKEN_CHANGED");
  };
}, []);
  return (
    <Provider store={store}>
      <AlertNotificationRoot>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <NavigationContainer>
            <AppNavigation initialRouteName={initialRoute}/>
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

