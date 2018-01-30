import {
  apiGetAllAccounts,
  apiGetAllAccountsTokens,
  apiGenerateAccount,
  apiImportAccount,
  apiAddAddress,
  apiGetNetwork,
  apiAccountRename,
  apiAccountDelete,
  apiGetPrices
} from '../helpers/api';
import {
  capitalize,
  flattenTokens,
  updateSession,
  getSession,
  updateAccounts,
  parseError,
  saveLocal
} from '../helpers/utilities';
import { modalClose } from './_modal';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //

const DASHBOARD_GET_ACCOUNTS_FROM_SESSION = 'dashboard/DASHBOARD_GET_ACCOUNTS_FROM_SESSION';

const DASHBOARD_GET_TOKENS_REQUEST = 'dashboard/DASHBOARD_GET_TOKENS_REQUEST';
const DASHBOARD_GET_TOKENS_SUCCESS = 'dashboard/DASHBOARD_GET_TOKENS_SUCCESS';
const DASHBOARD_GET_TOKENS_FAILURE = 'dashboard/DASHBOARD_GET_TOKENS_FAILURE';

const DASHBOARD_GET_ALL_ACCOUNTS_REQUEST = 'dashboard/DASHBOARD_GET_ALL_ACCOUNTS_REQUEST';
const DASHBOARD_GET_ALL_ACCOUNTS_SUCCESS = 'dashboard/DASHBOARD_GET_ALL_ACCOUNTS_SUCCESS';
const DASHBOARD_GET_ALL_ACCOUNTS_FAILURE = 'dashboard/DASHBOARD_GET_ALL_ACCOUNTS_FAILURE';

const DASHBOARD_GENERATE_ACCOUNT_REQUEST = 'dashboard/DASHBOARD_GENERATE_ACCOUNT_REQUEST';
const DASHBOARD_GENERATE_ACCOUNT_SUCCESS = 'dashboard/DASHBOARD_GENERATE_ACCOUNT_SUCCESS';
const DASHBOARD_GENERATE_ACCOUNT_FAILURE = 'dashboard/DASHBOARD_GENERATE_ACCOUNT_FAILURE';

const DASHBOARD_IMPORT_ACCOUNT_REQUEST = 'dashboard/DASHBOARD_IMPORT_ACCOUNT_REQUEST';
const DASHBOARD_IMPORT_ACCOUNT_SUCCESS = 'dashboard/DASHBOARD_IMPORT_ACCOUNT_SUCCESS';
const DASHBOARD_IMPORT_ACCOUNT_FAILURE = 'dashboard/DASHBOARD_IMPORT_ACCOUNT_FAILURE';

const DASHBOARD_ADD_ADDRESS_REQUEST = 'dashboard/DASHBOARD_ADD_ADDRESS_REQUEST';
const DASHBOARD_ADD_ADDRESS_SUCCESS = 'dashboard/DASHBOARD_ADD_ADDRESS_SUCCESS';
const DASHBOARD_ADD_ADDRESS_FAILURE = 'dashboard/DASHBOARD_ADD_ADDRESS_FAILURE';

const DASHBOARD_RENAME_ACCOUNT_REQUEST = 'dashboard/DASHBOARD_RENAME_ACCOUNT_REQUEST';
const DASHBOARD_RENAME_ACCOUNT_SUCCESS = 'dashboard/DASHBOARD_RENAME_ACCOUNT_SUCCESS';
const DASHBOARD_RENAME_ACCOUNT_FAILURE = 'dashboard/DASHBOARD_RENAME_ACCOUNT_FAILURE';

const DASHBOARD_DELETE_ACCOUNT_REQUEST = 'dashboard/DASHBOARD_DELETE_ACCOUNT_REQUEST';
const DASHBOARD_DELETE_ACCOUNT_SUCCESS = 'dashboard/DASHBOARD_DELETE_ACCOUNT_SUCCESS';
const DASHBOARD_DELETE_ACCOUNT_FAILURE = 'dashboard/DASHBOARD_DELETE_ACCOUNT_FAILURE';

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

export const dashboardGetTokens = () => (dispatch, getState) => {
  dispatch({ type: DASHBOARD_GET_TOKENS_REQUEST });
  apiGetAllAccountsTokens()
    .then(({ data }) => {
      let accounts = getSession().accounts;
      for (let i = 0; i < accounts.length; i++) {
        accounts[i].tokens = data.accounts[i].tokens;
      }
      const crypto = flattenTokens(data.accounts);
      updateSession({ accounts, crypto });
      dispatch({
        type: DASHBOARD_GET_TOKENS_SUCCESS,
        payload: { accounts, crypto }
      });
      dispatch(dashboardGetPrices());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: DASHBOARD_GET_TOKENS_FAILURE });
    });
};

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

export const dashboardGenerateAccount = name => dispatch => {
  dispatch({ type: DASHBOARD_GENERATE_ACCOUNT_REQUEST });
  apiGenerateAccount(name)
    .then(({ data }) => {
      const { accounts, crypto } = updateAccounts(data.account);
      // changeHere
      updateSession({ accounts, crypto });
      dispatch({
        type: DASHBOARD_GENERATE_ACCOUNT_SUCCESS,
        payload: { accounts, crypto }
      });
      dispatch(dashboardGetAllAccounts());
      dispatch(modalClose());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: DASHBOARD_GENERATE_ACCOUNT_FAILURE });
    });
};

export const dashboardImportAccount = (name, address, privateKey) => dispatch => {
  dispatch({ type: DASHBOARD_IMPORT_ACCOUNT_REQUEST });
  apiImportAccount(name, address, privateKey)
    .then(({ data }) => {
      const { accounts, crypto } = updateAccounts(data.account);
      // changeHere
      updateSession({ accounts, crypto });
      dispatch({
        type: DASHBOARD_IMPORT_ACCOUNT_SUCCESS,
        payload: { accounts, crypto }
      });
      dispatch(dashboardGetAllAccounts());
      dispatch(modalClose());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: DASHBOARD_IMPORT_ACCOUNT_FAILURE });
    });
};

export const dashboardAddAddress = (name, address) => dispatch => {
  dispatch({ type: DASHBOARD_ADD_ADDRESS_REQUEST });
  apiAddAddress(name, address)
    .then(({ data }) => {
      const { accounts, crypto } = updateAccounts(data.account);
      // changeHere
      updateSession({ accounts, crypto });
      dispatch({
        type: DASHBOARD_ADD_ADDRESS_SUCCESS,
        payload: { accounts, crypto }
      });
      dispatch(dashboardGetAllAccounts());
      dispatch(modalClose());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: DASHBOARD_ADD_ADDRESS_FAILURE });
    });
};

export const dashboardRenameAccount = (address, name) => dispatch => {
  dispatch({ type: DASHBOARD_RENAME_ACCOUNT_REQUEST });
  apiAccountRename(address, name)
    .then(({ data }) => {
      const { accounts, crypto } = updateAccounts(data.account);
      // changeHere
      updateSession({ accounts, crypto });
      dispatch({
        type: DASHBOARD_RENAME_ACCOUNT_SUCCESS,
        payload: { accounts, crypto }
      });
      dispatch(dashboardGetAllAccounts());
      dispatch(modalClose());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: DASHBOARD_RENAME_ACCOUNT_FAILURE });
    });
};

export const dashboardDeleteAccount = (address, code) => dispatch => {
  dispatch({ type: DASHBOARD_DELETE_ACCOUNT_REQUEST });
  apiAccountDelete(address, code)
    .then(({ data }) => {
      const { accounts, crypto } = updateAccounts(null, address);
      // changeHere
      updateSession({ accounts, crypto });
      dispatch({
        type: DASHBOARD_DELETE_ACCOUNT_SUCCESS,
        payload: { accounts, crypto }
      });
      dispatch(dashboardGetAllAccounts());
      dispatch(modalClose());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: DASHBOARD_DELETE_ACCOUNT_FAILURE });
    });
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
    case DASHBOARD_GET_TOKENS_REQUEST:
    case DASHBOARD_GET_ALL_ACCOUNTS_REQUEST:
      return { ...state, fetching: true, error: false };
    case DASHBOARD_RENAME_ACCOUNT_REQUEST:
    case DASHBOARD_DELETE_ACCOUNT_REQUEST:
    case DASHBOARD_GENERATE_ACCOUNT_REQUEST:
    case DASHBOARD_IMPORT_ACCOUNT_REQUEST:
    case DASHBOARD_ADD_ADDRESS_REQUEST:
      return { ...state, error: false };
    case DASHBOARD_RENAME_ACCOUNT_SUCCESS:
    case DASHBOARD_DELETE_ACCOUNT_SUCCESS:
    case DASHBOARD_GENERATE_ACCOUNT_SUCCESS:
    case DASHBOARD_IMPORT_ACCOUNT_SUCCESS:
    case DASHBOARD_ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        accounts: action.payload.accounts,
        crypto: action.payload.crypto
      };
    case DASHBOARD_GET_TOKENS_SUCCESS:
    case DASHBOARD_GET_ALL_ACCOUNTS_SUCCESS:
      return {
        ...state,
        fetching: false,
        accounts: action.payload.accounts,
        crypto: action.payload.crypto
      };
    case DASHBOARD_RENAME_ACCOUNT_FAILURE:
    case DASHBOARD_DELETE_ACCOUNT_FAILURE:
    case DASHBOARD_GENERATE_ACCOUNT_FAILURE:
    case DASHBOARD_IMPORT_ACCOUNT_FAILURE:
    case DASHBOARD_ADD_ADDRESS_FAILURE:
      return { ...state, error: true };
    case DASHBOARD_GET_TOKENS_FAILURE:
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
