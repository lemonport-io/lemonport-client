switch (process.env.NODE_ENV) {
  case 'development':
    module.exports = {
      LOGGER: 'dev',
      API_HOST: 'http://localhost:3030',
      DOMAIN: 'http://localhost:3000',
      PORT: '5000'
    };
    break;
  case 'staging':
    module.exports = {
      LOGGER: 'dev',
      API_HOST: 'https://lemonport.tech',
      DOMAIN: 'https://lemonport.io',
      PORT: '5000'
    };
    break;
  case 'production':
    module.exports = {
      LOGGER: 'dev',
      API_HOST: 'https://lemonport.tech',
      DOMAIN: 'https://lemonport.io',
      PORT: '5000'
    };
    break;
  default:
    console.error('Unrecognized NODE_ENV: ' + process.env.NODE_ENV); // eslint-disable-line
}
