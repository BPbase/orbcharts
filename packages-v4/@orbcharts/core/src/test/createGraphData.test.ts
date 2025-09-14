import { createGraphData } from '../chart/createGraphData'
import type { RawDataColumn, Encoding, Theme } from '../types'

// 測試資料：包含 nodes 和 edges
const testRawData: RawDataColumn[] = [
  // Nodes
  { id: 'node1', name: 'Node 1', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 10 },
  { id: 'node2', name: 'Node 2', dataset: 'dataset1', series: 'series1', category: 'cat2', value: 20 },
  { id: 'node3', name: 'Node 3', dataset: 'dataset1', series: 'series2', category: 'cat1', value: 15 },
  { id: 'node4', name: 'Node 4', dataset: 'dataset1', series: 'series2', category: 'cat2', value: 25 },
  
  // Edges
  { id: 'edge1', name: 'Edge 1', source: 'node1', target: 'node2', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 5 },
  { id: 'edge2', name: 'Edge 2', source: 'node2', target: 'node3', dataset: 'dataset1', series: 'series1', category: 'cat2', value: 8 },
  { id: 'edge3', name: 'Edge 3', source: 'node3', target: 'node4', dataset: 'dataset1', series: 'series2', category: 'cat1', value: 12 },
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

// 測試基本功能
console.log('=== Test createGraphData ===')

const result = createGraphData(testRawData, testEncoding, testTheme)
console.log('Result length:', result.length)
console.log('First dataset nodes:', result[0]?.nodes.length)
console.log('First dataset edges:', result[0]?.edges.length)

// 檢查 nodes 結構
console.log('\n=== Nodes Structure ===')
result[0]?.nodes.forEach((node, i) => {
  console.log(`Node ${i}:`, {
    id: node.id,
    name: node.name,
    series: node.series,
    category: node.category,
    value: node.value,
    index: node.index
  })
})

// 檢查 edges 結構
console.log('\n=== Edges Structure ===')
result[0]?.edges.forEach((edge, i) => {
  console.log(`Edge ${i}:`, {
    id: edge.id,
    name: edge.name,
    source: edge.source,
    target: edge.target,
    sourceIndex: edge.sourceIndex,
    targetIndex: edge.targetIndex,
    value: edge.value
  })
})

// 測試聚合功能
console.log('\n=== Test Aggregation ===')
const aggregateEncoding: Encoding = {
  ...testEncoding,
  value: { from: 'value', sort: 'original', aggregate: 'sum' }
}

const aggregatedResult = createGraphData(testRawData, aggregateEncoding, testTheme)
console.log('Aggregated nodes count:', aggregatedResult[0]?.nodes.length)
console.log('Aggregated edges count:', aggregatedResult[0]?.edges.length)

console.log('\nAggregated nodes:')
aggregatedResult[0]?.nodes.forEach((node, i) => {
  console.log(`Node ${i}:`, {
    id: node.id,
    name: node.name,
    series: node.series,
    category: node.category,
    value: node.value
  })
})
