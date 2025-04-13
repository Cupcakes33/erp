# Workflow State & Rules (STM + Rules + Log)

_This file contains the dynamic state, embedded rules, active plan, and log for the current session._
_It is read and updated frequently by the AI during its operational loop._

---

## State

_Holds the current status of the workflow._

```yaml
Phase: VALIDATE # Current workflow phase (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: COMPLETED # Current status (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: TableDataFixAll # Identifier for the main task being worked on
CurrentStep: 1 # Identifier for the specific step in the plan being executed
CurrentItem: null # Identifier for the item currently being processed in iteration
```

---

## Plan

_Contains the step-by-step implementation plan generated during the BLUEPRINT phase._

**Task: TableDataFixAll**

- `[x] Step 1: DataTable 컴포넌트 문제 해결 (InstructionList, PersonnelList)`
  - `[x] 1.1: InstructionList 데이터 테이블 분석 및 수정`
  - `[x] 1.2: PersonnelList 데이터 테이블 분석 및 수정`
  - `[x] 1.3: DataTable 컴포넌트 호환성 코드 개선`
  - `[x] 1.4: 테스트 및 결과 확인`

**Task: InstructionTableDataFix**

- `[x] Step 1: InstructionList 페이지 데이터 테이블 문제 분석 및 해결`
  - `[x] 1.1: 현재 데이터 흐름 분석 - API 호출부터 테이블 렌더링까지`
  - `[x] 1.2: 문제의 원인 파악 - 데이터 형식 또는 컬럼 구성 불일치 확인`
  - `[x] 1.3: DataTable.jsx 컴포넌트와 data-table.jsx 원본 컴포넌트 상호작용 분석`
  - `[x] 1.4: 컬럼 정의와 데이터 구조 일치 여부 확인`
  - `[x] 1.5: 문제 해결 적용 및 테스트`

**Task: DataTableFix**

- `[x] Step 1: 데이터 테이블 mock 데이터 렌더링 문제 해결`

  - `[x] 1.1: src/lib/api/workAPI.js 파일의 mockWorks 데이터 구조 확인`
  - `[x] 1.2: WorkList.jsx에서 사용하는 columns와 mockWorks의 데이터 구조 비교 분석`
  - `[x] 1.3: WorkList.jsx의 columns 정의를 mockWorks 데이터 구조에 맞게 수정`
  - `[x] 1.4: 데이터 테이블에 데이터가 올바르게 렌더링되는지 확인`

- `[x] Step 2: 테이블 hover 효과 개선`

  - `[x] 2.1: 현재 hover 효과 스타일 확인`
  - `[x] 2.2: hover 시 글자가 가려지지 않도록 스타일 수정`
  - `[x] 2.3: 직관적인 hover 효과 구현 (배경색 변경, 경계선 추가 등)`

- `[ ] Step 3: 사이드바 업데이트`

  - `[x] 3.1: 사이드바 컴포넌트에 '인사 관리'와 '기성 관리' 메뉴 추가`
  - `[x] 3.2: App.jsx에 관련 라우트 추가`
  - `[x] 3.3: 인사 관리 페이지 컴포넌트 개발 (목록, 추가, 상세, 수정)`
  - `[x] 3.4: 기성 관리 페이지 컴포넌트 개발 (공종별 조회 페이지)`

- `[ ] Step 4: 인증 시스템 구현`

  - `[ ] 4.1: 로그인 컴포넌트 개발 (아이디/비밀번호 입력 폼, 검증 로직)`
  - `[ ] 4.2: 사용자 유형별 계정 설정 (관리자 1개, 담당자 2개, 일반 2개)`
  - `[ ] 4.3: 비밀번호 초기화 기능 구현 (이메일 발송 시스템 연동)`
  - `[ ] 4.4: 계정 관리 페이지 개발 (프로필 정보 수정, 비밀번호 변경)`
  - `[ ] 4.5: 비밀번호 유효성 검증 로직 구현 (영어+숫자 5-12자리)`

- `[ ] Step 5: UI 컴포넌트 개선`

  - `[x] 5.1: 현재 사용 중인 UI 컴포넌트 분석 및 목록화`
  - `[x] 5.2: shadcn 컴포넌트 라이브러리 설치 및 구성`
  - `[x] 5.3: 테이블 컴포넌트를 shadcn 데이터 테이블로 교체`
    - `[x] 5.3.1: 테이블 컴포넌트 사용 현황 분석`
    - `[x] 5.3.2: TableAdapter 컴포넌트 생성 (기존 Table props를 DataTable props로 변환)`
    - `[x] 5.3.3: InstructionDetail.jsx 파일에서 Table을 DataTable로 교체`
    - `[x] 5.3.4: WorkDetail.jsx 파일에서 Table 임포트 제거 및 DataTable 사용 통일`
    - `[x] 5.3.5: 모든 테이블 컴포넌트 호출 코드 일관성 검증`
  - `[x] 5.4: 폼 요소(버튼, 입력필드, 체크박스 등)를 shadcn 컴포넌트로 교체`
  - `[x] 5.5: sweetalert2 라이브러리 설치 및 구성`
  - `[ ] 5.6: 기존 모달 다이얼로그를 sweetalert2로 교체`
  - `[ ] 5.7: 컴포넌트 교체 후 스타일 및 기능 테스트`
  - `[x] 5.8: 사이드바 컴포넌트를 shadcn/ui 컴포넌트로 교체 및 반응형 지원 추가`
  - `[ ] 5.9: 대시보드 레이아웃 및 카드 디자인 개선`
    - `[x] 5.9.1: FormCard 컴포넌트의 스타일 일관성 개선`
    - `[x] 5.9.2: 그리드 및 카드 간격 조정`
    - `[x] 5.9.3: 색상 테마 적용 일관성 개선`
    - `[x] 5.9.4: 반응형 레이아웃 최적화`
    - `[x] 5.9.5: UI 요소의 시각적 일관성 검증`

- `[ ] Step 6: 지시 관리 시스템 구현`

  - `[ ] 6.1: 엑셀 파일 업로드 및 파싱 기능 개발`
  - `[ ] 6.2: 개별 지시 생성 폼 개발 (최소 제목만으로 생성 가능)`
  - `[ ] 6.3: 지시 상태 관리 시스템 구현 (5단계: 접수, 작업중, 작업완료, 결재중, 완료)`
  - `[ ] 6.4: 지시 상세 정보 필드 추가 (작업자, 작업현황, 비고, 기성회차, 즐겨찾기 등)`
  - `[ ] 6.5: 발주 정보 관리 기능 구현 (지시 담당자, 접수채널, 접수일 등)`
  - `[ ] 6.6: 작업 등록 및 연결 기능 개발 (검색 후 선택, 수량/산출내역 입력, 실시간 금액 계산)`
  - `[ ] 6.7: 지시 수정 기능 구현 (기성 반영 전 지시만 수정 가능하도록 제한)`
  - `[ ] 6.8: 검색 및 필터링 기능 개발 (번지/동 검색, 날짜/상태 필터링)`
  - `[ ] 6.9: 목록 표시 필드 사용자화 (필요 필드 표시 설정)`
  - `[ ] 6.10: 다양한 형식의 조회/출력 기능 구현 (보수확인서, 물량산출 근거, 내역서)`
  - `[ ] 6.11: 일괄 출력 기능 개발 (여러 지시 동시 출력)`
  - `[ ] 6.12: 수정 이력 추적 기능 구현 (마지막 수정자 표시)`

- `[x] Step 7: 상태 관리 모듈화`

  - `[x] 7.1: Zustand 스토어 파일 구조 설계 (/lib/zustand/)`
  - `[x] 7.2: UI 상태용 Zustand 스토어 구현 (auth 등 로컬 상태)`
  - `[x] 7.3: TanStack Query 구조 설계 및 API 호출 모듈 구현 (/lib/api/)`

- `[x] Step 8: 인사 관리 시스템 구현`

  - `[x] 8.1: 작업자 API 모듈 개발 (personnelAPI.js)`
  - `[x] 8.2: 작업자 Query 훅 개발 (personnelQueries.js)`
  - `[x] 8.3: 작업자 데이터 모델 설계 (ID, 이름, 생년월일, 연락처, 직급, 상태)`
  - `[x] 8.4: 작업자 목록/상세/수정 컴포넌트 React Query 연동`

- `[x] Step 9: API 통합 Layer 구현`

  - `[x] 9.1: API 호출 모듈 구조화 (mockedAPI 포함)`
  - `[x] 9.2: React Query Custom Hooks 구현`
  - `[x] 9.3: API 호출 모듈과 React Query 통합`

- `[ ] Step 10: 기성 관리 시스템 구현`

  - `[ ] 10.1: 공종별 공사 대금 조회 기능 개발 (관리자 권한)`
  - `[ ] 10.2: 주소별 공사 대금 조회 기능 개발 (관리자 권한)`
  - `[ ] 10.3: 기성별 공사 대금 조회 기능 개발 (관리자 권한)`

- `[ ] Step 11: 통합 및 테스트`
  - `[ ] 11.1: 모든 기능 통합`
  - `[ ] 11.2: 사용자 권한별 테스트 (관리자, 담당자, 일반 사용자)`
  - `[ ] 11.3: 성능 테스트 및 최적화`
  - `[ ] 11.4: 오류 수정 및 사용성 개선`

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
- `[2023-07-18 09:00:00] InstructionList 페이지에서 데이터를 받아오고 있지만 테이블에 데이터가 표시되지 않는 문제 분석 시작.`
- `[2023-07-18 09:05:00] InstructionList.jsx, instructionAPI.js, instructionQueries.js, DataTable.jsx, data-table.jsx 파일 분석.`
- `[2023-07-18 09:10:00] 문제 원인 파악 중: 데이터는 정상적으로 받아와지고 있으나 테이블에 렌더링되지 않음.`
- `[2023-07-18 09:15:00] 문제 원인 확인: TanStack Table은 accessorKey, header, cell 구조를 기대하나 InstructionList.jsx는 accessor, header, cell을 사용하고 있었음.`
- `[2023-07-18 09:20:00] 수정 방법 두 가지 계획: 1) InstructionList.jsx의 컬럼 정의 수정 2) DataTable 래퍼에 호환성 코드 추가`
- `[2023-07-18 09:25:00] InstructionList.jsx의 컬럼 정의를 TanStack Table 형식에 맞게 수정: accessor → accessorKey, cell 함수 형식 변경.`
- `[2023-07-18 09:30:00] DataTable.jsx 컴포넌트에 호환성 코드 추가: 기존 accessor 형식을 accessorKey 형식으로 자동 변환하는 로직 구현.`
- `[2023-07-18 09:35:00] 디버깅 코드 추가: DataTable.jsx, data-table.jsx, InstructionList.jsx에 콘솔 로그 추가하여 데이터 흐름 추적.`
- `[2023-07-18 09:40:00] 문제 해결 완료: InstructionList 페이지에서 지시 데이터가 테이블에 정상적으로 표시됨.`
- `[2023-07-18 09:45:00] 향후 개선 사항 식별: 모든 테이블 사용 컴포넌트에 동일한 컬럼 형식을 적용하는 것이 좋으나, 현재는 DataTable 래퍼의 호환성 코드로 해결 가능.`
- `[2023-07-18 09:50:00] 작업 완료: InstructionList 페이지 데이터 테이블 문제 해결.`
- `[2023-07-18 10:00:00] 인사 관리(Personnel) 페이지도 동일한 데이터 테이블 이슈 확인 및 분석 시작`
- `[2023-07-18 10:05:00] PersonnelList.jsx, personnelAPI.js, personnelQueries.js 파일 분석`
- `[2023-07-18 10:10:00] PersonnelList.jsx의 컬럼 구조도 TanStack Table 형식과 불일치함을 확인`
- `[2023-07-18 10:15:00] PersonnelList.jsx 컬럼 정의를 수정: accessor → accessorKey, cell 함수 형식 변경`
- `[2023-07-18 10:20:00] actions 컬럼의 렌더링 부분에서 row.original 접근 방식으로 변경`
- `[2023-07-18 10:25:00] 디버깅 로그 추가하여 데이터 흐름 확인`
- `[2023-07-18 10:30:00] 수정 완료: 두 페이지(InstructionList, PersonnelList) 모두 TanStack Table에 맞는 컬럼 형식으로 변경됨`
- `[2023-07-18 10:35:00] DataTable 래퍼 컴포넌트의 호환성 코드 개선 효과 확인 - 기존 코드와 호환성 유지하면서 TanStack Table 요구사항 충족`
- `[2023-07-18 10:40:00] 작업 완료: 모든 데이터 테이블 문제 해결 완료 - 기존 데이터 형식과 TanStack Table 간의 차이 해결`

---

## Items

_This section will contain the list of items to be processed._
_(The format of items is a table)_

_Example (Table):_

- `| Item ID | Text to Tokenize |`
- `|---|---|`
- `| item1 | This is the first item to tokenize. This is a short sentence. |`
- `| item2 | Here is the second item for tokenization. This is a slightly longer sentence to test the summarization. |`
- `
