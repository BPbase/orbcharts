import * as d3 from 'd3'
import {
  iif,
  combineLatest,
  switchMap,
  map,
  debounceTime,
  takeUntil,
  distinctUntilChanged,
  of,
  Subject
} from 'rxjs'
import type { GridPlotCategoryGuideParams, GridPlotPluginParams } from '../types'
import { DEFAULT_CATEGORY_AUX_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AUX } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { GridPlotExtendContext } from '../types'
import { gridSelectionsObservable, gridCategoryPositionObservable } from '../../../utils/gridObservables'
import { createClassName } from '../../../utils/orbchartsUtils'
import { d3EventObservable } from '../../../utils/observables'
import { createBaseCategoryGuide } from '../../../baseLayers/BaseCategoryGuide'

const pluginName = 'GridPlot'
const layerName = 'CategoryGuide'

export const CategoryGuide = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotCategoryGuideParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORY_AUX_PARAMS,
  layerIndex: LAYER_INDEX_OF_AUX,
  initShow: false,
  validator: (params) => {
    return validateObject(params, {
      showLine: { toBeTypes: ['boolean'] },
      showLabel: { toBeTypes: ['boolean'] },
      lineDashArray: { toBeTypes: ['string'] },
      lineColorType: { toBeOption: 'ColorType' },
      labelColorType: { toBeOption: 'ColorType' },
      labelTextColorType: { toBeOption: 'ColorType' },
      labelTextFormat: { toBeTypes: ['string', 'Function'] },
      labelPadding: { toBeTypes: ['number'] },
      labelRotate: { toBeTypes: ['number'] }
    })
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const rootSelection = d3.select(context.svg)

    const rootRectSelection = rootSelection
      .insert('rect', 'g')
      .classed(createClassName(pluginName, layerName, 'rect'), true)
      .attr('opacity', 0)

    const { axesSelection$ } = gridSelectionsObservable({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      clipPathID: 'category-guide-clip',
      seriesLabels$: context.isSeriesSeprate$.pipe(
        switchMap(isSeriesSeprate =>
          iif(() => isSeriesSeprate, context.seriesLabels$, context.seriesLabels$.pipe(map(d => [d[0]])))
        )
      ),
      gridContainerPosition$: context.gridContainerPosition$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridGraphicTransform$: context.gridGraphicTransform$
    })

    context.layout$.pipe(takeUntil(destroy$)).subscribe(d => {
      rootRectSelection.attr('width', d.rootWidth).attr('height', d.rootHeight)
    })

    // ---- Fix: pass zoomedCategoryAxis$ so the guide position stays correct after zoom ----
    const gridGroupPosition$ = gridCategoryPositionObservable({
      rootSelection,
      pluginParams$,
      zoomedCategoryAxis$: context.zoomedCategoryAxis$,
      gridAxesContainerSize$: context.gridAxesContainerSize$,
      computedData$: context.computedData$,
      gridContainerPosition$: context.gridContainerPosition$,
      layout$: context.layout$
    }).pipe(takeUntil(destroy$))

    // Zoom-aware scale: category index -> X/Y pixel position on axes
    const groupScale$ = combineLatest({
      categoryScaleDomainValue: context.categoryScaleDomainValue$,
      gridAxesSize: context.gridAxesSize$,
      pluginParams: pluginParams$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        const reverse = data.pluginParams.categoryAxis.reverse ?? false
        return d3.scaleLinear()
          .domain(data.categoryScaleDomainValue)
          .range(reverse ? [data.gridAxesSize.width, 0] : [0, data.gridAxesSize.width])
      })
    )

    // Combine position + zoom-aware axis pixel to get the full categoryPosition
    const categoryPosition$ = combineLatest({
      gridGroupPosition: gridGroupPosition$,
      groupScale: groupScale$
    }).pipe(
      map(data => ({
        categoryIndex: data.gridGroupPosition.categoryIndex,
        categoryLabel: data.gridGroupPosition.categoryLabel,
        axisX: data.groupScale(data.gridGroupPosition.categoryIndex) ?? 0
      }))
    )

    const textReverseTransform$ = combineLatest({
      gridAxesReverseTransform: context.gridAxesReverseTransform$,
      gridContainerPosition: context.gridContainerPosition$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        const rotXY = `rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
        const rot = `rotate(${data.gridAxesReverseTransform.rotate}deg)`
        const scale = `scale(${1 / data.gridContainerPosition[0].scale[0]}, ${1 / data.gridContainerPosition[0].scale[1]})`
        return `${rotXY} ${rot} ${scale}`
      }),
      distinctUntilChanged()
    )

    const textReverseTransformWithRotate$ = combineLatest({
      textReverseTransform: textReverseTransform$,
      layerParams: layerParams$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => `${data.textReverseTransform} rotate(${data.layerParams.labelRotate}deg)`)
    )

    const rowAmount$ = context.gridContainerPosition$.pipe(
      takeUntil(destroy$),
      map(pos => pos.reduce((acc, cur) => cur.rowIndex > acc ? cur.rowIndex : acc, 0) + 1),
      distinctUntilChanged()
    )

    // Use mouseleave (not mouseout) so moving over graphic elements inside doesn't clear the guide
    const clearTrigger$ = d3EventObservable(rootSelection, 'mouseleave').pipe(
      takeUntil(destroy$)
    )

    const unsubscribe = createBaseCategoryGuide({
      selection$: axesSelection$,
      pluginName,
      layerName,
      categoryPosition$,
      clearTrigger$,
      gridAxesSize$: context.gridAxesSize$,
      layerParams$,
      categoryAxisPosition$: context.categoryAxisPosition$,
      textReverseTransformWithRotate$,
      rowAmount$,
      fontSizePx$: context.fontSizePx$,
      theme$: context.theme$,
      eventTrigger$: context.eventTrigger$
    })

    return () => {
      destroy$.next(undefined)
      rootRectSelection.remove()
      unsubscribe()
    }
  }
})
