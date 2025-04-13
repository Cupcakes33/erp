# Project Configuration (LTM)

_This file contains the stable, long-term context for the project._
_It should be updated infrequently, primarily when core goals, tech, or patterns change._

---

## Core Goal

ERP 시스템을 개발하여 지시, 작업, 인사, 결제 등의 업무 관리를 디지털화하고 효율화합니다. 특히 건설/보수 공사 관련 업무의 지시 관리, 작업자 관리, 작업(일위대가) 관리, 기성 관리에 중점을 두며, 사용자 권한에 따른 차별화된 기능을 제공합니다.

---

## Tech Stack

- **Frontend Framework:** React 17, Vite
- **State Management:** Zustand, Redux Toolkit
- **Data Fetching:** React Query (TanStack Query), Axios
- **Routing:** React Router Dom v6
- **Styling:** TailwindCSS, PostCSS
- **File Processing:** xlsx (엑셀 파일 처리)
- **Development Tools:** ESLint, Prettier
- **Build Tool:** Vite
- **인증:** JWT 기반 인증 시스템

---

## Critical Patterns & Conventions

- **State Management:** Zustand 스토어를 사용하여 전역 상태를 관리합니다. 주요 기능별로 분리된 스토어(인증, 지시, 작업 등)를 사용합니다.
- **컴포넌트 구조:** Atomic Design 패턴을 따릅니다 (atoms, molecules, layout 등).
- **라우팅:** 중첩 라우팅과 레이아웃 컴포넌트를 활용한 구조를 사용합니다.
- **인증:** JWT 토큰 기반 인증 시스템을 사용합니다.
- **코드 스타일:** 함수형 컴포넌트와 React Hooks를 주로 사용합니다.
- **디렉토리 구조:** 기능별 디렉토리 구조(feature-based)를 채택합니다.
- **권한 관리:** 사용자 유형(관리자, 담당자, 일반)에 따른 차별화된 기능 접근 권한을 제공합니다.
- **데이터 모델:**
  - **사용자:** ID, 유형(관리자/담당자/일반), 이름, 이메일, 비밀번호
  - **지시:** ID, 제목, 상태(5단계), 담당자, 접수채널, 접수일, 위치(동/번지), 세부사항, 작업내역, 비고, 기성회차, 작업자, 수정자
  - **작업(일위대가):** ID, 호표(공종ID), 공종명, 규격, 단위, 재료비, 노무비, 경비, 합계
  - **작업자:** ID, 이름, 생년월일, 연락처, 직급, 상태(재직/퇴사)

---

## Key Constraints

- **인증 시스템:** 보안을 위해 JWT 토큰 기반 인증이 필요합니다.
- **반응형 디자인:** 다양한 디바이스에서 작동하는 반응형 UI가 필요합니다.
- **데이터 가져오기:** 현재는 모의(mock) 데이터를 사용하고 있지만, 실제 API 구현을 준비해야 합니다.
- **성능 최적화:** 대량의 데이터를 처리할 때 성능 최적화가 필요합니다.
- **사용자 역할:** 관리자(1개), 담당자(2개), 일반 사용자(2개)의 계정 유형이 필요합니다.
- **파일 처리:** 엑셀 파일 업로드 및 파싱, 다양한 형식의 문서 출력 기능이 필요합니다.
- **비밀번호 규칙:** 영어+숫자 5-12자리 구성으로 제한됩니다.
- **지시 상태 관리:** 접수, 작업중, 작업완료, 결재중, 완료의 5단계 상태가 필요합니다.

---

## Tokenization Settings

- **Estimation Method:** Character-based
- **Characters Per Token (Estimate):** 4
