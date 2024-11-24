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
import type { DefinePluginConfig } from '../../../lib/core-types'
import type { DataFormatterGrid } from '../../../lib/core-types'
import {
  defineGridPlugin, createAxisLinearScale } from '../../../lib/core'
import { DEFAULT_SCALING_AREA_PARAMS } from '../defaults'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { LAYER_INDEX_OF_ROOT } from '../../const'

const pluginName = 'ScalingArea'
const rectClassName = getClassName(pluginName, 'rect')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_SCALING_AREA_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_SCALING_AREA_PARAMS,
  layerIndex: LAYER_INDEX_OF_ROOT,
  validator: (params, { validateColumns }) => {
    return {
      status: 'success',
      columnName: '',
      expectToBe: ''
    }
  }
}

export const ScalingArea = defineGridPlugin(pluginConfig)(({ selection, rootSelection, name, observer, subject }) => {

  const destroy$ = new Subject()

  // const rootRectSelection: d3.Selection<SVGRectElement, any, any, any> = rootSelection
  //   .append('rect')
  //   .classed(rectClassName, true)
  //   .attr('opacity', 0)

  // 紀錄zoom最後一次的transform
  let lastTransform = {
    k: 1,
    x: 0,
    y: 0
  }
  // let lastDomain: [number, number] = [0, 0]

  // observer.layout$.pipe(
  //   takeUntil(destroy$),
  // ).subscribe(d => {
  //   rootRectSelection
  //     .attr('width', d.width)
  //     .attr('height', d.height)
  //     .attr('x', d.left)
  //     .attr('y', d.top)
  // })

  const groupMax$ = observer.computedData$.pipe(
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

  const initGroupAxis$ = observer.fullDataFormatter$.pipe(
    map(d => d.grid.groupAxis),
    // 只用第一次資料來計算scale才不會造成每次變動都受到影響
    first()
  )


  const groupScale$ = combineLatest({
    initGroupAxis: initGroupAxis$,
    fullDataFormatter: observer.fullDataFormatter$,
    groupMax: groupMax$,
    layout: observer.layout$,
    axisSize: observer.gridAxesSize$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // const groupMin = 0
      const groupScaleDomainMin = data.initGroupAxis.scaleDomain[0] - data.initGroupAxis.scalePadding
      const groupScaleDomainMax = data.initGroupAxis.scaleDomain[1] === 'max'
        ? data.groupMax + data.initGroupAxis.scalePadding
        : data.initGroupAxis.scaleDomain[1] as number + data.initGroupAxis.scalePadding

      const groupScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
        maxValue: data.groupMax,
        minValue: 0,
        axisWidth: data.axisSize.width,
        scaleDomain: [groupScaleDomainMin, groupScaleDomainMax],
        scaleRange: [0, 1]
      })

      return groupScale
    })
  )

  combineLatest({
    groupScale: groupScale$,
    // initGroupAxis: initGroupAxis$,
    // fullDataFormatter: fullDataFormatter$.pipe(first()), // 只用第一次資料來計算scale才不會造成每次變動都受到影響
    fullDataFormatter: observer.fullDataFormatter$,
    groupMax: groupMax$,
    // layout: observer.layout$,
    // axisSize: observer.gridAxesSize$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    const groupMin = 0

    const shadowScale = data.groupScale.copy()

    const zoom = d3.zoom()
      // .scaleExtent([1, data.groupMaxIndex])
      // .translateExtent([[0, 0], [data.layout.rootWidth, data.layout.rootWidth]])
      .on("zoom", function zoomed(event) {
        // debugger
        // console.log('event', event)
        const t = event.transform;

        // if (event.sourceEvent.type === 'mousemove') {
        //   // 當進行平移時，反向計算 x 軸
        //   const dx = event.transform.x - currentTransform.x; // 本次平移增量
        //   const reversedX = currentTransform.x - dx;         // 反向累積平移
        //   // 更新變換狀態
        //   currentTransform = d3.zoomIdentity
        //     .translate(reversedX, event.transform.y)
        //     .scale(event.transform.k);
        // } else {
        //   // 縮放操作：只更新縮放比例
        //   currentTransform = d3.zoomIdentity
        //     .translate(currentTransform.x, currentTransform.y)
        //     .scale(event.transform.k);
        // }
        // console.log('currentTransform', currentTransform)

        // console.log('t.x', t.x)
        const mapGroupindex = (d: number) => {
          const n = Math.round(d)
          return Math.min(data.groupMax, Math.max(groupMin, n));
        }
        
        const zoomedDomain = data.fullDataFormatter.grid.groupAxis.position === 'bottom' || data.fullDataFormatter.grid.groupAxis.position === 'top'
          ? t.rescaleX(shadowScale)
            .domain()
            .map(mapGroupindex)
          : t.rescaleY(shadowScale)
          .domain()
          .map(mapGroupindex)


        // domain超過極限值
        if (zoomedDomain[0] <= groupMin && zoomedDomain[1] >= data.groupMax) {
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


        const newDataFormatter: DataFormatterGrid = {
          ...data.fullDataFormatter,
          grid: {
            ...data.fullDataFormatter.grid,
            groupAxis: {
              ...data.fullDataFormatter.grid.groupAxis,
              scaleDomain: zoomedDomain
            }
          }
        }
        subject.dataFormatter$.next(newDataFormatter)
      })

    // 傳入外層selection
    // subject.selection.call(zoom as any)
    rootSelection.call(zoom)

  })
  
  return () => {
    destroy$.next(undefined)
    // rootRectSelection.remove()
    
    rootSelection.call(d3.zoom().on('zoom', null))
  }
})