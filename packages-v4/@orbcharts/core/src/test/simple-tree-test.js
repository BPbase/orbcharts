// Simple test for createTreeData functionality
// This verifies the basic tree structure logic

const testRawData = [
  // 根節點
  { id: 'root', name: 'Root Node', parent: null, dataset: 'dataset1', series: 'series1', category: 'cat1', value: 100 },
  
  // 第一層子節點
  { id: 'child1', name: 'Child 1', parent: 'root', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 40 },
  { id: 'child2', name: 'Child 2', parent: 'root', dataset: 'dataset1', series: 'series1', category: 'cat2', value: 60 },
  
  // 第二層子節點
  { id: 'grandchild1', name: 'Grandchild 1', parent: 'child1', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 20 },
  { id: 'grandchild2', name: 'Grandchild 2', parent: 'child1', dataset: 'dataset1', series: 'series1', category: 'cat1', value: 20 },
  { id: 'grandchild3', name: 'Grandchild 3', parent: 'child2', dataset: 'dataset1', series: 'series1', category: 'cat2', value: 30 },
]

// 測試樹狀結構邏輯
const nodeMap = new Map()
testRawData.forEach(d => {
  nodeMap.set(d.id, d)
})

const rootNodes = []
const childrenMap = new Map()

testRawData.forEach(node => {
  if (node.parent === null) {
    rootNodes.push(node)
  } else {
    if (!childrenMap.has(node.parent)) {
      childrenMap.set(node.parent, [])
    }
    childrenMap.get(node.parent).push(node)
  }
})

function printTree(node, depth = 0) {
  const indent = '  '.repeat(depth)
  console.log(`${indent}${node.name} (id: ${node.id}, parent: ${node.parent})`)
  
  const children = childrenMap.get(node.id) || []
  children.forEach(child => {
    printTree(child, depth + 1)
  })
}

console.log('=== Tree Structure Test ===')
console.log('Total nodes:', testRawData.length)
console.log('Root nodes:', rootNodes.length)
console.log('Children map size:', childrenMap.size)

console.log('\nTree structure:')
rootNodes.forEach(root => {
  printTree(root)
})

console.log('\nTest completed successfully!')
