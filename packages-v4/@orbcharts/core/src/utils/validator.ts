import type {
  ColorType,
  // ValidatorResult,
  // ToBeTypes,
  // ToBeOption,
  // ValidatorRuleToBeTypes,
  // ValidatorRuleToBe,
  // ValidatorRuleToBeOption,
  // ValidatorRule
} from '../types'
import { isFunction, isPlainObject } from './commonUtils'
// import { createValidatorErrorMessage } from './errorMessage'

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


// export type ValidateObject<T> = (data: T, rules: ValidatorRule<T>) => ValidatorResult

// function validateObject<T> (data: T, rules: Partial<ValidatorRule<T>>): ValidatorResult {
//   return { status: 'success', columnName: '', expectToBe: '' }
// }

export interface ValidatorUtils {
  validateObject: typeof validateObject // 我發現要這樣寫才能夠透過 data 型別自動推斷出 T，不曉得有沒有更好的寫法
}


export interface ValidatorResult {
  status: 'success' | 'warning' | 'error'
  // message: string // warning or error message
  columnName: string,
  expectToBe: string,
}


// let test: ValidatorRule = {
//   name: {
//     toBeTypes: ['string']
//   },
//   labels: {
//     toBe: 'string | "auto"',
//     test: (value: any) => {
//       return value === 'auto' || typeof value === 'string'
//     }
//   }
// }

function getInvalidProperty<T> (data: T, rules: Partial<ValidatorRule<T>>) {
  // "toBeTypes" 的測試
  const testType: {[key in ToBeTypes]: (value: any) => boolean} = {
    string: (value: any) => typeof value === 'string',
    number: (value: any) => typeof value === 'number',
    boolean: (value: any) => typeof value === 'boolean',
    object: (value: any) => isPlainObject(value), // 嚴格判斷是否為純物件
    'object[]': (value: any) => Array.isArray(value) && value.every((v: any) => isPlainObject(v)),
    'string[]': (value: any) => Array.isArray(value) && value.every((v: any) => typeof v === 'string'),
    'number[]': (value: any) => Array.isArray(value) && value.every((v: any) => typeof v === 'number'),
    Function: (value: any) => isFunction(value),
    null: (value: any) => value === null,
    undefined: (value: any) => value === undefined
  }
  // "toBeOption" 的測試
  const testOption: {[key in ToBeOption]: (value: any) => boolean} = {
    ColorType: (value: ColorType) => {
      return value === 'none'
        || value === 'data'
        || value === 'primary'
        || value === 'secondary'
        || value === 'dataContrast'
        || value === 'background'
    },
  }

  const failProperty = Object.keys(data).find((columnName: string) => {
    // 有定義規則
    if (rules[columnName as keyof T]) {
      const rule: ValidatorRuleToBeTypes | ValidatorRuleToBe | ValidatorRuleToBeOption = rules[columnName as keyof T]
      const value = data[columnName as keyof T]
      // 測試 "toBeTypes"
      if ((rule as ValidatorRuleToBeTypes).toBeTypes) {
        const toBeTypes = (rule as ValidatorRuleToBeTypes).toBeTypes
        const isCorrect = toBeTypes.some((toBeType) => testType[toBeType](value))
        if (isCorrect === false) {
          return true
        }
      }
      // 測試 "toBe"
      else if ((rule as ValidatorRuleToBe).toBe) {
        const { toBe, test } = rule as ValidatorRuleToBe
        const isCorrect = test(value)
        if (isCorrect === false) {
          return true
        }
      }
      // 測試 "toBeOption"
      else if ((rule as ValidatorRuleToBeOption).toBeOption) {
        const toBeOption = (rule as ValidatorRuleToBeOption).toBeOption
        const isCorrect = testOption[toBeOption](value)
        if (isCorrect === false) {
          return true
        }
      }
    }
    return false
  })

  return failProperty
}

export function validateObject<T> (data: T, rules: Partial<ValidatorRule<T>>): ValidatorResult {
  // if (data === undefined || data === null) {
  //   // orbcharts所有的options都是允許空值的
  //   return {
  //     status: 'success',
  //     columnName: '',
  //     expectToBe: '',
  //   }
  // }
  const invalidProperty = getInvalidProperty(data, rules)
  if (invalidProperty) {
    const rule = rules[invalidProperty as keyof T]
    const expectToBe = (rule as ValidatorRuleToBeTypes).toBeTypes
      ? (rule as ValidatorRuleToBeTypes).toBeTypes.join(' | ')
      : (rule as ValidatorRuleToBe).toBe
        ? (rule as ValidatorRuleToBe).toBe
        : (rule as ValidatorRuleToBeOption).toBeOption
          ? (rule as ValidatorRuleToBeOption).toBeOption
          : ''

    return {
      status: 'error',
      // message: createValidatorErrorMessage({
      //   columnName: failProperty,
      //   expect,
      //   from
      // })
      columnName: invalidProperty as string,
      expectToBe: expectToBe,
    }
  } else {
    return {
      status: 'success',
      columnName: '',
      expectToBe: '',
    }
  }
}