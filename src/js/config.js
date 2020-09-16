let baseUrl = '';
if (CUT_APP_ENV === 'build') {
  baseUrl = 'https://open-api.hula.vip';
} else {
  baseUrl = 'https://pre-open-api.hula.vip';
}
let appid = 'third',
  appsecret = 'pre_secret_third';

if (CUT_APP_ENV === 'build') {
  appsecret = 'production_secret_third';
}
export { baseUrl, appid, appsecret };
