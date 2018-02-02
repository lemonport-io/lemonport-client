import crypto from 'crypto-browserify';
import BigNumber from 'bignumber.js';
import { web3 } from './web3';
import errors from '../libraries/errors.json';

/**
 * @desc save to local storage
 * @param  {String}  [key='']
 * @param  {Object}  [data={}]
 * @return {Object}
 */
export const saveLocal = (key = '', data = {}) => localStorage.setItem(key, JSON.stringify(data));

/**
 * @desc get from local storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const getLocal = (key = '', data = {}) => JSON.parse(localStorage.getItem(key));

/**
 * @desc create authenticated user session
 * @param  {String}   [token='']
 * @param  {String}   [email='']
 * @param  {Boolean}  [verified=false]
 * @param  {Boolean}  [twoFactor=false]
 * @param  {Date}     [expires=Date.now() + 180000]
 * @param  {Array}    [accounts=[]]
 * @param  {Array}    [crypto=[]]
 * @param
 * @return {Session}
 */
export const setSession = ({
  token = '',
  email = '',
  verified = false,
  twoFactor = false,
  expires = Date.now() + 1800000, // 30mins
  accounts = [],
  crypto = []
}) => {
  const session = {
    token,
    email,
    verified,
    twoFactor,
    expires,
    accounts,
    crypto
  };
  setTimeout(() => window.browserHistory.push('/signout'), 1800000); // 30mins
  localStorage.setItem('USER_SESSION', JSON.stringify(session));
};

/**
 * @desc get session as an object
 * @return {Object}
 */
export const getSession = () => {
  const session = localStorage.getItem('USER_SESSION');
  return JSON.parse(session);
};

/**
 * @desc update with new session data
 * @param  {Session}  [updatedSession]
 * @return {Session}
 */
export const updateSession = updatedSession => {
  const newSession = { ...getSession(), ...updatedSession };
  return localStorage.setItem('USER_SESSION', JSON.stringify(newSession));
};

/**
 * @desc flatten tokens
 * @param  {Object} [accounts]
 * @return {String}
 */
export const flattenTokens = accounts => {
  const crypto = ['ETH'];
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].tokens) {
      for (let j = 0; j < accounts[i].tokens.length; j++) {
        if (!crypto.includes(accounts[i].tokens[j].symbol)) {
          crypto.push(accounts[i].tokens[j].symbol);
        }
      }
    }
  }
  return crypto;
};

/**
 * @desc update accounts
 * @param  {Object}  [account=null]
 * @param  {String}  [address='']
 * @return {Session}
 */
export const updateAccounts = (account = null, address = '') => {
  const accountAddress = account ? account.address : address;
  const prevAccounts = getSession().accounts;
  const accounts = [];
  let isNew = true;
  for (let i = 0; i < prevAccounts.length; i++) {
    if (prevAccounts[i].address === accountAddress) {
      if (!account && address) {
        break;
      } else {
        isNew = false;
        accounts.push(account);
      }
    } else {
      accounts.push(prevAccounts[i]);
    }
  }
  if (account && isNew) {
    accounts.push(account);
  }
  const crypto = flattenTokens(accounts);
  updateSession({ accounts, crypto });
  return { accounts, crypto };
};

/**
 * @desc delete session
 * @return {Void}
 */
export const deleteSession = () => {
  localStorage.removeItem('USER_SESSION');
};

/**
 * @desc parse error code message
 * @param  {Error} error
 * @return {String}
 */
export const parseError = error => {
  if (error.error && error.message) {
    return errors[error.message];
  } else if (!error.response || !errors[error.response.data.message]) {
    console.error(error);
    return `Something went wrong, please try again`;
  }
  return errors[error.response.data.message];
};

/**
 * @desc capitalize string
 * @param  {String} [string]
 * @return {String}
 */
export const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * @desc decrypts string with secret
 * @param  {String}  [string]
 * @param  {String}  [secret]
 * @return {String}
 */
export const decrypt = (string, secret) => {
  let decipher = crypto.createDecipher('aes-256-cbc', secret);
  let decrypted = decipher.update(string, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * @desc convert ether to current native currency
 * @param  {String} [value='']
 * @param  {String} [crypto='ETH']
 * @return {String}
 */
export const convertToNative = (value = '', crypto = 'ETH') => {
  const prices = getLocal('NATIVE_PRICES');
  if (!prices[crypto]) return '';
  const unformatted = `${Number(value) * Number(prices[crypto])}`;
  const native = prices.native;
  const decimals = native === 'ETH' || native === 'BTC' ? 8 : 2;
  const formatted = BigNumber(unformatted).toFormat(decimals);
  return `${formatted} ${native}`;
};

/**
 * @desc pad string to specific width and padding
 * @param  {String} n
 * @param  {Number} width
 * @param  {String} z
 * @return {String}
 */
export const padLeft = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * @desc get ethereum contract call data string
 * @param  {String} func
 * @param  {Array}  arrVals
 * @return {String}
 */
export const getDataString = (func, arrVals) => {
  let val = '';
  for (let i = 0; i < arrVals.length; i++) val += padLeft(arrVals[i], 64);
  const data = func + val;
  return data;
};

/**
 * @desc get naked ethereum address
 * @param  {String} address
 * @return {String}
 */
export const getNakedAddress = address => address.toLowerCase().replace('0x', '');

/**
 * @desc convert to checksum addres
 * @param  {String} address
 * @return {String}
 */
export const toChecksumAddress = address => {
  if (typeof address === 'undefined') return '';

  address = address.toLowerCase().replace('0x', '');
  const addressHash = web3.utils.sha3(address).replace('0x', '');
  let checksumAddress = '0x';

  for (let i = 0; i < address.length; i++) {
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }
  return checksumAddress;
};

/**
 * @desc check if address is checkum
 * @param  {String} address
 * @return {String}
 */
export const isChecksumAddress = address => address === toChecksumAddress(address);

/**
 * @desc sanitize hexadecimal string
 * @param  {String} address
 * @return {String}
 */
export const sanitizeHex = hex => {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  if (hex === '') return '';
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return '0x' + hex;
};

/**
 * @desc convert from wei to ether
 * @param  {Number} wei
 * @return {String}
 */
export const fromWei = wei => web3.utils.fromWei(String(wei));

/**
 * @desc convert from ether to wei
 * @param  {Number} ether
 * @return {String}
 */
export const toWei = ether => web3.utils.toWei(String(ether));

/**
 * @desc capitalise string
 * @param {string} string
 * @return {Void}
 */
export const capitalise = string => string.slice(0, 1).toUpperCase() + string.slice(1);

/**
 * @desc returns url parameter value
 * @param  {String} parameter
 * @param  {String} url
 * @return {String}
 */
export const getUrlParameter = (
  parameter,
  url = typeof window !== 'undefined' ? window.location.href : ''
) => {
  let name = parameter.replace(/[[]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
