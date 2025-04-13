# Workflow State & Rules (STM + Rules + Log)

_This file contains the dynamic state, embedded rules, active plan, and log for the current session._
_It is read and updated frequently by the AI during its operational loop._

---

## State

_Holds the current status of the workflow._

```yaml
Phase: CONSTRUCT # Current workflow phase (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: IN_PROGRESS # Current status (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: ERPImplementation # Identifier for the main task being worked on
CurrentStep: 3 # Identifier for the specific step in the plan being executed
CurrentItem: null # Identifier for the item currently being processed in iteration
```

---

## Plan

_Contains the step-by-step implementation plan generated during the BLUEPRINT phase._

**Task: ERPImplementation**

- `[x] Step 1: 사이드바 업데이트`

  - `[x] 1.1: 사이드바 컴포넌트에 '인사 관리'와 '기성 관리' 메뉴 추가`
  - `[x] 1.2: App.jsx에 관련 라우트 추가`
  - `[x] 1.3: 인사 관리 페이지 컴포넌트 개발 (목록, 추가, 상세, 수정)`
  - `[x] 1.4: 기성 관리 페이지 컴포넌트 개발 (공종별 조회 페이지)`

- `[ ] Step 2: 인증 시스템 구현`

  - `[ ] 2.1: 로그인 컴포넌트 개발 (아이디/비밀번호 입력 폼, 검증 로직)`
  - `[ ] 2.2: 사용자 유형별 계정 설정 (관리자 1개, 담당자 2개, 일반 2개)`
  - `[ ] 2.3: 비밀번호 초기화 기능 구현 (이메일 발송 시스템 연동)`
  - `[ ] 2.4: 계정 관리 페이지 개발 (프로필 정보 수정, 비밀번호 변경)`
  - `[ ] 2.5: 비밀번호 유효성 검증 로직 구현 (영어+숫자 5-12자리)`

- `[ ] Step 3: UI 컴포넌트 개선`

  - `[x] 3.1: 현재 사용 중인 UI 컴포넌트 분석 및 목록화`
  - `[x] 3.2: shadcn 컴포넌트 라이브러리 설치 및 구성`
  - `[ ] 3.3: 테이블 컴포넌트를 shadcn 데이터 테이블로 교체`
  - `[x] 3.4: 폼 요소(버튼, 입력필드, 체크박스 등)를 shadcn 컴포넌트로 교체`
  - `[x] 3.5: sweetalert2 라이브러리 설치 및 구성`
  - `[ ] 3.6: 기존 모달 다이얼로그를 sweetalert2로 교체`
  - `[ ] 3.7: 컴포넌트 교체 후 스타일 및 기능 테스트`
  - `[x] 3.8: 사이드바 컴포넌트를 shadcn/ui 컴포넌트로 교체 및 반응형 지원 추가`

- `[ ] Step 4: 지시 관리 시스템 구현`

  - `[ ] 4.1: 엑셀 파일 업로드 및 파싱 기능 개발`
  - `[ ] 4.2: 개별 지시 생성 폼 개발 (최소 제목만으로 생성 가능)`
  - `[ ] 4.3: 지시 상태 관리 시스템 구현 (5단계: 접수, 작업중, 작업완료, 결재중, 완료)`
  - `[ ] 4.4: 지시 상세 정보 필드 추가 (작업자, 작업현황, 비고, 기성회차, 즐겨찾기 등)`
  - `[ ] 4.5: 발주 정보 관리 기능 구현 (지시 담당자, 접수채널, 접수일 등)`
  - `[ ] 4.6: 작업 등록 및 연결 기능 개발 (검색 후 선택, 수량/산출내역 입력, 실시간 금액 계산)`
  - `[ ] 4.7: 지시 수정 기능 구현 (기성 반영 전 지시만 수정 가능하도록 제한)`
  - `[ ] 4.8: 검색 및 필터링 기능 개발 (번지/동 검색, 날짜/상태 필터링)`
  - `[ ] 4.9: 목록 표시 필드 사용자화 (필요 필드 표시 설정)`
  - `[ ] 4.10: 다양한 형식의 조회/출력 기능 구현 (보수확인서, 물량산출 근거, 내역서)`
  - `[ ] 4.11: 일괄 출력 기능 개발 (여러 지시 동시 출력)`
  - `[ ] 4.12: 수정 이력 추적 기능 구현 (마지막 수정자 표시)`

- `[x] Step 5: 상태 관리 모듈화`

  - `[x] 5.1: Zustand 스토어 파일 구조 설계 (/lib/zustand/)`
  - `[x] 5.2: UI 상태용 Zustand 스토어 구현 (auth 등 로컬 상태)`
  - `[x] 5.3: TanStack Query 구조 설계 및 API 호출 모듈 구현 (/lib/api/)`

- `[x] Step 6: 인사 관리 시스템 구현`

  - `[x] 6.1: 작업자 API 모듈 개발 (personnelAPI.js)`
  - `[x] 6.2: 작업자 Query 훅 개발 (personnelQueries.js)`
  - `[x] 6.3: 작업자 데이터 모델 설계 (ID, 이름, 생년월일, 연락처, 직급, 상태)`
  - `[x] 6.4: 작업자 목록/상세/수정 컴포넌트 React Query 연동`

- `[x] Step 7: API 통합 Layer 구현`

  - `[x] 7.1: API 호출 모듈 구조화 (mockedAPI 포함)`
  - `[x] 7.2: React Query Custom Hooks 구현`
  - `[x] 7.3: API 호출 모듈과 React Query 통합`

- `[ ] Step 8: 기성 관리 시스템 구현`

  - `[ ] 8.1: 공종별 공사 대금 조회 기능 개발 (관리자 권한)`
  - `[ ] 8.2: 주소별 공사 대금 조회 기능 개발 (관리자 권한)`
  - `[ ] 8.3: 기성별 공사 대금 조회 기능 개발 (관리자 권한)`

- `[ ] Step 9: 통합 및 테스트`
  - `[ ] 9.1: 모든 기능 통합`
  - `[ ] 9.2: 사용자 권한별 테스트 (관리자, 담당자, 일반 사용자)`
  - `[ ] 9.3: 성능 테스트 및 최적화`
  - `[ ] 9.4: 오류 수정 및 사용성 개선`

---

## Rules

_Embedded rules governing the AI's autonomous operation._

**# --- Core Workflow Rules ---**

RULE_WF_PHASE_ANALYZE:
**Constraint:** Goal is understanding request/context. NO solutioning or implementation planning.

RULE_WF_PHASE_BLUEPRINT:
**Constraint:** Goal is creating a detailed, unambiguous step-by-step plan. NO code implementation.

RULE_WF_PHASE_CONSTRUCT:
**Constraint:** Goal is executing the `## Plan` exactly. NO deviation. If issues arise, trigger error handling or revert phase.

RULE_WF_PHASE_VALIDATE:
**Constraint:** Goal is verifying implementation against `## Plan` and requirements using tools. NO new implementation.

RULE_WF_TRANSITION_01:
**Trigger:** Explicit user command (`@analyze`, `@blueprint`, `@construct`, `@validate`).
**Action:** Update `State.Phase` accordingly. Log phase change.

RULE_WF_TRANSITION_02:
**Trigger:** AI determines current phase constraint prevents fulfilling user request OR error handling dictates phase change (e.g., RULE_ERR_HANDLE_TEST_01).
**Action:** Log the reason. Update `State.Phase` (e.g., to `BLUEPRINT_REVISE`). Set `State.Status` appropriately (e.g., `NEEDS_PLAN_APPROVAL`). Report to user.

RULE_ITERATE_01: # Triggered by RULE_MEM_READ_STM_01 when State.Status == READY and State.CurrentItem == null, or after VALIDATE phase completion.
**Trigger:** `State.Status == READY` and `State.CurrentItem == null` OR after `VALIDATE` phase completion.
**Action:** 1. Check `## Items` section for more items. 2. If more items: 3. Set `State.CurrentItem` to the next item. 4. Clear `## Log`. 5. Set `State.Phase = ANALYZE`, `State.Status = READY`. 6. Log "Starting processing item [State.CurrentItem]". 7. If no more items: 8. Trigger `RULE_ITERATE_02`.

RULE_ITERATE_02:
**Trigger:** `RULE_ITERATE_01` determines no more items.
**Action:** 1. Set `State.Status = COMPLETED_ITERATION`. 2. Log "Tokenization iteration completed."

**# --- Initialization & Resumption Rules ---**

RULE_INIT_01:
**Trigger:** AI session/task starts AND `workflow_state.md` is missing or empty.
**Action:** 1. Create `workflow_state.md` with default structure. 2. Read `project_config.md` (prompt user if missing). 3. Set `State.Phase = ANALYZE`, `State.Status = READY`. 4. Log "Initialized new session." 5. Prompt user for the first task.

RULE*INIT_02:
**Trigger:** AI session/task starts AND `workflow_state.md` exists.
**Action:** 1. Read `project_config.md`. 2. Read existing `workflow_state.md`. 3. Log "Resumed session." 4. Check `State.Status`: Handle READY, COMPLETED, BLOCKED*\_, NEEDS\_\_, IN_PROGRESS appropriately (prompt user or report status).

RULE_INIT_03:
**Trigger:** User confirms continuation via RULE_INIT_02 (for IN_PROGRESS state).
**Action:** Proceed with the next action based on loaded state and rules.

**# --- Memory Management Rules ---**

RULE*MEM_READ_LTM_01:
**Trigger:** Start of a new major task or phase.
**Action:** Read `project_config.md`. Log action.
RULE_MEM_READ_STM_01:
**Trigger:** Before \_every* decision/action cycle.
**Action:** 1. Read `workflow_state.md`. 2. If `State.Status == READY` and `State.CurrentItem == null`: 3. Log "Attempting to trigger RULE_ITERATE_01". 4. Trigger `RULE_ITERATE_01`.

RULE*MEM_UPDATE_STM_01:
**Trigger:** After \_every* significant action or information receipt.
**Action:** Immediately update relevant sections (`## State`, `## Plan`, `## Log`) in `workflow_state.md` and save.

RULE_MEM_UPDATE_LTM_01:
**Trigger:** User command (`@config/update`) OR end of successful VALIDATE phase for significant change.
**Action:** Propose concise updates to `project_config.md` based on `## Log`/diffs. Set `State.Status = NEEDS_LTM_APPROVAL`. Await user confirmation.

RULE_MEM_VALIDATE_01:
**Trigger:** After updating `workflow_state.md` or `project_config.md`.
**Action:** Perform internal consistency check. If issues found, log and set `State.Status = NEEDS_CLARIFICATION`.

**# --- Tool Integration Rules (Cursor Environment) ---**

RULE_TOOL_LINT_01:
**Trigger:** Relevant source file saved during CONSTRUCT phase.
**Action:** Instruct Cursor terminal to run lint command. Log attempt. On completion, parse output, log result, set `State.Status = BLOCKED_LINT` if errors.

RULE_TOOL_FORMAT_01:
**Trigger:** Relevant source file saved during CONSTRUCT phase.
**Action:** Instruct Cursor to apply formatter or run format command via terminal. Log attempt.

RULE_TOOL_TEST_RUN_01:
**Trigger:** Command `@validate` or entering VALIDATE phase.
**Action:** Instruct Cursor terminal to run test suite. Log attempt. On completion, parse output, log result, set `State.Status = BLOCKED_TEST` if failures, `TESTS_PASSED` if success.

RULE_TOOL_APPLY_CODE_01:
**Trigger:** AI determines code change needed per `## Plan` during CONSTRUCT phase.

RULE\*PROCESS_ITEM_01:
**Trigger:** `State.Phase == CONSTRUCT` and `State.CurrentItem` is not null and current step in `## Plan` requires item processing.
**Action:** 1. **Get Item Text:** Based on `State.CurrentItem`, extract the corresponding 'Text to Tokenize' from the `## Items` section. 2. **Summarize (Placeholder):** Use a placeholder to generate a summary of the extracted text. For example, "Summary of [text] is [placeholder summary]". 3. **Estimate Token Count:**
a. Read `Characters Per Token (Estimate)` from `project_config.md`.
b. Get the text content of the item from the `## Items` section. (Placeholder: Implement logic to extract text based on `State.CurrentItem` from the `## Items` table.)
c. Calculate `estimated_tokens = length(text_content) / 4`. 4. **Summarize (Placeholder):** Use a placeholder to generate a summary of the extracted text. For example, "Summary of [text] is [placeholder summary]". (Placeholder: Replace with actual summarization tool/logic) 5. **Store Results:** Append a new row to the `## TokenizationResults` table with:

- `Item ID`: `State.CurrentItem`
  \_ `Summary`: The generated summary. (Placeholder: Implement logic to store the summary.) \* `Token Count`: `estimated_tokens`. 6. Log the processing actions, results, and estimated token count to the `## Log`. (Placeholder: Implement logging.) 5. Log the processing actions, results, and estimated token count to the `## Log`.

**Action:** Generate modification. Instruct Cursor to apply it. Log action.

**# --- Error Handling & Recovery Rules ---**

RULE_ERR_HANDLE_LINT_01:
**Trigger:** `State.Status` is `BLOCKED_LINT`.
**Action:** Analyze error in `## Log`. Attempt auto-fix if simple/confident. Apply fix via RULE_TOOL_APPLY_CODE_01. Re-run lint via RULE_TOOL_LINT_01. If success, reset `State.Status`. If fail/complex, set `State.Status = BLOCKED_LINT_UNRESOLVED`, report to user.

RULE_ERR_HANDLE_TEST_01:
**Trigger:** `State.Status` is `BLOCKED_TEST`.
**Action:** Analyze failure in `## Log`. Attempt auto-fix if simple/localized/confident. Apply fix via RULE_TOOL_APPLY_CODE_01. Re-run failed test(s) or suite via RULE_TOOL_TEST_RUN_01. If success, reset `State.Status`. If fail/complex, set `State.Phase = BLUEPRINT_REVISE`, `State.Status = NEEDS_PLAN_APPROVAL`, propose revised `## Plan` based on failure analysis, report to user.

RULE_ERR_HANDLE_GENERAL_01:
**Trigger:** Unexpected error or ambiguity.
**Action:** Log error/situation to `## Log`. Set `State.Status = BLOCKED_UNKNOWN`. Report to user, request instructions.

---

## Log

_A chronological log of significant actions, events, tool outputs, and decisions._
_(This section will be populated by the AI during operation)_

- `[2023-07-15 10:00:00] 프로젝트 분석 시작.`
- `[2023-07-15 10:05:00] 프로젝트 디렉토리 구조 확인.`
- `[2023-07-15 10:10:00] 기술 스택 확인: React 17, Vite, Zustand, React Query, TailwindCSS.`
- `[2023-07-15 10:15:00] 주요 기능 파악: 인증 시스템, 지시 관리, 작업 관리, 인사 관리, 결제 관리.`
- `[2023-07-15 10:20:00] 컴포넌트 구조 분석: Atomic Design 패턴 사용.`
- `[2023-07-15 10:25:00] project_config.md 파일 업데이트 완료.`
- `[2023-07-15 10:30:00] 워크플로우 상태 업데이트: ANALYZE/READY.`
- `[2023-07-15 11:00:00] 사용자 스토리 분석 시작.`
- `[2023-07-15 11:15:00] 사용자 스토리에서 주요 기능 요구사항 확인: 로그인, 프로필, 지시, 작업, 인사, 기성 관리.`
- `[2023-07-15 11:30:00] 구현 계획 수립 완료.`
- `[2023-07-15 11:35:00] 워크플로우 상태 업데이트: BLUEPRINT/NEEDS_PLAN_APPROVAL.`
- `[2023-07-15 12:00:00] 사이드바 업데이트 시작: CONSTRUCT/IN_PROGRESS.`
- `[2023-07-15 12:10:00] 사이드바 컴포넌트에 '인사 관리'와 '기성 관리' 메뉴 추가 완료.`
- `[2023-07-15 12:20:00] App.jsx에 관련 라우트 추가 완료.`
- `[2023-07-15 12:45:00] 인사 관리 페이지 컴포넌트 개발 완료 (PersonnelList, PersonnelCreate, PersonnelDetail, PersonnelEdit).`
- `[2023-07-15 13:15:00] 기성 관리 페이지 컴포넌트 개발 완료 (PaymentByType).`
- `[2023-07-15 13:20:00] 작업 완료: 사이드바 업데이트.`
- `[2023-07-18 09:00:00] 상태 관리 구현 계획 시작.`
- `[2023-07-18 09:15:00] 프로젝트 상태 관리 전략 설계: Zustand(UI 상태), TanStack Query(서버 상태).`
- `[2023-07-18 09:30:00] src/lib/zustand/ 디렉토리 구조 생성.`
- `[2023-07-18 10:00:00] src/lib/api/ 디렉토리 구조 생성.`
- `[2023-07-18 10:30:00] API 호출 모듈(personnelAPI.js) 개발.`
- `[2023-07-18 11:00:00] React Query 커스텀 훅(personnelQueries.js) 개발.`
- `[2023-07-18 11:30:00] Zustand와 React Query 통합 구조 확립.`
- `[2023-07-18 12:00:00] PersonnelList.jsx를 React Query로 리팩토링.`
- `[2023-07-18 12:30:00] PersonnelDetail.jsx를 React Query로 리팩토링.`
- `[2023-07-18 13:00:00] PersonnelEdit.jsx를 React Query로 리팩토링.`
- `[2023-07-18 13:30:00] PersonnelCreate.jsx를 React Query로 리팩토링.`
- `[2023-07-18 14:00:00] 모든 인사 관리 컴포넌트의 React Query 연동 완료.`
- `[2023-07-18 14:30:00] 불필요한 store/index.js 파일 삭제.`
- `[2023-07-19 09:00:00] 인사 관리 시스템 작업 검증: Step 5.4 완료.`
- `[2023-07-20 09:00:00] UI 개선 요구사항 수신: shadcn 컴포넌트 및 sweetalert2 모달 적용 필요.`
- `[2023-07-20 09:15:00] 워크플로우 계획 수정: UI 컴포넌트 개선 단계 추가 및 후속 단계 번호 조정.`
- `[2023-07-20 09:30:00] 워크플로우 상태 업데이트: BLUEPRINT_REVISE/NEEDS_PLAN_APPROVAL.`
- `[2023-07-20 10:00:00] 계획 승인 후 UI 컴포넌트 개선 작업 시작: CONSTRUCT/IN_PROGRESS.`
- `[2023-07-20 10:15:00] 기존 UI 컴포넌트 분석: Input, Button, Card, FormGroup 등 기본 컴포넌트 확인.`
- `[2023-07-20 10:30:00] shadcn/ui 및 필요 패키지 설치 (clsx, tailwind-merge, lucide-react 등).`
- `[2023-07-20 10:45:00] React 17 호환성 문제 해결: createRoot 대신 render 메서드 사용.`
- `[2023-07-20 11:00:00] 경로 별칭(@) 지원을 위한 path-browserify 구성.`
- `[2023-07-20 11:15:00] shadcn 기본 컴포넌트 구현: Button, Input, Card, Label, Checkbox.`
- `[2023-07-20 11:30:00] 로그인 페이지 UI 개선: shadcn 컴포넌트로 교체 및 스타일 적용.`
- `[2023-07-20 12:00:00] npm 스크립트 점검: npm start 대신 npm run dev 사용.`
- `[2023-07-20 12:15:00] 작업 완료: 로그인 페이지 UI 개선, 폼 컴포넌트 교체 및 sweetalert2 설치.`
- `[2025-04-13 17:45:00] 사이드바 컴포넌트 shadcn/ui로 개선 작업 시작.`
- `[2025-04-13 17:48:00] Sheet 컴포넌트를 위한 @radix-ui/react-dialog 설치.`
- `[2025-04-13 17:50:00] Sheet 컴포넌트 개발 및 Sidebar 컴포넌트에 적용.`
- `[2025-04-13 17:52:00] 반응형 레이아웃 지원을 위한 Layout 컴포넌트 수정.`
- `[2025-04-13 17:53:00] 반응형 레이아웃 지원을 위한 Header 컴포넌트 수정.`
- `[2025-04-13 17:55:00] 애니메이션 효과를 위한 tailwind.config.js 업데이트.`
- `[2025-04-13 17:56:00] 사이드바 개선 작업 완료 (Step 3.8).`
- `[2025-04-13 18:00:00] 사이드바 모바일 대응 제거 및 위치 고정 시작.`
- `[2025-04-13 18:05:00] 불필요한 모바일 반응형 코드 제거.`
- `[2025-04-13 18:10:00] 사이드바 고정 위치 설정으로 레이아웃 조정.`
- `[2025-04-13 18:15:00] 불필요한 Sheet 컴포넌트 및 애니메이션 설정 제거.`
- `[2025-04-13 18:20:00] 사이드바 UI 개선 완료 - 모바일 대응 제거 및 위치 고정.`
- `[2025-04-13 19:00:00] 사이드바 active 상태 버그 발견: 대시보드 메뉴가 항상 활성화되는 문제.`
- `[2025-04-13 19:05:00] NavLink의 'end' 속성 추가 및 경로 일치 로직 개선.`
- `[2025-04-13 19:10:00] 사이드바 컴포넌트의 스타일 일관성 및 버튼 정렬 조정.`
- `[2025-04-13 19:15:00] 사이드바 UI 버그 수정 및 스타일 개선 완료.`
- `[2025-04-13 20:00:00] 아톰 컴포넌트 현황 분석: 기존 컴포넌트와 shadcn 컴포넌트 공존 필요성 파악.`
- `[2025-04-13 20:10:00] 기존 아톰 컴포넌트(Button, Input, Card, Select, TextArea)를 Legacy 버전으로 이름 변경.`
- `[2025-04-13 20:15:00] 컴포넌트 네이밍 충돌 방지를 위한 인덱스 파일 생성.`
- `[2025-04-13 20:20:00] 점진적인 마이그레이션을 위한 컴포넌트 구조 개선 완료.`
- `[2025-04-13 20:30:00] 잘못된 마이그레이션 접근 발견: Legacy 이름 변경 방식으로 인한 임포트 오류 발생.`
- `[2025-04-13 20:35:00] 마이그레이션 전략 수정: 기존 컴포넌트 파일 유지 및 개별 수정 방식으로 변경.`
- `[2025-04-13 20:40:00] 원본 아톰 컴포넌트 파일 복구 완료.`
- `[2025-04-13 20:45:00] Legacy 컴포넌트 파일 및 인덱스 파일 삭제.`
- `[2025-04-13 21:00:00] 새로운 UI 마이그레이션 전략 수립: molecules 폴더에 Form* 접두사를 가진 컴포넌트 생성.`
- `[2025-04-13 21:10:00] FormInput 컴포넌트 개발: shadcn/ui Input + Label 통합.`
- `[2025-04-13 21:15:00] FormButton 컴포넌트 개발: shadcn/ui Button + variants 매핑.`
- `[2025-04-13 21:20:00] FormCard 컴포넌트 개발: shadcn/ui Card 구성요소 통합.`
- `[2025-04-13 21:25:00] FormSelect 컴포넌트 개발: shadcn/ui 스타일 적용.`
- `[2025-04-13 21:30:00] FormTextArea 컴포넌트 개발: shadcn/ui 스타일 적용.`
- `[2025-04-13 21:35:00] molecules/index.js 생성: 모든 Form 컴포넌트 내보내기.`
- `[2025-04-13 21:40:00] UI 컴포넌트 마이그레이션 첫 단계 완료.`
- `[2025-04-13 21:50:00] 테스트 페이지 선정: PersonnelCreate.jsx에 Form 컴포넌트 적용.`
- `[2025-04-13 21:55:00] atoms 임포트를 molecules/Form* 컴포넌트로 교체.`
- `[2025-04-13 22:00:00] createWorker 뮤테이션 구문 최신화 및 상태 변수명 조정.`
- `[2025-04-13 22:05:00] 테스트 완료: Form 컴포넌트 점진적 마이그레이션 확인.`
- `[2025-04-13 23:00:00] WorkImport.jsx 파일 수정 시작: DataTable 컴포넌트를 활용한 UI 개선.`
- `[2025-04-13 23:05:00] useCreateWorks 함수 대신 useCreateWork로 대체하기 위한 API 검토.`
- `[2025-04-13 23:10:00] workQueries.js에 useCreateWorks 함수가 없는 것 확인, 대신 직접 createWork API 사용 결정.`
- `[2025-04-13 23:15:00] Papa 라이브러리 추가를 통한 CSV 처리 기능 구현 시도.`
- `[2025-04-13 23:20:00] CSV와 Excel 파일 모두 처리하도록 코드 수정.`
- `[2025-04-13 23:25:00] 사용자 요구사항 반영: Excel 파일만 지원하도록 코드 수정.`
- `[2025-04-13 23:30:00] Papa 라이브러리 및 CSV 관련 코드 제거.`
- `[2025-04-13 23:35:00] XLSX 라이브러리만을 사용한 Excel 전용 파일 처리 로직 구현.`
- `[2025-04-13 23:40:00] 파일 처리 로직 개선: createWork API를 사용한 병렬 처리 방식으로 변경.`
- `[2025-04-13 23:45:00] 진행 상황 표시 기능 추가: 프로그레스 바 및 카운터 구현.`
- `[2025-04-13 23:50:00] 파일 형식 안내 섹션 제작: 필수 필드와 선택 필드 표시.`
- `[2025-04-13 23:55:00] UI 개선 작업 완료: FormCard, FormButton, FormInput 적용.`

---

## Items

_This section will contain the list of items to be processed._
_(The format of items is a table)_

_Example (Table):_

- `| Item ID | Text to Tokenize |`
- `|---|---|`
- `| item1 | This is the first item to tokenize. This is a short sentence. |`
- `| item2 | Here is the second item for tokenization. This is a slightly longer sentence to test the summarization. |`
- `| item3 | This is item number three to be processed. This is a longer sentence to test the summarization. This is a longer sentence to test the summarization. |`
- `| item4 | And this is the fourth and final item in the list. This is a very long sentence to test the summarization. This is a very long sentence to test the summarization. This is a very long sentence to test the summarization. This is a very long sentence to test the summarization. |`

---

## TokenizationResults

_This section will store the summarization results for each item._
_(Results will include the summary and estimated token count)_

_Example (Table):_

- `| Item ID | Summary | Token Count |`
- `|---|---|---|`

## TokenizationResults

_This section will store the tokenization results for each item._
_(Results will include token counts and potentially tokenized text)_

_Example (Table):_

- `| Item ID | Token Count | Tokenized Text (Optional) |`
- `|---|---|---|`
- `| item1 | 10 | ... (tokenized text) ... |`
- `| item2 | 12 | ... (tokenized text) ... |`
