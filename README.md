# Adversarial Clothing Web Service

YOLO 기반 객체 탐지 실패를 물리 환경에서 시연하기 위한 **적대적 패치(Adversarial Patch) 제작 의류 주문 웹 서비스**입니다.  
사용자는 의류를 선택하고 적대적 패치를 원하는 위치에 배치하여 커스텀 디자인을 주문할 수 있습니다.

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [3-Tier 아키텍처 구조](#3-tier-아키텍처-구조)
3. [시스템 흐름도](#시스템-흐름도)
4. [각 컨테이너 역할](#각-컨테이너-역할)
5. [컨테이너 간 연결 방식](#컨테이너-간-연결-방식)
6. [사용 포트 및 주요 설정](#사용-포트-및-주요-설정)
7. [데이터베이스 구조](#데이터베이스-구조)
8. [실행 방법](#실행-방법)
9. [프로젝트 폴더 구조](#프로젝트-폴더-구조)

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | Adversarial Clothing |
| 목적 | YOLO 탐지 회피용 적대적 패치 배치 의류 주문 웹 서비스 |
| 프론트엔드 | Next.js (React) |
| 백엔드 | Node.js + Express.js |
| 데이터베이스 | MySQL 8.0 |
| 인프라 | Docker + Docker Compose |

---

## 3-Tier 아키텍처 구조

본 프로젝트는 **Presentation - Application - Data** 3계층 구조로 설계되었습니다.

```
┌─────────────────────────────────────────────────────┐
│              Presentation Tier (프론트엔드)            │
│                   [frontend 컨테이너]                  │
│               Next.js / React  :3000                 │
│         사용자 UI, 페이지 렌더링, API 호출             │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP REST API 호출
                      │ (localhost:5000)
┌─────────────────────▼───────────────────────────────┐
│              Application Tier (백엔드)                │
│                   [backend 컨테이너]                   │
│             Node.js + Express.js  :5000              │
│       인증(JWT), 장바구니 API, 비즈니스 로직            │
└─────────────────────┬───────────────────────────────┘
                      │ mysql2 커넥션 풀
                      │ (DB_HOST=db, port 3306)
┌─────────────────────▼───────────────────────────────┐
│                 Data Tier (데이터베이스)               │
│                     [db 컨테이너]                      │
│                  MySQL 8.0  :3306                    │
│          users, products, designs, cart 테이블        │
└─────────────────────────────────────────────────────┘
```

### 각 Tier 설명

| Tier | 컨테이너 | 기술 스택 | 역할 |
|------|----------|-----------|------|
| **Presentation Tier** | `frontend` | Next.js (React) | 사용자 인터페이스, 페이지 라우팅, 백엔드 API 호출 |
| **Application Tier** | `backend` | Node.js + Express.js | REST API 제공, JWT 인증, 비즈니스 로직 처리, DB 쿼리 |
| **Data Tier** | `db` | MySQL 8.0 | 사용자, 상품, 디자인, 장바구니 데이터 영구 저장 |

---

## 시스템 흐름도

### 사용자 요청 흐름

```
브라우저 (localhost:3000)
        │
        │  1. 페이지 요청
        ▼
  [frontend 컨테이너]  ← Next.js SSR/CSR 렌더링
        │
        │  2. API 요청 (fetch/axios → localhost:5000)
        ▼
  [backend 컨테이너]   ← Express 라우터 처리
        │                 - /api/auth  : 회원가입 / 로그인
        │                 - /api/cart  : 장바구니 CRUD
        │
        │  3. SQL 쿼리 (mysql2 connection pool)
        ▼
    [db 컨테이너]       ← MySQL 8.0 데이터 처리
        │
        │  4. 쿼리 결과 반환
        ▼
  [backend 컨테이너]   ← JSON 응답 생성
        │
        │  5. API 응답 (JSON)
        ▼
  [frontend 컨테이너]  ← 화면 업데이트
        │
        ▼
브라우저 (결과 표시)
```

### 인증 흐름

```
클라이언트                백엔드                     DB
    │                      │                         │
    │── POST /api/auth/login ──▶│                    │
    │                      │── SELECT users ────────▶│
    │                      │◀─ user 데이터 반환 ──────│
    │                      │   bcrypt 비교            │
    │◀── JWT 토큰 발급 ─────│                         │
    │                      │                         │
    │── GET /api/cart ──────▶│  (헤더: user-id)       │
    │                      │── SELECT cart ─────────▶│
    │◀── 장바구니 목록 ──────│◀─ cart 데이터 반환 ─────│
```

---

## 각 컨테이너 역할

### 1. `frontend` 컨테이너 (Presentation Tier)

- **이미지**: 로컬 빌드 (`Dockerfile` in 루트)
- **기술**: Next.js 14, React
- **역할**:
  - 사용자에게 보여지는 모든 UI 화면 제공
  - 의류 상품 목록, 디자인 커스터마이징 화면
  - 회원가입/로그인 페이지
  - 장바구니 화면
  - 백엔드 API와 통신하여 데이터 표시
- **포트**: 3000

### 2. `backend` 컨테이너 (Application Tier)

- **이미지**: 로컬 빌드 (`./backend/Dockerfile`)
- **기술**: Node.js, Express.js, mysql2, JWT, bcrypt
- **역할**:
  - REST API 엔드포인트 제공
  - 회원가입/로그인 처리 및 JWT 토큰 발급
  - 비밀번호 bcrypt 암호화
  - 장바구니 항목 조회/추가/삭제
  - MySQL 커넥션 풀 관리
- **포트**: 5000
- **주요 API**:

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 (JWT 발급) |
| GET | `/api/cart` | 장바구니 목록 조회 |
| POST | `/api/cart` | 장바구니 항목 추가 |
| DELETE | `/api/cart/:id` | 장바구니 항목 삭제 |

### 3. `db` 컨테이너 (Data Tier)

- **이미지**: `mysql:8.0` (공식 이미지)
- **역할**:
  - 모든 서비스 데이터의 영구 저장소
  - 사용자 계정 정보 관리
  - 상품 정보 저장
  - 적대적 패치 디자인 데이터 저장
  - 장바구니 데이터 관리
- **포트**: 3306
- **초기화**: `./db/init.sql` 스크립트로 테이블 자동 생성 및 초기 데이터 삽입

---

## 컨테이너 간 연결 방식

Docker Compose는 기본적으로 모든 서비스를 **동일한 내부 네트워크**에 배치합니다. 컨테이너들은 서비스 이름을 호스트명으로 사용하여 서로 통신합니다.

```
[frontend] ──────▶ 브라우저를 통한 간접 통신 ──────▶ [backend]
                   (localhost:5000 → 컨테이너 5000)

[backend]  ──────▶ Docker 내부 네트워크 ──────▶ [db]
                   (DB_HOST=db, port 3306)
```

### 연결 설정 상세

| 연결 | 방식 | 설정 |
|------|------|------|
| 브라우저 → frontend | 포트 매핑 | `3000:3000` |
| 브라우저 → backend | 포트 매핑 | `5000:5000` |
| backend → db | Docker 내부 DNS | `DB_HOST=db` (서비스명) |

### 실행 순서 (depends_on)

```
db 컨테이너 시작
      │
      ▼
backend 컨테이너 시작  (depends_on: db)
      │
      ▼
frontend 컨테이너 시작  (depends_on: backend)
```

---

## 사용 포트 및 주요 설정

### 포트 정보

| 컨테이너 | 내부 포트 | 외부 포트 | 접근 URL |
|----------|-----------|-----------|----------|
| frontend | 3000 | 3000 | http://localhost:3000 |
| backend | 5000 | 5000 | http://localhost:5000 |
| db | 3306 | 3306 | localhost:3306 |

### 환경 변수 (`backend/.env`)

| 변수명 | 값 | 설명 |
|--------|----|------|
| `PORT` | 5000 | 백엔드 서버 포트 |
| `DB_HOST` | db | MySQL 컨테이너 호스트명 |
| `DB_PORT` | 3306 | MySQL 포트 |
| `DB_USER` | root | DB 사용자 |
| `DB_PASSWORD` | 1234 | DB 비밀번호 |
| `DB_NAME` | adversarial_clothing | 데이터베이스명 |
| `JWT_SECRET` | supersecretkey | JWT 서명 키 |

### MySQL 환경 변수 (docker-compose.yml)

| 변수명 | 값 | 설명 |
|--------|----|------|
| `MYSQL_ROOT_PASSWORD` | 1234 | root 비밀번호 |
| `MYSQL_DATABASE` | adversarial_clothing | 초기 생성 DB명 |

### 볼륨

| 볼륨명/경로 | 마운트 위치 | 용도 |
|-------------|-------------|------|
| `mysql_data` | `/var/lib/mysql` | MySQL 데이터 영속성 유지 |
| `.` | `/app` | frontend 소스코드 핫리로드 |
| `./db/init.sql` | `/docker-entrypoint-initdb.d/init.sql` | DB 초기화 스크립트 |

---

## 데이터베이스 구조

### ERD

```
users
├── id (PK)
├── name
├── email (UNIQUE)
├── phone
├── password (bcrypt 해시)
└── created_at

products
├── id (PK)
├── name
├── category
├── price
├── image_url
└── created_at

designs
├── id (PK)
├── user_id (FK → users.id)
├── product_id (FK → products.id)
├── title
├── front_image_url
├── back_image_url
├── patch_x, patch_y          ← 패치 위치 좌표
├── patch_width, patch_height ← 패치 크기
└── created_at

cart
├── id (PK)
├── user_id (FK → users.id)
├── product_name
├── color
├── size
├── quantity
├── price
└── created_at
```

---

## 실행 방법

### 사전 요구사항

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
- [Docker Compose](https://docs.docker.com/compose/) (Docker Desktop에 포함)

### 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd adversarial-clothing

# 2. 전체 서비스 빌드 및 실행
docker-compose up --build

# 3. 백그라운드 실행 (선택)
docker-compose up --build -d
```

### 접속

| 서비스 | URL |
|--------|-----|
| 웹사이트 | http://localhost:3000 |
| 백엔드 API | http://localhost:5000 |

### 종료

```bash
# 컨테이너 중지
docker-compose down

# 컨테이너 + 볼륨(DB 데이터) 함께 삭제
docker-compose down -v
```

### 로그 확인

```bash
# 전체 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs backend
docker-compose logs db
```

---

## 프로젝트 폴더 구조

```
adversarial-clothing/
├── docker-compose.yml         # 전체 서비스 오케스트레이션
├── Dockerfile                 # frontend 컨테이너 빌드 설정
├── package.json               # Next.js 의존성
├── app/                       # Next.js 앱 라우터 (프론트엔드)
│   └── ...
├── backend/                   # 백엔드 서비스
│   ├── Dockerfile             # backend 컨테이너 빌드 설정
│   ├── .env                   # 환경 변수 (DB 연결 정보, JWT 키)
│   ├── server.js              # Express 서버 진입점
│   ├── db.js                  # MySQL 커넥션 풀 설정
│   └── routes/
│       ├── auth.js            # 회원가입/로그인 API
│       └── cart.js            # 장바구니 CRUD API
└── db/
    └── init.sql               # DB 초기화 스크립트 (테이블 생성)
```