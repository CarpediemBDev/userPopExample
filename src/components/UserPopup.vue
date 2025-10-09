<template>
  <!-- Backdrop -->
  <div class="modal fade show" style="display: block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content shadow">
        <div class="modal-header">
          <h5 class="modal-title">사용자 선택</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="onClose"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <!-- LEFT: 전체 사용자 목록 -->
            <div class="col-12 col-lg-6">
              <div class="border rounded-3">
                <div class="p-2 border-bottom d-flex align-items-center gap-2">
                  <input
                    v-model="leftKeyword"
                    class="form-control form-control-sm"
                    placeholder="검색(이름/부서/ID)"
                  />
                  <button class="btn btn-outline-secondary btn-sm" @click="toggleAll">
                    {{ allChecked ? '전체해제' : '전체선택' }}
                  </button>
                </div>
                <div class="p-0" style="max-height: 360px; overflow: auto">
                  <table class="table table-sm table-hover mb-0 align-middle">
                    <thead class="table-light position-sticky top-0">
                      <tr>
                        <th style="width: 36px">
                          <input type="checkbox" :checked="allChecked" @change="toggleAll" />
                        </th>
                        <th style="width: 90px">UserId</th>
                        <th>사용자명</th>
                        <th>부서명</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="u in filteredLeft" :key="u.userId">
                        <td><input type="checkbox" v-model="checkedIds" :value="u.userId" /></td>
                        <td>
                          <span class="badge text-bg-secondary">#{{ u.userId }}</span>
                        </td>
                        <td>{{ u.name }}</td>
                        <td>{{ u.dept }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- RIGHT: 선택 미리보기 -->
            <div class="col-12 col-lg-6">
              <div class="border rounded-3 h-100 d-flex flex-column">
                <div class="p-2 border-bottom d-flex justify-content-between align-items-center">
                  <small class="text-muted">선택 {{ preview.length }}명</small>
                  <button
                    class="btn btn-outline-secondary btn-sm"
                    :disabled="!checkedIds.length"
                    @click="checkedIds = []"
                  >
                    전체 선택해제
                  </button>
                </div>
                <div class="p-2" style="max-height: 360px; overflow: auto">
                  <div v-if="!preview.length" class="text-muted small py-2">
                    체크박스로 사용자를 선택하세요.
                  </div>
                  <div
                    v-for="u in preview"
                    :key="u.userId"
                    class="d-flex align-items-center justify-content-between border rounded-3 p-2 mb-2"
                  >
                    <div>
                      <strong>{{ u.name }}</strong>
                      <div class="text-muted small">#{{ u.userId }} · {{ u.dept }}</div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" @click="uncheck(u.userId)">
                      제거
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <small class="me-auto text-muted"
            >체크박스로 여러 명 선택 후 <strong>확인</strong>을 누르세요.</small
          >
          <button class="btn btn-outline-secondary" @click="onClose">취소</button>
          <button class="btn btn-success" :disabled="!checkedIds.length" @click="emitConfirm">
            확인 ({{ checkedIds.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Bootstrap backdrop mimic -->
  <div class="modal-backdrop fade show"></div>
</template>

<script>
export default {
  name: 'UserPopup',
  props: {
    users: { type: Array, required: true },
    preselectedIds: { type: Array, default: () => [] },
  },
  data() {
    return {
      leftKeyword: '',
      checkedIds: [...this.preselectedIds],
    }
  },
  computed: {
    filteredLeft() {
      const kw = this.leftKeyword.trim().toLowerCase()
      return !kw
        ? this.users
        : this.users.filter(
            (u) =>
              String(u.userId).includes(kw) ||
              u.name.toLowerCase().includes(kw) ||
              u.dept.toLowerCase().includes(kw)
          )
    },
    preview() {
      const set = new Set(this.checkedIds)
      return this.users.filter((u) => set.has(u.userId))
    },
    allChecked() {
      if (!this.filteredLeft.length) return false
      const set = new Set(this.checkedIds)
      return this.filteredLeft.every((u) => set.has(u.userId))
    },
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    emitConfirm() {
      const set = new Set(this.checkedIds)
      const payload = this.users.filter((u) => set.has(u.userId))
      this.$emit('confirm', payload)
    },
    toggleAll() {
      const ids = this.filteredLeft.map((u) => u.userId)
      const allIncluded = ids.every((id) => this.checkedIds.includes(id))
      this.checkedIds = allIncluded
        ? this.checkedIds.filter((id) => !ids.includes(id))
        : Array.from(new Set([...this.checkedIds, ...ids]))
    },
    uncheck(id) {
      this.checkedIds = this.checkedIds.filter((x) => x !== id)
    },
  },
}
</script>
