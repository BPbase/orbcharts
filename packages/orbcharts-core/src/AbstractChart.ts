import * as d3 from 'd3'
import {
  Subject } from 'rxjs'
import type {
  ComputedDataFn,
  DataValidator,
  ChartEntity,
  ChartType,
  ChartParamsPartial,
  ContextObserverCallback,
  ChartOptionsPartial,
  DataTypeMap,
  DataFormatterTypeMap,
  DataFormatterPartialTypeMap,
  DataFormatterValidator,
  EventTypeMap,
  PluginEntity } from '../lib/core-types'
import { createBaseChart } from './base/createBaseChart'
import { createOrbChartsErrorMessage } from './utils/errorMessage'

export abstract class AbstractChart<T extends ChartType> implements ChartEntity<T> {
  selection: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
  destroy: () => void
  data$: Subject<DataTypeMap<T>> = new Subject()
  dataFormatter$: Subject<DataFormatterPartialTypeMap<T>> = new Subject()
  plugins$: Subject<PluginEntity<T, any, any>[]> = new Subject()
  chartParams$: Subject<ChartParamsPartial> = new Subject()
  event$: Subject<EventTypeMap<T>> = new Subject()

  constructor (
    { defaultDataFormatter, dataFormatterValidator, computedDataFn, dataValidator, contextObserverCallback }: {
      defaultDataFormatter: DataFormatterTypeMap<T>
      dataFormatterValidator: DataFormatterValidator<T>
      computedDataFn: ComputedDataFn<T>
      dataValidator: DataValidator<T>
      contextObserverCallback: ContextObserverCallback<T>
    },
    element: HTMLElement | Element,
    options?: ChartOptionsPartial<T>
  ) {
    try {
      const baseChart = createBaseChart({ defaultDataFormatter, dataFormatterValidator, computedDataFn, dataValidator, contextObserverCallback })
      const chartEntity = baseChart(element, options)

      this.selection = chartEntity.selection
      this.destroy = chartEntity.destroy
      this.data$ = chartEntity.data$
      this.dataFormatter$ = chartEntity.dataFormatter$
      this.plugins$ = chartEntity.plugins$
      this.chartParams$ = chartEntity.chartParams$
      this.event$ = chartEntity.event$
    } catch (e) {
      console.error(createOrbChartsErrorMessage(e))
    }
  }
  
}
