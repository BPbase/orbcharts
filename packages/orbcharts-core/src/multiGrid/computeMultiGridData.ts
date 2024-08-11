import type { DataGrid } from '../types/DataGrid'
import type { ComputedDataFn } from '../types/ComputedData'
import type { DataFormatterGrid } from '../types/DataFormatterGrid'
import type { ComputedDataMultiGrid } from '../types/ComputedDataMultiGrid'
import { computeBaseGridData } from '../grid/computeGridData'
import { DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT } from '../defaults'
import { seriesColorPredicate } from '../utils/orbchartsUtils'

export const computeMultiGridData: ComputedDataFn<'multiGrid'> = ({ data = [], dataFormatter, chartParams, layout }) => {
  if (!data.length) {
    return []
  }

  let multiGridData: ComputedDataMultiGrid = []

  try {
    const defaultGrid = dataFormatter.gridList[0] || DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT

    // 計算每個grid的資料
    multiGridData = data.map((gridData, gridIndex) => {
      const currentDataFormatterGrid = dataFormatter.gridList[gridIndex] || defaultGrid

      return computeBaseGridData(
        {
          data: gridData,
          dataFormatter: {
            type: 'grid',
            grid: {
              ...currentDataFormatterGrid
            },
            container: {
              ...dataFormatter.container
            }
          },
          chartParams,
          layout
        },
        'multiGrid',
        gridIndex
      )
    })

    // 修正多個grid的欄位資料
    let accSeriesIndex = -1
    multiGridData = multiGridData.map((gridData, i) => {
      return gridData.map((series, j) => {
        accSeriesIndex ++
        return series.map(d => {
          d.accSeriesIndex = accSeriesIndex
          d.color = seriesColorPredicate(accSeriesIndex, chartParams)
          return d
        })
      })
    })

  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return multiGridData
}
