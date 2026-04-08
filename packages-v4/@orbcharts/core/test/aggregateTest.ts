import { aggregate, sum, mean, median, min, max, count, none } from '../src/utils/aggregateUtils'

// 測試資料
const testValues = [1, 2, 3, 4, 5, null, 6]
const emptyValues: (number | null)[] = [null, null]
const mixedValues = [10, null, 20, 30, null]

console.log('=== 聚合函數測試 ===')

console.log('測試資料:', testValues)
console.log('sum:', sum(testValues)) // 應該是 21
console.log('mean:', mean(testValues)) // 應該是 3.5
console.log('median:', median(testValues)) // 應該是 3.5
console.log('min:', min(testValues)) // 應該是 1
console.log('max:', max(testValues)) // 應該是 6
console.log('count:', count(testValues)) // 應該是 6
console.log('none:', none(testValues)) // 應該是 1

console.log('\n空值測試:', emptyValues)
console.log('sum:', sum(emptyValues)) // 應該是 null
console.log('mean:', mean(emptyValues)) // 應該是 null
console.log('count:', count(emptyValues)) // 應該是 0

console.log('\n混合值測試:', mixedValues)
console.log('sum:', sum(mixedValues)) // 應該是 60
console.log('mean:', mean(mixedValues)) // 應該是 20
console.log('count:', count(mixedValues)) // 應該是 3

console.log('\n使用 aggregate 函數:')
console.log('aggregate(testValues, "sum"):', aggregate(testValues, 'sum'))
console.log('aggregate(testValues, "mean"):', aggregate(testValues, 'mean'))
console.log('aggregate(testValues, "count"):', aggregate(testValues, 'count'))
