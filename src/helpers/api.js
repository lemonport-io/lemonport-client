import axios from 'axios';
import { getSession } from '../helpers/utilities';

/**
 * Configuration for  api instance
 * @type axios instance
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

/**
 * @desc get network
 * @return {Promise}
 */
export const apiGetNetwork = () => api.get('/network');

/**
 * @desc signIn user
 * @param  {String} [email='']
 * @param  {String} [password='']
 * @return {Promise}
 */
export const apiSignIn = (email = '', password = '') =>
  api.post('/users/signin', { email, password });

/**
 * @desc signIn user with two factor
 * @param  {String} [email='']
 * @param  {String} [password='']
 * @param  {String} [code='']
 * @return {Promise}
 */
export const apiSignInTwoFactor = (email = '', password = '', code = '') =>
  api.post('/users/signin-two-factor', { email, password, code });

/**
 * @desc signUp user
 * @param  {String} [email='']
 * @param  {String} [password='']
 * @return {Promise}
 */
export const apiSignUp = (email = '', password = '') =>
  api.post('/users/signup', { email, password });

/**
 * @desc get addresses
 * @param  {String} [token='']
 * @return {Promise}
 */
export const apiGetAddresses = () => {
  const sessionToken = getSession().token;
  return api.get('/accounts/addresses', { headers: { Authorization: sessionToken } });
};

/**
 * @desc get all accounts
 * @return {Promise}
 */
export const apiGetAllAccounts = () => {
  const sessionToken = getSession().token;
  return api.get('/accounts/all', { headers: { Authorization: sessionToken } });
};

/**
 * @desc get all accounts tokens
 * @return {Promise}
 */
export const apiGetAllAccountsTokens = () => {
  const sessionToken = getSession().token;
  return api.get('/accounts/tokens', { headers: { Authorization: sessionToken } });
};

/**
 * @desc get all accounts balances
 * @return {Promise}
 */
export const apiGetAllAccountsBalances = () => {
  const sessionToken = getSession().token;
  return api.get('/accounts/balances', { headers: { Authorization: sessionToken } });
};

/**
 * @desc generate new account
 * @param  {String}   [name='']
 * @return {Promise}
 */
export const apiGenerateAccount = (name = '') => {
  const sessionToken = getSession().token;
  return api.post('/accounts/generate', { name }, { headers: { Authorization: sessionToken } });
};

/**
 * @desc import new account
 * @param  {String}   [name='']
 * @param  {String}   [address='']
 * @param  {String}   [privateKey='']
 * @return {Promise}
 */
export const apiImportAccount = (name = '', address = '', privateKey = '') => {
  const sessionToken = getSession().token;
  return api.post(
    '/accounts/import',
    { name, address, privateKey },
    { headers: { Authorization: sessionToken } }
  );
};

/**
 * @desc add address (cold wallet)
 * @param  {String}   [name='']
 * @param  {String}   [address='']
 * @return {Promise}
 */
export const apiAddAddress = (name = '', address = '') => {
  const sessionToken = getSession().token;
  return api.post(
    '/accounts/add-address',
    { name, address },
    { headers: { Authorization: sessionToken } }
  );
};

/**
 * @desc rename account name
 * @param  {String}   [address='']
 * @param  {String}   [name='']
 * @return {Promise}
 */
export const apiAccountRename = (address = '', name = '') => {
  const sessionToken = getSession().token;
  return api.post(
    '/accounts/rename',
    { address, name },
    { headers: { Authorization: sessionToken } }
  );
};

/**
 * @desc delete account
 * @param  {String}   [address='']
 * @param  {String}   [code='']
 * @return {Promise}
 */
export const apiAccountDelete = (address = '', code = '') => {
  const sessionToken = getSession().token;
  return api.post(
    '/accounts/delete',
    { address, code },
    { headers: { Authorization: sessionToken } }
  );
};

/**
 * @desc send ether to recipient
 * @param  {String}   [address='']
 * @param  {String}   [recipient='']
 * @param  {String}   [amount='']
 * @param  {String}   [gasPrice='']
 * @param  {String}   [code='']
 * @return {Promise}
 */
export const apiSendEther = (
  address = '',
  recipient = '',
  amount = '',
  gasPrice = '',
  code = ''
) => {
  const sessionToken = getSession().token;
  return api.post(
    '/ethereum/send-ether',
    { from: address, to: recipient, value: amount, gasPrice, code },
    { headers: { Authorization: sessionToken } }
  );
};

/**
 * @desc send ether to recipient
 * @param  {String}   [address='']
 * @param  {String}   [recipient='']
 * @param  {String}   [amount='']
 * @param  {String}   [token='']
 * @param  {String}   [gasPrice='']
 * @param  {String}   [code='']
 * @return {Promise}
 */
export const apiSendToken = (
  address = '',
  recipient = '',
  amount = '',
  token = '',
  gasPrice = '',
  code = ''
) => {
  const sessionToken = getSession().token;
  return api.post(
    '/ethereum/send-token',
    { from: address, to: recipient, amount, token, gasPrice, code },
    { headers: { Authorization: sessionToken } }
  );
};

/**
 * @desc get prices
 * @param {Array}   [crypto=[]]
 * @param {Array}   [native=[]]
 * @return {Promise}
 */
export const apiGetPrices = (crypto = [], native = []) => {
  const cryptoQuery = JSON.stringify(crypto).replace(/[[\]"]/gi, '');
  const nativeQuery = JSON.stringify(native).replace(/[[\]"]/gi, '');
  return axios.get(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptoQuery}&tsyms=${nativeQuery}`
  );
};

/**
 * @desc resend verify email
 * @return {Promise}
 */
export const apiResendVerifyEmail = () => {
  const sessionToken = getSession().token;
  return api.get('/users/resend-verify-email', { headers: { Authorization: sessionToken } });
};

/**
 * @desc verify email hash
 * @param {String}   [hash='']
 * @return {Promise}
 */
export const apiEmailVerify = (hash = '') => api.get(`/users/verify/${hash}`);

/**
 * @desc check email is verified
 * @return {Promise}
 */
export const apiCheckEmail = () => {
  const sessionToken = getSession().token;
  return api.get('/users/email-verified', { headers: { Authorization: sessionToken } });
};

/**
 * @desc request to enable two factor
 * @return {Promise}
 */
export const apiRequestTwoFactor = () => {
  const sessionToken = getSession().token;
  return api.get('/users/request-two-factor', { headers: { Authorization: sessionToken } });
};

/**
 * @desc enable two factor auth
 * @param  {String}   [code]
 * @return {Promise}
 */
export const apiEnableTwoFactor = (code = '') => {
  const sessionToken = getSession().token;
  return api.post(
    '/users/enable-two-factor',
    { code },
    { headers: { Authorization: sessionToken } }
  );
};

/**
 * @desc check two factor is enabled
 * @return {Promise}
 */
export const apiCheckTwoFactor = () => {
  const sessionToken = getSession().token;
  return api.get('/users/check-two-factor', { headers: { Authorization: sessionToken } });
};

/**
 * @desc verify two factor code
 * @param  {String}   [code]
 * @return {Promise}
 */
export const apiVerifyTwoFactor = (code = '') => {
  const sessionToken = getSession().token;
  return api.post(
    '/users/verify-two-factor',
    { code },
    { headers: { Authorization: sessionToken } }
  );
};

/**
 * @desc get ethereum gas prices
 * @return {Promise}
 */
export const apiGetGasPrices = () => axios.get(`https://ethgasstation.info/json/ethgasAPI.json`);
