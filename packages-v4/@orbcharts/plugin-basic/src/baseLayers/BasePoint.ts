import * as d3 from 'd3'
import {
  combineLatest,
  map,
  debounceTime,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject } from 'rxjs'
import type { BaseLayerFn } from '../types/BaseLayer'
import type {
  EventData,
  ColorType,
  Theme
} from '@orbcharts/core'
import type {
  ComputedData,
  ComputedDatumGrid,
  ContainerPositionScaled,
  TransformData,
  Layout,
  GraphicStyles
} from '../types'
import type { ComputedAxesDataGrid } from '../plugins/GridPlot/types'
import { getDatumColor, createClassName, createUniID } from '../utils/orbchartsUtils'
import { gridSelectionsObservable } from '../utils/gridObservables'

export interface BasePointParams {
    radius: number;
    fillColorType: ColorType;
    strokeColorType: ColorType;
    strokeWidth: number;
    onlyShowHighlighted: boolean;
}

interface BasePointContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedData<'grid'>>
  // computedAxesData$: Observable<ComputedAxesDataGrid>
  // visibleComputedData$: Observable<ComputedDatumGrid[][]>
  visibleComputedAxesData$: Observable<ComputedAxesDataGrid>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  CategoryDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  basePointParams$: Observable<BasePointParams>
  styles$: Observable<GraphicStyles>
  theme$: Observable<Theme>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridGraphicReverseScale$: Observable<[number, number][]>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  eventTrigger$: Subject<EventData<'grid'>>
}


type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

// const pluginName = 'Point'
// const circleGClassName = createClassName(pluginName, 'circleG')
// const circleClassName = createClassName(pluginName, 'circle')

function renderPoint ({ graphicGSelection, circleGClassName, circleClassName, visibleComputedAxesData, basePointParams, styles, theme, graphicReverseScale }: {
  graphicGSelection: d3.Selection<SVGGElement, any, any, any>
  circleGClassName: string
  circleClassName: string
  visibleComputedAxesData: ComputedAxesDataGrid
  basePointParams: BasePointParams
  styles: GraphicStyles
  theme: Theme
  graphicReverseScale: [number, number][]
}) {
  const createEnterDuration = (enter: d3.Selection<d3.EnterElement, ComputedDatumGrid, SVGGElement, any>) => {
    const enterSize = enter.size()
    const eachDuration = styles.transitionDuration / enterSize
    return eachDuration
  }
  // enterDuration
  let enterDuration = 0

  graphicGSelection
    .each((seriesData, seriesIndex, g) => {
      d3.select(g[seriesIndex])
        .selectAll<SVGGElement, ComputedDatumGrid>('g')
        .data(visibleComputedAxesData[seriesIndex], d => d.id)
        .join(
          enter => {
            // enterDuration
            enterDuration = createEnterDuration(enter)
    
            return enter
              .append('g')
              .classed(circleGClassName, true)     
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
            .attr('r', basePointParams.radius)
            .attr('fill', (d, i) => getDatumColor({ datum: d, colorType: basePointParams.fillColorType, theme }))
            .attr('stroke', (d, i) => getDatumColor({ datum: d, colorType: basePointParams.strokeColorType, theme }))
            .attr('stroke-width', basePointParams.strokeWidth)
            .attr('transform', `scale(${graphicReverseScale[seriesIndex][0] ?? 1}, ${graphicReverseScale[seriesIndex][1] ?? 1})`)
        })
    })

  const graphicCircleSelection: d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown>  = graphicGSelection.selectAll(`circle.${circleClassName}`)

  return graphicCircleSelection
}


function highlightPoint ({ selection, ids, onlyShowHighlighted, styles }: {
  selection: d3.Selection<SVGGElement, ComputedDatumGrid, any, any>
  ids: string[]
  onlyShowHighlighted: boolean
  // basePointParams: BasePointParams
  styles: GraphicStyles
}) {
  selection.interrupt('highlight')
  if (!ids.length) {
    // remove highlight
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', onlyShowHighlighted === true ? 0 : 1)
    // selection
    //   .attr('stroke-width', basePointParams.strokeWidth)

    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.id)) {
        const dot = d3.select(n[i])
        dot
          .style('opacity', 1)
          .transition('highlight')
          .duration(200)
        // dot
        //   .attr('stroke-width', basePointParams.strokeWidthWhileHighlight)
      } else {
        const dot = d3.select(n[i])
        dot
          .style('opacity', onlyShowHighlighted === true ? 0 : styles.unhighlightedOpacity)
          .transition('highlight')
          .duration(200)
        // dot
        //   .attr('stroke-width', basePointParams.strokeWidth)
        
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



export const createBasePoint: BaseLayerFn<BasePointContext> = ({
  selection,
  pluginName,
  layerName,
  computedData$,
  visibleComputedAxesData$,
  seriesLabels$,
  SeriesDataMap$,
  CategoryDataMap$,
  basePointParams$,
  styles$,
  theme$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridGraphicReverseScale$,
  gridAxesSize$,
  gridHighlight$,
  gridContainerPosition$,
  eventTrigger$
}) => {

  const destroy$ = new Subject()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const circleGClassName = createClassName(pluginName, layerName, 'circleG')
  const circleClassName = createClassName(pluginName, layerName, 'circle')

  // const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
  //   .append('g')
  //   .attr('clip-path', `url(#${clipPathID})`)
  // const defsSelection: d3.Selection<SVGDefsElement, any, any, any> = axisSelection.append('defs')
  // const dataAreaSelection: d3.Selection<SVGGElement, any, any, any> = axisSelection.append('g')
  // const graphicSelection$: Subject<d3.Selection<SVGGElement, ComputedDatumGrid, any, any>> = new Subject()

  const { 
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = gridSelectionsObservable({
    selection,
    pluginName,
    layerName,
    clipPathID,
    seriesLabels$,
    gridContainerPosition$,
    gridAxesTransform$,
    gridGraphicTransform$
  })

  const graphicReverseScale$: Observable<[number, number][]> = combineLatest({
    // gridGraphicTransform: gridGraphicTransform$,
    // gridContainerPosition: gridContainerPosition$,
    // gridAxesTransform: gridAxesTransform$
    computedData: computedData$,
    gridGraphicReverseScale: gridGraphicReverseScale$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async data => data),
    map(data => {
      return data.computedData.map((series, seriesIndex) => {
        return data.gridGraphicReverseScale[seriesIndex]
      })
    })
  )

  const clipPathSubscription = combineLatest({
    defsSelection: defsSelection$,
    gridAxesSize: gridAxesSize$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    // 外層的遮罩
    const clipPathData = [{
      id: clipPathID,
      width: data.gridAxesSize.width,
      height: data.gridAxesSize.height
    }]
    renderClipPath({
      defsSelection: data.defsSelection,
      clipPathData,
    })
  })

  const highlightTarget$ = styles$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )
  
  const graphicSelection$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    visibleComputedAxesData: visibleComputedAxesData$,
    graphicReverseScale: graphicReverseScale$,
    styles: styles$,
    theme: theme$,
    basePointParams: basePointParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return renderPoint({
        graphicGSelection: data.graphicGSelection,
        circleGClassName,
        circleClassName,
        visibleComputedAxesData: data.visibleComputedAxesData,
        basePointParams: data.basePointParams,
        styles: data.styles,
        theme: data.theme,
        graphicReverseScale: data.graphicReverseScale
      })
    })
  )

  combineLatest({
    graphicSelection: graphicSelection$,
    computedData: computedData$,
    SeriesDataMap: SeriesDataMap$,
    CategoryDataMap: CategoryDataMap$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    
    data.graphicSelection
      .on('mouseover', (event, datum) => {
        // event.stopPropagation()
  
        eventTrigger$.next({
          // type: 'grid',
          // eventName: 'mouseover',
          // pluginName,
          // highlightTarget: data.highlightTarget,
          // datum,
          // gridIndex: datum.gridIndex,
          // series: data.SeriesDataMap.get(datum.seriesLabel)!,
          // seriesIndex: datum.seriesIndex,
          // seriesLabel: datum.seriesLabel,
          // group: data.CategoryDataMap.get(datum.groupLabel)!,
          // groupIndex: datum.groupIndex,
          // groupLabel: datum.groupLabel,
          // event,
          // data: data.computedData
          eventName: 'mouseover',
          pluginName,
          layerName,
          target: datum,
          event
        })
      })
      .on('mousemove', (event, datum) => {
        // event.stopPropagation()

        eventTrigger$.next({
          // type: 'grid',
          // eventName: 'mousemove',
          // pluginName,
          // highlightTarget: data.highlightTarget,
          // data: data.computedData,
          // datum,
          // gridIndex: datum.gridIndex,
          // series: data.SeriesDataMap.get(datum.seriesLabel)!,
          // seriesIndex: datum.seriesIndex,
          // seriesLabel: datum.seriesLabel,
          // group: data.CategoryDataMap.get(datum.groupLabel)!,
          // groupIndex: datum.groupIndex,
          // groupLabel: datum.groupLabel,
          // event
          eventName: 'mousemove',
          pluginName,
          layerName,
          target: datum,
          event
        })
      })
      .on('mouseout', (event, datum) => {
        // event.stopPropagation()

        eventTrigger$.next({
          // type: 'grid',
          // eventName: 'mouseout',
          // pluginName,
          // highlightTarget: data.highlightTarget,
          // datum,
          // gridIndex: datum.gridIndex,
          // series: data.SeriesDataMap.get(datum.seriesLabel)!,
          // seriesIndex: datum.seriesIndex,
          // seriesLabel: datum.seriesLabel,
          // group: data.CategoryDataMap.get(datum.groupLabel)!,
          // groupIndex: datum.groupIndex,
          // groupLabel: datum.groupLabel,
          // event,
          // data: data.computedData
          eventName: 'mouseout',
          pluginName,
          layerName,
          target: datum,
          event
        })
      })
      .on('click', (event, datum) => {
        // event.stopPropagation()

        eventTrigger$.next({
          // type: 'grid',
          // eventName: 'click',
          // pluginName,
          // highlightTarget: data.highlightTarget,
          // datum,
          // gridIndex: datum.gridIndex,
          // series: data.SeriesDataMap.get(datum.seriesLabel)!,
          // seriesIndex: datum.seriesIndex,
          // seriesLabel: datum.seriesLabel,
          // group: data.CategoryDataMap.get(datum.groupLabel)!,
          // groupIndex: datum.groupIndex,
          // groupLabel: datum.groupLabel,
          // event,
          // data: data.computedData
          eventName: 'click',
          pluginName,
          layerName,
          target: datum,
          event
        })
      })

  })

  // const datumList$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, fullChartParams$, eventTrigger$: store.eventTrigger$ })
  // const highlightSubscription = gridHighlight$.subscribe()
  const onlyShowHighlighted$ = basePointParams$.pipe(
    takeUntil(destroy$),
    map(d => d.onlyShowHighlighted),
    distinctUntilChanged()
  )
  
  combineLatest({
    graphicSelection: graphicSelection$,
    highlight: gridHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    onlyShowHighlighted: onlyShowHighlighted$,
    // basePointParams: basePointParams$,
    styles: styles$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    highlightPoint({
      selection: data.graphicSelection,
      ids: data.highlight,
      onlyShowHighlighted: data.onlyShowHighlighted,
      // basePointParams: data.basePointParams,
      styles: data.styles
    })
  })

  return () => {
    destroy$.next(undefined)
    // highlightSubscription.unsubscribe()
  }
}