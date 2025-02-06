// import * as d3 from 'd3'
// import {
//   Observable,
//   Subject,
//   combineLatest,
//   takeUntil,
//   map,
//   distinctUntilChanged,
//   switchMap,
//   shareReplay
// } from 'rxjs'
// import type {
//   ColorType,
//   ChartParams,
//   ComputedDatumMultiValue,
//   ComputedDataMultiValue,
//   ComputedXYDatumMultiValue,
//   ContainerPositionScaled,
//   DataFormatterMultiValue,
//   DefinePluginConfig,
//   TransformData,
//   Layout
// } from '../../../lib/core-types'
// import { defineMultiValuePlugin } from '../../../lib/core'
// import { createBaseRankingAxis } from '../../base/BaseRankingAxis'
// import { DEFAULT_RANKING_AXIS_PARAMS } from '../defaults'
// import { LAYER_INDEX_OF_AXIS } from '../../const'

// const pluginName = 'RankingAxis'

// const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_RANKING_AXIS_PARAMS> = {
//   name: pluginName,
//   defaultParams: DEFAULT_RANKING_AXIS_PARAMS,
//   layerIndex: LAYER_INDEX_OF_AXIS,
//   validator: (params, { validateColumns }) => {
//     const result = validateColumns(params, {
//       labelOffset: {
//         toBe: '[number, number]',
//         test: (value: any) => {
//           return Array.isArray(value)
//             && value.length === 2
//             && typeof value[0] === 'number'
//             && typeof value[1] === 'number'
//         }
//       },
//       labelColorType: {
//         toBeOption: 'ColorType',
//       },
//       axisLineVisible: {
//         toBeTypes: ['boolean']
//       },
//       axisLineColorType: {
//         toBeOption: 'ColorType',
//       },
//       // ticks: {
//       //   toBeTypes: ['number', 'null']
//       // },
//       // tickFormat: {
//       //   toBeTypes: ['string', 'Function']
//       // },
//       tickLineVisible: {
//         toBeTypes: ['boolean']
//       },
//       tickPadding: {
//         toBeTypes: ['number']
//       },
//       // tickFullLine: {
//       //   toBeTypes: ['boolean']
//       // },
//       // tickFullLineDasharray: {
//       //   toBeTypes: ['string']
//       // },
//       tickColorType: {
//         toBeOption: 'ColorType',
//       },
//       tickTextColorType: {
//         toBeOption: 'ColorType',
//       }
//     })
//     if (result.status === 'error') {
//       return result
//     }
//     return result
//   }
// }

// export const RankingAxis = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
//   const destroy$ = new Subject()

//   const unsubscribeBaseRankingAxis = createBaseRankingAxis(pluginName, {
//     selection,
//     computedData$: observer.computedData$,
//     visibleComputedData$: observer.visibleComputedData$,
//     fullParams$: observer.fullParams$,
//     fullDataFormatter$: observer.fullDataFormatter$,
//     fullChartParams$: observer.fullChartParams$,
//     xyMinMax$: observer.xyMinMax$,
//     textSizePx$: observer.textSizePx$,
//     layout$: observer.layout$,
//     multiValueContainerPosition$: observer.multiValueContainerPosition$,
//     isCategorySeprate$: observer.isCategorySeprate$,
//   })

//   return () => {
//     destroy$.next(undefined)
//     unsubscribeBaseRankingAxis()
//   }
// })
