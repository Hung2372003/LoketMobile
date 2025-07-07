import { callApi } from './axiosInstance';

export const chatManagementApi = {
  newMessageAllGroup: (): Promise<ApiResponse<Array<MessageReponse>>> =>
    callApi<ApiResponse<Array<MessageReponse>>>('ActionMessage/GetAllMessageGroups', 'get'),

  getCountNewMessage: (): Promise<{count:number}> =>
    callApi<{count:number}>('ChatBox/GetUnreadMessageCount','get'),

  createChatBox: (data: ReqestChatBox): Promise<ApiResponse<object>> =>{
    return callApi<ApiResponse<object>>('ChatBox/CreateWindowChat', 'post', data);
  },
  updateMessage: (data:UpdateMessageRequestData): Promise<ApiResponse<Array<any>>> => {
      const formData = new FormData();
      formData.append('groupChatId',data.groupChatId);
      formData.append('content',data.content);
      if (data.file && data.file.length > 0) {
        data.file.forEach((f) => {
          formData.append('fileUpload', {
            uri: f.uri,
            name: f.name,
            type: f.type,
          } as any);
        });
      }
    return  callApi<ApiResponse<Array<any>>>('ChatBox/UpdateMessage', 'post', formData);
  },

  setStatusMess: (groupChatId:number): Promise<ApiResponse<object>> =>
    callApi<ApiResponse<object>>('ChatBox/SetStatusMess', 'patch', {groupChatId:groupChatId}, true),

  getListFriend: ():Promise<Array<ListFriend>> =>
    callApi<Array<ListFriend>>('ContactUser/ListFrends','get'),

  getAllGroupChatId: ():Promise<ApiResponse<Array<{groupChatId:number}>>> =>
    callApi<ApiResponse<Array<{groupChatId:number}>>>('ChatBox/GetAllGroupChatId','get'),

};

export const PostManagementApi = {
   FeelPost: (data: FeelPostRequest): Promise<ApiResponse<Array<MessageReponse>>> =>
    callApi<ApiResponse<Array<MessageReponse>>>('PostManagement/FeelPost', 'post',data),
   getFeelPost : (data:{postCode : number}) : Promise<ApiResponse<Array<GetFeelPostReponse>>> =>
    callApi<ApiResponse<Array<GetFeelPostReponse>>>('PostManagement/GetFeelPost','get',data),
};

export interface FeelPostRequest{
   postCode: number,
  feeling: string
}
export interface ApiResponse<T>{
  id:number;
  error:boolean;
  title:string;
  object?:T;
  preventiveObject:any
}

export interface GetFeelPostReponse{
    userCode:number,
    name:string,
    avatar:string,
    feeling:string,
}
export interface ReqestChatBox{
  groupChatId?:number,
  userCode?:number
}

export interface UploadedFile {
  uri: string;
  name: string;
  type: string;
}

export interface UpdateMessageRequestData {
 groupChatId: number;
  content?: string;
  file?:Array<UploadedFile>
}

export interface ListUserReponse {
    userCode:number,
    name:string,
    avatar:string,
}
export interface MessageReponse {
  groupChatId: number;
  groupName: string;
  groupAvatar: string;
  status?: boolean;
  listUser:Array<ListUserReponse>,
  newMessage:{
    id:number,
    content:string,
    createdBy:number,
    createdTime:string,
  }
}
export interface ListFriend{
  userCode:number,
  name:string,
  path:string,
  MutualFriend?:number,
}

export interface UpdateMessReponse{
   path:string,
   type:string,
   id :number,
   messId:number,
   name:number
}
