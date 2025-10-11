<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
    <div class="container-fluid">
      <a class="navbar-brand fw-semibold" href="#">userPopExample</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMain"
        aria-controls="navMain"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">사용자</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/search-grid">사용자(검색Grid)</RouterLink>
          </li>
          <!-- 추후: 로그인, 설정 등 메뉴 확장 가능 -->
        </ul>
        <span class="navbar-text small text-muted">Vue3 + Bootstrap 5</span>
      </div>
    </div>
  </nav>
</template>

<script>
export default { name: 'NavBar' }
</script>
