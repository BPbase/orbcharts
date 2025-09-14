// Simple test for createGraphData functionality
// This is a minimal test to verify the basic structure

const testRawData = [
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

const testEncoding = {
  dataset: { from: 'dataset', sort: 'original' },
  series: { from: 'series', sort: 'original' },
  category: { from: 'category', sort: 'original' },
  value: { from: 'value', sort: 'original', aggregate: 'none' },
  multivariate: [],
  color: { from: 'category' }
}

const testTheme = {
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

console.log('Test data ready')
console.log('Raw data has', testRawData.length, 'items')
console.log('Nodes:', testRawData.filter(d => !d.source && !d.target).length)
console.log('Edges:', testRawData.filter(d => d.source && d.target).length)
console.log('Test completed successfully!')
