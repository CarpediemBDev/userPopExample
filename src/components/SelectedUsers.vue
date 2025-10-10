<template>
  <!-- 팝업/페이지 양쪽에서 같은 레이아웃이 되도록 카드 대신 경량 컨테이너 사용 -->
  <div class="border rounded-3 d-flex flex-column h-100">
    <!-- 헤더: 선택 n명 + 전체 선택해제 -->
    <div class="p-2 border-bottom d-flex justify-content-between align-items-center">
      <small class="text-muted">선택 {{ users.length }}명</small>
      <button
        class="btn btn-outline-secondary btn-sm"
        :disabled="!users.length"
        @click="$emit('clear')"
      >
        전체 선택해제
      </button>
    </div>

    <!-- 바디: 스크롤 영역 -->
    <div class="p-2 flex-grow-1 overflow-auto">
      <div v-if="!users.length" class="text-muted small py-2">체크박스로 사용자를 선택하세요.</div>

      <div
        v-else
        v-for="u in users"
        :key="u.userId"
        class="d-flex align-items-start justify-content-between border rounded-3 p-2 mb-2"
      >
        <div>
          <strong>{{ u.name }}</strong>
          <div class="text-muted small">
            <span class="font-monospace">{{ u.userId }}</span> · {{ u.dept }} · {{ u.role }}
          </div>
        </div>
        <button class="btn-close" @click="$emit('remove', u.userId)"></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectedUsers',
  props: { users: { type: Array, required: true } },
  emits: ['remove', 'clear'],
}
</script>
