<template>
  <div class="container py-4">
    <h3>JqxGrid 데모</h3>
    <p class="text-muted">db.json 데이터를 사용하여 jqxGrid를 시도합니다. (없으면 테이블 대체)</p>
    <JqxGridCommon />
  </div>
</template>

<script>
import JqxGridCommon from '../components/JqxGridCommon.vue'

export default {
  name: 'JqxGridPage',
  components: { JqxGridCommon },
}
</script>

<style scoped></style>
