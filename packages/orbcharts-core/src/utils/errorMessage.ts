
export function createMessagePrefix (status: 'warning' | 'error'): string {
  return `[OrbCharts ${status}]:`
}

// 未預期的錯誤
export function createUnexpectedErrorMessage ({ at, systemMessage }: {
  at: string // 
  systemMessage: string // catch 給的的原生錯誤訊息
}): string {
  return `${createMessagePrefix('error')} unexpected error at '${at}':
${systemMessage}`
}

// validator 的 error 訊息
export function createValidatorErrorMessage ({ columnName, expect, at }: {
  columnName: string // e.g. 'seriesLabels'
  expect: string // e.g. 'string[]'
  at: string // e.g. Chart.chartParams$, Pie.params$
}): string {
  return `${createMessagePrefix('error')} Invalid value: '${columnName}' must be '${expect}' 
    at '${at}'`
}

// validator 的 warning 訊息
export function createValidatorWarningMessage ({ columnName, expect, at }: {
  columnName: string // e.g. 'seriesLabels'
  expect: string // e.g. 'string[]'
  at: string // e.g. Chart.chartParams$, Pie.params$
}): string {
  return `${createMessagePrefix('warning')} Value is not correct: '${columnName}' suppose to be '${expect}', it may cause unexpected errors.' 
    at '${at}'`
}