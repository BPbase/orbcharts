import type { RawData, RawDataColumn, Encoding, ModelDataSeries, ModelDatumSeries, Theme } from '../types'
import { aggregate } from '../utils/aggregateUtils'
import { getColorByFrom } from '../utils/colorUtils'

export const createSeriesData = (rawData: RawData, encoding: Encoding, theme: Theme): ModelDataSeries[] => {
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
    // original 排序：依照原始資料中 dataset 名稱出現的順序
    const datasetOrder: string[] = []
    rawData.forEach((d) => {
      const datasetKey = (d as any)[encoding.dataset.from] || 'default'
      if (!datasetOrder.includes(datasetKey)) {
        datasetOrder.push(datasetKey)
      }
    })
    sortedDatasetNames = datasetOrder
  } else if (encoding.dataset.sort === 'alphabetical') {
    // alphabetical 排序：依照字母順序
    sortedDatasetNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }

  // 對每個 dataset 進行 series 資料的處理
  const result: ModelDataSeries[] = []
  sortedDatasetNames.forEach((datasetName, datasetIndex) => {
    const data = datasetMap.get(datasetName)!
    
    // 依據 series 欄位將資料分組
    const seriesMap = new Map<string, RawDataColumn[]>()
    data.forEach((d) => {
      const seriesKey = (d as any)[encoding.series.from] || 'default'
      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, [])
      }
      seriesMap.get(seriesKey)!.push(d)
    })

    // 建立排序後的類別名稱陣列
    let sortedCategoryNames: string[] = Array.from(seriesMap.keys())
    if (Array.isArray(encoding.series.sort)) {
      sortedCategoryNames = encoding.series.sort.filter(name => seriesMap.has(name))
        .concat(sortedCategoryNames.filter(name => !encoding.series.sort.includes(name)))
    } else if (encoding.series.sort === 'original') {
      // original 排序：依照原始資料中 series 名稱出現的順序
      const seriesOrder: string[] = []
      data.forEach((d) => {
        const seriesKey = (d as any)[encoding.series.from] || 'default'
        if (!seriesOrder.includes(seriesKey)) {
          seriesOrder.push(seriesKey)
        }
      })
      sortedCategoryNames = seriesOrder
    } else if (encoding.series.sort === 'alphabetical') {
      // alphabetical 排序：依照字母順序
      sortedCategoryNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    }

    // 依據排序後的類別名稱來建立最終的資料結構
    const seriesData: ModelDatumSeries[][] = []
    sortedCategoryNames.forEach((seriesName, seriesIndex) => {
      const items = seriesMap.get(seriesName)!
      
      if (encoding.value.aggregate === 'none') {
        // 不聚合，保持原始資料結構
        let modelData: ModelDatumSeries[] = items.map((d, index) => {
          const value = (d as any)[encoding.value.from]
          return {
            id: d.id || `${datasetName}-${seriesName}-${index}`,
            index,
            name: d.name || '',
            data: d.data,
            value: typeof value === 'number' ? value : null,
            color: getColorByFrom(encoding.color.from, { 
              index, 
              seriesIndex,
              datasetIndex
            }, theme),
            series: seriesName,
            seriesIndex,
          }
        })
        
        // 根據 value.sort 進行排序
        if (encoding.value.sort === 'asc') {
          modelData.sort((a, b) => {
            if (a.value === null && b.value === null) return 0
            if (a.value === null) return 1
            if (b.value === null) return -1
            return a.value - b.value
          })
        } else if (encoding.value.sort === 'desc') {
          modelData.sort((a, b) => {
            if (a.value === null && b.value === null) return 0
            if (a.value === null) return 1
            if (b.value === null) return -1
            return b.value - a.value
          })
        }
        // 'original' 不需要額外排序，保持原始順序
        
        // 重新設定 index（排序後索引可能改變）
        modelData = modelData.map((d, newIndex) => ({
          ...d,
          index: newIndex
        }))
        
        seriesData.push(modelData)
      } else {
        // 進行聚合，將相同 dataset 和 series 的資料合併為一筆
        const values: (number | null)[] = items.map(d => {
          if (encoding.value.aggregate === 'count') {
            return 1 // count 聚合時每筆資料計為 1
          }
          const value = (d as any)[encoding.value.from]
          return typeof value === 'number' ? value : null
        })
        
        const aggregatedValue = aggregate(values, encoding.value.aggregate)
        
        // 合併其他欄位（使用第一筆資料的值）
        const firstItem = items[0]
        const modelData: ModelDatumSeries[] = [{
          id: firstItem.id || `${datasetName}-${seriesName}-aggregated`,
          index: 0,
          name: firstItem.name || seriesName,
          data: firstItem.data,
          value: aggregatedValue,
          color: getColorByFrom(encoding.color.from, { 
            index: 0, 
            seriesIndex,
            datasetIndex
          }, theme),
          series: seriesName,
          seriesIndex,
        }]
        seriesData.push(modelData)
      }
    })

    result.push(seriesData)
  })

  return result
}
