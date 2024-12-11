import * as d3 from 'd3'
import {
  Observable,
  Subject,
  of,
  takeUntil,
  filter,
  map,
  switchMap,
  combineLatest,
  merge,
  shareReplay,
  distinctUntilChanged
} from 'rxjs'
import type {
  ChartParams,
  HighlightTarget,
  DataFormatterMultiValue,
  ComputedDataMultiValue,
  ComputedDatumMultiValue,
  ComputedLayoutDatumMultiValue,
  TransformData,
  ContainerPositionScaled,
  Layout,
} from '../../lib/core-types'
import { createAxisToLabelIndexScale, createAxisToValueScale } from '../../lib/core'
import { getClassName, getUniID } from '../utils/orbchartsUtils'
import { d3EventObservable } from '../utils/observables'

// 建立 multiValue 主要的 selection 
export const multiValueSelectionsObservable = ({ selection, pluginName, clipPathID, categoryLabels$, multiValueContainerPosition$, multiValueGraphicTransform$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  clipPathID: string
  // computedData$: Observable<ComputedDataMultiValue>
  categoryLabels$: Observable<string[]>
  multiValueContainerPosition$: Observable<ContainerPositionScaled[]>
  // multiValueAxesTransform$: Observable<TransformData>
  multiValueGraphicTransform$: Observable<TransformData>
}) => {
  const categoryClassName = getClassName(pluginName, 'category')
  const axesClassName = getClassName(pluginName, 'axes')
  const graphicClassName = getClassName(pluginName, 'graphic')

  // <g> category selection（container排放位置）
  //   <g> axes selection（圖軸）
  //     <defs> clipPath selection
  //     <g> graphic selection（圖形 scale 範圍的變形）
  const categorySelection$ = categoryLabels$.pipe(
    map((categoryLabels, i) => {
      return selection
        .selectAll<SVGGElement, string>(`g.${categoryClassName}`)
        .data(categoryLabels, d => d)
        .join(
          enter => {
            return enter
              .append('g')
              .classed(categoryClassName, true)
              .each((d, i, g) => {
                const axesSelection = d3.select(g[i])
                  .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${axesClassName}`)
                  .data([i])
                  .join(
                    enter => {
                      return enter
                        .append('g')
                        .classed(axesClassName, true)
                        .attr('clip-path', `url(#${clipPathID})`)
                        .each((d, i, g) => {
                          const defsSelection = d3.select(g[i])
                            .selectAll<SVGDefsElement, any>('defs')
                            .data([i])
                            .join('defs')
            
                          const graphicGSelection = d3.select(g[i])
                            .selectAll<SVGGElement, any>('g')
                            .data([i])
                            .join('g')
                            .classed(graphicClassName, true)
                        })
                    },
                    update => update,
                    exit => exit.remove()
                  )
              })
          },
          update => update,
          exit => exit.remove()
        )
    }),
    shareReplay(1)
  )

  // <g> category selection
  combineLatest({
    categorySelection: categorySelection$,
    multiValueContainerPosition: multiValueContainerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d)
  ).subscribe(data => {
    data.categorySelection
      .transition()
      .attr('transform', (d, i) => {
        const multiValueContainerPosition = data.multiValueContainerPosition[i] ?? data.multiValueContainerPosition[0]
        const translate = multiValueContainerPosition.translate
        const scale = multiValueContainerPosition.scale
        return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
      })
  })

  // <g> axes selection
  const axesSelection$ = categorySelection$.pipe(
    map(categorySelection => {
      return categorySelection
        .select<SVGGElement>(`g.${axesClassName}`)
    }),
    shareReplay(1)
  )

  // <defs> clipPath selection
  const defsSelection$ = axesSelection$.pipe(
    map(axesSelection => {
      return axesSelection.select<SVGDefsElement>('defs')
    }),
    shareReplay(1)
  )

  // <g> graphic selection
  const graphicGSelection$ = combineLatest({
    axesSelection: axesSelection$,
    multiValueGraphicTransform: multiValueGraphicTransform$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const graphicGSelection = data.axesSelection
        .select<SVGGElement>(`g.${graphicClassName}`)
      graphicGSelection
        .transition()
        .duration(50)
        .style('transform', data.multiValueGraphicTransform.value)
      return graphicGSelection
    }),
    shareReplay(1)
  )

  return {
    categorySelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  }
}


export const multiValueXYPositionObservable = ({ rootSelection, fullDataFormatter$, filteredMinMaxXYData$, fullChartParams$, multiValueContainerPosition$, layout$ }: {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  // computedData$: Observable<ComputedDataMultiValue>
  // minMaxXY$: Observable<{ minX: number, maxX: number, minY: number, maxY: number }>
  filteredMinMaxXYData$: Observable<{
    minXDatum: ComputedLayoutDatumMultiValue
    maxXDatum: ComputedLayoutDatumMultiValue
    minYDatum: ComputedLayoutDatumMultiValue
    maxYDatum: ComputedLayoutDatumMultiValue
  }>
  fullChartParams$: Observable<ChartParams>
  multiValueContainerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
}) => {
  const rootMousemove$ = d3EventObservable(rootSelection, 'mousemove')

  const columnAmount$ = multiValueContainerPosition$.pipe(
    map(multiValueContainerPosition => {
      const maxColumnIndex = multiValueContainerPosition.reduce((acc, current) => {
        return current.columnIndex > acc ? current.columnIndex : acc
      }, 0)
      return maxColumnIndex + 1
    }),
    distinctUntilChanged()
  )

  const rowAmount$ = multiValueContainerPosition$.pipe(
    map(multiValueContainerPosition => {
      const maxRowIndex = multiValueContainerPosition.reduce((acc, current) => {
        return current.rowIndex > acc ? current.rowIndex : acc
      }, 0)
      return maxRowIndex + 1
    }),
    distinctUntilChanged()
  )

  const xyScale$ = combineLatest({
    layout: layout$,
    filteredMinMaxXYData: filteredMinMaxXYData$,
    fullDataFormatter: fullDataFormatter$,
    columnAmount: columnAmount$,
    rowAmount: rowAmount$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const xScale = createAxisToValueScale({
        maxValue: data.filteredMinMaxXYData.maxXDatum.value[0],
        minValue: data.filteredMinMaxXYData.minXDatum.value[0],
        axisWidth: data.layout.width,
        scaleDomain: data.fullDataFormatter.xAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.xAxis.scaleRange,
      })
      const yScale = createAxisToValueScale({
        maxValue: data.filteredMinMaxXYData.maxYDatum.value[1],
        minValue: data.filteredMinMaxXYData.minYDatum.value[1],
        axisWidth: data.layout.height,
        scaleDomain: data.fullDataFormatter.yAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.yAxis.scaleRange,
        reverse: true
      })
      return { xScale, yScale }
    })
  )

  const axisValue$ = combineLatest({
    fullDataFormatter: fullDataFormatter$,
    fullChartParams: fullChartParams$,
    rootMousemove: rootMousemove$,
    columnAmount: columnAmount$,
    rowAmount: rowAmount$,
    layout: layout$,
    multiValueContainerPosition: multiValueContainerPosition$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
      return {
        x: ((data.rootMousemove.offsetX - data.fullChartParams.padding.left) / data.multiValueContainerPosition[0].scale[0])
          % (data.layout.rootWidth / data.columnAmount / data.multiValueContainerPosition[0].scale[0]),
        y: ((data.rootMousemove.offsetY - data.fullChartParams.padding.top) / data.multiValueContainerPosition[0].scale[1])
          % (data.layout.rootHeight / data.rowAmount / data.multiValueContainerPosition[0].scale[1])
      }
    })
  )

  return combineLatest({
    xyScale: xyScale$,
    axisValue: axisValue$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return {
        x: data.axisValue.x,
        y: data.axisValue.y,
        xValue: data.xyScale.xScale(data.axisValue.x),
        yValue: data.xyScale.yScale(data.axisValue.y)
      }
    })
  )
}
