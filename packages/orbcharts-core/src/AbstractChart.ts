import * as d3 from 'd3'
import {
  Subject } from 'rxjs'
import type {
  ComputedDataFn,
  ChartEntity,
  ChartType,
  ChartParamsPartial,
  ContextObserverFn,
  ChartOptionsPartial,
  DataTypeMap,
  DataFormatterTypeMap,
  DataFormatterPartialTypeMap,
  EventTypeMap,
  PluginEntity } from './types'
import { createBaseChart } from './base/createBaseChart'

export abstract class AbstractChart<T extends ChartType> implements ChartEntity<T> {
  selection: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
  destroy: () => void
  data$: Subject<DataTypeMap<T>> = new Subject()
  dataFormatter$: Subject<DataFormatterPartialTypeMap<T>> = new Subject()
  plugins$: Subject<PluginEntity<T, any, any>[]> = new Subject()
  chartParams$: Subject<ChartParamsPartial> = new Subject()
  event$: Subject<EventTypeMap<T>> = new Subject()

  constructor (
    { defaultDataFormatter, computedDataFn, contextObserverFn }: {
      defaultDataFormatter: DataFormatterTypeMap<T>
      computedDataFn: ComputedDataFn<T>
      contextObserverFn: ContextObserverFn<T>
    },
    element: HTMLElement | Element,
    options?: ChartOptionsPartial<T>
  ) {
    const baseChart = createBaseChart({ defaultDataFormatter, computedDataFn, contextObserverFn })
    const chartEntity = baseChart(element, options)

    this.selection = chartEntity.selection
    this.destroy = chartEntity.destroy
    this.data$ = chartEntity.data$
    this.dataFormatter$ = chartEntity.dataFormatter$
    this.plugins$ = chartEntity.plugins$
    this.chartParams$ = chartEntity.chartParams$
    this.event$ = chartEntity.event$
  }
  
}
