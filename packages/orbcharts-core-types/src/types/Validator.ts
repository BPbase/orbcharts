

export interface ValidatorResult {
  status: 'success' | 'warning' | 'error'
  // message: string // warning or error message
  columnName: string,
  expectToBe: string,
}