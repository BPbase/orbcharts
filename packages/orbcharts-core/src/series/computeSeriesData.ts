import type { DataSeries, DataSeriesDatum } from '../types/DataSeries'
import type { ComputedDataFn } from '../types/ComputedData'
import type { ComputedDatumSeries } from '../types/ComputedDataSeries'
import { formatValueToLabel, createDefaultDatumId, createDefaultSeriesLabel, seriesColorPredicate } from '../utils/orbchartsUtils'

export const computeSeriesData: ComputedDataFn<'series'> = (context) => {
  const { data = [], dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }

  let computedDataSeries: ComputedDatumSeries[][] = []
  
  try {

    const createComputedDatumSeries = (seriesData: number | DataSeriesDatum, seriesIndex: number, itemIndex: number, currentIndex: number): ComputedDatumSeries => {
      const defaultId = createDefaultDatumId(dataFormatter.type, seriesIndex, itemIndex)
      const seriesLabel = dataFormatter.seriesLabels[seriesIndex] || createDefaultSeriesLabel('series', seriesIndex)
      const color = seriesColorPredicate(seriesIndex, chartParams)
      if (typeof seriesData === 'number') {
        return {
          id: defaultId,
          index: currentIndex,
          seq: 0, // 先給預設值
          label: defaultId,
          description: '',
          data: {},
          value: seriesData,
          seriesIndex: seriesIndex,
          seriesLabel,
          color,
          visible: true // 先給預設值
        }
      } else {
        return {
          id: seriesData.id ? seriesData.id : defaultId,
          index: currentIndex,
          seq: 0, // 先給預設值
          label: seriesData.label ? seriesData.label : defaultId,
          description: seriesData.description,
          data: seriesData.data ?? {},
          value: seriesData.value,
          seriesIndex: seriesIndex,
          seriesLabel,
          color,
          visible: true // 先給預設值
        }
      }
    }
    
    computedDataSeries = data
      .map((seriesData, seriesIndex) => {
        if (Array.isArray(seriesData)) {
          return seriesData.map((item, itemIndex) => 
            createComputedDatumSeries(item, seriesIndex, itemIndex, computedDataSeries.length + itemIndex)
          )
        } else {
          return createComputedDatumSeries(seriesData, seriesIndex, 0, computedDataSeries.length)
        }
      })
      // 攤為一維陣列
      .flat()
      // 排序後給 seq
      .sort(dataFormatter.sort ?? undefined)
      .map((datum, index) => {
        datum.seq = index
        return datum
      })
      .map(datum => {
        datum.visible = dataFormatter.visibleFilter(datum, context)
        return datum
      })
      // 恢復原排序
      .sort((a, b) => a.index - b.index)
      // 依seriesIndex分組（二維陣列）
      .reduce((acc, datum) => {
        if (!acc[datum.seriesIndex]) {
          acc[datum.seriesIndex] = []
        }
        acc[datum.seriesIndex].push(datum)
        return acc
      }, [])

  } catch (e) {
    // console.error(e)
    throw Error(e)
  }
  
  return computedDataSeries
}
