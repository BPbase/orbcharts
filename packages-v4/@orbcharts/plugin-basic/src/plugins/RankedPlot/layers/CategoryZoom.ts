import * as d3 from 'd3'
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  Subject
} from 'rxjs'
import type { CategoryZoomParams, RankedPlotPluginParams } from '../types'
import { DEFAULT_CATEGORY_ZOOM_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_ROOT } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { RankedPlotExtendContext } from '../types'
import { createValueToAxisScale } from '../../../utils/d3Scale'

const pluginName = 'RankedPlot'
const layerName = 'CategoryZoom'

export const CategoryZoom = defineSVGLayer<RankedPlotExtendContext, RankedPlotPluginParams, CategoryZoomParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORY_ZOOM_PARAMS,
  layerIndex: LAYER_INDEX_OF_ROOT,
  initShow: false,
  validator: (params) => {
    return { status: 'success', columnName: '', expectToBe: '' }
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    const rootSelection = d3.select(context.svg)

    let lastTransform = { k: 1, x: 0, y: 0 }

    const categoryMaxIndex$ = context.computedData$.pipe(
      map(d => d[0] ? d[0].length - 1 : 0),
      distinctUntilChanged()
    )

    const initCategoryAxis$ = pluginParams$.pipe(
      map(d => d.categoryAxis)
    )

    const initGroupScale$ = combineLatest({
      initCategoryAxis: initCategoryAxis$,
      categoryMaxIndex: categoryMaxIndex$,
      axisSize: context.gridAxesSize$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        const categoryScaleDomainMin = data.initCategoryAxis.scaleDomain[0]
          - data.initCategoryAxis.scalePadding
        const categoryScaleDomainMax = data.initCategoryAxis.scaleDomain[1] === 'max'
          ? data.categoryMaxIndex + data.initCategoryAxis.scalePadding
          : data.initCategoryAxis.scaleDomain[1] as number + data.initCategoryAxis.scalePadding

        return createValueToAxisScale({
          maxValue: data.categoryMaxIndex,
          minValue: 0,
          axisWidth: data.axisSize.width,
          scaleDomain: [categoryScaleDomainMin, categoryScaleDomainMax],
          scaleRange: [0, 1]
        })
      })
    )

    combineLatest({
      initGroupScale: initGroupScale$,
      pluginParams: pluginParams$,
      categoryMaxIndex: categoryMaxIndex$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0)
    ).subscribe(data => {
      const categoryMinIndex = 0
      const shadowScale = data.initGroupScale.copy()

      const zoom = d3.zoom().on('zoom', function zoomed (event) {
        const t = event.transform

        const mapGroupIndex = (d: number) => {
          const n = Math.round(d)
          return Math.min(data.categoryMaxIndex, Math.max(categoryMinIndex, n))
        }

        const zoomedDomain = t.rescaleX(shadowScale)
          .domain()
          .map(mapGroupIndex)

        if (zoomedDomain[0] <= categoryMinIndex && zoomedDomain[1] >= data.categoryMaxIndex) {
          if (t.k < lastTransform.k) {
            t.k = lastTransform.k; t.x = lastTransform.x; t.y = lastTransform.y
          }
        } else if ((zoomedDomain[1] - zoomedDomain[0]) <= 1) {
          if (t.k > lastTransform.k) {
            t.k = lastTransform.k; t.x = lastTransform.x; t.y = lastTransform.y
          }
        }

        lastTransform.k = t.k; lastTransform.x = t.x; lastTransform.y = t.y

        context.eventTrigger$.next({
          eventName: 'zoom',
          pluginName,
          layerName,
          target: null,
          data: { scaleDomain: zoomedDomain }
        })
      })

      rootSelection.call(zoom)
    })

    return () => {
      destroy$.next(undefined)
      rootSelection.call(d3.zoom().on('zoom', null))
    }
  }
})
