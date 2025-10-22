import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { showToast } from './utils/toastUtil.js'

createApp(App)
  .use(router)
  .use((app) => (app.config.globalProperties.$toast = (text, opts) => showToast(text, opts))) // ← 한 줄
  .mount('#app')
