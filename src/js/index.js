import '@babel/polyfill';
import '../sass/index.scss';
import { baseUrl, appid, appsecret } from './config';
import SDK from 'tmmtmm-js-sdk';
const sdk = new SDK();
window.TMMTMM_JS_SDK = sdk;
window.gameScore = 0;
startModule('scripts/main');
const isTouch = 'ontouchstart' in window;
const TOUCH_START = isTouch ? 'touchstart' : 'mousedown';
const TOUCH_MOVE = isTouch ? 'touchmove' : 'mousemove';
const TOUCH_END = isTouch ? 'touchend' : 'mouseup';
const getAuth = (data) => {
  formatData(data, true);
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/third/third-member/info`,
    data,
    success: function (res) {
      console.log(res);
    },
  });
};

let obj = null;
if (SOMETHINE === 'dev') {
  obj = {
    authCode: '0f3d6c55b5f31d5e017fcf3421ec45fff709bf3f',
    avatar: 'https://static.tmmtmm.com.tr/member/avatar/default/6.jpg',
    name: 'ferry',
  };
} else {
  try {
    let ret = localStorage.getItem('user_auth_info');
    if (ret) {
      obj = JSON.parse(ret);
    }
  } catch (error) {
    console.log(error);
  }
}

if (!obj) {
  setTimeout(() => {
    sdk.trigger('authorization', {
      callback: (code, msg, data) => {
        console.log(code, msg, data);
        getAuth({
          code: data.authCode,
          head_url: data.avatar,
          nick_name: data.name,
          timestamp: Math.round(new Date().getTime() / 1000),
        });
      },
    });
  }, 1000);
} else {
  // getAuth({
  //   code: obj.authCode,
  //   head_url: obj.avatar,
  //   nick_name: obj.name,
  //   timestamp: Math.round(new Date().getTime() / 1000),
  // });
}

$('.ph').on('click', function (e) {
  e.stopPropagation();
  console.log(11111);
});

const getRankList = (data) => {
  formatData(data, true);
  $.ajax({
    url: `${baseUrl}/third/third-member/top`,
    method: 'POST',
    data,
    success: function (res) {
      console.log(res);
    },
  });
};

const sendScore = (data) => {
  window.gameScore = 0;
  data.openid = '';
  formatData(data, true);
  $.ajax({
    url: `${baseUrl}/third/third-member/score`,
    method: 'POST',
    data,
    success: function (res) {
      console.log(res);
    },
  });
};

window.sendScore = sendScore;

function formatData(data, isMd5) {
  console.log(data);
  let params = '';
  data['appid'] = appid;
  let strArr = Object.keys(data);
  strArr = strArr.sort();
  for (let key of strArr) {
    if (params.length > 0) {
      params = `${params}&`;
    }
    params += `${key}=${data[key]}`;
  }
  let md5Str = new md5().hex_md5(params + '&' + appsecret);
  if (isMd5) {
    params += `&sign=${md5Str}`;

    data.sign = md5Str;
  }
  console.log(params);
  return params;
}

window.sendScore = sendScore;
window.getRankList = getRankList;

$('.rank-list').on(TOUCH_START, function (e) {
  e.stopPropagation();
});

$('.rank-list').on(TOUCH_END, function (e) {
  e.stopPropagation();
});

$('.rank-list').on(TOUCH_MOVE, function (e) {
  e.stopPropagation();
});

$('.rank-list .close').on('click', function (e) {
  $('.rank-list').addClass('animate__animated animate__bounceOut');
  $('.rank-list').on('animationend', function () {
    $('.rank-list').hide();
    $('.rank-list').removeClass('animate__animated animate__bounceOut');
    $('.rank-list').off('animationend');
  });
});

const showRankList = () => {
  $('.rank-list').css('display', 'flex');
  $('.rank-list').addClass('animate__animated animate__bounceIn');
  $('.rank-list').on('animationend', function () {
    $('.rank-list').removeClass('animate__animated animate__bounceIn');
    $('.rank-list').off('animationend');
  });
};
window.showRankList = showRankList;
