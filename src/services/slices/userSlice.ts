import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

export const registerUserThunk = createAsyncThunk(
  `${'user'}/registerUser`,
  async (data: TRegisterData) =>
    registerUserApi(data).then((res) => {
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    })
);

export const loginUserThunk = createAsyncThunk(
  `${'user'}/loginUser`,
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const getUserThunk = createAsyncThunk(
  `${'user'}/getUser`,
  async () => await getUserApi()
);

export const updateUserThunk = createAsyncThunk(
  `${'user'}/updateUser`,
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const logoutUserThunk = createAsyncThunk(`${'user'}/logoutUser`, () => {
  logoutApi().then(() => {
    localStorage.clear();
    deleteCookie('accessToken');
  });
});

export const checkUserAuth = createAsyncThunk(
  `${'user'}/checkUser`,
  async (_, { dispatch }) => {
    const response = await dispatch(getUserThunk());

    if (getUserThunk.fulfilled.match(response)) {
      return response.payload;
    } else {
      throw new Error('Ошибка аутентификации пользователя');
    }
  }
);

interface IUserSliceState {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  error: SerializedError | null;
  request: boolean;
}

export const initialState: IUserSliceState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  error: null,
  request: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.user = null;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
      state.error = null;
      state.request = false;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUserThunk.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.request = false;
        state.error = action.error;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.request = false;
        state.error = action.error;
      })

      .addCase(checkUserAuth.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.request = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.error = action.error;
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.request = false;
        state.error = action.error;
      })

      .addCase(logoutUserThunk.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.request = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.request = false;
        state.error = action.error;
      });
  },
  selectors: {
    getUser: (state) => state.user,
    getUserIsAuthChecked: (state) => state.isAuthChecked,
    getUserIsAuthenticated: (state) => state.isAuthenticated,
    getUserError: (state) => state.error,
    getUserRequest: (state) => state.request
  }
});

export const userActions = {
  ...userSlice.actions,
  registerUserThunk,
  loginUserThunk,
  getUserThunk,
  updateUserThunk,
  logoutUserThunk,
  checkUserAuth
};
export const {
  getUser,
  getUserIsAuthChecked,
  getUserIsAuthenticated,
  getUserError,
  getUserRequest
} = userSlice.selectors;
