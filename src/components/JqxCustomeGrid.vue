<template>
  <div class="jqx-custome-grid w-100 h-100">
    <JqxGrid
      ref="grid"
      :width="width"
      :height="height"
      :theme="theme"
      :source="adapter"
      :columns="columns"
      :editable="editable"
      :selectionmode="selectionmode"
      :pageable="pageable"
      :pagesize="pagesize"
      :pagesizeoptions="pagesizeoptions"
      :sortable="sortable"
      :filterable="filterable"
      :columnsresize="columnsresize"
      :columnsreorder="columnsreorder"
      :altrows="altrows"
      :autoheight="autoheight"
    />
  </div>
</template>

<script>
/**
 * JqxCustomeGrid.vue — 간결한 JqxGrid 공통 컴포넌트 (C/U/D + rowStatus)
 * - 부모에서 columns, datafields 를 props로 주입
 * - v-model 로 rows 동기화
 * - addrow / updaterow / deleterow 콜백에서 rowStatus: 'A' | 'U' | 'D'
 * - JqxGrid가 보장하는 값들을 신뢰하고 불필요한 체크는 최소화
 */
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue3/vue_jqxgrid.vue'

// 필요한 jqx 모듈
import 'jqwidgets-scripts/jqwidgets/jqxcore.js'
import 'jqwidgets-scripts/jqwidgets/jqxdata.js'
import 'jqwidgets-scripts/jqwidgets/jqxbuttons.js'
import 'jqwidgets-scripts/jqwidgets/jqxscrollbar.js'
import 'jqwidgets-scripts/jqwidgets/jqxmenu.js'
import 'jqwidgets-scripts/jqwidgets/jqxgrid.js'
import 'jqwidgets-scripts/jqwidgets/jqxgrid.edit.js'
import 'jqwidgets-scripts/jqwidgets/jqxgrid.selection.js'
import 'jqwidgets-scripts/jqwidgets/jqxgrid.columnsresize.js'
import 'jqwidgets-scripts/jqwidgets/jqxgrid.columnsreorder.js'
import 'jqwidgets-scripts/jqwidgets/jqxgrid.pager.js'
import 'jqwidgets-scripts/jqwidgets/jqxgrid.sort.js'
import 'jqwidgets-scripts/jqwidgets/jqxgrid.filter.js'

// CSS 스타일
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'

export default {
  name: 'JqxCustomeGrid',
  components: { JqxGrid },
  props: {
    modelValue: { type: Array, default: () => [] },
    datafields: { type: Array, required: true },
    columns: { type: Array, required: true },
    keyField: { type: String, default: '' },
    width: { type: [Number, String], default: '100%' },
    height: { type: [Number, String], default: '100%' },
    theme: { type: String, default: '' },
    editable: { type: Boolean, default: true },
    selectionmode: { type: String, default: 'singlerow' },
    pageable: { type: Boolean, default: true },
    pagesize: { type: Number, default: 20 },
    pagesizeoptions: { type: Array, default: () => [10, 20, 50, 100] },
    sortable: { type: Boolean, default: true },
    filterable: { type: Boolean, default: false },
    columnsresize: { type: Boolean, default: true },
    columnsreorder: { type: Boolean, default: true },
    altrows: { type: Boolean, default: true },
    autoheight: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'ready'],
  data() {
    return {
      rows: [],
      adapter: null,
      source: null,
      seq: 0,
    }
  },
  computed: {
    idField() {
      return this.keyField && this.keyField.length ? this.keyField : '_rid'
    },
    augmentedDatafields() {
      // rowStatus 필드가 없으면 자동 추가
      return this.datafields.some((f) => f.name === 'rowStatus')
        ? this.datafields
        : [...this.datafields, { name: 'rowStatus', type: 'string' }]
    },
  },
  watch: {
    // 부모에서 v-model이 갱신되면 rows만 교체하고 바운드 데이터 갱신
    modelValue: {
      immediate: true,
      deep: true,
      handler(v) {
        this.rows = (v || []).map((r) => ({ ...r }))
        if (!this.adapter) {
          this.bind()
        } else {
          this.source.localdata = this.rows
          // 그리드가 이미 렌더된 경우에만 갱신
          this.$nextTick(() => this.$refs.grid?.updatebounddata('cells'))
        }
      },
    },
  },
  mounted() {
    this.$emit('ready', this.api())
  },
  methods: {
    // --------- Public API ---------
    api() {
      return {
        add: this.add,
        deleteSelected: this.deleteSelected,
        getCUD: this.getCUD,
        clearStatuses: this.clearStatuses,
        jqx: () => this.$refs.grid,
      }
    },
    add(initial = {}) {
      this.$refs.grid.addrow(null, initial)
    },
    deleteSelected() {
      const idxs = this.$refs.grid.getselectedrowindexes?.() || []
      idxs.forEach((i) => {
        const id = this.$refs.grid.getrowid(i)
        this.$refs.grid.deleterow(id)
      })
    },
    getCUD() {
      const added = [],
        updated = [],
        deleted = []
      for (const r of this.rows) {
        if (r.rowStatus === 'A') added.push(r)
        else if (r.rowStatus === 'U') updated.push(r)
        else if (r.rowStatus === 'D') deleted.push(r)
      }
      return { added, updated, deleted }
    },
    clearStatuses() {
      this.rows.forEach((r) => {
        if (r.rowStatus) delete r.rowStatus
      })
      this.sync()
    },

    // --------- jqx source / adapter ---------
    bind() {
      const that = this
      this.source = {
        datatype: 'array',
        localdata: this.rows,
        datafields: this.augmentedDatafields,
        id: this.idField,

        // 추가: rowdata 그대로 사용 + 최소 세팅
        addrow(rowid, rowdata, position, commit) {
          const id = rowdata[that.idField] || `__rid_${Date.now()}_${++that.seq}`
          rowdata[that.idField] = id
          rowdata.rowStatus = 'A'
          const i = that.indexById(id)
          i > -1 ? that.rows.splice(i, 1, rowdata) : that.rows.push(rowdata)
          commit(true)
          that.sync()
        },

        // 수정: newdata 에 변경사항이 전부 담김 → 가볍게 머지
        updaterow(rowid, newdata, commit) {
          const id = typeof rowid === 'object' ? rowid[that.idField] : rowid
          const i = that.indexById(id)
          if (i === -1) return commit(false)
          const prev = that.rows[i]
          const next = { ...prev, ...newdata }
          next.rowStatus = prev.rowStatus === 'A' ? 'A' : 'U'
          that.rows.splice(i, 1, next)
          commit(true)
          that.sync()
        },

        // 삭제: 물리삭제 대신 표시만 'D'
        deleterow(rowid, commit) {
          const id = typeof rowid === 'object' ? rowid[that.idField] : rowid
          const i = that.indexById(id)
          if (i === -1) return commit(false)
          that.rows[i].rowStatus = 'D'
          commit(true)
          that.sync()
        },
      }
      this.adapter = new jqx.dataAdapter(this.source)
    },

    sync() {
      this.$emit(
        'update:modelValue',
        this.rows.map((r) => ({ ...r }))
      )
    },
    indexById(id) {
      return this.rows.findIndex((r) => r[this.idField] === id)
    },
  },
}
</script>
