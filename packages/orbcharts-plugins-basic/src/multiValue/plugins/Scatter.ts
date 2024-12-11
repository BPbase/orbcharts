import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject
} from 'rxjs'
import type {
  ComputedDatumMultiValue,
  ComputedDataMultiValue,
  ComputedLayoutDataMultiValue,
  DefinePluginConfig,
  EventMultiValue,
  ChartParams, 
  ContainerPositionScaled,
  Layout,
  TransformData,
  ColorType
} from '../../../lib/core-types'
import {
  defineMultiValuePlugin
} from '../../../lib/core'
import type { ScatterParams } from '../../../lib/plugins-basic-types'
import { DEFAULT_SCATTER_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC_COVER } from '../../const'
import { getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { multiValueSelectionsObservable } from '../multiValueObservables'

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'Scatter'


function renderDots ({ graphicGSelection, circleGClassName, circleClassName, visibleComputedLayoutData, fullParams, fullChartParams, graphicReverseScale }: {
  graphicGSelection: d3.Selection<SVGGElement, any, any, any>
  circleGClassName: string
  circleClassName: string
  visibleComputedLayoutData: ComputedLayoutDataMultiValue
  fullParams: ScatterParams
  fullChartParams: ChartParams
  graphicReverseScale: [number, number][]
}) {
  const createEnterDuration = (enter: d3.Selection<d3.EnterElement, ComputedDatumMultiValue, SVGGElement, any>) => {
    const enterSize = enter.size()
    const eachDuration = fullChartParams.transitionDuration / enterSize
    return eachDuration
  }
  // enterDuration
  let enterDuration = 0

  graphicGSelection
    .each((categoryData, categoryIndex, g) => {
      d3.select(g[categoryIndex])
        .selectAll<SVGGElement, ComputedDatumMultiValue>('g')
        .data(visibleComputedLayoutData[categoryIndex], d => d.id)
        .join(
          enter => {
            // enterDuration
            enterDuration = createEnterDuration(enter)
    
            return enter
              .append('g')
              .classed(circleGClassName, true)     
          },
          update => update,
          exit => exit.remove()
        )
        .attr('transform', d => `translate(${d.axisX}, ${d.axisY})`)
        .each((d, i, g) => {
          const circle = d3.select(g[i])
            .selectAll('circle')
            .data([d])
            .join(
              enter => {
                return enter
                  .append('circle')
                  .style('cursor', 'pointer')
                  .style('vector-effect', 'non-scaling-stroke')
                  .classed(circleClassName, true)
                  .attr('opacity', 0)
                  .transition()
                  .delay((_d, _i) => {
                    return i * enterDuration
                  })
                  .attr('opacity', 1)
              },
              update => {
                return update
                  .transition()
                  .duration(50)
                  // .attr('cx', d => d.axisX)
                  // .attr('cy', d => d.axisY)
                  .attr('opacity', 1)
              },
              exit => exit.remove()
            )
            .attr('r', fullParams.radius)
            .attr('fill', (d, i) => getDatumColor({ datum: d, colorType: fullParams.fillColorType, fullChartParams }))
            .attr('stroke', (d, i) => getDatumColor({ datum: d, colorType: fullParams.strokeColorType, fullChartParams }))
            .attr('stroke-width', fullParams.strokeWidth)
            .attr('transform', `scale(${graphicReverseScale[categoryIndex][0] ?? 1}, ${graphicReverseScale[categoryIndex][1] ?? 1})`)
        })
    })

  const graphicCircleSelection: d3.Selection<SVGRectElement, ComputedDatumMultiValue, SVGGElement, unknown>  = graphicGSelection.selectAll(`circle.${circleClassName}`)

  return graphicCircleSelection
}


function highlightDots ({ selection, ids, fullChartParams }: {
  selection: d3.Selection<SVGGElement, ComputedDatumMultiValue, any, any>
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
    // selection
    //   .attr('stroke-width', fullParams.strokeWidth)

    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.id)) {
        const dot = d3.select(n[i])
        dot
          .style('opacity', 1)
          .transition('highlight')
          .duration(200)
        // dot
        //   .attr('stroke-width', fullParams.strokeWidthWhileHighlight)
      } else {
        const dot = d3.select(n[i])
        dot
          .style('opacity', fullChartParams.styles.unhighlightedOpacity)
          .transition('highlight')
          .duration(200)
        // dot
        //   .attr('stroke-width', fullParams.strokeWidth)
        
      }
    })
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
        .join('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })

}

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_SCATTER_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_SCATTER_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_COVER,
  validator: (params, { validateColumns }) => {
    // const result = validateColumns(params, {
    //   radius: {
    //     toBeTypes: ['number']
    //   },
    //   fillColorType: {
    //     toBeOption: 'ColorType',
    //   },
    //   strokeColorType: {
    //     toBeOption: 'ColorType',
    //   },
    //   strokeWidth: {
    //     toBeTypes: ['number']
    //   },
    //   // strokeWidthWhileHighlight: {
    //   //   toBeTypes: ['number']
    //   // },
    //   onlyShowHighlighted: {
    //     toBeTypes: ['boolean']
    //   }
    // })
    return {
      status: 'success',
      columnName: '',
      expectToBe: ''
    }
  }
}

export const Scatter = defineMultiValuePlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  
  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const circleGClassName = getClassName(pluginName, 'circleG')
  const circleClassName = getClassName(pluginName, 'circle')

  const {
    categorySelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = multiValueSelectionsObservable({
    selection,
    pluginName,
    clipPathID,
    categoryLabels$: observer.categoryLabels$,
    multiValueContainerPosition$: observer.multiValueContainerPosition$,
    multiValueGraphicTransform$: observer.multiValueGraphicTransform$
  })

  const graphicReverseScale$: Observable<[number, number][]> = combineLatest({
    computedData: observer.computedData$,
    multiValueGraphicReverseScale: observer.multiValueGraphicReverseScale$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async data => data),
    map(data => {
      return data.computedData.map((series, categoryIndex) => {
        return data.multiValueGraphicReverseScale[categoryIndex]
      })
    })
  )

  const clipPathSubscription = combineLatest({
    defsSelection: defsSelection$,
    layout: observer.layout$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    // 外層的遮罩
    const clipPathData = [{
      id: clipPathID,
      width: data.layout.width,
      height: data.layout.height
    }]
    renderClipPath({
      defsSelection: data.defsSelection,
      clipPathData,
    })
  })

  const graphicSelection$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    visibleComputedLayoutData: observer.visibleComputedLayoutData$,
    graphicReverseScale: graphicReverseScale$,
    fullChartParams: observer.fullChartParams$,
    fullParams: observer.fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return renderDots({
        graphicGSelection: data.graphicGSelection,
        circleGClassName,
        circleClassName,
        visibleComputedLayoutData: data.visibleComputedLayoutData,
        fullParams: data.fullParams,
        fullChartParams: data.fullChartParams,
        graphicReverseScale: data.graphicReverseScale
      })
    })
  )

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    graphicSelection: graphicSelection$,
    computedData: observer.computedData$,
    CategoryDataMap: observer.CategoryDataMap$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    data.graphicSelection
      .on('mouseover', (event, datum) => {
        // event.stopPropagation()
        // console.log({
        //   type: 'multiValue',
        //   eventName: 'mouseover',
        //   pluginName,
        //   highlightTarget: data.highlightTarget,
        //   datum,
        //   category: data.CategoryDataMap.get(datum.categoryLabel)!,
        //   categoryIndex: datum.categoryIndex,
        //   categoryLabel: datum.categoryLabel,
        //   data: data.computedData,
        //   event,
        // })
        subject.event$.next({
          type: 'multiValue',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          category: data.CategoryDataMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          data: data.computedData,
          event,
        })
      })
      .on('mousemove', (event, datum) => {
        // event.stopPropagation()

        subject.event$.next({
          type: 'multiValue',
          eventName: 'mousemove',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          category: data.CategoryDataMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          data: data.computedData,
          event,
        })
      })
      .on('mouseout', (event, datum) => {
        // event.stopPropagation()

        subject.event$.next({
          type: 'multiValue',
          eventName: 'mouseout',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          category: data.CategoryDataMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          data: data.computedData,
          event,
        })
      })
      .on('click', (event, datum) => {
        // event.stopPropagation()

        subject.event$.next({
          type: 'multiValue',
          eventName: 'click',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          category: data.CategoryDataMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          data: data.computedData,
          event,
        })
      })

  })

  combineLatest({
    graphicSelection: graphicSelection$,
    highlight: observer.multiValueHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlightDots({
      selection: data.graphicSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams
    })
  })

  // graphicGSelection$.subscribe(data => {
  //   console.log('graphicGSelection$', data)
  // })

  // observer.visibleComputedLayoutData$.subscribe(data => {
  //   console.log('visibleComputedLayoutData$', data)
  // })

  // observer.fullChartParams$.subscribe(data => {
  //   console.log('fullChartParams$', data)
  // })

  // observer.fullParams$.subscribe(data => {
  //   console.log('fullParams$', data)
  // })

  return () => {
    destroy$.next(undefined)
  }
})
