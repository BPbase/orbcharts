import * as d3 from 'd3'
import type { ComputedDataFn } from '../types/ComputedData'
import type { DataGrid, DataGridDatum } from '../types/DataGrid'
import type { DataFormatterContext } from '../types/DataFormatter'
import type { DataFormatterGrid, DataFormatterGridGrid } from '../types/DataFormatterGrid'
import type { ComputedDataGrid, ComputedDatumGrid } from '../types/ComputedDataGrid'
import type { Layout } from '../types/Layout'
import { formatValueToLabel, createDefaultDatumId, createDefaultSeriesLabel, createDefaultGroupLabel } from '../utils/orbchartsUtils'
import { getMinAndMaxValue, transposeData, createGridSeriesLabels, createGridGroupLabels, seriesColorPredicate } from '../utils/orbchartsUtils'

// 統一 DataGrid 格式、並欄列資料轉置為一致方式
export function createTransposedDataGrid (data: DataGrid, dataFormatterGrid: DataFormatterGridGrid): DataGridDatum[][] {
  // const { data = [], dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }
  try {
    // 最多的array length
    const maxArrayLength = data.reduce((prev, current) => {
      return current.length > prev ? current.length : prev
    }, 0)

    // 補齊短少資料
    const fullData = data.map((d, i) => {
      if (d.length === maxArrayLength) {
        return d
      }
      const newD = Object.assign([], d)
      for (let _i = newD.length; _i < maxArrayLength; _i++) {
        newD[_i] = null
      }
      return newD
    })

    // 完整的資料格式
    const dataGrid: DataGridDatum[][] = fullData.map((d, i) => {
      return d.map((_d, _i) => {

        const datum: DataGridDatum = _d == null
          ? {
            id: '',
            label: '',
            data: {},
            value: null,
          }
          : typeof _d === 'number'
            ? {
              id: '',
              label: '',
              data: {},
              value: _d,
            }
            : {
              id: _d.id ?? '',
              label: _d.label ?? '',
              data: _d.data ?? {},
              value: _d.value,
            }
        
        return datum
      })
    })

    // 依seriesDirection轉置資料矩陣
    const transposedDataGrid = transposeData(dataFormatterGrid.gridData.seriesDirection, dataGrid)

    return transposedDataGrid
  } catch (e) {
    return []
  }
}

export const computeGridData: ComputedDataFn<'grid'> = (context) => {
  const { data = [], dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }

  let computedDataGrid: ComputedDatumGrid[][]

  try {
    
    // 依seriesDirection轉置資料矩陣
    const transposedDataGrid = createTransposedDataGrid(data, dataFormatter.grid)

    const seriesLabels = createGridSeriesLabels({
      transposedDataGrid,
      dataFormatterGrid: dataFormatter.grid,
      chartType: 'grid'
    })
    const groupLabels = createGridGroupLabels({
      transposedDataGrid,
      dataFormatterGrid: dataFormatter.grid,
      chartType: 'grid'
    })

    let _index = 0
    computedDataGrid = transposedDataGrid.map((seriesData, seriesIndex) => {
      return seriesData.map((groupDatum, groupIndex) => {
        
        const defaultId = createDefaultDatumId('grid', 0, seriesIndex, groupIndex)
        const groupLabel = groupLabels[groupIndex]

        const computedDatum: ComputedDatumGrid = {
          id: groupDatum.id ? groupDatum.id : defaultId,
          index: _index,
          label: groupDatum.label ? groupDatum.label : defaultId,
          description: groupDatum.description ?? '',
          data: groupDatum.data,
          value: groupDatum.value,
          gridIndex: 0,
          seriesIndex,
          seriesLabel: seriesLabels[seriesIndex],
          groupIndex,
          groupLabel,
          color: seriesColorPredicate(seriesIndex, chartParams),
          visible: true // 先給一個預設值
        }

        // 先建立物件再計算visible欄位
        computedDatum.visible = dataFormatter.visibleFilter(computedDatum, context)

        _index ++

        return computedDatum
      })
    })

  } catch (e) {
    throw Error(e)
  }

  return computedDataGrid
}
