# userPopExample (Vue3 Option API + Bootstrap 5 + Router)

## 실행 방법

## Runtime 버전 관리 (Volta)

이 프로젝트는 **Volta**로 Node와 npm 버전을 고정합니다. 로컬/CI/배포 환경 어디서든 동일한 런타임을 보장합니다.

### 1) Volta 설치 & 실행

**macOS / Linux**

````bash
# 1) 스크립트 다운로드 후 실행
wget -qO- https://get.volta.sh | bash

# 설치 후 새 터미널 열기 (또는 ~/.zshrc / ~/.bashrc 재로드)

```bash

# npm 설치 및 실행
npm i
npm run dev
````

### 변경 사항

- **UserPage.vue**: 기존 App.vue의 사용자 목록/팝업/우측 선택 목록 로직을 이 페이지로 이동.

### 파일 구조

- `src/App.vue` – NavBar + `<router-view/>`
- `src/router/index.js` – 라우팅 설정(`/` → `UserPage`)
- `src/pages/UserPage.vue` – 사용자 페이지(팝업/선택 이동 기능)
- `src/components/NavBar.vue` – 부트스트랩 네비게이션
- `src/components/UserPopup.vue`, `src/components/SelectedUsers.vue`
