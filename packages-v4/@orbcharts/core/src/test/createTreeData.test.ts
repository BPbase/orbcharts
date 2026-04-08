import { createTreeData } from '../chart/createTreeData'
import type { RawDataColumn, Encoding, Theme } from '../types'

// 測試資料：樹狀結構
const testRawData: RawDataColumn[] = [
  // 根節點
  { id: 'root', name: 'Root Node', parent: null, dataset: 'dataset1', series: 'series1', category: 'cat1', value: 100 },
  
  // 第一層子節點
  { id: 'child1', name: 'Child 1', parent: 'root', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 40 },
  { id: 'child2', name: 'Child 2', parent: 'root', dataset: 'dataset1', series: 'series1', category: 'cat2', value: 60 },
  
  // 第二層子節點
  { id: 'grandchild1', name: 'Grandchild 1', parent: 'child1', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 20 },
  { id: 'grandchild2', name: 'Grandchild 2', parent: 'child1', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 20 },
  { id: 'grandchild3', name: 'Grandchild 3', parent: 'child2', dataset: 'dataset1', series: 'series1', category: 'cat2', value: 30 },
  { id: 'grandchild4', name: 'Grandchild 4', parent: 'child2', dataset: 'dataset1', series: 'series1', category: 'cat2', value: 30 },
  
  // 第二個 series 的資料
  { id: 'root2', name: 'Root Node 2', parent: null, dataset: 'dataset1', series: 'series2', category: 'cat1', value: 80 },
  { id: 'child3', name: 'Child 3', parent: 'root2', dataset: 'dataset1', series: 'series2', category: 'cat1', value: 80 },
]

const testEncoding: Encoding = {
  dataset: { from: 'dataset', sort: 'original' },
  series: { from: 'series', sort: 'original' },
  category: { from: 'category', sort: 'original' },
  value: { from: 'value', sort: 'original', aggregate: 'none' },
  multivariate: [],
  color: { from: 'category' }
}

const testTheme: Theme = {
  colorScheme: 'light',
  colors: {
    light: {
      data: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      primary: '#000000',
      secondary: '#666666',
      dataContrast: ['#ffffff', '#000000'],
      background: '#ffffff'
    },
    dark: {
      data: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      primary: '#ffffff',
      secondary: '#999999',
      dataContrast: ['#000000', '#ffffff'],
      background: '#000000'
    }
  },
  fontSize: 12
}

// 遞迴列印樹狀結構的函數
function printTree(node: any, indent: string = ''): void {
  console.log(`${indent}${node.name} (id: ${node.id}, depth: ${node.depth}, seq: ${node.seq}, value: ${node.value}, parent: ${node.parent})`)
  if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => {
      printTree(child, indent + '  ')
    })
  }
}

// 測試基本功能
console.log('=== Test createTreeData ===')

const result = createTreeData(testRawData, testEncoding, testTheme)
console.log('Result length:', result.length)

// 列印每個樹的結構
result.forEach((tree, index) => {
  console.log(`\n=== Tree ${index + 1} (Series: ${tree.series}) ===`)
  printTree(tree)
})

// 測試聚合功能
console.log('\n=== Test Aggregation ===')

// 建立有重複 id 的測試資料
const duplicateRawData: RawDataColumn[] = [
  { id: 'root', name: 'Root Node', parent: null, dataset: 'dataset1', series: 'series1', category: 'cat1', value: 50 },
  { id: 'root', name: 'Root Node', parent: null, dataset: 'dataset1', series: 'series1', category: 'cat1', value: 50 }, // 重複
  { id: 'child1', name: 'Child 1', parent: 'root', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 20 },
  { id: 'child1', name: 'Child 1', parent: 'root', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 30 }, // 重複
]

const aggregateEncoding: Encoding = {
  ...testEncoding,
  value: { from: 'value', sort: 'original', aggregate: 'sum' }
}

const aggregatedResult = createTreeData(duplicateRawData, aggregateEncoding, testTheme)
console.log('\nAggregated tree:')
aggregatedResult.forEach((tree, index) => {
  console.log(`\n=== Aggregated Tree ${index + 1} ===`)
  printTree(tree)
})
