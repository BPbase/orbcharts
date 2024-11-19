import type { ValidatorResult } from '../../lib/core-types'
import { isFunction, isPlainObject } from './commonUtils'
import { createValidatorErrorMessage } from './errorMessage'

export type ToBeTypes = 'string' | 'number' | 'boolean' | 'object' | 'string[]' | 'number[]' | 'Function' | 'null' | 'undefined'

// 有使用定義好的型別則不需寫 validate
export interface ValidatorToBeTypes {
  toBeTypes: ToBeTypes[]
}

// 自訂規則
export interface ValidatorToBe {
  toBe: string
  test: (value: any) => boolean
}

export interface ValidatorRule {
  [key: string]: ValidatorToBeTypes | ValidatorToBe
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

function getInvalidColumn (data: {[key: string]: any}, rules: ValidatorRule) {
  // "toBeTypes" 的測試
  const testType: {[key in ToBeTypes]: (value: any) => boolean} = {
    string: (value: any) => typeof value === 'string',
    number: (value: any) => typeof value === 'number',
    boolean: (value: any) => typeof value === 'boolean',
    object: (value: any) => isPlainObject(value), // 嚴格判斷是否為純物件
    'string[]': (value: any) => Array.isArray(value) && value.every((v: any) => typeof v === 'string'),
    'number[]': (value: any) => Array.isArray(value) && value.every((v: any) => typeof v === 'number'),
    Function: (value: any) => isFunction(value),
    null: (value: any) => value === null,
    undefined: (value: any) => value === undefined
  }

  const failColumn = Object.keys(data).find((columnName) => {
    // 有定義規則
    if (rules[columnName]) {
      // 測試 "toBeTypes"
      if ((rules[columnName] as ValidatorToBeTypes).toBeTypes) {
        const toBeTypes = (rules[columnName] as ValidatorToBeTypes).toBeTypes
        const isCorrect = toBeTypes.some((toBeType) => testType[toBeType](data[columnName]))
        if (isCorrect === false) {
          return true
        }
      }
      // 測試 "toBe"
      else if ((rules[columnName] as ValidatorToBe).toBe) {
        const { toBe, test } = rules[columnName] as ValidatorToBe
        const isCorrect = test(data[columnName])
        if (isCorrect === false) {
          return true
        }
      }
    }
    return false
  })

  return failColumn
}

export function validator (data: {[key: string]: any}, rules: ValidatorRule, at: string): ValidatorResult {
  const invalidColumn = getInvalidColumn(data, rules) === undefined
  if (invalidColumn) {
    return {
      status: 'success',
      message: ''
    }
  } else {
    const failColumn = getInvalidColumn(data, rules)
    const expect = (rules[failColumn] as ValidatorToBeTypes).toBeTypes
      ? (rules[failColumn] as ValidatorToBeTypes).toBeTypes.join(' | ')
      : (rules[failColumn] as ValidatorToBe).toBe

    return {
      status: 'error',
      message: createValidatorErrorMessage({
        columnName: failColumn,
        expect,
        at
      })
    }
  }
}