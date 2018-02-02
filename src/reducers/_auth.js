import {
  apiSignIn,
  apiSignUp,
  apiSignInTwoFactor,
  apiVerifyTwoFactor,
  apiRequestTwoFactor,
  apiEnableTwoFactor
} from '../helpers/api';
import {
  setSession,
  deleteSession,
  updateSession,
  flattenTokens,
  parseError
} from '../helpers/utilities';
import { isValidEmail } from '../helpers/validators';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const AUTH_SIGNIN_REQUEST = 'auth/AUTH_SIGNIN_REQUEST';
const AUTH_SIGNIN_SUCCESS = 'auth/AUTH_SIGNIN_SUCCESS';
const AUTH_SIGNIN_FAILURE = 'auth/AUTH_SIGNIN_FAILURE';

const AUTH_SIGNIN_TWO_FACTOR_REQUEST = 'auth/AUTH_SIGNIN_TWO_FACTOR_REQUEST';
const AUTH_SIGNIN_TWO_FACTOR_SUCCESS = 'auth/AUTH_SIGNIN_TWO_FACTOR_SUCCESS';
const AUTH_SIGNIN_TWO_FACTOR_FAILURE = 'auth/AUTH_SIGNIN_TWO_FACTOR_FAILURE';

const AUTH_SIGNUP_REQUEST = 'auth/AUTH_SIGNUP_REQUEST';
const AUTH_SIGNUP_SUCCESS = 'auth/AUTH_SIGNUP_SUCCESS';
const AUTH_SIGNUP_FAILURE = 'auth/AUTH_SIGNUP_FAILURE';

const AUTH_VERIFY_TWO_FACTOR_REQUEST = 'auth/AUTH_VERIFY_TWO_FACTOR_REQUEST';
const AUTH_VERIFY_TWO_FACTOR_SUCCESS = 'auth/AUTH_VERIFY_TWO_FACTOR_SUCCESS';
const AUTH_VERIFY_TWO_FACTOR_FAILURE = 'auth/AUTH_VERIFY_TWO_FACTOR_FAILURE';

const AUTH_REQUEST_TWO_FACTOR_REQUEST = 'auth/AUTH_REQUEST_TWO_FACTOR_REQUEST';
const AUTH_REQUEST_TWO_FACTOR_SUCCESS = 'auth/AUTH_REQUEST_TWO_FACTOR_SUCCESS';
const AUTH_REQUEST_TWO_FACTOR_FAILURE = 'auth/AUTH_REQUEST_TWO_FACTOR_FAILURE';

const AUTH_ENABLE_TWO_FACTOR_REQUEST = 'auth/AUTH_ENABLE_TWO_FACTOR_REQUEST';
const AUTH_ENABLE_TWO_FACTOR_SUCCESS = 'auth/AUTH_ENABLE_TWO_FACTOR_SUCCESS';
const AUTH_ENABLE_TWO_FACTOR_FAILURE = 'auth/AUTH_ENABLE_TWO_FACTOR_FAILURE';

const AUTH_SIGNOUT = 'auth/AUTH_SIGNOUT';

const AUTH_REQUIRE_TWO_FACTOR = 'auth/AUTH_REQUIRE_TWO_FACTOR';

const AUTH_UPDATE_CODE = 'auth/AUTH_UPDATE_CODE';

const AUTH_UPDATE_FIELDS = 'auth/AUTH_UPDATE_FIELDS';

const AUTH_CLEAR_FIELDS = 'auth/AUTH_CLEAR_FIELDS';

const AUTH_PASSWORDS_DONT_MATCH = 'auth/AUTH_PASSWORDS_DONT_MATCH';
const AUTH_INVALID_EMAIL = 'auth/AUTH_INVALID_EMAIL';
const AUTH_INVALID_EMAIL_OR_PASSWORD = 'auth/AUTH_INVALID_EMAIL_OR_PASSWORD';

// -- Actions --------------------------------------------------------------- //

export const authSignIn = (email, password) => dispatch => {
  if (!isValidEmail(email)) {
    dispatch(notificationShow(`Email is not valid`, true));
    dispatch({ type: AUTH_INVALID_EMAIL });
    return;
  }
  dispatch({ type: AUTH_SIGNIN_REQUEST });
  apiSignIn(email, password)
    .then(({ data }) => {
      if (data.message === 'REQUIRE_TWO_FACTOR') {
        dispatch({ type: AUTH_REQUIRE_TWO_FACTOR });
        return;
      }
      const { token, email, expires, verified, twoFactor, accounts } = data;
      const crypto = flattenTokens(accounts);
      setSession({ token, email, expires, verified, twoFactor, accounts, crypto });
      dispatch({ type: AUTH_SIGNIN_SUCCESS });
      window.browserHistory.push('/dashboard');
    })
    .catch(error => {
      if (error.message === 'TWO_FACTOR_CODE_MISSING') {
        dispatch({ type: AUTH_REQUIRE_TWO_FACTOR });
      } else {
        if (error.response.status === 400 || error.response.status === 401) {
          dispatch(notificationShow(`Email or Password is invalid`, true));
        } else {
          const message = parseError(error);
          dispatch(notificationShow(message, true));
        }
        dispatch({ type: AUTH_SIGNIN_FAILURE });
      }
    });
};

export const authSignInTwoFactor = (email, password, code) => (dispatch, getState) => {
  dispatch({ type: AUTH_SIGNIN_TWO_FACTOR_REQUEST });
  apiSignInTwoFactor(email, password, code)
    .then(({ data }) => {
      const { token, email, expires, verified, twoFactor, accounts } = data;
      const crypto = flattenTokens(accounts);
      setSession({ token, email, expires, verified, twoFactor, accounts, crypto });
      dispatch({ type: AUTH_SIGNIN_TWO_FACTOR_SUCCESS });
      window.browserHistory.push('/dashboard');
    })
    .catch(error => {
      if (error.response.status === 400 || error.response.status === 401) {
        dispatch(notificationShow(`Email or Password is invalid`, true));
        dispatch({ type: AUTH_INVALID_EMAIL_OR_PASSWORD });
      } else {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
      }
      dispatch({ type: AUTH_SIGNIN_TWO_FACTOR_FAILURE });
    });
};

export const authSignUp = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  facebookID
}) => dispatch => {
  console.log(email);
  if (!isValidEmail(email)) {
    dispatch(notificationShow(`Email is invalid`, true));
    dispatch({ type: AUTH_INVALID_EMAIL });
    return;
  }
  if (password !== confirmPassword) {
    dispatch(notificationShow(`Passwords don't match`, true));
    dispatch({ type: AUTH_PASSWORDS_DONT_MATCH });
    return;
  }
  dispatch({ type: AUTH_SIGNUP_REQUEST });
  apiSignUp({ firstName, lastName, email, password, facebookID })
    .then(({ data }) => {
      const { token, email, expires, verified, accounts } = data;
      setSession({ token, email, expires, verified, accounts });
      dispatch({ type: AUTH_SIGNUP_SUCCESS });
      window.browserHistory.push('/setup-two-factor');
    })
    .catch(error => {
      if (error.response.status === 400 || error.response.status === 401) {
        dispatch(notificationShow(`Email is invalid`, true));
      } else {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
      }
      dispatch({ type: AUTH_SIGNUP_FAILURE });
    });
};

export const userVerifyTwoFactor = code => dispatch => {
  dispatch({ type: AUTH_VERIFY_TWO_FACTOR_REQUEST });
  apiVerifyTwoFactor(code)
    .then(() => dispatch({ type: AUTH_VERIFY_TWO_FACTOR_SUCCESS, payload: true }))
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: AUTH_VERIFY_TWO_FACTOR_FAILURE });
    });
};

export const authRequestTwoFactor = () => dispatch => {
  dispatch({ type: AUTH_REQUEST_TWO_FACTOR_REQUEST });
  apiRequestTwoFactor()
    .then(({ data }) => dispatch({ type: AUTH_REQUEST_TWO_FACTOR_SUCCESS, payload: data.uri }))
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: AUTH_REQUEST_TWO_FACTOR_FAILURE });
    });
};

export const authEnableTwoFactor = code => dispatch => {
  dispatch({ type: AUTH_ENABLE_TWO_FACTOR_REQUEST });
  apiEnableTwoFactor(code)
    .then(() => {
      updateSession({ twoFactor: true });
      dispatch({ type: AUTH_ENABLE_TWO_FACTOR_SUCCESS, payload: true });
      window.browserHistory.push('/dashboard');
    })
    .catch(error => {
      console.error(error);
      dispatch(notificationShow(error.message, true));
      dispatch({ type: AUTH_ENABLE_TWO_FACTOR_FAILURE });
    });
};

export const authSignOut = () => dispatch => {
  deleteSession();
  dispatch({ type: AUTH_SIGNOUT });
  window.browserHistory.push('/');
};

export const authUpdateCode = code => ({
  type: AUTH_UPDATE_CODE,
  payload: code
});

export const authUpdateFields = fields => ({
  type: AUTH_UPDATE_FIELDS,
  payload: fields
});

export const authClearFields = () => ({ type: AUTH_CLEAR_FIELDS });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetching: false,
  requireTwoFactor: false,
  fetchingTwoFactor: false,
  facebookID: '',
  profileImage: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  code: '',
  uri: '',
  confirmPassword: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_SIGNUP_REQUEST:
    case AUTH_SIGNIN_REQUEST:
    case AUTH_SIGNIN_TWO_FACTOR_REQUEST:
    case AUTH_REQUEST_TWO_FACTOR_REQUEST:
      return { ...state, fetching: true };
    case AUTH_SIGNUP_SUCCESS:
    case AUTH_SIGNIN_SUCCESS:
    case AUTH_SIGNIN_TWO_FACTOR_SUCCESS:
    case AUTH_SIGNOUT:
      return { ...state, ...INITIAL_STATE };
    case AUTH_REQUEST_TWO_FACTOR_SUCCESS:
      return { ...state, fetching: false, uri: action.payload };
    case AUTH_SIGNUP_FAILURE:
    case AUTH_SIGNIN_FAILURE:
    case AUTH_SIGNIN_TWO_FACTOR_FAILURE:
      return { ...state, code: '', fetching: false };
    case AUTH_REQUEST_TWO_FACTOR_FAILURE:
      return { ...state, fetching: false, uri: '' };
    case AUTH_REQUIRE_TWO_FACTOR:
      return { ...state, fetching: false, requireTwoFactor: true };
    case AUTH_ENABLE_TWO_FACTOR_REQUEST:
      return { ...state, verifyTwofactor: true };
    case AUTH_ENABLE_TWO_FACTOR_SUCCESS:
      return { ...state, verifyTwofactor: false, requireTwoFactor: false };
    case AUTH_ENABLE_TWO_FACTOR_FAILURE:
      return { ...state, verifyTwofactor: false };
    case AUTH_VERIFY_TWO_FACTOR_REQUEST:
      return { ...state, verifyTwofactor: true };
    case AUTH_VERIFY_TWO_FACTOR_SUCCESS:
      return { ...state, verifyTwofactor: false, uri: '' };
    case AUTH_VERIFY_TWO_FACTOR_FAILURE:
      return { ...state, verifyTwofactor: false };
    case AUTH_UPDATE_FIELDS:
      return { ...state, ...action.payload };
    case AUTH_UPDATE_CODE:
      return { ...state, code: action.payload };
    case AUTH_PASSWORDS_DONT_MATCH:
      return { ...state, password: '', confirmPassword: '' };
    case AUTH_INVALID_EMAIL:
      return { ...state, email: '' };
    case AUTH_INVALID_EMAIL_OR_PASSWORD:
      return { ...state, email: '', password: '', requireTwoFactor: false, code: '' };
    case AUTH_CLEAR_FIELDS:
      return { ...state, email: '', password: '', confirmPassword: '' };
    default:
      return state;
  }
};
