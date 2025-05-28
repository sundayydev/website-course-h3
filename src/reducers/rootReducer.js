// reducers/rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
});

export default rootReducer;
