<template>
  <div class="jqx-custome-grid w-100 h-100">
    <JqxGrid
      ref="grid"
      :width="width"
      :height="height"
      :theme="theme"
      :source="adapter"
      :columns="columnsOut"
      :editable="editable"
      :selectionmode="selectionmode"
      :pageable="pageable"
      :pagesize="pagesize"
      :pagesizeoptions="pagesizeoptions"
      :sortable="sortable"
      :filterable="filterable"
      :columnsresize="columnsresize"
      :columnsreorder="columnsreorder"
      :autoheight="true"
    />
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue3/vue_jqxgrid.vue'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.bootstrap.css'

export default {
  name: 'JqxCustomeGrid',
  components: { JqxGrid },
  props: {
    localdata: { type: Array, default: () => [] },
    datafields: { type: Array, required: true },
    columns: { type: Array, required: true },
    width: { type: [Number, String], default: '100%' },
    height: { type: [Number, String], default: '100%' },
    theme: { type: String, default: 'bootstrap' },
    editable: { type: Boolean, default: true },
    selectionmode: { type: String, default: 'multiplerows' },
    pageable: { type: Boolean, default: true },
    pagesize: { type: Number, default: 20 },
    pagesizeoptions: { type: Array, default: () => [10, 20, 50, 100] },
    sortable: { type: Boolean, default: true },
    filterable: { type: Boolean, default: false },
    columnsresize: { type: Boolean, default: true },
    columnsreorder: { type: Boolean, default: true },
    autoheight: { type: Boolean, default: true },
    showRowStatus: { type: Boolean, default: true },
  },

  data() {
    return {
      adapter: null,
    }
  },
  computed: {
    // rowStatus 필드 자동 보강
    augmentedDatafields() {
      return this.datafields.some((f) => f.name === 'rowStatus')
        ? this.datafields
        : [...this.datafields, { name: 'rowStatus', type: 'string' }]
    },
    columnsOut() {
      if (!this.showRowStatus) return this.columns
      const has = this.columns.some((c) => c.datafield === 'rowStatus')
      if (has) return this.columns
      const statusCol = {
        text: '',
        datafield: 'rowStatus',
        width: 10,
        editable: false,
        align: 'center',
        cellsalign: 'center',
        cellsrenderer: (row, col, val) => {
          const v = val || ''
          let icon = ''
          let colorClass = ''

          if (v === 'A') {
            icon = '➕'
            colorClass = 'status-add'
          } else if (v === 'U') {
            icon = '✓'
            colorClass = 'status-update'
          } else if (v === 'D') {
            icon = '➖'
            colorClass = 'status-delete'
          }

          return `<div class="jqs-state-cell ${colorClass}">${icon}</div>`
        },
        cellclassname: (row, datafield, value, rowData) => {
          if (rowData.rowStatus === 'A') return 'jqs-row-a'
          if (rowData.rowStatus === 'U') return 'jqs-row-u'
          if (rowData.rowStatus === 'D') return 'jqs-row-d'
          return ''
        },
      }
      return [statusCol, ...this.columns]
    },
  },
  watch: {
    localdata() {
      this.source.localdata = this.localdata
      this.$refs.grid?.updatebounddata('cells')
    },
  },
  created() {
    this.bind()
  },
  methods: {
    // 부모에서 this.$refs.gridComp.add(...) 식으로 호출
    add(initial = {}) {
      console.log('add called', initial)
      this.$refs.grid.addrow(null, initial)
    },
    deleteSelected() {
      const idxs = this.$refs.grid.getselectedrowindexes?.() || []
      idxs.forEach((i) => {
        const id = this.$refs.grid.getrowid(i)
        this.$refs.grid.deleterow(id)
      })
    },
    getChanges() {
      const added = [],
        updated = [],
        deleted = []
      for (const r of this.localdata) {
        if (r.rowStatus === 'A') added.push(r)
        else if (r.rowStatus === 'U') updated.push(r)
        else if (r.rowStatus === 'D') deleted.push(r)
      }
      return { added, updated, deleted }
    },
    clearStatuses() {
      this.localdata.forEach((r) => {
        if (r.rowStatus) delete r.rowStatus
      })
    },

    // jqx source / adapter
    bind() {
      this.source = {
        datatype: 'array',
        localdata: this.localdata,
        datafields: this.augmentedDatafields,

        // 짧고 담백한 CUD 콜백 (화살표 함수로 this 컨텍스트 유지)
        addrow: (rowid, rowdata, position, commit) => {
          rowdata.rowStatus = 'A'
          // 배열의 맨 위에 추가
          this.localdata.unshift(rowdata)
          // source.localdata도 동기화
          this.source.localdata = this.localdata
          commit(true)
          // 그리드 새로고침
          this.$nextTick(() => {
            this.$refs.grid?.updatebounddata('cells')
          })
        },
        updaterow: (rowid, newdata, commit) => {
          console.log('updaterow callback - rowid:', rowid, 'newdata:', newdata)
          const i = rowid // rowid가 인덱스
          if (i < 0 || i >= this.localdata.length) return commit(false)

          // 기존 rowStatus 확인 (새로 추가된 행이면 'A' 유지, 아니면 'U')
          const prevStatus = this.localdata[i].rowStatus
          this.localdata.splice(i, 1, {
            ...newdata,
            rowStatus: prevStatus === 'A' ? 'A' : 'U',
          })
          // source.localdata도 동기화
          this.source.localdata = this.localdata
          commit(true)
          this.$nextTick(() => {
            this.$refs.grid?.updatebounddata('cells')
          })
        },
        deleterow: (rowid, rowdata, commit) => {
          console.log('deleterow callback - rowid:', rowid, 'rowdata:', rowdata)
          const i = rowid // rowid가 인덱스
          if (i < 0 || i >= this.localdata.length) return commit(false)
          // rowdata가 있다면 직접 사용, 없다면 기존 방식
          if (rowdata) {
            this.localdata.splice(i, 1, { ...rowdata, rowStatus: 'D' })
          } else {
            this.localdata[i] = { ...this.localdata[i], rowStatus: 'D' }
          }
          // source.localdata도 동기화
          this.source.localdata = this.localdata
          commit(true)
          this.$nextTick(() => {
            this.$refs.grid?.updatebounddata('cells')
          })
        },
      }
      this.adapter = new jqx.dataAdapter(this.source)
    },
  },
}
</script>

<style scoped>
/* 헤더 톤다운 */
.jqx-custome-grid :deep(.jqx-grid-column-header) {
  background: linear-gradient(180deg, #f8f9fa, #f1f3f5);
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}
/* hover 완화 */
.jqx-custome-grid :deep(.jqx-grid-cell-hover) {
  background-color: #f6f8fa !important;
}
/* 선택색 부드럽게 */
.jqx-custome-grid :deep(.jqx-grid-cell-selected) {
  background-color: #e7f1ff !important;
  color: #0b5ed7 !important;
}
/* 대안행 */
.jqx-custome-grid :deep(.jqx-grid-cell-alt) {
  background-color: #fafbfc;
}

/* 상태 컬럼 - 유니코드 아이콘 */
.jqs-state-cell {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100%;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Segoe UI Symbol', 'Arial Unicode MS', sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  text-align: center !important;
  line-height: 1;
}

/* 상태별 직접 색상 클래스 - 최고 우선순위 */
.jqx-custome-grid :deep(.jqs-state-cell.status-add) {
  color: #22c55e !important;
  filter: none !important;
}

.jqx-custome-grid :deep(.jqs-state-cell.status-update) {
  color: #22c55e !important;
  filter: none !important;
}

.jqx-custome-grid :deep(.jqs-state-cell.status-delete) {
  color: #ef4444 !important;
  filter: none !important;
}

.jqs-state-cell:hover {
  transform: scale(1.1);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 강제 중앙 정렬 - 첫 번째 컬럼 (상태 컬럼) */
.jqx-custome-grid :deep(.jqx-grid-cell:first-child) {
  text-align: center !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 첫 번째 헤더도 중앙 정렬 */
.jqx-custome-grid :deep(.jqx-grid-column-header:first-child) {
  text-align: center !important;
}

/* 행 상태별 스타일링 */
.jqx-custome-grid :deep(.jqs-row-a) {
  background-color: #f2fbf7;
}
.jqx-custome-grid :deep(.jqs-row-u) {
  background-color: #fffaf0;
}
.jqx-custome-grid :deep(.jqs-row-d) {
  background-color: #fff5f5;
  text-decoration: line-through;
}
</style>
