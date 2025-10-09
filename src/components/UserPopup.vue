<template>
  <!-- 컨트롤드 모달(부모가 v-if로 렌더링 제어) -->
  <div class="modal fade show" style="display: block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog" ref="dlg" :class="dialogSizeClass" :style="dialogInlineStyle">
      <div class="modal-content shadow">
        <!-- 드래그 핸들 -->
        <div class="modal-header" ref="dragHandle" @pointerdown="onDragStart">
          <h5 class="modal-title">사용자 선택</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="onClose"></button>
        </div>

        <div class="modal-body">
          <div class="row g-3">
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
                <div class="p-0" :style="`max-height:${bodyListMaxHeight}; overflow:auto`">
                  <div class="table-responsive">
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
                <div class="p-2" :style="`max-height:${bodyListMaxHeight}; overflow:auto`">
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
          <!-- /row -->
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
  <!-- 백드롭 -->
  <div class="modal-backdrop fade show"></div>
</template>

<script>
export default {
  name: 'UserPopup',
  props: {
    users: { type: Array, required: true },
    preselectedIds: { type: Array, default: () => [] },
    // 크기/레이아웃 옵션
    maxWidth: { type: [Number, String], default: 960 }, // px 또는 css 값
    marginX: { type: Number, default: 16 }, // 좌우 여백(px)
    bodyMaxVh: { type: Number, default: 70 }, // 본문 리스트 max-height = min( bodyMaxVh vh, px )
    preset: { type: String, default: 'lg' }, // 'sm' | 'md' | 'lg' | '' (부트스트랩 클래스)
    // 드래그 옵션
    draggable: { type: Boolean, default: true },
  },
  data() {
    return {
      leftKeyword: '',
      checkedIds: [...this.preselectedIds],
      // drag state
      dragging: false,
      dragStart: { x: 0, y: 0 },
      dialogStart: { left: 0, top: 0 },
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
    dialogSizeClass() {
      // Bootstrap 사이징 클래스 선택
      return {
        'modal-sm': this.preset === 'sm',
        'modal-lg': this.preset === 'lg',
        'modal-md': this.preset === 'md', // 부트스트랩엔 modal-md가 없지만, 커스텀 대비
      }
    },
    dialogInlineStyle() {
      // width: min(maxWidth, viewport - margin); transform 제거하고 top/left로 제어
      const max = typeof this.maxWidth === 'number' ? `${this.maxWidth}px` : this.maxWidth
      const side = `${this.marginX}px`
      return {
        position: 'fixed',
        margin: '0',
        transform: 'none',
        width: `min(${max}, calc(100vw - ${side}*2))`,
        maxWidth: max,
      }
    },
    bodyListMaxHeight() {
      // 리스트 컨테이너의 최대 높이 (뷰포트 70vh 기본)
      return `min(${this.bodyMaxVh}vh, 640px)`
    },
  },
  mounted() {
    // 초기 중앙 배치(레이아웃 완료 후)
    this.$nextTick(this.centerDialog)
    window.addEventListener('resize', this.centerDialog, { passive: true })

    if (this.draggable) {
      window.addEventListener('pointermove', this.onDragMove, { passive: false })
      window.addEventListener('pointerup', this.onDragEnd, { passive: true })
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.centerDialog)
    if (this.draggable) {
      window.removeEventListener('pointermove', this.onDragMove)
      window.removeEventListener('pointerup', this.onDragEnd)
    }
  },
  methods: {
    // ---- modal control ----
    onClose() {
      this.$emit('close')
    },
    emitConfirm() {
      const set = new Set(this.checkedIds)
      this.$emit(
        'confirm',
        this.users.filter((u) => set.has(u.userId))
      )
    },

    // ---- selection helpers ----
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

    // ---- positioning ----
    centerDialog() {
      const dlg = this.$refs.dlg
      if (!dlg) return
      const rect = dlg.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const left = Math.max(this.marginX, (vw - rect.width) / 2)
      const top = Math.max(12, (vh - rect.height) / 2) // 위 여백 12px
      dlg.style.left = `${left}px`
      dlg.style.top = `${top}px`
    },

    // ---- dragging ----
    onDragStart(e) {
      if (!this.draggable || e.button !== 0) return
      this.dragging = true
      const rect = this.$refs.dlg.getBoundingClientRect()
      this.dragStart = { x: e.clientX, y: e.clientY }
      this.dialogStart = { left: rect.left, top: rect.top }
      document.body.style.userSelect = 'none'
    },
    onDragMove(e) {
      if (!this.dragging) return
      e.preventDefault()
      const dx = e.clientX - this.dragStart.x
      const dy = e.clientY - this.dragStart.y
      const dlg = this.$refs.dlg
      const rect = dlg.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      let newLeft = this.dialogStart.left + dx
      let newTop = this.dialogStart.top + dy
      const maxLeft = vw - rect.width - this.marginX
      const maxTop = vh - rect.height - 12

      newLeft = Math.min(Math.max(this.marginX, newLeft), Math.max(this.marginX, maxLeft))
      newTop = Math.min(Math.max(12, newTop), Math.max(12, maxTop))

      dlg.style.left = `${newLeft}px`
      dlg.style.top = `${newTop}px`
    },
    onDragEnd() {
      if (!this.dragging) return
      this.dragging = false
      document.body.style.userSelect = ''
    },
  },
}
</script>

<style scoped>
/* Bootstrap의 transform 기반 중앙정렬을 끄고 top/left로 제어 */
.modal.show .modal-dialog {
  transform: none !important;
}

/* 작은 화면 보호: 너무 꽉 차지 않게 */
@media (max-width: 576px) {
  .modal .modal-dialog {
    width: calc(100vw - 12px) !important;
  }
}

/* 드래그 UX */
.modal-header {
  cursor: move;
}

/* 본문 스크롤이 생겨도 헤더/푸터는 고정되게(부드러운 느낌) */
.modal-content {
  overflow: hidden;
}
</style>
