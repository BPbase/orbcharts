import { Observable, Subject, BehaviorSubject } from 'rxjs'
import type { ChartType } from './Chart'
import type { EventTypeMap } from './Event'
import type { ChartParamsPartial } from './ChartParams'
// import type { Data } from './Data'
import type { DataFormatterPartialTypeMap } from './DataFormatter'
import type { DataTypeMap } from './Data'
import type { DataFormatterTypeMap } from './DataFormatter'
import type { PluginEntity } from './Plugin'

export interface ContextSubject<T extends ChartType> {
  data$: Subject<DataTypeMap<T>>
  dataFormatter$: Subject<DataFormatterPartialTypeMap<T>>
  plugins$: Subject<PluginEntity<T, any, any>[]>
  // pluginParams$: Subject<{[keys: string]: unknown}>
  chartParams$: Subject<ChartParamsPartial>
  event$: Subject<EventTypeMap<T>>
}
