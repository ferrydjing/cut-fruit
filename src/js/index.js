import '@babel/polyfill';
import '../sass/index.scss';
import { store } from '@ferrydjing/utils';
import { baseUrl, appid, appsecret, TOUCH_START, TOUCH_MOVE, TOUCH_END } from './config';
import SDK from 'tmmtmm-js-sdk';
/**
 * 初始化TMMsdk
 */
const sdk = new SDK();
window.TMMTMM_JS_SDK = sdk;
window.gameScore = 0;

if (CUT_APP_ENV !== 'build') {
  new VConsole();
}
/**
 * 获取用户信息
 */
let user_info = store.get('_info', true);
window.store = store;

/**
 * 获取授权
 */
const getCode = () => {
  if (!user_info) {
    sdk.ready(() => {
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
    });
    return false;
  }
  return true;
};
window.getCode = getCode;

/**
 * 请求用户信息
 * @param {*} data
 */
const getAuth = (data) => {
  let params = formatData(data, true);
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/third/third-member/info`,
    data: params,
    success: function ({ data }) {
      if (data) {
        user_info = data;
        store.set('_info', data, true);
      }
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

/**
 * 获取排名信息
 * @param {*} data
 */
const getRankList = (data = {}) => {
  console.log(user_info);
  data.openid = user_info.openid;
  data.num = 20;
  formatData(data, true);
  $.ajax({
    url: `${baseUrl}/third/third-member/top`,
    method: 'POST',
    data,
    success: function ({ data }) {
      if (data) {
        const self = data.pop();
        $('.rank-list .footer img').attr('src', self.head_url);
        $('.rank-list .footer .name').html(self.nick_name);
        $('.rank-list .footer .num').html(self.score);
        let str = '';
        let rank = '未上榜';
        for (let i = 0, len = data.length; i < len; i++) {
          if (self.id === data[i].id) {
            rank = i + 1;
          }
          str += `
            <div class="item">
              <span>${i + 1}</span>
              <img src="${data[i].head_url}" />
              <div class="name">${data[i].nick_name}</div>
              <div class="num">${data[i].score}</div>
            </div>
          `;
        }
        $('.rank-list .content').html(str);
        $('.rank-list  .footer span').html(rank);
      }
    },
  });
};
window.getRankList = getRankList;

/**
 * 比赛结束同步比分
 * @param {*} data
 */
const sendScore = (data) => {
  window.gameScore = 0;
  data.openid = user_info.openid;
  console.log(data);
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

/**
 * 请求接口前数据处理函数
 * @param {*} data  数据
 * @param {boolean} isMd5 是否需要签名
 */
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

/**
 * 显示排行榜
 */
const showRankList = () => {
  if (window._dragger) {
    window._dragger.endDrag();
  }
  if (!getCode()) {
    return;
  }

  getRankList();
  $('.rank-list').css('display', 'flex');
  $('.rank-list').addClass('animate__animated animate__bounceIn');
  $('.rank-list').on('animationend', function () {
    $('.rank-list').removeClass('animate__animated animate__bounceIn');
    $('.rank-list').off('animationend');
  });
};
window.showRankList = showRankList;

/**
 * loading进度条
 */
let tick = 0;
let runAuth;
const laodingRun = () => {
  if (tick === 0) {
    $('.loading').show();
  }
  tick++;
  if ((sdk.readyState || CUT_APP_ENV === 'dev') && !runAuth && !user_info) {
    runAuth = true;
    getCode();
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

/**
 * 页面初始化
 */
const init = () => {
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

  startModule('scripts/main');
};

init();
