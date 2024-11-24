import type {
  ValidatorResult,
  ToBeTypes,
  ToBeOption,
  ValidatorRuleToBeTypes,
  ValidatorRuleToBe,
  ValidatorRuleToBeOption,
  ValidatorRule
} from '../../lib/core-types'
import { isFunction, isPlainObject } from './commonUtils'
import { createValidatorErrorMessage } from './errorMessage'



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

function getInvalidColumn<T> (data: T, rules: Partial<ValidatorRule<T>>) {
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
    ColorType: (value: any) => {
      return value === 'none'
        || value === 'series'
        || value === 'primary'
        || value === 'secondary'
        || value === 'white'
        || value === 'background'
    }
  }

  const failColumn = Object.keys(data).find((columnName: string) => {
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

  return failColumn
}

export function validateColumns<T> (data: T, rules: Partial<ValidatorRule<T>>): ValidatorResult {
  // if (data === undefined || data === null) {
  //   // orbcharts所有的options都是允許空值的
  //   return {
  //     status: 'success',
  //     columnName: '',
  //     expectToBe: '',
  //   }
  // }
  const invalidColumn = getInvalidColumn(data, rules)
  if (invalidColumn) {
    const rule = rules[invalidColumn as keyof T]
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
      //   columnName: failColumn,
      //   expect,
      //   from
      // })
      columnName: invalidColumn as string,
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