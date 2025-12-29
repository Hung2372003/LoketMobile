import * as signalR from '@microsoft/signalr';
import tokenService from '../api/storage';
import { CryptoService } from './crypto.service';
// import AsyncStorage from '@react-native-async-storage/async-storage';

let connection: signalR.HubConnection | null = null;
let serverPublicKey: string | null = null;
const crypto = CryptoService.getInstance();
export const connectToChatHub = async () => {
  if (!connection) {
    const token = await tokenService.getAccessToken();
    connection = new signalR.HubConnectionBuilder()
      .withUrl('http://hungdepzaisieucapvutru.runasp.net/hub', {
        //  .withUrl('https://localhost:44334//hub', {
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
      registerCoreEvents();
  }

  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      console.log(' SignalR connected');
    } catch (err) {
      console.error(' Failed to connect:', err);
    }
  } else {
    console.log('⚠️ SignalR already connected or connecting...');
  }
};
const registerCoreEvents = () => {
  if (!connection) {return;}

  // 🔐 Nhận public key server
  connection.on('ReceivePublicKey', (publicKey: string) => {
    serverPublicKey = publicKey;
    crypto.setServerPublicKey(publicKey);
    console.log('🔐 Server public key received');
  });
};
export const getServerPublicKey = () => serverPublicKey;
export const joinGroup = async (groupChatId: string) => {
  if (connection) {
    await connection.invoke('JoinGroup', groupChatId);
  } else {
    console.error('SignalR connection is not established.');
  }
};

export const leaveGroup = async (groupChatId: string) => {
  if (connection) {
    await connection.invoke('LeaveGroup', groupChatId);
  } else {
    console.error('SignalR connection is not established.');
  }
};

export const sendMessageToGroup = async (
  groupChatId: string,
  contents?: string,
  listFile?: any
) => {
  if (connection) {
    await connection.invoke('SendMessageToGroup', groupChatId, contents, listFile);
  } else {
    console.error('SignalR connection is not established.');
  }
};

export const SendNotificationToGroup = async (
  groupId: string,
  notification: string,
) => {
  if (connection) {
    await connection.invoke('SendNotificationToGroup', groupId, notification);
  } else {
    console.error('SignalR connection is not established.');
  }
};

export const onReceiveNotification = (
  callback: (notification:string) => void
) => {
  if (connection) {
    connection.on('ReceiveNotification', callback);
  } else {
    console.error('SignalR connection is not established.');
  }
};

export const onListUserOnline = (callback: (userCodes: string[]) => void) => {
  if (connection) {
    connection.on('ListUserOnline', callback);
  } else {
    console.error('SignalR connection is not established.');
  }
};


export const onReceiveMessage = (
  callback: (groupChatId: string, content: string, userCode: string, listFile?: any) => void
) => {
  if (connection) {
    connection.on('ReceiveMessage', callback);
  } else {
    console.error('SignalR connection is not established.');
  }
};


export const offReceiveMessage = (callback: (...args: any[]) => void) => {
  if (connection) {
    connection.off('ReceiveMessage', callback);
  } else {
    console.error('SignalR connection is not established.');
  }
};

export const onReceiveLikeStatus = (
  callback: (postId: number, like: boolean) => void
) => {
  if (connection) {
    connection.on('ReceiveLikeStatus', callback);
  } else {
    console.error('SignalR connection is not established.');
  }
};

export const sendLikeStatus = async (postId: number, like: boolean) => {
  if (connection) {
    await connection.invoke('SendLikeStatus', postId, like);
  } else {
    console.error('SignalR connection is not established.');
  }
};
export const disconnectChatHub = async () => {
  if (connection) {
    try {
      await connection.stop();
      console.log('🔌 SignalR disconnected');
    } catch (err) {
      console.error('❌ Failed to disconnect:', err);
    } finally {
      connection = null;
    }
  }
};


