import * as signalR from '@microsoft/signalr';
import tokenService from '../api/storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

let connection: signalR.HubConnection;


export const connectToChatHub = async () => {
  if (!connection) {
    const token = await tokenService.getAccessToken();
    connection = new signalR.HubConnectionBuilder()
      .withUrl('http://hungdepzaisieucapvutru.runasp.net/hub', {
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
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
export const joinGroup = async (groupChatId: string) => {
  await connection.invoke('JoinGroup', groupChatId);
};

export const leaveGroup = async (groupChatId: string) => {
  await connection.invoke('LeaveGroup', groupChatId);
};

export const sendMessageToGroup = async (
  groupChatId: string,
  contents?: string,
  listFile?: any
) => {
  await connection.invoke('SendMessageToGroup', groupChatId, contents, listFile);
};

export const SendNotificationToGroup = async (
  groupId: string,
  notification: string,
) => {
  await connection.invoke('SendNotificationToGroup', groupId,notification);
};

export const onReceiveNotification = (
  callback: (notification:string) => void
) => {
  connection.on('ReceiveNotification', callback);
};

export const onListUserOnline = (callback: (userCodes: string[]) => void) => {
  connection.on('ListUserOnline', callback);
};


export const onReceiveMessage = (
  callback: (groupChatId: string, content: string, userCode: string, listFile?: any) => void
) => {
  connection.on('ReceiveMessage', callback);
};


export const offReceiveMessage = (callback: (...args: any[]) => void) => {
  connection.off('ReceiveMessage', callback);
};

export const onReceiveLikeStatus = (
  callback: (postId: number, like: boolean) => void
) => {
  connection.on('ReceiveLikeStatus', callback);
};

export const sendLikeStatus = async (postId: number, like: boolean) => {
  await connection.invoke('SendLikeStatus', postId, like);
};


