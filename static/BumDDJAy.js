import{ag as b,a7 as t,a6 as m,ac as C,a5 as x,ad as A,ae as S,A as P,aE as G}from"./Cs0Bj4Sj.js";import{p as T,g as L,b as R,d as M,e as z,f as k,s as E,i as _,h as U,j as V,k as j,q}from"./DDtePU4_.js";const v=({subject:i,observer:a})=>{const e=b(a.fullChartParams$).pipe(t(1)),p=a.fullDataFormatter$.pipe(m(r=>r.grid.separateSeries),C(),t(1)),o=T({computedData$:a.computedData$,fullDataFormatter$:a.fullDataFormatter$,layout$:a.layout$}),s=L({fullDataFormatter$:a.fullDataFormatter$,layout$:a.layout$}).pipe(t(1)),c=R({gridAxesTransform$:s}).pipe(t(1)),u=M({computedData$:a.computedData$,fullDataFormatter$:a.fullDataFormatter$,layout$:a.layout$}).pipe(t(1)),d=z({gridContainerPosition$:o,gridAxesTransform$:s,gridGraphicTransform$:u}),D=k({fullDataFormatter$:a.fullDataFormatter$,layout$:a.layout$}).pipe(t(1)),l=a.computedData$.pipe(m(r=>r.flat())).pipe(t(1)),n=x({datumList$:l,fullChartParams$:a.fullChartParams$,event$:i.event$}).pipe(t(1)),f=E({computedData$:a.computedData$}),g=A({datumList$:l}).pipe(t(1)),h=S({datumList$:l}).pipe(t(1)),$=_({computedData$:a.computedData$,fullDataFormatter$:a.fullDataFormatter$,layout$:a.layout$}).pipe(t(1)),F=U({computedData$:a.computedData$}).pipe(t(1)),O=V({computedLayoutData$:$}).pipe(t(1)),y=j({computedData$:a.computedData$,isSeriesSeprate$:p}).pipe(t(1));return{fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,fullDataFormatter$:a.fullDataFormatter$,computedData$:a.computedData$,layout$:a.layout$,textSizePx$:e,isSeriesSeprate$:p,gridContainerPosition$:o,gridAxesTransform$:s,gridAxesReverseTransform$:c,gridGraphicTransform$:u,gridGraphicReverseScale$:d,gridAxesSize$:D,gridHighlight$:n,seriesLabels$:f,SeriesDataMap$:g,GroupDataMap$:h,computedLayoutData$:$,visibleComputedData$:F,visibleComputedLayoutData$:O,computedStackedData$:y}};class w extends P{constructor(a,e){super({defaultDataFormatter:G,computedDataFn:q,contextObserverFn:v},a,e)}}export{w as G};