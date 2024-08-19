import * as d3 from 'd3'
import type { ComputedDataFn } from '../types/ComputedData'
import type { DataGrid, DataGridDatum } from '../types/DataGrid'
import type { DataFormatterContext } from '../types/DataFormatter'
import type { DataFormatterGrid } from '../types/DataFormatterGrid'
import type { ComputedDataGrid, ComputedDatumGrid } from '../types/ComputedDataGrid'
import { formatValueToLabel, createDefaultDatumId, createDefaultSeriesLabel, createDefaultGroupLabel } from '../utils/orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale } from '../utils/d3Utils'
import { getMinAndMaxValue, transposeData, createGridSeriesLabels, createGridGroupLabels, seriesColorPredicate } from '../utils/orbchartsUtils'

interface DataGridDatumTemp extends DataGridDatum {
  // _color: string // 暫放的顏色資料
  _visible: boolean // 暫放的visible
}

export const computeGridData: ComputedDataFn<'grid'> = (context) => {
  return computeBaseGridData(context, 'grid', 0)
}

// 共用的計算grid資料 - 只有multiGrid計算時才會有gridIndex參數
export const computeBaseGridData = (context: DataFormatterContext<'grid'>, chartType: 'grid' | 'multiGrid', gridIndex = 0) => {
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

        // const _color = dataFormatter.colorsPredicate(_d, i, _i, context)
        const _visible = dataFormatter.grid.visibleFilter(_d, i, _i, context)

        const datum: DataGridDatumTemp = _d == null
          ? {
            id: '',
            label: '',
            // tooltipContent: '',
            data: {},
            value: null,
            // _color,
            _visible
          }
          : typeof _d === 'number'
            ? {
              id: '',
              label: '',
              // tooltipContent: '',
              data: {},
              value: _d,
              // _color,
              _visible
            }
            : {
              id: _d.id ?? '',
              label: _d.label ?? '',
              // tooltipContent: _d.tooltipContent ?? '',
              data: _d.data ?? {},
              value: _d.value,
              // _color,
              _visible
            }
        
        return datum
      })
    })

    // 依seriesDirection轉置資料矩陣
    const transposedDataGrid = transposeData(dataFormatter.grid.gridData.seriesDirection, dataGrid)

    // -- groupScale --
    const { groupScale } = (() => {
      const groupAxisWidth = (dataFormatter.grid.groupAxis.position === 'top' || dataFormatter.grid.groupAxis.position === 'bottom')
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
      return { groupScale }
    })()

    

    // const seriesColors = chartParams.colors[chartParams.colorScheme].series

    // const groupScaleDomain = [
    //   dataFormatter.groupAxis.scaleDomain[0] === 'auto'
    //     ? 0
    //     : dataFormatter.groupAxis.scaleDomain[0],
    //   dataFormatter.groupAxis.scaleDomain[1] === 'auto'
    //     ? groupEndIndex
    //     : dataFormatter.groupAxis.scaleDomain[1]
    // ]
    

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

    const seriesLabels = createGridSeriesLabels({ transposedDataGrid, dataFormatter, chartType, gridIndex })
    const groupLabels = createGridGroupLabels({ transposedDataGrid, dataFormatter, chartType, gridIndex })

    // 每一個series的valueScale
    const seriesValueScaleArr = (() => {
      const valueAxisWidth = (dataFormatter.grid.valueAxis.position === 'left' || dataFormatter.grid.valueAxis.position === 'right')
        ? layout.height
        : layout.width

      // // 每一個series的 [minValue, maxValue]
      // const minAndMaxValueArr = (() => {
      //   // 有設定series定位，各別series計算各自的最大最小值
      //   if (dataFormatter.grid.seriesSlotIndexes
      //     && dataFormatter.grid.seriesSlotIndexes.length === transposedDataGrid.length
      //   ) {
      //     return transposedDataGrid
      //       .map(series => {
      //         const visibleData = series.filter(d => d._visible != false)
      //         return getMinAndMaxValue(visibleData)
      //       })
      //   } else {
      //     // 沒有設定series定位，全部資料一起計算最大值最小值
      //     const visibleData = transposedDataGrid.flat().filter(d => d._visible != false)
      //     const [minValue, maxValue] = getMinAndMaxValue(visibleData)
      //     return transposedDataGrid
      //       .map(series => {
      //         return [minValue, maxValue]
      //       })
      //   }
      // })()

      const visibleData = transposedDataGrid.flat().filter(d => d._visible != false)
      const [minValue, maxValue] = getMinAndMaxValue(visibleData)
      
      return transposedDataGrid.map((seriesData, seriesIndex) => {
        // const minValue = minAndMaxValueArr[seriesIndex][0]
        // const maxValue = minAndMaxValueArr[seriesIndex][1]
        const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
          maxValue,
          minValue,
          axisWidth: valueAxisWidth,
          scaleDomain: [minValue, maxValue], // 不使用dataFormatter設定
          scaleRange: [0, 1] // 不使用dataFormatter設定
        })
        return valueScale
      })
    })()

    // const { valueScale } = (() => {
      
    //   const visibleData = transposedDataGrid.flat().filter(d => d._visible != false)
    //   const [minValue, maxValue] = getMinAndMaxValue(visibleData)

    //   const valueAxisWidth = (dataFormatter.grid.valueAxis.position === 'left' || dataFormatter.grid.valueAxis.position === 'right')
    //     ? layout.height
    //     : layout.width

    //   const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
    //     maxValue,
    //     minValue,
    //     axisWidth: valueAxisWidth,
    //     scaleDomain: [minValue, maxValue], // 不使用dataFormatter設定
    //     scaleRange: [0, 1] // 不使用dataFormatter設定
    //   })
    //   return { valueScale }
    // })()
    
    const zeroYArr = transposedDataGrid.map((series, seriesIndex) => {
      return seriesValueScaleArr[seriesIndex]!(0)
    })

    let _index = 0
    computedDataGrid = transposedDataGrid.map((seriesData, seriesIndex) => {
      return seriesData.map((groupDatum, groupIndex) => {
        
        const defaultId = createDefaultDatumId(chartType, gridIndex, seriesIndex, groupIndex)
        // const visible = visibleFilter(groupDatum, seriesIndex, groupIndex, context)
        const groupLabel = groupLabels[groupIndex]
        const valueScale = seriesValueScaleArr[seriesIndex]
        const axisY = valueScale(groupDatum.value ?? 0)
        const zeroY = zeroYArr[seriesIndex]

        const computedDatum: ComputedDatumGrid = {
          id: groupDatum.id ? groupDatum.id : defaultId,
          index: _index,
          label: groupDatum.label ? groupDatum.label : defaultId,
          description: groupDatum.description ?? '',
          // tooltipContent: groupDatum.tooltipContent ? groupDatum.tooltipContent : dataFormatter.tooltipContentFormat(groupDatum, seriesIndex, groupIndex, context),
          data: groupDatum.data,
          value: groupDatum.value,
          // valueLabel: formatValueToLabel(groupDatum.value, dataFormatter.valueFormat),
          gridIndex,
          accSeriesIndex: seriesIndex, // 預設為seriesIndex
          seriesIndex,
          seriesLabel: seriesLabels[seriesIndex],
          groupIndex,
          groupLabel,
          // color: groupDatum._color,
          color: seriesColorPredicate(seriesIndex, chartParams),
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
