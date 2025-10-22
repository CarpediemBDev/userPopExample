# userPopExample - Full Stack Application

Vue 3 + Express.js를 활용한 사용자 관리 시스템

## 🏗️ 프로젝트 구조

```
userPopExample/
├── frontend/          # Vue 3 프론트엔드
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/           # Express.js 백엔드
│   ├── src/
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 개발 환경 설정

### Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

### Backend 실행  
```bash
cd backend
npm install
npm run dev
```

## 🛠️ 기술 스택

### Frontend
- Vue 3 (Options API)
- Vue Router 4
- Bootstrap 5
- JqWidgets
- Vite

### Backend
- Node.js
- Express.js
- JWT 인증
- MySQL
- bcrypt

## 📋 주요 기능

- [x] 사용자 관리 UI
- [x] 반응형 디자인
- [x] 모달 시스템
- [x] 페이지 전환 애니메이션
- [ ] JWT 인증/인가
- [ ] 사용자 CRUD API
- [ ] 메뉴 권한 관리
- [ ] 데이터베이스 연동

## 🔧 개발 가이드

### 포트 설정
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### API 엔드포인트
- `GET /api/health` - 서버 상태 확인
- `POST /api/auth/login` - 로그인
- `GET /api/users` - 사용자 목록
- `GET /api/menu` - 메뉴 데이터

## 🚀 빠른 시작

이 프로젝트는 **Volta**로 Node와 npm 버전을 고정합니다. 로컬/CI/배포 환경 어디서든 동일한 런타임을 보장합니다.

이 프로젝트는 **Volta**로 Node와 npm 버전을 고정합니다.

**설치 (Window / Linux)**

```bash
wget -qO- https://get.volta.sh | bash
# 설치 후 새 터미널 열기
```

### 2) 프로젝트 실행

```bash
# 의존성 설치
npm i

# 샘플 데이터 생성 (100명, 시드 42)
npm run make:db

# 개발서버 실행
npm run dev
```

## 📁 프로젝트 구조

### 아키텍처 개요

```
Vue Router Children 방식 사용
App.vue → MainLayout → 각 페이지들
```

### 폴더 구조

```
src/
├── App.vue                      # 🎯 라우터 + 페이지 전환 애니메이션
│
├── layouts/                     # 📐 레이아웃 컴포넌트
│   └── MainLayout.vue          # Header + Main + Footer 구조
│
├── pages/                       # 📄 페이지 컴포넌트
│   ├── UserPage.vue            # 사용자 관리 페이지
│   ├── UserSearGridPage.vue    # 사용자 검색 그리드 페이지
│   └── JqxGridPage.vue         # JqxGrid 샘플 페이지
│
├── components/                  # 🧩 재사용 컴포넌트
│   ├── NavBar.vue              # 네비게이션 바 (반응형)
│   ├── UserPopup.vue           # 사용자 선택 모달
│   ├── SelectedUsers.vue       # 선택된 사용자 목록
│   ├── SearchGrid.vue          # 검색 그리드
│   ├── PagedList.vue           # 페이지네이션
│   └── JqxCustomeGrid.vue      # JqxGrid 래퍼
│
├── utils/                       # 🛠️ 유틸리티
│   ├── showPop.js              # 모달 관리 시스템
│   ├── generateMockUsers.js    # 목업 데이터 생성
│   └── toastUtil.js            # 토스트 알림
│
├── assets/                      # 🎨 정적 자원
│   └── styles/
│       └── transitions.css     # 페이지 전환 애니메이션
│
└── router/                      # 🛣️ 라우팅
    └── index.js                # Vue Router 설정
```

## 🏗️ 핵심 아키텍처

### 1. Layout System (Children 방식)

```javascript
// router/index.js
{
  path: '/',
  component: MainLayout,           // 공통 레이아웃
  children: [
    { path: '', component: UserPage },
    { path: 'search-grid', component: UserSearGridPage },
    { path: 'jqx-grid', component: JqxGridPage }
  ]
}
```

### 2. Modal Management System

```javascript
// 3가지 사용 방식 제공
import { openUserPopup } from '@/utils/showPop.js'

// 방식 1: 헬퍼 함수 (추천)
const users = await openUserPopup()

// 방식 2: 직접 호출
const users = await show(UserPopup, params, options)

// 방식 3: 플러그인 (전역)
const users = await this.$modal.show(UserPopup, params)
```

### 3. Component Features

- **드래그 가능한 모달**: showPop.js에서 중앙 관리
- **반응형 네비게이션**: 데스크톱(드롭다운) + 모바일(오프캔버스)
- **페이지네이션**: 좌측 목록 + 우측 선택 목록 각각 독립적
- **정렬/필터링**: 클라이언트 사이드 처리

## 🎨 UI/UX Features

### 페이지 전환 애니메이션

```css
/* transitions.css에서 관리 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s;
}
```

### 반응형 디자인

- **Desktop**: Bootstrap 드롭다운 메뉴
- **Mobile**: Bootstrap 오프캔버스 메뉴
- **Grid**: Bootstrap responsive classes 활용

## 🔧 기술 스택

- **Frontend**: Vue 3 (Options API)
- **UI Framework**: Bootstrap 5
- **Grid Component**: JqWidgets
- **Router**: Vue Router 4
- **Build Tool**: Vite
- **Package Manager**: npm
- **Runtime**: Node.js (Volta 관리)

## 📝 주요 기능

1. **사용자 관리**: 목록 조회, 선택, 이동 기능
2. **모달 시스템**: 드래그 가능한 사용자 선택 팝업
3. **검색/정렬**: 실시간 필터링 및 정렬
4. **페이지네이션**: 대량 데이터 처리
5. **반응형 UI**: 모바일/데스크톱 최적화

## 🗂️ 데이터 관리

```bash
# 목업 데이터 생성
npm run make:db

# 생성된 파일
public/db.json  # 100명의 가상 사용자 데이터
```
