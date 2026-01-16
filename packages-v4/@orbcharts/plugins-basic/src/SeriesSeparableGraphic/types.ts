import type { ColorType, ModelDatumSeries } from '../../../core/src/types'

// context
export interface SeriesSeparableGraphicExtendContext {

}

export interface GraphicContainer {
  // gap: number
  columnAmount: number
  rowAmount: number
  columnGap: number | 'auto'
  rowGap: number | 'auto'
}

// plugin params
export interface SeriesSeparableGraphicPluginParams {
  visibleFilter: (datum: ModelDatumSeries) => boolean | null
  sort: ((a: ModelDatumSeries, b: ModelDatumSeries) => number) | null
  seriesLabels: string[]
  container: GraphicContainer
  separateSeries: boolean
  separateLabel: boolean
  sumSeries: boolean
}

// all layer params
export interface SeriesSeparableGraphicAllLayerParams {
  Pie: PieParams
}

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

