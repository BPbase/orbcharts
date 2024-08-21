import type { DataGrid } from '../types/DataGrid'
import type { ComputedDataFn } from '../types/ComputedData'
import type { ComputedDatumGrid } from '../types/ComputedDataGrid'
import type { DataFormatterContext } from '../types/DataFormatter'
import type { DataFormatterGrid } from '../types/DataFormatterGrid'
import type { ComputedDataMultiGrid } from '../types/ComputedDataMultiGrid'
// import { computeBaseGridData } from '../grid/computeGridData'
import { DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT } from '../defaults'
import {
  createDefaultDatumId,
  seriesColorPredicate,
  createGridSeriesLabels,
  createMultiGridSeriesLabels,
  createMultiGridGroupLabels
} from '../utils/orbchartsUtils'
import type { DataGridDatumTemp } from '../grid/computeGridData'
import { createTransposedDataGrid, createGroupScale, createSeriesValueScaleArr } from '../grid/computeGridData'

function createGridData ({ context, gridIndex, transposedDataGrid, gridSeriesLabels, SeriesLabelColorMap }: {
  context: DataFormatterContext<'grid'>
  gridIndex: number
  transposedDataGrid: DataGridDatumTemp[][]
  gridSeriesLabels: string[]
  SeriesLabelColorMap: Map<string, string>
}) {
  const { data = [], dataFormatter, chartParams, layout } = context
  if (!data.length) {
    return []
  }
  
  const groupScale = createGroupScale(transposedDataGrid, dataFormatter, layout)

  // const seriesLabels = createGridSeriesLabels({ transposedDataGrid, dataFormatter, chartType: 'multiGrid', gridIndex })
  
  const groupLabels = createMultiGridGroupLabels({ transposedDataGrid, dataFormatter, chartType: 'multiGrid', gridIndex })

  // 每一個series的valueScale
  const seriesValueScaleArr = createSeriesValueScaleArr(transposedDataGrid, dataFormatter, layout)

  const zeroYArr = transposedDataGrid.map((series, seriesIndex) => {
    return seriesValueScaleArr[seriesIndex]!(0)
  })

  let _index = 0
  let computedDataGrid: ComputedDatumGrid[][] = transposedDataGrid.map((seriesData, seriesIndex) => {
    return seriesData.map((groupDatum, groupIndex) => {
      
      const defaultId = createDefaultDatumId('multiGrid', gridIndex, seriesIndex, groupIndex)
      const groupLabel = groupLabels[groupIndex]
      const seriesLabel = gridSeriesLabels[seriesIndex]
      const valueScale = seriesValueScaleArr[seriesIndex]
      const axisY = valueScale(groupDatum.value ?? 0)
      const zeroY = zeroYArr[seriesIndex]

      const computedDatum: ComputedDatumGrid = {
        id: groupDatum.id ? groupDatum.id : defaultId,
        index: _index,
        label: groupDatum.label ? groupDatum.label : defaultId,
        description: groupDatum.description ?? '',
        data: groupDatum.data,
        value: groupDatum.value,
        gridIndex,
        // accSeriesIndex: seriesIndex, // 預設為seriesIndex
        seriesIndex,
        seriesLabel,
        groupIndex,
        groupLabel,
        // color: seriesColorPredicate(seriesIndex, chartParams),
        color: SeriesLabelColorMap.get(seriesLabel),
        axisX: groupScale(groupIndex),
        axisY,
        axisYFromZero: axisY - zeroY,
        visible: groupDatum._visible
      }

      _index ++

      return computedDatum
    })
  })

  return computedDataGrid
}

export const computeMultiGridData: ComputedDataFn<'multiGrid'> = ({ data = [], dataFormatter, chartParams, layout }) => {
  if (!data.length) {
    return []
  }

  let multiGridData: ComputedDataMultiGrid = []

  try {
    const defaultGrid = dataFormatter.gridList[0] || DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT

    // 計算每個grid的dataFormatter
    const gridDataFormatterList: DataFormatterGrid[] = data.map((gridData, gridIndex) => {
      const currentDataFormatterGrid = dataFormatter.gridList[gridIndex] || defaultGrid

      return {
        type: 'grid',
        grid: {
          ...currentDataFormatterGrid
        },
        container: {
          ...dataFormatter.container
        }
      }
    })

    const gridContextList = data.map((gridData, gridIndex) => {
      // grid context
      return {
        data: gridData,
        dataFormatter: gridDataFormatterList[gridIndex],
        chartParams,
        layout
      }  
    })

    const transposedDataGridList = data.map((gridData, gridIndex) => {
      // 依seriesDirection轉置資料矩陣
      return createTransposedDataGrid(gridContextList[gridIndex])
    })

    const createSeriesLabelsFn = (() => {
      const SlotIndexSet = new Set(gridDataFormatterList.map(d => d.grid.slotIndex))
      // 判斷是否有重疊的grid
      const isOverlappingMultiGrid = SlotIndexSet.size !== gridDataFormatterList.length
      return isOverlappingMultiGrid
        ? createMultiGridSeriesLabels // 有重疊的grid則使用「不同」的seriesLabels
        : createGridSeriesLabels // 沒有重疊的grid則使用「相同」的seriesLabels
    })()
    

    const multiGridSeriesLabels = transposedDataGridList
      .map((gridData, gridIndex) => {
        return createSeriesLabelsFn({
          transposedDataGrid: gridData,
          dataFormatter: gridDataFormatterList[gridIndex],
          chartType: 'multiGrid',
          gridIndex
        } as any)
      })

    const SeriesLabelColorMap: Map<string, string> = new Map()
    let accIndex = 0
    multiGridSeriesLabels.flat().forEach((label, i) => {
      if (!SeriesLabelColorMap.has(label)) {
        const color = seriesColorPredicate(accIndex, chartParams)
        SeriesLabelColorMap.set(label, color)
        accIndex ++
      }
    })

    // 計算每個grid的資料
    multiGridData = data.map((gridData, gridIndex) => {
      return createGridData({
        context: gridContextList[gridIndex],
        gridIndex,
        transposedDataGrid: transposedDataGridList[gridIndex],
        gridSeriesLabels: multiGridSeriesLabels[gridIndex],
        SeriesLabelColorMap
      })
    })


  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return multiGridData
}
