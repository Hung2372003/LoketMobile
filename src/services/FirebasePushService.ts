import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import axios from "axios";
import { FirebaseManagermentApi } from "../api/endpoint.api";


export interface IFirebasePushService {
  requestPermission(): Promise<boolean>;
  getToken(): Promise<string | null>;
  onMessage(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void): void;
  onNotificationOpened(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void): void;
  getInitialNotification(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void): Promise<void>;
  onTokenRefresh(callback: (token: string) => void): void;
  sendTokenToServer(token: string): Promise<void>;
}

export class FirebasePushService implements IFirebasePushService {
  /** Yêu cầu quyền thông báo */
  async requestPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  /** Lấy token FCM */
  async getToken(): Promise<string | null> {
    try {
      return await messaging().getToken();
    } catch (error) {
      console.error("Lỗi khi lấy FCM token:", error);
      return null;
    }
  }

  /** Lắng nghe khi có thông báo (app foreground) */
  onMessage(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void): void {
    messaging().onMessage(callback);
  }

  /** Lắng nghe khi user click vào notif lúc app ở background */
  onNotificationOpened(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void): void {
    messaging().onNotificationOpenedApp(callback);
  }

  /** Lấy notif khi app bị kill hẳn, mở từ notif */
  async getInitialNotification(
    callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ): Promise<void> {
    const msg = await messaging().getInitialNotification();
    if (msg) {
      callback(msg);
    }
  }

  /** Lắng nghe khi token thay đổi */
  onTokenRefresh(callback: (token: string) => void): void {
    messaging().onTokenRefresh(callback);
  }

  /** Gửi token lên server (không cần userId) */
  async sendTokenToServer(token: string): Promise<void> {
    try {
      const res = await FirebaseManagermentApi.setToken(token);

      console.log("Token đã gửi lên server:", res.data);
    } catch (error: any) {
      console.error(
        "Lỗi khi gửi token lên server:",
        error.response?.data || error.message
      );
    }
  }
}
