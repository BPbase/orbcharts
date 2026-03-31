
import { Observable } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '@orbcharts/core'
import type { GraphicStyles, Layout, VisibleFilter } from '../../types/PluginParams'
import { ComputedDatum, ComputedDatumSeries } from '../../types/ComputedData'
import { BaseTooltipStyle, BaseTooltipUtils } from '../../baseLayers/types'

// context
export interface TooltipExtendContext {
  layout$: Observable<Layout>
  fontSizePx$: Observable<number>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  CategoryDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
}

// plugin params
export interface TooltipPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'series'>
  sort: ((a: ModelDatumSeries, b: ModelDatumSeries) => number) | null
  // container: Container
  // separateSeries: boolean
  // separateName: boolean
  datasetIndex: number
}

// all layer params
export interface TooltipAllLayerParams {
  Tooltip: TooltipParams
}

// -- layer params --

export interface TooltipParams {
  backgroundColorType: ColorType
  backgroundOpacity: number
  strokeColorType: ColorType
  textColorType: ColorType
  offset: [number, number]
  padding: number
  // textRenderFn: (<T extends ChartType>(eventData: EventTypeMap<T>) => string[] | string) | null
  // svgRenderFn: (<T extends ChartType>(eventData: EventTypeMap<T>) => string) | null
  renderFn: (
    (
      eventData: EventData,
      context: {
        styles: BaseTooltipStyle
        utils: BaseTooltipUtils
        seriesData: ComputedDatum<'series'>[]
        categoryData: ComputedDatum<'series'>[]
      }
    ) => string[] | string
  )
}

