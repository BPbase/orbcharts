import{J as t,$ as g,I as h,K as F,a3 as O,L as C,a9 as x}from"./BILlwXT2.js";import{i as y,e as A,f as S,h as b,j as G,k as P,l as T,m as R,n as L,o as M}from"./D5nkmhym.js";const _=({subject:s,observer:a})=>{const e=y({computedData$:a.computedData$,fullDataFormatter$:a.fullDataFormatter$}).pipe(t(1)),i=A({computedData$:a.computedData$,fullDataFormatter$:a.fullDataFormatter$,fullChartParams$:a.fullChartParams$,layout$:a.layout$}),r=S({fullDataFormatter$:a.fullDataFormatter$,layout$:a.layout$}).pipe(t(1)),o=b({gridAxesTransform$:r}).pipe(t(1)),$=G({computedData$:a.computedData$,fullDataFormatter$:a.fullDataFormatter$,layout$:a.layout$}).pipe(t(1)),p=P({gridContainer$:i,gridAxesTransform$:r,gridGraphicTransform$:$}),u=T({fullDataFormatter$:a.fullDataFormatter$,layout$:a.layout$}).pipe(t(1)),l=a.computedData$.pipe(g(f=>f.flat())).pipe(t(1)),m=h({datumList$:l,fullChartParams$:a.fullChartParams$,event$:s.event$}).pipe(t(1)),c=R({computedData$:a.computedData$}),d=F({datumList$:l}).pipe(t(1)),D=O({datumList$:l}).pipe(t(1)),n=L({computedData$:a.computedData$}).pipe(t(1));return{fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,fullDataFormatter$:a.fullDataFormatter$,computedData$:a.computedData$,layout$:a.layout$,isSeriesPositionSeprate$:e,gridContainer$:i,gridAxesTransform$:r,gridAxesReverseTransform$:o,gridGraphicTransform$:$,gridGraphicReverseScale$:p,gridAxesSize$:u,gridHighlight$:m,existedSeriesLabels$:c,SeriesDataMap$:d,GroupDataMap$:D,visibleComputedData$:n}};class I extends C{constructor(a,e){super({defaultDataFormatter:x,computedDataFn:M,contextObserverFn:_},a,e)}}export{I as G};
