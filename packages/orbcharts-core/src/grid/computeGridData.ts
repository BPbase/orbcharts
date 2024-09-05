import * as d3 from 'd3'
import type { ComputedDataFn } from '../types/ComputedData'
import type { DataGrid, DataGridDatum } from '../types/DataGrid'
import type { DataFormatterContext } from '../types/DataFormatter'
import type { DataFormatterGrid, DataFormatterGridGrid } from '../types/DataFormatterGrid'
import type { ComputedDataGrid, ComputedDatumGrid } from '../types/ComputedDataGrid'
import type { Layout } from '../types/Layout'
import { formatValueToLabel, createDefaultDatumId, createDefaultSeriesLabel, createDefaultGroupLabel } from '../utils/orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale } from '../utils/d3Utils'
import { getMinAndMaxValue, transposeData, createGridSeriesLabels, createGridGroupLabels, seriesColorPredicate } from '../utils/orbchartsUtils'

// export interface DataGridDatumTemp extends DataGridDatum {
//   // _color: string // 暫放的顏色資料
//   _visible: boolean // 暫放的visible
// }

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

        // const _color = dataFormatter.colorsPredicate(_d, i, _i, context)
        // const _visible = dataFormatter.grid.visibleFilter(_d, i, _i, context)

        const datum: DataGridDatum = _d == null
          ? {
            id: '',
            label: '',
            // tooltipContent: '',
            data: {},
            value: null,
            // _color,
            // _visible
          }
          : typeof _d === 'number'
            ? {
              id: '',
              label: '',
              // tooltipContent: '',
              data: {},
              value: _d,
              // _color,
              // _visible
            }
            : {
              id: _d.id ?? '',
              label: _d.label ?? '',
              // tooltipContent: _d.tooltipContent ?? '',
              data: _d.data ?? {},
              value: _d.value,
              // _color,
              // _visible
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

// export function createGroupScale (transposedDataGrid: DataGridDatumTemp[][], dataFormatter: DataFormatterGrid, layout: Layout) {
//   const groupAxisWidth = (dataFormatter.grid.groupAxis.position === 'top' || dataFormatter.grid.groupAxis.position === 'bottom')
//     ? layout.width
//     : layout.height
//   const groupEndIndex = transposedDataGrid[0] ? transposedDataGrid[0].length - 1 : 0
//   const groupScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
//     maxValue: groupEndIndex,
//     minValue: 0,
//     axisWidth: groupAxisWidth,
//     scaleDomain: [0, groupEndIndex], // 不使用dataFormatter設定
//     scaleRange: [0, 1] // 不使用dataFormatter設定
//   })
//   return groupScale
// }

// export function createSeriesValueScaleArr (transposedDataGrid: DataGridDatumTemp[][], dataFormatter: DataFormatterGrid, layout: Layout) {
//   const valueAxisWidth = (dataFormatter.grid.valueAxis.position === 'left' || dataFormatter.grid.valueAxis.position === 'right')
//     ? layout.height
//     : layout.width

//   const visibleData = transposedDataGrid.flat().filter(d => d._visible != false)
//   const [minValue, maxValue] = getMinAndMaxValue(visibleData)
  
//   return transposedDataGrid.map((seriesData, seriesIndex) => {
//     const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
//       maxValue,
//       minValue,
//       axisWidth: valueAxisWidth,
//       scaleDomain: [minValue, maxValue], // 不使用dataFormatter設定
//       scaleRange: [0, 1] // 不使用dataFormatter設定
//     })
//     return valueScale
//   })
// }

export const computeGridData: ComputedDataFn<'grid'> = (context) => {
  const { data = [], dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }

  let computedDataGrid: ComputedDatumGrid[][]

  try {
    
    // 依seriesDirection轉置資料矩陣
    const transposedDataGrid = createTransposedDataGrid(data, dataFormatter.grid)

    // const groupScale = createGroupScale(transposedDataGrid, dataFormatter, layout)

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

    // // 每一個series的valueScale
    // const seriesValueScaleArr = createSeriesValueScaleArr(transposedDataGrid, dataFormatter, layout)
    
    // const zeroYArr = transposedDataGrid.map((series, seriesIndex) => {
    //   return seriesValueScaleArr[seriesIndex]!(0)
    // })

    let _index = 0
    computedDataGrid = transposedDataGrid.map((seriesData, seriesIndex) => {
      return seriesData.map((groupDatum, groupIndex) => {
        
        const defaultId = createDefaultDatumId('grid', 0, seriesIndex, groupIndex)
        // const visible = visibleFilter(groupDatum, seriesIndex, groupIndex, context)
        const groupLabel = groupLabels[groupIndex]
        // const valueScale = seriesValueScaleArr[seriesIndex]
        // const axisY = valueScale(groupDatum.value ?? 0)
        // const zeroY = zeroYArr[seriesIndex]

        const computedDatum: ComputedDatumGrid = {
          id: groupDatum.id ? groupDatum.id : defaultId,
          index: _index,
          label: groupDatum.label ? groupDatum.label : defaultId,
          description: groupDatum.description ?? '',
          // tooltipContent: groupDatum.tooltipContent ? groupDatum.tooltipContent : dataFormatter.tooltipContentFormat(groupDatum, seriesIndex, groupIndex, context),
          data: groupDatum.data,
          value: groupDatum.value,
          // valueLabel: formatValueToLabel(groupDatum.value, dataFormatter.valueFormat),
          gridIndex: 0,
          // accSeriesIndex: seriesIndex, // 預設為seriesIndex
          seriesIndex,
          seriesLabel: seriesLabels[seriesIndex],
          groupIndex,
          groupLabel,
          // color: groupDatum._color,
          color: seriesColorPredicate(seriesIndex, chartParams),
          // axisX: groupScale(groupIndex),
          // axisY,
          // axisYFromZero: axisY - zeroY,
          // visible: groupDatum._visible == true && scaleDomainFilter(groupIndex) == true ? true : false // 兩者有一個false即為false
          // visible: groupDatum._visible
          visible: true // 先給一個預設值
        }

        computedDatum.visible = dataFormatter.visibleFilter(computedDatum, context)

        _index ++

        return computedDatum
      })
    })

  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return computedDataGrid
}
