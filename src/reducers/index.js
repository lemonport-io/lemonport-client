import { combineReducers } from 'redux';
import auth from './_auth';
import overview from './_overview';
import notification from './_notification';
import modal from './_modal';
import send from './_send';
import warning from './_warning';
import user from './_user';

export default combineReducers({
  auth,
  overview,
  notification,
  modal,
  send,
  warning,
  user
});
