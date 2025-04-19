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

2023-08-05 10:00: 작업 시작 - 지시 관련 API 엑셀 구현을 진행합니다.
2023-08-05 10:01: InstructionCreate.jsx 파일 분석 완료. 현재 기본적인 지시 생성 기능이 구현되어 있음.
2023-08-05 10:02: instructionAPI.js 및 instructionQueries.js 파일 분석 완료. 엑셀 업로드 API 구현이 필요한 상황임.
2023-08-05 10:03: ANALYZE 단계 시작 - 엑셀 파일 업로드 API 구현을 위한 요구사항 분석 중.
2023-08-05 10:30: 지시 관련 기존 컴포넌트 분석 완료. 현재 instructionAPI.js에 구현된 API 함수들:

- fetchInstructions (GET /instruction) - 지시 목록 조회
- fetchInstructionById (GET /instruction/{id}) - 지시 상세 조회
- createInstruction (POST /instruction) - 지시 생성
- updateInstruction (PUT /instruction/{id}) - 지시 정보 수정
- updateInstructionStatus (POST /instruction/{id}/status) - 지시 상태 변경 (모의 데이터만 있음)
- toggleInstructionFavorite (POST /instruction/{id}/favorite) - 지시 즐겨찾기 토글
- deleteInstruction (DELETE /instruction/{id}) - 지시 삭제
- confirmInstruction (POST /instruction/{id}/confirm) - 지시 확정 (모의 데이터만 있음)
  2023-08-05 10:31: InstructionImport.jsx 분석 완료. 현재 JSON/CSV 파일만 지원하며 xlsx 포맷은 미지원 상태.
  2023-08-05 10:32: 미구현된 API 기능:
- Excel 파일 업로드 API (POST /instruction/excel)
- 지시 상태 변경 API (실제 API 호출)
- 지시 확정 API (실제 API 호출)
- 지시-공종 관련 API (POST, PUT, DELETE /instruction/{id}/type)
- 지시-공종-작업 관련 API (POST, PUT, DELETE /instruction/{id}/type/unit)
  2023-08-05 10:40: API 문서 확인 완료. 지시 관련 API 문서에 상세 요청/응답 형식이 명시되어 있지 않음.
  2023-08-05 10:45: ANALYZE 단계 완료. 지시 관련 API 및 컴포넌트 현황 파악 완료.
  2023-08-05 10:50: BLUEPRINT 단계 시작. 엑셀 파일 업로드 API 및 관련 기능 구현을 위한 계획 수립 중.
  2023-08-05 11:00: 계획 작성 완료. 사용자 검토 및 승인 필요.
  2023-08-05 11:30: 사용자 요청에 따라 계획 수정. 백엔드 개발은 작업 범위에서 제외하고 프론트엔드 구현에 집중. 엑셀 기능은 향후 필수 작업으로 표시.
  2023-08-05 11:35: 사용자가 제시한 10가지 지시 관리 요구사항을 반영하여 계획 재수립.
  2023-08-05 11:40: 수정된 계획 작성 완료. 사용자 검토 및 승인 필요.
  2023-08-05 11:45: 계획 승인 완료. CONSTRUCT 단계로 전환하여 개발 시작.
  2023-08-05 11:50: 지시 목록 페이지 개선 작업(Step 1.1) 시작. 현재 InstructionList.jsx 파일 분석 진행 중.
  2023-08-05 12:00: InstructionList.jsx 분석 완료. 현재 구현 상태:
- 지시 목록 필터링: 상태(status)와 우선순위(priority)로 필터링 가능
- 검색 기능: 제목, ID, 위치, 주소, 관리자, 담당자, 채널, 내용 등으로 검색 가능
- 컬럼 표시 선택: 사용자가 원하는 컬럼만 선택하여 표시 가능
- 페이지네이션: 페이지 단위로 데이터 로드 가능
- 지시 추가, 가져오기, 내보내기 버튼 제공
- 상태 및 우선순위 시각화: 색상 구분으로 표시
- 개선 필요 사항:
  1. 번지/동 검색 기능 명확화
  2. 날짜 범위 필터링 추가
  3. 지시 상태 필터링 5단계 업데이트
  4. 최종 수정자 정보 컬럼 추가
  5. 작업자, 작업현황, 비고, 기성회차 필드 추가
     2023-08-05 12:10: instructionAPI.js 분석 완료. 현재 Mock 데이터 구조:
- 기본 필드: id, title, priority, status, createdAt, dueDate, location, address, manager, receiver, channel, description
- 추가 필드: works(배열), favorite(불리언), paymentRound, lastModifiedBy, lastModifiedAt
- 개선이 필요한 필드:
  1. 5단계 상태 체계화: RECEIVED(접수), IN_PROGRESS(작업중), COMPLETED_WORK(작업완료), IN_APPROVAL(결재중), COMPLETED(완료)
  2. 작업자(worker) 필드 추가
  3. 작업현황(workStatus) 필드 추가
  4. 비고(note) 필드 추가
  5. 동(dong)과 지번(lotNumber) 필드를 명확히 구분
  6. 세부사항과 작업내용 필드 구분
     2023-08-05 12:20: 개선 계획 정리:

1. InstructionList.jsx 페이지 개선:
   - 상태 필터 5단계로 업데이트
   - 날짜 범위 필터 추가
   - 번지/동 검색 기능 구체화
   - 목록 컬럼에 작업자, 작업현황, 비고, 기성회차, 최종 수정자 필드 추가
   - 컬럼 레이아웃 최적화
2. Mock 데이터 개선:
   - 기존 mockInstructions 데이터 확장
   - 새로운 필드 및 5단계 상태 추가
3. 구현 순서:
   - 먼저 Mock 데이터 구조 업데이트
   - 상태 관련 코드 업데이트 (STATUS_MAP)
   - 날짜 필터링 컴포넌트 추가
   - 검색 영역 개선
   - 컬럼 정의 업데이트
     2023-08-05 12:30: instructionAPI.js 파일의 Mock 데이터 업데이트 완료:

- 상태 체계를 5단계로 확장 (RECEIVED, IN_PROGRESS, COMPLETED_WORK, IN_APPROVAL, COMPLETED)
- 새로운 데이터 항목 추가: dong, lotNumber, workContent, note, worker, workStatus
- 기존 데이터 항목 수정 및 확장: description은 세부사항으로, workContent는 작업내용으로 분리
- 테스트를 위해 추가 샘플 데이터 2개 추가 (IN_APPROVAL, COMPLETED 상태)
  2023-08-05 12:45: InstructionList.jsx 파일 업데이트 완료:
- 상태 필터 5단계로 업데이트 (접수, 작업중, 작업완료, 결재중, 완료)
- 날짜 범위 필터링 기능 추가 (createdAt, dueDate, lastModifiedAt 필드 선택 가능)
- 검색 기능 개선 (전체 검색, 동 검색, 지번 검색 선택 가능)
- 테이블 컬럼 추가 (동, 지번, 작업내용, 비고, 작업자, 작업현황, 기성회차, 최종 수정자)
- 컬럼 표시 선택 기본값 최적화
- UI 개선 (필터 및 검색 영역 레이아웃 최적화)
  2023-08-05 13:00: Step 1.1(지시 목록 페이지 개선) 작업 완료.

---

## Items

_This section will contain the list of items to be processed._
_(The format of items is a table)_

| Item ID                 | Text to Tokenize                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------ |
| auth_join               | 회원가입 API 구현: POST /test/join, username, name, email, password 필드 필요        |
| auth_login              | 로그인 API 구현: POST /login, username, password 필드 필요, JWT 토큰 발급            |
| auth_logout             | 로그아웃 API 구현: POST /auth/logout, 토큰 무효화 처리                               |
| auth_reissue            | 토큰 재발급 API 구현: POST /auth/reissue, refresh token으로 access token 재발급      |
| user_my                 | 마이페이지 조회 API 구현: GET /users/me, 사용자 정보 조회                            |
| user_profile            | 프로필 수정 API 구현: PATCH /users/name, name 수정                                   |
| user_pw_change          | 비밀번호 변경 API 구현: PUT /users/pw, oldPassword, newPassword 필드 필요            |
| user_pw_reset           | 비밀번호 초기화 API 구현: POST /users/pw/reset, username으로 임시 비밀번호 발급      |
| unit_price_list         | 일위대가 목록 조회 API 구현: GET /unit-price, keyword 검색, 페이지네이션 지원        |
| unit_price_detail       | 일위대가 상세 조회 API 구현: GET /unit-price/{id}, ID로 상세 정보 조회               |
| unit_price_create       | 일위대가 생성 API 구현: POST /unit-price, code, name, spec, unit, costs 필드 필요    |
| unit_price_update       | 일위대가 수정 API 구현: PUT /unit-price/{id}, ID로 수정                              |
| unit_price_delete       | 일위대가 삭제 API 구현: DELETE /unit-price/{id}, ID로 삭제                           |
| worker_list             | 작업자 목록 조회 API 구현: GET /worker, 작업자 목록 조회                             |
| worker_create           | 작업자 생성 API 구현: POST /worker, name, phone, rank, status, birth, note 필드 필요 |
| worker_update           | 작업자 수정 API 구현: PUT /worker/{id}, ID로 작업자 정보 수정                        |
| worker_status           | 작업자 재직 상태 변경 API 구현: POST /worker/{id}/status, 재직/퇴사 상태 변경        |
| instruction_create      | 지시 생성 API 구현: POST /instruction, 지시 생성                                     |
| instruction_excel       | 지시 엑셀 업로드 API 구현: POST /instruction/excel, 엑셀 파일로 일괄 생성            |
| instruction_list        | 지시 목록 조회 API 구현: GET /instruction, status, page, size 파라미터로 필터링      |
| instruction_detail      | 지시 상세 조회 API 구현: GET /instruction/{id}, ID로 상세 정보 조회                  |
| instruction_update      | 지시 정보 변경 API 구현: PUT /instruction/{id}, ID로 지시 정보 수정                  |
| instruction_status      | 지시 상태 변경 API 구현: POST /instruction/{id}/status, 지시 상태 변경               |
| instruction_confirm     | 지시 확정 API 구현: POST /instruction/{id}/confirm, 기성에 반영                      |
| instruction_type_add    | 지시-공종 추가 API 구현: POST /instruction/{id}/type, 공종 추가                      |
| instruction_type_update | 지시-공종 수정 API 구현: PUT /instruction/{id}/type, 공종 수정                       |
| instruction_type_delete | 지시-공종 삭제 API 구현: DELETE /instruction/{id}/type, 공종 삭제                    |
| instruction_unit_add    | 지시-공종-작업 추가 API 구현: POST /instruction/{id}/type/unit, 작업 추가            |
| instruction_unit_update | 지시-공종-작업 수정 API 구현: PUT /instruction/{id}/type/unit, 작업 수정             |
| instruction_unit_delete | 지시-공종-작업 삭제 API 구현: DELETE /instruction/{id}/type/unit, 작업 삭제          |
| progress_list           | 기성 목록 조회 API 구현: GET /progress-payment/rounds, 기성 목록 조회                |
| progress_detail         | 기성 회차별 조회 API 구현: GET /progress-payment/rounds/{id}, 회차별 상세 조회       |
| progress_create         | 기성 생성 API 구현: POST /progress-payment/rounds, 기성 생성                         |
| progress_complete       | 기성 완료 API 구현: POST /progress-payment/rounds/{id}, 기성 완료 처리               |
