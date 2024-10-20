import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  first,
  map,
  takeUntil,
  Observable,
  distinctUntilChanged,
  Subject,
  BehaviorSubject } from 'rxjs'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import type {
  ComputedDatumSeries,
  SeriesContainerPosition,
  EventSeries,
  ChartParams } from '@orbcharts/core'
import type { PieLabelsParams } from '../types'
import type { PieDatum } from '../seriesUtils'
import { DEFAULT_PIE_LABELS_PARAMS } from '../defaults'
import { makePieData } from '../seriesUtils'
import { makeD3Arc } from '../../utils/d3Utils'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'

interface RenderDatum {
  pieDatum: PieDatum
  arcIndex: number
  arcLabel: string
  pieOuterX: number
  pieOuterY: number
  pieOuterMouseoverX: number
  pieOuterMouseoverY: number
  x: number
  y: number
  mouseoverX: number
  mouseoverY: number
  textWidth: number, // 文字寬度
  collisionShiftX: number // 避免碰撞的位移
  collisionShiftY: number
}

const pluginName = 'PieLabels'
const textClassName = getClassName(pluginName, 'text')

function makeRenderData (pieData: PieDatum[], arc: d3.Arc<any, d3.DefaultArcObject>, mouseoverArc: d3.Arc<any, d3.DefaultArcObject>, centroid: number): RenderDatum[] {
  return pieData
    .map((d, i) => {
      const [_x, _y] = arc!.centroid(d as any)
      const [_mouseoverX, _mouseoverY] = mouseoverArc!.centroid(d as any)
      return {
        pieDatum: d,
        arcIndex: i,
        arcLabel: d.data.label,
        pieOuterX: _x * 2,
        pieOuterY: _y * 2,
        pieOuterMouseoverX: _mouseoverX * 2,
        pieOuterMouseoverY: _mouseoverY * 2,
        x: _x * centroid!,
        y: _y * centroid!,
        mouseoverX: _mouseoverX * centroid!,
        mouseoverY: _mouseoverY * centroid!,
        textWidth: 0,
        collisionShiftX: 0,
        collisionShiftY: 0,
      }
    })
    .filter(d => d.pieDatum.data.visible)
}

// 繪製圓餅圖
function renderLabel (selection: d3.Selection<SVGGElement, undefined, any, any>, data: RenderDatum[], pluginParams: PieLabelsParams, fullChartParams: ChartParams) {
  // console.log(data)
  // let update = this.gSelection.selectAll('g').data(pieData)
  let update: d3.Selection<SVGPathElement, RenderDatum, any, any> = selection
    .selectAll<SVGPathElement, RenderDatum>('text')
    .data(data, d => d.pieDatum.id)
  let enter = update.enter()
    .append<SVGPathElement>('text')
    .classed(textClassName, true)
  let exit = update.exit()

  enter
    .append('text')
    
  const labelSelection = update.merge(enter)
  labelSelection
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .style('dominant-baseline', 'middle')
    // .style('pointer-events', 'none')
    .style('cursor', d => fullChartParams.highlightTarget && fullChartParams.highlightTarget != 'none'
      ? 'pointer'
      : 'none')
    // .text((d, i) => d.arcLabel)
    .text(d => pluginParams.labelFn(d.pieDatum.data))
    .attr('font-size', fullChartParams.styles.textSize)
    .attr('fill', (d, i) => getDatumColor({ datum: d.pieDatum.data, colorType: pluginParams.labelColorType, fullChartParams }))
    .transition()
    .attr('transform', (d) => {
      // console.log('transform', d)
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    // .on('end', () => initHighlight({ labelSelection, data, fullChartParams }))
  exit.remove()

  // 如無新增資料則不用等動畫
  // if (enter.size() == 0) {
  //   this.initHighlight()
  // }

  return labelSelection
}

// // 獲取每個文字元素的邊界框並檢查是否重疊
// function resolveCollisions(labelSelection: d3.Selection<SVGPathElement, RenderDatum, any, any>, data: RenderDatum[]) {
//   const textArray = labelSelection.nodes();
//   const padding = 10;  // 調整文字間的間距
  
//   // 存儲每個標籤的當前位置
//   const positions = textArray.map((textNode, i) => {
//     const bbox = textNode.getBBox();
//     // const arcCentroid = arc.centroid(data[i]);
//     const arcCentroid = [data[i].x, data[i].y];
//     return { 
//       node: textNode, 
//       x: arcCentroid[0], 
//       y: arcCentroid[1], 
//       width: bbox.width, 
//       height: bbox.height
//     };
//   });
//   // console.log('positions', positions)

//   for (let i = 0; i < positions.length; i++) {
//     const a = positions[i];

//     for (let j = i + 1; j < positions.length; j++) {
//       const b = positions[j];

//       // 檢查是否重疊
//       if (!(a.x + a.width / 2 < b.x - b.width / 2 || 
//             a.x - a.width / 2 > b.x + b.width / 2 || 
//             a.y + a.height / 2 < b.y - b.height / 2 || 
//             a.y - a.height / 2 > b.y + b.height / 2)) {
        
//         // 如果有重疊，則位移其中一個文字，這裡我們進行上下位移
//         const moveDown = (b.y > a.y) ? padding : -padding;  // 決定方向
//         b.y += moveDown;  // 更新 b 的 y 座標
        
//         // 更新 b 的 x 座標，根據與 a 的位置差異進行微調
//         const moveRight = (b.x > a.x) ? padding : -padding;
//         b.x += moveRight;

//         // // 重新設置 b 的 transform 來移動
//         d3.select(b.node)
//           .transition()
//           .attr("transform", `translate(${b.x},${b.y})`);

//         data[j].collisionShiftX = moveRight
//         data[j].collisionShiftY = moveDown
//       }
//     }
//   }
// }

// 獲取每個文字元素的邊界框並檢查是否重疊
function setShiftData(labelSelection: d3.Selection<SVGPathElement, RenderDatum, any, any>, data: RenderDatum[]) {
  const textArray = labelSelection.nodes();
  const padding = 10;  // 調整文字間的間距
  
  // 存儲每個標籤的當前位置
  const positions = textArray.map((textNode, i) => {
    const bbox = textNode.getBBox();
    // const arcCentroid = arc.centroid(data[i]);
    const arcCentroid = [data[i].x, data[i].y];
    return { 
      node: textNode, 
      x: arcCentroid[0], 
      y: arcCentroid[1], 
      width: bbox.width, 
      height: bbox.height
    }
  })
  // console.log('positions', positions)

  for (let i = 0; i < positions.length; i++) {
    const a = positions[i]
    
    for (let j = i + 1; j < positions.length; j++) {
      const b = positions[j]

      // 記錄文字寬度
      data[i].textWidth = a.width

      const ax = a.x + data[i].collisionShiftX
      const ay = a.y + data[i].collisionShiftY
      const bx = b.x + data[j].collisionShiftX
      const by = b.y + data[j].collisionShiftY

      // 檢查是否重疊
      if (!(ax + a.width / 2 < bx - b.width / 2 || 
            ax - a.width / 2 > bx + b.width / 2 || 
            ay + a.height / 2 < by - b.height / 2 || 
            ay - a.height / 2 > by + b.height / 2)) {
        
        // 如果有重疊，則位移其中一個文字，這裡我們進行上下位移
        const moveDown = (by > ay) ? padding : -padding;  // 決定方向
        // b.y += moveDown;  // 更新 b 的 y 座標
        
        // 更新 b 的 x 座標，根據與 a 的位置差異進行微調
        const moveRight = (bx > ax) ? padding : -padding;
        // b.x += moveRight;

        // // 重新設置 b 的 transform 來移動
        // d3.select(b.node)
        //   .transition()
        //   .attr("transform", `translate(${b.x},${b.y})`);

        // 累加位移
        data[j].collisionShiftX += moveRight
        data[j].collisionShiftY += moveDown
      }
    }
  }
}

function renderLine (selection: d3.Selection<SVGGElement, undefined, any, any>, data: RenderDatum[]) {
  // 添加標籤的連接線
  const lines = selection.selectAll<SVGPolylineElement, RenderDatum>("polyline")
    .data(data, d => d.pieDatum.id)
    .join("polyline")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", "none")
    .attr("points", (d) => {
      // const pos = arc.centroid(d)  // 起點：弧線的中心點
      // const outerPos = [pos[0] * 2.5, pos[1] * 2.5]  // 外部延伸的點（乘以倍率來延長線段）

      let lineEndX = d.x + d.collisionShiftX
      let lineEndY = d.y + d.collisionShiftY
      if (d.pieOuterX >= Math.abs(d.pieOuterY)) {
        lineEndX -= d.textWidth / 2
      } else if (d.pieOuterX <= - Math.abs(d.pieOuterY)) {
        lineEndX += d.textWidth / 2
      }

      return [[lineEndX, lineEndY], [d.pieOuterX, d.pieOuterY]]  // 畫出從弧線中心到延伸點的線
    })
}

// function initHighlight ({ labelSelection, data, fullChartParams }: {
//   labelSelection: (d3.Selection<SVGPathElement, RenderDatum, any, any>)
//   data: RenderDatum[]
//   fullChartParams: ChartParams
// }) {
//   removeHighlight({ labelSelection })
//   // if (fullParams.highlightSeriesId || fullParams.highlightDatumId) {
//     highlight({
//       labelSelection,
//       data,
//       id: fullChartParams.highlightDefault,
//       label: fullChartParams.highlightDefault,
//       fullChartParams
//     })
//   // }
// }

function highlight ({ labelSelection, ids, fullChartParams }: {
  labelSelection: (d3.Selection<SVGPathElement, RenderDatum, any, any>)
  ids: string[]
  fullChartParams: ChartParams
}) {
  labelSelection.interrupt('highlight')
  
  if (!ids.length) {
    labelSelection
      .transition('highlight')
      .duration(200)
      .attr('transform', (d) => {
        return `translate(${d.x + d.collisionShiftX},${d.y + d.collisionShiftY})`
      })
      .style('opacity', 1)
    return
  }
  
  labelSelection.each((d, i, n) => {
    const segment = d3.select<SVGPathElement, RenderDatum>(n[i])

    if (ids.includes(d.pieDatum.id)) {
      segment
        .style('opacity', 1)
        .transition('highlight')
        .duration(200)
        .attr('transform', (d) => {
          return `translate(${d.mouseoverX + d.collisionShiftX},${d.mouseoverY + d.collisionShiftY})`
        })
    } else {
      segment
        .style('opacity', fullChartParams.styles.unhighlightedOpacity)
        .transition('highlight')
        .duration(200)
        .attr('transform', (d) => {
          return `translate(${d.x + d.collisionShiftX},${d.y + d.collisionShiftY})`
        })
    }
  })
}


function createEachPieLabel (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  // computedData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedLayoutData$: Observable<ComputedDatumSeries[]>
  // SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<PieLabelsParams>
  fullChartParams$: Observable<ChartParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition>
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  // const graphicSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  let labelSelection$: Subject<d3.Selection<SVGPathElement, RenderDatum, any, any>> = new Subject()
  let renderData: RenderDatum[] = []
  
  const shorterSideWith$ = context.seriesContainerPosition$.pipe(
    takeUntil(destroy$),
    map(d => d.width < d.height ? d.width : d.height),
    distinctUntilChanged()
  )

  combineLatest({
    shorterSideWith: shorterSideWith$,
    containerVisibleComputedLayoutData: context.containerVisibleComputedLayoutData$,
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    // const shorterSideWith = data.layout.width < data.layout.height ? data.layout.width : data.layout.height

    // 弧產生器 (d3.arc())
    const arc = makeD3Arc({
      axisWidth: data.shorterSideWith,
      innerRadius: 0,
      outerRadius: data.fullParams.outerRadius,
      padAngle: 0,
      cornerRadius: 0
    })

    const arcMouseover = makeD3Arc({
      axisWidth: data.shorterSideWith,
      innerRadius: 0,
      outerRadius: data.fullParams.outerRadiusWhileHighlight, // 外半徑變化
      padAngle: 0,
      cornerRadius: 0
    })

    const pieData = makePieData({
      data: data.containerVisibleComputedLayoutData,
      startAngle: data.fullParams.startAngle,
      endAngle: data.fullParams.endAngle
    })

    renderData = makeRenderData(pieData, arc, arcMouseover, data.fullParams.labelCentroid)

    const labelSelection = renderLabel(context.containerSelection, renderData, data.fullParams, data.fullChartParams)

    

    // labelSelection.on('end', () => {
    //   console.log('end')
    //   resolveCollisions(labelSelection, renderData)
    // })
    // 等 label 本身的 transition 結束後再進行碰撞檢測
    setTimeout(() => {
      // resolveCollisions(labelSelection, renderData)
      setShiftData(labelSelection, renderData)
      // console.log('renderData', renderData)
      context.containerSelection
        .selectAll('text')
        .data(renderData)
        .transition()
        .attr('transform', (d) => {
          return `translate(${d.x + d.collisionShiftX},${d.y + d.collisionShiftY})`
        })

      renderLine(context.containerSelection, renderData)
    }, 1000)

    labelSelection$.next(labelSelection)

  })
  
  combineLatest({
    labelSelection: labelSelection$,
    highlight: context.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: context.fullChartParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      labelSelection: data.labelSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}


export const PieLabels = defineSeriesPlugin(pluginName, DEFAULT_PIE_LABELS_PARAMS)(({ selection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
    selection: selection,
    pluginName,
    separateSeries$: observer.separateSeries$,
    seriesLabels$: observer.seriesLabels$,
    seriesContainerPosition$: observer.seriesContainerPosition$
  })

  const unsubscribeFnArr: (() => void)[] = []

  seriesCenterSelection$
    .pipe(
      takeUntil(destroy$)
    )
    .subscribe(seriesCenterSelection => {
      // 每次重新計算時，清除之前的訂閱
      unsubscribeFnArr.forEach(fn => fn())

      seriesCenterSelection.each((d, containerIndex, g) => { 
        
        const containerSelection = d3.select(g[containerIndex])

        const containerVisibleComputedLayoutData$ = observer.visibleComputedLayoutData$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        const containerPosition$ = observer.seriesContainerPosition$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        unsubscribeFnArr[containerIndex] = createEachPieLabel(pluginName, {
          containerSelection: containerSelection,
          // computedData$: observer.computedData$,
          containerVisibleComputedLayoutData$: containerVisibleComputedLayoutData$,
          // SeriesDataMap$: observer.SeriesDataMap$,
          fullParams$: observer.fullParams$,
          fullChartParams$: observer.fullChartParams$,
          seriesHighlight$: observer.seriesHighlight$,
          seriesContainerPosition$: containerPosition$,
          event$: subject.event$,
        })

      })
    })

  return () => {
    destroy$.next(undefined)
  }
})
