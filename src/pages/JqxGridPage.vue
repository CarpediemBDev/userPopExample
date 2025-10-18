<template>
  <div class="container py-3" style="height: 600px">
    <div class="mb-2 d-flex gap-2">
      <button class="btn btn-primary btn-sm" @click="onAdd">추가</button>
      <button class="btn btn-outline-danger btn-sm" @click="api?.deleteSelected()">삭제</button>
      <button class="btn btn-outline-secondary btn-sm" @click="logCUD">변경확인</button>
    </div>

    <JqxCustomeGrid
      v-model="rows"
      :datafields="datafields"
      :columns="columns"
      key-field="userId"
      :height="560"
      theme="bootstrap"
      @ready="(v) => (api = v)"
    />
  </div>
</template>

<script>
import JqxCustomeGrid from '@/components/JqxCustomeGrid.vue' // alias 없으면 '../components/JqxCustomeGrid.vue'

export default {
  name: 'JqxGridPage',
  components: { JqxCustomeGrid },
  data() {
    return {
      api: null,
      rows: [], // db.json에서 로드
      datafields: [
        { name: 'userId', type: 'number' },
        { name: 'name', type: 'string' },
        { name: 'dept', type: 'string' },
        { name: 'role', type: 'string' },
        // rowStatus는 공통컴포넌트가 자동 보강
      ],
      columns: [
        { text: 'ID', datafield: 'userId', width: 100 },
        { text: '이름', datafield: 'name', width: 160, editable: true },
        { text: '부서', datafield: 'dept', width: 160, editable: true },
        { text: '역할', datafield: 'role', editable: true },
      ],
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      // Vite 환경에서도 동작하도록 BASE_URL 고려
      const url =
        (import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/') + 'db.json'
      const res = await fetch(url)
      const data = await res.json()
      this.rows = Array.isArray(data) ? data : data.users || []
    },
    onAdd() {
      const nextId = this.genId()
      this.api?.add({ userId: nextId, name: '', dept: '', role: '' })
    },
    logCUD() {
      console.log(this.api?.getCUD())
    },
    genId() {
      return Math.floor(Math.random() * 1e9)
    },
  },
}
</script>
