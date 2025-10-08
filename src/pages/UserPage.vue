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
                      @click="sortBy('userId')"
                      :aria-sort="ariaSort('userId')"
                      title="UserId로 정렬"
                      style="width: 100px"
                    >
                      UserId <small class="text-muted">{{ sortIndicator('userId') }}</small>
                    </th>
                    <th
                      class="user-select-none cursor-pointer text-nowrap"
                      scope="col"
                      @click="sortBy('name')"
                      :aria-sort="ariaSort('name')"
                      title="사용자명으로 정렬"
                    >
                      사용자명 <small class="text-muted">{{ sortIndicator('name') }}</small>
                    </th>
                    <th
                      class="user-select-none cursor-pointer text-nowrap"
                      scope="col"
                      @click="sortBy('dept')"
                      :aria-sort="ariaSort('dept')"
                      title="부서명으로 정렬"
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
      :users="users"
      :preselected-ids="selectedUsers.map((u) => u.userId)"
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
      // 정렬 상태(삼단 토글: none -> asc -> desc -> none)
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
    // 1) 검색 필터 → 2) (옵션) 정렬
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

      if (!this.sortKey || this.sortDir === 'none') {
        // 정렬 없음: 원본 순서 유지
        return filtered
      }

      const dir = this.sortDir === 'asc' ? 1 : -1
      const key = this.sortKey
      const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

      return filtered.sort((a, b) => {
        if (key === 'userId') return (a.userId - b.userId) * dir
        return collator.compare(a[key], b[key]) * dir
      })
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

    // 정렬: none -> asc -> desc -> none
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
