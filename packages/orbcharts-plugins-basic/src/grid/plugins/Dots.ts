import * as d3 from 'd3'
import {
  Observable,
  combineLatest,
  switchMap,
  distinctUntilChanged,
  filter,
  first,
  map, 
  takeUntil,
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import type {
  ChartParams,
  ComputedDatumGrid,
  Layout } from '@orbcharts/core'
import type { DotsParams } from '../types'
import { DEFAULT_DOTS_PLUGIN_PARAMS } from '../defaults'
import { getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'Dots'
const gClassName = getClassName(pluginName, 'g')
const circleClassName = getClassName(pluginName, 'circle')

function renderDots ({ selection, data, fullParams, fullChartParams, graphicOppositeScale }: {
  selection: d3.Selection<SVGGElement, any, any, any>
  data: ComputedDatumGrid[]
  fullParams: DotsParams
  fullChartParams: ChartParams
  graphicOppositeScale: [number, number]
}) {
  const createEnterDuration = (enter: d3.Selection<d3.EnterElement, ComputedDatumGrid, SVGGElement, any>) => {
    const enterSize = enter.size()
    const eachDuration = fullChartParams.transitionDuration / enterSize
    return eachDuration
  }
  // enterDuration
  let enterDuration = 0
  
  const dots = selection
    .selectAll<SVGGElement, ComputedDatumGrid>('g')
    .data(data, d => d.id)
    .join(
      enter => {
        // enterDuration
        enterDuration = createEnterDuration(enter)

        return enter
          .append('g')
          .classed(gClassName, true)     
      },
      update => update,
      exit => exit.remove()
    )
    .attr('transform', d => `translate(${d.axisX}, ${d.axisY})`)
    .each((d, i, g) => {
      const circle = d3.select(g[i])
        .selectAll('circle')
        .data([d])
        .join(
          enter => {
            return enter
              .append('circle')
              .style('cursor', 'pointer')
              .style('vector-effect', 'non-scaling-stroke')
              .classed(circleClassName, true)
              .attr('opacity', 0)
              .transition()
              .delay((_d, _i) => {
                return i * enterDuration
              })
              .attr('opacity', 1)
          },
          update => {
            return update
              .transition()
              .duration(50)
              // .attr('cx', d => d.axisX)
              // .attr('cy', d => d.axisY)
              .attr('opacity', 1)
          },
          exit => exit.remove()
        )
        .attr('r', fullParams.radius)
        .attr('fill', (d, i) => getDatumColor({ datum: d, colorType: fullParams.fillColorType, fullChartParams }))
        .attr('stroke', (d, i) => getDatumColor({ datum: d, colorType: fullParams.strokeColorType, fullChartParams }))
        .attr('stroke-width', fullParams.strokeWidth)
        .attr('transform', `scale(${graphicOppositeScale[0]}, ${graphicOppositeScale[1]})`)
    })

  return dots
}


function highlightDots ({ selection, ids, onlyShowHighlighted, fullChartParams }: {
  selection: d3.Selection<SVGGElement, ComputedDatumGrid, any, any>
  ids: string[]
  onlyShowHighlighted: boolean
  fullChartParams: ChartParams
}) {
  selection.interrupt('highlight')
  if (!ids.length) {
    // remove highlight
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', onlyShowHighlighted === true ? 0 : 1)
    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.id)) {
        d3.select(n[i])
          .style('opacity', 1)
          .transition('highlight')
          .duration(200)
      } else {
        d3.select(n[i])
          .style('opacity', onlyShowHighlighted === true ? 0 : fullChartParams.styles.unhighlightedOpacity)
          .transition('highlight')
          .duration(200)
      }
    })
}

function renderClipPath ({ defsSelection, clipPathData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
}) {
  const clipPath = defsSelection
    .selectAll<SVGClipPathElement, Layout>('clipPath')
    .data(clipPathData)
    .join(
      enter => {
        return enter
          .append('clipPath')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('id', d => d.id)
    .each((d, i, g) => {
      const rect = d3.select(g[i])
        .selectAll<SVGRectElement, typeof d>('rect')
        .data([d])
        .join('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })

}

export const Dots = defineGridPlugin(pluginName, DEFAULT_DOTS_PLUGIN_PARAMS)(({ selection, name, subject, observer }) => {
  // const axisGUpdate = selection
  //   .selectAll('g')
  //   .data()
  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')

  // const rectSelection: d3.Selection<SVGRectElement, any, any, any> = selection
  //   .append('rect')
  //   .attr('pointer-events', 'none')
  const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
    .append('g')
    .attr('clip-path', `url(#${clipPathID})`)
  const defsSelection: d3.Selection<SVGDefsElement, any, any, any> = axisSelection.append('defs')
  const dataAreaSelection: d3.Selection<SVGGElement, any, any, any> = axisSelection.append('g')
  const graphicSelection$: Subject<d3.Selection<SVGGElement, ComputedDatumGrid, any, any>> = new Subject()
  // const dotSelection$: Subject<d3.Selection<SVGCircleElement, ComputedDatumGrid, SVGGElement, any>> = new Subject()

  observer.gridAxesTransform$
    .pipe(
      takeUntil(destroy$),
      map(d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      axisSelection
        .style('transform', d)
    })

  observer.gridGraphicTransform$
    .pipe(
      takeUntil(destroy$),
      switchMap(async d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      dataAreaSelection
        .transition()
        .duration(50)
        .style('transform', d)
    })

  const graphicOppositeScale$: Observable<[number, number]> = observer.gridGraphicTransform$.pipe(
    takeUntil(destroy$),
    map(d => [1 / d.scale[0], 1 / d.scale[1]])
  )

  // const axisSize$ = gridAxisSizeObservable({
  //   dataFormatter$,
  //   observer.layout$
  // })

  // combineLatest({
  //   axisSized: axisSize$,
  //   computedLayout: observer.layout$
  // }).pipe(
  //   takeUntil(destroy$),
  //   // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //   switchMap(async (d) => d),
  // ).subscribe(d => {
  //   rectSelection
  //     .style('transform', d.computedLayout.content.axesTransform)
  //     .attr('opacity', 0)
  //     .attr('width', d.axisSized.width)
  //     .attr('height', d.axisSized.height)
  //     // .transition()
  //     // .attr('opacity', 1)
  // })
  // selection.on('mouseover', (event, datum) => {
    
  //   console.log('selection mouseover', event, datum)
  // })

  const clipPathSubscription = observer.gridAxesSize$.pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {
    // 外層的遮罩
    const clipPathData = [{
      id: clipPathID,
      width: data.width,
      height: data.height
    }]
    renderClipPath({
      defsSelection,
      clipPathData,
    })
  })

  // const visibleComputedData$ = observer.computedData$.pipe(
  //   map(computedData => {
  //     return computedData
  //       .map(d => {
  //         return d.filter(_d => _d.visible == true)      
  //       })
  //   })
  // )

  // const SeriesDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridSeriesDataMap(d))
  // )

  // const GroupDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridGroupDataMap(d))
  // )

  // const DataMap$ = computedData$.pipe(
  //   map(d => {
  //     const DataMap: Map<string, ComputedDatumGrid> = new Map()
  //     d.flat().forEach(_d => DataMap.set(_d.id, _d))
  //     return DataMap
  //   })
  // )

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )
  
  combineLatest({
    computedData: observer.computedData$,
    visibleComputedData: observer.visibleComputedData$,
    SeriesDataMap: observer.SeriesDataMap$,
    GroupDataMap: observer.GroupDataMap$,
    graphicOppositeScale: graphicOppositeScale$,
    fullChartParams: observer.fullChartParams$,
    fullParams: observer.fullParams$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {

    const graphicSelection = renderDots({
      selection: dataAreaSelection,
      data: data.visibleComputedData.flat(),
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams,
      graphicOppositeScale: data.graphicOppositeScale
    })

    graphicSelection
      .on('mouseover', (event, datum) => {
        event.stopPropagation()
  
        subject.event$.next({
          type: 'grid',
          eventName: 'mouseover',
          pluginName: name,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('mousemove', (event, datum) => {
        event.stopPropagation()

        subject.event$.next({
          type: 'grid',
          eventName: 'mousemove',
          pluginName: name,
          highlightTarget: data.highlightTarget,
          data: data.computedData,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event
        })
      })
      .on('mouseout', (event, datum) => {
        event.stopPropagation()

        subject.event$.next({
          type: 'grid',
          eventName: 'mouseout',
          pluginName: name,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('click', (event, datum) => {
        event.stopPropagation()

        subject.event$.next({
          type: 'grid',
          eventName: 'click',
          pluginName: name,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })

    graphicSelection$.next(graphicSelection)

  })

  // const datumList$ = observer.computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, fullChartParams$, event$: store.event$ })
  const highlightSubscription = observer.gridHighlight$.subscribe()
  const onlyShowHighlighted$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => d.onlyShowHighlighted),
    distinctUntilChanged()
  )
  
  observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    switchMap(d => combineLatest({
      graphicSelection: graphicSelection$,
      highlight: observer.gridHighlight$,
      onlyShowHighlighted: onlyShowHighlighted$,
      fullChartParams: observer.fullChartParams$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ))
  ).subscribe(data => {
    highlightDots({
      selection: data.graphicSelection,
      ids: data.highlight,
      onlyShowHighlighted: data.onlyShowHighlighted,
      fullChartParams: data.fullChartParams
    })
  })


  return () => {
    highlightSubscription.unsubscribe()
    destroy$.next(undefined)
  }
})