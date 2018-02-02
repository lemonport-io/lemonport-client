/**
 * @desc initiate FB instance
 * @return {Promise}
 */
export const initFB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.FB !== 'undefined') {
      resolve();
    } else {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK,
          cookie: true,
          xfbml: true,
          version: 'v2.11'
        });
        resolve();
      };
      (function(d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  });
};

/**
 * @desc check user Login state
 * @return {Promise}
 */
export const checkStatusFB = () => {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus(response => {
      response.status === 'connected' ||
      response.status === 'not_authorized' ||
      response.status === 'unknown'
        ? resolve(response)
        : reject(response);
    });
  });
};

/**
 * @desc login user with Facebook
 * @return {Promise}
 */
export const loginFB = () => {
  return new Promise((resolve, reject) => {
    window.FB.login(
      response => {
        response.status === 'connected' ||
        response.status === 'not_authorized' ||
        response.status === 'unknown'
          ? resolve(response)
          : reject(response);
      },
      { scope: 'public_profile, user_friends, email' }
    );
  });
};

/**
 * @desc logout user with Facebook
 * @return {Promise}
 */
export const logoutFB = () => {
  return new Promise((resolve, reject) => {
    window.FB.logout(response => {
      response.authResponse ? resolve(response) : reject(response);
    });
  });
};

/**
 * @desc fetch Facebook Graph API
 * @param  {String}   path
 * @return {Promise}
 */
export const fetchFB = path => {
  return new Promise((resolve, reject) => {
    window.FB.api(path, response => (response.error ? reject(response) : resolve(response)));
  });
};
