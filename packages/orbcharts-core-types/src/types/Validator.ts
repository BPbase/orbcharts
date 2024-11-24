



export type ToBeTypes = 'string' | 'number' | 'boolean' | 'object' | 'object[]' | 'string[]' | 'number[]' | 'Function' | 'null' | 'undefined'

export type ToBeOption = 'ColorType'

// 有使用定義好的型別則不需寫 validate
export interface ValidatorRuleToBeTypes {
  toBeTypes: ToBeTypes[]
}

// 自訂規則
export interface ValidatorRuleToBe {
  toBe: string
  test: (value: any) => boolean
}

// 選項資料型別
export interface ValidatorRuleToBeOption {
  toBeOption: ToBeOption
}

export type ValidatorRule<T> = {[key in keyof T]: ValidatorRuleToBeTypes | ValidatorRuleToBe | ValidatorRuleToBeOption}


// export type ValidateColumns<T> = (data: T, rules: ValidatorRule<T>) => ValidatorResult

function validateColumns<T> (data: T, rules: Partial<ValidatorRule<T>>): ValidatorResult {
  return { status: 'success', columnName: '', expectToBe: '' }
}

export interface ValidatorUtils {
  validateColumns: typeof validateColumns // 我發現要這樣寫才能夠透過 data 型別自動推斷出 T，不曉得有沒有更好的寫法
}


export interface ValidatorResult {
  status: 'success' | 'warning' | 'error'
  // message: string // warning or error message
  columnName: string,
  expectToBe: string,
}

