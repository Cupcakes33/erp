# Workflow State & Rules (STM + Rules + Log)

_This file contains the dynamic state, embedded rules, active plan, and log for the current session._
_It is read and updated frequently by the AI during its operational loop._

---

## State

_Holds the current status of the workflow._

```yaml
Phase: BLUEPRINT # Current workflow phase (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: NEEDS_PLAN_APPROVAL # Current status (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: ERPImplementation # Identifier for the main task being worked on
CurrentStep: null # Identifier for the specific step in the plan being executed
CurrentItem: null # Identifier for the item currently being processed in iteration
```

---

## Plan

_Contains the step-by-step implementation plan generated during the BLUEPRINT phase._

**Task: ERPImplementation**

- `[ ] Step 1: 인증 시스템 구현`

  - `[ ] 1.1: 로그인 컴포넌트 개발 (아이디/비밀번호 입력 폼, 검증 로직)`
  - `[ ] 1.2: 사용자 유형별 계정 설정 (관리자 1개, 담당자 2개, 일반 2개)`
  - `[ ] 1.3: 비밀번호 초기화 기능 구현 (이메일 발송 시스템 연동)`
  - `[ ] 1.4: 계정 관리 페이지 개발 (프로필 정보 수정, 비밀번호 변경)`
  - `[ ] 1.5: 비밀번호 유효성 검증 로직 구현 (영어+숫자 5-12자리)`

- `[ ] Step 2: 지시 관리 시스템 구현`

  - `[ ] 2.1: 엑셀 파일 업로드 및 파싱 기능 개발`
  - `[ ] 2.2: 개별 지시 생성 폼 개발 (최소 제목만으로 생성 가능)`
  - `[ ] 2.3: 지시 상태 관리 시스템 구현 (5단계: 접수, 작업중, 작업완료, 결재중, 완료)`
  - `[ ] 2.4: 지시 상세 정보 필드 추가 (작업자, 작업현황, 비고, 기성회차, 즐겨찾기 등)`
  - `[ ] 2.5: 발주 정보 관리 기능 구현 (지시 담당자, 접수채널, 접수일 등)`
  - `[ ] 2.6: 작업 등록 및 연결 기능 개발 (검색 후 선택, 수량/산출내역 입력, 실시간 금액 계산)`
  - `[ ] 2.7: 지시 수정 기능 구현 (기성 반영 전 지시만 수정 가능하도록 제한)`
  - `[ ] 2.8: 검색 및 필터링 기능 개발 (번지/동 검색, 날짜/상태 필터링)`
  - `[ ] 2.9: 목록 표시 필드 사용자화 (필요 필드 표시 설정)`
  - `[ ] 2.10: 다양한 형식의 조회/출력 기능 구현 (보수확인서, 물량산출 근거, 내역서)`
  - `[ ] 2.11: 일괄 출력 기능 개발 (여러 지시 동시 출력)`
  - `[ ] 2.12: 수정 이력 추적 기능 구현 (마지막 수정자 표시)`

- `[ ] Step 3: 작업(일위대가) 관리 시스템 구현`

  - `[ ] 3.1: 작업 조회 및 검색 기능 개발`
  - `[ ] 3.2: 작업 관리 기능 구현 (추가, 수정 - 담당자 권한)`
  - `[ ] 3.3: 작업 데이터 모델 설계 (ID, 호표, 공종명, 규격, 단위, 재료비, 노무비, 경비, 합계)`

- `[ ] Step 4: 인사 관리 시스템 구현`

  - `[ ] 4.1: 작업자 관리 기능 개발 (추가, 변경 - 담당자 권한)`
  - `[ ] 4.2: 작업자 데이터 모델 설계 (ID, 이름, 생년월일, 연락처, 직급, 상태)`
  - `[ ] 4.3: 작업자 조회 및 필터링 기능 구현 (재직 상태 기준)`

- `[ ] Step 5: 기성 관리 시스템 구현`

  - `[ ] 5.1: 공종별 공사 대금 조회 기능 개발 (관리자 권한)`
  - `[ ] 5.2: 주소별 공사 대금 조회 기능 개발 (관리자 권한)`
  - `[ ] 5.3: 기성별 공사 대금 조회 기능 개발 (관리자 권한)`

- `[ ] Step 6: 통합 및 테스트`
  - `[ ] 6.1: 모든 기능 통합`
  - `[ ] 6.2: 사용자 권한별 테스트 (관리자, 담당자, 일반 사용자)`
  - `[ ] 6.3: 성능 테스트 및 최적화`
  - `[ ] 6.4: 오류 수정 및 사용성 개선`

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
- `[2023-07-15 10:10:00] 기술 스택 확인: React 17, Vite, Zustand, Redux, React Query, TailwindCSS.`
- `[2023-07-15 10:15:00] 주요 기능 파악: 인증 시스템, 지시 관리, 작업 관리, 인사 관리, 결제 관리.`
- `[2023-07-15 10:20:00] 컴포넌트 구조 분석: Atomic Design 패턴 사용.`
- `[2023-07-15 10:25:00] project_config.md 파일 업데이트 완료.`
- `[2023-07-15 10:30:00] 워크플로우 상태 업데이트: ANALYZE/READY.`
- `[2023-07-15 11:00:00] 사용자 스토리 분석 시작.`
- `[2023-07-15 11:15:00] 사용자 스토리에서 주요 기능 요구사항 확인: 로그인, 프로필, 지시, 작업, 인사, 기성 관리.`
- `[2023-07-15 11:30:00] 구현 계획 수립 완료.`
- `[2023-07-15 11:35:00] 워크플로우 상태 업데이트: BLUEPRINT/NEEDS_PLAN_APPROVAL.`

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
