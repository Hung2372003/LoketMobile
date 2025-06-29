import * as signalR from '@microsoft/signalr';
// import AsyncStorage from '@react-native-async-storage/async-storage';

let connection: signalR.HubConnection;


export const connectToChatHub = async () => {
  if (!connection) {
    // const token = await AsyncStorage.getItem('access_token');
    connection = new signalR.HubConnectionBuilder()
      .withUrl('https://chatapi-49ao.onrender.com/hub', {
        accessTokenFactory: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwicm9sZSI6IlVzZXIiLCJQZXJtaXNzaW9uIjoiTk9UIiwibmJmIjoxNzUxMTI4OTg5LCJleHAiOjE3NTEzODgxODksImlhdCI6MTc1MTEyODk4OX0.w19JnZeDvlB7-5lheArUPEAZiNASjC_rLOyd9AgUHoY',
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
  contents: string | null,
  listFile?: any
) => {
  await connection.invoke('SendMessageToGroup', groupChatId, contents, listFile);
};

export const sendLikeStatus = async (postId: number, like: boolean) => {
  await connection.invoke('SendLikeStatus', postId, like);
};

// Lắng nghe danh sách người dùng online
export const onListUserOnline = (callback: (userCodes: string[]) => void) => {
  connection.on('ListUserOnline', callback);
};

// Lắng nghe tin nhắn nhận được từ nhóm
export const onReceiveMessage = (
  callback: (groupChatId: string, content: string, userCode: string, listFile?: any) => void
) => {
  connection.on('ReceiveMessage', callback);
};
// signalR.service.ts
export const offReceiveMessage = (callback: (...args: any[]) => void) => {
  connection.off('ReceiveMessage', callback);
};

// Lắng nghe tương tác like
export const onReceiveLikeStatus = (
  callback: (postId: number, like: boolean) => void
) => {
  connection.on('ReceiveLikeStatus', callback);
};
