<template>
  <div class="container py-4">
    <div class="row g-3">
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h2 class="h5 mb-0">사용자 목록</h2>
            <input
              v-model="keyword"
              class="form-control form-control-sm w-auto"
              placeholder="검색: 이름/부서/ID"
            />
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover table-sm mb-0 align-middle">
                <thead class="table-light">
                  <tr>
                    <th
                      class="user-select-none cursor-pointer text-nowrap"
                      scope="col"
                      style="width: 100px"
                      @click="sortBy('userId')"
                      :aria-sort="ariaSort('userId')"
                    >
                      UserId <small class="text-muted">{{ sortIndicator('userId') }}</small>
                    </th>
                    <th
                      class="user-select-none cursor-pointer text-nowrap"
                      scope="col"
                      @click="sortBy('name')"
                      :aria-sort="ariaSort('name')"
                    >
                      사용자명 <small class="text-muted">{{ sortIndicator('name') }}</small>
                    </th>
                    <th
                      class="user-select-none cursor-pointer text-nowrap"
                      scope="col"
                      @click="sortBy('dept')"
                      :aria-sort="ariaSort('dept')"
                    >
                      부서명 <small class="text-muted">{{ sortIndicator('dept') }}</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in visibleUsers" :key="u.userId">
                    <td>
                      <span class="badge text-bg-secondary">{{ u.userId }}</span>
                    </td>
                    <td>
                      <button class="btn btn-outline-primary btn-sm" @click="openPopup(u)">
                        {{ u.name }}
                      </button>
                    </td>
                    <td>{{ u.dept }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h2 class="h5 mb-0">선택된 사용자</h2>
            <button
              v-if="selectedUsers.length"
              class="btn btn-outline-secondary btn-sm"
              @click="clearSelected"
            >
              초기화
            </button>
          </div>
          <div class="card-body">
            <SelectedUsers :users="selectedUsers" @remove="removeSelected" />
          </div>
        </div>
      </div>
    </div>

    <UserPopup
      v-if="showPopup"
      v-bind="popupProps"
      @close="showPopup = false"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import UserPopup from '../components/UserPopup.vue'
import SelectedUsers from '../components/SelectedUsers.vue'

export default {
  name: 'UserPage',
  components: { UserPopup, SelectedUsers },
  data() {
    return {
      showPopup: false,
      keyword: '',
      // 정렬(삼단 토글: none → asc → desc → none)
      sortKey: null, // null | 'userId' | 'name' | 'dept'
      sortDir: 'none', // 'none' | 'asc' | 'desc'
      users: [
        { userId: 1001, name: '김하늘', dept: '플랫폼개발팀' },
        { userId: 1002, name: '박서준', dept: '인프라팀' },
        { userId: 1003, name: '이지은', dept: 'QA팀' },
        { userId: 1004, name: '최민수', dept: '플랫폼개발팀' },
        { userId: 1005, name: '홍길동', dept: '경영지원' },
        { userId: 1006, name: '김지수', dept: '데이터팀' },
        { userId: 1007, name: '이도윤', dept: '보안팀' },
        { userId: 1008, name: '안유진', dept: '모바일팀' },
        { userId: 1009, name: '한소희', dept: '디자인팀' },
      ],
      selectedUsers: [],
    }
  },
  computed: {
    visibleUsers() {
      const kw = this.keyword.trim().toLowerCase()
      const filtered = !kw
        ? this.users.slice()
        : this.users.filter(
            (u) =>
              String(u.userId).includes(kw) ||
              u.name.toLowerCase().includes(kw) ||
              u.dept.toLowerCase().includes(kw)
          )

      if (!this.sortKey || this.sortDir === 'none') return filtered

      const dir = this.sortDir === 'asc' ? 1 : -1
      const key = this.sortKey
      const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

      return filtered.sort((a, b) => {
        if (key === 'userId') return (a.userId - b.userId) * dir
        return collator.compare(a[key], b[key]) * dir
      })
    },

    popupProps() {
      return {
        users: this.users,
        preselectedIds: this.selectedUsers.map((u) => u.userId),

        // --- UI 튜닝 옵션들 ---
        maxWidth: 960, // 모달 최대 너비(px), 840~1024 권장
        marginX: 16, // 좌우 여백(px)
        bodyMaxVh: 70, // 본문 리스트 최대 높이(% of viewport height)
        preset: 'lg', // 'sm' | 'lg' | ''  (Bootstrap 사이징 프리셋)
        draggable: true, // 헤더 드래그로 이동 가능
      }
    },
  },
  methods: {
    openPopup() {
      this.showPopup = true
    },
    onConfirm(selectedList) {
      const map = new Map(this.selectedUsers.map((u) => [u.userId, u]))
      selectedList.forEach((u) => map.set(u.userId, u))
      this.selectedUsers = Array.from(map.values())
      this.showPopup = false
    },
    removeSelected(userId) {
      this.selectedUsers = this.selectedUsers.filter((u) => u.userId !== userId)
    },
    clearSelected() {
      this.selectedUsers = []
    },

    // 정렬 토글
    sortBy(col) {
      if (this.sortKey !== col) {
        this.sortKey = col
        this.sortDir = 'asc'
        return
      }
      if (this.sortDir === 'asc') this.sortDir = 'desc'
      else if (this.sortDir === 'desc') {
        this.sortKey = null
        this.sortDir = 'none'
      } else this.sortDir = 'asc'
    },
    sortIndicator(col) {
      if (this.sortKey !== col || this.sortDir === 'none') return '↕'
      return this.sortDir === 'asc' ? '▲' : '▼'
    },
    ariaSort(col) {
      if (this.sortKey !== col || this.sortDir === 'none') return 'none'
      return this.sortDir === 'asc' ? 'ascending' : 'descending'
    },
  },
}
</script>
