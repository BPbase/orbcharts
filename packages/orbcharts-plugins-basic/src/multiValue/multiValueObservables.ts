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
  TransformData,
  ContainerPositionScaled,
  Layout } from '../../lib/core-types'
import { createAxisQuantizeScale } from '../../lib/core'
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


// @Q@ 寫到一半
// export const multiValueXYPositionObservable = ({ rootSelection, fullDataFormatter$, computedData$, fullChartParams$, multiValueContainerPosition$, layout$ }: {
//   rootSelection: d3.Selection<any, unknown, any, unknown>
//   fullDataFormatter$: Observable<DataFormatterMultiValue>
//   computedData$: Observable<ComputedDataMultiValue>
//   fullChartParams$: Observable<ChartParams>
//   multiValueContainerPosition$: Observable<ContainerPositionScaled[]>
//   layout$: Observable<Layout>
// }) => {
//   const rootMousemove$ = d3EventObservable(rootSelection, 'mousemove')

//   const groupScaleDomain$ = combineLatest({
//     fullDataFormatter: fullDataFormatter$,
//     layout: layout$,
//     computedData: computedData$
//   }).pipe(
//     switchMap(async (d) => d),
//     map(data => {
//       const groupMin = 0
//       const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
//       // const groupScaleDomainMin = data.fullDataFormatter.grid.groupAxis.scaleDomain[0] === 'auto'
//       //   ? groupMin - data.fullDataFormatter.grid.groupAxis.scalePadding
//       //   : data.fullDataFormatter.grid.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.grid.groupAxis.scalePadding
//       const groupScaleDomainMin = data.fullDataFormatter.grid.groupAxis.scaleDomain[0] - data.fullDataFormatter.grid.groupAxis.scalePadding
//       const groupScaleDomainMax = data.fullDataFormatter.grid.groupAxis.scaleDomain[1] === 'max'
//         ? groupMax + data.fullDataFormatter.grid.groupAxis.scalePadding
//         : data.fullDataFormatter.grid.groupAxis.scaleDomain[1] as number + data.fullDataFormatter.grid.groupAxis.scalePadding

//       return [groupScaleDomainMin, groupScaleDomainMax]
//     }),
//     shareReplay(1)
//   )

//   const groupLabels$ = combineLatest({
//     fullDataFormatter: fullDataFormatter$,
//     computedData: computedData$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       return data.fullDataFormatter.grid.seriesDirection === 'row'
//         ? (data.computedData[0] ?? []).map(d => d.groupLabel)
//         : data.computedData.map(d => d[0].groupLabel)
//     })
//   )

//   const scaleRangeGroupLabels$ = combineLatest({
//     groupScaleDomain: groupScaleDomain$,
//     groupLabels: groupLabels$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       return data.groupLabels
//         .filter((d, i) => {
//           return i >= data.groupScaleDomain[0] && i <= data.groupScaleDomain[1]
//         })
//     })
//   )

//   // 比例尺座標對應非連續資料索引
//   const xIndexScale$ = combineLatest({
//     layout: layout$,
//     scaleRangeGroupLabels: scaleRangeGroupLabels$,
//     fullDataFormatter: fullDataFormatter$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       return createAxisQuantizeScale({
//         axisLabels: data.scaleRangeGroupLabels,
//         axisWidth: data.layout.width,
//         padding: data.fullDataFormatter.grid.groupAxis.scalePadding,
//         reverse: false
//       })
//     })
//   )

//   const columnAmount$ = multiValueContainerPosition$.pipe(
//     map(multiValueContainerPosition => {
//       const maxColumnIndex = multiValueContainerPosition.reduce((acc, current) => {
//         return current.columnIndex > acc ? current.columnIndex : acc
//       }, 0)
//       return maxColumnIndex + 1
//     }),
//     distinctUntilChanged()
//   )

//   const rowAmount$ = multiValueContainerPosition$.pipe(
//     map(multiValueContainerPosition => {
//       const maxRowIndex = multiValueContainerPosition.reduce((acc, current) => {
//         return current.rowIndex > acc ? current.rowIndex : acc
//       }, 0)
//       return maxRowIndex + 1
//     }),
//     distinctUntilChanged()
//   )

//   const axisValue$ = combineLatest({
//     fullDataFormatter: fullDataFormatter$,
//     fullChartParams: fullChartParams$,
//     rootMousemove: rootMousemove$,
//     columnAmount: columnAmount$,
//     rowAmount: rowAmount$,
//     layout: layout$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
//       const eventData = {
//         offsetX: data.rootMousemove.offsetX * data.columnAmount % data.layout.rootWidth,
//         offsetY: data.rootMousemove.offsetY * data.rowAmount % data.layout.rootHeight
//       }
//       return data.fullDataFormatter.grid.groupAxis.position === 'bottom'
//           || data.fullDataFormatter.grid.groupAxis.position === 'top'
//             ? eventData.offsetX - data.fullChartParams.padding.left
//             : eventData.offsetY - data.fullChartParams.padding.top
//     })
//   )

//   const groupIndex$ = combineLatest({
//     xIndexScale: xIndexScale$,
//     axisValue: axisValue$,
//     groupScaleDomain: groupScaleDomain$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       const xIndex = data.xIndexScale(data.axisValue)
//       const currentxIndexStart = Math.ceil(data.groupScaleDomain[0]) // 因為有padding所以會有小數點，所以要無條件進位
//       return xIndex + currentxIndexStart
//     })
//   )

//   const groupLabel$ = combineLatest({
//     groupIndex: groupIndex$,
//     groupLabels: groupLabels$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       return data.groupLabels[data.groupIndex] ?? ''
//     })
//   )

//   return combineLatest({
//     groupIndex: groupIndex$,
//     groupLabel: groupLabel$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       return {
//         groupIndex: data.groupIndex,
//         groupLabel: data.groupLabel
//       }
//     })
//   )
// }
