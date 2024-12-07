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
  ContainerPositionScaled,
  Layout,
  TransformData,
  ColorType
} from '../../../lib/core-types'
import {
  defineMultiValuePlugin
} from '../../../lib/core'
import { DEFAULT_SCATTER_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC_COVER } from '../../const'
import { getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { multiValueSelectionsObservable } from '../multiValueObservables'

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

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

function renderClipPath ({ defsSelection, clipPathData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
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
    .each((d, i, g) => {
      const rect = d3.select(g[i])
        .selectAll<SVGRectElement, typeof d>('rect')
        .data([d])
        .join('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })

}

export const Scatter = defineMultiValuePlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  
  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const circleGClassName = getClassName(pluginName, 'circleG')
  const circleClassName = getClassName(pluginName, 'circle')

  const {
    categorySelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = multiValueSelectionsObservable({
    selection,
    pluginName,
    clipPathID,
    categoryLabels$: observer.categoryLabels$,
    multiValueContainerPosition$: observer.multiValueContainerPosition$,
    multiValueGraphicTransform$: observer.multiValueGraphicTransform$
  })

  const clipPathSubscription = combineLatest({
    defsSelection: defsSelection$,
    layout: observer.layout$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    // 外層的遮罩
    const clipPathData = [{
      id: clipPathID,
      width: data.layout.width,
      height: data.layout.height
    }]
    renderClipPath({
      defsSelection: data.defsSelection,
      clipPathData,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})
