import '@babel/polyfill';
import '../sass/index.scss';
import { baseUrl, appid, appsecret } from './config';
import SDK from 'tmmtmm-js-sdk';
const sdk = new SDK();
window.TMMTMM_JS_SDK = sdk;
window.gameScore = 0;
const isTouch = 'ontouchstart' in window;
const TOUCH_START = isTouch ? 'touchstart' : 'mousedown';
const TOUCH_MOVE = isTouch ? 'touchmove' : 'mousemove';
const TOUCH_END = isTouch ? 'touchend' : 'mouseup';
const getAuth = (data) => {
  let params = formatData(data, true);
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/third/third-member/info`,
    data: params,
    success: function (res) {
      console.log(res);
    },
  });
};

(function () {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();

let obj = null;
if (SOMETHINE !== 'build') {
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
  let params = '';
  data['appid'] = appid;
  data.timestamp = Math.round(new Date().getTime() / 1000);
  console.log(data);
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

if (horizontal) {
  $('.rank-list').css('height', '90%');
} else {
  $('.rank-list').css('height', '70%');
}
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
  getRankList({
    openid: '',
  });
};
window.showRankList = showRankList;

const runGetAuth = () => {
  if (!obj) {
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
  } else {
    // getAuth({
    //   code: obj.authCode,
    //   head_url: obj.avatar,
    //   nick_name: obj.name,
    //   timestamp: Math.round(new Date().getTime() / 1000),
    // });
  }
};

let tick = 0;
let runAuth;
const laodingRun = () => {
  if (tick === 0) {
    $('.loading').show();
  }
  tick++;
  if ((sdk.readyState || SOMETHINE === 'dev') && !runAuth) {
    runAuth = true;
    runGetAuth();
  }
  let per = (tick * 0.555555 < 100 ? tick * 0.555555 : 100).toFixed(1) + '%';
  $('.loading .item').css('width', per);
  $('.loading .num').html(per);
  if (tick < 174) {
    requestAnimationFrame(laodingRun);
  } else {
    $('.loading').hide();
  }
};
window.laodingRun = laodingRun;
startModule('scripts/main');

if (SOMETHINE !== 'build') {
  $('.testtest').show();
  $('.testtest').on('click', function () {
    getAuth({
      code: obj.authCode,
      head_url: obj.avatar,
      nick_name: obj.name,
      timestamp: Math.round(new Date().getTime() / 1000),
    });
  });
}
