let baseUrl = '',
  appid = 'third',
  appsecret = 'pre_secret_third';
if (CUT_APP_ENV === 'build') {
  appsecret = 'production_secret_third';
  baseUrl = 'https://open-api.hula.vip';
} else {
  baseUrl = 'https://pre-open-api.hula.vip';
}

export { baseUrl, appid, appsecret };
