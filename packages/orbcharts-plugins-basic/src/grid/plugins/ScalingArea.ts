import * as d3 from 'd3'
import {
  Observable,
  combineLatest,
  switchMap,
  distinctUntilChanged,
  first,
  map, 
  takeUntil,
  debounceTime,
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_SCALING_AREA_PARAMS } from '../defaults'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { createAxisPointScale, createAxisLinearScale } from '@orbcharts/core'

const pluginName = 'ScalingArea'
const rectClassName = getClassName(pluginName, 'rect')

export const ScalingArea = defineGridPlugin(pluginName, DEFAULT_SCALING_AREA_PARAMS)(({ selection, rootSelection, name, observer, subject }) => {

  const destroy$ = new Subject()

  const rootRectSelection: d3.Selection<SVGRectElement, any, any, any> = rootSelection
    .insert('rect', 'g')
    .classed(rectClassName, true)
    .attr('opacity', 0)
    // .attr('pointer-events', 'none')
  //   .attr('clip-path', 'url(#bpcharts__clipPath-box)')
  // const dataAreaSelection: d3.Selection<SVGGElement, any, any, any> = axisSelection.append('g')

  // 紀錄zoom最後一次的transform
  let lastTransform = {
    k: 1,
    x: 0,
    y: 0
  }

  observer.layout$.pipe(
    takeUntil(destroy$),
  ).subscribe(d => {
    rootRectSelection
      .attr('width', d.width)
      .attr('height', d.height)
      .attr('x', d.left)
      .attr('y', d.top)
  })

  const groupMaxIndex$ = observer.computedData$.pipe(
    map(d => d[0] ? d[0].length - 1 : 0),
    distinctUntilChanged()
  )

  // const fullDataFormatterEvent$: Subject<DataFormatterGrid> = new Subject()
  // fullDataFormatterEvent$
  //   .pipe(
  //     takeUntil(destroy$),
  //     debounceTime(50)
  //   )
  //   .subscribe(fullDataFormatter => {
  //     store.fullDataFormatter$.next(fullDataFormatter)
  //   })

  combineLatest({
    initGroupAxis: observer.fullDataFormatter$.pipe(
      map(d => d.grid.groupAxis),
      // 只用第一次資料來計算scale才不會造成每次變動都受到影響
      first()
    ),
    // fullDataFormatter: fullDataFormatter$.pipe(first()), // 只用第一次資料來計算scale才不會造成每次變動都受到影響
    fullDataFormatter: observer.fullDataFormatter$,
    groupMaxIndex: groupMaxIndex$,
    layout: observer.layout$,
    axisSize: observer.gridAxesSize$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {
    const groupMin = 0
    const groupMax = data.groupMaxIndex
    const groupScaleDomainMin = data.initGroupAxis.scaleDomain[0] === 'auto'
      ? groupMin - data.initGroupAxis.scalePadding
      : data.initGroupAxis.scaleDomain[0] as number - data.initGroupAxis.scalePadding
    const groupScaleDomainMax = data.initGroupAxis.scaleDomain[1] === 'auto'
      ? groupMax + data.initGroupAxis.scalePadding
      : data.initGroupAxis.scaleDomain[1] as number + data.initGroupAxis.scalePadding

    const scaleRange: [number, number] = data.fullDataFormatter.grid.valueAxis.position === 'left' || data.fullDataFormatter.grid.valueAxis.position === 'top'
      ? [0, 1]
      : [1, 0]

    const groupScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: data.groupMaxIndex,
      minValue: 0,
      axisWidth: data.axisSize.width,
      scaleDomain: [groupScaleDomainMin, groupScaleDomainMax],
      // scaleDomain: [groupMin, groupMax],
      scaleRange
    })

    const shadowScale = groupScale.copy()

    const zoom = d3.zoom()
      // .scaleExtent([1, data.groupMaxIndex])
      // .translateExtent([[0, 0], [data.layout.rootWidth, data.layout.rootWidth]])
      .on("zoom", function zoomed(event) {
        // console.log('event', event)
        const t = event.transform;
        // console.log('t', t)
        const mapGroupindex = (d: number) => {
          const n = Math.round(d)
          return Math.min(groupMax, Math.max(groupMin, n));
        }
        const zoomedDomain = data.fullDataFormatter.grid.groupAxis.position === 'bottom' || data.fullDataFormatter.grid.groupAxis.position === 'top'
          ? t.rescaleX(shadowScale)
            .domain()
            .map(mapGroupindex)
          : t.rescaleY(shadowScale)
          .domain()
          .map(mapGroupindex)

        // domain超過極限值
        if (zoomedDomain[0] <= groupMin && zoomedDomain[1] >= groupMax) {
          // 繼續縮小
          if (t.k < lastTransform.k) {
            // 維持前一次的transform
            t.k = lastTransform.k
            t.x = lastTransform.x
            t.y = lastTransform.y
          }
        // domain間距小於1
        } else if ((zoomedDomain[1] - zoomedDomain[0]) <= 1) {
          // 繼續放大
          if (t.k > lastTransform.k) {
            // 維持前一次的transform
            t.k = lastTransform.k
            t.x = lastTransform.x
            t.y = lastTransform.y
          }
        }
        // 紀錄transform
        lastTransform.k = t.k
        lastTransform.x = t.x
        lastTransform.y = t.y
// console.log(String(data.fullDataFormatter.visibleFilter))
        // console.log('zoomedDomain', zoomedDomain)
        subject.dataFormatter$.next({
          ...data.fullDataFormatter,
          grid: {
            ...data.fullDataFormatter.grid,
            groupAxis: {
              ...data.fullDataFormatter.grid.groupAxis,
              scaleDomain: zoomedDomain
            }
          }
        })
      })

    // 傳入外層selection
    // subject.selection.call(zoom as any)
    rootSelection.call(zoom as any)

  })
  
  return () => {
    destroy$.next(undefined)
    rootRectSelection.remove()
  }
})