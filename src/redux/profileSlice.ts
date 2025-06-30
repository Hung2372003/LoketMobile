import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import userService from '../services/userService';
import { Profile } from '../types/profile'; // Import type Profile của bạn

// --- Định nghĩa các hành động bất đồng bộ (API calls) ---

// Thunk để lấy profile
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  const response = await userService.getMyProfile();
  // Map dữ liệu ở đây
  return {
    name: String(response.name),
    profileImage: response.avatar,
    locketUrl: response.email,
  } as Profile;
});

// Thunk để cập nhật avatar
export const uploadAvatar = createAsyncThunk('profile/uploadAvatar', async (imageUri: string) => {
    // object trả về từ API nên chứa url avatar mới
    const response = await userService.updateAvatar(imageUri);
    return response.avatar; 
});


// --- Định nghĩa cấu trúc của state trong slice này ---
interface ProfileState {
  data: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isUploadingAvatar: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  status: 'idle',
  isUploadingAvatar: false,
  error: null,
};


// --- Tạo Slice ---
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Có thể thêm các reducer đồng bộ ở đây nếu cần
  },
  // Xử lý các trạng thái của hành động bất đồng bộ
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isUploadingAvatar = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<string>) => {
        // 1. Cập nhật lại URL avatar trong state.data
        if (state.data) {
         state.data = {
            ...state.data, // Sao chép tất cả các thuộc tính cũ (name, locketUrl)
            profileImage: action.payload, // Ghi đè thuộc tính profileImage bằng URL mới
          };
        }
        // 2. Tắt trạng thái loading
        state.isUploadingAvatar = false;
      })
      .addCase(uploadAvatar.rejected, (state) => {
          // KHI UPLOAD THẤT BẠI: Tắt trạng thái loading
          state.isUploadingAvatar = false;
          // Có thể thêm logic xử lý lỗi ở đây
      });
  },
});

export default profileSlice.reducer;