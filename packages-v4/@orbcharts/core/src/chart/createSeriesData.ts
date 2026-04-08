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
    // alphabetical 排序：依照字母順序
    sortedDatasetNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }

  // 對每個 dataset 進行 grid 資料的處理
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

    // 建立排序後的系列名稱陣列
    let sortedSeriesNames: string[] = Array.from(seriesMap.keys())
    if (Array.isArray(encoding.series.sort)) {
      sortedSeriesNames = encoding.series.sort.filter(name => seriesMap.has(name))
        .concat(sortedSeriesNames.filter(name => !encoding.series.sort.includes(name)))
    } else if (encoding.series.sort === 'original') {
      // original 排序：依照原始資料中 series 名稱出現的順序
      const seriesOrder: string[] = []
      data.forEach((d) => {
        const seriesKey = (d as any)[encoding.series.from] || 'default'
        if (!seriesOrder.includes(seriesKey)) {
          seriesOrder.push(seriesKey)
        }
      })
      sortedSeriesNames = seriesOrder
    } else if (encoding.series.sort === 'alphabetical') {
      // alphabetical 排序：依照字母順序
      sortedSeriesNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    }

    // 在處理各 series 之前，先建立跨所有 series 的全域 category 順序與索引對應表
    // 這樣可確保相同的 category 在不同 series 中擁有相同的 categoryIndex
    const globalCategoryOrder: string[] = []
    if (encoding.category.sort === 'original') {
      // original：依照原始資料中 category 名稱出現的全域順序，不進行排序
      data.forEach((d) => {
        const categoryKey = (d as any)[encoding.category.from] || 'default'
        if (!globalCategoryOrder.includes(categoryKey)) {
          globalCategoryOrder.push(categoryKey)
        }
      })
    } else if (encoding.category.sort === 'alphabetical') {
      // alphabetical：依照字母順序排序所有 category
      const allCategoryNames = new Set<string>()
      data.forEach((d) => {
        allCategoryNames.add((d as any)[encoding.category.from] || 'default')
      })
      globalCategoryOrder.push(...Array.from(allCategoryNames).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })))
    } else if (Array.isArray(encoding.category.sort)) {
      // 自訂順序：指定的 category 優先，其餘依原始順序補上
      const allCategoryNames: string[] = []
      data.forEach((d) => {
        const categoryKey = (d as any)[encoding.category.from] || 'default'
        if (!allCategoryNames.includes(categoryKey)) {
          allCategoryNames.push(categoryKey)
        }
      })
      const sortArray = encoding.category.sort as string[]
      globalCategoryOrder.push(
        ...sortArray.filter(name => allCategoryNames.includes(name)),
        ...allCategoryNames.filter(name => !sortArray.includes(name))
      )
    }

    // 建立全域 category → categoryIndex 對應表
    const globalCategoryIndexMap = new Map<string, number>()
    globalCategoryOrder.forEach((name, index) => {
      globalCategoryIndexMap.set(name, index)
    })

    // 依據排序後的系列名稱來建立最終的資料結構
    const gridData: ModelDatumSeries[][] = []
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

      // 依據全域 category 順序篩選出此 series 含有的 category（保持全域順序）
      const sortedCategoryNames: string[] = globalCategoryOrder.filter(name => categoryMap.has(name))

      // 處理每個 category
      const seriesData: ModelDatumSeries[] = []

      if (encoding.category.sort === 'original' && encoding.value.aggregate === 'none') {
        // sort=original + 不聚合：直接依照 seriesItems 的原始排列順序，不進行分組重排
        seriesItems.forEach((d, index) => {
          const categoryName = (d as any)[encoding.category.from] || 'default'
          const categoryIndex = globalCategoryIndexMap.get(categoryName)!
          const value = (d as any)[encoding.value.from]
          seriesData.push({
            id: d.id || `${datasetName}-${seriesName}-${categoryName}-${index}`,
            index: categoryIndex, // Series 模式下 index 對應 categoryIndex
            modelType: 'series',
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
          })
        })

        // 根據 value.sort 對整個 seriesData 進行排序
        if (encoding.value.sort === 'asc') {
          seriesData.sort((a, b) => {
            if (a.value === null && b.value === null) return 0
            if (a.value === null) return 1
            if (b.value === null) return -1
            return a.value - b.value
          })
        } else if (encoding.value.sort === 'desc') {
          seriesData.sort((a, b) => {
            if (a.value === null && b.value === null) return 0
            if (a.value === null) return 1
            if (b.value === null) return -1
            return b.value - a.value
          })
        }
        // 'original' 不需要額外排序，保持原始順序
      } else {
        sortedCategoryNames.forEach((categoryName) => {
          // 使用全域 categoryIndex，確保不同 series 中相同 category 有相同的索引
          const categoryIndex = globalCategoryIndexMap.get(categoryName)!
          const categoryItems = categoryMap.get(categoryName)!

          if (encoding.value.aggregate === 'none') {
            // 不聚合，保持原始資料結構
            let modelData: ModelDatumSeries[] = categoryItems.map((d, index) => {
              const value = (d as any)[encoding.value.from]
              return {
                id: d.id || `${datasetName}-${seriesName}-${categoryName}-${index}`,
                index: categoryIndex, // Series 模式下 index 對應 categoryIndex
                modelType: 'series',
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
            
            seriesData.push(...modelData)
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
            const modelData: ModelDatumSeries = {
              id: firstItem.id || `${datasetName}-${seriesName}-${categoryName}-aggregated`,
              index: categoryIndex, // Series 模式下 index 對應 categoryIndex
              modelType: 'series',
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
            seriesData.push(modelData)
          }
        })
      }

      gridData.push(seriesData)
    })

    result.push(gridData)
  })

  return result
}
