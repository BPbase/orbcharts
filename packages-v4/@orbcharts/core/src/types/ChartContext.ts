import type { Observable, Subject } from 'rxjs'
import type {
  RawData,
  DataEncoding,
  ModelData,
  PluginInfo,
  Theme,
  EventData,
} from './index'

export type ChartContext<ExtendContext extends Record<string, any> = {}> = {
  // rawData$: Observable<RawData>
  fullDataEncoding$: Observable<DataEncoding>
  seriesData$: Observable<ModelData<'series'>>
  gridData$: Observable<ModelData<'grid'>>
  multivariateData$: Observable<ModelData<'multivariate'>>
  graphData$: Observable<ModelData<'graph'>>
  treeData$: Observable<ModelData<'tree'>>
  plugins$: Observable<readonly PluginInfo[]>
  fullTheme$: Observable<Theme>
  event$: Observable<{ data: EventData; event: Event }>
  eventTrigger$: Subject<{ data: EventData; event: Event }>
} & ExtendContext