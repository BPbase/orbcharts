import * as d3 from 'd3'
import {
  Subject, 
  Observable,
  BehaviorSubject} from 'rxjs'
import type { SeriesTooltipExtendContext, SeriesTooltipPluginParams, SeriesTooltipParams } from "../types"
import type { ColorType } from '../../../../../core/src/types'
import { defineSVGLayer } from "../../../../../core/src"
import { validateObject } from '../../../../../core/src/utils'
import { DEFAULT_SERIES_TOOLTIP_PARAMS } from "../../SeriesTooltip/defaults"
import { LAYER_INDEX_OF_TOOLTIP } from '../../../const/layerIndex'
import { createBaseTooltip } from '../../../baseLayers/BaseTooltip'
import { ComputedDatum } from '../../..'

const pluginName = 'SeriesTooltip'
const layerName = 'SeriesTooltip'

export const SeriesTooltip = defineSVGLayer<SeriesTooltipExtendContext, SeriesTooltipPluginParams, SeriesTooltipParams>({
  name: layerName,
  defaultParams: DEFAULT_SERIES_TOOLTIP_PARAMS,
  layerIndex: LAYER_INDEX_OF_TOOLTIP,
  validator: (params) => {
    const result = validateObject(params, {
      backgroundColorType: {
        toBe: 'ColorType',
        test: (value: any) => {
          const colorTypes: ColorType[] = ['data', 'primary', 'secondary', 'dataContrast', 'background', 'none']
          return typeof value === 'string'
            && colorTypes.includes(value as ColorType)
        }
      },
      backgroundOpacity: {
        toBeTypes: ['number']
      },
      strokeColorType: {
        toBe: 'ColorType',
        test: (value: any) => {
          const colorTypes: ColorType[] = ['data', 'primary', 'secondary', 'dataContrast', 'background', 'none']
          return typeof value === 'string'
            && colorTypes.includes(value as ColorType)
        }
      },
      offset: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
      padding: {
        toBeTypes: ['number']
      },
      textColorType: {
        toBe: 'ColorType',
        test: (value: any) => {
          const colorTypes: ColorType[] = ['data', 'primary', 'secondary', 'dataContrast', 'background', 'none']
          return typeof value === 'string'
            && colorTypes.includes(value as ColorType)
        }
      },
      renderFn: {
        toBeTypes: ['Function']
      },
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    const destroy$ = new Subject()

    const unsubscribeTooltip = createBaseTooltip({
      rootSelection: d3.select(svgG),
      pluginName,
      layerName,
      layerParams$,
      theme$: context.theme$,
      layout$: context.layout$,
      eventTrigger$: context.eventTrigger$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: new Observable<Map<string, ComputedDatum<any>[]>>()
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeTooltip()
    }
  }
})