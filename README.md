# userPopExample (Vue3 Option API + Bootstrap 5 + Router)

## 실행 방법

```bash
npm i
npm run dev
```

### 변경 사항

- **UserPage.vue**: 기존 App.vue의 사용자 목록/팝업/우측 선택 목록 로직을 이 페이지로 이동.

### 파일 구조

- `src/App.vue` – NavBar + `<router-view/>`
- `src/router/index.js` – 라우팅 설정(`/` → `UserPage`)
- `src/pages/UserPage.vue` – 사용자 페이지(팝업/선택 이동 기능)
- `src/components/NavBar.vue` – 부트스트랩 네비게이션
- `src/components/UserPopup.vue`, `src/components/SelectedUsers.vue`
