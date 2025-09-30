import {
  getMessaging,
  getToken as getFcmToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification as getInitialMsg,
  onTokenRefresh,
  requestPermission,
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { getApp } from "@react-native-firebase/app";
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
  private messaging = getMessaging(getApp());

  /** Yêu cầu quyền thông báo */
  async requestPermission(): Promise<boolean> {
    const authStatus = await requestPermission(this.messaging);
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  /** Lấy token FCM */
  async getToken(): Promise<string | null> {
    try {
      return await getFcmToken(this.messaging);
    } catch (error) {
      console.error("Lỗi khi lấy FCM token:", error);
      return null;
    }
  }

  /** Lắng nghe khi có thông báo (app foreground) */
  onMessage(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void): void {
    onMessage(this.messaging, callback);
  }

  /** Lắng nghe khi user click vào notif lúc app ở background */
  onNotificationOpened(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void): void {
    onNotificationOpenedApp(this.messaging, callback);
  }

  /** Lấy notif khi app bị kill hẳn, mở từ notif */
  async getInitialNotification(
    callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ): Promise<void> {
    const msg = await getInitialMsg(this.messaging);
    if (msg) {
      callback(msg);
    }
  }

  /** Lắng nghe khi token thay đổi */
  onTokenRefresh(callback: (token: string) => void): void {
    onTokenRefresh(this.messaging, callback);
  }

  /** Gửi token lên server */
  async sendTokenToServer(token: string): Promise<void> {
    try {
      const res = await FirebaseManagermentApi.saveTokenDevices({ token: token });
      console.log("Token đã gửi lên server:", res.data);
    } catch (error: any) {
      console.error(
        "Lỗi khi gửi token lên server:",
        error.response?.data || error.message
      );
    }
  }
}
