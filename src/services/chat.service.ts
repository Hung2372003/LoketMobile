import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chatapi-49ao.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwicm9sZSI6IlVzZXIiLCJQZXJtaXNzaW9uIjoiTk9UIiwibmJmIjoxNzUxMTI4OTg5LCJleHAiOjE3NTEzODgxODksImlhdCI6MTc1MTEyODk4OX0.w19JnZeDvlB7-5lheArUPEAZiNASjC_rLOyd9AgUHoY',

  },
});


const getChatHistory = async () => {
    try {
        const response = await api.get('/ActionMessage/GetAllMessageGroups');
        if(response.data.error) {
            throw new Error('Lỗi khi lấy thông tin profile.');
        }
        return response.data.object;
    } catch (error) {
        throw error;
    }
};

interface ReqpestChatBox{
  groupChatId?:number,
  userCode?:number
}
const createChatBox = async (reqpestChatBox:ReqpestChatBox) => {
   try {
        const response = await api.post('/ChatBox/CreateWindowChat',reqpestChatBox);
        if(response.data.error) {
            throw new Error('Lỗi khi lấy thông tin profile.');
        }
        return response.data.object;
    } catch (error) {
        throw error;
    }
};


export interface UpdateMessageRequestData {
  groupChatId: number;
  content?: string;
  file?:Array<File>
}


const updateMessage = async (updateMessageRequestData:UpdateMessageRequestData) => {
  const requestUpdateMessage = new FormData();
  requestUpdateMessage.append('groupChatId',updateMessageRequestData.groupChatId);
  requestUpdateMessage.append('content',updateMessageRequestData.content);
  if(updateMessageRequestData.file){
    updateMessageRequestData.file.forEach(x => {
      requestUpdateMessage.append('fileUpload',x);
    });
  }
     try {
        const response = await api.post('/ChatBox/UpdateMessage',requestUpdateMessage,{
          headers:{
             'Authorization': api.defaults.headers.Authorization,
              'Content-Type': 'multipart/form-data',
          },
        });
        if(response.data.error) {
            throw new Error('Lỗi khi lấy thông tin profile.');
        }
        return response.data;
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



const ChatService = {
  getChatHistory,
  createChatBox,
  setDate,
  setDateMessage,
  formatDateTime,
  updateMessage,
};

export default ChatService;


