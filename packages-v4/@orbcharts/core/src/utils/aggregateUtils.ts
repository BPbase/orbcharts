/**
 * 聚合函數工具集
 * 用於處理數值陣列的各種聚合運算
 */

export type AggregateType = 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count' | 'none'

/**
 * 計算數值陣列的總和
 */
export function sum(values: (number | null)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null && !isNaN(v))
  if (validValues.length === 0) return null
  return validValues.reduce((acc, val) => acc + val, 0)
}

/**
 * 計算數值陣列的平均值
 */
export function mean(values: (number | null)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null && !isNaN(v))
  if (validValues.length === 0) return null
  const total = validValues.reduce((acc, val) => acc + val, 0)
  return total / validValues.length
}

/**
 * 計算數值陣列的中位數
 */
export function median(values: (number | null)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null && !isNaN(v))
  if (validValues.length === 0) return null
  
  const sorted = [...validValues].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  } else {
    return sorted[mid]
  }
}

/**
 * 計算數值陣列的最小值
 */
export function min(values: (number | null)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null && !isNaN(v))
  if (validValues.length === 0) return null
  return Math.min(...validValues)
}

/**
 * 計算數值陣列的最大值
 */
export function max(values: (number | null)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null && !isNaN(v))
  if (validValues.length === 0) return null
  return Math.max(...validValues)
}

/**
 * 計算數值陣列的有效數量
 */
export function count(values: (number | null)[]): number {
  return values.filter((v): v is number => v !== null && !isNaN(v)).length
}

/**
 * 不進行聚合，返回第一個有效值
 */
export function none(values: (number | null)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null && !isNaN(v))
  return validValues.length > 0 ? validValues[0] : null
}

/**
 * 根據聚合類型執行對應的聚合函數
 */
export function aggregate(values: (number | null)[], type: AggregateType): number | null {
  switch (type) {
    case 'sum':
      return sum(values)
    case 'mean':
      return mean(values)
    case 'median':
      return median(values)
    case 'min':
      return min(values)
    case 'max':
      return max(values)
    case 'count':
      return count(values)
    case 'none':
      return none(values)
    default:
      throw new Error(`Unknown aggregate type: ${type}`)
  }
}
