import * as d3 from 'd3'
import {
  combineLatest,
  distinctUntilChanged,
  debounceTime,
  map,
  Observable
} from 'rxjs'
import type { ModelDataSeries } from '@orbcharts/core'
import type { ComputedDatumSeries } from '../../types/ComputedData'
import type { ValueAxis } from '../../types/PluginParams'
import type { Layout, ContainerPositionScaled } from '../../types/PluginParams'
import type { ContainerSize, TransformData } from '../../types/Common'
import type { CategoryPlotPluginParams, CategoryPlotCategoryAxis, CategoryPlotPosition } from './types'
import { createValueToAxisScale } from '../../utils/d3Scale'
import { getMinMaxValue } from '../../utils/orbchartsUtils'

// ---- series computed data ----

export const seriesComputedDataObservable = ({
  selectedSeriesData$,
  pluginParams$
}: {
  selectedSeriesData$: Observable<ModelDataSeries>
  pluginParams$: Observable<CategoryPlotPluginParams>
}): Observable<ComputedDatumSeries[][]> => {
  return combineLatest({
    selectedSeriesData: selectedSeriesData$,
    pluginParams: pluginParams$
  }).pipe(
    debounceTime(0),
    map(({ selectedSeriesData, pluginParams }) => {
      return selectedSeriesData.map(seriesData =>
        seriesData.map((datum, index) => {
          const computed = { ...datum, seq: index, visible: true }
          computed.visible = pluginParams.visibleFilter ? pluginParams.visibleFilter(computed) : true
          return computed
        })
      )
    })
  )
}

export const seriesLabelsObservable = ({
  computedData$
}: {
  computedData$: Observable<ComputedDatumSeries[][]>
}) => {
  return computedData$.pipe(
    map(data =>
      data
        .filter(series => series.length)
        .map(series => series[0].series)
    ),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  )
}

export const seriesVisibleComputedDataObservable = ({
  computedData$
}: {
  computedData$: Observable<ComputedDatumSeries[][]>
}) => {
  return computedData$.pipe(
    map(data =>
      data
        .map(d => d.filter(_d => _d.visible == true))
        .filter(d => d.length)
    )
  )
}

// CategoryPlot always uses a single container (no separateSeries)
export const seriesContainerPositionObservable = ({
  computedData$
}: {
  computedData$: Observable<ComputedDatumSeries[][]>
}): Observable<ContainerPositionScaled[]> => {
  return computedData$.pipe(
    debounceTime(0),
    map(computedData => {
      const singlePos: ContainerPositionScaled = {
        slotIndex: 0,
        rowIndex: 0,
        columnIndex: 0,
        translate: [0, 0] as [number, number],
        scale: [1, 1] as [number, number]
      }
      if (computedData.length === 0) {
        return [singlePos]
      }
      return computedData.map(() => singlePos)
    })
  )
}

// ---- category (X axis) scale ----

// category count → category domain extent
export const categoryScaleDomainValueObservable = ({
  computedData$,
  categoryAxis$
}: {
  computedData$: Observable<ComputedDatumSeries[][]>
  categoryAxis$: Observable<CategoryPlotCategoryAxis>
}): Observable<[number, number]> => {
  return combineLatest({
    computedData: computedData$,
    categoryAxis: categoryAxis$
  }).pipe(
    debounceTime(0),
    map(data => {
      const categoryAxis = data.categoryAxis
      // categoryMax = number of categories - 1 (items in first series)
      const categoryMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      const categoryScaleDomainMin = categoryAxis.scaleDomain[0] - categoryAxis.scalePadding
      const categoryScaleDomainMax = categoryAxis.scaleDomain[1] === 'max'
        ? categoryMax + categoryAxis.scalePadding
        : (categoryAxis.scaleDomain[1] as number) + categoryAxis.scalePadding
      return [categoryScaleDomainMin, categoryScaleDomainMax] as [number, number]
    })
  )
}

// categoryIndex → X pixel (horizontal category axis, 0…layout.width)
// When position='right', the axes are mirrored (rotateY(180)), so we reverse
// the range so that category 0 appears on the right side, matching the axes.
export const ordinalScaleObservable = ({
  computedData$,
  categoryScaleDomainValue$,
  layout$,
  position$
}: {
  computedData$: Observable<ComputedDatumSeries[][]>
  categoryScaleDomainValue$: Observable<[number, number]>
  layout$: Observable<Layout>
  position$: Observable<CategoryPlotPosition>
}): Observable<d3.ScaleLinear<number, number>> => {
  return combineLatest({
    computedData: computedData$,
    categoryScaleDomainValue: categoryScaleDomainValue$,
    layout: layout$,
    position: position$
  }).pipe(
    debounceTime(0),
    map(data => {
      const categoryEndIndex = data.computedData[0] ? data.computedData[0].length - 1 : 0
      return createValueToAxisScale({
        maxValue: categoryEndIndex,
        minValue: 0,
        axisWidth: data.layout.width,   // category axis is horizontal; use width
        scaleDomain: data.categoryScaleDomainValue,
        scaleRange: [0, 1],
        reverse: data.position === 'right'  // mirror X to align with rotateY(180) axes flip
      })
    })
  )
}

// ---- axes size & transform ----
// gridAxesSize: standard orientation - width = layout.width, height = layout.height

export const gridAxesSizeObservable = ({
  layout$
}: {
  layout$: Observable<Layout>
}): Observable<ContainerSize> => {
  return layout$.pipe(
    map(layout => ({ width: layout.width, height: layout.height })),
    distinctUntilChanged((a, b) => a.width === b.width && a.height === b.height)
  )
}

export const gridAxesContainerSizeObservable = ({
  gridAxesSize$
}: {
  gridAxesSize$: Observable<ContainerSize>
}): Observable<ContainerSize> => {
  return gridAxesSize$
}

// categoryAxis='bottom' + valueAxis='left'|'right', same rotateX(180) flip as SeriesPlot
// This flip makes value scale go from bottom (small) to top (large) visually.
export const gridAxesTransformObservable = ({
  layout$,
  position$
}: {
  layout$: Observable<Layout>
  position$: Observable<CategoryPlotPosition>
}): Observable<TransformData> => {
  return combineLatest({ layout: layout$, position: position$ }).pipe(
    map(({ layout, position }) => {
      const rotateX = 180
      const rotate = 0
      if (position === 'left') {
        // value axis on LEFT: translate(0, height) rotateX(180)
        const translateX = 0
        const translateY = layout.height
        return {
          translate: [translateX, translateY] as [number, number],
          scale: [1, 1] as [number, number],
          rotate,
          rotateX,
          rotateY: 0,
          value: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(0deg)`
        }
      } else {
        // position === 'right': value axis on RIGHT: translate(width, height) rotateX(180) rotateY(180)
        const translateX = layout.width
        const translateY = layout.height
        return {
          translate: [translateX, translateY] as [number, number],
          scale: [1, 1] as [number, number],
          rotate,
          rotateX,
          rotateY: 180,
          value: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(180deg)`
        }
      }
    })
  )
}

export const gridAxesReverseTransformObservable = ({
  gridAxesTransform$
}: {
  gridAxesTransform$: Observable<TransformData>
}): Observable<TransformData> => {
  return gridAxesTransform$.pipe(
    map(d => {
      const translate: [number, number] = [0, 0]
      const scale: [number, number] = [1, 1]
      const rotate = d.rotate * -1
      const rotateX = d.rotateX * -1
      const rotateY = d.rotateY * -1
      return {
        translate,
        scale,
        rotate,
        rotateX,
        rotateY,
        value: `translate(${translate[0]}px, ${translate[1]}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotate}deg)`
      }
    })
  )
}

// ---- value (local Y / screen X) scale ----

// Filters visible data within the current zoom domain (by categoryIndex)
export const filteredMinMaxValueObservable = ({
  computedData$,
  categoryScaleDomainValue$
}: {
  computedData$: Observable<ComputedDatumSeries[][]>
  categoryScaleDomainValue$: Observable<[number, number]>
}): Observable<[number, number]> => {
  return combineLatest({
    computedData: computedData$,
    categoryScaleDomainValue: categoryScaleDomainValue$
  }).pipe(
    map(data => {
      const filteredData = data.computedData
        .flatMap(series => series.filter(d =>
          d.visible == true &&
          d.categoryIndex >= data.categoryScaleDomainValue[0] &&
          d.categoryIndex <= data.categoryScaleDomainValue[1]
        ))
      return getMinMaxValue(filteredData)
    })
  )
}

// value → Y pixel (vertical value axis, 0=top…layout.height=bottom)
// reverse: true so higher value → smaller Y (higher on screen = bubble floats up)
// Note: BaseValueAxis creates its own internal scale without reverse; the rotateX(180deg)
// transform in gridAxesTransform makes the axis visually consistent with reverse:true here.
export const valueScaleObservable = ({
  filteredMinMaxValue$,
  valueAxis$,
  layout$
}: {
  filteredMinMaxValue$: Observable<[number, number]>
  valueAxis$: Observable<ValueAxis>
  layout$: Observable<Layout>
}): Observable<d3.ScaleLinear<number, number>> => {
  return combineLatest({
    filteredMinMaxValue: filteredMinMaxValue$,
    valueAxis: valueAxis$,
    layout: layout$
  }).pipe(
    debounceTime(0),
    map(data => {
      const [minValue, maxValue] = data.filteredMinMaxValue
      return createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth: data.layout.height,  // value axis is vertical; use height
        scaleDomain: data.valueAxis.scaleDomain,
        scaleRange: data.valueAxis.scaleRange,
        reverse: true  // bubbles float up: higher value = higher on screen
      })
    })
  )
}

// Category labels ordered by categoryIndex (from first series's items)
export const categoryLabelsObservable = ({
  computedData$
}: {
  computedData$: Observable<ComputedDatumSeries[][]>
}): Observable<string[]> => {
  return computedData$.pipe(
    map(data => (data[0] ?? []).map(d => d.category)),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  )
}

