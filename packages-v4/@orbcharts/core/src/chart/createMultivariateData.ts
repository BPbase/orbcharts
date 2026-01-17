import type { RawData, RawDataColumn, Encoding, ModelDataMultivariate, ModelDatumMultivariate, Theme } from '../types'
import { getColorByFrom } from '../utils/colorUtils'

export const createMultivariateData = (rawData: RawData, encoding: Encoding, theme: Theme): ModelDataMultivariate[] => {
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

  // 對每個 dataset 進行 multivariate 資料的處理
  const result: ModelDataMultivariate[] = []
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

    // 依據排序後的系列名稱來建立最終的資料結構
    const multivariateData: ModelDatumMultivariate[][] = []
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
        // original 排序：依照原始資料中 category 名稱出現的順序
        const categoryOrder: string[] = []
        seriesItems.forEach((d) => {
          const categoryKey = (d as any)[encoding.category.from] || 'default'
          if (!categoryOrder.includes(categoryKey)) {
            categoryOrder.push(categoryKey)
          }
        })
        sortedCategoryNames = categoryOrder
      } else if (encoding.category.sort === 'alphabetical') {
        // alphabetical 排序：依照字母順序
        sortedCategoryNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      }

      // 處理每個 category
      const seriesData: ModelDatumMultivariate[] = []
      sortedCategoryNames.forEach((categoryName, categoryIndex) => {
        const categoryItems = categoryMap.get(categoryName)!
        
        // MultivariateData 不進行聚合，直接處理每筆資料
        categoryItems.forEach((d, index) => {
          // 處理 multivariate 欄位，將多個維度的值收集起來
          const multivariate = encoding.multivariate.map((multiVariateDef: {from: string, label: string}, multiVariateIndex: number) => ({
            index: multiVariateIndex,
            label: multiVariateDef.label,
            value: (() => {
              const rawValue = (d as any)[multiVariateDef.from]
              return typeof rawValue === 'number' ? rawValue : null
            })()
          }))

          const modelData: ModelDatumMultivariate = {
            id: d.id || `${datasetName}-${seriesName}-${categoryName}-${index}`,
            index,
            name: d.name || '',
            data: d.data,
            value: null, // MultivariateData 的主要值在 values 陣列中，這裡設為 null
            color: getColorByFrom(encoding.color.from, { 
              index, 
              seriesIndex,
              categoryIndex,
              datasetIndex
            }, theme),
            multivariate,
            series: seriesName,
            seriesIndex: seriesIndex,
            category: categoryName,
            categoryIndex: categoryIndex
          }
          seriesData.push(modelData)
        })
      })

      multivariateData.push(seriesData)
    })

    result.push(multivariateData)
  })

  return result
}
