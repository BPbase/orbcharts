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

// 通用 highlight Observable
export const highlightObservable = ({ datumList$, fullChartParams$, event$ }: {
  datumList$: Observable<ComputedDatumTypeMap<'series' | 'grid' | 'multiValue' | 'relationship' | 'tree'>[]>
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
        categoryLabel: null,
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
          categoryLabel: (d.datum as any).categoryLabel,
          highlightDefault: null
        }
        : {
          id: null,
          seriesLabel: null,
          groupLabel: null,
          categoryLabel: null,
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

  function getDatumIds (datumList: ComputedDatumTypeMap<'series' | 'grid' | 'multiValue' | 'relationship' | 'tree'>[], id: string | null) {
    return id == null
      ? []
      : datumList.find(d => d.id === id) ? [id] : []
  }

  function getSeriesIds (datumList: ComputedDatumTypeMap<'series' | 'grid'>[], seriesLabel: string | null) {
    return seriesLabel == null
      ? []
      : datumList.filter(d => d.seriesLabel === seriesLabel).map(d => d.id)
  }

  function getGroupIds (datumList: ComputedDatumTypeMap<'grid'>[], groupLabel: string | null) {
    return groupLabel == null
      ? []
      : datumList.filter(d => (d as ComputedDatumTypeMap<"grid">).groupLabel === groupLabel).map(d => d.id)
  }

  function getCategoryIds (datumList: ComputedDatumTypeMap<'multiValue' | 'relationship' | 'tree'>[], categoryLabel: string | null) {
    return categoryLabel == null
      ? []
      : datumList.filter(d => (d as ComputedDatumTypeMap<"multiValue" | "relationship" | "tree">).categoryLabel === categoryLabel).map(d => d.id)
  }

  return new Observable<string[]>(subscriber => {
    combineLatest({
      target: merge(highlightMouseover$, highlightMouseout$, highlightDefault$),
      datumList: datumList$,
      fullChartParams: fullChartParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      console.log('data.fullChartParams.highlightTarget', data.fullChartParams.highlightTarget)
      let ids: string[] = []
      if (data.fullChartParams.highlightTarget === 'datum') {
        ids = getDatumIds(data.datumList, data.target.id)
      } else if (data.fullChartParams.highlightTarget === 'series') {
        ids = getSeriesIds(data.datumList as ComputedDatumTypeMap<'series' | 'grid'>[], data.target.seriesLabel)
      } else if (data.fullChartParams.highlightTarget === 'group') {
        ids = getGroupIds(data.datumList as ComputedDatumTypeMap<'grid'>[], data.target.groupLabel)
      } else if (data.fullChartParams.highlightTarget === 'category') {
        ids = getCategoryIds(data.datumList as ComputedDatumTypeMap<'multiValue' | 'relationship' | 'tree'>[], data.target.categoryLabel)
      }
      console.log('ids', ids)
      subscriber.next(ids)
    })

    return function unsubscribe () {
      destroy$.next(undefined)
    }
  })
}

export const seriesDataMapObservable = <DatumType extends ComputedDatumTypeMap<'series' | 'grid'>>({ datumList$ }: { datumList$: Observable<DatumType[]> }) => {
  return datumList$.pipe(
    map(data => {
      const SeriesDataMap: Map<string, DatumType[]> = new Map()
      data.forEach(d => {
        const seriesData = SeriesDataMap.get(d.seriesLabel) ?? []
        seriesData.push(d)
        SeriesDataMap.set(d.seriesLabel, seriesData)
      })
      return SeriesDataMap
    })
  )
}

export const groupDataMapObservable = <DatumType extends ComputedDatumTypeMap<'grid'>> ({ datumList$ }: { datumList$: Observable<DatumType[]> }) => {
  return datumList$.pipe(
    map(data => {
      const GroupDataMap: Map<string, DatumType[]> = new Map()
      data.forEach(d => {
        const groupData = GroupDataMap.get(d.groupLabel) ?? []
        groupData.push(d)
        GroupDataMap.set(d.groupLabel, groupData)
      })
      return GroupDataMap
    })
  )
}

export const categoryDataMapObservable = <DatumType extends ComputedDatumTypeMap<'multiValue' | 'relationship' | 'tree'>> ({ datumList$ }: { datumList$: Observable<DatumType[]> }) => {
  return datumList$.pipe(
    map(data => {
      const GroupDataMap: Map<string, DatumType[]> = new Map()
      data
        .filter(d => d.categoryLabel != null)
        .forEach(d => {
          const groupData = GroupDataMap.get(d.categoryLabel) ?? []
          groupData.push(d)
          GroupDataMap.set(d.categoryLabel, groupData)
        })
      return GroupDataMap
    })
  )
}

