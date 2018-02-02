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

const OVERVIEW_GET_ACCOUNTS_FROM_SESSION = 'overview/OVERVIEW_GET_ACCOUNTS_FROM_SESSION';

const OVERVIEW_GET_ALL_ACCOUNTS_REQUEST = 'overview/OVERVIEW_GET_ALL_ACCOUNTS_REQUEST';
const OVERVIEW_GET_ALL_ACCOUNTS_SUCCESS = 'overview/OVERVIEW_GET_ALL_ACCOUNTS_SUCCESS';
const OVERVIEW_GET_ALL_ACCOUNTS_FAILURE = 'overview/OVERVIEW_GET_ALL_ACCOUNTS_FAILURE';

const OVERVIEW_GET_PRICES_REQUEST = 'overview/OVERVIEW_GET_PRICES_REQUEST';
const OVERVIEW_GET_PRICES_SUCCESS = 'overview/OVERVIEW_GET_PRICES_SUCCESS';
const OVERVIEW_GET_PRICES_FAILURE = 'overview/OVERVIEW_GET_PRICES_FAILURE';

const OVERVIEW_CHANGE_NATIVE_CURRENCY = 'overview/OVERVIEW_CHANGE_NATIVE_CURRENCY';

// -- Actions --------------------------------------------------------------- //

let getPricesInterval = null;

export const overviewGetPrices = () => (dispatch, getState) => {
  const { overview } = getState();
  const native = overview.nativeCurrency;
  const crypto = overview.crypto.length ? overview.crypto : getSession().crypto;
  const getPrices = () => {
    dispatch({ type: OVERVIEW_GET_PRICES_REQUEST, payload: overview.nativeCurrency });
    apiGetPrices(crypto, native)
      .then(({ data }) => {
        if (overview.nativeCurrency === getState().overview.nativePriceRequest) {
          const prices = { native: overview.nativeCurrency };
          crypto.map(
            coin => (prices[coin] = data[coin] ? data[coin][overview.nativeCurrency] : null)
          );
          saveLocal('NATIVE_PRICES', prices);
          dispatch({
            type: OVERVIEW_GET_PRICES_SUCCESS,
            payload: data
          });
        }
      })
      .catch(error => {
        dispatch({ type: OVERVIEW_GET_PRICES_FAILURE });
        const message = parseError(error);
        dispatch(notificationShow(message, true));
      });
  };
  getPrices();
  clearInterval(getPricesInterval);
  getPricesInterval = setInterval(getPrices, 300000); // 5mins
};

export const overviewGetNetwork = () => dispatch =>
  apiGetNetwork()
    .then(({ data }) => {
      saveLocal('NETWORK_PROVIDER', data.network);
      dispatch(notificationShow(`You're connected to ${capitalize(data.network)} network`));
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
    });

export const overviewGetAllAccounts = () => dispatch => {
  dispatch({ type: OVERVIEW_GET_ALL_ACCOUNTS_REQUEST });
  apiGetAllAccounts()
    .then(({ data }) => {
      const accounts = data.accounts;
      const crypto = flattenTokens(data.accounts);
      updateSession({ accounts, crypto });
      dispatch({
        type: OVERVIEW_GET_ALL_ACCOUNTS_SUCCESS,
        payload: { accounts, crypto }
      });
      dispatch(overviewGetPrices());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: OVERVIEW_GET_ALL_ACCOUNTS_FAILURE });
    });
};

export const overviewDisplayAccounts = () => dispatch => {
  const session = getSession();
  dispatch(overviewGetNetwork());
  if (session.accounts) {
    dispatch({
      type: OVERVIEW_GET_ACCOUNTS_FROM_SESSION,
      payload: session.accounts
    });
    dispatch(overviewGetPrices());
    dispatch(overviewGetAllAccounts());
  } else {
    dispatch(overviewGetAllAccounts());
  }
};

export const overviewChangeNativeCurrency = nativeCurrency => dispatch => {
  dispatch({
    type: OVERVIEW_CHANGE_NATIVE_CURRENCY,
    payload: nativeCurrency
  });
  dispatch(overviewGetPrices());
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
    case OVERVIEW_GET_ACCOUNTS_FROM_SESSION:
      return {
        ...state,
        accounts: action.payload
      };
    case OVERVIEW_GET_ALL_ACCOUNTS_REQUEST:
      return { ...state, fetching: true, error: false };
    case OVERVIEW_GET_ALL_ACCOUNTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        accounts: action.payload.accounts,
        crypto: action.payload.crypto
      };
    case OVERVIEW_GET_ALL_ACCOUNTS_FAILURE:
      return { ...state, fetching: false, error: true };
    case OVERVIEW_GET_PRICES_REQUEST:
      return {
        ...state,
        nativePriceRequest: action.payload
      };
    case OVERVIEW_GET_PRICES_SUCCESS:
      return {
        ...state,
        nativePriceRequest: '',
        prices: action.payload
      };
    case OVERVIEW_GET_PRICES_FAILURE:
      return {
        ...state,
        nativePriceRequest: ''
      };
    case OVERVIEW_CHANGE_NATIVE_CURRENCY:
      return { ...state, nativeCurrency: action.payload };
    default:
      return state;
  }
};
