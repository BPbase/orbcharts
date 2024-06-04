import type { ContainerPluginParams, TooltipParams } from './types'
import type { EventSeries, EventGrid } from '@orbcharts/core'

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
      return [`${eventData.datum.label}: ${eventData.datum.value}`]
    } else if (eventData.highlightTarget === 'series') {
      const label = (eventData as EventSeries).seriesLabel
      const value = (eventData as EventSeries).series
        .map(d => {
          return d.value
        })
        .join(',')
      return [label, value]
    } else if (eventData.highlightTarget === 'group') {
      const label = (eventData as EventGrid).groupLabel
      const value = (eventData as EventGrid).groups
        .map(d => {
          return d.value
        })
        .join(',')
      return [label, value]
    }
    return []
  },
  svgRenderFn: null
}
