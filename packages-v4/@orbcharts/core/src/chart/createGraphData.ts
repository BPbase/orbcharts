import type { RawData, RawDataColumn, Encoding, ModelDataGraph, ModelDatumGraphNode, ModelDatumGraphEdge, Theme } from '../types'
import { aggregate } from '../utils/aggregateUtils'
import { getColorByFrom } from '../utils/colorUtils'

export const createGraphData = (rawData: RawData, encoding: Encoding, theme: Theme): ModelDataGraph[] => {
  // 判斷是一維陣列還是二維陣列
  const is2DArray = Array.isArray(rawData[0])
  
  // 分離 nodes 和 edges 資料
  const nodeData: RawDataColumn[] = []
  const edgeData: RawDataColumn[] = []
  
  if (is2DArray) {
    (rawData as RawDataColumn[][]).forEach(datasetArray => {
      datasetArray.forEach(d => {
        if (d.source && d.target) {
          edgeData.push(d)
        } else {
          nodeData.push(d)
        }
      })
    })
  } else {
    (rawData as RawDataColumn[]).forEach(d => {
      if (d.source && d.target) {
        edgeData.push(d)
      } else {
        nodeData.push(d)
      }
    })
  }

  // 依據 dataset 欄位將 node 資料分組
  const datasetMap = new Map<string, RawDataColumn[]>()
  
  if (is2DArray) {
    // 二維陣列：需要追蹤每個 node 來自哪個子陣列
    (rawData as RawDataColumn[][]).forEach((datasetArray, datasetIndex) => {
      datasetArray.forEach((d) => {
        if (!d.source || !d.target) {
          const datasetKey = (d as any)[encoding.dataset.from] || `dataset-${datasetIndex}`
          if (!datasetMap.has(datasetKey)) {
            datasetMap.set(datasetKey, [])
          }
          datasetMap.get(datasetKey)!.push(d)
        }
      })
    })
  } else {
    nodeData.forEach((d) => {
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
          if (!d.source || !d.target) {
            const datasetKey = (d as any)[encoding.dataset.from] || `dataset-${datasetIndex}`
            if (!datasetOrder.includes(datasetKey)) {
              datasetOrder.push(datasetKey)
            }
          }
        })
      })
    } else {
      nodeData.forEach((d) => {
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

  // 對每個 dataset 進行 graph 資料的處理
  const result: ModelDataGraph[] = []
  sortedDatasetNames.forEach((datasetName, datasetIndex) => {
    const data = datasetMap.get(datasetName)!
    
    // 建立 nodes
    const nodes: ModelDatumGraphNode[] = []
    
    // 依據 series 欄位將資料分組
    const seriesMap = new Map<string, RawDataColumn[]>()
    data.forEach((d) => {
      const seriesKey = (d as any)[encoding.series.from] || 'default'
      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, [])
      }
      seriesMap.get(seriesKey)!.push(d)
    })

    // 建立排序後的系列名稱陣列
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

    // 依據排序後的系列名稱來建立 nodes
    sortedSeriesNames.forEach((seriesName, seriesIndex) => {
      const seriesItems = seriesMap.get(seriesName)!
      
      // 依據 category 欄位將 series 內的資料分組
      const categoryMap = new Map<string, RawDataColumn[]>()
      seriesItems.forEach((d) => {
        const categoryKey = (d as any)[encoding.category.from] || 'default'
        if (!categoryMap.has(categoryKey)) {
          categoryMap.set(categoryKey, [])
        }
        categoryMap.get(categoryKey)!.push(d)
      })

      // 建立排序後的類別名稱陣列
      let sortedCategoryNames: string[] = Array.from(categoryMap.keys())
      if (Array.isArray(encoding.category.sort)) {
        sortedCategoryNames = encoding.category.sort.filter(name => categoryMap.has(name))
          .concat(sortedCategoryNames.filter(name => !encoding.category.sort.includes(name)))
      } else if (encoding.category.sort === 'original') {
        const categoryOrder: string[] = []
        seriesItems.forEach((d) => {
          const categoryKey = (d as any)[encoding.category.from] || 'default'
          if (!categoryOrder.includes(categoryKey)) {
            categoryOrder.push(categoryKey)
          }
        })
        sortedCategoryNames = categoryOrder
      } else if (encoding.category.sort === 'alphabetical') {
        sortedCategoryNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      }

      // 處理每個 category
      sortedCategoryNames.forEach((categoryName, categoryIndex) => {
        const categoryItems = categoryMap.get(categoryName)!
        
        if (encoding.value.aggregate === 'none') {
          // 不聚合，保持原始資料結構
          let modelNodes: ModelDatumGraphNode[] = categoryItems.map((d, index) => {
            const value = (d as any)[encoding.value.from]
            return {
              id: d.id || `${datasetName}-${seriesName}-${categoryName}-${index}`,
              index: nodes.length + index, // 在所有 nodes 中的索引
              modelType: 'graph',
              name: d.name || '',
              data: d.data,
              value: typeof value === 'number' ? value : null,
              color: getColorByFrom(encoding.color.from, { 
                index: categoryIndex, 
                seriesIndex,
                categoryIndex,
                datasetIndex
              }, theme),
              series: seriesName,
              seriesIndex,
              category: categoryName,
              categoryIndex,
            }
          })
          
          // 根據 value.sort 進行排序
          if (encoding.value.sort === 'asc') {
            modelNodes.sort((a, b) => {
              if (a.value === null && b.value === null) return 0
              if (a.value === null) return 1
              if (b.value === null) return -1
              return a.value - b.value
            })
          } else if (encoding.value.sort === 'desc') {
            modelNodes.sort((a, b) => {
              if (a.value === null && b.value === null) return 0
              if (a.value === null) return 1
              if (b.value === null) return -1
              return b.value - a.value
            })
          }
          
          nodes.push(...modelNodes)
        } else {
          // 進行聚合，將相同 dataset, series, category 的資料合併為一筆
          const values: (number | null)[] = categoryItems.map(d => {
            if (encoding.value.aggregate === 'count') {
              return 1 // count 聚合時每筆資料計為 1
            }
            const value = (d as any)[encoding.value.from]
            return typeof value === 'number' ? value : null
          })
          
          const aggregatedValue = aggregate(values, encoding.value.aggregate)
          
          // 合併其他欄位（使用第一筆資料的值）
          const firstItem = categoryItems[0]
          const modelNode: ModelDatumGraphNode = {
            id: firstItem.id || `${datasetName}-${seriesName}-${categoryName}-aggregated`,
            index: nodes.length, // 在所有 nodes 中的索引
            modelType: 'graph',
            name: firstItem.name || categoryName,
            data: firstItem.data,
            value: aggregatedValue,
            color: getColorByFrom(encoding.color.from, { 
              index: categoryIndex, 
              seriesIndex,
              categoryIndex,
              datasetIndex
            }, theme),
            series: seriesName,
            seriesIndex,
            category: categoryName,
            categoryIndex,
          }
          nodes.push(modelNode)
        }
      })
    })

    // 建立 edges
    const edges: ModelDatumGraphEdge[] = []
    const nodeNameToIndexMap = new Map<string, number>()
    nodes.forEach((node) => {
      // 使用原始資料的 id 或 name 作為識別鍵
      const originalData = nodeData.find(d => d.id === node.id || d.name === node.name)
      if (originalData?.id) {
        nodeNameToIndexMap.set(originalData.id, node.index)
      }
      if (originalData?.name) {
        nodeNameToIndexMap.set(originalData.name, node.index)
      }
    })

    // 依據 dataset 分組處理 edges（這裡使用所有邊的資料，但只處理目前 dataset 的邊）
    const datasetEdges = edgeData.filter(d => {
      const datasetKey = (d as any)[encoding.dataset.from] || 'default'
      return datasetKey === datasetName
    })

    // 聚合 edges 
    const edgeGroupMap = new Map<string, RawDataColumn[]>()
    datasetEdges.forEach((d) => {
      const source = d.source!
      const target = d.target!
      const series = (d as any)[encoding.series.from] || 'default'
      const category = (d as any)[encoding.category.from] || 'default'
      const groupKey = `${source}-${target}-${series}-${category}`
      
      if (!edgeGroupMap.has(groupKey)) {
        edgeGroupMap.set(groupKey, [])
      }
      edgeGroupMap.get(groupKey)!.push(d)
    })

    Array.from(edgeGroupMap.entries()).forEach(([groupKey, groupEdges], edgeIndex) => {
      const firstEdge = groupEdges[0]
      const source = firstEdge.source!
      const target = firstEdge.target!
      const sourceIndex = nodeNameToIndexMap.get(source) ?? -1
      const targetIndex = nodeNameToIndexMap.get(target) ?? -1
      
      // 只有當 source 和 target 都存在於 nodes 中時才建立 edge
      if (sourceIndex >= 0 && targetIndex >= 0) {
        if (encoding.value.aggregate === 'none') {
          // 不聚合，保持原始資料結構
          groupEdges.forEach((d, index) => {
            const value = (d as any)[encoding.value.from]
            const edge: ModelDatumGraphEdge = {
              id: d.id || `edge-${edgeIndex}-${index}`,
              index: edges.length,
              modelType: 'graph',
              name: d.name || '',
              data: d.data,
              value: typeof value === 'number' ? value : null,
              color: getColorByFrom(encoding.color.from, { 
                index: edges.length,
                seriesIndex: 0, // edges 沒有明確的 seriesIndex
                categoryIndex: 0, // edges 沒有明確的 categoryIndex
                datasetIndex
              }, theme),
              source,
              sourceIndex,
              target,
              targetIndex,
            }
            edges.push(edge)
          })
        } else {
          // 進行聚合
          const values: (number | null)[] = groupEdges.map(d => {
            if (encoding.value.aggregate === 'count') {
              return 1
            }
            const value = (d as any)[encoding.value.from]
            return typeof value === 'number' ? value : null
          })
          
          const aggregatedValue = aggregate(values, encoding.value.aggregate)
          
          const edge: ModelDatumGraphEdge = {
            id: firstEdge.id || `edge-${edgeIndex}-aggregated`,
            index: edges.length,
            modelType: 'graph',
            name: firstEdge.name || '',
            data: firstEdge.data,
            value: aggregatedValue,
            color: getColorByFrom(encoding.color.from, { 
              index: edges.length,
              seriesIndex: 0,
              categoryIndex: 0,
              datasetIndex
            }, theme),
            source,
            sourceIndex,
            target,
            targetIndex,
          }
          edges.push(edge)
        }
      }
    })

    result.push({ nodes, edges })
  })

  return result
}
