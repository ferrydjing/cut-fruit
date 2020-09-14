// import '../sass/layout.scss'
// import '../sass/index.scss'
// import '@babel/polyfill'
import { baseUrl } from './config'
// import SDK from 'tmmtmm-js-sdk';
import SDK from 'tmmtmm-js-sdk'
const sdk = new SDK()

startModule('scripts/main')

setTimeout(() => {
  sdk.trigger('authorization', {
    callback: (code, msg, data) => {
      console.log(code, msg, data)
    }
  })
}, 3000)

$('.ph').on('click', function (e) {
  e.stopPropagation()
  console.log(11111)
})
