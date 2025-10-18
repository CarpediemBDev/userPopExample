<template>
  <div class="container py-3" style="height: 600px">
    <div class="mb-2 d-flex gap-2">
      <button class="btn btn-primary btn-sm" @click="add">추가</button>
      <button class="btn btn-outline-danger btn-sm" @click="delete">삭제</button>
      <button class="btn btn-outline-secondary btn-sm" @click="logCUD">변경확인</button>
      <button class="btn btn-success btn-sm" @click="saveData">저장</button>
    </div>

    <JqxCustomeGrid
      ref="grd"
      :localdata="rows"
      :datafields="datafields"
      :columns="columns"
      selectionmode="multiplerows"
      :height="560"
      theme="bootstrap"
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
      // [FIXED] api 제거
      rows: [], // db.json에서 로드
      datafields: [
        { name: 'userId', type: 'string' },
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
      const url = (import.meta.env?.BASE_URL ?? '/') + 'db.json'
      const res = await fetch(url)
      const data = await res.json()
      this.rows = Array.isArray(data) ? data : data.users || []
      // rows가 세팅되면 자식이 bind() → adapter 준비 → CUD 콜백 바인딩
    },
    add() {
      // ID는 JqxCustomeGrid의 addrow 콜백에서 자동 생성
      this.$refs.grd?.add({ name: '', dept: '', role: '' })
    },
    delete() {
      this.$refs.grd?.deleteSelected()
    },
    logCUD() {
      console.log(this.$refs.grd?.getChanges())
    },
    saveData() {
      // 저장시에 변경사항만 가져오기
      const changes = this.$refs.grd?.getChanges()
      console.log('Saving changes:', changes)
      // 서버에 저장 로직 - 보통 변경사항(CUD)만 전송
    },
  },
}
</script>
