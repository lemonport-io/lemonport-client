import {
  apiGetGasPrices,
  apiGetBitcoinTxFeeEstimate,
  apiSendBitcoin,
  apiSendEther,
  apiSendToken
} from '../helpers/api';
import { notificationShow } from './_notification';
import { parseError } from '../helpers/utilities';
import { getTransactionFee } from '../helpers/web3';
import { fromWei, fromSatoshi } from '../helpers/utilities';

// -- Constants ------------------------------------------------------------- //

const SEND_GET_TRANSACTION_FEE_REQUEST = 'send/SEND_GET_TRANSACTION_FEE_REQUEST';
const SEND_GET_TRANSACTION_FEE_SUCCESS = 'send/SEND_GET_TRANSACTION_FEE_SUCCESS';
const SEND_GET_TRANSACTION_FEE_FAILURE = 'send/SEND_GET_TRANSACTION_FEE_FAILURE';

const SEND_UPDATE_GAS_PRICE_REQUEST = 'send/SEND_UPDATE_GAS_PRICE_REQUEST';
const SEND_UPDATE_GAS_PRICE_SUCCESS = 'send/SEND_UPDATE_GAS_PRICE_SUCCESS';
const SEND_UPDATE_GAS_PRICE_FAILURE = 'send/SEND_UPDATE_GAS_PRICE_FAILURE';

const SEND_BITCOIN_API_REQUEST = 'send/SEND_BITCOIN_API_REQUEST';
const SEND_BITCOIN_API_SUCCESS = 'send/SEND_BITCOIN_API_SUCCESS';
const SEND_BITCOIN_API_FAILURE = 'send/SEND_BITCOIN_API_FAILURE';

const SEND_ETHER_API_REQUEST = 'send/SEND_ETHER_API_REQUEST';
const SEND_ETHER_API_SUCCESS = 'send/SEND_ETHER_API_SUCCESS';
const SEND_ETHER_API_FAILURE = 'send/SEND_ETHER_API_FAILURE';

const SEND_TOKEN_API_REQUEST = 'send/SEND_TOKEN_API_REQUEST';
const SEND_TOKEN_API_SUCCESS = 'send/SEND_TOKEN_API_SUCCESS';
const SEND_TOKEN_API_FAILURE = 'send/SEND_TOKEN_API_FAILURE';

const SEND_UPDATE_RECIPIENT = 'send/SEND_UPDATE_RECIPIENT';
const SEND_UPDATE_AMOUNT = 'send/SEND_UPDATE_AMOUNT';
const SEND_UPDATE_CODE = 'send/SEND_UPDATE_CODE';

const SEND_CLEAR_FIELDS = 'send/SEND_CLEAR_FIELDS';

// -- Actions --------------------------------------------------------------- //

export const sendGetTransactionFee = currency => (dispatch, getState) => {
  dispatch({ type: SEND_GET_TRANSACTION_FEE_REQUEST });
  if (currency === 'ETH') {
    apiGetGasPrices()
      .then(({ data }) => {
        const gasPrice = parseInt(data.fast, 10) / 10;
        const txFee = fromWei(21000 * gasPrice * 1e9);
        dispatch({
          type: SEND_GET_TRANSACTION_FEE_SUCCESS,
          payload: { txFee, gasPrice }
        });
      })
      .catch(error => {
        console.error(error);
        dispatch(notificationShow(`Failed to get Ethereum Gas prices`, true));
        dispatch({ type: SEND_GET_TRANSACTION_FEE_FAILURE });
      });
  } else {
    apiGetBitcoinTxFeeEstimate()
      .then(({ data }) => {
        const txFee = fromSatoshi(data.fastestFee * 192).toFixed(8);
        dispatch({
          type: SEND_GET_TRANSACTION_FEE_SUCCESS,
          payload: { txFee, gasPrice: 0 }
        });
      })
      .catch(error => {
        console.error(error);
        dispatch(notificationShow(`Failed to get Ethereum Gas prices`, true));
        dispatch({ type: SEND_GET_TRANSACTION_FEE_FAILURE });
      });
  }
};

export const sendUpdateGasPrice = (newPrice, currency) => (dispatch, getState) => {
  const { send } = getState();
  const { address, recipient, amount, gasPrice } = send;
  if (currency !== 'ETH' && recipient.length < 42) {
    dispatch(notificationShow(`Recipient Address and Amount missing`, true));
    return;
  }
  dispatch({ type: SEND_UPDATE_GAS_PRICE_REQUEST });
  getTransactionFee({ currency, address, recipient, amount, gasPrice })
    .then(txFee =>
      dispatch({
        type: SEND_UPDATE_GAS_PRICE_SUCCESS,
        payload: { txFee, gasPrice }
      })
    )
    .catch(error => {
      console.error(error);
      dispatch(notificationShow(`Failed to estimate Transaction fee`, true));
      dispatch({ type: SEND_UPDATE_GAS_PRICE_FAILURE });
    });
};

export const sendBitcoinApi = ({ address, recipient, amount, code }) => dispatch => {
  dispatch({ type: SEND_BITCOIN_API_REQUEST });
  apiSendBitcoin(address, recipient, amount, code)
    .then(({ data }) =>
      dispatch({
        type: SEND_BITCOIN_API_SUCCESS,
        payload: data.txHash
      })
    )
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: SEND_BITCOIN_API_FAILURE });
    });
};

export const sendEtherApi = ({ address, recipient, amount, gasPrice, code }) => dispatch => {
  dispatch({ type: SEND_ETHER_API_REQUEST });
  const _gasPrice = String(parseInt(gasPrice, 10) * 10 ** 9);
  apiSendEther(address, recipient, amount, _gasPrice, code)
    .then(({ data }) =>
      dispatch({
        type: SEND_ETHER_API_SUCCESS,
        payload: data.txHash
      })
    )
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: SEND_ETHER_API_FAILURE });
    });
};

export const sendTokenApi = ({ address, recipient, amount, token, gasPrice, code }) => dispatch => {
  dispatch({ type: SEND_TOKEN_API_REQUEST });
  const _gasPrice = String(parseInt(gasPrice, 10) * 10 ** 9);
  apiSendToken(address, recipient, amount, token, _gasPrice, code)
    .then(({ data }) =>
      dispatch({
        type: SEND_TOKEN_API_SUCCESS,
        payload: data.txHash
      })
    )
    .catch(error => {
      console.error(error);
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: SEND_TOKEN_API_FAILURE });
    });
};

export const sendUpdateRecipient = recipient => ({
  type: SEND_UPDATE_RECIPIENT,
  payload: recipient
});

export const sendUpdateAmount = amount => ({ type: SEND_UPDATE_AMOUNT, payload: amount });

export const sendUpdateCode = code => ({ type: SEND_UPDATE_CODE, payload: code });

export const sendClearFields = () => ({ type: SEND_CLEAR_FIELDS });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetchingGasPrices: false,
  txFee: '',
  gasPrice: 0,
  fetching: false,
  recipient: '',
  amount: '',
  transaction: '',
  code: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEND_GET_TRANSACTION_FEE_REQUEST:
    case SEND_UPDATE_GAS_PRICE_REQUEST:
      return { ...state, fetchingGasPrices: true };
    case SEND_GET_TRANSACTION_FEE_SUCCESS:
    case SEND_UPDATE_GAS_PRICE_SUCCESS:
      return {
        ...state,
        fetchingGasPrices: false,
        txFee: action.payload.txFee,
        gasPrice: action.payload.gasPrice
      };
    case SEND_GET_TRANSACTION_FEE_FAILURE:
    case SEND_UPDATE_GAS_PRICE_FAILURE:
      return { ...state, fetchingGasPrices: false, txFee: '', gasPrice: 0 };
    case SEND_BITCOIN_API_REQUEST:
    case SEND_ETHER_API_REQUEST:
    case SEND_TOKEN_API_REQUEST:
      return { ...state, fetching: true };
    case SEND_BITCOIN_API_SUCCESS:
    case SEND_ETHER_API_SUCCESS:
    case SEND_TOKEN_API_SUCCESS:
      return {
        ...state,
        fetching: false,
        transaction: action.payload
      };
    case SEND_BITCOIN_API_FAILURE:
    case SEND_ETHER_API_FAILURE:
    case SEND_TOKEN_API_FAILURE:
      return { ...state, fetching: false, transaction: '', code: '' };
    case SEND_UPDATE_RECIPIENT:
      return { ...state, recipient: action.payload };
    case SEND_UPDATE_AMOUNT:
      return { ...state, amount: action.payload };
    case SEND_UPDATE_CODE:
      return { ...state, code: action.payload };
    case SEND_CLEAR_FIELDS:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
