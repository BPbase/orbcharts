import { map, shareReplay } from 'rxjs'
import type { ContextObserverCallback } from '../../lib/core-types'
import { highlightObservable, categoryDataMapObservable, textSizePxObservable } from '../utils/observables'
import {
  categoryLabelsObservable,
  NodeMapObservable,
  EdgeMapObservable,
  relationshipVisibleComputedDataObservable
} from './relationshipObservables'

export const contextObserverCallback: ContextObserverCallback<'relationship'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const relationshipHighlightNodes$ = highlightObservable({
    datumList$: observer.computedData$.pipe(map(data => data.nodes)),
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const relationshipHighlightEdges$ = highlightObservable({
    datumList$: observer.computedData$.pipe(map(data => data.edges)),
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const CategoryNodeMap$ = categoryDataMapObservable({
    datumList$: observer.computedData$.pipe(map(data => data.nodes))
  }).pipe(
    shareReplay(1)
  )

  const CategoryEdgeMap$ = categoryDataMapObservable({
    datumList$: observer.computedData$.pipe(map(data => data.edges))
  }).pipe(
    shareReplay(1)
  )

  const NodeMap$ = NodeMapObservable(observer.computedData$).pipe(
    shareReplay(1)
  )

  const EdgeMap$ = EdgeMapObservable(observer.computedData$).pipe(
    shareReplay(1)
  )

  const categoryLabels$ = categoryLabelsObservable(CategoryNodeMap$, CategoryEdgeMap$).pipe(
    shareReplay(1)
  )

  const visibleComputedData$ = relationshipVisibleComputedDataObservable({
    computedData$: observer.computedData$,
    NodeMap$
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
    relationshipHighlightNodes$,
    relationshipHighlightEdges$,
    categoryLabels$,
    CategoryNodeMap$,
    CategoryEdgeMap$,
    NodeMap$,
    EdgeMap$,
    visibleComputedData$
  }
}
