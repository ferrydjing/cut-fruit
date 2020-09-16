let baseUrl = '',
  appid = 'third',
  appsecret = 'pre_secret_third';
if (CUT_APP_ENV === 'build') {
  appsecret = 'production_secret_third';
  baseUrl = 'https://open-api.hula.vip';
} else {
  baseUrl = 'https://pre-open-api.hula.vip';
}
const isTouch = 'ontouchstart' in window;
const TOUCH_START = isTouch ? 'touchstart' : 'mousedown';
const TOUCH_MOVE = isTouch ? 'touchmove' : 'mousemove';
const TOUCH_END = isTouch ? 'touchend' : 'mouseup';

export { baseUrl, appid, appsecret, TOUCH_START, TOUCH_MOVE, TOUCH_END };
