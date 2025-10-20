<template>
  <!-- 
  transition name 옵션:
    "fade" - 페이드 인/아웃
    "slide" - 좌우 슬라이드
    "slide-up" - 상하 슬라이드
    "scale" - 스케일 
  mode 설명:
    out-in:  [페이지A 사라짐] → [빈 화면] → [페이지B 나타남]
    in-out:  [페이지A + 페이지B 겹침] → [페이지A 사라짐]
    기본값:   [페이지A 사라짐 + 페이지B 나타남 동시에]
    -->
  <div>
    <NavBar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import './assets/styles/transitions.css'

export default { name: 'App', components: { NavBar } }
</script>

<style>
/* App.vue 전용 스타일이 필요하면 여기에 */
</style>
