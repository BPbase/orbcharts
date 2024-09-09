import type { DataMultiValue, DataMultiValueDatum } from '../types/DataMultiValue'
import type { DataFormatterContext } from '../types/DataFormatter'
import type { ComputedDataFn } from '../types/ComputedData'
import type { ComputedDataMultiValue, ComputedDatumMultiValue } from '../types/ComputedDataMultiValue'
import { formatValueToLabel, createDefaultDatumId } from '../utils/orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale } from '../utils/d3Utils'
import { getMinAndMaxValue } from '../utils/orbchartsUtils'

export const computeMultiValueData: ComputedDataFn<'multiValue'> = (context) => {
  const { data, dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }

  // @Q@ 假資料待改寫
  const layout = {
    width: 1000,
    height: 1000
  }

  let computedDataMultiValue: ComputedDatumMultiValue[][] = []

  try {
    const dataMultiValue: DataMultiValueDatum[][] = data.map((d, i) => {
      return d.map((_d, _i) => {
        const datum: DataMultiValueDatum = typeof _d === 'number'
          ? {
            id: '',
            label: '',
            description: '',
            // tooltipContent: '',
            data: {},
            categoryLabel: '',
            value: _d
          }
          : {
            id: _d.id ?? '',
            label: _d.label ?? '',
            description: _d.description ?? '',
            // tooltipContent: _d.tooltipContent ?? '',
            data: _d.data ?? {},
            categoryLabel: _d.categoryLabel ??'',
            value: _d.value
          }
        
        return datum
      })
    })
  
    // x軸資料最小及最大值（第二維陣列中的第1筆為x軸資料）
    const [xMinValue, xMaxValue] = getMinAndMaxValue(dataMultiValue.map(d => d[0]))
    // y軸資料最小及最大值（第二維陣列中的第2筆為y軸資料）
    const [yMinValue, yMaxValue] = getMinAndMaxValue(dataMultiValue.map(d => d[1]))
  
    // const axisWidth = layout.width - dataFormatter.padding.left - dataFormatter.padding.right
    // const axisHeight = layout.height - dataFormatter.padding.top - dataFormatter.padding.bottom
    // const axisWidth = layout.width
    // const axisHeight = layout.height
    const xAxisWidth = (dataFormatter.xAxis.position === 'top' || dataFormatter.xAxis.position === 'bottom')
      ? layout.width
      : layout.height
    const yAxisWidth = (dataFormatter.yAxis.position === 'left' || dataFormatter.yAxis.position === 'right')
      ? layout.height
      : layout.width
  
    const xScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: xMaxValue,
      minValue: xMinValue,
      axisWidth: xAxisWidth,
      // scaleDomain: dataFormatter.xAxis.scaleDomain,
      // scaleRange: dataFormatter.xAxis.scaleRange
      scaleDomain: [xMinValue, xMaxValue],
      scaleRange: [0, 1]
    })
    const yScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: yMaxValue,
      minValue: yMinValue,
      axisWidth: yAxisWidth,
      // scaleDomain: dataFormatter.yAxis.scaleDomain,
      // scaleRange: dataFormatter.yAxis.scaleRange
      scaleDomain: [yMinValue, yMaxValue],
      scaleRange: [0, 1]
    })

    const _xScaleDoamin: [number, number] = [
      dataFormatter.xAxis.scaleDomain[0] === 'auto' ? xMinValue : dataFormatter.xAxis.scaleDomain[0],
      dataFormatter.xAxis.scaleDomain[1] === 'auto' ? xMaxValue : dataFormatter.xAxis.scaleDomain[1]
    ]
    const _yScaleDoamin: [number, number] = [
      dataFormatter.yAxis.scaleDomain[0] === 'auto' ? yMinValue : dataFormatter.yAxis.scaleDomain[0],
      dataFormatter.yAxis.scaleDomain[1] === 'auto' ? yMaxValue : dataFormatter.yAxis.scaleDomain[1]
    ]
    
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
      return d.map((_d, _i) => {
        const currentIndex = index
        index++
  
        const defaultId = createDefaultDatumId(dataFormatter.type, i, _i)
  
        const computedDatum: ComputedDatumMultiValue = {
          id: _d.id ? _d.id : defaultId,
          index: currentIndex,
          label: _d.label ? _d.label : defaultId,
          description: _d.description ?? '',
          // tooltipContent: _d.tooltipContent ? _d.tooltipContent : dataFormatter.tooltipContentFormat(_d, i, _i, context),
          data: _d.data,
          value: _d.value,
          categoryIndex: 0, // @Q@ 未完成
          categoryLabel: '', // @Q@ 未完成
          // valueLabel: formatValueToLabel(_d.value, dataFormatter.multiValue[_i].valueFormat),
          axis: _i == 0 ? xScale(_d.value) : yScale(_d.value),
          visible: true, // 先給預設值
          color: '' // @Q@ 未完成
        }

        computedDatum.visible = dataFormatter.visibleFilter(computedDatum, context)

        return computedDatum
      })
    })
  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return computedDataMultiValue
}
