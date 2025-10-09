<template>
  <div class="container py-4">
    <div class="row g-3">
      <!-- LEFT: 사용자 목록 -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h2 class="h5 mb-0">사용자 목록</h2>
            <input
              v-model="keyword"
              class="form-control form-control-sm w-auto"
              placeholder="검색: ID/이름/부서/직무"
            />
          </div>
          <div class="card-body p-0">
            <div class="table-responsive code-inherit">
              <table class="table table-hover table-sm mb-0 align-middle">
                <thead class="table-light">
                  <tr>
                    <!-- 마스터 체크박스 (현재 보이는 행 기준) -->
                    <th style="width: 44px">
                      <div class="form-check m-0 d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          ref="masterPage"
                          type="checkbox"
                          :checked="allCheckedPage"
                          :disabled="!visibleUsers.length"
                          @change="toggleAllVisiblePage"
                          aria-label="현재 보이는 사용자 전체 선택/해제"
                        />
                      </div>
                    </th>

                    <th
                      class="user-select-none text-nowrap"
                      scope="col"
                      @click="sortBy('userId')"
                      :aria-sort="ariaSort('userId')"
                    >
                      UserId <small class="text-muted">{{ sortIndicator('userId') }}</small>
                    </th>
                    <th
                      class="user-select-none text-nowrap"
                      scope="col"
                      @click="sortBy('name')"
                      :aria-sort="ariaSort('name')"
                    >
                      사용자명 <small class="text-muted">{{ sortIndicator('name') }}</small>
                    </th>
                    <th
                      class="user-select-none text-nowrap"
                      scope="col"
                      @click="sortBy('dept')"
                      :aria-sort="ariaSort('dept')"
                    >
                      부서명 <small class="text-muted">{{ sortIndicator('dept') }}</small>
                    </th>
                    <th
                      class="user-select-none text-nowrap"
                      scope="col"
                      @click="sortBy('role')"
                      :aria-sort="ariaSort('role')"
                    >
                      직무 <small class="text-muted">{{ sortIndicator('role') }}</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in visibleUsers" :key="u.userId">
                    <!-- 행 체크박스 -->
                    <td>
                      <div class="form-check m-0 d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="checkedIds"
                          :value="u.userId"
                          aria-label="사용자 선택"
                        />
                      </div>
                    </td>

                    <td>
                      <span class="font-monospace text-body">{{ u.userId }}</span>
                    </td>
                    <td>
                      <button class="btn btn-outline-primary btn-sm" @click="openPopup()">
                        {{ u.name }}
                      </button>
                    </td>
                    <td>{{ u.dept }}</td>
                    <td>{{ u.role }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: 선택된 사용자 -->
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

    <!-- 팝업 -->
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
import { generateMockUsers } from '../utils/generateMockUsers.js'

export default {
  name: 'UserPage',
  components: { UserPopup, SelectedUsers },
  data() {
    return {
      showPopup: false,
      keyword: '',
      // 정렬(삼단 토글: none → asc → desc → none)
      sortKey: null, // null | 'userId' | 'name' | 'dept' | 'role'
      sortDir: 'none', // 'none' | 'asc' | 'desc'
      users: [], // db.json에서 로딩(실패 시 mock)
      selectedUsers: [],
      checkedIds: [], // ✔ 문자열 userId 집합
    }
  },
  async mounted() {
    await this.loadUsers()
    // 선택/체크 초기 동기화
    this.checkedIds = this.selectedUsers.map((u) => u.userId)
    this.$nextTick(this.updateMasterIndeterminatePage)
  },
  computed: {
    visibleUsers() {
      const kw = this.keyword.trim().toLowerCase()
      const filtered = !kw
        ? this.users.slice()
        : this.users.filter(
            (u) =>
              (u.userId || '').toLowerCase().includes(kw) ||
              (u.name || '').toLowerCase().includes(kw) ||
              (u.dept || '').toLowerCase().includes(kw) ||
              (u.role || '').toLowerCase().includes(kw)
          )

      if (!this.sortKey || this.sortDir === 'none') return filtered

      const dir = this.sortDir === 'asc' ? 1 : -1
      const key = this.sortKey
      const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

      return filtered.sort((a, b) => collator.compare(a[key], b[key]) * dir)
    },

    // 팝업에 전달할 프로퍼티 묶음
    popupProps() {
      return {
        users: this.users,
        preselectedIds: this.selectedUsers.map((u) => u.userId), // ✔ 문자열 userId
        maxWidth: 960,
        marginX: 16,
        heightVh: 80,
        minHeightPx: 560,
        maxHeightPx: 720,
        draggable: true,
      }
    },

    // 페이지 테이블 마스터 체크 상태
    allCheckedPage() {
      if (!this.visibleUsers.length) return false
      const set = new Set(this.checkedIds)
      return this.visibleUsers.every((u) => set.has(u.userId))
    },
  },
  watch: {
    // 체크 변경 → 선택된 사용자 동기화
    checkedIds(newIds) {
      const idset = new Set(newIds)
      this.selectedUsers = this.users.filter((u) => idset.has(u.userId))
      this.$nextTick(this.updateMasterIndeterminatePage)
    },
    // 검색/정렬 변경 시 indeterminate 갱신
    visibleUsers() {
      this.$nextTick(this.updateMasterIndeterminatePage)
    },
  },
  methods: {
    async loadUsers() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}db.json`, { cache: 'no-store' })
        if (!res.ok) throw new Error('db.json not found')
        const json = await res.json()
        this.users = Array.isArray(json) ? json : json.users || []
      } catch (e) {
        console.warn('db.json 로드 실패 → 목업 생성으로 대체합니다.', e)
        this.users = generateMockUsers(100, { seed: 42 })
      }
    },

    openPopup() {
      this.showPopup = true
    },

    // 팝업 확인 → 선택/체크 동기화
    onConfirm(selectedList) {
      const map = new Map(this.selectedUsers.map((u) => [u.userId, u]))
      selectedList.forEach((u) => map.set(u.userId, u))
      this.selectedUsers = Array.from(map.values())
      this.checkedIds = this.selectedUsers.map((u) => u.userId)
      this.showPopup = false
    },

    removeSelected(userId) {
      this.selectedUsers = this.selectedUsers.filter((u) => u.userId !== userId)
      this.checkedIds = this.checkedIds.filter((x) => x !== userId)
    },
    clearSelected() {
      this.selectedUsers = []
      this.checkedIds = []
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
      if (this.sortKey !== col || this.sortDir === 'none') return ''
      return this.sortDir === 'asc' ? '▲' : '▼'
    },
    ariaSort(col) {
      if (this.sortKey !== col || this.sortDir === 'none') return 'none'
      return this.sortDir === 'asc' ? 'ascending' : 'descending'
    },

    // 마스터 체크박스(현재 보이는 행 기준)
    toggleAllVisiblePage() {
      const ids = this.visibleUsers.map((u) => u.userId)
      const allIncluded = ids.every((id) => this.checkedIds.includes(id))
      this.checkedIds = allIncluded
        ? this.checkedIds.filter((id) => !ids.includes(id))
        : Array.from(new Set([...this.checkedIds, ...ids]))
      this.$nextTick(this.updateMasterIndeterminatePage)
    },
    updateMasterIndeterminatePage() {
      const el = this.$refs.masterPage
      if (!el) return
      const visibleIds = new Set(this.visibleUsers.map((u) => u.userId))
      let selected = 0
      for (const id of this.checkedIds) if (visibleIds.has(id)) selected++
      el.indeterminate = selected > 0 && selected < visibleIds.size
    },
  },
}
</script>

<style scoped>
/* 이 테이블 내부에서는 <code>색 대신 본문색으로 */
.code-inherit code {
  color: var(--bs-body-color) !important;
  background: transparent;
  padding: 0;
}
</style>
