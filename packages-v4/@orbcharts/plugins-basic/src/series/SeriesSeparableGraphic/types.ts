
import { Observable } from 'rxjs'
import type { ColorType, ModelDatumSeries } from '../../../../core/src/types'
import type { ContainerPosition, GraphicContainer, GraphicStyles, Layout } from '../../types/PluginParams'
import { ComputedDatumSeries } from '../../types/ComputedData'
import type { ArcScaleType } from '../../types/Common'

// context
export interface SeriesSeparableGraphicExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedDatumSeries[][]>
  fontSizePx$: Observable<number>
  datumLabels$: Observable<string[]>
  separateSeries$: Observable<boolean>
  separateName$: Observable<boolean>
  computedSortedData$: Observable<ComputedDatumSeries[][]>
  visibleComputedSortedData$: Observable<ComputedDatumSeries[][]>
  datumList$: Observable<ComputedDatumSeries[]>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  seriesContainerPosition$: Observable<ContainerPosition[]>
  DatumContainerPositionMap$: Observable<Map<string, ContainerPosition>>
}

// plugin params
export interface SeriesSeparableGraphicPluginParams {
  styles: GraphicStyles
  visibleFilter: (datum: ModelDatumSeries) => boolean | null
  sort: ((a: ModelDatumSeries, b: ModelDatumSeries) => number) | null
  // seriesLabels: string[]
  container: GraphicContainer
  separateSeries: boolean
  separateName: boolean
  // sumSeries: boolean
  datasetIndex: number
}

// all layer params
export interface SeriesSeparableGraphicAllLayerParams {
  Pie: PieParams
  Bubbles: BubblesParams
}

// -- shared types --
export interface ComputedDatum extends ModelDatumSeries {
  visible: boolean
  seq: number
}

// -- layer params --
export interface PieParams {
  outerRadius: number;
  innerRadius: number;
  outerRadiusWhileHighlight: number;
  startAngle: number;
  endAngle: number;
  padAngle: number;
  strokeColorType: ColorType;
  strokeWidth: number;
  cornerRadius: number;
}

export interface BubblesParams {
  force: {
    strength: number; // 泡泡引力
    velocityDecay: number; // 衰減數
    collisionSpacing: number // 泡泡間距
  }
  bubbleLabel: {
    labelFn: ((d: ComputedDatumSeries) => string)
    colorType: ColorType
    fillRate: number
    lineHeight: number
    maxLineLength: number
    wordBreakAll: boolean
  }
  // highlightRIncrease: number
  arcScaleType: ArcScaleType
}
