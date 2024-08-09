import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Subject,
  Observable } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DATA_FORMATTER_MULTI_GRID_DEFAULT } from '@orbcharts/core/src/defaults'
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

  // const barsSelection = selection.append('g').attr('class', barsClassName)
  // const linesSelection = selection.append('g').attr('class', linesClassName)

  const barsSelection$ = observer.multiGridContainer$.pipe(
    takeUntil(destroy$),
    map(multiGridContainer => {
      // console.log('multiGridContainer', multiGridContainer)
      const barsSelection = selection
        .selectAll(`g.${barsClassName}`)
        .data(multiGridContainer[0] ? [multiGridContainer[0]] : [])
        .join('g')
        .attr('class', barsClassName)
      barsSelection
        .transition()
        .attr('transform', d => `translate(${d.translate[0]}, ${d.translate[1]}) scale(${d.scale[0]}, ${d.scale[1]})`)
      return barsSelection
    })
  )
  const linesSelection$ = observer.multiGridContainer$.pipe(
    takeUntil(destroy$),
    map(multiGridContainer => {
      const linesSelection = selection
        .selectAll(`g.${linesClassName}`)
        .data(multiGridContainer[1] ? [multiGridContainer[1]] : [])
        .join('g')
        .attr('class', linesClassName)
      linesSelection
        .transition()
        .attr('transform', d => `translate(${d.translate[0]}, ${d.translate[1]}) scale(${d.scale[0]}, ${d.scale[1]})`)
      return linesSelection
    })
  )

  // observer.fullDataFormatter$.subscribe(d => {
  //   console.log('fullDataFormatter$', d)
  // })
  // observer.multiGridContainer$.subscribe(d => {
  //   console.log('multiGridContainer$', d)
  // })

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
    takeUntil(destroy$),
    map((computedData) => computedData[0] || [])
  )

  const linesComputedData$ = observer.computedData$.pipe(
    takeUntil(destroy$),
    map((computedData) => computedData[1] || [])
  )

  const barsFullParams$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map((fullParams) => fullParams.bars)
  )

  const linesFullParams$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map((fullParams) => fullParams.lines)
  )

  const defaultFullDataFormatter$ = observer.fullDataFormatter$.pipe(
    takeUntil(destroy$),
    map((fullDataFormatter) => fullDataFormatter.multiGrid[0] || DATA_FORMATTER_MULTI_GRID_DEFAULT.multiGrid[0])
  )

  const linesFullDataFormatter$ = combineLatest({
    fullDataFormatter: observer.fullDataFormatter$,
    defaultFullDataFormatter: defaultFullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    map((data) => {
      return data.fullDataFormatter.multiGrid[1] ?? data.defaultFullDataFormatter
    })
  )

  combineLatest({
    multiGridEachDetail: observer.multiGridEachDetail$,
    barsSelection: barsSelection$,
    linesSelection: linesSelection$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    // bars
    if (data.multiGridEachDetail[0]) {
      unsubscribeBaseBars = createBaseBars(pluginName, {
        selection: data.barsSelection,
        computedData$: barsComputedData$,
        visibleComputedData$: data.multiGridEachDetail[0].visibleComputedData$,
        SeriesDataMap$: data.multiGridEachDetail[0].SeriesDataMap$,
        GroupDataMap$: data.multiGridEachDetail[0].GroupDataMap$,
        fullParams$: barsFullParams$,
        fullChartParams$: observer.fullChartParams$,
        gridAxesTransform$: data.multiGridEachDetail[0].gridAxesTransform$,
        gridGraphicTransform$: data.multiGridEachDetail[0].gridGraphicTransform$,
        gridAxesSize$: data.multiGridEachDetail[0].gridAxesSize$,
        gridHighlight$: data.multiGridEachDetail[0].gridHighlight$,
        event$: subject.event$ as Subject<any>,
      })
    } else {
      unsubscribeBaseBars()
    }
    // lines
    if (data.multiGridEachDetail[1]) {
      unsubscribeBaseLines = createBaseLines(pluginName, {
        selection: data.linesSelection,
        computedData$: linesComputedData$,
        SeriesDataMap$: data.multiGridEachDetail[1].SeriesDataMap$,
        GroupDataMap$: data.multiGridEachDetail[1].GroupDataMap$,
        fullParams$: linesFullParams$,
        fullDataFormatter$: linesFullDataFormatter$,
        fullChartParams$: observer.fullChartParams$,
        gridAxesTransform$: data.multiGridEachDetail[1].gridAxesTransform$,
        gridGraphicTransform$: data.multiGridEachDetail[1].gridGraphicTransform$,
        gridAxesSize$: data.multiGridEachDetail[1].gridAxesSize$,
        gridHighlight$: data.multiGridEachDetail[1].gridHighlight$,
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
