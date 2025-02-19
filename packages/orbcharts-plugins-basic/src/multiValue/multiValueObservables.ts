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

// 建立 multiValue 主要的 selection - 只取無scale的container selection
export const multiValueContainerSelectionsObservable = ({ selection, pluginName, clipPathID, computedData$, containerPosition$, isCategorySeprate$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  clipPathID: string | null
  computedData$: Observable<ComputedDataMultiValue>
  containerPosition$: Observable<ContainerPositionScaled[]>
  isCategorySeprate$: Observable<boolean>
}) => {
  const containerClassName = getClassName(pluginName, 'container')

  const containerSelection$ = combineLatest({
    computedData: computedData$.pipe(
      distinctUntilChanged((a, b) => {
        // 只有當series的數量改變時，才重新計算
        return a.length === b.length
      }),
    ),
    isCategorySeprate: isCategorySeprate$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      return data.isCategorySeprate
        // category分開的時候顯示各別axis
        ? data.computedData
        // category合併的時候只顯示第一個axis
        : [data.computedData[0]]
    }),
    map((computedData, i) => {
      return selection
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${containerClassName}`)
        .data(computedData, d => d[0] ? d[0].categoryIndex : i)
        .join('g')
        .classed(containerClassName, true)
        .attr('clip-path', _ => clipPathID ? `url(#${clipPathID})` : 'none')
    }),
    shareReplay(1)
  )

  combineLatest({
    containerSelection: containerSelection$,
    gridContainerPosition: containerPosition$
  }).pipe(
    switchMap(async d => d)
  ).subscribe(data => {
    data.containerSelection
      .attr('transform', (d, i) => {
        const gridContainerPosition = data.gridContainerPosition[i] ?? data.gridContainerPosition[0]
        const translate = gridContainerPosition.translate
        const scale = gridContainerPosition.scale
        // return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
        return `translate(${translate[0]}, ${translate[1]})`
      })
      // .attr('opacity', 0)
      // .transition()
      // .attr('opacity', 1)
  })

  return containerSelection$
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

// 排名數量
export const computedRankingAmountObservable = ({ containerSize$, visibleComputedData$, textSizePx$, rankingAmount$ }: {
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

  // 計算要排名的數量
  return rankingAmount$.pipe(
    switchMap(rankingAmount => {
      return iif(
        () => rankingAmount === 'auto',
        // 'auto': 不超過限制
        combineLatest({
          visibleComputedData: visibleComputedData$,
          rankingAmountLimit: rankingAmountLimit$,
        }).pipe(
          switchMap(async d => d),
          map(data => {
            const rankingAmountArr = data.visibleComputedData.map(categoryData => {
              return Math.min(data.rankingAmountLimit, categoryData.length)
            })
            return Math.max(...rankingAmountArr) // 取所有 container 計算出來的最大值
          })
        ),
        // number: 指定數量
        rankingAmount$ as Observable<number>,
      )
    })
  )
}

export const rankingItemHeightObservable = ({ containerSize$, textSizePx$, computedRankingAmount$ }: {
  containerSize$: Observable<ContainerSize>
  // visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
  textSizePx$: Observable<number>
  // rankingAmount$: Observable<'auto' | number>
  computedRankingAmount$: Observable<number>
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

  const minLineHeight$ = minLineHeightObservable({ textSizePx$ })

  const containerHeight$ = containerHeightObservable({
    minLineHeight$,
    containerSize$
  })

  return combineLatest({
    containerHeight: containerHeight$,
    computedRankingAmount: computedRankingAmount$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // // 依每個 category 計算 scale
      // return data.visibleComputedRankingData.map((categoryData, i) => {
      //   const rankingAmount = data.computedRankingAmountList[i]
      //   const rankingItemHeight = data.containerHeight / rankingAmount
      //   return rankingItemHeight
      // })
      const rankingItemHeight = data.containerHeight / data.computedRankingAmount
      return rankingItemHeight
    })
  )
}

export const rankingScaleListObservable = ({ visibleComputedRankingData$, rankingItemHeight$ }: {
  visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
  rankingItemHeight$: Observable<number>
}) => {

  return combineLatest({
    visibleComputedRankingData: visibleComputedRankingData$,
    rankingItemHeight: rankingItemHeight$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // 依每個 category 計算 scale
      return data.visibleComputedRankingData.map((categoryData, i) => {
        const allLabelAmount = categoryData.length
        // const rankingItemHeight = data.rankingItemHeightList[i]
        const totalHeight = data.rankingItemHeight * allLabelAmount // 有可能超出圖軸高度
        
        return createLabelToAxisScale({
          axisLabels: categoryData.map(d => d.label),
          axisWidth: totalHeight,
          padding: 0.5
        })
      })
    })
  )
}


// // Ranking資料 - 有 XY 資料 @Q@ 若沒用到要棄用
// export const computedRankingWithXYDataObservable = ({ visibleComputedRankingData$, computedRankingAmountList$, xyValueIndex$, layout$ }: {
//   visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
//   computedRankingAmountList$: Observable<number[]>
//   xyValueIndex$: Observable<[number, number]>
//   layout$: Observable<Layout>
// }): Observable<ComputedXYDataMultiValue> => {

//   // // 未篩選範圍前的 scale
//   // function createOriginXScale (xMinMax: { minX: number, maxX: number }, layout: Layout) {
//   //   let maxValue = xMinMax.maxX
//   //   let minValue = xMinMax.minX
//   //   if (minValue === maxValue && maxValue === 0) {
//   //     // 避免最大及最小值相同造成無法計算scale
//   //     maxValue = 1
//   //   }
//   //   const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
//   //     maxValue,
//   //     minValue,
//   //     axisWidth: layout.width,
//   //     scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
//   //     scaleRange: [0, 1] // 不使用dataFormatter設定
//   //   })
    
//   //   return valueScale
//   // }

//   // 未篩選範圍及visible前的 scale
//   function createOriginYScale (yMinMax: { minY: number, maxY: number }, layout: Layout) {
//     let maxValue = yMinMax.maxY
//     let minValue = yMinMax.minY
//     if (minValue === maxValue && maxValue === 0) {
//       // 避免最大及最小值相同造成無法計算scale
//       maxValue = 1
//     }
//     const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
//       maxValue,
//       minValue,
//       axisWidth: layout.height,
//       scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
//       scaleRange: [0, 1], // 不使用dataFormatter設定
//       // reverse: true
//     })
    
//     return valueScale
//   }

//   return combineLatest({
//     visibleComputedRankingData: visibleComputedRankingData$,
//     computedRankingAmountList: computedRankingAmountList$,
//     xyValueIndex: xyValueIndex$,
//     layout: layout$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
      
//       // const maxX = data.visibleComputedRankingData
//       //   .flat()
//       //   .reduce((acc, current) => {
//       //     const maxXIndex = current.value.length - 1
//       //     return maxXIndex > acc ? maxXIndex : acc
//       //   }, 0)
//       // const xMinMax = {
//       //   minX: 0,
//       //   maxX
//       // }
//       // const xScale = createOriginXScale(xMinMax, data.layout)
//       // console.log('data.visibleComputedRankingData', data.visibleComputedRankingData)
//       return data.visibleComputedRankingData
//         .map((categoryData, categoryIndex) => {
//           const yMinMax = {
//             minY: 0,
//             maxY: data.computedRankingAmountList[categoryIndex]
//           }
//           const yScale = createOriginYScale(yMinMax, data.layout)

//           return categoryData.map((datum, datumIndex) => {
//             return {
//               ...datum,
//               // axisX: xScale(datum.value[data.xyValueIndex[0]] ?? 0),
//               axisX: 0,
//               // axisY: yScale(datum.value[data.xyValueIndex[1]] ?? 0), // y軸的繪圖座標是從上到下，所以反轉
//               axisY: yScale(datumIndex),
//             }
//           })
//         })
//     })
//   )
// }

// // Ranking資料 - 有 XY 資料 @Q@ 若沒用到要棄用
// export const computedRankingWithXYDataObservable = ({ visibleComputedRankingData$, rankingScaleList$ }: {
//   visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
//   rankingScaleList$: Observable<d3.ScalePoint<string>[]>
// }): Observable<ComputedXYDataMultiValue> => {

//   return combineLatest({
//     visibleComputedRankingData: visibleComputedRankingData$,
//     rankingScaleList: rankingScaleList$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       return data.visibleComputedRankingData
//         .map((categoryData, categoryIndex) => {
//           const yScale = data.rankingScaleList[categoryIndex]

//           return categoryData.map((datum, datumIndex) => {
//             return {
//               ...datum,
//               axisX: 0,
//               axisY: yScale(datum.label),
//             }
//           })
//         })
//     })
//   )
// }