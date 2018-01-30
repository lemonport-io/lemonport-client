import {
  apiResendVerifyEmail,
  apiVerifyTwoFactor,
  apiEmailVerify,
  apiCheckEmail,
  apiRequestTwoFactor,
  apiEnableTwoFactor,
  apiCheckTwoFactor
} from '../helpers/api';
import { updateSession, parseError } from '../helpers/utilities';
import { modalOpen } from './_modal';
import { notificationShow } from './_notification';
import { warningShow, warningHide } from './_warning';

// -- Constants ------------------------------------------------------------- //
const USER_EMAIL_VERIFY_REQUEST = 'user/USER_EMAIL_VERIFY_REQUEST';
const USER_EMAIL_VERIFY_SUCCESS = 'user/USER_EMAIL_VERIFY_SUCCESS';
const USER_EMAIL_VERIFY_FAILURE = 'user/USER_EMAIL_VERIFY_FAILURE';

const USER_RESEND_VERIFY_EMAIL_REQUEST = 'user/USER_RESEND_VERIFY_EMAIL_REQUEST';
const USER_RESEND_VERIFY_EMAIL_SUCCESS = 'user/USER_RESEND_VERIFY_EMAIL_SUCCESS';
const USER_RESEND_VERIFY_EMAIL_FAILURE = 'user/USER_RESEND_VERIFY_EMAIL_FAILURE';

const USER_CHECK_EMAIL_REQUEST = 'user/USER_CHECK_EMAIL_REQUEST';
const USER_CHECK_EMAIL_SUCCESS = 'user/USER_CHECK_EMAIL_SUCCESS';
const USER_CHECK_EMAIL_FAILURE = 'user/USER_CHECK_EMAIL_FAILURE';

const USER_REQUEST_TWO_FACTOR_REQUEST = 'user/USER_REQUEST_TWO_FACTOR_REQUEST';
const USER_REQUEST_TWO_FACTOR_SUCCESS = 'user/USER_REQUEST_TWO_FACTOR_SUCCESS';
const USER_REQUEST_TWO_FACTOR_FAILURE = 'user/USER_REQUEST_TWO_FACTOR_FAILURE';

const USER_ENABLE_TWO_FACTOR_REQUEST = 'user/USER_ENABLE_TWO_FACTOR_REQUEST';
const USER_ENABLE_TWO_FACTOR_SUCCESS = 'user/USER_ENABLE_TWO_FACTOR_SUCCESS';
const USER_ENABLE_TWO_FACTOR_FAILURE = 'user/USER_ENABLE_TWO_FACTOR_FAILURE';

const USER_CHECK_TWO_FACTOR_REQUEST = 'user/USER_CHECK_TWO_FACTOR_REQUEST';
const USER_CHECK_TWO_FACTOR_SUCCESS = 'user/USER_CHECK_TWO_FACTOR_SUCCESS';
const USER_CHECK_TWO_FACTOR_FAILURE = 'user/USER_CHECK_TWO_FACTOR_FAILURE';

const USER_VERIFY_TWO_FACTOR_REQUEST = 'user/USER_VERIFY_TWO_FACTOR_REQUEST';
const USER_VERIFY_TWO_FACTOR_SUCCESS = 'user/USER_VERIFY_TWO_FACTOR_SUCCESS';
const USER_VERIFY_TWO_FACTOR_FAILURE = 'user/USER_VERIFY_TWO_FACTOR_FAILURE';

const USER_CLEAR_STATE = 'user/USER_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //

export const userCheckEmail = () => dispatch => {
  dispatch({ type: USER_CHECK_EMAIL_REQUEST });
  apiCheckEmail()
    .then(({ data }) => {
      const { verified } = data;
      if (!verified) {
        dispatch(
          warningShow({
            key: 'EMAIL_VERIFICATION_WARNING',
            color: 'red',
            message: 'Check your inbox to confirm your email. Resend? Click here',
            action: () => {
              dispatch(notificationShow(`New verification email was sent`, true));
              dispatch(userResendVerifyEmail());
            }
          })
        );
      } else {
        dispatch(warningHide('EMAIL_VERIFICATION_WARNING'));
      }
      updateSession({ verified });
      dispatch({ type: USER_CHECK_EMAIL_SUCCESS, payload: verified });
    })
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: USER_CHECK_EMAIL_FAILURE });
    });
};

export const userResendVerifyEmail = () => dispatch => {
  dispatch({ type: USER_RESEND_VERIFY_EMAIL_REQUEST });
  apiResendVerifyEmail()
    .then(({ data }) => {
      dispatch({ type: USER_RESEND_VERIFY_EMAIL_SUCCESS });
    })
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: USER_RESEND_VERIFY_EMAIL_FAILURE });
    });
};

export const userEmailVerify = hash => dispatch => {
  dispatch({ type: USER_EMAIL_VERIFY_REQUEST });
  apiEmailVerify(hash)
    .then(() => {
      updateSession({ verified: true });
      dispatch({ type: USER_EMAIL_VERIFY_SUCCESS });
    })
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: USER_EMAIL_VERIFY_FAILURE });
    });
};

export const userRequestTwoFactor = () => dispatch => {
  dispatch({ type: USER_REQUEST_TWO_FACTOR_REQUEST });
  dispatch(modalOpen('SETUP_TWO_FACTOR', {}));
  apiRequestTwoFactor()
    .then(({ data }) => dispatch({ type: USER_REQUEST_TWO_FACTOR_SUCCESS, payload: data.uri }))
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: USER_REQUEST_TWO_FACTOR_FAILURE });
    });
};

export const userEnableTwoFactor = code => dispatch => {
  dispatch({ type: USER_ENABLE_TWO_FACTOR_REQUEST });
  apiEnableTwoFactor(code)
    .then(() => {
      updateSession({ twoFactor: true });
      dispatch({ type: USER_ENABLE_TWO_FACTOR_SUCCESS, payload: true });
    })
    .catch(error => {
      console.error(error);
      dispatch(notificationShow(error.message, true));
      dispatch({ type: USER_ENABLE_TWO_FACTOR_FAILURE });
    });
};

export const userCheckTwoFactor = () => dispatch => {
  dispatch({ type: USER_CHECK_TWO_FACTOR_REQUEST });
  apiCheckTwoFactor()
    .then(({ data }) => {
      const { twoFactor } = data;
      if (!twoFactor) {
        dispatch(
          warningShow({
            key: 'SETUP_TWO_FACTOR_WARNING',
            color: 'blue',
            message: 'Set up two factor authentication! Click here',
            action: () => dispatch(userRequestTwoFactor())
          })
        );
      } else {
        dispatch(warningHide('SETUP_TWO_FACTOR_WARNING'));
      }
      updateSession({ twoFactor });
      dispatch({ type: USER_CHECK_TWO_FACTOR_SUCCESS, payload: twoFactor });
    })
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: USER_CHECK_TWO_FACTOR_FAILURE });
    });
};

export const userVerifyTwoFactor = code => dispatch => {
  dispatch({ type: USER_VERIFY_TWO_FACTOR_REQUEST });
  apiVerifyTwoFactor(code)
    .then(() => dispatch({ type: USER_VERIFY_TWO_FACTOR_SUCCESS, payload: true }))
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: USER_VERIFY_TWO_FACTOR_FAILURE });
    });
};

export const userClearState = () => ({ type: USER_CLEAR_STATE });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetching: false,
  enablingTwoFactor: false,
  verifyingTwoFactor: false,
  successfulTwoFactor: false,
  verified: false,
  twoFactor: false,
  noWarning: false,
  uri: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_VERIFY_TWO_FACTOR_REQUEST:
      return { ...state, verifyingTwoFactor: true, successfulTwoFactor: false };
    case USER_VERIFY_TWO_FACTOR_SUCCESS:
      return { ...state, verifyingTwoFactor: false, successfulTwoFactor: true };
    case USER_VERIFY_TWO_FACTOR_FAILURE:
      return { ...state, verifyingTwoFactor: false, successfulTwoFactor: false };
    case USER_EMAIL_VERIFY_REQUEST:
    case USER_CHECK_EMAIL_REQUEST:
    case USER_CHECK_TWO_FACTOR_REQUEST:
      return { ...state, fetching: true, noWarning: false };
    case USER_REQUEST_TWO_FACTOR_REQUEST:
      return { ...state, fetching: true, twoFactor: false, noWarning: false };
    case USER_ENABLE_TWO_FACTOR_REQUEST:
      return { ...state, enablingTwoFactor: true, twoFactor: false, noWarning: false };
    case USER_EMAIL_VERIFY_SUCCESS:
      return {
        ...state,
        fetching: false,
        verified: true
      };
    case USER_CHECK_EMAIL_SUCCESS:
      return {
        ...state,
        fetching: false,
        verified: action.payload
      };
    case USER_REQUEST_TWO_FACTOR_SUCCESS:
      return {
        ...state,
        fetching: false,
        uri: action.payload
      };
    case USER_ENABLE_TWO_FACTOR_SUCCESS:
      return {
        ...state,
        enablingTwoFactor: false,
        twoFactor: action.payload
      };
    case USER_CHECK_TWO_FACTOR_SUCCESS:
      return {
        ...state,
        fetching: false,
        twoFactor: action.payload
      };
    case USER_EMAIL_VERIFY_FAILURE:
      return { ...state, fetching: false, verified: false };
    case USER_CHECK_EMAIL_FAILURE:
    case USER_REQUEST_TWO_FACTOR_FAILURE:
    case USER_CHECK_TWO_FACTOR_FAILURE:
      return {
        ...state,
        fetching: false
      };
    case USER_ENABLE_TWO_FACTOR_FAILURE:
      return { ...state, enablingTwoFactor: false, twoFactor: false };
    case USER_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE, noWarning: true };
    default:
      return state;
  }
};
