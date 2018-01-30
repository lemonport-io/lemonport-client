import { apiGetGasPrices, apiSendEther, apiSendToken, apiVerifyTwoFactor } from '../helpers/api';
import { notificationShow } from './_notification';
import { parseError } from '../helpers/utilities';
import { sendSignedTransaction, transferToken, getTransactionFee } from '../helpers/web3';
import { fromWei } from '../helpers/utilities';

// -- Constants ------------------------------------------------------------- //

const SEND_GET_GAS_PRICES_REQUEST = 'send/SEND_GET_GAS_PRICES_REQUEST';
const SEND_GET_GAS_PRICES_SUCCESS = 'send/SEND_GET_GAS_PRICES_SUCCESS';
const SEND_GET_GAS_PRICES_FAILURE = 'send/SEND_GET_GAS_PRICES_FAILURE';

const SEND_UPDATE_GAS_PRICE_REQUEST = 'send/SEND_UPDATE_GAS_PRICE_REQUEST';
const SEND_UPDATE_GAS_PRICE_SUCCESS = 'send/SEND_UPDATE_GAS_PRICE_SUCCESS';
const SEND_UPDATE_GAS_PRICE_FAILURE = 'send/SEND_UPDATE_GAS_PRICE_FAILURE';

const SEND_ETHER_API_REQUEST = 'send/SEND_ETHER_API_REQUEST';
const SEND_ETHER_API_SUCCESS = 'send/SEND_ETHER_API_SUCCESS';
const SEND_ETHER_API_FAILURE = 'send/SEND_ETHER_API_FAILURE';

const SEND_ETHER_CLIENT_REQUEST = 'send/SEND_ETHER_CLIENT_REQUEST';
const SEND_ETHER_CLIENT_SUCCESS = 'send/SEND_ETHER_CLIENT_SUCCESS';
const SEND_ETHER_CLIENT_FAILURE = 'send/SEND_ETHER_CLIENT_FAILURE';

const SEND_TOKEN_API_REQUEST = 'send/SEND_TOKEN_API_REQUEST';
const SEND_TOKEN_API_SUCCESS = 'send/SEND_TOKEN_API_SUCCESS';
const SEND_TOKEN_API_FAILURE = 'send/SEND_TOKEN_API_FAILURE';

const SEND_TOKEN_CLIENT_REQUEST = 'send/SEND_TOKEN_CLIENT_REQUEST';
const SEND_TOKEN_CLIENT_SUCCESS = 'send/SEND_TOKEN_CLIENT_SUCCESS';
const SEND_TOKEN_CLIENT_FAILURE = 'send/SEND_TOKEN_CLIENT_FAILURE';

const SEND_UPDATE_RECIPIENT = 'send/SEND_UPDATE_RECIPIENT';
const SEND_UPDATE_AMOUNT = 'send/SEND_UPDATE_AMOUNT';
const SEND_UPDATE_SELECTED = 'send/SEND_UPDATE_SELECTED';
const SEND_UPDATE_CODE = 'send/SEND_UPDATE_CODE';
const SEND_UPDATE_PRIVATE_KEY = 'send/SEND_UPDATE_PRIVATE_KEY';

const SEND_CLEAR_FIELDS = 'send/SEND_CLEAR_FIELDS';

// -- Actions --------------------------------------------------------------- //

export const sendGetGasPrices = () => (dispatch, getState) => {
  dispatch({ type: SEND_GET_GAS_PRICES_REQUEST });
  apiGetGasPrices()
    .then(({ data }) => {
      data.fastest = parseInt(data.fastest, 10) / 10;
      data.fast = parseInt(data.fast, 10) / 10;
      data.average = parseInt(data.average, 10) / 10;
      data.safeLow = parseInt(data.safeLow, 10) / 10;
      const txFee = fromWei(21000 * data.average * 10 ** 9);
      dispatch({
        type: SEND_GET_GAS_PRICES_SUCCESS,
        payload: { gasPrices: data, txFee }
      });
    })
    .catch(error => {
      console.error(error);
      dispatch(notificationShow(`Failed to get Ethereum Gas prices`, true));
      dispatch({ type: SEND_GET_GAS_PRICES_FAILURE });
    });
};

export const sendUpdateGasPrice = newPrice => (dispatch, getState) => {
  const { send } = getState();
  const { selected, address, recipient, amount, gasPrice } = send;
  const _gasPrice = newPrice || gasPrice;
  if (selected !== 'ETH' && recipient.length < 42) {
    dispatch(notificationShow(`Recipient Address and Amount missing`, true));
    return;
  }
  dispatch({ type: SEND_UPDATE_GAS_PRICE_REQUEST });
  getTransactionFee({ selected, address, recipient, amount, gasPrice: _gasPrice })
    .then(txFee =>
      dispatch({
        type: SEND_UPDATE_GAS_PRICE_SUCCESS,
        payload: { txFee, gasPrice: _gasPrice }
      })
    )
    .catch(error => {
      console.error(error);
      dispatch(notificationShow(`Failed to estimate Transaction fee`, true));
      dispatch({ type: SEND_UPDATE_GAS_PRICE_FAILURE });
    });
};

export const sendUpdateSelected = selected => (dispatch, getState) => {
  dispatch({ type: SEND_UPDATE_SELECTED, payload: selected });
  dispatch(sendUpdateGasPrice());
};

const verifyTwoFactor = code =>
  new Promise((resolve, reject) => {
    if (!code) resolve();
    apiVerifyTwoFactor()
      .then(resolve)
      .catch(reject);
  });

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

export const sendEtherClient = ({
  address,
  recipient,
  amount,
  privateKey,
  gasPrice,
  code
}) => dispatch => {
  const _gasPrice = String(parseInt(gasPrice, 10) * 10 ** 9);
  dispatch({ type: SEND_ETHER_CLIENT_REQUEST });
  verifyTwoFactor(code)
    .then(() =>
      sendSignedTransaction({
        from: address,
        to: recipient,
        value: amount,
        gasPrice: _gasPrice,
        privateKey
      })
        .then(txHash =>
          dispatch({
            type: SEND_ETHER_CLIENT_SUCCESS,
            payload: txHash
          })
        )
        .catch(error => {
          console.error(error);
          const message = parseError(error);
          dispatch(notificationShow(message, true));
          dispatch({ type: SEND_ETHER_CLIENT_FAILURE });
        })
    )
    .catch(error => {
      console.error(error);
      dispatch(notificationShow(error.message, true));
      dispatch({ type: SEND_ETHER_CLIENT_FAILURE });
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

export const sendTokenClient = ({
  address,
  recipient,
  amount,
  token,
  privateKey,
  gasPrice,
  code
}) => dispatch => {
  const _gasPrice = String(parseInt(gasPrice, 10) * 10 ** 9);
  dispatch({ type: SEND_TOKEN_CLIENT_REQUEST });
  verifyTwoFactor(code)
    .then(() =>
      transferToken({
        tokenSymbol: token,
        from: address,
        to: recipient,
        amount: amount,
        gasPrice: _gasPrice,
        privateKey: privateKey
      })
        .then(txHash =>
          dispatch({
            type: SEND_TOKEN_CLIENT_SUCCESS,
            payload: txHash
          })
        )
        .catch(error => {
          console.error(error);
          const message = parseError(error);
          dispatch(notificationShow(message, true));
          dispatch({ type: SEND_TOKEN_CLIENT_FAILURE });
        })
    )
    .catch(error => {
      console.error(error);
      dispatch(notificationShow(error.message, true));
      dispatch({ type: SEND_TOKEN_CLIENT_FAILURE });
    });
};

export const sendUpdateRecipient = recipient => ({
  type: SEND_UPDATE_RECIPIENT,
  payload: recipient
});

export const sendUpdateAmount = amount => ({ type: SEND_UPDATE_AMOUNT, payload: amount });

export const sendUpdateCode = code => ({ type: SEND_UPDATE_CODE, payload: code });

export const sendUpdatePrivateKey = privateKey => ({
  type: SEND_UPDATE_PRIVATE_KEY,
  payload: privateKey
});

export const sendClearFields = () => ({ type: SEND_CLEAR_FIELDS });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetchingGasPrices: false,
  txFee: '',
  gasPrices: {},
  gasPrice: 0,
  fetching: false,
  recipient: '',
  amount: '',
  transaction: '',
  privateKey: '',
  selected: 'ETH',
  code: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEND_GET_GAS_PRICES_REQUEST:
      return { ...state, fetchingGasPrices: true };
    case SEND_GET_GAS_PRICES_SUCCESS:
      return {
        ...state,
        fetchingGasPrices: false,
        gasPrices: action.payload.gasPrices,
        gasPrice: action.payload.gasPrices.average,
        txFee: action.payload.txFee
      };
    case SEND_GET_GAS_PRICES_FAILURE:
      return { ...state, fetchingGasPrices: false, gasPrices: {}, gasPrice: 0, txFee: '' };
    case SEND_UPDATE_GAS_PRICE_REQUEST:
      return { ...state, fetchingGasPrices: true };
    case SEND_UPDATE_GAS_PRICE_SUCCESS:
      return {
        ...state,
        fetchingGasPrices: false,
        gasPrice: action.payload.gasPrice,
        txFee: action.payload.txFee
      };
    case SEND_UPDATE_GAS_PRICE_FAILURE:
      return { ...state, fetchingGasPrices: false, gasPrice: 0, txFee: '' };
    case SEND_ETHER_API_REQUEST:
    case SEND_ETHER_CLIENT_REQUEST:
    case SEND_TOKEN_API_REQUEST:
    case SEND_TOKEN_CLIENT_REQUEST:
      return { ...state, fetching: true };
    case SEND_ETHER_API_SUCCESS:
    case SEND_TOKEN_API_SUCCESS:
      return {
        ...state,
        fetching: false,
        gasPrices: {},
        transaction: action.payload
      };
    case SEND_ETHER_CLIENT_SUCCESS:
    case SEND_TOKEN_CLIENT_SUCCESS:
      return {
        ...state,
        fetching: false,
        gasPrices: {},
        transaction: action.payload,
        privateKey: ''
      };
    case SEND_ETHER_API_FAILURE:
    case SEND_TOKEN_API_FAILURE:
      return { ...state, fetching: false, transaction: '', code: '' };
    case SEND_ETHER_CLIENT_FAILURE:
    case SEND_TOKEN_CLIENT_FAILURE:
      return {
        ...state,
        fetching: false,
        transaction: '',
        privateKey: '',
        code: ''
      };
    case SEND_UPDATE_RECIPIENT:
      return { ...state, recipient: action.payload };
    case SEND_UPDATE_AMOUNT:
      return { ...state, amount: action.payload };
    case SEND_UPDATE_SELECTED:
      return { ...state, selected: action.payload };
    case SEND_UPDATE_CODE:
      return { ...state, code: action.payload };
    case SEND_UPDATE_PRIVATE_KEY:
      return {
        ...state,
        privateKey: action.payload
      };
    case SEND_CLEAR_FIELDS:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
