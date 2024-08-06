import * as d3 from 'd3'
import {
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
  DataFormatterGrid,
  EventGrid,
  ChartParams, 
  Layout,
  TransformData } from '@orbcharts/core'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID } from '../utils/orbchartsUtils'

export interface BaseBarStackParams {
  barWidth: number
  barGroupPadding: number
  barRadius: number | boolean
}

interface BaseBarStackContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullParams$: Observable<BaseBarStackParams>
  fullDataFormatter$: Observable<DataFormatterGrid>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<string[]>
  event$: Subject<EventGrid>
}


interface GraphicDatum extends ComputedDatumGrid {
  _barStartY: number // bar的起點y座標
  _barHeight: number // bar的高度
}

interface RenderBarParams {
  selection: d3.Selection<SVGGElement, unknown, any, any>
  data: GraphicDatum[][]
  zeroY: number
  groupLabels: string[]
  // barScale: d3.ScalePoint<string>
  params: BaseBarStackParams
  chartParams: ChartParams
  barWidth: number
  transformedBarRadius: [number, number]
  delayGroup: number
  transitionItem: number
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'BarStack'
const gClassName = getClassName(pluginName, 'g')
const gContentClassName = getClassName(pluginName, 'g-content')
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

function renderRectBars ({ selection, data, zeroY, groupLabels, params, chartParams, barWidth, transformedBarRadius, delayGroup, transitionItem }: RenderBarParams) {
  
  const barHalfWidth = barWidth! / 2

  const barGroup = selection
    .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${gClassName}`)
    .data(data, (d, i) => groupLabels[i])
    .join(
      enter => {
        return enter
          .append('g')
          .classed(gClassName, true)
          .attr('cursor', 'pointer')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('transform', (d, i) => `translate(${d[0] ? d[0].axisX : 0}, ${0})`)
    .each((d, i, g) => {
      const bars = d3.select(g[i])
        .selectAll<SVGGElement, ComputedDatumGrid>('g')
        .data(d, _d => _d.id)
        .join(
          enter => {
            return enter
              .append('g')
              .classed(gContentClassName, true)
          },
          update => update,
          exit => exit.remove()
        )
        .each((_d, _i, _g) => {
          const rect = d3.select(_g[_i])
            .selectAll<SVGRectElement, ComputedDatumGrid>('rect')
            .data([_d], _d => _d.id)
            .join(
              enter => {
                return enter
                  .append('rect')
                  .attr('y', d => zeroY)
                  .attr('height', d => 0)
              },
              update => update,
              exit => exit.remove()
            )
            .attr('rx', transformedBarRadius[0])
            .attr('ry', transformedBarRadius[1])
            .attr('fill', d => d.color)
            .attr('transform', `translate(${-barHalfWidth}, 0)`)
            .attr('x', d => 0)
            .attr('width', barWidth!)
            .transition()
            .duration(transitionItem)
            .ease(getD3TransitionEase(chartParams.transitionEase))
            .delay((d, i) => d.groupIndex * delayGroup)
            .attr('y', d => d._barStartY)
            .attr('height', d => Math.abs(d._barHeight))
        })
        
    })

  const graphicBarSelection: d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown>  = barGroup.selectAll(`g.${gContentClassName}`)


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
  visibleComputedData$,
  SeriesDataMap$,
  GroupDataMap$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridAxesSize$,
  gridHighlight$,
  event$
}) => {

  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')

  const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
    .append('g')
    .attr('clip-path', `url(#${clipPathID})`)
  const defsSelection: d3.Selection<SVGDefsElement, ComputedDatumGrid, any, any> = axisSelection.append('defs')
  const graphicGSelection: d3.Selection<SVGGElement, any, any, any> = axisSelection.append('g')
  const barSelection$: Subject<d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown>> = new Subject()

  gridAxesTransform$
    .pipe(
      takeUntil(destroy$),
      map(d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      axisSelection
        .style('transform', d)
    })

  gridGraphicTransform$
    .pipe(
      takeUntil(destroy$),
      switchMap(async d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      graphicGSelection
        .transition()
        .duration(50)
        .style('transform', d)
    })

  // const axisSize$ = gridAxisSizeObservable({
  //   dataFormatter$,
  //   layout$
  // })

  // const visibleComputedData$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     const visibleComputedData = data
  //       .map(d => {
  //         return d.filter(_d => {
  //           return _d.visible == true
  //         })
  //       })
  //       .filter(d => d.length)
  //     // console.log('visibleComputedData', visibleComputedData)
  //     return visibleComputedData
  //   })
  // )

  const zeroY$ = visibleComputedData$.pipe(
    map(d => d[0] && d[0][0]
      ? d[0][0].axisY - d[0][0].axisYFromZero
      : 0),
    distinctUntilChanged()
  )

  const barWidth$ = new Observable<number>(subscriber => {
    combineLatest({
      computedData: computedData$,
      // visibleComputedData: visibleComputedData$,
      params: fullParams$,
      axisSize: gridAxesSize$
    }).pipe(
      switchMap(async d => d)
    ).subscribe(data => {
      const barWidth = data.params.barWidth
        ? data.params.barWidth
        : calcBarWidth({
          axisWidth: data.axisSize.width,
          groupAmount: data.computedData[0] ? data.computedData[0].length : 0,
          barGroupPadding: data.params.barGroupPadding
        })
      subscriber.next(barWidth)
    })
  }).pipe(
    takeUntil(destroy$),
    distinctUntilChanged()
  )

  // 圓角的值 [rx, ry]
  const transformedBarRadius$: Observable<[number, number]> = combineLatest({
    gridGraphicTransform: gridGraphicTransform$,
    barWidth: barWidth$,
    params: fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async data => data),
    map(data => {
      const barHalfWidth = data.barWidth! / 2
      const radius = data.params.barRadius === true ? barHalfWidth
        : data.params.barRadius === false ? 0
        : typeof data.params.barRadius == 'number' ? data.params.barRadius
        : 0
      const transformedRx = radius == 0
        ? 0
        : radius / data.gridGraphicTransform.scale[0] // 反向外層scale的變型
      const transformedRy = radius == 0
        ? 0
        : radius / data.gridGraphicTransform.scale[1]
      return [transformedRx, transformedRy]
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
    })
  )

  // const barScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
  //   combineLatest({
  //     seriesLabels: seriesLabels$,
  //     barWidth: barWidth$,
  //     params: fullParams$,
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async d => d)
  //   ).subscribe(data => {
  //     const barScale = makeBarScale(data.barWidth, data.seriesLabels, data.params)
  //     subscriber.next(barScale)
  //   })
  // })

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

  const transposedVisibleData$: Observable<ComputedDataGrid> = visibleComputedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      console.log('visibleComputedData', data)
      // 取得原始陣列的維度
      const rows = data.length;
      const cols = data.reduce((prev, current) => {
        return Math.max(prev, current.length)
      }, 0)

      // 初始化轉換後的陣列
      const transposedArray = new Array(cols).fill(null).map(() => new Array(rows).fill(null))

      // 遍歷原始陣列，進行轉換
      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
              transposedArray[j][i] = data[i][j]
          }
      }
      return transposedArray
    })
  )

  const yRatio$ = combineLatest({
    transposedVisibleData: transposedVisibleData$,
    dataFormatter: fullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const groupMin = 0
      const groupMax = data.transposedVisibleData.length - 1
      const groupScaleDomainMin = data.dataFormatter.groupAxis.scaleDomain[0] === 'auto'
        ? groupMin - data.dataFormatter.groupAxis.scalePadding
        : data.dataFormatter.groupAxis.scaleDomain[0] as number - data.dataFormatter.groupAxis.scalePadding
      const groupScaleDomainMax = data.dataFormatter.groupAxis.scaleDomain[1] === 'auto'
        ? groupMax + data.dataFormatter.groupAxis.scalePadding
        : data.dataFormatter.groupAxis.scaleDomain[1] as number + data.dataFormatter.groupAxis.scalePadding
        
      const filteredData = data.transposedVisibleData
        .map(d => {
          return d.filter((_d, i) => {
            return _d.groupIndex >= groupScaleDomainMin && _d.groupIndex <= groupScaleDomainMax
          })
        })
      // console.log('filteredData', filteredData)
        
      if (!filteredData.flat().length) {
        return 1
      } else {
        const yArr = filteredData.flat().map(d => d.axisYFromZero)
        const barMaxY = Math.max(...yArr)
        const stackYArr = filteredData.map(d => d.reduce((prev, current) => prev + current.axisYFromZero, 0))
        const barStackMaxY = Math.max(...stackYArr)

        return barMaxY / barStackMaxY
      }
    })
  )

  const graphicData$ = combineLatest({
    transposedVisibleData: transposedVisibleData$,
    yRatio: yRatio$,
    zeroY: zeroY$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      console.log(data.transposedVisibleData)
      return data.transposedVisibleData.map(d => {
        let accY = data.zeroY
        return d.map(_d => {
          const _barStartY = accY
          const _barHeight = _d.axisYFromZero * data.yRatio
          accY = accY + _barHeight
          return <GraphicDatum>{
            ..._d,
            _barStartY,
            _barHeight
          }
        })
      })
    })
  )

  gridAxesSize$.pipe(
    takeUntil(destroy$)
  ).subscribe(data => {
    const clipPathData = [{
      id: clipPathID,
      width: data.width,
      height: data.height
    }]
    renderClipPath({
      defsSelection,
      clipPathData
    })
  })

  // const SeriesDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridSeriesDataMap(d))
  // )

  // const GroupDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridGroupDataMap(d))
  // )

  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    // renderBarsFn: renderBarsFn$,
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
    SeriesDataMap: SeriesDataMap$,
    GroupDataMap: GroupDataMap$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {
    const barSelection = renderRectBars({
      selection: graphicGSelection,
      data: data.graphicData,
      zeroY: data.zeroY,
      groupLabels: data.groupLabels,
      // barScale: data.barScale,
      params: data.params,
      chartParams: data.chartParams,
      barWidth: data.barWidth,
      transformedBarRadius: data.transformedBarRadius,
      delayGroup: data.delayGroup,
      transitionItem: data.transitionItem
    })

    barSelection!
      .on('mouseover', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.graphicData
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
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.graphicData
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
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.graphicData
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
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.graphicData
        })
      })

    barSelection$.next(barSelection!)
  })

  // const datumList$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, chartParams$, event$: store.event$ })
  const highlightSubscription = gridHighlight$.subscribe()
  
  combineLatest({
    barSelection: barSelection$,
    highlight: gridHighlight$,
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
    highlightSubscription.unsubscribe()
  }
}