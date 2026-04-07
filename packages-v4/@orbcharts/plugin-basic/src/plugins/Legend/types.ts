
import { Observable } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '@orbcharts/core'
import type { GraphicStyles, Layout } from '../../types/PluginParams'
import { ComputedDatumSeries } from '../../types/ComputedData'
import type { Placement } from '../../types/Common'

// context
export interface LegendExtendContext {
  layout$: Observable<Layout>
  fontSizePx$: Observable<number>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
}

// plugin params
export interface LegendPluginParams {
  styles: GraphicStyles
  visibleFilter: (datum: ModelDatumSeries) => boolean | null
  sort: ((a: ModelDatumSeries, b: ModelDatumSeries) => number) | null
  // container: Container
  // separateSeries: boolean
  // separateName: boolean
  datasetIndex: number
}

// all layer params
export interface LegendAllLayerParams {
  Legend: LegendLegendParams
}

// -- layer params --

export interface LegendLegendParams {
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
