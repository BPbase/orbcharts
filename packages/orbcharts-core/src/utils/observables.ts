import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable } from 'rxjs'
import type {
  ChartType,
  ChartParams,
  ComputedDataTypeMap,
  ComputedDatumTypeMap,
  DataFormatterTypeMap,
  HighlightTarget,
  Layout,
  TransformData } from '../types'

// interface DatumUnknown {
//   value: number | null
//   id: string
//   // label: string
//   seriesLabel?: string // 要符合每一種computedData所以不一定會有seriesLabel
//   groupLabel?: string // 要符合每一種computedData所以不一定會有groupLabel
// }

export const highlightObservable = ({ datumList$, fullChartParams$, event$ }: {
  datumList$: Observable<ComputedDatumTypeMap<'series' | 'grid'>[]>
  fullChartParams$: Observable<ChartParams>
  event$: Subject<any>
}): Observable<string[]> => {
  const destroy$ = new Subject()

  // 預設的highlight
  const highlightDefault$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => {
      return {
        id: null,
        seriesLabel: null,
        groupLabel: null,
        highlightDefault: d.highlightDefault
      }
    }),
    distinctUntilChanged()
  )

  // 事件觸發的highlight
  const highlightMouseover$ = event$.pipe(
    takeUntil(destroy$),
    filter(d => d.eventName === 'mouseover' || d.eventName === 'mousemove'),
    // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
    map(d => {
      return d.datum
        ? {
          id: (d.datum as any).id,
          seriesLabel: (d.datum as any).seriesLabel,
          groupLabel: (d.datum as any).groupLabel,
          highlightDefault: null
        }
        : {
          id: null,
          seriesLabel: null,
          groupLabel: null,
          highlightDefault: null
        }
    })
  )
  const highlightMouseout$ = event$.pipe(
    takeUntil(destroy$),
    filter(d => d.eventName === 'mouseout'),
    // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
    // map(d => {
    //   return { id: '', label: '' }
    // })
    switchMap(d => highlightDefault$)
  )

  const getHighlightIds =  ({ data, id, seriesLabel, groupLabel, highlightDefault, target }: {
    data: ComputedDatumTypeMap<'series' | 'grid'>[]
    id: string | null
    seriesLabel: string | null
    groupLabel: string | null
    highlightDefault: string | null
    target: HighlightTarget
  }) => {
    let ids: string[] = []
    // if (id) {
    //   ids.push(id)
    // }
    // if (label) {
    //   if (target === 'group') {
    //     const _ids = data.flat()
    //       .filter(d => {
    //         return d.groupLabel === label
    //           || d.label === label
    //       })
    //       .map(d => d.id)
    //     ids = ids.concat(_ids)
    //   } else if (target === 'series') {
    //     const _ids = data.flat()
    //       .filter(d => {
    //         return d.seriesLabel === label
    //           || d.label === label
    //       })
    //       .map(d => d.id)
    //     ids = ids.concat(_ids)
    //   }
    // }
    // 依highlightDefault找到id/seriesLabel/groupLabel
    if (highlightDefault != null && highlightDefault != '') {
      if (target === 'datum') {
        id = highlightDefault
      } else if (target === 'series') {
        const datum = data.flat().find(d => d.id === highlightDefault || d.seriesLabel === highlightDefault)
        seriesLabel = (datum && datum.seriesLabel) ? datum.seriesLabel : null
      } else if (target === 'group') {
        const datum = data.flat().find(d => d.id === highlightDefault || (d as ComputedDatumTypeMap<"grid">).groupLabel === highlightDefault)
        groupLabel = (datum && (datum as ComputedDatumTypeMap<"grid">).groupLabel) ? (datum as ComputedDatumTypeMap<"grid">).groupLabel : null
      }
    }
    if (target === 'datum' && id != null && id != '') {
      ids.push(id)
    } else if (target === 'series' && seriesLabel != null && seriesLabel != '') {
      const _ids = data.flat()
        .filter(d => {
          return d.seriesLabel === seriesLabel
        })
        .map(d => d.id)
      ids = ids.concat(_ids)
    } else if (target === 'group' && groupLabel != null && groupLabel != '') {
      const _ids = data.flat()
        .filter(d => {
          return (d as ComputedDatumTypeMap<"grid">).groupLabel === groupLabel
        })
        .map(d => d.id)
      ids = ids.concat(_ids)
    }

    return ids
  }

  return new Observable<string[]>(subscriber => {
    combineLatest({
      target: merge(highlightMouseover$, highlightMouseout$, highlightDefault$),
      datumList: datumList$,
      fullChartParams: fullChartParams$,
    }).pipe(
      takeUntil(destroy$)
    ).subscribe(data => {
      const ids = getHighlightIds({
        data: data.datumList,
        id: data.target.id,
        seriesLabel: data.target.seriesLabel,
        groupLabel: data.target.groupLabel,
        highlightDefault: data.target.highlightDefault,
        target: data.fullChartParams.highlightTarget,
      })
      subscriber.next(ids)
    })

    return function unsubscribe () {
      destroy$.next(undefined)
    }
  })
}

export const seriesDataMapObservable = <DatumType extends ComputedDatumTypeMap<ChartType>>({ datumList$ }: { datumList$: Observable<DatumType[]> }) => {
  return datumList$.pipe(
    map(data => {
      const SeriesDataMap: Map<string, DatumType[]> = new Map()
      data.forEach(d => {
        const seriesData = SeriesDataMap.get((d as ComputedDatumTypeMap<'series' | 'grid'>).seriesLabel) ?? []
        seriesData.push(d)
        SeriesDataMap.set((d as ComputedDatumTypeMap<'series' | 'grid'>).seriesLabel, seriesData)
      })
      return SeriesDataMap
    })
  )
}

export const groupDataMapObservable = <DatumType extends ComputedDatumTypeMap<ChartType>> ({ datumList$ }: { datumList$: Observable<DatumType[]> }) => {
  return datumList$.pipe(
    map(data => {
      const GroupDataMap: Map<string, DatumType[]> = new Map()
      data.forEach(d => {
        const groupData = GroupDataMap.get((d as ComputedDatumTypeMap<'grid'>).groupLabel) ?? []
        groupData.push(d)
        GroupDataMap.set((d as ComputedDatumTypeMap<'grid'>).groupLabel, groupData)
      })
      return GroupDataMap
    })
  )
}

