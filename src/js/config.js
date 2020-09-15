let baseUrl = '';
if (SOMETHINE === 'build') {
  baseUrl = 'https://open-api.hula.vip';
} else {
  baseUrl = 'https://pre-open-api.hula.vip';
}
let appid = 'third',
  appsecret = 'pre_secret_third';

if (SOMETHINE === 'build') {
  appsecret = 'production_secret_third';
}
export { baseUrl, appid, appsecret };
