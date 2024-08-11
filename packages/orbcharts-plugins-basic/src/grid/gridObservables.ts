import { Observable, Subject, takeUntil, filter, map, switchMap, combineLatest, merge, distinctUntilChanged } from 'rxjs'
import type {
  ChartParams,
  HighlightTarget,
  DataFormatterGrid,
  ComputedDataGrid,
  ComputedDatumGrid,
  Layout } from '@orbcharts/core'
import { createAxisQuantizeScale } from '@orbcharts/core'

// 由事件取得group data的function
export function gridGroupPositionFnObservable ({ fullDataFormatter$, gridAxesSize$, computedData$, fullChartParams$ }: {
  fullDataFormatter$: Observable<DataFormatterGrid>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  computedData$: Observable<ComputedDataGrid>
  // GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullChartParams$: Observable<ChartParams>
}): Observable<(event: any) => { groupIndex: number; groupLabel: string }> {
  const destroy$ = new Subject()

  // 顯示範圍內的group labels
  const scaleRangeGroupLabels$: Observable<string[]> = new Observable(subscriber => {
    combineLatest({
      dataFormatter: fullDataFormatter$,
      computedData: computedData$
    }).pipe(
      takeUntil(destroy$),
      // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
      switchMap(async (d) => d),
    ).subscribe(data => {
      const groupMin = 0
      const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      const groupScaleDomainMin = data.dataFormatter.grid.groupAxis.scaleDomain[0] === 'auto'
        ? groupMin - data.dataFormatter.grid.groupAxis.scalePadding
        : data.dataFormatter.grid.groupAxis.scaleDomain[0] as number - data.dataFormatter.grid.groupAxis.scalePadding
      const groupScaleDomainMax = data.dataFormatter.grid.groupAxis.scaleDomain[1] === 'auto'
        ? groupMax + data.dataFormatter.grid.groupAxis.scalePadding
        : data.dataFormatter.grid.groupAxis.scaleDomain[1] as number + data.dataFormatter.grid.groupAxis.scalePadding
      
      // const groupingAmount = data.computedData[0]
      //   ? data.computedData[0].length
      //   : 0

      let _labels = data.dataFormatter.grid.gridData.seriesType === 'row'
        ? (data.computedData[0] ?? []).map(d => d.groupLabel)
        : data.computedData.map(d => d[0].groupLabel)

      const _axisLabels = 
      // new Array(groupingAmount).fill(0)
      //   .map((d, i) => {
      //     return _labels[i] != null
      //       ? _labels[i]
      //       : String(i) // 沒有label則用序列號填充
      //   })
        _labels
        .filter((d, i) => {
          return i >= groupScaleDomainMin && i <= groupScaleDomainMax
        })
      subscriber.next(_axisLabels)
    })
  })

  return new Observable<(event: any) => { groupIndex: number; groupLabel: string }>(subscriber => {
    combineLatest({
      dataFormatter: fullDataFormatter$,
      axisSize: gridAxesSize$,
      fullChartParams: fullChartParams$,
      scaleRangeGroupLabels: scaleRangeGroupLabels$
    }).pipe(
      takeUntil(destroy$),
      // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
      switchMap(async (d) => d),
    ).subscribe(data => {
      
      const reverse = data.dataFormatter.grid.valueAxis.position === 'right'
        || data.dataFormatter.grid.valueAxis.position === 'bottom'
          ? true : false

      // 比例尺座標對應非連續資料索引
      const groupIndexScale = createAxisQuantizeScale({
        axisLabels: data.scaleRangeGroupLabels,
        axisWidth: data.axisSize.width,
        reverse
      })

      // 依比例尺位置計算座標
      const axisValuePredicate = (event: any) => {
        return data.dataFormatter.grid.groupAxis.position === 'bottom'
          || data.dataFormatter.grid.groupAxis.position === 'top'
            ? event.offsetX - data.fullChartParams.padding.left
            : event.offsetY - data.fullChartParams.padding.top
      }

      // 比例尺座標取得groupData的function
      const createEventGroupData: (event: any) => { groupIndex: number; groupLabel: string } = (event: any) => {
        const axisValue = axisValuePredicate(event)
        const groupIndex = groupIndexScale(axisValue)
        return {
          groupIndex,
          groupLabel: data.scaleRangeGroupLabels[groupIndex] ?? ''
        }
      }

      subscriber.next(createEventGroupData)

      return function unsubscribe () {
        destroy$.next(undefined)
      }
    })
  })
}
