import type { DataGrid } from '../types/DataGrid'
import type { ComputedDataFn } from '../types/ComputedData'
import type { DataFormatterMultiGrid } from '../types/DataFormatterMultiGrid'
import type { ComputedDataGrid } from '../types/ComputedDataGrid'
import { computeBaseGridData } from '../grid/computeGridData'
import { DATA_FORMATTER_MULTI_GRID_DEFAULT } from '../defaults'
import { seriesColorPredicate } from '../utils/orbchartsUtils'

export const computeMultiGridData: ComputedDataFn<'multiGrid'> = ({ data = [], dataFormatter, chartParams, layout }) => {
  if (!data.length) {
    return []
  }

  let multiGridData: ComputedDataGrid[] = []

  try {
    const defaultDataFormatterGrid = Object.assign({}, DATA_FORMATTER_MULTI_GRID_DEFAULT.multiGrid[0])

    // 計算每個grid的資料
    multiGridData = data.map((gridData, gridIndex) => {
      const currentDataFormatterGrid = dataFormatter.multiGrid[gridIndex] || defaultDataFormatterGrid
      // const dataFormatterGrid: DataFormatterGrid = {
      //   ...currentDataFormatterGrid,
      //   type: `multiGrid` as any,
      //   visibleFilter: dataFormatter.visibleFilter as any,
      // }
      return computeBaseGridData(
        {
          data: gridData,
          dataFormatter: currentDataFormatterGrid,
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
