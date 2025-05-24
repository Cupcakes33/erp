## Plan

다음은 `InstructionList.jsx` 파일 수정 계획입니다.

1.  **상태 및 필터 로직 수정:**

    - `filters` 상태에서 `manager`, `startDate`, `endDate`, `name`, `branchName` 관련 필드를 제거합니다. (`searchType` 필드는 기존 로직대로 유지합니다.)
    - `orderId` (지시 ID) 검색을 위한 `orderIdKeyword` 상태를 `filters`에 추가합니다.
    - `center` 필터 상태를 `filters`에 추가하고, 기존 `branchName`을 대체합니다.
    - `loadFiltersFromStorage` 함수:
      - 제거된 필터(`manager`, `name`, `branchName`, `startDate`, `endDate`) 로드 로직을 삭제합니다.
      - `center` 필터 로드 로직을 추가합니다. (기존 `branchName` 로직 활용 가능)
    - `useEffect` (필터 로컬 스토리지 저장 로직):
      - 제거된 필터 저장 로직을 삭제합니다.
      - `center` 필터 저장 로직을 추가합니다. (기존 `branchName` 로직 활용 가능)
    - `useEffect` (컴포넌트 마운트 시 필터 적용 로직):
      - `manager`, `name`, `branchName`, `startDate`, `endDate` 필터링 조건을 제거합니다.
      - `center` 필터링 조건을 추가합니다.
      - `orderIdKeyword` 필터링 조건을 추가합니다.
    - `resetFilters` 함수:
      - 제거된 필터(`manager`, `name`, `branchName`, `startDate`, `endDate`) 초기화 로직을 삭제합니다.
      - `orderIdKeyword` 및 `center` 필터 초기화 로직을 추가합니다.
    - `handleFilterChange` 함수:
      - `orderIdKeyword` 및 `center` 입력 변경을 처리하도록 수정합니다.
    - `handleApplyFilter` 함수:
      - API 요청 파라미터에서 이전 필터(`name`, `manager`, `branchName`, `startDate`, `endDate`, `search`)와 관련된 파라미터들을 제거하거나 새롭게 정의합니다.
      - 새로운 API 스펙에 맞게 `center`, `status`, `page`, `size` 파라미터를 설정합니다.
      - `filters.orderIdKeyword`가 있으면 API 요청 시 `keyword` 파라미터로 `filters.orderIdKeyword` 값을 사용하고, `searchType` 파라미터는 `filters.searchType` 값을 사용합니다 (예: 'all', 'dong', 'lotNumber' 등 기존 값 사용). `filters.orderIdKeyword`가 없으면 `keyword`는 보내지 않고 `searchType`도 기본값('all') 또는 보내지 않을 수 있습니다 (기존 로직 따름).
      - `filters.center` 값을 `center` 파라미터로 사용합니다.

2.  **UI 변경:**

    - **관리자 필터 제거**: 관련 UI 요소(`label`, `input`)를 삭제합니다.
    - **지시일자 범위 필터 제거**: `DatePicker` 관련 UI 요소 및 `handleDateRangeChange` 함수 호출 부분을 삭제합니다.
    - **제목 필터를 지시 ID 필터로 변경**:
      - `label` 텍스트를 '제목'에서 '지시 ID'로 변경합니다.
      - `input` 태그의 `name` 속성을 `name`에서 `orderIdKeyword`로 변경합니다.
      - `value` 속성을 `filters.name`에서 `filters.orderIdKeyword`로 변경합니다.
      - `placeholder`를 "지시 ID로 검색" 등으로 변경합니다.
    - **지점 필터를 센터 필터로 변경**:
      - `label` 텍스트를 '지점'에서 '센터'로 변경합니다.
      - `FormSelect` 컴포넌트의 `id` 및 `name` 속성을 `branchName`에서 `center`로 변경합니다.
      - `value` 속성을 `filters.branchName`에서 `filters.center`로 변경합니다.
      - `options`를 `[{ value: "강동", label: "강동" }, { value: "성북", label: "성북" }]`으로 변경합니다.

3.  **API 호출 파라미터 확인**:

    - `useInstructions` 훅에 전달되는 `filterParams`가 `handleApplyFilter` 함수 내에서 새로운 API 명세(`center`, `status`, `size`, `page`, `keyword`, `searchType`)에 맞게 올바르게 설정되는지 확인합니다.

4.  **코드 정리:**

    - 제거된 필터와 관련된 `useEffect`의 의존성 배열을 수정합니다.
    - 사용되지 않는 변수, 함수 (예: `handleDateRangeChange`, `dateField` 관련 로직, `priorityOptions`, `priorityMap`)를 제거합니다.
    - 불필요한 주석이나 `console.log`를 정리합니다.

5.  **`src/lib/api/instructionAPI.js` 파일 수정:**
    - `uploadCsvBulkInstructions` 함수를 수정합니다.
      - API 엔드포인트는 `/api/instruction/file`로 유지합니다.
      - `FormData` 객체를 생성하고, `csvFile` 객체를 'file'이라는 키로 `FormData`에 추가합니다.
      - `axios.post` 요청 시 `FormData` 객체를 요청 본문(body)으로 전달합니다.
      - `Content-Type` 헤더는 `axios`가 `FormData`를 감지하여 자동으로 `multipart/form-data`로 설정하도록 명시적인 헤더 설정을 제거합니다.
      - 함수 주석을 업데이트하여 `multipart/form-data`를 사용하여 파일을 전송함을 명시합니다.

## Log

사용자 요청 및 발생한 오류에 따라 `workflow_state.md` 파일의 계획을 수정했습니다.

이제 수정된 계획에 대한 사용자 확인을 요청합니다.
State.Status = NEEDS_PLAN_APPROVAL
