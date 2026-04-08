// message的prefix - error: 有中斷，warning: 無中斷
export function createMessagePrefix (status: 'warning' | 'error'): string {
  return `[OrbCharts ${status}]:`
}

// throw到最外層的錯誤訊息
export function createOrbChartsErrorMessage (e: Error): string {
  return `${createMessagePrefix('error')} ${e.message}`
}


// 未預期的錯誤
export function createUnexpectedErrorMessage ({ from, systemMessage }: {
  from: string // 
  systemMessage: string // catch 給的的原生錯誤訊息
}): string {
  return `unexpected error from '${from}':
${systemMessage}`
}

// validator 的 error 訊息
export function createValidatorErrorMessage ({ columnName, expectToBe, from }: {
  columnName: string // e.g. 'seriesLabels'
  expectToBe: string // e.g. 'string[]'
  from: string // e.g. Chart.chartParams$, Pie.params$
}): string {
  return `Invalid value: '${columnName}' must be '${expectToBe}'

----> find in '${from}'`
}

// validator 的 warning 訊息
export function createValidatorWarningMessage ({ columnName, expectToBe, from }: {
  columnName: string // e.g. 'seriesLabels'
  expectToBe: string // e.g. 'string[]'
  from: string // e.g. Chart.chartParams$, Pie.params$
}): string {
  return `${createMessagePrefix('warning')} Value is not correct: '${columnName}' suppose to be '${expectToBe}', it may cause unexpected errors.'
  
----> find in '${from}'`
}