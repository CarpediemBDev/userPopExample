<template>
  <form class="search-bar py-2 px-3 bg-light rounded shadow-sm mb-3" @submit.prevent="emitOpen">
    <div class="row g-2 align-items-end">
      <div class="col-12 col-md-6">
        <label class="form-label">사용자(이름/ID)</label>
        <div class="input-group">
          <input
            v-model="form.userNames"
            class="form-control"
            placeholder="이름 또는 ID 입력 후 Enter"
            @keydown.enter.prevent.stop="emitOpen"
          />
          <button type="button" class="btn btn-outline-primary" @click="emitOpen">검색</button>
        </div>
      </div>

      <!-- 필요 시 다른 검색 조건 칸 추가 가능 -->

      <div
        class="col-12 col-md-auto ms-md-auto d-flex justify-content-end align-items-center pe-md-3"
      >
        <button type="button" class="btn btn-primary" @click="onSearch">조회</button>
        <button type="button" class="btn btn-secondary ms-2" @click="onReset">초기화</button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'SearchGrid',
  emits: ['open-user-popup', 'search'],
  data() {
    return {
      form: {
        // 화면 표시용: 팝업에서 선택 후 "홍길동, 김길동" 형태로 보여줄 값
        userNames: '',
        // 선택 결과의 실제 ID 보관(옵션, 서버 조회에 유용)
        userIds: [],
      },
    }
  },
  methods: {
    // 부모에게 "팝업 열어줘" 요청
    emitOpen() {
      // 필요하면 현재 입력값(this.form.userNames)을 함께 넘겨 필터에 쓰도록 확장 가능
      this.$emit('open-user-popup', this.form.userNames)
    },

    // 부모(UserPage)가 팝업 확인 시 호출해 주는 메서드
    // selectedList: [{ userId, name, ... }, ...]
    setUsersFromPopup(selectedList) {
      const users = Array.isArray(selectedList) ? selectedList : []
      this.form.userNames = users
        .map((u) => u?.name ?? '')
        .filter(Boolean)
        .join(', ')
      this.form.userIds = users.map((u) => u?.userId).filter(Boolean)
    },
    // 초기화
    onReset() {
      this.form = { userNames: '', userIds: [] }
    },

    // 조회
    onSearch() {
      this.$emit('search', { ...this.form })
    },
  },
}
</script>
