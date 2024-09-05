import * as d3 from 'd3'
import {
  iif,
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject } from 'rxjs'
import type { BasePluginFn } from './types'
import type {
  ComputedDatumGrid,
  ComputedDataGrid,
  ComputedLayoutDatumGrid,
  ComputedLayoutDataGrid,
  DataFormatterGrid,
  EventGrid,
  ChartParams,
  ContainerPosition,
  Layout,
  TransformData } from '@orbcharts/core'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID } from '../utils/orbchartsUtils'
import { gridSelectionsObservable } from '../grid/gridObservables'
import { shareReplay } from 'rxjs/operators'

export interface BaseBarStackParams {
  barWidth: number
  barGroupPadding: number
  barRadius: number | boolean
}

interface BaseBarStackContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  computedLayoutData$: Observable<ComputedLayoutDataGrid>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  visibleComputedLayoutData$: Observable<ComputedLayoutDataGrid>
  existSeriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullParams$: Observable<BaseBarStackParams>
  fullDataFormatter$: Observable<DataFormatterGrid>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridGraphicReverseScale$: Observable<[number, number][]>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainer$: Observable<ContainerPosition[]>
  isSeriesPositionSeprate$: Observable<boolean>
  event$: Subject<EventGrid>
}


interface GraphicDatum extends ComputedLayoutDatumGrid {
  _barStartY: number // bar的起點y座標
  _barHeight: number // bar的高度
}

interface RenderBarParams {
  graphicGSelection: d3.Selection<SVGGElement, unknown, any, any>
  rectClassName: string
  barData: GraphicDatum[][]
  zeroY: number
  groupLabels: string[]
  // barScale: d3.ScalePoint<string>
  params: BaseBarStackParams
  chartParams: ChartParams
  barWidth: number
  transformedBarRadius: [number, number][]
  delayGroup: number
  transitionItem: number
  isSeriesPositionSeprate: boolean
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

// const pluginName = 'BarStack'
// const rectClassName = getClassName(pluginName, 'rect')
// group的delay在動畫中的佔比（剩餘部份的時間為圖形本身的動畫時間，因為delay時間和最後一個group的動畫時間加總為1）
const groupDelayProportionOfDuration = 0.3

function calcBarWidth ({ axisWidth, groupAmount, barGroupPadding = 0 }: {
  axisWidth: number
  groupAmount: number
  barGroupPadding: number
}) {
  const eachGroupWidth = axisWidth / (groupAmount - 1)
  const width = eachGroupWidth - barGroupPadding
  return width > 1 ? width : 1

}

// function makeBarScale (barWidth: number, seriesLabels: string[], params: BarStackParams) {
//   const barHalfWidth = barWidth! / 2
//   const barGroupWidth = barWidth * seriesLabels.length + params.barPadding! * seriesLabels.length
//   return d3.scalePoint()
//     .domain(seriesLabels)
//     .range([-barGroupWidth / 2 + barHalfWidth, barGroupWidth / 2 - barHalfWidth])
// }

function calcDelayGroup (barGroupAmount: number, totalDuration: number) {
  if (barGroupAmount <= 1) {
    // 一筆內計算會出錯所以不算
    return 0
  }
  return totalDuration / (barGroupAmount - 1) * groupDelayProportionOfDuration // 依group數量計算
}

function calctransitionItem (barGroupAmount: number, totalDuration: number) {
  if (barGroupAmount <= 1) {
    // 一筆內不會有delay
    return totalDuration
  }
  return totalDuration * (1 - groupDelayProportionOfDuration) // delay後剩餘的時間
}

function renderRectBars ({ graphicGSelection, rectClassName, barData, zeroY, groupLabels, params, chartParams, barWidth, transformedBarRadius, delayGroup, transitionItem, isSeriesPositionSeprate }: RenderBarParams) {
  
  const barHalfWidth = barWidth! / 2

  graphicGSelection
    .each((seriesData, seriesIndex, g) => {
      d3.select(g[seriesIndex])
        .selectAll<SVGGElement, ComputedDatumGrid>(`rect.${rectClassName}`)
        .data(barData[seriesIndex] ?? [], d => d.id)
        .join(
          enter => {
            // console.log('enter')
            return enter
              .append('rect')
              .classed(rectClassName, true)
              .attr('cursor', 'pointer')
              .attr('height', d => 0)
          },
          update => update,
          exit => exit.remove()
        )
        .attr('transform', (d, i) => `translate(${(d ? d.axisX : 0) - barHalfWidth}, ${0})`)
        .attr('fill', d => d.color)
        .attr('y', d => zeroY)
        .attr('x', d =>0)
        .attr('width', barWidth!)
        .attr('rx', transformedBarRadius[seriesIndex][0] ?? 1)
        .attr('ry', transformedBarRadius[seriesIndex][1] ?? 1)
        .transition()
        .duration(transitionItem)
        .ease(getD3TransitionEase(chartParams.transitionEase))
        .delay((d, i) => d.groupIndex * delayGroup)
        .attr('y', d => d._barStartY)
        .attr('height', d => Math.abs(d._barHeight))
    })

  // const barGroup = graphicGSelection
  //   .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${gClassName}`)
  //   .data(data, (d, i) => groupLabels[i])
  //   .join(
  //     enter => {
  //       return enter
  //         .append('g')
  //         .classed(gClassName, true)
  //         .attr('cursor', 'pointer')
  //     },
  //     update => update,
  //     exit => exit.remove()
  //   )
  //   .attr('transform', (d, i) => `translate(${d[0] ? d[0].axisX : 0}, ${0})`)
  //   .each((d, i, g) => {
  //     const bars = d3.select(g[i])
  //       .selectAll<SVGGElement, ComputedDatumGrid>('g')
  //       .data(d, _d => _d.id)
  //       .join(
  //         enter => {
  //           return enter
  //             .append('g')
  //             .classed(gContentClassName, true)
  //         },
  //         update => update,
  //         exit => exit.remove()
  //       )
  //       .each((_d, _i, _g) => {
  //         const rect = d3.select(_g[_i])
  //           .selectAll<SVGRectElement, ComputedDatumGrid>('rect')
  //           .data([_d], _d => _d.id)
  //           .join(
  //             enter => {
  //               return enter
  //                 .append('rect')
  //                 .attr('y', d => zeroY)
  //                 .attr('height', d => 0)
  //             },
  //             update => update,
  //             exit => exit.remove()
  //           )
  //           .attr('rx', transformedBarRadius[0])
  //           .attr('ry', transformedBarRadius[1])
  //           .attr('fill', d => d.color)
  //           .attr('transform', `translate(${-barHalfWidth}, 0)`)
  //           .attr('x', d => 0)
  //           .attr('width', barWidth!)
  //           .transition()
  //           .duration(transitionItem)
  //           .ease(getD3TransitionEase(chartParams.transitionEase))
  //           .delay((d, i) => d.groupIndex * delayGroup)
  //           .attr('y', d => d._barStartY)
  //           .attr('height', d => Math.abs(d._barHeight))
  //       })
        
  //   })

  const graphicBarSelection: d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown>  = graphicGSelection.selectAll(`rect.${rectClassName}`)


  return graphicBarSelection
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
        .join(
          enter => {
            return enter
              .append('rect')
          },
          update => update,
          exit => exit.remove()
        )
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })
}

function highlight ({ selection, ids, fullChartParams }: {
  selection: d3.Selection<any, ComputedDatumGrid, any, any>
  ids: string[]
  fullChartParams: ChartParams
}) {
  selection.interrupt('highlight')

  if (!ids.length) {
    // remove highlight
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', 1)
    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.id)) {
        d3.select(n[i])
          .style('opacity', 1)
      } else {
        d3.select(n[i])
          .style('opacity', fullChartParams.styles.unhighlightedOpacity)
      }
    })
}


export const createBaseBarStack: BasePluginFn<BaseBarStackContext> = (pluginName: string, {
  selection,
  computedData$,
  computedLayoutData$,
  visibleComputedData$,
  visibleComputedLayoutData$,
  existSeriesLabels$,
  SeriesDataMap$,
  GroupDataMap$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridGraphicReverseScale$,
  gridAxesSize$,
  gridHighlight$,
  gridContainer$,
  isSeriesPositionSeprate$,
  event$
}) => {

  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const rectClassName = getClassName(pluginName, 'rect')

  const { 
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = gridSelectionsObservable({
    selection,
    pluginName,
    clipPathID,
    existSeriesLabels$,
    gridContainer$,
    gridAxesTransform$,
    gridGraphicTransform$
  })


  const zeroY$ = visibleComputedLayoutData$.pipe(
    takeUntil(destroy$),
    map(d => d[0] && d[0][0]
      ? d[0][0].axisY - d[0][0].axisYFromZero
      : 0),
    distinctUntilChanged()
  )

  const barWidth$ = combineLatest({
    computedData: computedData$,
    // visibleComputedData: visibleComputedData$,
    params: fullParams$,
    axisSize: gridAxesSize$,
    isSeriesPositionSeprate: isSeriesPositionSeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const barWidth = data.params.barWidth
        ? data.params.barWidth
        : calcBarWidth({
          axisWidth: data.axisSize.width,
          groupAmount: data.computedData[0] ? data.computedData[0].length : 0,
          barGroupPadding: data.params.barGroupPadding
        })
      return barWidth
    }),
    distinctUntilChanged()
  )

  // 圓角的值 [rx, ry]
  const transformedBarRadius$: Observable<[number, number][]> = combineLatest({
    computedData: computedData$,
    // gridGraphicTransform: gridGraphicTransform$,
    barWidth: barWidth$,
    params: fullParams$,
    gridGraphicReverseScale: gridGraphicReverseScale$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async data => data),
    map(data => {
      const barHalfWidth = data.barWidth! / 2
      const radius = data.params.barRadius === true ? barHalfWidth
        : data.params.barRadius === false ? 0
        : typeof data.params.barRadius == 'number' ? data.params.barRadius
        : 0

      return data.computedData.map((series, seriesIndex) => {
        const gridGraphicReverseScale = data.gridGraphicReverseScale[seriesIndex] ?? data.gridGraphicReverseScale[0]

        const transformedRx = radius * gridGraphicReverseScale[0]
        const transformedRy = radius * gridGraphicReverseScale[1]

        return [transformedRx, transformedRy]
      })
    })
  )

  // const seriesLabels$ = visibleComputedData$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     const SeriesLabelSet: Set<string> = new Set()
  //     data.forEach(d => {
  //       d.forEach(_d => {
  //         SeriesLabelSet.add(_d.seriesLabel)
  //       })
  //     })
  //     return Array.from(SeriesLabelSet)
  //   })
  // )

  const groupLabels$ = visibleComputedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      const GroupLabelSet: Set<string> = new Set()
      data.forEach(d => {
        d.forEach(_d => {
          GroupLabelSet.add(_d.groupLabel)
        })
      })
      return Array.from(GroupLabelSet)
    }),
    shareReplay(1)
  )

  const transitionDuration$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.transitionDuration),
    distinctUntilChanged()
  )

  const delayGroup$ = new Observable<number>(subscriber => {
    combineLatest({
      groupLabels: groupLabels$,
      transitionDuration: transitionDuration$,
    }).pipe(
      switchMap(async d => d)
    ).subscribe(data => {
      const delay = calcDelayGroup(data.groupLabels.length, data.transitionDuration)
      subscriber.next(delay)
    })
  }).pipe(
    takeUntil(destroy$),
    distinctUntilChanged()
  )

  const transitionItem$ = new Observable<number>(subscriber => {
    combineLatest({
      groupLabels: groupLabels$,
      transitionDuration: transitionDuration$
    }).pipe(
      switchMap(async d => d)
    ).subscribe(data => {
      const transition = calctransitionItem(data.groupLabels.length, data.transitionDuration)
      subscriber.next(transition)
    })
  }).pipe(
    takeUntil(destroy$),
    distinctUntilChanged()
  )

  // const transposedVisibleData$: Observable<ComputedDataGrid> = visibleComputedData$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     console.log('visibleComputedData', data)
  //     // 取得原始陣列的維度
  //     const rows = data.length;
  //     const cols = data.reduce((prev, current) => {
  //       return Math.max(prev, current.length)
  //     }, 0)

  //     // 初始化轉換後的陣列
  //     const transposedArray = new Array(cols).fill(null).map(() => new Array(rows).fill(null))

  //     // 遍歷原始陣列，進行轉換
  //     for (let i = 0; i < rows; i++) {
  //         for (let j = 0; j < cols; j++) {
  //             transposedArray[j][i] = data[i][j]
  //         }
  //     }
  //     return transposedArray
  //   })
  // )

  const groupScaleDomain$ = combineLatest({
    computedData: computedData$,
    dataFormatter: fullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const groupMin = 0
      const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      const groupScaleDomainMin = data.dataFormatter.grid.groupAxis.scaleDomain[0] === 'auto'
        ? groupMin // - data.dataFormatter.grid.groupAxis.scalePadding
        : data.dataFormatter.grid.groupAxis.scaleDomain[0] as number // - data.dataFormatter.grid.groupAxis.scalePadding
      const groupScaleDomainMax = data.dataFormatter.grid.groupAxis.scaleDomain[1] === 'auto'
        ? groupMax // + data.dataFormatter.grid.groupAxis.scalePadding
        : data.dataFormatter.grid.groupAxis.scaleDomain[1] as number // + data.dataFormatter.grid.groupAxis.scalePadding

      return [groupScaleDomainMin, groupScaleDomainMax]
    })
  )

  // 堆疊後的高度對應圖軸的比例（最大值/最大值所在group的總和）
  const yRatio$ = combineLatest({
    visibleComputedLayoutData: visibleComputedLayoutData$,
    groupScaleDomain: groupScaleDomain$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const groupScaleDomainMin = data.groupScaleDomain[0]
      const groupScaleDomainMax = data.groupScaleDomain[1]
      // 只選取group篩選範圍內的資料
      const filteredData = data.visibleComputedLayoutData
        .map(d => {
          return d.filter((_d, i) => {
            return _d.groupIndex >= groupScaleDomainMin && _d.groupIndex <= groupScaleDomainMax
          })
        })
      
      const filteredDataList = filteredData.flat()
      if (filteredDataList.length <= 1) {
        return 1
      }
      
      const maxValueDatum = filteredDataList.reduce((max, current) => {
        return current.value > max.value ? current : max;
      }, filteredDataList[0])
      const maxValueGroupIndex = maxValueDatum.groupIndex
      const maxValueGroupSum = filteredDataList
        .filter(d => d.groupIndex === maxValueGroupIndex)
        .reduce((sum, current) => {
          return sum + current.value
        }, 0)
      return maxValueDatum.value / maxValueGroupSum
    })
  )

  const stackedData$ = combineLatest({
    computedLayoutData: computedLayoutData$,
    yRatio: yRatio$,
    zeroY: zeroY$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      let accYArr: number[] = data.computedLayoutData[0]
        ? data.computedLayoutData[0].map(() => data.zeroY)
        : []
      return data.computedLayoutData.map((series, seriesIndex) => {
        return series.map((datum, groupIndex) => {
          const _barStartY = accYArr[groupIndex] // 前一次的累加高度
          let _barHeight = 0
          if (datum.visible) {
            _barHeight = datum.axisYFromZero * data.yRatio
            accYArr[groupIndex] = accYArr[groupIndex] + _barHeight // 累加高度
          }
          return <GraphicDatum>{
            ...datum,
            _barStartY,
            _barHeight
          }
        })
      })
      // return data.computedData.map(d => {
      //   let accY = data.zeroY
      //   return d.map(_d => {
      //     const _barStartY = accY
      //     const _barHeight = _d.axisYFromZero * data.yRatio
      //     accY = accY + _barHeight
      //     return <GraphicDatum>{
      //       ..._d,
      //       _barStartY,
      //       _barHeight
      //     }
      //   })
      // })
    })
  )

  const noneStackedData$ = combineLatest({
    computedLayoutData: computedLayoutData$,
    // yRatio: yRatio$,
    zeroY: zeroY$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      return data.computedLayoutData.map((series, seriesIndex) => {
        return series.map((datum, groupIndex) => {
          return <GraphicDatum>{
            ...datum,
            _barStartY: data.zeroY,
            _barHeight: datum.axisYFromZero
          }
        })
      })
    })
  )

  const graphicData$ = isSeriesPositionSeprate$.pipe(
    switchMap(isSeriesPositionSeprate => {
      return iif(() => isSeriesPositionSeprate, noneStackedData$, stackedData$)
    })
  )

  combineLatest({
    defsSelection: defsSelection$,
    gridAxesSize: gridAxesSize$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    const clipPathData = [{
      id: clipPathID,
      width: data.gridAxesSize.width,
      height: data.gridAxesSize.height
    }]
    renderClipPath({
      defsSelection: data.defsSelection,
      clipPathData
    })
  })

  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const barSelection$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    graphicData: graphicData$,
    zeroY: zeroY$,
    groupLabels: groupLabels$,
    // barScale: barScale$,
    params: fullParams$,
    chartParams: fullChartParams$,
    highlightTarget: highlightTarget$,
    barWidth: barWidth$,
    transformedBarRadius: transformedBarRadius$,
    delayGroup: delayGroup$,
    transitionItem: transitionItem$,
    isSeriesPositionSeprate: isSeriesPositionSeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return renderRectBars({
        graphicGSelection: data.graphicGSelection,
        rectClassName,
        barData: data.graphicData,
        zeroY: data.zeroY,
        groupLabels: data.groupLabels,
        // barScale: data.barScale,
        params: data.params,
        chartParams: data.chartParams,
        barWidth: data.barWidth,
        transformedBarRadius: data.transformedBarRadius,
        delayGroup: data.delayGroup,
        transitionItem: data.transitionItem,
        isSeriesPositionSeprate: data.isSeriesPositionSeprate
      })
    })
  )

  combineLatest({
    barSelection: barSelection$,
    computedData: computedData$,
    highlightTarget: highlightTarget$,
    SeriesDataMap: SeriesDataMap$,
    GroupDataMap: GroupDataMap$,
  }).subscribe(data => {

    data.barSelection!
      .on('mouseover', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          gridIndex: datum.gridIndex,
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

        event$.next({
          type: 'grid',
          eventName: 'mousemove',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          gridIndex: datum.gridIndex,
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
      .on('mouseout', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'mouseout',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          gridIndex: datum.gridIndex,
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

        event$.next({
          type: 'grid',
          eventName: 'click',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          gridIndex: datum.gridIndex,
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

  })

  // const datumList$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, chartParams$, event$: store.event$ })
  
  combineLatest({
    barSelection: barSelection$,
    highlight: gridHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      selection: data.barSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}