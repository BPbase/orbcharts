import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDatumSeries } from './ComputedDataSeries'

export interface ContextObserverSeries<PluginParams> extends ContextObserverBase<'series', PluginParams> {
  seriesHighlight$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
}