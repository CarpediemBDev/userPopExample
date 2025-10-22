# Frontend - Vue 3 Application

사용자 관리 시스템의 프론트엔드 애플리케이션입니다.

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 목업 데이터 생성
npm run make:db

# 개발 서버 실행
npm run dev
```

## 🛠️ 기술 스택

- **Framework**: Vue 3 (Options API)
- **Router**: Vue Router 4 (Children 방식)
- **UI Library**: Bootstrap 5
- **Grid Component**: JqWidgets
- **Build Tool**: Vite
- **Runtime**: Node.js (Volta 관리)

## 📁 프로젝트 구조

```
src/
├── App.vue                  # 🎯 라우터 + 페이지 전환 애니메이션
├── layouts/                 # 📐 레이아웃 컴포넌트
│   └── MainLayout.vue      # Header + Main + Footer 구조
├── pages/                   # 📄 페이지 컴포넌트
│   ├── UserPage.vue        # 사용자 관리 페이지
│   ├── UserSearGridPage.vue # 사용자 검색 그리드 페이지
│   └── JqxGridPage.vue     # JqxGrid 샘플 페이지
├── components/              # 🧩 재사용 컴포넌트
│   ├── NavBar.vue          # 네비게이션 바 (반응형)
│   ├── UserPopup.vue       # 사용자 선택 모달
│   ├── SelectedUsers.vue   # 선택된 사용자 목록
│   ├── SearchGrid.vue      # 검색 그리드
│   ├── PagedList.vue       # 페이지네이션
│   └── JqxCustomeGrid.vue  # JqxGrid 래퍼
├── utils/                   # 🛠️ 유틸리티
│   ├── showPop.js          # 모달 관리 시스템
│   ├── generateMockUsers.js # 목업 데이터 생성
│   └── toastUtil.js        # 토스트 알림
├── assets/                  # 🎨 정적 자원
│   └── styles/
│       └── transitions.css # 페이지 전환 애니메이션
└── router/                  # 🛣️ 라우팅
    └── index.js            # Vue Router 설정
```

## 🎨 UI/UX 특징

### 페이지 전환 애니메이션

- `slide-right`: 앞으로 이동 (오른쪽에서 들어옴)
- `slide-left`: 뒤로 이동 (왼쪽에서 들어옴)
- `fade`, `scale`, `slide-up`: 기타 전환 효과

### 반응형 디자인

- **Desktop**: Bootstrap 드롭다운 메뉴
- **Mobile**: Bootstrap 오프캔버스 + 뒤로가기 버튼

### 모달 시스템

```javascript
// 3가지 사용 방식
import { openUserPopup } from '@/utils/showPop.js'

// 1. 헬퍼 함수 (추천)
const users = await openUserPopup()

// 2. 직접 호출
const users = await show(UserPopup, params, options)

// 3. 플러그인 (전역)
const users = await this.$modal.show(UserPopup, params)
```

## 🔧 개발 가이드

### 환경 변수

```bash
# .env.local
VITE_API_URL=http://localhost:3001/api
```

### 빌드 & 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run make:db`: 목업 데이터 생성

## 📦 주요 의존성

```json
{
  "vue": "^3.x",
  "vue-router": "^4.x",
  "bootstrap": "^5.x",
  "bootstrap-icons": "^1.x"
}
```
