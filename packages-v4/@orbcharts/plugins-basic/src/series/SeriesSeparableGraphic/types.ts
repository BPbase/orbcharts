import type { ColorType, ModelDatumSeries } from '../../../../core/src/types'
import type { GraphicContainer, GraphicStyles } from '../../types/PluginParams'

// context
export interface SeriesSeparableGraphicExtendContext {

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

