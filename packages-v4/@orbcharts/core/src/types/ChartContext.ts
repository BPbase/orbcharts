import type { Observable, Subject } from 'rxjs'
import type {
  RawData,
  DataEncoding,
  ModelData,
  PluginInfo,
  Theme,
  EventData,
} from './index'

// 定義可擴展的 context 類型 - 只包含新增的欄位
export interface ExtendableContext {
  // 只能添加新的欄位，不能修改現有的 ChartContext
  [key: string]: Observable<any> | Subject<any> | Function | any
}

export type ChartContext<ExtendContext extends ExtendableContext = {}> = {
  svgSelection: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  canvasSelection: d3.Selection<HTMLCanvasElement, unknown, HTMLElement, any>
  // rawData$: Observable<RawData>
  dataEncoding$: Observable<DataEncoding>
  seriesData$: Observable<ModelData<'series'>>
  gridData$: Observable<ModelData<'grid'>>
  multivariateData$: Observable<ModelData<'multivariate'>>
  graphData$: Observable<ModelData<'graph'>>
  treeData$: Observable<ModelData<'tree'>>
  plugins$: Observable<readonly PluginInfo[]>
  theme$: Observable<Theme>
  event$: Observable<{ data: EventData; event: Event }>
  eventTrigger$: Subject<{ data: EventData; event: Event }>
} & ExtendContext