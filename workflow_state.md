## Plan

### 지시(Instruction) API 변경 계획

**목표:** 지시 생성 및 수정 플로우를 개선하여, 공종 대신 센터를 기준으로 계약 및 회차를 선택하고, 이를 지시 정보에 반영합니다.

**세부 작업:**

1.  **`createInstruction` 함수 변경 (`src/lib/api/instructionAPI.js`)**

    - **파라미터 변경:** `instructionData` 객체에 `center` (센터 이름, 문자열 타입, 예: "강동", "성북") 필드를 포함하도록 변경합니다.
      - 기존 `channel` 필드는 유지하되, `center`와의 관계 및 용도를 명확히 하기 위해 주석 등으로 설명을 추가하거나, 사용자에게 확인 후 조정합니다. (현재는 `center`를 추가하고 `channel`은 그대로 둡니다.)
    - **JSDoc 주석 업데이트:** 변경된 파라미터를 반영하여 JSDoc을 수정합니다.
    - **로직:** 함수 자체의 핵심 로직(서버에 데이터 전송)은 크게 변경되지 않으나, `center`가 포함된 `instructionData`를 전송하도록 합니다.

2.  **`updateInstruction` 함수 변경 (`src/lib/api/instructionAPI.js`)**

    - **파라미터 변경:** `instructionData` 객체에 `paymentId` (회차 ID, 숫자 타입) 필드를 포함하도록 변경합니다.
    - **공종 관련 로직 제거:** "지시 수정에서 공종 변경 필요 없음" 요구사항에 따라, `instructionData`에서 공종 관련 필드를 직접 수정하거나 보내는 부분이 있다면 해당 로직은 호출하는 측에서 처리하도록 하고, API 함수 자체는 전달된 `instructionData`를 사용합니다. (현재 `updateInstruction` 함수는 전달받은 데이터를 그대로 사용하므로 특별한 제거 로직은 필요 없을 수 있습니다.)
    - **JSDoc 주석 업데이트:** 변경된 파라미터를 반영하여 JSDoc을 수정합니다.

3.  **신규 API 헬퍼 함수 추가 (`src/lib/api/instructionAPI.js`)**
    - **`fetchContractsByCenter(center)` 함수 신규 생성:**
      - **기능:** 센터 이름(문자열)을 인자로 받아, 해당 센터의 계약 목록을 조회합니다. (API 엔드포인트: `/api/contract/${center}`)
      - **반환:** 계약 목록 Promise 객체
      - **에러 처리:** API 호출 실패 시 콘솔 에러 로그 및 예외 throw
      - **JSDoc 주석:** 함수 설명, 파라미터, 반환 값 명시
    - **`fetchPaymentsByContract(contractId)` 함수 신규 생성:**
      - **기능:** 계약 ID를 인자로 받아, 해당 계약의 회차 목록을 조회합니다. (API 엔드포인트: `/api/payment/${contractId}`)
      - **반환:** 회차 목록 Promise 객체
      - **에러 처리:** API 호출 실패 시 콘솔 에러 로그 및 예외 throw
      - **JSDoc 주석:** 함수 설명, 파라미터, 반환 값 명시

**가정 및 결정 사항:**

- **센터 필드명:** `center` (문자열 타입, 예: "강동", "성북")로 사용합니다.
- **회차 ID 필드명:** `paymentId` (숫자 타입)로 사용합니다.
- **신규 API 엔드포인트:**
  - 센터별 계약 목록: `/api/contract/${center}` (center는 문자열)
  - 계약별 회차 목록: `/api/payment/${contractId}`
  - 위 엔드포인트는 실제 사용 가능하다고 가정합니다.
- **`channel` 필드:** `createInstruction` 및 `updateInstruction` 함수의 `instructionData` 내 `channel` 필드는 일단 유지합니다. `center` 추가와 별개로 기존 기능을 유지할 수 있습니다. 추후 `center`로 완전히 대체될 경우 삭제를 고려합니다.
- **페이지네이션 및 필터링:** 새로 추가되는 `fetchContractsByCenter`, `fetchPaymentsByContract` 함수에는 기본적인 조회 기능만 우선 구현하며, 필요시 페이지네이션 및 추가 필터링 파라미터를 추후 확장할 수 있습니다.

**State:**

- Status: COMPLETED

---

## Log

사용자 요청 및 발생한 오류에 따라 `workflow_state.md` 파일의 계획을 수정했습니다.

이제 수정된 계획에 대한 사용자 확인을 요청합니다.
State.Status = NEEDS_PLAN_APPROVAL
사용자 피드백 반영: `centerId` (숫자)를 `center` (문자열)로 변경하고, 관련 API 경로 및 설명을 수정하여 계획 업데이트.
State.Status = NEEDS_PLAN_APPROVAL
사용자 승인 후, `src/lib/api/instructionAPI.js` 파일에 다음 변경 사항 적용 완료:

- `createInstruction` JSDoc 업데이트 (center 필드 명시)
- `updateInstruction` JSDoc 업데이트 (paymentId 필드 명시)
- `fetchContractsByCenter(center)` 신규 함수 추가
- `fetchPaymentsByContract(contractId)` 신규 함수 추가
- `uploadCsvBulkInstructions` API 엔드포인트 수정 (`/instruction/file`)

### 지시(Instruction) 생성 페이지 UI 변경 계획 (`src/pages/instruction/InstructionCreate.jsx`)

**목표:** 지시 생성 페이지에서 기존 공종 선택 로직을 제거하고, 센터 선택 -> 계약 선택 -> 회차 선택으로 이어지는 UI 및 로직을 구현합니다.

**세부 작업:**

1.  **상태(State) 추가 및 변경:**

    - `formData` 상태에서 `processId` 필드를 제거합니다.
    - 새로운 상태 추가:
      - `selectedCenter` (string): 현재 선택된 센터 이름 (예: "강동")
      - `contracts` (array): 선택된 센터에 해당하는 계약 목록
      - `selectedContractId` (number): 현재 선택된 계약 ID
      - `payments` (array): 선택된 계약에 해당하는 회차 목록
      - `selectedPaymentId` (number): 현재 선택된 회차 ID (이 값은 지시 생성 시 사용되지 않지만, 수정 시 필요하므로 일단 생성 로직에서는 사용하지 않음)
    - 로딩 상태 추가:
      - `isContractsLoading` (boolean): 계약 목록 로딩 상태
      - `isPaymentsLoading` (boolean): 회차 목록 로딩 상태

2.  **API 훅(Hook) 및 함수 사용 준비:**

    - `import` 문에 `fetchContractsByCenter`, `fetchPaymentsByContract` API 함수를 추가합니다.
    - 필요에 따라 `react-query` 등을 사용하여 비동기 데이터 호출 및 상태 관리를 할 수 있습니다. (현재는 `useState`와 `useEffect`를 사용하는 방향으로 계획합니다.)

3.  **UI 요소 변경 및 추가:**

    - **기존 공종 선택 UI 제거:** `processId` 관련 `FormSelect` 컴포넌트 및 관련 로직 (예: `processOptions`, `processSelectOptions`, `isProcessesLoading` 등)을 제거합니다.
    - **센터 선택 UI 추가:**
      - `FormSelect` 컴포넌트를 사용하여 센터를 선택할 수 있도록 합니다.
      - 선택 가능한 센터 목록은 상수로 정의합니다. (예: `[{ value: "강동", label: "강동" }, { value: "성북", label: "성북" }]`)
      - `onChange` 핸들러를 통해 `selectedCenter` 상태를 업데이트하고, 계약 목록을 불러오는 함수를 호출합니다.
    - **계약 선택 UI 추가:**
      - `FormSelect` 컴포넌트를 사용하여 계약을 선택할 수 있도록 합니다.
      - 선택된 센터에 따라 동적으로 계약 목록(`contracts`)을 옵션으로 표시합니다.
      - `onChange` 핸들러를 통해 `selectedContractId` 상태를 업데이트하고, 회차 목록을 불러오는 함수를 호출합니다.
      - `isLoading` prop을 사용하여 `isContractsLoading` 상태를 반영합니다.
    - **회차 선택 UI 추가 (생성 시에는 disabled 또는 숨김 처리):**
      - `FormSelect` 컴포넌트를 사용하여 회차를 선택할 수 있도록 합니다.
      - 선택된 계약에 따라 동적으로 회차 목록(`payments`)을 옵션으로 표시합니다.
      - `onChange` 핸들러를 통해 `selectedPaymentId` 상태를 업데이트합니다.
      - `isLoading` prop을 사용하여 `isPaymentsLoading` 상태를 반영합니다.
      - **중요:** 지시 생성 시에는 회차를 선택하지 않으므로, 이 UI는 비활성화(disabled)하거나 숨김 처리합니다. (수정 페이지에서 활성화 예정)

4.  **로직 변경 및 추가:**

    - **센터 변경 시 계약 목록 조회:**
      - `selectedCenter` 상태가 변경될 때 `useEffect`를 사용하여 `fetchContractsByCenter(selectedCenter)` API를 호출합니다.
      - API 응답으로 받은 계약 목록을 `contracts` 상태에 저장합니다.
      - `selectedContractId`, `payments`, `selectedPaymentId` 상태를 초기화합니다.
    - **계약 변경 시 회차 목록 조회:**
      - `selectedContractId` 상태가 변경될 때 `useEffect`를 사용하여 `fetchPaymentsByContract(selectedContractId)` API를 호출합니다.
      - API 응답으로 받은 회차 목록을 `payments` 상태에 저장합니다.
      - `selectedPaymentId` 상태를 초기화합니다.
    - **`handleSubmit` 함수 수정:**
      - API 페이로드(`payload`) 구성 시, `processId` 대신 `center: selectedCenter`를 포함하도록 변경합니다. (회차 ID는 생성 시 포함하지 않음)
      - `createInstructionMutation.mutateAsync`에 수정된 `payload`를 전달합니다.
    - **초기화 로직:** 컴포넌트 마운트 시 또는 필요한 경우 관련 상태들을 초기화하는 로직을 추가합니다.

5.  **JSDoc 및 주석 업데이트:** 변경된 로직 및 상태에 맞게 주석을 업데이트합니다.

**참고:**

- 지시 수정 페이지(`InstructionUpdate.jsx` 또는 유사 파일)가 확인되면, 위 계획을 바탕으로 유사하게 수정합니다. 수정 페이지에서는 회차 선택 UI를 활성화하고, `updateInstruction` API 호출 시 `paymentId: selectedPaymentId`를 페이로드에 포함해야 합니다.

**State:**

- Status: COMPLETED

---

### 지시(Instruction) 수정 페이지 UI 변경 계획 (`src/pages/instruction/InstructionEdit.jsx`)

**목표:** 지시 수정 페이지에서 기존 공종 선택 로직을 제거하고, 센터, 계약, 회차 선택 기능을 구현합니다. 수정 시 선택된 `paymentId`를 API로 전송합니다.

**세부 작업:**

1.  **상태(State) 추가 및 변경:**

    - `formData` 상태에서 `processId` 필드를 제거합니다.
    - 새로운 상태 추가:
      - `selectedCenter` (string): 현재 선택된 센터 이름.
      - `contracts` (array): 선택된 센터에 해당하는 계약 목록.
      - `selectedContractId` (number/string): 현재 선택된 계약 ID.
      - `payments` (array): 선택된 계약에 해당하는 회차 목록.
      - `selectedPaymentId` (number/string): 현재 선택된 회차 ID. (이 값을 `updateInstruction` 시 전송)
      - `initialCenter` (string): 초기 로드된 지시 데이터의 센터명 (기존 데이터에 센터 정보가 있다면).
      - `initialContractId` (number/string): 초기 로드된 지시 데이터의 계약 ID (기존 데이터에 계약 ID가 있다면, 없으면 회차 ID로 유추 또는 UI에서 선택 유도).
      - `initialPaymentId` (number/string): 초기 로드된 지시 데이터의 회차 ID.
    - 로딩 상태 추가:
      - `isContractsLoading` (boolean): 계약 목록 로딩 상태.
      - `isPaymentsLoading` (boolean): 회차 목록 로딩 상태.

2.  **API 훅(Hook) 및 함수 사용 준비:**

    - `import` 문에 `fetchContractsByCenter`, `fetchPaymentsByContract` API 함수를 추가합니다.
    - 기존 지시 데이터 로드 로직 (`useInstruction`)은 유지합니다.
    - `useUpdateInstruction` 훅은 그대로 사용합니다.

3.  **데이터 초기화 로직 (`useEffect`):**

    - `useInstruction`으로 기존 지시 데이터를 성공적으로 불러왔을 때 실행되는 `useEffect` 내부 로직 수정:
      - `formData` 설정 시 `processId` 관련 로직을 제거합니다.
      - **중요:** 기존 지시 데이터에 `center` 정보가 있다면 `setInitialCenter` 및 `setSelectedCenter`를 호출합니다. (만약 기존 데이터에 `center` 필드가 없다면, 어떻게 처리할지 결정 필요. 예를 들어, 사용자에게 센터를 먼저 선택하도록 유도하거나, 기존 `channel` 등의 필드에서 유추).
      - 기존 지시 데이터에 `paymentId`가 있다면 `setInitialPaymentId` 및 `setSelectedPaymentId`를 호출합니다.
      - **계약 ID 초기화:** 기존 지시 데이터에 `contractId`가 직접적으로 없다면, `paymentId`를 통해 연관된 `contractId`를 알아내거나, UI에서 사용자가 센터 선택 후 계약을 선택하도록 해야 합니다. 우선, `paymentId`가 있다면 해당 회차가 속한 계약을 선택된 것으로 간주하고, `initialContractId`를 설정하는 로직을 시도합니다 (이 부분은 API 응답 구조에 따라 달라질 수 있으며, 추가적인 API 호출이 필요할 수 있음).

4.  **UI 요소 변경 및 추가:**

    - **기존 공종 선택 UI 제거:** `processId` 관련 `FormSelect` 컴포넌트 및 관련 로직 (예: `processesData`, `processOptions`, `processSelectOptions` 등)을 제거합니다.
    - **센터 선택 UI 추가:**
      - `FormSelect` 컴포넌트를 사용하여 센터를 선택합니다.
      - 선택 가능한 센터 목록은 `CENTER_OPTIONS` 상수를 사용합니다.
      - `value`는 `selectedCenter` 상태와 바인딩합니다.
      - `onChange` 핸들러 (`handleChange` 내부에서 처리)를 통해 `selectedCenter` 상태를 업데이트하고, 계약 목록을 불러오는 함수를 호출하며, `selectedContractId`와 `selectedPaymentId`를 초기화합니다.
    - **계약 선택 UI 추가:**
      - `FormSelect` 컴포넌트를 사용하여 계약을 선택합니다.
      - 선택된 센터에 따라 동적으로 `contracts` 목록을 옵션으로 표시합니다.
      - `value`는 `selectedContractId` 상태와 바인딩합니다.
      - `onChange` 핸들러 (`handleChange` 내부에서 처리)를 통해 `selectedContractId` 상태를 업데이트하고, 회차 목록을 불러오는 함수를 호출하며, `selectedPaymentId`를 초기화합니다.
      - `isLoading` prop으로 `isContractsLoading` 상태를 반영합니다.
    - **회차 선택 UI 추가 (활성화):**
      - `FormSelect` 컴포넌트를 사용하여 회차를 선택합니다.
      - 선택된 계약에 따라 동적으로 `payments` 목록을 옵션으로 표시합니다.
      - `value`는 `selectedPaymentId` 상태와 바인딩합니다.
      - `onChange` 핸들러 (`handleChange` 내부에서 처리)를 통해 `selectedPaymentId` 상태를 업데이트합니다.
      - `isLoading` prop으로 `isPaymentsLoading` 상태를 반영합니다.
      - 지시 수정 시에는 이 필드가 **활성화**됩니다.

5.  **로직 변경 및 추가:**

    - **센터 변경 시 계약 목록 조회 로직:** (`InstructionCreate.jsx`와 유사)
      - `selectedCenter`가 변경될 때 `useEffect`를 사용하여 `fetchContractsByCenter`를 호출합니다.
      - API 응답으로 `contracts` 상태를 업데이트합니다.
      - 이때, 만약 `initialContractId`가 있고, 새로 불러온 `contracts` 목록에 `initialContractId`에 해당하는 계약이 있다면, `setSelectedContractId(initialContractId)`를 호출하여 초기 계약을 자동으로 선택해줍니다. 그렇지 않으면 `selectedContractId`를 초기화합니다.
    - **계약 변경 시 회차 목록 조회 로직:** (`InstructionCreate.jsx`와 유사)
      - `selectedContractId`가 변경될 때 `useEffect`를 사용하여 `fetchPaymentsByContract`를 호출합니다.
      - API 응답으로 `payments` 상태를 업데이트합니다.
      - 이때, 만약 `initialPaymentId`가 있고, 새로 불러온 `payments` 목록에 `initialPaymentId`에 해당하는 회차가 있다면, `setSelectedPaymentId(initialPaymentId)`를 호출하여 초기 회차를 자동으로 선택해줍니다. 그렇지 않으면 `selectedPaymentId`를 초기화합니다.
    - **`handleSubmit` 함수 수정:**
      - API 페이로드(`payload`) 구성 시, `processId`를 제거하고, `paymentId: selectedPaymentId ? Number(selectedPaymentId) : null` (또는 서버 요구사항에 맞게)을 포함하도록 변경합니다. (센터 정보는 기존 데이터에 이미 있거나, 수정 UI에서 변경하지 않는다고 가정. 만약 센터도 수정 가능하게 하려면 `center: selectedCenter`도 추가)
      - `updateInstructionMutation.mutateAsync`에 수정된 `payload`를 전달합니다.
    - **유효성 검사 (`validateForm`):**
      - 센터, 계약, 회차 선택에 대한 유효성 검사를 추가합니다 (필수 여부에 따라).

6.  **JSDoc 및 주석 업데이트:** 변경된 로직 및 상태에 맞게 주석을 업데이트합니다.

**가정 및 주요 고려사항:**

- 기존 지시 데이터(`response` 객체)에 `center` 정보가 어떻게 포함되어 있는지 확인 필요. 없다면 사용자가 직접 센터를 선택해야 합니다.
- 기존 지시 데이터에 `paymentId`는 있지만 `contractId`가 명시적으로 없는 경우, `paymentId`를 통해 `contractId`를 유추하거나, 서버에서 `payment` 객체에 `contractId` 정보를 포함해서 내려주는지 확인 필요. 현재 계획에서는 사용자가 센터->계약 순으로 선택하고, 초기 로드 시 `initialPaymentId`가 있으면 해당 회차가 속한 계약과 회차를 자동으로 선택해주는 방향으로 가정합니다.
- API 응답에서 계약과 회차의 `id`와 `name` (또는 `label`로 사용할 필드)의 키값을 정확히 확인하고 코드에 반영해야 합니다.

**State:**

- Status: COMPLETED

---
