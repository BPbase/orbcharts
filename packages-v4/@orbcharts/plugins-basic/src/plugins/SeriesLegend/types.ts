
import { Observable } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '../../../../core/src/types'
import type { GraphicStyles, Layout } from '../../types/PluginParams'
import { ComputedDatumSeries } from '../../types/ComputedData'
import type { Placement } from '../../types/Common'

// context
export interface SeriesLegendExtendContext {
  layout$: Observable<Layout>
  fontSizePx$: Observable<number>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
}

// plugin params
export interface SeriesLegendPluginParams {
  styles: GraphicStyles
  visibleFilter: (datum: ModelDatumSeries) => boolean | null
  sort: ((a: ModelDatumSeries, b: ModelDatumSeries) => number) | null
  // container: Container
  // separateSeries: boolean
  // separateName: boolean
  datasetIndex: number
}

// all layer params
export interface SeriesLegendAllLayerParams {
  SeriesLegend: SeriesLegendParams
}

// -- layer params --

export interface SeriesLegendParams {
  // position: 'top' | 'bottom' | 'left' | 'right'
  // justify: 'start' | 'center' | 'end'
  placement: Placement
  padding: number
  backgroundFill: ColorType
  backgroundStroke: ColorType
  gap: number
  listRectWidth: number
  listRectHeight: number
  listRectRadius: number
  textColorType: ColorType
}
