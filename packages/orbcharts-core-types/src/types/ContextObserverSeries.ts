import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDatumSeries } from './ComputedDataSeries'
import type { ContainerPosition} from './ContextObserver'

export interface ContextObserverSeries<PluginParams> extends ContextObserverBase<'series', PluginParams> {
  textSizePx$: Observable<number>
  separateSeries$: Observable<boolean>
  separateLabel$: Observable<boolean>
  sumSeries$: Observable<boolean>
  // visibleComputedData$: Observable<ComputedDatumSeries[][]>
  computedSortedData$: Observable<ComputedDatumSeries[][]>
  visibleComputedSortedData$: Observable<ComputedDatumSeries[][]>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  seriesContainerPosition$: Observable<ContainerPosition[]>
  DatumContainerPositionMap$: Observable<Map<string, ContainerPosition>>
}

// export interface SeriesContainerPosition {
//   slotIndex: number
//   rowIndex: number
//   columnIndex: number
//   // translate: [number, number]
//   startX: number
//   startY: number
//   centerX: number
//   centerY: number
//   width: number
//   height: number
// }
