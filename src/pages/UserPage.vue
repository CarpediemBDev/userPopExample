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
              placeholder="검색: 이름/부서/ID/직무"
            />
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover table-sm mb-0 align-middle">
                <thead class="table-light">
                  <tr>
                    <!-- ✔ 팝업과 동일한 마스터 체크박스 -->
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
                    <th
                      class="user-select-none cursor-pointer text-nowrap"
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
                    <!-- ✔ 행 체크박스 (팝업과 동일) -->
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
                      <span class="badge text-bg-secondary">{{ u.userId }}</span>
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

    <!-- 팝업은 유지 -->
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
      sortKey: null, // null | 'userId' | 'name' | 'dept' | 'role'
      sortDir: 'none', // 'none' | 'asc' | 'desc'
      users: [
        { userId: 1001, name: '김하늘', dept: '플랫폼개발팀', role: 'Backend' },
        { userId: 1002, name: '박서준', dept: '인프라팀', role: 'DevOps' },
        { userId: 1003, name: '이지은', dept: 'QA팀', role: 'QA' },
        { userId: 1004, name: '최민수', dept: '플랫폼개발팀', role: 'Frontend' },
        { userId: 1005, name: '홍길동', dept: '경영지원', role: 'HR' },
        { userId: 1006, name: '김지수', dept: '데이터팀', role: 'Data' },
        { userId: 1007, name: '이도윤', dept: '보안팀', role: 'Security' },
        { userId: 1008, name: '안유진', dept: '모바일팀', role: 'iOS' },
        { userId: 1009, name: '한소희', dept: '디자인팀', role: 'Designer' },
      ],
      selectedUsers: [],
      // ✔ 페이지 테이블 체크 상태(팝업과 동일한 방식)
      checkedIds: [],
    }
  },
  computed: {
    // 검색 + 정렬
    visibleUsers() {
      const kw = this.keyword.trim().toLowerCase()
      const filtered = !kw
        ? this.users.slice()
        : this.users.filter(
            (u) =>
              String(u.userId).includes(kw) ||
              (u.name || '').toLowerCase().includes(kw) ||
              (u.dept || '').toLowerCase().includes(kw) ||
              (u.role || '').toLowerCase().includes(kw)
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

    // 팝업에 전달할 프로퍼티 묶음
    popupProps() {
      return {
        users: this.users,
        preselectedIds: this.selectedUsers.map((u) => u.userId),
        maxWidth: 960,
        marginX: 16,
        heightVh: 80,
        minHeightPx: 560,
        maxHeightPx: 720,
        draggable: true,
      }
    },

    // ✔ 페이지 테이블용 마스터 체크 상태
    allCheckedPage() {
      if (!this.visibleUsers.length) return false
      const set = new Set(this.checkedIds)
      return this.visibleUsers.every((u) => set.has(u.userId))
    },
  },
  watch: {
    // ✔ 페이지에서 체크박스 변경 → selectedUsers 동기화
    checkedIds(newIds) {
      const idset = new Set(newIds)
      this.selectedUsers = this.users.filter((u) => idset.has(u.userId))
      this.$nextTick(this.updateMasterIndeterminatePage)
    },
    // 검색/정렬로 보이는 목록이 바뀔 때 indeterminate 갱신
    visibleUsers() {
      this.$nextTick(this.updateMasterIndeterminatePage)
    },
  },
  mounted() {
    // 초기 동기화
    this.checkedIds = this.selectedUsers.map((u) => u.userId)
    this.$nextTick(this.updateMasterIndeterminatePage)
  },
  methods: {
    openPopup() {
      this.showPopup = true
    },

    // 팝업에서 확인 → selectedUsers, checkedIds 동기화
    onConfirm(selectedList) {
      const map = new Map(this.selectedUsers.map((u) => [u.userId, u]))
      selectedList.forEach((u) => map.set(u.userId, u))
      this.selectedUsers = Array.from(map.values())
      this.checkedIds = this.selectedUsers.map((u) => u.userId) // ✔ 동기화
      this.showPopup = false
    },

    removeSelected(userId) {
      this.selectedUsers = this.selectedUsers.filter((u) => u.userId !== userId)
      this.checkedIds = this.checkedIds.filter((id) => id !== userId) // ✔ 동기화
    },
    clearSelected() {
      this.selectedUsers = []
      this.checkedIds = [] // ✔ 동기화
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

    // ✔ 마스터 체크박스(현재 보이는 행 기준)
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
