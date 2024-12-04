import type { DataMultiValueDatum, ComputedDataFn, ComputedDatumMultiValue } from '../../lib/core-types'
import { formatValueToLabel, createDefaultDatumId } from '../utils/orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale } from '../utils/d3Utils'
import { getMinAndMax } from '../utils/orbchartsUtils'
import { isPlainObject } from '../utils'

export const computedDataFn: ComputedDataFn<'multiValue'> = (context) => {
  const { data, dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }

  // <categoryLabel, categoryIndex>
  const CategoryIndexMap = new Map<string, number>(
    dataFormatter.categoryLabels.map((label, index) => [label, index])
  )

  let computedDataMultiValue: ComputedDatumMultiValue[] = []

  try {
    const dataMultiValue: DataMultiValueDatum[] = data.map((d, i) => {
      if (Array.isArray(d)) {
        return {
          id: '',
          label: '',
          description: '',
          // tooltipContent: '',
          data: {},
          categoryLabel: null,
          value: d
        }
      } else if (isPlainObject(d)) {
        return {
          id: d.id ?? '',
          label: d.label ?? '',
          description: d.description ?? '',
          // tooltipContent: _d.tooltipContent ?? '',
          data: d.data ?? {},
          categoryLabel: d.categoryLabel ??'',
          value: d.value
        }
      } else {
        return {
          id: '',
          label: '',
          description: '',
          // tooltipContent: '',
          data: {},
          categoryLabel: null,
          value: []
        }
      }
    })
  
    // // x軸資料最小及最大值（第二維陣列中的第1筆為x軸資料）
    // const [xMinValue, xMaxValue] = getMinAndMax(dataMultiValue.map(d => d.value[0]))
    // // y軸資料最小及最大值（第二維陣列中的第2筆為y軸資料）
    // const [yMinValue, yMaxValue] = getMinAndMax(dataMultiValue.map(d => d.value[1]))
  
    // // const axisWidth = layout.width - dataFormatter.padding.left - dataFormatter.padding.right
    // // const axisHeight = layout.height - dataFormatter.padding.top - dataFormatter.padding.bottom
    // // const axisWidth = layout.width
    // // const axisHeight = layout.height
    // const xAxisWidth = layout.width
    // const yAxisWidth = layout.height
  
    // const xScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
    //   maxValue: xMaxValue,
    //   minValue: xMinValue,
    //   axisWidth: xAxisWidth,
    //   // scaleDomain: dataFormatter.xAxis.scaleDomain,
    //   // scaleRange: dataFormatter.xAxis.scaleRange
    //   scaleDomain: [xMinValue, xMaxValue],
    //   scaleRange: [0, 1]
    // })
    // const yScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
    //   maxValue: yMaxValue,
    //   minValue: yMinValue,
    //   axisWidth: yAxisWidth,
    //   // scaleDomain: dataFormatter.yAxis.scaleDomain,
    //   // scaleRange: dataFormatter.yAxis.scaleRange
    //   scaleDomain: [yMinValue, yMaxValue],
    //   scaleRange: [0, 1]
    // })

    // const _xScaleDoamin: [number, number] = [
    //   // dataFormatter.xAxis.scaleDomain[0] === 'auto' ? xMinValue : dataFormatter.xAxis.scaleDomain[0],
    //   (() => {
    //     if (dataFormatter.xAxis.scaleDomain[0] === 'auto') {
    //       return xMinValue < 0 ? xMinValue : 0
    //     } else if (dataFormatter.xAxis.scaleDomain[0] === 'min') {
    //       return xMinValue
    //     } else {
    //       return dataFormatter.xAxis.scaleDomain[0]
    //     }
    //   })(),
    //   // dataFormatter.xAxis.scaleDomain[1] === 'auto' ? xMaxValue : dataFormatter.xAxis.scaleDomain[1]
    //   (() => {
    //     if (dataFormatter.xAxis.scaleDomain[1] === 'auto') {
    //       return xMaxValue >= 0 ? xMaxValue : 0
    //     } else if (dataFormatter.xAxis.scaleDomain[1] === 'max') {
    //       return xMaxValue
    //     } else {
    //       return dataFormatter.xAxis.scaleDomain[1]
    //     }
    //   })()
    // ]
    // const _yScaleDoamin: [number, number] = [
    //   // dataFormatter.yAxis.scaleDomain[0] === 'auto' ? yMinValue : dataFormatter.yAxis.scaleDomain[0],
    //   (() => {
    //     if (dataFormatter.yAxis.scaleDomain[0] === 'auto') {
    //       return xMinValue < 0 ? xMinValue : 0
    //     } else if (dataFormatter.yAxis.scaleDomain[0] === 'min') {
    //       return xMinValue
    //     } else {
    //       return dataFormatter.yAxis.scaleDomain[0]
    //     }
    //   })(),
    //   // dataFormatter.yAxis.scaleDomain[1] === 'auto' ? yMaxValue : dataFormatter.yAxis.scaleDomain[1]
    //   (() => {
    //     if (dataFormatter.yAxis.scaleDomain[1] === 'auto') {
    //       return xMaxValue >= 0 ? xMaxValue : 0
    //     } else if (dataFormatter.yAxis.scaleDomain[1] === 'max') {
    //       return xMaxValue
    //     } else {
    //       return dataFormatter.yAxis.scaleDomain[1]
    //     }
    //   })()
    // ]
    
    // // 篩選顯示狀態
    // const visibleFilter = (datum: DataMultiValueDatum, rowIndex: number, columnIndex: number, context: DataFormatterContext<"multiValue">) => {
    //   // 如果不在scale的範圍內則為false，不再做visibleFilter的判斷
    //   if (columnIndex === 0 && datum.value != null && ((datum.value as number) < _xScaleDoamin[0] || datum.value > _xScaleDoamin[1])) {
    //     return false
    //   }
    //   if (columnIndex === 1 && datum.value != null && (datum.value < _yScaleDoamin[0] || datum.value > _yScaleDoamin[1])) {
    //     return false
    //   }
      
    //   return dataFormatter.visibleFilter(datum, rowIndex, columnIndex, context)
    // }
  
    let index = 0
  
    computedDataMultiValue = dataMultiValue.map((d, i) => {
      const currentIndex = index
      index++

      const defaultId = createDefaultDatumId(dataFormatter.type, i)

      const categoryLabel: string | null = d.categoryLabel ?? null
      let categoryIndex = -1
      if (categoryLabel != null && categoryLabel !== '') {
        if (!CategoryIndexMap.has(categoryLabel)) {
          CategoryIndexMap.set(categoryLabel, CategoryIndexMap.size)
        }
        categoryIndex = CategoryIndexMap.get(categoryLabel) ?? -1
      }

      const computedDatum: ComputedDatumMultiValue = {
        id: d.id ? d.id : defaultId,
        index: currentIndex,
        label: d.label ? d.label : defaultId,
        description: d.description ?? '',
        // tooltipContent: _d.tooltipContent ? _d.tooltipContent : dataFormatter.tooltipContentFormat(_d, i, _i, context),
        data: d.data,
        datumIndex: i,
        value: d.value,
        categoryIndex,
        categoryLabel: d.categoryLabel,
        // valueLabel: formatValueToLabel(_d.value, dataFormatter.multiValue[_i].valueFormat),
        // axis: _i == 0 ? xScale(_d.value) : yScale(_d.value),
        visible: true, // 先給預設值
        color: '' // @Q@ 未完成
      }

      computedDatum.visible = dataFormatter.visibleFilter(computedDatum, context)

      return computedDatum
    })
  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return computedDataMultiValue
}