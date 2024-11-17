import { map, shareReplay } from 'rxjs'
import type { ContextObserverCallback } from '../../lib/core-types'
import { highlightObservable, categoryDataMapObservable, textSizePxObservable } from '../utils/observables'
import {
  nodeListObservable,
  existCategoryLabelsObservable,
  treeVisibleComputedDataObservable
} from '../utils/treeObservables'

export const contextObserverCallback: ContextObserverCallback<'tree'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const nodeList$ = nodeListObservable({
    computedData$: observer.computedData$
  }).pipe(
    shareReplay(1)
  )

  const treeHighlight$ = highlightObservable({
    datumList$: nodeList$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const existCategoryLabels$ = existCategoryLabelsObservable({
    nodeList$,
    fullDataFormatter$: observer.fullDataFormatter$
  }).pipe(
    shareReplay(1)
  )

  const CategoryDataMap$ = categoryDataMapObservable({
    datumList$: nodeList$
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedData$ = treeVisibleComputedDataObservable({
    computedData$: observer.computedData$
  }).pipe(
    shareReplay(1)
  )

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    textSizePx$,
    treeHighlight$,
    existCategoryLabels$,
    CategoryDataMap$,
    visibleComputedData$
  }
}
