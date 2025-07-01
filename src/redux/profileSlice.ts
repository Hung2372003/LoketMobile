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

export const updateProfileName = createAsyncThunk(
  'profile/updateName',
  async (newName: string, { rejectWithValue }) => {
    try {
      // Gọi API và chỉ cần trả về tên mới để cập nhật state
      await userService.updateProfileName(newName);
      return newName;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// --- Định nghĩa cấu trúc của state trong slice này ---
interface ProfileState {
  data: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isUploadingAvatar: boolean;
  isUpdatingName: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  status: 'idle',
  isUploadingAvatar: false,
  isUpdatingName: false,
  error: null,
};


// --- Tạo Slice ---
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
     resetProfile: (state) => {
      // Gán lại state về giá trị khởi tạo ban đầu
      state.data = null;
      state.status = 'idle';
      state.isUploadingAvatar = false;
      state.isUpdatingName = false;
      state.error = null;
    },
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
      })
      .addCase(updateProfileName.pending, (state) => {
        state.isUpdatingName = true;
        state.error = null; // Xóa lỗi cũ
      })
      .addCase(updateProfileName.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.data) {
          // Tạo một object mới để đảm bảo component re-render
          state.data = {
            ...state.data,
            name: action.payload, // Cập nhật tên mới
          };
          state.isUpdatingName = false;
        }
      })
      .addCase(updateProfileName.rejected, (state, action) => {
        state.isUpdatingName = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetProfile } = profileSlice.actions;

export default profileSlice.reducer;