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
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineSeriesPlugin } from '../../../lib/core'
import type {
  ComputedDatumSeries,
  ContainerPosition,
  EventSeries,
  ChartParams } from '../../../lib/core-types'
import type { RoseLabelsParams } from '../../../lib/plugins-basic-types'
import type { PieDatum } from '../seriesUtils'
import { DEFAULT_ROSE_LABELS_PARAMS } from '../defaults'
// import { makePieData } from '../seriesUtils'
import { makeD3Arc } from '../../utils/d3Utils'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'
import { renderTspansOnQuadrant } from '../../utils/d3Graphics'
import { LAYER_INDEX_OF_LABEL } from '../../const'

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

const pluginName = 'RoseLabels'
const labelGClassName = getClassName(pluginName, 'label-g')
const lineGClassName = getClassName(pluginName, 'line-g')
const textClassName = getClassName(pluginName, 'text')

const pieOuterCentroid = 2

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_ROSE_LABELS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_ROSE_LABELS_PARAMS,
  layerIndex: LAYER_INDEX_OF_LABEL,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      outerRadius: {
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
      },
      arcScaleType: {
        toBe: '"area" | "radius"',
        test: (value: any) => value === 'area' || value === 'radius'
      },
    })
    return result
  }
}

function makeRenderData ({ pieData, labelCentroid, arcScaleType, maxValue, axisWidth, outerRadius, lineStartCentroid, fullParams }: {
  pieData: PieDatum[]
  // arc: d3.Arc<any, d3.DefaultArcObject>
  labelCentroid: number
  arcScaleType: 'area' | 'radius'
  maxValue: number
  axisWidth: number
  outerRadius: number
  lineStartCentroid: number
  fullParams: RoseLabelsParams
}): RenderDatum[] {

  const outerRadiusWidth = (axisWidth / 2) * outerRadius

  const exponent = arcScaleType === 'area'
    ? 0.5 // 比例映射面積（0.5為取平方根）
    : 1 // 比例映射半徑

  const arcScale = d3.scalePow()
    .domain([0, maxValue])
    .range([0, outerRadiusWidth])
    .exponent(exponent)

  return pieData
    .map((d, i) => {
      const eachOuterRadius = arcScale(d.value)

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(eachOuterRadius)
        .padAngle(0)
        .padRadius(eachOuterRadius)
        .cornerRadius(0)

      const [_x, _y] = arc!.centroid(d as any)
      const [_mouseoverX, _mouseoverY] = [_x, _y]
      const arcLabel = fullParams.labelFn(d.data)
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
function renderLabel ({ labelGSelection, data, fullParams, fullChartParams, textSizePx }: {
  labelGSelection: d3.Selection<SVGGElement, undefined, any, any>
  data: RenderDatum[]
  fullParams: RoseLabelsParams
  fullChartParams: ChartParams
  textSizePx: number
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
    .style('cursor', d => fullChartParams.highlightTarget && fullChartParams.highlightTarget != 'none'
      ? 'pointer'
      : 'none')
    // .text((d, i) => d.arcLabel)
    // .text(d => fullParams.labelFn(d.pieDatum.data))
    .attr('font-size', fullChartParams.styles.textSize)
    .attr('fill', (d, i) => getDatumColor({ datum: d.pieDatum.data, colorType: fullParams.labelColorType, fullChartParams }))
    .each((d, i, n) => {
      // const textNode = d3.select<SVGTextElement, RenderDatum>(n[i])
      //   .selectAll('tspan')
      //   .data(d.arcLabels)
      //   .join('tspan')
      //   .attr('x', 0)
      //   .attr('y', (_d, _i) => d.quadrant == 1 || d.quadrant == 2
      //     ? - (d.arcLabels.length - 1 - _i) * textSizePx
      //     : _i * textSizePx)
      //   .text(d => d)
      renderTspansOnQuadrant(d3.select<SVGTextElement, RenderDatum>(n[i]), {
        textArr: d.arcLabels,
        textSizePx,
        quadrant: d.quadrant
      })
    })
  textSelection
    .transition()
    .attr('transform', (d) => {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    // .on('end', () => initHighlight({ labelSelection, data, fullChartParams }))

  // 如無新增資料則不用等動畫
  // if (enter.size() == 0) {
  //   this.initHighlight()
  // }

  return textSelection
}

// 獲取每個文字元素的邊界框並檢查是否重疊
function resolveCollisions(textSelection: d3.Selection<SVGTextElement, RenderDatum, any, any>, data: RenderDatum[], textSizePx: number) {
  const textArray = textSelection.nodes();
  const padding = textSizePx  // 調整文字間的間距
  
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

function renderLine ({ lineGSelection, data, fullParams, fullChartParams }: {
  lineGSelection: d3.Selection<SVGGElement, undefined, any, any>
  data: RenderDatum[]
  fullParams: RoseLabelsParams
  fullChartParams: ChartParams
}) {
  
  // 只顯示在有偏移的標籤
  const filteredData = data.filter(d => d.collisionShiftX || d.collisionShiftY)

  // 添加標籤的連接線
  const lines = lineGSelection.selectAll<SVGPolylineElement, RenderDatum>("polyline")
    .data(filteredData, d => d.pieDatum.id)
    .join("polyline")
    .attr("stroke", d => getDatumColor({ datum: d.pieDatum.data, colorType: fullParams.labelColorType, fullChartParams }))
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

function highlight ({ textSelection, lineSelection, ids, fullChartParams }: {
  textSelection: d3.Selection<SVGTextElement, RenderDatum, any, any>
  lineSelection: d3.Selection<SVGPolylineElement, RenderDatum, any, any>
  ids: string[]
  fullChartParams: ChartParams
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

    if (ids.includes(d.pieDatum.data.id)) {
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
  lineSelection.each((d, i, n) => {
    const segment = d3.select<SVGPolylineElement, RenderDatum>(n[i])

    if (ids.includes(d.pieDatum.data.id)) {
      segment
        .style('opacity', 1)
        .transition('highlight')
        .duration(200)
    } else {
      segment
        .style('opacity', fullChartParams.styles.unhighlightedOpacity)
        .transition('highlight')
        .duration(200)
    }
  })
}


function createEachPieLabel (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  // computedData$: Observable<ComputedDatumSeries[][]>
  visibleComputedSortedData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedSortedData$: Observable<ComputedDatumSeries[]>
  // SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<RoseLabelsParams>
  fullChartParams$: Observable<ChartParams>
  textSizePx$: Observable<number>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<ContainerPosition>
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  context.containerSelection.selectAll('g').remove()

  const lineGSelection: d3.Selection<SVGGElement, any, any, unknown> = context.containerSelection.append('g')
  lineGSelection.classed(lineGClassName, true)
  const labelGSelection: d3.Selection<SVGGElement, any, any, unknown> = context.containerSelection.append('g')
  labelGSelection.classed(labelGClassName, true)

  const textSelection$: Subject<d3.Selection<SVGTextElement, RenderDatum, any, any>> = new Subject()
  const lineSelection$: Subject<d3.Selection<SVGPolylineElement, RenderDatum, any, any>> = new Subject()
  let renderData: RenderDatum[] = []
  
  const shorterSideWith$ = context.seriesContainerPosition$.pipe(
    takeUntil(destroy$),
    map(d => d.width < d.height ? d.width : d.height),
    distinctUntilChanged()
  )

  const maxValue$ = context.visibleComputedSortedData$.pipe(
    map(data => Math.max(...data.flat().map(d => d.value))),
    distinctUntilChanged()
  )

  const lineStartCentroid$ = context.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => {
      return d.labelCentroid >= pieOuterCentroid
        ? pieOuterCentroid // 當 label在 pie的外側時，線條從 pie的邊緣開始
        : d.labelCentroid // 當 label在 pie的內側時，線條從 label未偏移前的位置開始

    })
  )

  combineLatest({
    // layout: context.seriesContainerPosition$,
    shorterSideWith: shorterSideWith$,
    containerVisibleComputedSortedData: context.containerVisibleComputedSortedData$,
    maxValue: maxValue$,
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$,
    textSizePx: context.textSizePx$,
    lineStartCentroid: lineStartCentroid$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    const eachAngle = Math.PI * 2 / data.containerVisibleComputedSortedData.length

    const pieData = data.containerVisibleComputedSortedData.map((d, i) => {
      return {
        id: d.id,
        data: d,
        index: i,
        value: d.value,
        startAngle: eachAngle * i,
        endAngle: eachAngle * (i + 1),
        padAngle: 0, 
        // prevValue: lastPieData[i] ? lastPieData[i].value : 0
      }
    })

    renderData = makeRenderData({
      pieData,
      labelCentroid: data.fullParams.labelCentroid,
      arcScaleType: data.fullParams.arcScaleType,
      maxValue: data.maxValue,
      axisWidth: data.shorterSideWith,
      outerRadius: data.fullParams.outerRadius,
      lineStartCentroid: data.lineStartCentroid,
      fullParams: data.fullParams
    })

    // 先移除線條，等偏移後再重新繪製
    lineGSelection.selectAll('polyline').remove()

    const textSelection = renderLabel({
      labelGSelection,
      data: renderData,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams,
      textSizePx: data.textSizePx
    })

    // 等 label 本身的 transition 結束後再進行碰撞檢測
    setTimeout(() => {
      // 偏移 label
      resolveCollisions(textSelection, renderData, data.textSizePx)

      const lineSelection = renderLine({ lineGSelection, data: renderData, fullParams: data.fullParams, fullChartParams: data.fullChartParams })

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
    fullChartParams: context.fullChartParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      textSelection: data.textSelection,
      lineSelection: data.lineSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}


export const RoseLabels = defineSeriesPlugin(pluginConfig)(({ selection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
    selection: selection,
    pluginName,
    visibleComputedSortedData$: observer.visibleComputedSortedData$,
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

        const containerVisibleComputedSortedData$ = observer.visibleComputedSortedData$.pipe(
          takeUntil(destroy$),
          map(data => JSON.parse(JSON.stringify(data[containerIndex] ?? data[0])))
        )

        const containerPosition$ = observer.seriesContainerPosition$.pipe(
          takeUntil(destroy$),
          map(data => JSON.parse(JSON.stringify(data[containerIndex] ?? data[0])))
        )

        unsubscribeFnArr[containerIndex] = createEachPieLabel(pluginName, {
          containerSelection: containerSelection,
          // computedData$: observer.computedData$,
          visibleComputedSortedData$: observer.visibleComputedSortedData$,
          containerVisibleComputedSortedData$: containerVisibleComputedSortedData$,
          // SeriesDataMap$: observer.SeriesDataMap$,
          fullParams$: observer.fullParams$,
          fullChartParams$: observer.fullChartParams$,
          textSizePx$: observer.textSizePx$,
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
