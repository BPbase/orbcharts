import * as d3 from 'd3'
import {
  Observable,
  Subject,
  of,
  takeUntil,
  filter,
  first,
  map,
  switchMap,
  combineLatest,
  merge,
  shareReplay,
  distinctUntilChanged
} from 'rxjs'
import type {
  ContainerPosition } from '../../lib/core-types'
import { getClassName, getUniID } from '../utils/orbchartsUtils'

// function createRelationshipSelection ({ selection, pluginName, separateSeries$, seriesLabels$ }: {
//   selection: d3.Selection<any, unknown, any, unknown>
//   pluginName: string
//   separateSeries$: Observable<boolean>
//   seriesLabels$: Observable<string[]>
// }) {
//   const seriesClassName = getClassName(pluginName, 'series')
  
//   return combineLatest({
//     seriesLabels: seriesLabels$,
//     separateSeries: separateSeries$
//   }).pipe(
//     switchMap(async d => d),
//     map((data, i) => {
//       const selectionData = data.separateSeries ? data.seriesLabels : [data.seriesLabels.join('')]
//       return selection
//         .selectAll<SVGGElement, string>(`g.${seriesClassName}`)
//         .data(selectionData, d => d)
//         .join(
//           enter => {
//             return enter
//               .append('g')
//               .classed(seriesClassName, true)
//           },
//           update => update,
//           exit => exit.remove()
//         )
//     }),
//     shareReplay(1)
//   )
// }