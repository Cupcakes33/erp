# Workflow State & Rules (STM + Rules + Log)

_This file contains the dynamic state, embedded rules, active plan, and log for the current session._
_It is read and updated frequently by the AI during its operational loop._

---

## State

_Holds the current status of the workflow._

```yaml
Phase: CONSTRUCT # Current workflow phase (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: IN_PROGRESS # Current status (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED, COMPLETED_ITERATION)
CurrentTaskID: InstructionManagement # Identifier for the main task being worked on
CurrentStep: 1 # Identifier for the specific step in the plan being executed
CurrentItem: instruction_management # Identifier for the item currently being processed in iteration
```

---

## Plan

_Contains the step-by-step implementation plan generated during the BLUEPRINT phase._

**Task: InstructionManagement**

- `[ ] Step 1: 지시 관리 시스템 프론트엔드 구현`

  - `[ ] 1.1: 지시 목록 페이지 개선`

    - `[ ] 1.1.1: 검색 및 필터링 기능 구현 (번지/동 검색, 날짜 필터링, 상태 필터링)`
    - `[ ] 1.1.2: 필요한 필드만 표시하는 커스텀 컬럼 설정 기능 구현 (id, 날짜, 담당자, 동, 지번, 세부사항, 작업내용, 비고, 진행상태)`
    - `[ ] 1.1.3: 지시 상태 표시 개선 (접수, 작업중, 작업완료, 결재중, 완료)`
    - `[ ] 1.1.4: 최종 수정자 정보 표시 추가`
    - `[ ] 1.1.5: 지시 목록 데이터 테이블 UI 및 상호작용 개선`

  - `[ ] 1.2: 단일 지시 생성 페이지 개선`

    - `[ ] 1.2.1: 최소 요구 필드 조정 (제목만으로도 생성 가능하도록)`
    - `[ ] 1.2.2: 추가 선택적 필드 구성 (담당자, 접수채널, 접수일, 위치 등)`
    - `[ ] 1.2.3: 폼 유효성 검증 개선`
    - `[ ] 1.2.4: UI/UX 개선`

  - `[ ] 1.3: 지시 상세 페이지 개선`

    - `[ ] 1.3.1: 지시 상태 관리 UI 구현 (5단계 상태 표시 및 변경 기능)`
    - `[ ] 1.3.2: 추가 필드 표시 구현 (작업자, 작업현황, 비고, 기성회차, 최종 수정자)`
    - `[ ] 1.3.3: 즐겨찾기 기능 구현`
    - `[ ] 1.3.4: 발주 정보 표시 구현 (담당자, 접수채널, 접수일)`
    - `[ ] 1.3.5: 작업 등록 및 관리 UI 구현`
      - `[ ] 1.3.5.1: 작업 검색 및 선택 기능 구현`
      - `[ ] 1.3.5.2: 수량 및 산출내역 입력 UI 구현`
      - `[ ] 1.3.5.3: 실시간 금액 계산 표시 UI 구현`
    - `[ ] 1.3.6: 기성 반영 전 지시만 수정 가능하도록 제한 로직 구현`

  - `[ ] 1.4: 일괄 지시 생성 페이지 구현 - [나중에 진행 예정 - 필수 작업]`
    - `[ ] 1.4.1: 엑셀 파일 업로드 UI 구현`
    - `[ ] 1.4.2: 데이터 미리보기 UI 구현`
    - `[ ] 1.4.3: 필드 매핑 인터페이스 구현`
    - `[ ] 1.4.4: 데이터 유효성 검증 및 오류 표시`
    - `[ ] 1.4.5: 일괄 저장 기능 구현`
    - `참고: 백엔드 API 명세 완료 후 진행 예정`

- `[ ] Step 2: UI 컴포넌트 개선 및 상호작용 향상`

  - `[ ] 2.1: 지시 상태 관리를 위한 커스텀 컴포넌트 구현`
    - `[ ] 2.1.1: 상태 변경 드롭다운/버튼 컴포넌트 구현`
    - `[ ] 2.1.2: 상태별 시각적 표시(색상, 아이콘) 구현`
    - `[ ] 2.1.3: 상태 변경 확인 모달 구현`
  - `[ ] 2.2: 지시 작업 관리를 위한 컴포넌트 구현`
    - `[ ] 2.2.1: 작업 검색 및 선택 컴포넌트 구현`
    - `[ ] 2.2.2: 작업 항목 표시 및 편집 컴포넌트 구현`
    - `[ ] 2.2.3: 작업 금액 계산 및 표시 컴포넌트 구현`
  - `[ ] 2.3: 필터링 및 검색 컴포넌트 개선`
    - `[ ] 2.3.1: 고급 검색 필터 UI 구현`
    - `[ ] 2.3.2: 날짜 범위 선택 컴포넌트 구현`
    - `[ ] 2.3.3: 상태 필터 컴포넌트 구현`

- `[ ] Step 3: 데이터 상태 관리 및 API 연동 개선`

  - `[ ] 3.1: 지시 관련 상태 관리 개선`
    - `[ ] 3.1.1: Zustand 스토어 개선 (상태 관리, 필터링 상태 등)`
    - `[ ] 3.1.2: React Query 캐싱 전략 최적화`
  - `[ ] 3.2: API 연동 Mock 데이터 개선`
    - `[ ] 3.2.1: 지시 Mock 데이터 구조 확장 (추가 필드 반영)`
    - `[ ] 3.2.2: 지시 상태 변경 Mock 기능 개선`
    - `[ ] 3.2.3: 지시-작업 연결 Mock 기능 구현`

- `[ ] Step 4: 테스트 및 최적화`
  - `[ ] 4.1: 기능 테스트`
  - `[ ] 4.2: UI/UX 개선 및 일관성 확보`
  - `[ ] 4.3: 성능 최적화`
  - `[ ] 4.4: 반응형 디자인 검증`

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

_Records the progressive execution log for the current session._

2023-09-01 10:00: 지시 관리 API 스키마 변경 사항 적용 작업 시작
2023-09-01 10:05: API 스키마 확인 - title → name 필드 변경, memo 필드 추가 필요
2023-09-01 10:10: InstructionEdit.jsx 파일 분석 - 수정 페이지 파악
2023-09-01 10:15: InstructionCreate.jsx 파일 분석 - 추가 페이지 구조 확인
2023-09-01 10:20: InstructionDetail.jsx 파일 분석 - 상세 페이지 구조 확인
2023-09-01 10:25: 수정 페이지를 추가 페이지와 비슷한 스타일로 변경하는 작업 시작
2023-09-01 10:30: InstructionEdit.jsx 파일 수정 - 폼 레이아웃 개선 및 새 UI 적용
2023-09-01 10:35: InstructionEdit.jsx 파일 수정 - title → name 필드 변경
2023-09-01 10:40: InstructionEdit.jsx 파일 수정 - memo 필드 추가
2023-09-01 10:45: InstructionDetail.jsx 파일 수정 - title → name 필드 변경
2023-09-01 10:50: InstructionDetail.jsx 파일 수정 - description → memo 필드 변경
2023-09-01 10:55: InstructionDetail.jsx 파일 수정 - 비고 필드가 항상 표시되도록 조건부 렌더링 수정
2023-09-01 11:00: InstructionDetail.jsx 파일 수정 - 주소 정보 표시 방식 개선 (시/군/구, 동/읍/면, 지번, 상세주소 분리)
2023-09-01 11:05: InstructionCreate.jsx 파일 수정 - title → name 필드 변경
2023-09-01 11:10: InstructionCreate.jsx 파일 수정 - memo 필드 추가
2023-09-01 11:15: API 요청 데이터 형식을 명시적으로 새 스키마에 맞게 지정 (InstructionCreate.jsx)
2023-09-01 11:20: API 요청 데이터 형식을 명시적으로 새 스키마에 맞게 지정 (InstructionEdit.jsx)
2023-09-01 11:30: 모든 파일 변경 완료 및 테스트
2023-09-01 11:40: 작업 완료 - 새 API 스키마에 맞춰 모든 관련 페이지 수정 완료

변경 내용 요약:

1. API 스키마 변경 적용: title → name, 새로운 memo 필드 추가
2. 수정 페이지 UI 개선: 추가 페이지와 일관된 스타일 적용
3. 상세 페이지 개선: 주소 정보 표시 개선, 비고 필드 추가
4. API 요청 형식 표준화: 새 스키마에 맞는 데이터 형식 명시적 지정

---

## Items

_This section will contain the list of items to be processed._
_(The format of items is a table)_

| Item ID                 | Text to Tokenize                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------- |
| auth_join               | 회원가입 API 구현: POST /test/join, username, name, email, password 필드 필요         |
| auth_login              | 로그인 API 구현: POST /login, username, password 필드 필요, JWT 토큰 발급             |
| auth_logout             | 로그아웃 API 구현: POST /auth/logout, 토큰 무효화 처리                                |
| auth_reissue            | 토큰 재발급 API 구현: POST /auth/reissue, refresh token으로 access token 재발급       |
| user_my                 | 마이페이지 조회 API 구현: GET /users/me, 사용자 정보 조회                             |
| user_profile            | 프로필 수정 API 구현: PATCH /users/name, name 수정                                    |
| user_pw_change          | 비밀번호 변경 API 구현: PUT /users/password, oldPassword, newPassword 필드 필요       |
| user_pw_reset           | 비밀번호 초기화 API 구현: POST /users/password/reset, username으로 임시 비밀번호 발급 |
| unit_price_list         | 일위대가 목록 조회 API 구현: GET /unit-price, keyword 검색, 페이지네이션 지원         |
| unit_price_detail       | 일위대가 상세 조회 API 구현: GET /unit-price/{id}, ID로 상세 정보 조회                |
| unit_price_create       | 일위대가 생성 API 구현: POST /unit-price, code, name, spec, unit, costs 필드 필요     |
| unit_price_update       | 일위대가 수정 API 구현: PUT /unit-price/{id}, ID로 수정                               |
| unit_price_delete       | 일위대가 삭제 API 구현: DELETE /unit-price/{id}, ID로 삭제                            |
| worker_list             | 작업자 목록 조회 API 구현: GET /worker, 작업자 목록 조회                              |
| worker_create           | 작업자 생성 API 구현: POST /worker, name, phone, rank, status, birth, note 필드 필요  |
| worker_update           | 작업자 수정 API 구현: PUT /worker/{id}, ID로 작업자 정보 수정                         |
| worker_status           | 작업자 재직 상태 변경 API 구현: POST /worker/{id}/status, 재직/퇴사 상태 변경         |
| instruction_create      | 지시 생성 API 구현: POST /instruction, 지시 생성                                      |
| instruction_excel       | 지시 엑셀 업로드 API 구현: POST /instruction/excel, 엑셀 파일로 일괄 생성             |
| instruction_list        | 지시 목록 조회 API 구현: GET /instruction, status, page, size 파라미터로 필터링       |
| instruction_detail      | 지시 상세 조회 API 구현: GET /instruction/{id}, ID로 상세 정보 조회                   |
| instruction_update      | 지시 정보 변경 API 구현: PUT /instruction/{id}, ID로 지시 정보 수정                   |
| instruction_status      | 지시 상태 변경 API 구현: POST /instruction/{id}/status, 지시 상태 변경                |
| instruction_confirm     | 지시 확정 API 구현: POST /instruction/{id}/confirm, 기성에 반영                       |
| instruction_type_add    | 지시-공종 추가 API 구현: POST /instruction/{id}/type, 공종 추가                       |
| instruction_type_update | 지시-공종 수정 API 구현: PUT /instruction/{id}/type, 공종 수정                        |
| instruction_type_delete | 지시-공종 삭제 API 구현: DELETE /instruction/{id}/type, 공종 삭제                     |
| instruction_unit_add    | 지시-공종-작업 추가 API 구현: POST /instruction/{id}/type/unit, 작업 추가             |
| instruction_unit_update | 지시-공종-작업 수정 API 구현: PUT /instruction/{id}/type/unit, 작업 수정              |
| instruction_unit_delete | 지시-공종-작업 삭제 API 구현: DELETE /instruction/{id}/type/unit, 작업 삭제           |
| progress_list           | 기성 목록 조회 API 구현: GET /progress-payment/rounds, 기성 목록 조회                 |
| progress_detail         | 기성 회차별 조회 API 구현: GET /progress-payment/rounds/{id}, 회차별 상세 조회        |
| progress_create         | 기성 생성 API 구현: POST /progress-payment/rounds, 기성 생성                          |
| progress_complete       | 기성 완료 API 구현: POST /progress-payment/rounds/{id}, 기성 완료 처리                |
