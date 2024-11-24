import type { ComputedDataFn, ComputedDatumGrid, DataFormatterGridGrid, ComputedDataMultiGrid } from '../../lib/core-types'
import { DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT } from '../defaults'
import {
  createDefaultDatumId,
  seriesColorPredicate,
  createGridSeriesLabels,
  createMultiGridSeriesLabels,
  createMultiGridGroupLabels
} from '../utils/orbchartsUtils'
import { createTransposedDataGrid } from '../grid/computedDataFn'

export const computedDataFn: ComputedDataFn<'multiGrid'> = (context) => {
  const { data = [], dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }

  let multiGridData: ComputedDataMultiGrid = []

  try {
    const defaultGrid = dataFormatter.gridList[0] || DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT

    // 計算每個grid的dataFormatter
    const gridDataFormatterList: DataFormatterGridGrid[] = data.map((gridData, gridIndex) => {
      return dataFormatter.gridList[gridIndex] || defaultGrid
    })

    const transposedDataGridList = data.map((gridData, gridIndex) => {
      // 依seriesDirection轉置資料矩陣
      return createTransposedDataGrid(gridData, gridDataFormatterList[gridIndex])
    })

    // const isOverlappingMultiGrid = (() => {
    //   const SlotIndexSet = new Set(gridDataFormatterList.map(d => d.slotIndex))
    //   // 判斷是否有重疊的grid
    //   return SlotIndexSet.size !== gridDataFormatterList.length
    // })()

    const multiGridSeriesLabels = dataFormatter.separateGrid
      // grid分開的時候，預設每組的seriesLabels相同
      ? transposedDataGridList
          .map((gridData, gridIndex) => {
            return createGridSeriesLabels({
              transposedDataGrid: gridData,
              dataFormatterGrid: gridDataFormatterList[gridIndex],
              chartType: 'multiGrid',
            })
          })
      // grid不分開的時候，預設每個grid相同seriesIndex的seriesLabel相同
      : transposedDataGridList
          .map((gridData, gridIndex) => {
            return createMultiGridSeriesLabels({
              transposedDataGrid: gridData,
              dataFormatterGrid: gridDataFormatterList[gridIndex],
              chartType: 'multiGrid',
              gridIndex
            })
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
    multiGridData = transposedDataGridList.map((gridData, gridIndex) => {
      const gridSeriesLabels = multiGridSeriesLabels[gridIndex]
      const groupLabels = createMultiGridGroupLabels({
        transposedDataGrid: gridData,
        dataFormatterGrid: gridDataFormatterList[gridIndex],
        chartType: 'multiGrid',
        gridIndex
      })

      let _index = 0
      let computedDataGrid: ComputedDatumGrid[][] = gridData.map((seriesData, seriesIndex) => {
        return seriesData.map((groupDatum, groupIndex) => {
          
          const defaultId = createDefaultDatumId('multiGrid', gridIndex, seriesIndex, groupIndex)
          const groupLabel = groupLabels[groupIndex]
          const seriesLabel = gridSeriesLabels[seriesIndex]
    
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
            color: SeriesLabelColorMap.get(seriesLabel),
            visible: true // 先給一個預設值
          }

          computedDatum.visible = dataFormatter.visibleFilter(computedDatum, context)
    
          _index ++
    
          return computedDatum
        })
      })
    
      return computedDataGrid
    })


  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return multiGridData
}
