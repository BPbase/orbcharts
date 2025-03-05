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
import type { BasePluginFn } from './types'
import type {
  ComputedDataMultiValue,
  DataFormatterTypeMap,
  DataFormatterMultiValue,
  DataFormatterMultiValuePartial,
  EventMultiValue,
  Layout
} from '../../lib/core-types'
import {
  defineMultiValuePlugin, createValueToAxisScale } from '../../lib/core'

interface BaseRacingBarsContext {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  dataFormatter$: Subject<DataFormatterMultiValuePartial>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  xyMinMax$: Observable<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }>
  layout$: Observable<Layout>
}

export const createBaseXZoom: BasePluginFn<BaseRacingBarsContext> = (pluginName: string, {
  rootSelection,
  dataFormatter$,
  fullDataFormatter$,
  xyMinMax$,
  layout$,
}) => {

  const destroy$ = new Subject()

  // 紀錄zoom最後一次的transform
  let lastTransform = {
    k: 1,
    x: 0,
    y: 0
  }

  const initXAxis$ = fullDataFormatter$.pipe(
    map(d => d.xAxis),
    // 只用第一次資料來計算scale才不會造成每次變動都受到影響
    first()
  )

  const initYAxis$ = fullDataFormatter$.pipe(
    map(d => d.yAxis),
    // 只用第一次資料來計算scale才不會造成每次變動都受到影響
    first()
  )

  const initXScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
    combineLatest({
      initXAxis: initXAxis$,
      layout: layout$,
      xyMinMax: xyMinMax$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
    
      const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue: data.xyMinMax.maxX,
        minValue: data.xyMinMax.minX,
        axisWidth: data.layout.width,
        scaleDomain: data.initXAxis.scaleDomain,
        scaleRange: data.initXAxis.scaleRange,
      })

      subscriber.next(xScale)
    })
  })

  // const initYScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
  //   combineLatest({
  //     initYAxis: initYAxis$,
  //     layout: observer.layout$,
  //     xyMinMax: observer.xyMinMax$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
    
  //     const yScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
  //       maxValue: data.xyMinMax.maxY,
  //       minValue: data.xyMinMax.minY,
  //       axisWidth: data.layout.height,
  //       scaleDomain: data.initYAxis.scaleDomain,
  //       scaleRange: data.initYAxis.scaleRange,
  //       reverse: true
  //     })

  //     subscriber.next(yScale)
  //   })
  // })

  const minMaxScaleDomain$ = combineLatest({
    initXAxis: initXAxis$,
    initYAxis: initYAxis$,
    xyMinMax: xyMinMax$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      let minX = data.xyMinMax.minX
      let maxX = data.xyMinMax.maxX
      let minY = data.xyMinMax.minY
      let maxY = data.xyMinMax.maxY

      // 原始設定為auto時要額外判斷
      if (data.initXAxis.scaleDomain[0] === 'auto' && minX > 0) {
        minX = 0
      }
      if (data.initXAxis.scaleDomain[1] === 'auto' && maxX < 0) {
        maxX = 0
      }
      if (data.initYAxis.scaleDomain[0] === 'auto' && minY > 0) {
        minY = 0
      }
      if (data.initYAxis.scaleDomain[1] === 'auto' && maxY < 0) {
        maxY = 0
      }

      return {
        minX,
        maxX,
        minY,
        maxY
      }
    }),
  )

  combineLatest({
    initXScale: initXScale$,
    fullDataFormatter: fullDataFormatter$,
    minMaxScaleDomain: minMaxScaleDomain$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    // const groupMin = 0

    const shadowScale = data.initXScale.copy()

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
          return Math.min(data.minMaxScaleDomain.maxX, Math.max(data.minMaxScaleDomain.minX, n));
        }
        
        const zoomedDomain = t.rescaleX(shadowScale)
          .domain()
          .map(mapGroupindex)


        // domain超過極限值
        if (zoomedDomain[0] <= data.minMaxScaleDomain.minX && zoomedDomain[1] >= data.minMaxScaleDomain.maxX) {
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

        // console.log(zoomedDomain)
        const newDataFormatter: DataFormatterMultiValue = {
          ...data.fullDataFormatter,
          xAxis: {
            ...data.fullDataFormatter.xAxis,
            scaleDomain: zoomedDomain
          }
        }
        dataFormatter$.next(newDataFormatter)
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
}