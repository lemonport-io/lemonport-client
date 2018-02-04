import {
  apiGetAllAccounts,
  apiGetSingleAccount,
  apiGetNetwork,
  apiGetPrices
} from '../helpers/api';
import {
  capitalize,
  updateSession,
  updateAccounts,
  convertToNative,
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

const OVERVIEW_GET_SINGLE_ACCOUNT_REQUEST = 'overview/OVERVIEW_GET_SINGLE_ACCOUNT_REQUEST';
const OVERVIEW_GET_SINGLE_ACCOUNT_SUCCESS = 'overview/OVERVIEW_GET_SINGLE_ACCOUNT_SUCCESS';
const OVERVIEW_GET_SINGLE_ACCOUNT_FAILURE = 'overview/OVERVIEW_GET_SINGLE_ACCOUNT_FAILURE';

const OVERVIEW_GET_PRICES_REQUEST = 'overview/OVERVIEW_GET_PRICES_REQUEST';
const OVERVIEW_GET_PRICES_SUCCESS = 'overview/OVERVIEW_GET_PRICES_SUCCESS';
const OVERVIEW_GET_PRICES_FAILURE = 'overview/OVERVIEW_GET_PRICES_FAILURE';

const OVERVIEW_CHANGE_NATIVE_CURRENCY = 'overview/OVERVIEW_CHANGE_NATIVE_CURRENCY';

// -- Actions --------------------------------------------------------------- //

let getPricesInterval = null;

export const overviewGetPrices = () => (dispatch, getState) => {
  const { overview } = getState();
  const native = overview.nativeCurrency;
  const crypto = ['ETH', 'BTC', 'LTC'];
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
      updateSession({ accounts });
      const totalBalance = String(
        accounts.reduce(
          (result, current) => result + convertToNative(current.balance, current.currency).value,
          0
        )
      );
      dispatch({
        type: OVERVIEW_GET_ALL_ACCOUNTS_SUCCESS,
        payload: { accounts, totalBalance }
      });
      dispatch(overviewGetPrices());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: OVERVIEW_GET_ALL_ACCOUNTS_FAILURE });
    });
};

export const overviewGetSingleAccount = currency => dispatch => {
  dispatch({ type: OVERVIEW_GET_SINGLE_ACCOUNT_REQUEST, payload: currency });
  apiGetSingleAccount(currency)
    .then(({ data }) => {
      const account = data.account;
      const accounts = updateAccounts(account);
      const totalBalance = String(
        accounts.reduce(
          (result, current) => result + convertToNative(current.balance, current.currency).value,
          0
        )
      );
      dispatch({
        type: OVERVIEW_GET_SINGLE_ACCOUNT_SUCCESS,
        payload: { accounts, totalBalance }
      });
      dispatch(overviewGetPrices());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: OVERVIEW_GET_SINGLE_ACCOUNT_FAILURE });
    });
};

export const overviewDisplayAccounts = () => dispatch => {
  const session = getSession();
  dispatch(overviewGetPrices());
  dispatch(overviewGetNetwork());
  if (session.accounts) {
    dispatch({
      type: OVERVIEW_GET_ACCOUNTS_FROM_SESSION,
      payload: session.accounts
    });
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
  fetching: '',
  accounts: [],
  totalBalance: '',
  nativePriceRequest: '',
  nativeCurrency: 'USD',
  error: false,
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
      return { ...state, fetching: 'all', error: false };
    case OVERVIEW_GET_SINGLE_ACCOUNT_REQUEST:
      return { ...state, fetching: action.payload, error: false };
    case OVERVIEW_GET_ALL_ACCOUNTS_SUCCESS:
    case OVERVIEW_GET_SINGLE_ACCOUNT_SUCCESS:
      return {
        ...state,
        fetching: '',
        accounts: action.payload.accounts,
        totalBalance: action.payload.totalBalance
      };
    case OVERVIEW_GET_ALL_ACCOUNTS_FAILURE:
    case OVERVIEW_GET_SINGLE_ACCOUNT_FAILURE:
      return { ...state, fetching: '', error: true };
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
