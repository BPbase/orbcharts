import type { RawData, RawDataColumn, Encoding, ModelDataTree, ModelDatumTree, Theme } from '../types'
import { aggregate } from '../utils/aggregateUtils'
import { getColorByFrom } from '../utils/colorUtils'

export const createTreeData = (rawData: RawData, encoding: Encoding, theme: Theme): ModelDataTree[] => {
  // 依據 dataset 欄位將資料分組
  const datasetMap = new Map<string, RawDataColumn[]>()
  
  // 判斷是一維陣列還是二維陣列
  const is2DArray = Array.isArray(rawData[0])
  
  if (is2DArray) {
    // 二維陣列：每個子陣列代表一個 dataset
    (rawData as RawDataColumn[][]).forEach((datasetArray, datasetIndex) => {
      datasetArray.forEach((d) => {
        const datasetKey = (d as any)[encoding.dataset.from] || `dataset-${datasetIndex}`
        if (!datasetMap.has(datasetKey)) {
          datasetMap.set(datasetKey, [])
        }
        datasetMap.get(datasetKey)!.push(d)
      })
    })
  } else {
    // 一維陣列：依據 dataset 欄位分組
    (rawData as RawDataColumn[]).forEach((d) => {
      const datasetKey = (d as any)[encoding.dataset.from] || 'default'
      if (!datasetMap.has(datasetKey)) {
        datasetMap.set(datasetKey, [])
      }
      datasetMap.get(datasetKey)!.push(d)
    })
  }

  // 建立排序後的 dataset 名稱陣列
  let sortedDatasetNames: string[] = Array.from(datasetMap.keys())
  if (Array.isArray(encoding.dataset.sort)) {
    sortedDatasetNames = encoding.dataset.sort.filter(name => datasetMap.has(name))
      .concat(sortedDatasetNames.filter(name => !encoding.dataset.sort.includes(name)))
  } else if (encoding.dataset.sort === 'original') {
    const datasetOrder: string[] = []
    if (is2DArray) {
      (rawData as RawDataColumn[][]).forEach((datasetArray, datasetIndex) => {
        datasetArray.forEach((d) => {
          const datasetKey = (d as any)[encoding.dataset.from] || `dataset-${datasetIndex}`
          if (!datasetOrder.includes(datasetKey)) {
            datasetOrder.push(datasetKey)
          }
        })
      })
    } else {
      (rawData as RawDataColumn[]).forEach((d) => {
        const datasetKey = (d as any)[encoding.dataset.from] || 'default'
        if (!datasetOrder.includes(datasetKey)) {
          datasetOrder.push(datasetKey)
        }
      })
    }
    sortedDatasetNames = datasetOrder
  } else if (encoding.dataset.sort === 'alphabetical') {
    sortedDatasetNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }

  // 對每個 dataset 進行 tree 資料的處理
  const result: ModelDataTree[] = []
  sortedDatasetNames.forEach((datasetName, datasetIndex) => {
    const data = datasetMap.get(datasetName)!
    
    // 建立 dataset 內排序後的 series 名稱陣列（僅作為屬性與色彩來源，不做拆樹）
    const seriesMap = new Map<string, RawDataColumn[]>()
    data.forEach((d) => {
      const seriesKey = (d as any)[encoding.series.from] || 'default'
      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, [])
      }
      seriesMap.get(seriesKey)!.push(d)
    })
    let sortedSeriesNames: string[] = Array.from(seriesMap.keys())
    if (Array.isArray(encoding.series.sort)) {
      sortedSeriesNames = encoding.series.sort.filter(name => seriesMap.has(name))
        .concat(sortedSeriesNames.filter(name => !encoding.series.sort.includes(name)))
    } else if (encoding.series.sort === 'original') {
      const seriesOrder: string[] = []
      data.forEach((d) => {
        const seriesKey = (d as any)[encoding.series.from] || 'default'
        if (!seriesOrder.includes(seriesKey)) {
          seriesOrder.push(seriesKey)
        }
      })
      sortedSeriesNames = seriesOrder
    } else if (encoding.series.sort === 'alphabetical') {
      sortedSeriesNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    }

    // 建立 dataset 內排序後的 category 名稱陣列（僅作為屬性與色彩來源，不做拆樹）
    const categoryMap = new Map<string, RawDataColumn[]>()
    data.forEach((d) => {
      const categoryKey = (d as any)[encoding.category.from] || 'default'
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, [])
      }
      categoryMap.get(categoryKey)!.push(d)
    })
    let sortedCategoryNames: string[] = Array.from(categoryMap.keys())
    if (Array.isArray(encoding.category.sort)) {
      sortedCategoryNames = encoding.category.sort.filter(name => categoryMap.has(name))
        .concat(sortedCategoryNames.filter(name => !encoding.category.sort.includes(name)))
    } else if (encoding.category.sort === 'original') {
      const categoryOrder: string[] = []
      data.forEach((d) => {
        const categoryKey = (d as any)[encoding.category.from] || 'default'
        if (!categoryOrder.includes(categoryKey)) {
          categoryOrder.push(categoryKey)
        }
      })
      sortedCategoryNames = categoryOrder
    } else if (encoding.category.sort === 'alphabetical') {
      sortedCategoryNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    }

    // 收集所有節點並依據 id 進行聚合（同一 dataset 內）
    const nodeMap = new Map<string, RawDataColumn[]>()
    data.forEach((d) => {
      const nodeId = d.id || 'unknown'
      if (!nodeMap.has(nodeId)) {
        nodeMap.set(nodeId, [])
      }
      nodeMap.get(nodeId)!.push(d)
    })

    let globalNodeIndex = 0
    const defaultSeriesName = sortedSeriesNames[0] || 'default'
    const defaultSeriesIndex = sortedSeriesNames.indexOf(defaultSeriesName)

    // 為每個 id 建立 ModelDatumTree，並進行聚合
    const treeNodeMap = new Map<string, ModelDatumTree>()
    
    Array.from(nodeMap.entries()).forEach(([nodeId, nodeItems]) => {
      const firstItem = nodeItems[0]
      const seriesName = (firstItem as any)[encoding.series.from] || 'default'
      const seriesIndex = sortedSeriesNames.indexOf(seriesName)
      const categoryName = (firstItem as any)[encoding.category.from] || 'default'
      const categoryIndex = sortedCategoryNames.indexOf(categoryName)
        
      if (encoding.value.aggregate === 'none') {
        // 不聚合，使用第一筆資料
        const value = (firstItem as any)[encoding.value.from]
        const treeNode: ModelDatumTree = {
          id: nodeId,
          index: globalNodeIndex++,
          modelType: 'tree',
          name: firstItem.name || nodeId,
          data: firstItem.data,
          value: typeof value === 'number' ? value : null,
          color: getColorByFrom(encoding.color.from, {
            index: globalNodeIndex - 1,
            seriesIndex,
            categoryIndex,
            datasetIndex
          }, theme),
          parent: firstItem.parent || null,
          parentIndex: null, // 稍後設定
          depth: 0, // 稍後計算
          seq: 0, // 稍後計算
          children: [],
          series: seriesName,
          seriesIndex,
          category: categoryName,
          categoryIndex,
        }
        treeNodeMap.set(nodeId, treeNode)
      } else {
        // 進行聚合，將相同 dataset, id 的資料合併
        const values: (number | null)[] = nodeItems.map(d => {
          if (encoding.value.aggregate === 'count') {
            return 1 // count 聚合時每筆資料計為 1
          }
          const value = (d as any)[encoding.value.from]
          return typeof value === 'number' ? value : null
        })

        const aggregatedValue = aggregate(values, encoding.value.aggregate)

        const treeNode: ModelDatumTree = {
          id: nodeId,
          index: globalNodeIndex++,
          modelType: 'tree',
          name: firstItem.name || nodeId,
          data: firstItem.data,
          value: aggregatedValue,
          color: getColorByFrom(encoding.color.from, {
            index: globalNodeIndex - 1,
            seriesIndex,
            categoryIndex,
            datasetIndex
          }, theme),
          parent: firstItem.parent || null,
          parentIndex: null, // 稍後設定
          depth: 0, // 稍後計算
          seq: 0, // 稍後計算
          children: [],
          series: seriesName,
          seriesIndex,
          category: categoryName,
          categoryIndex,
        }
        treeNodeMap.set(nodeId, treeNode)
      }
    })

    // 建立樹狀結構
    const allNodes = Array.from(treeNodeMap.values())
    const nodeIndexMap = new Map<string, number>()
    allNodes.forEach(node => {
      nodeIndexMap.set(node.id, node.index)
    })

    // 設定 parentIndex
    allNodes.forEach(node => {
      if (node.parent && nodeIndexMap.has(node.parent)) {
        node.parentIndex = nodeIndexMap.get(node.parent)!
      }
    })

    // 建立父子關係
    const rootNodes: ModelDatumTree[] = []
    const childrenMap = new Map<string, ModelDatumTree[]>()
    
    allNodes.forEach(node => {
      if (node.parent === null) {
        rootNodes.push(node)
      } else {
        if (!childrenMap.has(node.parent)) {
          childrenMap.set(node.parent, [])
        }
        childrenMap.get(node.parent)!.push(node)
      }
    })

    // 遞迴建立完整樹狀結構並計算 depth 和 seq
    function buildTree(node: ModelDatumTree, depth: number): ModelDatumTree {
      node.depth = depth
      const children = childrenMap.get(node.id) || []
      
      // 根據 value.sort 對子節點進行排序
      if (encoding.value.sort === 'asc') {
        children.sort((a, b) => {
          if (a.value === null && b.value === null) return 0
          if (a.value === null) return 1
          if (b.value === null) return -1
          return a.value - b.value
        })
      } else if (encoding.value.sort === 'desc') {
        children.sort((a, b) => {
          if (a.value === null && b.value === null) return 0
          if (a.value === null) return 1
          if (b.value === null) return -1
          return b.value - a.value
        })
      }
      // 'original' 不需要額外排序，保持原始順序
      
      // 設定 seq
      children.forEach((child, index) => {
        child.seq = index
      })
      
      // 遞迴處理子節點
      node.children = children.map(child => buildTree(child, depth + 1))
      
      return node
    }

    // 建立完整的樹
    const trees = rootNodes.map(root => buildTree(root, 0))
    
    // 如果有多個根節點，建立一個虛擬根節點
    if (trees.length === 0) {
      // 沒有資料，建立空樹
      result.push({
        id: `empty-${datasetName}`,
        index: globalNodeIndex++,
        modelType: 'tree',
        name: 'Empty Tree',
        data: {},
        value: null,
        color: getColorByFrom(encoding.color.from, {
          index: globalNodeIndex - 1,
          seriesIndex: defaultSeriesIndex < 0 ? 0 : defaultSeriesIndex,
          categoryIndex: 0,
          datasetIndex
        }, theme),
        parent: null,
        parentIndex: null,
        depth: 0,
        seq: 0,
        children: [],
        series: defaultSeriesName,
        seriesIndex: defaultSeriesIndex < 0 ? 0 : defaultSeriesIndex,
        category: 'default',
        categoryIndex: 0,
      })
    } else if (trees.length === 1) {
      // 單一根節點
      result.push(trees[0])
    } else {
      const virtualRoot: ModelDatumTree = {
        id: `virtual-root-${datasetName}`,
        index: globalNodeIndex++,
        modelType: 'tree',
        name: `Virtual Root (${datasetName})`,
        data: {},
        value: null,
        color: getColorByFrom(encoding.color.from, {
          index: globalNodeIndex - 1,
          seriesIndex: defaultSeriesIndex < 0 ? 0 : defaultSeriesIndex,
          categoryIndex: 0,
          datasetIndex
        }, theme),
        parent: null,
        parentIndex: null,
        depth: 0,
        seq: 0,
        children: trees.map((tree, index) => {
          const updateDepth = (node: ModelDatumTree, newDepth: number): ModelDatumTree => {
            node.depth = newDepth
            if (newDepth === 1) {
              node.seq = index
            }
            node.children = node.children.map(child => updateDepth(child, newDepth + 1))
            return node
          }
          return updateDepth(tree, 1)
        }),
        series: defaultSeriesName,
        seriesIndex: defaultSeriesIndex < 0 ? 0 : defaultSeriesIndex,
        category: 'default',
        categoryIndex: 0,
      }
      result.push(virtualRoot)
    }
  })

  return result
}
