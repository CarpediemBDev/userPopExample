<template>
  <!-- renderless: render slot content directly, provide paging helpers -->
  <slot
    :items="pageItems"
    :page="pageInternal"
    :totalPages="totalPages"
    :goPrev="goPrev"
    :goNext="goNext"
  ></slot>
</template>

<script>
export default {
  name: 'PagedList',
  props: {
    items: { type: Array, default: () => [] },
    pageSize: { type: Number, default: 10 },
    page: { type: Number, default: 1 },
  },
  emits: ['update:page'],
  data() {
    return {
      pageInternal: this.page || 1,
    }
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil((this.items || []).length / this.pageSize))
    },
    pageItems() {
      const start = (this.pageInternal - 1) * this.pageSize
      return (this.items || []).slice(start, start + this.pageSize)
    },
  },
  watch: {
    page(val) {
      this.pageInternal = val || 1
    },
    items() {
      // ensure pageInternal in range
      if (this.pageInternal > this.totalPages) {
        this.setPage(this.totalPages)
      }
    },
  },
  methods: {
    setPage(p) {
      const next = Math.min(Math.max(1, p || 1), this.totalPages)
      this.pageInternal = next
      this.$emit('update:page', next)
    },
    goPrev() {
      if (this.pageInternal > 1) this.setPage(this.pageInternal - 1)
    },
    goNext() {
      if (this.pageInternal < this.totalPages) this.setPage(this.pageInternal + 1)
    },
  },
}
</script>
