import * as d3 from 'd3'
import {
  Observable,
  Subject,
  combineLatest,
  takeUntil,
  of,
  map,
  distinctUntilChanged,
  switchMap,
  shareReplay
} from 'rxjs'
import type {
  DefinePluginConfig,
  Layout
} from '../../../lib/core-types'
import {
  defineMultiValuePlugin,
} from '../../../lib/core'
import { DEFAULT_ORDINAL_X_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
// import { createBaseXAxis } from '../../base/BaseXAxis'
import { getColor, getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { multiValueContainerSelectionsObservable } from '../multiValueObservables'

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'OrdinalXAxis'


const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_ORDINAL_X_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_ORDINAL_X_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      labelOffset: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
      labelColorType: {
        toBeOption: 'ColorType',
      },
      axisLineVisible: {
        toBeTypes: ['boolean']
      },
      axisLineColorType: {
        toBeOption: 'ColorType',
      },
      ticks: {
        toBeTypes: ['number', 'null']
      },
      tickFormat: {
        toBeTypes: ['string', 'Function']
      },
      tickLineVisible: {
        toBeTypes: ['boolean']
      },
      tickPadding: {
        toBeTypes: ['number']
      },
      tickFullLine: {
        toBeTypes: ['boolean']
      },
      tickFullLineDasharray: {
        toBeTypes: ['string']
      },
      tickColorType: {
        toBeOption: 'ColorType',
      },
      tickTextRotate: {
        toBeTypes: ['number']
      },
      tickTextColorType: {
        toBeOption: 'ColorType',
      }
    })
    if (result.status === 'error') {
      return result
    }
    return result
  }
}

function renderClipPath ({ defsSelection, clipPathData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
  // textReverseTransform: string
}) {
  const clipPath = defsSelection
    .selectAll<SVGClipPathElement, Layout>('clipPath')
    .data(clipPathData)
    .join(
      enter => {
        return enter
          .append('clipPath')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('id', d => d.id)
    // .attr('transform', textReverseTransform)
    .each((d, i, g) => {
      const rect = d3.select(g[i])
        .selectAll<SVGRectElement, typeof d>('rect')
        .data([d])
        .join(
          enter => {
            return enter
              .append('rect')
          },
          update => update,
          exit => exit.remove()
        )
        .attr('x', _d => - _d.width)
        .attr('y', 0)
        .attr('width', _d => _d.width * 2)
        .attr('height', _d => _d.height)
    })
}

export const OrdinalXAxis = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const boxClassName = getClassName(pluginName, 'box')
  const textClassName = getClassName(pluginName, 'text')
  const clipPathID = getUniID(pluginName, 'clipPath-box')

  const containerSelection$ = multiValueContainerSelectionsObservable({
    selection,
    pluginName,
    clipPathID: null,
    computedData$: observer.computedData$,
    containerPosition$: observer.containerPosition$,
    isCategorySeprate$: observer.isCategorySeprate$,
  }).pipe(
    takeUntil(destroy$),
  )

  observer.containerSize$.subscribe(data => {
    const defsSelection = selection.selectAll<SVGDefsElement, any>('defs')
      .data([clipPathID])
      .join('defs')
    const clipPathData = [{
      id: clipPathID,
      width: data.width,
      height: data.height
    }]
    renderClipPath({
      defsSelection: defsSelection,
      clipPathData,
      // textReverseTransform: data.textReverseTransform
    })
  })


  return () => {
    destroy$.next(undefined)
  }
})