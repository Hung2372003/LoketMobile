import { ApiResponse, chatManagementApi, FirebaseManagermentApi, UpdateMessageRequestData, UpdateMessReponse } from '../api/endpoint.api';
import { sendMessageToGroup } from './signalR.service';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { FirebasePushService } from './FirebasePushService';
const pushService = new FirebasePushService();

const updateMessage = async (updateMessageRequestData:UpdateMessageRequestData) => {
     try {
        const data : ApiResponse<Array<UpdateMessReponse>> = await chatManagementApi.updateMessage(updateMessageRequestData);
        const userReceive = await chatManagementApi.getUserIdByGroupChatId(updateMessageRequestData.groupChatId!);
        const tokenDeviceReceive = await FirebaseManagermentApi.getTokenById({userId:userReceive.object!.userId.toString()});
        await pushService.sendTokenToServer(tokenDeviceReceive.token);
        await sendMessageToGroup('groupChat_' + updateMessageRequestData.groupChatId.toString(),updateMessageRequestData.content,data.object);
        if(data.error) {
            throw new Error('Lỗi khi lấy thông tin profile.');
        }
        return data.object;
    } catch (error) {
        throw error;
    }
};
const setDate = (timeData: string) => {
  const serverTime = new Date(timeData);
  const vnTime = new Date(serverTime.getTime() + 7 * 60 * 60 * 1000); // Chuyển sang giờ Việt Nam

  const now = new Date();
  const differenceInMilliseconds = Math.abs(now.getTime() - vnTime.getTime());
  const differenceInSeconds = differenceInMilliseconds / 1000;
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInSeconds < 10) {
    return 'vừa xong';
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes} phút`;
  } else if (differenceInHours < 24) {
    return `${differenceInHours} giờ`;
  } else {
    return `${differenceInDays} ngày`;
  }
};

const setDateMessage = (time1: string, time2: string) => {
  if (!time1 && !time2) {return false;}

  const now = new Date();

  const date1 = new Date(new Date(time1).getTime() + 7 * 60 * 60 * 1000);
  const date2 = time2 ? new Date(new Date(time2).getTime() + 7 * 60 * 60 * 1000) : now;

  const diffMinutes = Math.abs((date1.getTime() - date2.getTime()) / 1000 / 60);

  const isDifferentDay =
    date1.getDate() !== now.getDate() ||
    date1.getMonth() !== now.getMonth() ||
    date1.getFullYear() !== now.getFullYear();

  if (isDifferentDay && diffMinutes > 30) {
    return 'addDay';
  } else if (diffMinutes > 30) {
    return true;
  } else {
    return false;
  }
};

function formatDateTime(input: string | Date): string {
  const date = new Date(input);

  // Cộng thêm 7 tiếng vì server trả về giờ Mỹ (UTC-7) mà client ở Việt Nam (UTC+7)
  const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const now = new Date();

  const isSameDay =
    vnTime.getDate() === now.getDate() &&
    vnTime.getMonth() === now.getMonth() &&
    vnTime.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return vnTime.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else {
    return vnTime.toLocaleDateString('vi-VN');
  }
}
async function downloadImageAsFile(url: string): Promise<{
  uri: string;
  name: string;
  type: string;
}> {
  try {
    // Lấy tên file từ URL
    const urlParts = url.split('/');
    const rawFilename = urlParts[urlParts.length - 1].split('?')[0]; // loại bỏ query string nếu có
    const extension = rawFilename.split('.').pop() || 'jpg';
    const filename = rawFilename || `image_${Date.now()}.${extension}`;

    const path = `${RNFS.TemporaryDirectoryPath}/${filename}`;

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: path,
    }).promise;

    if (result.statusCode !== 200) {
      throw new Error('Download failed');
    }

    return {
      uri: Platform.OS === 'android' ? `file://${path}` : path,
      name: filename,
      type: `image/${extension}`,
    };
  } catch (error) {
    console.error('❌ Failed to download image:', error);
    throw error;
  }
}

const ChatService = {
  setDate,
  setDateMessage,
  formatDateTime,
  updateMessage,
  downloadImageAsFile,
};

export default ChatService;


