import type { ComputedDatumSeries, EventSeries, EventName, ColorType } from '@orbcharts/core'
import type {
  BubblesParams,
  PieParams,
  PieEventTextsParams,
  PieLabelsParams,
  RoseParams,
  RoseLabelsParams,
  SeriesLegendParams } from './types'

  
export const DEFAULT_BUBBLES_PARAMS: BubblesParams = {
  force: {
    strength: 0.08, // 泡泡引力
    velocityDecay: 0.3, // 衰減數
    collisionSpacing: 2 // 泡泡間距
  },
  bubbleText: {
    fillRate: 0.6,
    lineHeight: 12,
    lineLengthMin: 4
  },
  // highlightRIncrease: 0,
  arcScaleType: 'area'
}

export const DEFAULT_PIE_PARAMS: PieParams = {
  // padding: {
  //   top: 50,
  //   right: 70,
  //   bottom: 50,
  //   left: 70
  // },
  outerRadius: 0.95,
  innerRadius: 0,
  outerRadiusWhileHighlight: 1,
  // label?: LabelStyle
  // enterDuration: 800,
  startAngle: 0,
  endAngle: Math.PI * 2,
  padAngle: 0.02,
  // padRadius: 100,
  cornerRadius: 0,
  // highlightTarget: 'datum',
  // highlightId: null,
  // highlightLabel: null,
}

export const DEFAULT_PIE_EVENT_TEXTS_PARAMS: PieEventTextsParams = {
  eventFn: (eventData: EventSeries, eventName: EventName, t: number) => {
    if (eventName === 'mouseover' || eventName === 'mousemove') {
      return [String(eventData.datum!.value)]
    }
    return [
      String(
        Math.round(
          eventData.data.reduce((acc, seriesData) => {
            return acc + seriesData.reduce((_acc, data) => {
              return _acc + (data.value ?? 0)
            }, 0)
          }, 0) * t
        )
      )
    ]
  },
  textAttrs: [
    {
      "transform": "translate(0, 0)"
    }
  ],
  textStyles: [
    {
      "font-weight": "bold",
      "text-anchor": "middle",
      "pointer-events": "none",
      "dominant-baseline": "middle",
      "font-size": 64,
      "fill": "#000"
    }
  ]
}
DEFAULT_PIE_EVENT_TEXTS_PARAMS.eventFn.toString = () => `(eventData: EventSeries, eventName: EventName, t: number) => {
  if (eventName === 'mouseover' || eventName === 'mousemove') {
    return [String(eventData.datum!.value)]
  }
  return [
    String(
      Math.round(
        eventData.data.reduce((acc, seriesData) => {
          return acc + seriesData.reduce((_acc, data) => {
            return _acc + (data.value ?? 0)
          }, 0)
        }, 0) * t
      )
    )
  ]
}`

export const DEFAULT_PIE_LABELS_PARAMS: PieLabelsParams = {
  // solidColor: undefined,
  // colors: DEFAULT_COLORS,
  outerRadius: 0.95,
  outerRadiusWhileHighlight: 1,
  // innerRadius: 0,
  // enterDuration: 800,
  startAngle: 0,
  endAngle: Math.PI * 2,
  labelCentroid: 2.3,
  // fontSize: 12,
  labelColorType: 'primary',
  labelFn: d => String(d.label),
}
DEFAULT_PIE_LABELS_PARAMS.labelFn.toString = () => `d => String(d.label)`

export const DEFAULT_ROSE_PARAMS: RoseParams = {
  outerRadius: 0.95,
  cornerRadius: 0,
  arcScaleType: 'area',
  mouseoverAngleIncrease: 0.05
}

export const DEFAULT_ROSE_LABELS_PARAMS: RoseLabelsParams = {
  outerRadius: 0.95,
  labelCentroid: 2.5,
  labelFn: d => String(d.label),
  labelColorType: 'primary',
  arcScaleType: 'area'
}
DEFAULT_ROSE_LABELS_PARAMS.labelFn.toString = () => `d => String(d.label)`

export const DEFAULT_SERIES_LEGEND_PARAMS: SeriesLegendParams = {
  position: 'right',
  justify: 'end',
  padding: 28,
  // offset: [0, 0],
  backgroundFill: 'none',
  backgroundStroke: 'none',
  gap: 10,
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
  // highlightEvent: false
  textColorType: 'primary'
}
