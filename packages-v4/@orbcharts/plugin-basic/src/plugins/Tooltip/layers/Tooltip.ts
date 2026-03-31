import * as d3 from 'd3'
import {
  Subject, 
  Observable,
  BehaviorSubject} from 'rxjs'
import type { TooltipExtendContext, TooltipPluginParams, TooltipParams } from "../types"
import type { ColorType } from '@orbcharts/core'
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_SERIES_TOOLTIP_PARAMS } from "../defaults"
import { LAYER_INDEX_OF_TOOLTIP } from '../../../const/layerIndex'
import { createBaseTooltip } from '../../../baseLayers/BaseTooltip'

const pluginName = 'Tooltip'
const layerName = 'Tooltip'

export const Tooltip = defineSVGLayer<TooltipExtendContext, TooltipPluginParams, TooltipParams>({
  name: layerName,
  defaultParams: DEFAULT_SERIES_TOOLTIP_PARAMS,
  layerIndex: LAYER_INDEX_OF_TOOLTIP,
  initShow: true,
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
      baseTooltipParams$: layerParams$,
      theme$: context.theme$,
      layout$: context.layout$,
      event$: context.event$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeTooltip()
    }
  }
})