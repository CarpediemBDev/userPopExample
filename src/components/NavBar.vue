<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div class="container-fluid">
        <a class="navbar-brand fw-semibold" href="#">userPopExample</a>

        <!-- 모바일: 오프캔버스 토글 -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navDrawer"
          aria-controls="navDrawer"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 데스크톱: 드롭다운 2단 -->
        <div class="navbar-collapse d-none d-lg-flex">
          <ul class="navbar-nav me-auto">
            <!-- 1단: 그룹 -->
            <li v-for="(grp, i) in menu" :key="`m-${i}`" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                {{ grp.label }}
              </a>
              <!-- 2단: 항목 -->
              <ul class="dropdown-menu">
                <li v-for="(item, j) in grp.children" :key="`mi-${i}-${j}`">
                  <RouterLink v-if="item.to" class="dropdown-item" :to="item.to">
                    {{ item.label }}
                  </RouterLink>
                  <a v-else href="#" class="dropdown-item" @click.prevent>
                    {{ item.label }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <span class="navbar-text small text-muted">Vue3 + Bootstrap 5</span>
        </div>
      </div>
    </nav>

    <!-- 모바일: 오프캔버스(콜랩스 2단) -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="navDrawer">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">메뉴</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>

      <div class="offcanvas-body p-0">
        <div id="navAccordion" class="list-group list-group-flush">
          <!-- 1단: 그룹 -->
          <template v-for="(grp, i) in menu" :key="`g-${i}`">
            <button
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              data-bs-toggle="collapse"
              :data-bs-target="`#grp-${i}`"
            >
              <span>{{ grp.label }}</span>
              <small class="text-muted">▾</small>
            </button>

            <!-- 2단: 항목 -->
            <div class="collapse" :id="`grp-${i}`" data-bs-parent="#navAccordion">
              <ul class="list-group list-group-flush">
                <li
                  v-for="(item, j) in grp.children"
                  :key="`gi-${i}-${j}`"
                  class="list-group-item ps-4"
                >
                  <RouterLink
                    v-if="item.to"
                    :to="item.to"
                    class="text-decoration-none d-block"
                    data-bs-dismiss="offcanvas"
                  >
                    {{ item.label }}
                  </RouterLink>
                  <span v-else class="d-block">{{ item.label }}</span>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router' // 환경에 따라 글로벌이지만, 안전하게 명시 등록

export default {
  name: 'NavBar',
  components: { RouterLink },
  data() {
    return {
      // 중간 "사용자 목록" 단계 제거 -> 바로 라우트 연결
      menu: [
        {
          label: '사용자 관리',
          children: [
            { label: '사용자', to: '/' },
            { label: '사용자(검색Grid)', to: '/search-grid' },
            { label: '그룹 관리' },
            { label: '설정' },
          ],
        },
        {
          label: '교육 관리',
          children: [{ label: '강좌 목록' }, { label: '수강 현황' }, { label: '시험/평가' }],
        },
        {
          label: '시스템',
          children: [{ label: '환경설정' }, { label: '공지사항' }],
        },
      ],
    }
  },
}
</script>
