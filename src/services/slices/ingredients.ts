import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IIngredientsSliceState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
}

export const initialState: IIngredientsSliceState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const getIngredientsThunk = createAsyncThunk(
  `${'ingredients'}/getIngredients`,
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.error = null;
      });
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsIsLoading: (state) => state.isLoading,
    getIngredientsError: (state) => state.error
  }
});

export const ingredientsActions = {
  ...ingredientsSlice.actions,
  getIngredientsThunk
};

export const { getIngredients, getIngredientsIsLoading, getIngredientsError } =
  ingredientsSlice.selectors;
