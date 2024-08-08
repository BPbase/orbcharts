import type { DataSeries, DataSeriesDatum } from '../types/DataSeries'
import type { ComputedDataFn } from '../types/ComputedData'
import type { ComputedDataSeries, ComputedDatumSeries } from '../types/ComputedDataSeries'
import { formatValueToLabel, createDefaultDatumId, createDefaultSeriesLabel, seriesColorPredicate } from '../utils/orbchartsUtils'

interface SortValue {
  rowIndex: number
  columnIndex: number
  index: number
  datum: number | DataSeriesDatum
}

type GetSortedIndex = (computedDataSeries: ComputedDatumSeries[], rowIndex: number, columnIndex: number) => number

function createSortedIndexMap (data: DataSeries, sort: (a: number | DataSeriesDatum, b: number | DataSeriesDatum) => number): Map<string, number> {
  
  const SortedIndexMap: Map<string, number> = new Map() // Map<[rowIndex, columnIndex], sortedIndex>
  
  let _data = Object.assign([], data) as DataSeries
  // 建立排序所需資料的物件
  let sortValueData: SortValue[] = []
  _data.forEach((d, i) => {
    if (Array.isArray(d)) {
      d.forEach((_d, _i) => {
        sortValueData.push({
          rowIndex: i,
          columnIndex: _i,
          index: -1,
          datum: _d
        })
      })
    } else {
      sortValueData.push({
        rowIndex: i,
        columnIndex: 0,
        index: -1,
        datum: d
      })
    }
  })
  // 排序
  sortValueData.sort((a, b) => sort(a.datum, b.datum))
  // 取得排序後的index
  sortValueData = sortValueData.map((d, i) => {
    return {
      ...d,
      index: i
    }
  })
  // 建立SortedIndexMap
  sortValueData.forEach(d => {
    SortedIndexMap.set(String([d.rowIndex, d.columnIndex]), d.index)
  })

  return SortedIndexMap
}

export const computeSeriesData: ComputedDataFn<'series'> = (context) => {
  const { data = [], dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }

  const computedDataSeries: ComputedDatumSeries[] = []
  
  try {
    // 取得排序後的索引
    const getSortedIndex: GetSortedIndex = ((hasSort: boolean) => {
      if (hasSort) {
        // 資料索引對應排序後的索引  Map<[rowIndex, columnIndex], sortedIndex>
        const SortedIndexMap: Map<string, number> = createSortedIndexMap(data, dataFormatter.sort)
        return (computedDataSeries: ComputedDatumSeries[], rowIndex: number, columnIndex: number) => {
          return SortedIndexMap.get(String([rowIndex, columnIndex]))
        }
      } else {
        return (computedDataSeries: ComputedDatumSeries[], rowIndex: number, columnIndex: number) => {
          return computedDataSeries.length
        }
      }
    })(dataFormatter.sort != null)

    // 資料索引對應排序後的索引  Map<[rowIndex, columnIndex], sortedIndex>
    // let SortedIndexMap: Map<string, number> = new Map()
    // if (dataFormatter.sort) {
    //   SortedIndexMap = createSortedIndexMap(data, dataFormatter.sort)
    // }

    const createComputedDatumSeries = (detailData: number | DataSeriesDatum, rowIndex: number, columnIndex: number, currentIndex: number, sortedIndex: number): ComputedDatumSeries => {
      const defaultId = createDefaultDatumId(dataFormatter.type, rowIndex, columnIndex)
      // const seriesLabel = dataFormatter.mapSeries(detailData, rowIndex, columnIndex, context)
      const seriesLabel = dataFormatter.seriesLabels[rowIndex] || createDefaultSeriesLabel('series', rowIndex)
      // const color = dataFormatter.colorsPredicate(detailData, rowIndex, columnIndex, context)
      const color = seriesColorPredicate(rowIndex, chartParams)
      const visible = dataFormatter.visibleFilter(detailData, rowIndex, columnIndex, context)
      if (typeof detailData === 'number') {
        return {
          id: defaultId,
          index: currentIndex,
          sortedIndex,
          label: defaultId,
          description: '',
          // tooltipContent: dataFormatter.tooltipContentFormat(detailData, rowIndex, columnIndex, context),
          data: {},
          value: detailData,
          // valueLabel: formatValueToLabel(detailData, dataFormatter.valueFormat),
          seriesIndex: rowIndex,
          seriesLabel,
          color,
          visible
        }
      } else {
        return {
          id: detailData.id ? detailData.id : defaultId,
          index: currentIndex,
          sortedIndex,
          label: detailData.label ? detailData.label : defaultId,
          description: detailData.description,
          // tooltipContent: detailData.tooltipContent ? detailData.tooltipContent : dataFormatter.tooltipContentFormat(detailData, rowIndex, columnIndex, context),
          data: detailData.data ?? {},
          value: detailData.value,
          // valueLabel: formatValueToLabel(detailData.value, dataFormatter.valueFormat),
          seriesIndex: rowIndex,
          seriesLabel,
          color,
          visible
        }
      }
    }
    
    data.forEach((mainData, rowIndex) => {
      if (Array.isArray(mainData)) {
        mainData.forEach((detailData, columnIndex) => {
          const sortedIndex = getSortedIndex(computedDataSeries, rowIndex, columnIndex)
          const datum = createComputedDatumSeries(detailData, rowIndex, columnIndex, computedDataSeries.length, sortedIndex)
          computedDataSeries.push(datum)
        })
      } else {
        const sortedIndex = getSortedIndex(computedDataSeries, rowIndex, 0)
        const datum = createComputedDatumSeries(mainData, rowIndex, 0, computedDataSeries.length, sortedIndex) // 只有一維陣列所以columnIndex為0
        computedDataSeries.push(datum)
      }
    })

    // if (dataFormatter.sort != null) {
    //   computedDataSeries.sort((a, b) => a.sortedIndex - b.sortedIndex)
    // }
  } catch (e) {
    // console.error(e)
    throw Error(e)
  }
  
  return computedDataSeries
}
