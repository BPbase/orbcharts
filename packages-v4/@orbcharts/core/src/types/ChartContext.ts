import type { Observable, Subject } from 'rxjs'
import type {
  RawData,
  Encoding,
  ModelData,
  PluginInfo,
  Theme,
  EventData,
  LayerInfo,
} from './index'

export interface Size {
  width: number
  height: number
}

// 定義可擴展的 context 類型 - 只包含新增的欄位
export interface ExtendableContext {
  // 只能添加新的欄位，不能修改現有的 ChartContext
  [key: string]: Observable<any> | Subject<any> | Function | any
}

export type ChartContext<ExtendContext extends ExtendableContext> = {
  // svgSelection: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  // canvasSelection: d3.Selection<HTMLCanvasElement, unknown, HTMLElement, any>
  root: HTMLElement | Element
  svg: SVGElement | null
  canvas: HTMLCanvasElement | null
  // rawData$: Observable<RawData>
  encoding$: Observable<Encoding>
  seriesData$: Observable<ModelData<'series'>[]>
  gridData$: Observable<ModelData<'grid'>[]>
  multivariateData$: Observable<ModelData<'multivariate'>[]>
  graphData$: Observable<ModelData<'graph'>[]>
  treeData$: Observable<ModelData<'tree'>[]>
  plugins$: Observable<readonly PluginInfo[]>
  theme$: Observable<Theme>
  event$: Observable<EventData>
  eventTrigger$: Subject<EventData>
  size$: Observable<Size>
  _updateLayerElements: <ElementType extends "svg" | "canvas">(elementType: ElementType, fromPluginName: string, fetchLayerInfo: LayerInfo[]) => Record<string, ElementType extends "svg" ? SVGGElement : HTMLCanvasElement>
} & ExtendContext