// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import ToastPlugin from './utils/toastUtil.js' // ✅ 플러그인 import (default)

const app = createApp(App)
app.use(router)
app.use(ToastPlugin, { type: 'success', duration: 1800 }) // ✅ 전역 등록
app.mount('#app')
