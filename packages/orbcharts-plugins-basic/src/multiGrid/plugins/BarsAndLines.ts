import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Subject,
  Observable } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
// import { defineMultiGridPlugin } from '../../../../orbcharts-core/src'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { DEFAULT_BARS_AND_LINES_PARAMS } from '../defaults'
import { createBaseBars } from '../../base/BaseBars'
import { createBaseLines } from '../../base/BaseLines'

const pluginName = 'BarsAndLines'
const barsClassName = getClassName(pluginName, 'bars')
const linesClassName = getClassName(pluginName, 'lines')

export const BarsAndLines = defineMultiGridPlugin(pluginName, DEFAULT_BARS_AND_LINES_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const barsSelection = selection.append('g').attr('class', barsClassName)
  const linesSelection = selection.append('g').attr('class', linesClassName)

  let unsubscribeBaseBars = () => {}
  let unsubscribeBaseLines = () => {}

  // combineLatest({
  //   fullParams: observer.fullParams$,
  //   fullChartParams: observer.fullChartParams$,
  //   computedData: observer.computedData$,
  //   event: subject.event$,
  //   multiGrid: observer.multiGrid$,
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d)
  // ).subscribe(data => {
    
  // })

  const barsComputedData$ = observer.computedData$.pipe(
    map((computedData) => computedData[0] || [])
  )

  const linesComputedData$ = observer.computedData$.pipe(
    map((computedData) => computedData[1] || [])
  )

  const barsFullParams$ = observer.fullParams$.pipe(
    map((fullParams) => fullParams.bars)
  )

  const linesFullParams$ = observer.fullParams$.pipe(
    map((fullParams) => fullParams.lines)
  )

  const linesFullDataFormatter$ = observer.fullDataFormatter$.pipe(
    map((fullDataFormatter) => fullDataFormatter.multiGrid[1])
  )

  observer.multiGrid$.subscribe((multiGrid) => {
    // bars
    if (multiGrid[0]) {
      unsubscribeBaseBars = createBaseBars(pluginName, {
        selection: barsSelection,
        computedData$: barsComputedData$,
        visibleComputedData$: multiGrid[0].visibleComputedData$,
        SeriesDataMap$: multiGrid[0].SeriesDataMap$,
        GroupDataMap$: multiGrid[0].GroupDataMap$,
        fullParams$: barsFullParams$,
        fullChartParams$: observer.fullChartParams$,
        gridAxesTransform$: multiGrid[0].gridAxesTransform$,
        gridGraphicTransform$: multiGrid[0].gridGraphicTransform$,
        gridAxesSize$: multiGrid[0].gridAxesSize$,
        gridHighlight$: multiGrid[0].gridHighlight$,
        event$: subject.event$ as Subject<any>,
      })
    } else {
      unsubscribeBaseBars()
    }
    // lines
    if (multiGrid[1]) {
      unsubscribeBaseLines = createBaseLines(pluginName, {
        selection: linesSelection,
        computedData$: linesComputedData$,
        SeriesDataMap$: multiGrid[1].SeriesDataMap$,
        GroupDataMap$: multiGrid[1].GroupDataMap$,
        fullParams$: linesFullParams$,
        fullDataFormatter$: linesFullDataFormatter$,
        fullChartParams$: observer.fullChartParams$,
        gridAxesTransform$: multiGrid[1].gridAxesTransform$,
        gridGraphicTransform$: multiGrid[1].gridGraphicTransform$,
        gridAxesSize$: multiGrid[1].gridAxesSize$,
        gridHighlight$: multiGrid[1].gridHighlight$,
        event$: subject.event$ as Subject<any>,
      })
    } else {
      unsubscribeBaseLines()
    }
  })

  

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
    unsubscribeBaseLines()
  }
})
