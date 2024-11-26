import {
  Subject,
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineSeriesPlugin } from '../../../lib/core'
import { DEFAULT_SERIES_TOOLTIP_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_TOOLTIP } from '../../const'
import { createBaseTooltip } from '../../base/BaseTooltip'

const pluginName = 'SeriesTooltip'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_SERIES_TOOLTIP_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_SERIES_TOOLTIP_PARAMS,
  layerIndex: LAYER_INDEX_OF_TOOLTIP,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      backgroundColorType: {
        toBeOption: 'ColorType',
      },
      backgroundOpacity: {
        toBeTypes: ['number']
      },
      strokeColorType: {
        toBeOption: 'ColorType',
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
        toBeOption: 'ColorType',
      },
      renderFn: {
        toBeTypes: ['Function']
      },
    })
    return result
  }
}

export const SeriesTooltip = defineSeriesPlugin(pluginConfig)(({ selection, rootSelection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeTooltip = createBaseTooltip(pluginName, {
    rootSelection,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    layout$: observer.layout$,
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeTooltip()
  }
})
