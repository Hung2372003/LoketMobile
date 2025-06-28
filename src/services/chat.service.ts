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

interface reqpestChatBox{
  groupChatId?:number,
  userCode?:number
}
const createChatBox = async (reqpestChatBox:reqpestChatBox) => {
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
  const setDate = (timeData:string)=>{
    let time = new Date(timeData);
    let timeNow = new Date();

    let differenceInMilliseconds = Math.abs(time.getTime() - timeNow.getTime());
    let differenceInSeconds = differenceInMilliseconds / 1000;
    let differenceInMinutes = Math.round(differenceInSeconds / 60);
    let differenceInHour = Math.round(differenceInMinutes / 60);
    let differenceInDay = Math.round(differenceInHour / 24);

    if(differenceInSeconds < 10){
      return 'vừa xong';
    }
    else if(differenceInMinutes < 60){
      return differenceInMinutes.toString() + ' phút';
    }
    else if(differenceInHour < 24){
      return differenceInHour.toString() + ' giờ';
    }
    else {return differenceInDay.toString() + ' Ngày';}
  };

  const setDateMessage = (time1:string,time2:string)=>{
    if(!time1 && !time2){
      return false;
    }
    let now = new Date();
    let settime1 = new Date(time1);
    let settime2 = new Date(time2);
    if(!time2){
       settime2 = new Date();
    }

   //điều kiện chỉ thêm giờ
   let differenceInMilliseconds = Math.abs(settime1.getTime() - settime2.getTime());
   let differenceInSeconds = differenceInMilliseconds / 1000;
   let differenceInMinutes = Math.round(differenceInSeconds / 60);

   //Điều kiện thêm ngày
   let differenceInDayAddDay = Math.abs(settime1.getDate() - now.getDate());
   let differenceInMonthAddDay =  Math.abs(settime1.getMonth() - now.getMonth());
   let differenceInYearAddDay =  Math.abs(settime1.getFullYear() - now.getFullYear());
    if((differenceInDayAddDay > 0 || differenceInMonthAddDay > 0 || differenceInYearAddDay > 0) && differenceInMinutes > 30){
      return 'addDay';
    }else if(differenceInMinutes > 30){
      return true;
    }
    else {
      return false;
    }
  };
  function formatDateTime(input: string | Date): string {
  const date = new Date(input);
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();

  if (isSameDay) {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    return new Intl.DateTimeFormat('vi-VN').format(date);
  }
}

const ChatService = {
  getChatHistory,
  createChatBox,
  setDate,
  setDateMessage,
  formatDateTime,
};
export default ChatService;

