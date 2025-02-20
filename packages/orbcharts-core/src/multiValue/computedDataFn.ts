import type { DataMultiValueDatum, ComputedDataFn, ComputedDatumMultiValue } from '../../lib/core-types'
import { createDefaultCategoryLabel, createDefaultDatumId, seriesColorPredicate } from '../utils/orbchartsUtils'
import { isPlainObject } from '../utils'

export const computedDataFn: ComputedDataFn<'multiValue'> = (context) => {
  const { data, dataFormatter, chartParams } = context
  if (!data.length) {
    return []
  }

  const defaultCategoryLabel = createDefaultCategoryLabel()

  let computedDataMultiValue: ComputedDatumMultiValue[][] = []

  try {
    const dataMultiValue: DataMultiValueDatum[] = data.map((d, i) => {
      if (Array.isArray(d)) {
        return {
          id: '',
          label: '',
          description: '',
          // tooltipContent: '',
          data: {},
          categoryLabel: defaultCategoryLabel,
          value: d
        }
      } else if (isPlainObject(d)) {
        return {
          id: d.id ?? '',
          label: d.label ?? '',
          description: d.description ?? '',
          // tooltipContent: _d.tooltipContent ?? '',
          data: d.data ?? {},
          categoryLabel: d.categoryLabel ?? defaultCategoryLabel,
          value: d.value
        }
      } else {
        return {
          id: '',
          label: '',
          description: '',
          // tooltipContent: '',
          data: {},
          categoryLabel: defaultCategoryLabel,
          value: []
        }
      }
    })

    const categoryLabels = (() => {
      // 先使用 dataFormatter.categoryLabels
      const CategoryLabelsSet = new Set(dataFormatter.categoryLabels)
      // 再加入 datum 中的 categoryLabel
      for (let datum of dataMultiValue) {
        const categoryLabel = datum.categoryLabel ?? defaultCategoryLabel
        CategoryLabelsSet.add(categoryLabel) // 不重覆
      }
      return Array.from(CategoryLabelsSet)
    })()
    
    // <categoryLabel, categoryIndex>
    const CategoryIndexMap = new Map<string, number>(
      categoryLabels.map((label, index) => [label, index])
    )

  
    let index = 0
  
    dataMultiValue.forEach((d, i) => {
      const currentIndex = index
      index++

      const defaultId = createDefaultDatumId(dataFormatter.type, i)

      const categoryIndex = CategoryIndexMap.get(d.categoryLabel) ?? 0

      const color = seriesColorPredicate(categoryIndex, chartParams)

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
        xValueIndex: dataFormatter.xAxis.valueIndex,
        yValueIndex: dataFormatter.yAxis.valueIndex,
        // valueLabel: formatValueToLabel(_d.value, dataFormatter.multiValue[_i].valueFormat),
        // axis: _i == 0 ? xScale(_d.value) : yScale(_d.value),
        visible: true, // 先給預設值
        color,
        _visibleValue: d.value // 預設和value相同
      }

      computedDatum.visible = dataFormatter.visibleFilter(computedDatum, context)

      // 依 categoryIndex 分組
      if (!computedDataMultiValue[categoryIndex]) {
        computedDataMultiValue[categoryIndex] = []
      }
      computedDataMultiValue[categoryIndex].push(computedDatum)
    })
  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return computedDataMultiValue
}
