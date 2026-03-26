import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  debounceTime,
  Observable,
  Subject } from 'rxjs'
import type { Theme, EventData } from '../../../../../core/src/types'
import type { CompositionPlotExtendContext, CompositionPlotPluginParams, PieLabelsParams } from "../types"
import type { PieDatum } from '../utils'
import { defineSVGLayer } from "../../../../../core/src"
import { validateObject } from '../../../../../core/src/utils'
import { DEFAULT_PIE_LABELS_PARAMS } from "../defaults"
import { seriesCenterSelectionObservable } from "../../../utils/seriesObservables"
import { getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName } from '../../../utils/orbchartsUtils'
import { makeD3Arc } from '../../../utils/d3Utils'
import { makePieData } from '../utils'
import type { ComputedDatumSeries } from '../../../types/ComputedData'
import type { ContainerPosition } from '../../../types/PluginParams'
import { LAYER_INDEX_OF_LABEL } from '../../../const/layerIndex'
import { renderTspansOnQuadrant } from '../../../utils/d3Graphics'

interface RenderDatum {
  pieDatum: PieDatum
  arcIndex: number
  arcLabels: string[]
  lineStartX: number
  lineStartY: number
  lineStartMouseoverX: number
  lineStartMouseoverY: number
  x: number
  y: number
  mouseoverX: number
  mouseoverY: number
  textWidth: number, // 文字寬度
  collisionShiftX: number // 避免碰撞的位移
  collisionShiftY: number
  quadrant: number // 第幾象限
}

const pluginName = 'CompositionPlot'
const layerName = 'PieLabels'
const labelGClassName = createClassName(pluginName, layerName, 'label-g')
const lineGClassName = createClassName(pluginName, layerName, 'line-g')
const textClassName = createClassName(pluginName, layerName, 'text')
const pieOuterCentroid = 2

function makeRenderData ({ pieData, arc, arcMouseover, labelCentroid, lineStartCentroid, layerParams }: {
  pieData: PieDatum[]
  arc: d3.Arc<any, d3.DefaultArcObject>
  arcMouseover: d3.Arc<any, d3.DefaultArcObject>
  labelCentroid: number
  lineStartCentroid: number
  layerParams: PieLabelsParams
}): RenderDatum[] {
  return pieData
    .map((d, i) => {
      const [_x, _y] = arc!.centroid(d as any)
      const [_mouseoverX, _mouseoverY] = arcMouseover!.centroid(d as any)
      const arcLabel = layerParams.labelFn(d.data)
      return {
        pieDatum: d,
        arcIndex: i,
        arcLabels: arcLabel.split('\n'),
        lineStartX: _x * lineStartCentroid,
        lineStartY: _y * lineStartCentroid,
        lineStartMouseoverX: _mouseoverX * lineStartCentroid,
        lineStartMouseoverY: _mouseoverY * lineStartCentroid,
        x: _x * labelCentroid!,
        y: _y * labelCentroid!,
        mouseoverX: _mouseoverX * labelCentroid!,
        mouseoverY: _mouseoverY * labelCentroid!,
        textWidth: 0, // 後面再做計算
        collisionShiftX: 0, // 後面再做計算
        collisionShiftY: 0, // 後面再做計算
        quadrant: _x >= 0 && _y <= 0
          ? 1
          : _x < 0 && _y <= 0
            ? 2
            : _x < 0 && _y > 0
              ? 3
              : 4
      }
    })
    .filter(d => d.pieDatum.data.visible)
}

// 繪製圓餅圖
function renderLabel ({ labelGSelection, data, layerParams, pluginParams, theme, fontSizePx }: {
  labelGSelection: d3.Selection<SVGGElement, undefined, any, any>
  data: RenderDatum[]
  layerParams: PieLabelsParams
  pluginParams: CompositionPlotPluginParams
  theme: Theme
  fontSizePx: number
}) {
  // console.log(data)
  // let update = this.gSelection.selectAll('g').data(pieData)
  const textSelection = labelGSelection
    .selectAll<SVGTextElement, RenderDatum>('text')
    .data(data, d => d.pieDatum.id)
    .join('text')
    .classed(textClassName, true)
    .attr('font-weight', 'bold')
    .attr('text-anchor', d => d.quadrant == 1 || d.quadrant == 4 ? 'start' : 'end')
    .style('dominant-baseline', d => d.quadrant == 1 || d.quadrant == 2 ? 'auto' : 'hanging')
    // .style('pointer-events', 'none')
    .style('cursor', d => pluginParams.styles.highlightTarget && pluginParams.styles.highlightTarget != 'none'
      ? 'pointer'
      : 'none')
    // .text(d => layerParams.labelFn(d.pieDatum.data))
    .attr('font-size', fontSizePx)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', (d, i) => getDatumColor({ datum: d.pieDatum.data, colorType: layerParams.labelColorType, theme }))
    .each((d, i, n) => {
      // const textNode = d3.select<SVGTextElement, RenderDatum>(n[i])
      //   .selectAll('tspan')
      //   .data(d.arcLabels)
      //   .join('tspan')
      //   .attr('x', 0)
      //   .attr('y', (_d, _i) => d.quadrant == 1 || d.quadrant == 2
      //     ? - (d.arcLabels.length - 1 - _i) * fontSizePx
      //     : _i * fontSizePx)
      //   .text(d => d)
      renderTspansOnQuadrant(d3.select<SVGTextElement, RenderDatum>(n[i]), {
        textArr: d.arcLabels,
        fontSizePx,
        quadrant: d.quadrant
      })
    })
  textSelection  
    .transition()
    .attr('transform', (d) => {
      // console.log('transform', d)
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    // .on('end', () => initHighlight({ labelSelection, data, fullChartParams }))

  // 如無新增資料則不用等動畫
  // if (enter.size() == 0) {
  //   this.initHighlight()
  // }

  return textSelection
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
function resolveCollisions(textSelection: d3.Selection<SVGTextElement, RenderDatum, any, any>, data: RenderDatum[], fontSizePx: number) {
  const textArray = textSelection.nodes();
  const padding = fontSizePx  // 調整文字間的間距
  
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

  // 順時針碰撞檢測（只處理 2、4 象限，將較後面的文字碰撞時往外偏移）
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

        if (data[j].quadrant == 2) {
          const moveDown = (by > ay)
            ? -padding * 2
            : -padding
          data[j].collisionShiftY += moveDown // 由後一個累加高度
        } else if (data[j].quadrant == 4) {
          const moveDown = (by > ay)
            ? padding
            : padding * 2
          data[j].collisionShiftY += moveDown // 由後一個累加高度
        }
      }
    }
  }

  // 逆時針碰撞檢測（只處理 1、3 象限，將較前面的文字碰撞時往外偏移）
  for (let i = positions.length - 1; i >= 0; i--) {
    const a = positions[i]
    
    for (let j = i - 1; j >= 0; j--) {
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

        if (data[j].quadrant == 1) {
          const moveDown = (by > ay)
            ? -padding * 2
            : -padding
          data[j].collisionShiftY += moveDown // 由前一個累加高度
        } else if (data[j].quadrant == 3) {
          const moveDown = (by > ay)
            ? padding
            : padding * 2
          data[j].collisionShiftY += moveDown // 由前一個累加高度
        }
      }
    }
  }

  // 全部算完再來 render
  textSelection
    .data(data)
    .transition()
    .attr('transform', (d) => {
      return `translate(${d.x + d.collisionShiftX},${d.y + d.collisionShiftY})`
    })
}

function renderLine ({ lineGSelection, data, layerParams, theme }: {
  lineGSelection: d3.Selection<SVGGElement, undefined, any, any>
  data: RenderDatum[]
  layerParams: PieLabelsParams
  theme: Theme
}) {
  
  // 只顯示在有偏移的標籤
  const filteredData = data.filter(d => d.collisionShiftX || d.collisionShiftY)

  // 添加標籤的連接線
  const lines = lineGSelection.selectAll<SVGPolylineElement, RenderDatum>("polyline")
    .data(filteredData, d => d.pieDatum.id)
    .join("polyline")
    .attr("stroke", d => getDatumColor({ datum: d.pieDatum.data, colorType: layerParams.labelColorType, theme }))
    .attr("stroke-width", 1)
    .attr("fill", "none")
    .attr("points", (d) => {
      return [[d.lineStartX, d.lineStartY], [d.lineStartX, d.lineStartY]] as any // 畫出從弧線中心到延伸點的線
    })
  lines
    .transition()
    .attr("points", (d) => {
      // const pos = arc.centroid(d)  // 起點：弧線的中心點
      // const outerPos = [pos[0] * 2.5, pos[1] * 2.5]  // 外部延伸的點（乘以倍率來延長線段）

      let lineEndX = d.x + d.collisionShiftX
      let lineEndY = d.y + d.collisionShiftY
      // if (d.lineStartX >= Math.abs(d.lineStartY)) {
      //   lineEndX -= d.textWidth / 2
      // } else if (d.lineStartX <= - Math.abs(d.lineStartY)) {
      //   lineEndX += d.textWidth / 2
      // }

      return [[lineEndX, lineEndY], [d.lineStartX, d.lineStartY]] as any // 畫出從弧線中心到延伸點的線
    })

  return lines
}

function highlight ({ textSelection, lineSelection, ids, pluginParams }: {
  textSelection: d3.Selection<SVGTextElement, RenderDatum, any, any>
  lineSelection: d3.Selection<SVGPolylineElement, RenderDatum, any, any>
  ids: string[]
  pluginParams: CompositionPlotPluginParams
}) {
  textSelection.interrupt('highlight')
  lineSelection.interrupt('highlight')
  
  if (!ids.length) {
    textSelection
      .transition('highlight')
      .duration(200)
      .attr('transform', (d) => {
        return `translate(${d.x + d.collisionShiftX},${d.y + d.collisionShiftY})`
      })
      .style('opacity', 1)
    lineSelection
      .transition('highlight')
      .duration(200)
      .style('opacity', 1)
    return
  }
  
  textSelection.each((d, i, n) => {
    const segment = d3.select<SVGTextElement, RenderDatum>(n[i])

    if (ids.includes(d.pieDatum.id)) {
      segment
        .style('opacity', 1)
        .transition('highlight')
        .duration(200)
        .attr('transform', (d) => {
          // 如果已經有偏移過，則使用偏移後的位置（如果再改變的話很容易造成文字重疊）
          if (d.collisionShiftX || d.collisionShiftY) {
            return `translate(${d.x + d.collisionShiftX},${d.y + d.collisionShiftY})`
          }
          return `translate(${d.mouseoverX + d.collisionShiftX},${d.mouseoverY + d.collisionShiftY})`
        })
    } else {
      segment
        .style('opacity', pluginParams.styles.unhighlightedOpacity)
        .transition('highlight')
        .duration(200)
        .attr('transform', (d) => {
          return `translate(${d.x + d.collisionShiftX},${d.y + d.collisionShiftY})`
        })
    }
  })
  lineSelection.each((d, i, n) => {
    const segment = d3.select<SVGPolylineElement, RenderDatum>(n[i])

    if (ids.includes(d.pieDatum.data.id)) {
      segment
        .style('opacity', 1)
        .transition('highlight')
        .duration(200)
    } else {
      segment
        .style('opacity', pluginParams.styles.unhighlightedOpacity)
        .transition('highlight')
        .duration(200)
    }
  })
}


function createEachPieLabel (context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  // computedData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedSortedData$: Observable<ComputedDatumSeries[]>
  // SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  layerParams$: Observable<PieLabelsParams>
  pluginParams$: Observable<CompositionPlotPluginParams>
  theme$: Observable<Theme>
  fontSizePx$: Observable<number>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<ContainerPosition>
  eventTrigger$: Subject<EventData>
}) {
  const destroy$ = new Subject()

  context.containerSelection.selectAll('g').remove()

  const lineGSelection: d3.Selection<SVGGElement, any, any, unknown> = context.containerSelection.append('g')
  lineGSelection.classed(lineGClassName, true)
  const labelGSelection: d3.Selection<SVGGElement, any, any, unknown> = context.containerSelection.append('g')
  labelGSelection.classed(labelGClassName, true)

  // const graphicSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  const textSelection$: Subject<d3.Selection<SVGTextElement, RenderDatum, any, any>> = new Subject()
  const lineSelection$: Subject<d3.Selection<SVGPolylineElement, RenderDatum, any, any>> = new Subject()
  let renderData: RenderDatum[] = []
  
  const shorterSideWith$ = context.seriesContainerPosition$.pipe(
    takeUntil(destroy$),
    map(d => d.width < d.height ? d.width : d.height),
    distinctUntilChanged()
  )

  const lineStartCentroid$ = context.layerParams$.pipe(
    takeUntil(destroy$),
    map(d => {
      return d.labelCentroid >= pieOuterCentroid
        ? pieOuterCentroid // 當 label在 pie的外側時，線條從 pie的邊緣開始
        : d.labelCentroid // 當 label在 pie的內側時，線條從 label未偏移前的位置開始

    })
  )

  combineLatest({
    shorterSideWith: shorterSideWith$,
    containerVisibleComputedSortedData: context.containerVisibleComputedSortedData$,
    layerParams: context.layerParams$,
    pluginParams: context.pluginParams$,
    theme: context.theme$,
    fontSizePx: context.fontSizePx$,
    lineStartCentroid: lineStartCentroid$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    // 弧產生器 (d3.arc())
    const arc = makeD3Arc({
      axisWidth: data.shorterSideWith,
      innerRadius: 0,
      outerRadius: data.layerParams.outerRadius,
      padAngle: 0,
      cornerRadius: 0
    })

    const arcMouseover = makeD3Arc({
      axisWidth: data.shorterSideWith,
      innerRadius: 0,
      outerRadius: data.layerParams.outerRadiusWhileHighlight, // 外半徑變化
      padAngle: 0,
      cornerRadius: 0
    })

    const pieData = makePieData({
      data: data.containerVisibleComputedSortedData,
      startAngle: data.layerParams.startAngle,
      endAngle: data.layerParams.endAngle
    })

    renderData = makeRenderData({
      pieData,
      arc,
      arcMouseover,
      labelCentroid: data.layerParams.labelCentroid,
      lineStartCentroid: data.lineStartCentroid,
      layerParams: data.layerParams
    })

    // 先移除線條，等偏移後再重新繪製
    lineGSelection.selectAll('polyline').remove()

    const textSelection = renderLabel({
      labelGSelection,
      data: renderData,
      layerParams: data.layerParams,
      pluginParams: data.pluginParams,
      theme: data.theme,
      fontSizePx: data.fontSizePx
    })

    // 等 label 本身的 transition 結束後再進行碰撞檢測
    setTimeout(() => {
      // resolveCollisions(labelSelection, renderData)
      // 偏移 label
      resolveCollisions(textSelection, renderData, data.fontSizePx)

      const lineSelection = renderLine({ lineGSelection, data: renderData, layerParams: data.layerParams, theme: data.theme })

      lineSelection$.next(lineSelection)

    }, 1000)

    textSelection$.next(textSelection)

  })
  
  combineLatest({
    textSelection: textSelection$,
    lineSelection: lineSelection$,
    highlight: context.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    pluginParams: context.pluginParams$,
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    highlight({
      textSelection: data.textSelection,
      lineSelection: data.lineSelection,
      ids: data.highlight,
      pluginParams: data.pluginParams,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}

export const PieLabels = defineSVGLayer<CompositionPlotExtendContext, CompositionPlotPluginParams, PieLabelsParams>({
  name: layerName,
  defaultParams: DEFAULT_PIE_LABELS_PARAMS,
  layerIndex: LAYER_INDEX_OF_LABEL,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      outerRadius: {
        toBeTypes: ['number'],
      },
      outerRadiusWhileHighlight: {
        toBeTypes: ['number'],
      },
      startAngle: {
        toBeTypes: ['number'],
      },
      endAngle: {
        toBeTypes: ['number'],
      },
      labelCentroid: {
        toBeTypes: ['number'],
      },
      labelFn: {
        toBeTypes: ['Function'],
      },
      labelColorType: {
        toBeOption: 'ColorType'
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    const destroy$ = new Subject()

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        d3.select(svgG)
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      visibleComputedSortedData$: context.visibleComputedSortedData$,
      seriesContainerPosition$: context.seriesContainerPosition$
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

          const containerVisibleComputedSortedData$ = context.visibleComputedSortedData$.pipe(
            takeUntil(destroy$),
            map(data => data[containerIndex] ?? data[0])
          )

          const containerPosition$ = context.seriesContainerPosition$.pipe(
            takeUntil(destroy$),
            map(data => data[containerIndex] ?? data[0])
          )

          unsubscribeFnArr[containerIndex] = createEachPieLabel({
            containerSelection: containerSelection,
            // computedData$: observer.computedData$,
            containerVisibleComputedSortedData$: containerVisibleComputedSortedData$,
            // SeriesDataMap$: observer.SeriesDataMap$,
            layerParams$: layerParams$,
            pluginParams$: pluginParams$,
            theme$: context.theme$,
            fontSizePx$: context.fontSizePx$,
            seriesHighlight$: context.seriesHighlight$,
            seriesContainerPosition$: containerPosition$,
            eventTrigger$: context.eventTrigger$,
          })

        })
      })

    return () => {
      // subscription.unsubscribe()
      destroy$.next(undefined)
      unsubscribeFnArr.forEach(fn => fn())
    }
  }
})