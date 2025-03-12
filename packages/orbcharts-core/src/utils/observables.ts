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
  ContainerPositionScaled,
  DataFormatterContainer,
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

interface HighlightTargetValue {
  id: string | null
  label: string | null
  seriesLabel: string | null
  groupLabel: string | null
  categoryLabel: string | null
  highlightDefault: string | null
}

// 通用 highlight Observable
export const highlightObservable = <T extends ChartType, D>({ datumList$, fullChartParams$, event$ }: {
  datumList$: Observable<D[]>
  fullChartParams$: Observable<ChartParams>
  event$: Subject<EventTypeMap<T>>
}): Observable<D[]> => {
  const destroy$ = new Subject()

  // 預設的highlight
  const highlightDefault$: Observable<HighlightTargetValue> = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => {
      return {
        id: null,
        label: null,
        seriesLabel: null,
        groupLabel: null,
        categoryLabel: null,
        highlightDefault: d.highlightDefault
      } as HighlightTargetValue
    }),
    distinctUntilChanged()
  )

  // 事件觸發的highlight
  const highlightMouseover$: Observable<HighlightTargetValue> = event$.pipe(
    takeUntil(destroy$),
    // filter(d => d.eventName === 'mouseover' || d.eventName === 'mousemove'),
    filter(d => d.eventName === 'mouseover'),
    // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
    map(_d => {
      const d = _d as any
      return d.datum
        ? {
          id: d.datum.id,
          label: d.datum.label,
          seriesLabel: d.datum.seriesLabel,
          groupLabel: d.datum.groupLabel,
          categoryLabel: d.datum.categoryLabel,
          highlightDefault: null
        } as HighlightTargetValue
        : {
          id: null,
          label: null,
          seriesLabel: null,
          groupLabel: null,
          categoryLabel: null,
          highlightDefault: null
        } as HighlightTargetValue
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

  // function getDatumIds (datumList: ComputedDatumTypeMap<T>[], id: string | null) {
  //   const datum = datumList.find(d => (d as ComputedDatumBase).id === id)
  //   return datum ? [datum] : []
  // }
  function getDatumIds (datumList: ComputedDatumTypeMap<T>[], id: string | null, label: string | null) {
    return id == null && label == null
      ? []
      : datumList.filter(d => (d as ComputedDatumBase).id === id || (d as ComputedDatumBase).label === label)
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
        datumList = getDatumIds(data.datumList as ComputedDatumTypeMap<T>[], data.target.id, data.target.label)
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

export const containerSizeObservable = ({ layout$, containerPosition$, container$ }: {
  layout$: Observable<Layout>
  containerPosition$: Observable<ContainerPositionScaled[]>
  container$: Observable<DataFormatterContainer>
}) => {
  const rowAmount$ = containerPosition$.pipe(
    map(containerPosition => {
      const maxRowIndex = containerPosition.reduce((acc, current) => {
        return current.rowIndex > acc ? current.rowIndex : acc
      }, 0)
      return maxRowIndex + 1
    }),
    distinctUntilChanged(),
  )

  const columnAmount$ = containerPosition$.pipe(
    map(containerPosition => {
      const maxColumnIndex = containerPosition.reduce((acc, current) => {
        return current.columnIndex > acc ? current.columnIndex : acc
      }, 0)
      return maxColumnIndex + 1
    }),
    distinctUntilChanged()
  )

  return combineLatest({
    layout: layout$,
    rowAmount: rowAmount$,
    columnAmount: columnAmount$,
    container: container$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // const width = (data.layout.rootWidth / data.columnAmount) - (data.layout.left + data.layout.right)
      // const height = (data.layout.rootHeight / data.rowAmount) - (data.layout.top + data.layout.bottom)
      const columnGap = data.container.columnGap === 'auto'
        ? data.layout.left + data.layout.right
        : data.container.columnGap
      const rowGap = data.container.rowGap === 'auto'
        ? data.layout.top + data.layout.bottom
        : data.container.rowGap
      const width = (data.layout.rootWidth - data.layout.left - data.layout.right - (columnGap * (data.columnAmount - 1))) / data.columnAmount
      const height = (data.layout.rootHeight - data.layout.top - data.layout.bottom - (rowGap * (data.rowAmount - 1))) / data.rowAmount
      
      return {
        width,
        height
      }
    }),
    distinctUntilChanged((a, b) => a.width === b.width && a.height === b.height),
    // shareReplay(1)
  )
}