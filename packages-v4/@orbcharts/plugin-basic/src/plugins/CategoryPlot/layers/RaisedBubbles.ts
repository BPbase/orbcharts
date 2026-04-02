import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RaisedBubblesParams, CategoryPlotPluginParams } from '../types'
import { DEFAULT_RAISED_BUBBLES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { CategoryPlotExtendContext } from '../types'
import { createBaseRaisedBubbles } from '../../../baseLayers/BaseRaisedBubbles'

const pluginName = 'CategoryPlot'
const layerName = 'RaisedBubbles'

export const RaisedBubbles = defineSVGLayer<CategoryPlotExtendContext, CategoryPlotPluginParams, RaisedBubblesParams>({
  name: layerName,
  defaultParams: DEFAULT_RAISED_BUBBLES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: true,
  validator: (params) => {
    return { status: 'success', columnName: '', expectToBe: '' }
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseRaisedBubbles({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      visibleComputedData$: context.visibleComputedData$,
      fullParams$: layerParams$,
      styles$: pluginParams$.pipe(map(params => params.styles)),
      gridHighlight$: context.gridHighlight$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      layout$: context.layout$,
      ordinalScale$: context.ordinalScale$,
      valueScale$: context.valueScale$,
      categoryScaleDomainValue$: context.categoryScaleDomainValue$,
      eventTrigger$: context.eventTrigger$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribe()
    }
  }
})
