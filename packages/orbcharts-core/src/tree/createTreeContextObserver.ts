import { map, shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../types'
import { highlightObservable, categoryDataMapObservable } from '../utils/observables'
import {
  nodeListObservable,
  existCategoryLabelsObservable,
  treeVisibleComputedDataObservable
} from './treeObservables'

export const createTreeContextObserver: ContextObserverFn<'tree'> = ({ subject, observer }) => {

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
    treeHighlight$,
    existCategoryLabels$,
    CategoryDataMap$,
    visibleComputedData$
  }
}
