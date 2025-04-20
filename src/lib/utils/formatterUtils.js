// 숫자를 한국 원화 표기법(천 단위 콤마)으로 포맷
export function formatNumberKR(num) {
  if (num === null || num === undefined || num === "") return ""
  const parsedNum =
    typeof num === "string" ? Number(num.replace(/,/g, "")) : num
  if (isNaN(parsedNum)) return ""
  return parsedNum.toLocaleString("ko-KR")
}
