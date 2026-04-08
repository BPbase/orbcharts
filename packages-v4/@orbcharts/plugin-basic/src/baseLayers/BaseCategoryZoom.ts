import * as d3 from 'd3'
import {
  combineLatest,
  debounceTime,
  map,
  of,
  takeUntil,
  Observable,
  Subject
} from 'rxjs'
import type { EventData } from '@orbcharts/core'
import type { BaseLayerFn } from '../types/BaseLayer'
import { createValueToAxisScale } from '../utils/d3Scale'

// Shared zoom logic for category-index based zoom.
// Used by GridPlot/CategoryZoom, CategoricalPlot/CategoryZoom, and RankedPlot/CategoryZoom.

export interface BaseCategoryZoomContext {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  // The non-zoomed (initial) category axis settings used to build the shadow scale.
  // Must NOT use zoomedCategoryAxis$ here — the shadow scale is the reference for rescaling.
  initCategoryAxis$: Observable<{
    scaleDomain: [number, number | 'max']
    scalePadding: number
  }>
  categoryMaxIndex$: Observable<number>
  // Length of the category axis in pixels.
  // Use gridAxesSize.width for all plugins (it is already transposed for vertical charts).
  axisWidth$: Observable<number>
  // true  = rescaleX (category on horizontal X axis, e.g. 'bottom-up'/'top-down')
  // false = rescaleY (category on vertical Y axis, e.g. 'left-right'/'right-left')
  // Defaults to true (most plugins have a horizontal category axis).
  isHorizontal$?: Observable<boolean>
  eventTrigger$: Subject<EventData>
}

export const createBaseCategoryZoom: BaseLayerFn<BaseCategoryZoomContext> = ({
  rootSelection,
  pluginName,
  layerName,
  initCategoryAxis$,
  categoryMaxIndex$,
  axisWidth$,
  isHorizontal$ = of(true),
  eventTrigger$
}) => {
  const destroy$ = new Subject<void>()

  // Track last transform to prevent zooming beyond domain limits
  let lastTransform = { k: 1, x: 0, y: 0 }

  const initGroupScale$ = combineLatest({
    initCategoryAxis: initCategoryAxis$,
    categoryMaxIndex: categoryMaxIndex$,
    axisWidth: axisWidth$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(data => {
      const categoryScaleDomainMin =
        data.initCategoryAxis.scaleDomain[0] - data.initCategoryAxis.scalePadding
      const categoryScaleDomainMax =
        data.initCategoryAxis.scaleDomain[1] === 'max'
          ? data.categoryMaxIndex + data.initCategoryAxis.scalePadding
          : (data.initCategoryAxis.scaleDomain[1] as number) + data.initCategoryAxis.scalePadding

      return createValueToAxisScale({
        maxValue: data.categoryMaxIndex,
        minValue: 0,
        axisWidth: data.axisWidth,
        scaleDomain: [categoryScaleDomainMin, categoryScaleDomainMax],
        scaleRange: [0, 1]
      })
    })
  )

  combineLatest({
    initGroupScale: initGroupScale$,
    categoryMaxIndex: categoryMaxIndex$,
    isHorizontal: isHorizontal$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    const categoryMinIndex = 0
    const shadowScale = data.initGroupScale.copy()

    const zoom = d3.zoom().on('zoom', function zoomed(event) {
      const t = event.transform

      const mapGroupIndex = (d: number) => {
        const n = Math.round(d)
        return Math.min(data.categoryMaxIndex, Math.max(categoryMinIndex, n))
      }

      const zoomedDomain = (
        data.isHorizontal
          ? t.rescaleX(shadowScale)
          : t.rescaleY(shadowScale)
      ).domain().map(mapGroupIndex)

      // Prevent zooming out beyond full extent
      if (zoomedDomain[0] <= categoryMinIndex && zoomedDomain[1] >= data.categoryMaxIndex) {
        if (t.k < lastTransform.k) {
          t.k = lastTransform.k; t.x = lastTransform.x; t.y = lastTransform.y
        }
      // Prevent zooming in until only 1 category remains
      } else if ((zoomedDomain[1] - zoomedDomain[0]) <= 1) {
        if (t.k > lastTransform.k) {
          t.k = lastTransform.k; t.x = lastTransform.x; t.y = lastTransform.y
        }
      }

      lastTransform.k = t.k; lastTransform.x = t.x; lastTransform.y = t.y

      eventTrigger$.next({
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
    destroy$.next()
    rootSelection.call(d3.zoom().on('zoom', null))
  }
}
