import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject
} from 'rxjs'
import type {
  ComputedDatumGrid,
  ComputedDataGrid,
  ComputedLayoutDataGrid,
  DefinePluginConfig,
  EventGrid,
  ChartParams, 
  GridContainerPosition,
  Layout,
  TransformData,
  ColorType
} from '../../../lib/core-types'
import {
  defineMultiValuePlugin
} from '../../../lib/core'
import { DEFAULT_SCATTER_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC_COVER } from '../../const'

const pluginName = 'Scatter'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_SCATTER_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_SCATTER_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_COVER,
  validator: (params, { validateColumns }) => {
    // const result = validateColumns(params, {
    //   radius: {
    //     toBeTypes: ['number']
    //   },
    //   fillColorType: {
    //     toBeOption: 'ColorType',
    //   },
    //   strokeColorType: {
    //     toBeOption: 'ColorType',
    //   },
    //   strokeWidth: {
    //     toBeTypes: ['number']
    //   },
    //   // strokeWidthWhileHighlight: {
    //   //   toBeTypes: ['number']
    //   // },
    //   onlyShowHighlighted: {
    //     toBeTypes: ['boolean']
    //   }
    // })
    return {
      status: 'success',
      columnName: '',
      expectToBe: ''
    }
  }
}

export const Scatter = defineMultiValuePlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  
  const destroy$ = new Subject()

  

  return () => {
    destroy$.next(undefined)
  }
})
