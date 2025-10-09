<template>
  <div v-for="u in users" :key="u.userId" class="position-relative p-2 border rounded-3 mb-2">
    <div>
      <strong>{{ u.name }}</strong>
      <div class="text-muted small">#{{ u.userId }} · {{ u.dept }}</div>
    </div>

    <!-- 우상단 + 작은 X -->
    <button
      type="button"
      class="btn-close position-absolute top-0 end-0 mt-2 me-2"
      aria-label="Close"
      @click="$emit('remove', u.userId)"
    ></button>
  </div>
</template>

<script>
export default {
  name: 'SelectedUsers',
  props: { users: { type: Array, required: true } },
}
</script>
