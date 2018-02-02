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
 * @desc check if user exists
 * @param  {String} [email='']
 * @return {Promise}
 */
export const apiCheckUser = (email = '') => api.post('/users/check-user', { email });

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
 * @param  {Object} [{ firstName = '', lastName, email = '', password = '', facebookID = '' }]
 * @return {Promise}
 */
export const apiSignUp = ({
  firstName = '',
  lastName,
  email = '',
  password = '',
  facebookID = ''
}) => api.post('/users/signup', { firstName, lastName, email, password, facebookID });

/**
 * @desc get all accounts
 * @return {Promise}
 */
export const apiGetAllAccounts = () => {
  const sessionToken = getSession().token;
  return api.get('/accounts/all', { headers: { Authorization: sessionToken } });
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
