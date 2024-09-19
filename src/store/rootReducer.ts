import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here as needed
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
