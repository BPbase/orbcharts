import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDatumSeries } from './ComputedDataSeries'

export interface ContextObserverSeries<PluginParams> extends ContextObserverBase<'series', PluginParams> {
  textSizePx$: Observable<number>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  seriesContainerPosition$: Observable<SeriesContainerPosition[]>
}

export interface SeriesContainerPosition {
  slotIndex: number
  rowIndex: number
  columnIndex: number
  // translate: [number, number]
  startX: number
  startY: number
  centerX: number
  centerY: number
  width: number
  height: number
}
