<!-- MainLayout.vue -->
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
  <div class="app-layout">
    <!-- Header -->
    <header>
      <NavBar />
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <small class="text-muted"> © 2025 userPopExample. All rights reserved. </small>
          </div>
          <div class="col-md-6 text-md-end">
            <small class="text-muted"> Vue 3 + Bootstrap 5 + JqWidgets </small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import '../assets/styles/transitions.css'

export default {
  name: 'MainLayout',
  components: { NavBar },
  data() {
    return {
      transitionName: 'slide-right',
      routeHistory: [],
    }
  },
  watch: {
    $route(to, from) {
      const currentPath = to.path
      const fromPath = from.path

      console.log('Route change:', fromPath, '→', currentPath)
      console.log('History before:', this.routeHistory)

      // 현재 히스토리에서 이전 페이지가 바로 직전에 있는지 확인
      const prevIndex = this.routeHistory.length - 2
      const isGoingBack = prevIndex >= 0 && this.routeHistory[prevIndex] === currentPath

      if (isGoingBack) {
        // 뒤로가기: 마지막 항목 제거
        this.routeHistory.pop()
        this.transitionName = 'slide-left'
        console.log('Going back, transition: slide-left')
      } else {
        // 앞으로 이동: 새 경로 추가
        this.routeHistory.push(currentPath)
        this.transitionName = 'slide-right'
        console.log('Going forward, transition: slide-right')
      }

      console.log('History after:', this.routeHistory)
    },
  },
  created() {
    // 초기 라우트 히스토리 설정
    this.routeHistory.push(this.$route.path)
  },
}
</script>

<style scoped>
/* 전체 레이아웃 */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  min-height: 0; /* flex item shrinking 허용 */
}

.app-footer {
  background-color: var(--bs-light);
  border-top: 1px solid var(--bs-border-color);
  padding: 1rem 0;
  margin-top: auto;
}
</style>
