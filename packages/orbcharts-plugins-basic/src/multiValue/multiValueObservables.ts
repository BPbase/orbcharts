import * as d3 from 'd3'
import {
  Observable,
  Subject,
  debounceTime,
  iif,
  of,
  takeUntil,
  filter,
  map,
  switchMap,
  combineLatest,
  merge,
  shareReplay,
  distinctUntilChanged
} from 'rxjs'
import type {
  ChartParams,
  HighlightTarget,
  DataFormatterMultiValue,
  ComputedDataMultiValue,
  ComputedDatumMultiValue,
  ComputedXYDatumMultiValue,
  ComputedXYDataMultiValue,
  TransformData,
  ContainerSize,
  ContainerPositionScaled,
  Layout,
} from '../../lib/core-types'
import {
  createAxisToLabelIndexScale,
  createAxisToValueScale,
  createLabelToAxisScale,
  createValueToAxisScale,
} from '../../lib/core'
import { getClassName, getUniID } from '../utils/orbchartsUtils'
import { d3EventObservable } from '../utils/observables'

// 建立 multiValue 主要的 selection 
export const multiValueSelectionsObservable = ({ selection, pluginName, clipPathID, categoryLabels$, containerPosition$, graphicTransform$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  clipPathID: string
  // computedData$: Observable<ComputedDataMultiValue>
  categoryLabels$: Observable<string[]>
  containerPosition$: Observable<ContainerPositionScaled[]>
  // multiValueAxesTransform$: Observable<TransformData>
  graphicTransform$: Observable<TransformData>
}) => {
  const categoryClassName = getClassName(pluginName, 'category')
  const axesClassName = getClassName(pluginName, 'axes')
  const graphicClassName = getClassName(pluginName, 'graphic')

  // <g> category selection（container排放位置）
  //   <g> axes selection（圖軸）
  //     <defs> clipPath selection
  //     <g> graphic selection（圖形 scale 範圍的變形）
  const categorySelection$ = categoryLabels$.pipe(
    map((categoryLabels, i) => {
      return selection
        .selectAll<SVGGElement, string>(`g.${categoryClassName}`)
        .data(categoryLabels, d => d)
        .join(
          enter => {
            return enter
              .append('g')
              .classed(categoryClassName, true)
              .each((d, i, g) => {
                const axesSelection = d3.select(g[i])
                  .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${axesClassName}`)
                  .data([i])
                  .join(
                    enter => {
                      return enter
                        .append('g')
                        .classed(axesClassName, true)
                        .attr('clip-path', `url(#${clipPathID})`)
                        .each((d, i, g) => {
                          const defsSelection = d3.select(g[i])
                            .selectAll<SVGDefsElement, any>('defs')
                            .data([i])
                            .join('defs')
            
                          const graphicGSelection = d3.select(g[i])
                            .selectAll<SVGGElement, any>('g')
                            .data([i])
                            .join('g')
                            .classed(graphicClassName, true)
                        })
                    },
                    update => update,
                    exit => exit.remove()
                  )
              })
          },
          update => update,
          exit => exit.remove()
        )
    }),
    shareReplay(1)
  )

  // <g> category selection
  combineLatest({
    categorySelection: categorySelection$,
    containerPosition: containerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d)
  ).subscribe(data => {
    data.categorySelection
      .transition()
      .attr('transform', (d, i) => {
        const containerPosition = data.containerPosition[i] ?? data.containerPosition[0]
        const translate = containerPosition.translate
        const scale = containerPosition.scale
        return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
      })
  })

  // <g> axes selection
  const axesSelection$ = categorySelection$.pipe(
    map(categorySelection => {
      return categorySelection
        .select<SVGGElement>(`g.${axesClassName}`)
    }),
    shareReplay(1)
  )

  // <defs> clipPath selection
  const defsSelection$ = axesSelection$.pipe(
    map(axesSelection => {
      return axesSelection.select<SVGDefsElement>('defs')
    }),
    shareReplay(1)
  )

  // <g> graphic selection
  const graphicGSelection$ = combineLatest({
    axesSelection: axesSelection$,
    graphicTransform: graphicTransform$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const graphicGSelection = data.axesSelection
        .select<SVGGElement>(`g.${graphicClassName}`)
      graphicGSelection
        .transition()
        .duration(50)
        .style('transform', data.graphicTransform.value)
      return graphicGSelection
    }),
    shareReplay(1)
  )

  return {
    categorySelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  }
}


export const multiValueXYPositionObservable = ({ rootSelection, fullDataFormatter$, filteredXYMinMaxData$, containerPosition$, layout$ }: {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  // computedData$: Observable<ComputedDataMultiValue>
  // xyMinMax$: Observable<{ minX: number, maxX: number, minY: number, maxY: number }>
  filteredXYMinMaxData$: Observable<{
    minXDatum: ComputedXYDatumMultiValue
    maxXDatum: ComputedXYDatumMultiValue
    minYDatum: ComputedXYDatumMultiValue
    maxYDatum: ComputedXYDatumMultiValue
  }>
  containerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
}) => {
  const rootMousemove$ = d3EventObservable(rootSelection, 'mousemove').pipe(
    debounceTime(2) // 避免過度頻繁觸發，實測時沒加電腦容易卡頓
  )

  const columnAmount$ = containerPosition$.pipe(
    map(containerPosition => {
      const maxColumnIndex = containerPosition.reduce((acc, current) => {
        return current.columnIndex > acc ? current.columnIndex : acc
      }, 0)
      return maxColumnIndex + 1
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const rowAmount$ = containerPosition$.pipe(
    map(containerPosition => {
      const maxRowIndex = containerPosition.reduce((acc, current) => {
        return current.rowIndex > acc ? current.rowIndex : acc
      }, 0)
      return maxRowIndex + 1
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )

  // const xyScale$ = combineLatest({
  //   layout: layout$,
  //   filteredXYMinMaxData: filteredXYMinMaxData$,
  //   fullDataFormatter: fullDataFormatter$,
  //   columnAmount: columnAmount$,
  //   rowAmount: rowAmount$
  // }).pipe(
  //   switchMap(async d => d),
  //   map(data => {
  //     const xScale = createAxisToValueScale({
  //       maxValue: data.filteredXYMinMaxData.maxXDatum.value[0],
  //       minValue: data.filteredXYMinMaxData.minXDatum.value[0],
  //       axisWidth: data.layout.width,
  //       scaleDomain: data.fullDataFormatter.xAxis.scaleDomain,
  //       scaleRange: data.fullDataFormatter.xAxis.scaleRange,
  //     })
  //     const yScale = createAxisToValueScale({
  //       maxValue: data.filteredXYMinMaxData.maxYDatum.value[1],
  //       minValue: data.filteredXYMinMaxData.minYDatum.value[1],
  //       axisWidth: data.layout.height,
  //       scaleDomain: data.fullDataFormatter.yAxis.scaleDomain,
  //       scaleRange: data.fullDataFormatter.yAxis.scaleRange,
  //       reverse: true
  //     })
  //     return { xScale, yScale }
  //   })
  // )

  const xyScale$: Observable<{
    xScale: d3.ScaleLinear<number, number, never>;
    yScale: d3.ScaleLinear<number, number, never>;
  }> = new Observable(subscriber => {
    combineLatest({
      layout: layout$,
      filteredXYMinMaxData: filteredXYMinMaxData$,
      fullDataFormatter: fullDataFormatter$,
      columnAmount: columnAmount$,
      rowAmount: rowAmount$
    }).pipe(
      switchMap(async d => d),
    ).subscribe(data => {
      const xValueIndex = data.fullDataFormatter.xAxis.valueIndex
      const yValueIndex = data.fullDataFormatter.yAxis.valueIndex
      if (!data.filteredXYMinMaxData.minXDatum || !data.filteredXYMinMaxData.maxXDatum
        || data.filteredXYMinMaxData.minXDatum.value[xValueIndex] == null || data.filteredXYMinMaxData.maxXDatum.value[xValueIndex] == null
        || !data.filteredXYMinMaxData.minYDatum || !data.filteredXYMinMaxData.maxYDatum
        || data.filteredXYMinMaxData.minYDatum.value[yValueIndex] == null || data.filteredXYMinMaxData.maxYDatum.value[yValueIndex] == null
      ) {
        return
      }
      const xScale = createAxisToValueScale({
        maxValue: data.filteredXYMinMaxData.maxXDatum.value[xValueIndex],
        minValue: data.filteredXYMinMaxData.minXDatum.value[xValueIndex],
        axisWidth: data.layout.width,
        scaleDomain: data.fullDataFormatter.xAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.xAxis.scaleRange,
      })
      const yScale = createAxisToValueScale({
        maxValue: data.filteredXYMinMaxData.maxYDatum.value[yValueIndex],
        minValue: data.filteredXYMinMaxData.minYDatum.value[yValueIndex],
        axisWidth: data.layout.height,
        scaleDomain: data.fullDataFormatter.yAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.yAxis.scaleRange,
        reverse: true
      })
      subscriber.next({ xScale, yScale })
    })
  })

  const axisValue$ = combineLatest({
    fullDataFormatter: fullDataFormatter$,
    rootMousemove: rootMousemove$,
    columnAmount: columnAmount$,
    rowAmount: rowAmount$,
    layout: layout$,
    containerPosition: containerPosition$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
      return {
        x: ((data.rootMousemove.offsetX - data.layout.left) / data.containerPosition[0].scale[0])
          % (data.layout.rootWidth / data.columnAmount / data.containerPosition[0].scale[0]),
        y: ((data.rootMousemove.offsetY - data.layout.top) / data.containerPosition[0].scale[1])
          % (data.layout.rootHeight / data.rowAmount / data.containerPosition[0].scale[1])
      }
    })
  )

  return combineLatest({
    xyScale: xyScale$,
    axisValue: axisValue$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return {
        x: data.axisValue.x,
        y: data.axisValue.y,
        xValue: data.xyScale.xScale(data.axisValue.x),
        yValue: data.xyScale.yScale(data.axisValue.y)
      }
    })
  )
}

// // Ranking資料 - 用 value[index] 排序
// export const visibleComputedRankingByIndexDataObservable = ({ valueIndex$, isCategorySeprate$, visibleComputedData$ }: {
//   valueIndex$: Observable<number>
//   isCategorySeprate$: Observable<boolean>
//   visibleComputedData$: Observable<ComputedDatumMultiValue[][]>
// }) => {

//   return combineLatest({
//     isCategorySeprate: isCategorySeprate$,
//     valueIndex: valueIndex$,
//     visibleComputedData: visibleComputedData$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       // -- category 分開 --
//       if (data.isCategorySeprate) {
//         return data.visibleComputedData
//           .map(categoryData => {
//             return categoryData
//               .sort((a, b) => {
//                 const bValue = b.value[data.valueIndex as number] ?? - Infinity // - Infinity 為最小值
//                 const aValue = a.value[data.valueIndex as number] ?? - Infinity
  
//                 return bValue - aValue
//               })
//           })
//       // -- 用 value[index] 排序 --
//       } else {
//         return [
//           data.visibleComputedData
//             .flat()
//             .sort((a, b) => {
//               const bValue = b.value[data.valueIndex as number] ?? - Infinity // - Infinity 為最小值
//               const aValue = a.value[data.valueIndex as number] ?? - Infinity
  
//               return bValue - aValue
//             })
//         ]
//       }
//     })
//   )
// }

// export const visibleComputedSumDataObservable = ({ visibleComputedData$ }: {
//   visibleComputedData$: Observable<ComputedDataMultiValue>
// }) => {
//   return visibleComputedData$.pipe(
//     map(data => {
//       return data.map(categoryData => {
//         return categoryData
//           .map(d => {
//             // 新增總計資料欄位
//             ;(d as any)._sum = d.value.reduce((acc, curr) => acc + curr, 0)
//             return d
//           })
//       })
//     })
//   )
// }

// // Ranking資料 - 用所有 valueIndex 加總資料排序
// export const visibleComputedRankingBySumDataObservable = ({ isCategorySeprate$, visibleComputedData$ }: {
//   isCategorySeprate$: Observable<boolean>
//   visibleComputedData$: Observable<ComputedDatumMultiValue[][]>
// }) => {

//   return combineLatest({
//     isCategorySeprate: isCategorySeprate$,
//     visibleComputedData: visibleComputedData$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       // -- category 分開 --
//       if (data.isCategorySeprate) {
//         return data.visibleComputedData
//           .map(categoryData => {
//             return categoryData
//               .map(d => {
//                 // 新增總計資料欄位
//                 ;(d as any)._sum = d.value.reduce((acc, curr) => acc + curr, 0)
//                 return d
//               })
//               .sort((a: any, b: any) => b._sum - a._sum)
//           })
//       // -- 用 value[index] 排序 --
//       } else {
//         return [
//           data.visibleComputedData
//             .flat()
//             .map(d => {
//               // 新增總計資料欄位
//               ;(d as any)._sum = d.value.reduce((acc, curr) => acc + curr, 0)
//               return d
//             })
//             .sort((a: any, b: any) => b._sum - a._sum)
//         ]
//       }
//     })
//   )
// }

// 排名數量
export const computedRankingAmountListObservable = ({ containerSize$, visibleComputedData$, textSizePx$, rankingAmount$ }: {
  containerSize$: Observable<ContainerSize>
  visibleComputedData$: Observable<ComputedDatumMultiValue[][]>
  textSizePx$: Observable<number>
  rankingAmount$: Observable<'auto' | number>
}) => {
  const minLineHeightObservable = ({ textSizePx$ }: {
    textSizePx$: Observable<number>
  }) => {
    return textSizePx$.pipe(
      map(textSizePx => textSizePx * 2), // 2倍行高
      shareReplay(1)
    )
  }

  const containerHeightObservable = ({ minLineHeight$, containerSize$ }: {
    minLineHeight$: Observable<number>
    containerSize$: Observable<ContainerSize>
  }) => {
    return combineLatest({
      minLineHeight: minLineHeight$,
      containerSize: containerSize$
    }).pipe(
      switchMap(async (d) => d),
      map(data => {
        // 避免過小造成計算 scale 錯誤
        return data.containerSize.height > data.minLineHeight
          ? data.containerSize.height
          : data.minLineHeight
      }),
      distinctUntilChanged(),
      shareReplay(1)
    )
  }

  const rankingAmountLimitObservable = ({ minLineHeight$, containerHeight$ }: {
    containerHeight$: Observable<number>
    minLineHeight$: Observable<number>
  }) => {

    return combineLatest({
      minLineHeight: minLineHeight$,
      containerHeight: containerHeight$
    }).pipe(
      switchMap(async (d) => d),
      map(data => {
        const labelAmountLimit = Math.floor(data.containerHeight / data.minLineHeight)
        return labelAmountLimit
      }),
      distinctUntilChanged(),
      shareReplay(1)
    )
  }

  const minLineHeight$ = minLineHeightObservable({ textSizePx$ })

  const containerHeight$ = containerHeightObservable({
    minLineHeight$,
    containerSize$
  })

  const rankingAmountLimit$ = rankingAmountLimitObservable({
    containerHeight$,
    minLineHeight$
  })

  // 計算每個 category 的顯示數量（要排名的數量）
  const computedRankingAmountList$ = combineLatest({
    rankingAmount: rankingAmount$,
    visibleComputedData: visibleComputedData$
  }).pipe(
    switchMap(async d => d),
    switchMap(data => {
      return data.rankingAmount === 'auto'
        // 'auto': 不超過限制
        ? rankingAmountLimit$.pipe(
            map(rankingAmountLimit => {
              return data.visibleComputedData.map(categoryData => {
                return Math.min(rankingAmountLimit, categoryData.length)
              })
            })
          )
        // number: 指定數量
        : of(data.visibleComputedData.map(_ => data.rankingAmount as number))
    }),
  )

  return computedRankingAmountList$
}

const rankingItemHeightListObservable = ({ containerSize$, visibleComputedRankingData$, textSizePx$, computedRankingAmountList$ }: {
  containerSize$: Observable<ContainerSize>
  visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
  textSizePx$: Observable<number>
  // rankingAmount$: Observable<'auto' | number>
  computedRankingAmountList$: Observable<number[]>
}) => {
  const minLineHeightObservable = ({ textSizePx$ }: {
    textSizePx$: Observable<number>
  }) => {
    return textSizePx$.pipe(
      map(textSizePx => textSizePx * 2), // 2倍行高
      shareReplay(1)
    )
  }

  const containerHeightObservable = ({ minLineHeight$, containerSize$ }: {
    minLineHeight$: Observable<number>
    containerSize$: Observable<ContainerSize>
  }) => {
    return combineLatest({
      minLineHeight: minLineHeight$,
      containerSize: containerSize$
    }).pipe(
      switchMap(async (d) => d),
      map(data => {
        // 避免過小造成計算 scale 錯誤
        return data.containerSize.height > data.minLineHeight
          ? data.containerSize.height
          : data.minLineHeight
      }),
      distinctUntilChanged(),
      shareReplay(1)
    )
  }

  // const rankingAmountLimitObservable = ({ minLineHeight$, containerHeight$ }: {
  //   containerHeight$: Observable<number>
  //   minLineHeight$: Observable<number>
  // }) => {

  //   return combineLatest({
  //     minLineHeight: minLineHeight$,
  //     containerHeight: containerHeight$
  //   }).pipe(
  //     switchMap(async (d) => d),
  //     map(data => {
  //       const labelAmountLimit = Math.floor(data.containerHeight / data.minLineHeight)
  //       return labelAmountLimit
  //     }),
  //     distinctUntilChanged(),
  //     shareReplay(1)
  //   )
  // }

  const minLineHeight$ = minLineHeightObservable({ textSizePx$ })

  const containerHeight$ = containerHeightObservable({
    minLineHeight$,
    containerSize$
  })

  // const rankingAmountLimit$ = rankingAmountLimitObservable({
  //   containerHeight$,
  //   minLineHeight$
  // })

  // // 計算每個 category 的顯示數量（要排名的數量）
  // const computedRankingAmountList$ = combineLatest({
  //   rankingAmount: rankingAmount$,
  //   visibleComputedRankingData: visibleComputedRankingData$
  // }).pipe(
  //   switchMap(async d => d),
  //   switchMap(data => {
  //     return data.rankingAmount === 'auto'
  //       // 'auto': 不超過限制
  //       ? rankingAmountLimit$.pipe(
  //           map(rankingAmountLimit => {
  //             return data.visibleComputedRankingData.map(categoryData => {
  //               return Math.min(rankingAmountLimit, categoryData.length)
  //             })
  //           })
  //         )
  //       // number: 指定數量
  //       : of(data.visibleComputedRankingData.map(_ => data.rankingAmount as number))
  //   }),
  // )

  return combineLatest({
    // minLineHeight: minLineHeight$,
    containerHeight: containerHeight$,
    visibleComputedRankingData: visibleComputedRankingData$,
    computedRankingAmountList: computedRankingAmountList$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // 依每個 category 計算 scale
      return data.visibleComputedRankingData.map((categoryData, i) => {
        const rankingAmount = data.computedRankingAmountList[i]
        const rankingItemHeight = data.containerHeight / rankingAmount
        return rankingItemHeight
      })
    })
  )
}

export const rankingScaleListObservable = ({ containerSize$, visibleComputedRankingData$, textSizePx$, computedRankingAmountList$ }: {
  containerSize$: Observable<ContainerSize>
  visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
  textSizePx$: Observable<number>
  computedRankingAmountList$: Observable<number[]>
  // rankingAmount$: Observable<'auto' | number>
}) => {

  const rankingItemHeightList$ = rankingItemHeightListObservable({
    containerSize$,
    visibleComputedRankingData$,
    textSizePx$,
    computedRankingAmountList$
  })

  return combineLatest({
    // minLineHeight: minLineHeight$,
    // containerHeight: containerHeight$,
    visibleComputedRankingData: visibleComputedRankingData$,
    // computedRankingAmountList: computedRankingAmountList$
    rankingItemHeightList: rankingItemHeightList$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // 依每個 category 計算 scale
      return data.visibleComputedRankingData.map((categoryData, i) => {
        const allLabelAmount = categoryData.length
        const rankingItemHeight = data.rankingItemHeightList[i]
        const totalHeight = rankingItemHeight * allLabelAmount // 有可能超出圖軸高度
        
        return createLabelToAxisScale({
          axisLabels: categoryData.map(d => d.label),
          axisWidth: totalHeight,
          padding: 0.5
        })
      })
    })
  )
}

// // X 軸圖軸 - 用 value[index] 
// export const xScaleObservable = ({ visibleComputedSumData$, fullDataFormatter$, filteredXYMinMaxData$, layout$ }: {
//   visibleComputedSumData$: Observable<ComputedDatumMultiValue[][]>
//   fullDataFormatter$: Observable<DataFormatterMultiValue>
//   filteredXYMinMaxData$: Observable<{
//     minXDatum: ComputedXYDatumMultiValue
//     maxXDatum: ComputedXYDatumMultiValue
//     minYDatum: ComputedXYDatumMultiValue
//     maxYDatum: ComputedXYDatumMultiValue
//   }>
//   layout$: Observable<Layout>
// }) => {
//   return combineLatest({
//     visibleComputedSumData: visibleComputedSumData$,
//     fullDataFormatter: fullDataFormatter$,
//     layout: layout$,
//     // xyMinMax: xyMinMax$
//     filteredXYMinMaxData: filteredXYMinMaxData$
//   }).pipe(
//     switchMap(async (d) => d),
//     map(data => {
//       const valueIndex = data.fullDataFormatter.xAxis.valueIndex
//       if (!data.filteredXYMinMaxData.minXDatum || !data.filteredXYMinMaxData.maxXDatum
//         || data.filteredXYMinMaxData.minXDatum.value[valueIndex] == null || data.filteredXYMinMaxData.maxXDatum.value[valueIndex] == null
//       ) {
//         return
//       }
//       let maxValue = data.filteredXYMinMaxData.maxXDatum.value[valueIndex]
//       let minValue = data.filteredXYMinMaxData.minXDatum.value[valueIndex]
//       if (maxValue === minValue && maxValue === 0) {
//         // 避免最大及最小值同等於 0 造成無法計算scale
//         maxValue = 1
//       }

//       const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
//         maxValue,
//         minValue,
//         axisWidth: data.layout.width,
//         scaleDomain: data.fullDataFormatter.xAxis.scaleDomain,
//         scaleRange: data.fullDataFormatter.xAxis.scaleRange,
//       })
//       return xScale
//     })
//   )
// }

// // X 軸圖軸 - 用所有 valueIndex 加總資料
// export const xSumScaleObservable = ({ valueIndex$, fullDataFormatter$, filteredXYMinMaxData$, layout$ }: {
//   valueIndex$: Observable<number>
//   fullDataFormatter$: Observable<DataFormatterMultiValue>
//   filteredXYMinMaxData$: Observable<{
//     minXDatum: ComputedXYDatumMultiValue
//     maxXDatum: ComputedXYDatumMultiValue
//     minYDatum: ComputedXYDatumMultiValue
//     maxYDatum: ComputedXYDatumMultiValue
//   }>
//   layout$: Observable<Layout>
// }) => {
//   return combineLatest({
//     valueIndex: valueIndex$,
//     fullDataFormatter: fullDataFormatter$,
//     layout: layout$,
//     // xyMinMax: xyMinMax$
//     filteredXYMinMaxData: filteredXYMinMaxData$
//   }).pipe(
//     switchMap(async (d) => d),
//     map(data => {
//       const valueIndex = data.fullDataFormatter.xAxis.valueIndex
//       if (!data.filteredXYMinMaxData.minXDatum || !data.filteredXYMinMaxData.maxXDatum
//         || data.filteredXYMinMaxData.minXDatum.value[valueIndex] == null || data.filteredXYMinMaxData.maxXDatum.value[valueIndex] == null
//       ) {
//         return
//       }
//       let maxValue = data.filteredXYMinMaxData.maxXDatum.value[valueIndex]
//       let minValue = data.filteredXYMinMaxData.minXDatum.value[valueIndex]
//       if (maxValue === minValue && maxValue === 0) {
//         // 避免最大及最小值同等於 0 造成無法計算scale
//         maxValue = 1
//       }

//       const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
//         maxValue,
//         minValue,
//         axisWidth: data.layout.width,
//         scaleDomain: data.fullDataFormatter.xAxis.scaleDomain,
//         scaleRange: data.fullDataFormatter.xAxis.scaleRange,
//       })
//       return xScale
//     })
//   )
// }

// Ranking資料 - 有 XY 資料 @Q@ 若沒用到要棄用
export const computedRankingWithXYDataObservable = ({ visibleComputedRankingData$, computedRankingAmountList$, xyValueIndex$, layout$ }: {
  visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
  computedRankingAmountList$: Observable<number[]>
  xyValueIndex$: Observable<[number, number]>
  layout$: Observable<Layout>
}): Observable<ComputedXYDataMultiValue> => {

  // // 未篩選範圍前的 scale
  // function createOriginXScale (xMinMax: { minX: number, maxX: number }, layout: Layout) {
  //   let maxValue = xMinMax.maxX
  //   let minValue = xMinMax.minX
  //   if (minValue === maxValue && maxValue === 0) {
  //     // 避免最大及最小值相同造成無法計算scale
  //     maxValue = 1
  //   }
  //   const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
  //     maxValue,
  //     minValue,
  //     axisWidth: layout.width,
  //     scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
  //     scaleRange: [0, 1] // 不使用dataFormatter設定
  //   })
    
  //   return valueScale
  // }

  // 未篩選範圍及visible前的 scale
  function createOriginYScale (yMinMax: { minY: number, maxY: number }, layout: Layout) {
    let maxValue = yMinMax.maxY
    let minValue = yMinMax.minY
    if (minValue === maxValue && maxValue === 0) {
      // 避免最大及最小值相同造成無法計算scale
      maxValue = 1
    }
    const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue,
      minValue,
      axisWidth: layout.height,
      scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
      scaleRange: [0, 1], // 不使用dataFormatter設定
      // reverse: true
    })
    
    return valueScale
  }

  return combineLatest({
    visibleComputedRankingData: visibleComputedRankingData$,
    computedRankingAmountList: computedRankingAmountList$,
    xyValueIndex: xyValueIndex$,
    layout: layout$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      
      // const maxX = data.visibleComputedRankingData
      //   .flat()
      //   .reduce((acc, current) => {
      //     const maxXIndex = current.value.length - 1
      //     return maxXIndex > acc ? maxXIndex : acc
      //   }, 0)
      // const xMinMax = {
      //   minX: 0,
      //   maxX
      // }
      // const xScale = createOriginXScale(xMinMax, data.layout)
      // console.log('data.visibleComputedRankingData', data.visibleComputedRankingData)
      return data.visibleComputedRankingData
        .map((categoryData, categoryIndex) => {
          const yMinMax = {
            minY: 0,
            maxY: data.computedRankingAmountList[categoryIndex]
          }
          const yScale = createOriginYScale(yMinMax, data.layout)

          return categoryData.map((datum, datumIndex) => {
            return {
              ...datum,
              // axisX: xScale(datum.value[data.xyValueIndex[0]] ?? 0),
              axisX: 0,
              // axisY: yScale(datum.value[data.xyValueIndex[1]] ?? 0), // y軸的繪圖座標是從上到下，所以反轉
              axisY: yScale(datumIndex),
            }
          })
        })
    })
  )
}