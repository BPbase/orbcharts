import * as d3 from 'd3'
import { Observable, BehaviorSubject } from 'rxjs'
import type { ColorType, Theme } from '@orbcharts/core'
import type {
  ContainerPositionScaled,
  GraphicStyles,
  Layout,
  VisibleFilter
} from '../../types/PluginParams'
import type { ComputedDatumGrid } from '../../types/ComputedData'
import type { ContainerSize } from '../../types/Common'

// ---- context ----

export interface RacingPlotExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedDatumGrid[][]>
  fontSizePx$: Observable<number>
  containerSize$: Observable<ContainerSize>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  CategoryDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  // racing-specific
  currentFrameIndex$: BehaviorSubject<number>
  maxFrameIndex$: Observable<number>
  currentFrameLabel$: Observable<string>
  xScale$: Observable<(n: number) => number>
  racingRankedSeriesData$: Observable<ComputedDatumGrid[][]>
  computedRankedAmount$: Observable<number>
  rankedItemHeight$: Observable<number>
  rankedScaleList$: Observable<d3.ScalePoint<string>[]>
}

// ---- plugin params ----

export interface RacingPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'grid'>
  datasetIndex: number
  // valueAxis: {
  //   position: 'top' | 'bottom'
  // }
  rankedAxis: {
    label: string
    limit: number | 'auto'
  }
  autorun: boolean
  loop: boolean
  frameInterval: number
}

// ---- all layer params ----

export interface RacingPlotAllLayerParams {
  RacingBar: RacingPlotRacingBarParams
  ValueLabel: RacingPlotValueLabelParams
  SeriesLabel: RacingPlotSeriesLabelParams
  CounterText: RacingPlotCounterTextParams
  ValueAxis: RacingPlotValueAxisParams
}

// ---- layer params ----

export interface RacingPlotRacingBarParams {
  barWidth: number | null
  barPadding: number
  barRadius: number | boolean
}

export interface RacingPlotValueLabelParams {
  padding: number
  colorType: ColorType
  format: string | ((n: number | d3.NumberValue) => string | d3.NumberValue)
}

export interface RacingPlotSeriesLabelParams {
  axisLabel: {
    offset: [number, number]
    colorType: ColorType
  }
  seriesLabel: {
    position: 'inside-left' | 'inside-right' | 'outside'
    padding: number
    colorType: ColorType
  }
}

export interface RacingPlotCounterTextParams {
  renderFn: (
    categoryLabel: string,
    frameIndex: number,
    data: ComputedDatumGrid[][]
  ) => string[] | string
  textAttrs: Array<{ [key: string]: string | number }>
  textStyles: Array<{ [key: string]: string | number }>
  paddingRight: number
  paddingBottom: number
}

export interface RacingPlotValueAxisParams {
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number | null
  tickFormat: string | ((n: number | d3.NumberValue) => string | d3.NumberValue)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  tickTextColorType: ColorType
  placement: 'top' | 'bottom'
}
