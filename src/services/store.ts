import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { feedSlice } from '../services/slices/feed';
import { ingredientsSlice } from '../services/slices/ingredients';
import { constructorSlice } from '../services/slices/burgerConstructor';
import { orderSlice } from '../services/slices/order';
import { ordersSlice } from '../services/slices/orders';
import { userSlice } from '../services/slices/user';

const rootReducer = combineReducers({
  [feedSlice.name]: feedSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer,
  [userSlice.name]: userSlice.reducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
