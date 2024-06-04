import * as d3 from 'd3'
import type { ComputedDataFn } from '../types/ComputedData'
import type { DataGrid, DataGridDatum } from '../types/DataGrid'
import type { DataFormatterContext } from '../types/DataFormatter'
import type { DataFormatterGrid } from '../types/DataFormatterGrid'
import type { ComputedDataGrid, ComputedDatumGrid } from '../types/ComputedDataGrid'
import { formatValueToLabel, createDefaultDatumId, createDefaultSeriesLabel, createDefaultGroupLabel } from '../utils/orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale } from '../utils/d3Utils'
import { getMinAndMaxValue, transposeData, createGridSeriesLabels, createGridGroupLabels } from '../utils/orbchartsUtils'

interface DataGridDatumTemp extends DataGridDatum {
  _color: string // 暫放的顏色資料
  _visible: boolean // 暫放的visible
}

export const computeGridData: ComputedDataFn<'grid'> = (context) => {
  const { data = [], dataFormatter, chartParams, layout } = context
  if (!data.length) {
    return []
  }

  let computedDataGrid: ComputedDatumGrid[][]

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
    const dataGrid: DataGridDatumTemp[][] = fullData.map((d, i) => {
      return d.map((_d, _i) => {

        const _color = dataFormatter.colorsPredicate(_d, i, _i, context)
        const _visible = dataFormatter.visibleFilter(_d, i, _i, context)

        const datum: DataGridDatumTemp = _d == null
          ? {
            id: '',
            label: '',
            tooltipContent: '',
            data: {},
            value: null,
            _color,
            _visible
          }
          : typeof _d === 'number'
            ? {
              id: '',
              label: '',
              tooltipContent: '',
              data: {},
              value: _d,
              _color,
              _visible
            }
            : {
              id: _d.id ?? '',
              label: _d.label ?? '',
              tooltipContent: _d.tooltipContent ?? '',
              data: _d.data ?? {},
              value: _d.value,
              _color,
              _visible
            }
        
        return datum
      })
    })

    // 依seriesType轉置資料矩陣
    const transposedDataGrid = transposeData(dataFormatter.grid.seriesType, dataGrid)

    // -- groupScale --
    const groupAxisWidth = (dataFormatter.groupAxis.position === 'top' || dataFormatter.groupAxis.position === 'bottom')
      ? layout.width
      : layout.height
    const groupEndIndex = transposedDataGrid[0] ? transposedDataGrid[0].length - 1 : 0
    const groupScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: groupEndIndex,
      minValue: 0,
      axisWidth: groupAxisWidth,
      scaleDomain: [0, groupEndIndex], // 不使用dataFormatter設定
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })

    // const seriesColors = chartParams.colors[chartParams.colorScheme].series

    const groupScaleDomain = [
      dataFormatter.groupAxis.scaleDomain[0] === 'auto'
        ? 0
        : dataFormatter.groupAxis.scaleDomain[0],
      dataFormatter.groupAxis.scaleDomain[1] === 'auto'
        ? groupEndIndex
        : dataFormatter.groupAxis.scaleDomain[1]
    ]
    

    // -- 依groupScale算visible --
    // 篩選顯示狀態
    // const scaleDomainFilter = (columnIndex: number) => {
    //   // 如果groupIndex不在scale的範圍內則為false，不再做visibleFilter的判斷
    //   if (columnIndex < groupScaleDomain[0] || columnIndex > groupScaleDomain[1]) {
    //     return false
    //   }
    //   return true
    // }
    // transposedDataGrid.forEach((seriesData, seriesIndex) => {
    //   seriesData.forEach((groupDatum, groupIndex) => {
    //     // in-place修改visible
    //     groupDatum._visible = groupDatum._visible == true && scaleDomainFilter(groupIndex) == true
    //       ? true
    //       : false // 兩者有一個false即為false
    //   })
    // })

    // -- valueScale --
    const visibleData = transposedDataGrid.flat().filter(d => d._visible != false)
    const [minValue, maxValue] = getMinAndMaxValue(visibleData)

    const valueAxisWidth = (dataFormatter.valueAxis.position === 'left' || dataFormatter.valueAxis.position === 'right')
      ? layout.height
      : layout.width

    const seriesLabels = createGridSeriesLabels(transposedDataGrid, dataFormatter)
    const groupLabels = createGridGroupLabels(transposedDataGrid, dataFormatter)

    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue,
      minValue,
      axisWidth: valueAxisWidth,
      scaleDomain: [minValue, maxValue], // 不使用dataFormatter設定
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })

    const zeroY = valueScale(0)

    let _index = 0
    computedDataGrid = transposedDataGrid.map((seriesData, seriesIndex) => {
      return seriesData.map((groupDatum, groupIndex) => {
        
        const defaultId = createDefaultDatumId(dataFormatter.type, seriesIndex, groupIndex)
        // const visible = visibleFilter(groupDatum, seriesIndex, groupIndex, context)
        const groupLabel = groupLabels[groupIndex]
        const axisY = valueScale(groupDatum.value ?? 0)

        const computedDatum: ComputedDatumGrid = {
          id: groupDatum.id ? groupDatum.id : defaultId,
          index: _index,
          label: groupDatum.label ? groupDatum.label : defaultId,
          tooltipContent: groupDatum.tooltipContent ? groupDatum.tooltipContent : dataFormatter.tooltipContentFormat(groupDatum, seriesIndex, groupIndex, context),
          data: groupDatum.data,
          value: groupDatum.value,
          // valueLabel: formatValueToLabel(groupDatum.value, dataFormatter.valueFormat),
          seriesIndex,
          seriesLabel: seriesLabels[seriesIndex],
          groupIndex,
          groupLabel,
          // color: seriesColors[seriesIndex],
          color: groupDatum._color,
          axisX: groupScale(groupIndex),
          axisY,
          axisYFromZero: axisY - zeroY,
          // visible: groupDatum._visible == true && scaleDomainFilter(groupIndex) == true ? true : false // 兩者有一個false即為false
          visible: groupDatum._visible
        }

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
