import * as d3 from 'd3'
// import { Observable, merge, distinctUntilChanged, fromEvent } from 'rxjs'
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable,
  debounceTime
} from 'rxjs'
import type {
  ModelType,
  Theme,
  ModelDatum
} from '../../../core/src/types'
import type {
  ComputedDatum
} from '../types/ComputedData'
import type {
  EventData
} from '../../../core/src/types/Event'
import type {
  Layout,
  Padding,
  GraphicStyles,
  ContainerPositionScaled,
  HighlightTarget,
  Container
} from '../types/PluginParams'

// interface DatumUnknown {
//   value: number | null
//   id: string
//   // label: string
//   seriesLabel?: string // 要符合每一種computedData所以不一定會有seriesLabel
//   groupLabel?: string // 要符合每一種computedData所以不一定會有groupLabel
// }

export function d3EventObservable(selection: d3.Selection<any, any, any, any>, event: any) {
  // Start with an observable that will never emit
  let obs: Observable<MouseEvent> = new Observable(() => {});
  selection.each(function () {
      // Create observables from each of the elements
      const events: Observable<MouseEvent> = fromEvent(this, event);
      // Merge the observables into one
      obs = merge(obs, events);
  });
  return obs;
}

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

export function layoutObservable({size$, padding$}: {size$: Observable<{ width: number, height: number }>, padding$: Observable<Padding>}): Observable<Layout> {
  return combineLatest({
    size: size$,
    padding: padding$
  }).pipe(
    debounceTime(0),
    map(data => {
      const width = data.size.width - data.padding.left - data.padding.right
      const height = data.size.height - data.padding.top - data.padding.bottom
      const layout: Layout = {
        rootWidth: data.size.width,
        rootHeight: data.size.height,
        width: width > 0 ? width : 0,
        height: height > 0 ? height : 0,
        left: data.padding.left,
        right: data.padding.right,
        top: data.padding.top,
        bottom: data.padding.bottom
      }
      return layout
    }),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    shareReplay(1)
  )
}

interface HighlightTargetValue {
  id: string | null
  label: string | null
  series: string | null
  // group: string | null
  category: string | null
  // highlightDefault: string | null
}

// 通用 highlight Observable
export const highlightObservable = <T extends ModelType, D>({ datumList$, styles$, event$ }: {
  datumList$: Observable<D[]>
  styles$: Observable<GraphicStyles>
  event$: Observable<EventData<T>>
}): Observable<D[]> => {
  const destroy$ = new Subject()

  // 預設的highlight
  const highlightDefault$: Observable<HighlightTargetValue> = styles$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightDefault || null),
    distinctUntilChanged(),
    map(highlightDefault => {
      return {
        id: highlightDefault,
        label: highlightDefault,
        series: highlightDefault,
        category: highlightDefault,
        // highlightDefault
      } as HighlightTargetValue
    }),
    shareReplay(1)
  )

  const highlightTarget$: Observable<HighlightTarget> = styles$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged(),
    shareReplay(1)
  )

  // 事件觸發的highlight
  const highlightMouseover$: Observable<HighlightTargetValue> = highlightTarget$.pipe(
    switchMap(highlightTarget => {
      return event$.pipe(
        takeUntil(destroy$),
        // filter(d => d.eventName === 'mouseover' || d.eventName === 'mousemove'),
        filter(d => d.eventName === 'mouseover'),
        // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
        map(d => {
          
          // const d = _d as any
          // console.log('mouseover event', d)
          return d.target
            ? {
              id: d.target.id,
              label: null, // label有可能重覆所以不做判斷
              series: highlightTarget === 'series' ? d.target.series : null,
              category: highlightTarget === 'category' ? (d.target as ModelDatum<'grid' | 'multivariate' | 'graph' | 'tree'>).category : null,
              // highlightDefault: null
            } as HighlightTargetValue
            : {
              id: null,
              label: null,
              series: null,
              // group: null,
              category: null,
              // highlightDefault: null
            } as HighlightTargetValue
        })
      )
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

  // function getDatumIds (datumList: ComputedDatum<T>[], id: string | null) {
  //   const datum = datumList.find(d => (d as ComputedDatumBase).id === id)
  //   return datum ? [datum] : []
  // }
  function getDatumIds (datumList: ComputedDatum<T>[], id: string | null, label: string | null) {
    return id == null && label == null
      ? []
      : datumList.filter(d => d.id === id || d.name === label)
  }

  function getSeriesIds (datumList: ComputedDatum<T>[], seriesLabel: string | null) {
    return seriesLabel == null
      ? []
      : datumList.filter(d => (d as ComputedDatum<"series">).series === seriesLabel)
  }

  // function getGroupIds (datumList: ComputedDatum<T>[], groupLabel: string | null) {
  //   return groupLabel == null
  //     ? []
  //     : datumList.filter(d => (d as ComputedDatum<"grid">).category === groupLabel)
  // }

  function getCategoryIds (datumList: ComputedDatum<T>[], category: string | null) {
    return category == null
      ? []
      : datumList.filter(d => (d as ComputedDatum<"multivariate" | "graph" | "tree">).category === category)
  }

  return new Observable<D[]>(subscriber => {
    combineLatest({
      target: merge(highlightMouseover$, highlightMouseout$, highlightDefault$),
      datumList: datumList$,
      styles: styles$,
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      let datumList: ComputedDatum<T>[] = []
      if (data.styles.highlightTarget === 'datum') {
        datumList = getDatumIds(data.datumList as ComputedDatum<T>[], data.target.id, data.target.label)
      } else if (data.styles.highlightTarget === 'series') {
        datumList = getSeriesIds(data.datumList as ComputedDatum<T>[], data.target.series)
      // } else if (data.styles.highlightTarget === 'group') {
      //   datumList = getGroupIds(data.datumList as ComputedDatum<T>[], data.target.group)
      } else if (data.styles.highlightTarget === 'category') {
        datumList = getCategoryIds(data.datumList as ComputedDatum<T>[], data.target.category)
      }
      subscriber.next(datumList as D[])
    })

    return function unsubscribe () {
      destroy$.next(undefined)
    }
  })
}

export const seriesDataMapObservable = <DatumType extends ComputedDatum<'series' | 'grid'>>({ datumList$ }: { datumList$: Observable<DatumType[]> }) => {
  return datumList$.pipe(
    map(data => {
      const SeriesDataMap: Map<string, DatumType[]> = new Map()
      data.forEach(d => {
        const seriesData = SeriesDataMap.get(d.series) ?? []
        seriesData.push(d)
        SeriesDataMap.set(d.series, seriesData)
      })
      return SeriesDataMap
    })
  )
}

// export const groupDataMapObservable = <DatumType extends ComputedDatum<'grid'>> ({ datumList$ }: { datumList$: Observable<DatumType[]> }) => {
//   return datumList$.pipe(
//     map(data => {
//       const GroupDataMap: Map<string, DatumType[]> = new Map()
//       data.forEach(d => {
//         const groupData = GroupDataMap.get(d.category) ?? []
//         groupData.push(d)
//         GroupDataMap.set(d.category, groupData)
//       })
//       return GroupDataMap
//     })
//   )
// }

export const categoryDataMapObservable = <DatumType extends ComputedDatum<'multivariate' | 'graph' | 'tree'>> ({ datumList$ }: { datumList$: Observable<DatumType[]> }) => {
  return datumList$.pipe(
    map(data => {
      const GroupDataMap: Map<string, DatumType[]> = new Map()
      data
        .filter(d => d.category != null)
        .forEach(d => {
          const groupData = GroupDataMap.get(d.category) ?? []
          groupData.push(d)
          GroupDataMap.set(d.category, groupData)
        })
      return GroupDataMap
    })
  )
}

export const fontSizePxObservable = (chartParams$: Observable<Theme>) => {
  return chartParams$.pipe(
    map(d => d.fontSize),
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
  container$: Observable<Container>
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
    debounceTime(0),
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