import type { ContainerPluginParams, TooltipParams } from './types'
import type { EventTypeMap, EventBaseSeriesValue, EventBaseGridValue, EventBaseCategoryValue } from '../../lib/core-types'

export const CONTAINER_PLUGIN_PARAMS: ContainerPluginParams = {
  header: {
    height: 36,
    text: [],
    textStyle: []
  },
  footer: {
    height: 0,
    text: [],
    textStyle: []
  }
}

export const TOOLTIP_PARAMS: TooltipParams = {
  backgroundColorType: 'background',
  strokeColorType: 'primary',
  backgroundOpacity: 0.8,
  textColorType: 'primary',
  offset: [20, 5],
  padding: 10,
  textRenderFn: (eventData) => {
    if (eventData.highlightTarget === 'datum' && eventData.datum) {
      return [`${(eventData as EventTypeMap<'series'>).datum.label}: ${(eventData as EventTypeMap<'series'>).datum.value}`]
    } else if (eventData.highlightTarget === 'series') {
      const label = (eventData as EventBaseSeriesValue).seriesLabel
      const valueArr = (eventData as EventBaseSeriesValue).series
        .filter(d => d.visible == true)
        .map(d => {
          return d.value
        })
      const value = valueArr.length > 5
        ? valueArr.slice(0, 5).join(',') + '...'
        : valueArr.join(',')
      return [label, value]
    } else if (eventData.highlightTarget === 'group') {
      const label = (eventData as EventBaseGridValue<'grid'>).groupLabel
      const valueArr = (eventData as EventBaseGridValue<'grid'>).series
        .filter(d => d.visible == true)
        .map(d => {
          return d.value
        })
      const value = valueArr.length > 5
        ? valueArr.slice(0, 5).join(',') + '...'
        : valueArr.join(',')
      return [label, value]
    } else if (eventData.highlightTarget === 'category') {
      const label = (eventData as EventBaseCategoryValue<any>).categoryLabel
      const valueArr = (eventData as EventBaseCategoryValue<'multiValue'>).category
        .filter(d => d.visible == true)
        .map(d => {
          return d.value
        })
      const value = valueArr.length > 5
        ? valueArr.slice(0, 5).join(',') + '...'
        : valueArr.join(',')
      return [label, value]
    }
    return []
  },
  svgRenderFn: null
}
TOOLTIP_PARAMS.textRenderFn.toString = () => `(eventData) => {
  if (eventData.highlightTarget === 'datum' && eventData.datum) {
    return [\`\${eventData.datum.label}: \${eventData.datum.value}\`]
  } else if (eventData.highlightTarget === 'series') {
    const label = (eventData as EventBaseSeriesValue<any, any>).seriesLabel
    const valueArr = (eventData as EventBaseSeriesValue<any, any>).series
      .filter(d => d.visible == true)
      .map(d => {
        return d.value
      })
    const value = valueArr.length > 5
      ? valueArr.slice(0, 5).join(',') + '...'
      : valueArr.join(',')
    return [label, value]
  } else if (eventData.highlightTarget === 'group') {
    const label = (eventData as EventBaseGridValue<any, any>).groupLabel
    const valueArr = (eventData as EventBaseGridValue<any, any>).series
      .filter(d => d.visible == true)
      .map(d => {
        return d.value
      })
    const value = valueArr.length > 5
      ? valueArr.slice(0, 5).join(',') + '...'
      : valueArr.join(',')
    return [label, value]
  } else if (eventData.highlightTarget === 'category') {
    const label = (eventData as EventBaseCategoryValue<any, any>).categoryLabel
    const valueArr = (eventData as EventBaseCategoryValue<any, any>).category
      .filter(d => d.visible == true)
      .map(d => {
        return d.value
      })
    const value = valueArr.length > 5
      ? valueArr.slice(0, 5).join(',') + '...'
      : valueArr.join(',')
    return [label, value]
  }
  return []
}`