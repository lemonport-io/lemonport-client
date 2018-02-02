import { apiGetAllAccounts, apiGetNetwork, apiGetPrices } from '../helpers/api';
import {
  capitalize,
  flattenTokens,
  updateSession,
  getSession,
  parseError,
  saveLocal
} from '../helpers/utilities';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //

const DASHBOARD_GET_ACCOUNTS_FROM_SESSION = 'dashboard/DASHBOARD_GET_ACCOUNTS_FROM_SESSION';

const DASHBOARD_GET_ALL_ACCOUNTS_REQUEST = 'dashboard/DASHBOARD_GET_ALL_ACCOUNTS_REQUEST';
const DASHBOARD_GET_ALL_ACCOUNTS_SUCCESS = 'dashboard/DASHBOARD_GET_ALL_ACCOUNTS_SUCCESS';
const DASHBOARD_GET_ALL_ACCOUNTS_FAILURE = 'dashboard/DASHBOARD_GET_ALL_ACCOUNTS_FAILURE';

const DASHBOARD_GET_PRICES_REQUEST = 'dashboard/DASHBOARD_GET_PRICES_REQUEST';
const DASHBOARD_GET_PRICES_SUCCESS = 'dashboard/DASHBOARD_GET_PRICES_SUCCESS';
const DASHBOARD_GET_PRICES_FAILURE = 'dashboard/DASHBOARD_GET_PRICES_FAILURE';

const DASHBOARD_CHANGE_NATIVE_CURRENCY = 'dashboard/DASHBOARD_CHANGE_NATIVE_CURRENCY';

// -- Actions --------------------------------------------------------------- //

let getPricesInterval = null;

export const dashboardGetPrices = () => (dispatch, getState) => {
  const { dashboard } = getState();
  const native = dashboard.nativeCurrency;
  const crypto = dashboard.crypto.length ? dashboard.crypto : getSession().crypto;
  const getPrices = () => {
    dispatch({ type: DASHBOARD_GET_PRICES_REQUEST, payload: dashboard.nativeCurrency });
    apiGetPrices(crypto, native)
      .then(({ data }) => {
        if (dashboard.nativeCurrency === getState().dashboard.nativePriceRequest) {
          const prices = { native: dashboard.nativeCurrency };
          crypto.map(
            coin => (prices[coin] = data[coin] ? data[coin][dashboard.nativeCurrency] : null)
          );
          saveLocal('NATIVE_PRICES', prices);
          dispatch({
            type: DASHBOARD_GET_PRICES_SUCCESS,
            payload: data
          });
        }
      })
      .catch(error => {
        dispatch({ type: DASHBOARD_GET_PRICES_FAILURE });
        const message = parseError(error);
        dispatch(notificationShow(message, true));
      });
  };
  getPrices();
  clearInterval(getPricesInterval);
  getPricesInterval = setInterval(getPrices, 300000); // 5mins
};

export const dashboardGetNetwork = () => dispatch =>
  apiGetNetwork()
    .then(({ data }) => {
      saveLocal('NETWORK_PROVIDER', data.network);
      dispatch(notificationShow(`You're connected to ${capitalize(data.network)} network`));
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
    });

export const dashboardGetAllAccounts = () => dispatch => {
  dispatch({ type: DASHBOARD_GET_ALL_ACCOUNTS_REQUEST });
  apiGetAllAccounts()
    .then(({ data }) => {
      const accounts = data.accounts;
      const crypto = flattenTokens(data.accounts);
      updateSession({ accounts, crypto });
      dispatch({
        type: DASHBOARD_GET_ALL_ACCOUNTS_SUCCESS,
        payload: { accounts, crypto }
      });
      dispatch(dashboardGetPrices());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: DASHBOARD_GET_ALL_ACCOUNTS_FAILURE });
    });
};

export const dashboardDisplayAccounts = () => dispatch => {
  const session = getSession();
  dispatch(dashboardGetNetwork());
  if (session.accounts) {
    dispatch({
      type: DASHBOARD_GET_ACCOUNTS_FROM_SESSION,
      payload: session.accounts
    });
    dispatch(dashboardGetPrices());
    dispatch(dashboardGetAllAccounts());
  } else {
    dispatch(dashboardGetAllAccounts());
  }
};

export const dashboardChangeNativeCurrency = nativeCurrency => dispatch => {
  dispatch({
    type: DASHBOARD_CHANGE_NATIVE_CURRENCY,
    payload: nativeCurrency
  });
  dispatch(dashboardGetPrices());
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetching: false,
  accounts: [],
  nativePriceRequest: '',
  nativeCurrency: 'USD',
  error: false,
  crypto: [],
  prices: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DASHBOARD_GET_ACCOUNTS_FROM_SESSION:
      return {
        ...state,
        accounts: action.payload
      };
    case DASHBOARD_GET_ALL_ACCOUNTS_REQUEST:
      return { ...state, fetching: true, error: false };
    case DASHBOARD_GET_ALL_ACCOUNTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        accounts: action.payload.accounts,
        crypto: action.payload.crypto
      };
    case DASHBOARD_GET_ALL_ACCOUNTS_FAILURE:
      return { ...state, fetching: false, error: true };
    case DASHBOARD_GET_PRICES_REQUEST:
      return {
        ...state,
        nativePriceRequest: action.payload
      };
    case DASHBOARD_GET_PRICES_SUCCESS:
      return {
        ...state,
        nativePriceRequest: '',
        prices: action.payload
      };
    case DASHBOARD_GET_PRICES_FAILURE:
      return {
        ...state,
        nativePriceRequest: ''
      };
    case DASHBOARD_CHANGE_NATIVE_CURRENCY:
      return { ...state, nativeCurrency: action.payload };
    default:
      return state;
  }
};
