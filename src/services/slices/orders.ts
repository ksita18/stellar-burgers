import { getOrdersApi } from '@api';
import {
  createAsyncThunk,
  SerializedError,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getOrdersThunk = createAsyncThunk(
  `${'user-order'}/orders`,
  async () => await getOrdersApi()
);

interface IOrdersSliceState {
  orders: TOrder[];
  isLoading: boolean;
  errors: SerializedError | null;
}

export const initialState: IOrdersSliceState = {
  orders: [],
  isLoading: false,
  errors: null
};

export const ordersSlice = createSlice({
  name: 'user-order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.error;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.errors = null;
      });
  },

  selectors: {
    getOrders: (state) => state.orders,
    getOrdersLoading: (state) => state.isLoading,
    getOrdersErrors: (state) => state.errors
  }
});

export const ordersActions = { ...ordersSlice.actions, getOrdersThunk };

export const { getOrders, getOrdersLoading, getOrdersErrors } =
  ordersSlice.selectors;
