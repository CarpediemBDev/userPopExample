<template>
  <div>
    <div v-if="!users.length" class="text-muted small">오른쪽 화살표로 사용자를 추가하세요.</div>
    <div v-for="u in users" :key="u.userId" class="d-flex align-items-center justify-content-between border rounded-3 p-2 mb-2">
      <div>
        <strong>{{ u.name }}</strong>
        <div class="text-muted small">#{{ u.userId }} · {{ u.dept }}</div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-danger btn-sm" @click="$emit('remove', u.userId)">제거</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectedUsers',
  props: { users: { type: Array, required: true } },
}
</script>
