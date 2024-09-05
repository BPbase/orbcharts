import type { DataGrid, DataGridDatum } from '../types/DataGrid'
import type { ComputedDataFn } from '../types/ComputedData'
import type { ComputedDatumGrid } from '../types/ComputedDataGrid'
import type { DataFormatterContext } from '../types/DataFormatter'
import type { DataFormatterGridGrid } from '../types/DataFormatterGrid'
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
// import type { DataGridDatumTemp } from '../grid/computeGridData'
import { createTransposedDataGrid } from '../grid/computeGridData'

// function createGridData ({ context, gridIndex, transposedDataGrid, gridSeriesLabels, SeriesLabelColorMap }: {
//   context: DataFormatterContext<'grid'>
//   gridIndex: number
//   transposedDataGrid: DataGridDatum[][]
//   gridSeriesLabels: string[]
//   SeriesLabelColorMap: Map<string, string>
// }) {
//   const { data = [], dataFormatter, chartParams } = context
//   if (!data.length) {
//     return []
//   }
  
//   // const groupScale = createGroupScale(transposedDataGrid, dataFormatter, layout)

//   // const seriesLabels = createGridSeriesLabels({ transposedDataGrid, dataFormatter, chartType: 'multiGrid', gridIndex })
  
//   const groupLabels = createMultiGridGroupLabels({ transposedDataGrid, dataFormatter, chartType: 'multiGrid', gridIndex })

//   // 每一個series的valueScale
//   // const seriesValueScaleArr = createSeriesValueScaleArr(transposedDataGrid, dataFormatter, layout)

//   // const zeroYArr = transposedDataGrid.map((series, seriesIndex) => {
//   //   return seriesValueScaleArr[seriesIndex]!(0)
//   // })

//   let _index = 0
//   let computedDataGrid: ComputedDatumGrid[][] = transposedDataGrid.map((seriesData, seriesIndex) => {
//     return seriesData.map((groupDatum, groupIndex) => {
      
//       const defaultId = createDefaultDatumId('multiGrid', gridIndex, seriesIndex, groupIndex)
//       const groupLabel = groupLabels[groupIndex]
//       const seriesLabel = gridSeriesLabels[seriesIndex]
//       // const valueScale = seriesValueScaleArr[seriesIndex]
//       // const axisY = valueScale(groupDatum.value ?? 0)
//       // const zeroY = zeroYArr[seriesIndex]

//       const computedDatum: ComputedDatumGrid = {
//         id: groupDatum.id ? groupDatum.id : defaultId,
//         index: _index,
//         label: groupDatum.label ? groupDatum.label : defaultId,
//         description: groupDatum.description ?? '',
//         data: groupDatum.data,
//         value: groupDatum.value,
//         gridIndex,
//         // accSeriesIndex: seriesIndex, // 預設為seriesIndex
//         seriesIndex,
//         seriesLabel,
//         groupIndex,
//         groupLabel,
//         // color: seriesColorPredicate(seriesIndex, chartParams),
//         color: SeriesLabelColorMap.get(seriesLabel),
//         // axisX: groupScale(groupIndex),
//         // axisY,
//         // axisYFromZero: axisY - zeroY,
//         visible: groupDatum._visible
//       }

//       _index ++

//       return computedDatum
//     })
//   })

//   return computedDataGrid
// }

export const computeMultiGridData: ComputedDataFn<'multiGrid'> = (context) => {
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

    // const gridContextList = data.map((gridData, gridIndex) => {
    //   // grid context
    //   return {
    //     data: gridData,
    //     dataFormatterGrid: gridDataFormatterList[gridIndex],
    //     chartParams,
    //   }  
    // })

    const transposedDataGridList = data.map((gridData, gridIndex) => {
      // 依seriesDirection轉置資料矩陣
      return createTransposedDataGrid(gridData, gridDataFormatterList[gridIndex])
    })

    const isOverlappingMultiGrid = (() => {
      const SlotIndexSet = new Set(gridDataFormatterList.map(d => d.slotIndex))
      // 判斷是否有重疊的grid
      return SlotIndexSet.size !== gridDataFormatterList.length
    })()
    
    const multiGridSeriesLabels = transposedDataGridList
      .map((gridData, gridIndex) => {
        return isOverlappingMultiGrid
          ? createMultiGridSeriesLabels({
              transposedDataGrid: gridData,
              dataFormatterGrid: gridDataFormatterList[gridIndex],
              chartType: 'multiGrid',
              gridIndex
            })
          : createGridSeriesLabels({
            transposedDataGrid: gridData,
            dataFormatterGrid: gridDataFormatterList[gridIndex],
            chartType: 'multiGrid',
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
      // return createGridData({
      //   context: gridContextList[gridIndex],
      //   gridIndex,
      //   transposedDataGrid: gridData,
      //   gridSeriesLabels: multiGridSeriesLabels[gridIndex],
      //   SeriesLabelColorMap
      // })
      // const gridContext = gridContextList[gridIndex]
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
          // const valueScale = seriesValueScaleArr[seriesIndex]
          // const axisY = valueScale(groupDatum.value ?? 0)
          // const zeroY = zeroYArr[seriesIndex]
    
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
            // axisX: groupScale(groupIndex),
            // axisY,
            // axisYFromZero: axisY - zeroY,
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
