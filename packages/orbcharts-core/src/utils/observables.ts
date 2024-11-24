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
  ComputedDatumBase,
  ComputedDataTypeMap,
  ComputedDatumTypeMap,
  DataFormatterTypeMap,
  EventTypeMap,
  HighlightTarget,
  Layout,
  TransformData } from '../../lib/core-types'

// interface DatumUnknown {
//   value: number | null
//   id: string
//   // label: string
//   seriesLabel?: string // 要符合每一種computedData所以不一定會有seriesLabel
//   groupLabel?: string // 要符合每一種computedData所以不一定會有groupLabel
// }

export function resizeObservable(elem: HTMLElement | Element): Observable<DOMRectReadOnly> {
  return new Observable(subscriber => {
    const ro = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry && entry.contentRect) {
        subscriber.next(entry.contentRect)
      }
    })

    ro.observe(elem)
    return function unsubscribe() {
      ro.unobserve(elem)
    }
  })
}

// 通用 highlight Observable
export const highlightObservable = <T extends ChartType, D>({ datumList$, fullChartParams$, event$ }: {
  datumList$: Observable<D[]>
  fullChartParams$: Observable<ChartParams>
  event$: Subject<EventTypeMap<T>>
}): Observable<D[]> => {
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
    // filter(d => d.eventName === 'mouseover' || d.eventName === 'mousemove'),
    filter(d => d.eventName === 'mouseover'),
    // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
    map(d => {
      return (d as any).datum
        ? {
          id: ((d as any).datum as any).id,
          seriesLabel: ((d as any).datum as any).seriesLabel,
          groupLabel: ((d as any).datum as any).groupLabel,
          categoryLabel: ((d as any).datum as any).categoryLabel,
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

  function getDatumIds (datumList: ComputedDatumTypeMap<T>[], id: string | null) {
    const datum = datumList.find(d => (d as ComputedDatumBase).id === id)
    return datum ? [datum] : []
  }

  function getSeriesIds (datumList: ComputedDatumTypeMap<T>[], seriesLabel: string | null) {
    return seriesLabel == null
      ? []
      : datumList.filter(d => (d as ComputedDatumTypeMap<"series">).seriesLabel === seriesLabel)
  }

  function getGroupIds (datumList: ComputedDatumTypeMap<T>[], groupLabel: string | null) {
    return groupLabel == null
      ? []
      : datumList.filter(d => (d as ComputedDatumTypeMap<"grid">).groupLabel === groupLabel)
  }

  function getCategoryIds (datumList: ComputedDatumTypeMap<T>[], categoryLabel: string | null) {
    return categoryLabel == null
      ? []
      : datumList.filter(d => (d as ComputedDatumTypeMap<"multiValue" | "relationship" | "tree">).categoryLabel === categoryLabel)
  }

  return new Observable<D[]>(subscriber => {
    combineLatest({
      target: merge(highlightMouseover$, highlightMouseout$, highlightDefault$),
      datumList: datumList$,
      fullChartParams: fullChartParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      let datumList: ComputedDatumTypeMap<T>[] = []
      if (data.fullChartParams.highlightTarget === 'datum') {
        datumList = getDatumIds(data.datumList as ComputedDatumTypeMap<T>[], data.target.id)
      } else if (data.fullChartParams.highlightTarget === 'series') {
        datumList = getSeriesIds(data.datumList as ComputedDatumTypeMap<T>[], data.target.seriesLabel)
      } else if (data.fullChartParams.highlightTarget === 'group') {
        datumList = getGroupIds(data.datumList as ComputedDatumTypeMap<T>[], data.target.groupLabel)
      } else if (data.fullChartParams.highlightTarget === 'category') {
        datumList = getCategoryIds(data.datumList as ComputedDatumTypeMap<T>[], data.target.categoryLabel)
      }
      subscriber.next(datumList as D[])
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

export const textSizePxObservable = (chartParams$: Observable<ChartParams>) => {
  return chartParams$.pipe(
    map(d => d.styles.textSize),
    distinctUntilChanged(),
    map(data => {
      let value = NaN
      if (typeof data === 'string') {
        if (data.includes('rem')) {
          const rootFontSizePx = parseFloat(getComputedStyle(document.documentElement).fontSize)
          const num = parseFloat(data)
          value = num * rootFontSizePx
        } else if (data.includes('px')) {
          value = parseFloat(data)
        }
      } else if (typeof data === 'number') {
        return data
      }
      return value ? value : 14 // default
    })
  )
}