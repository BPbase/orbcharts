import{ay as i,aE as O,ao as e,an as d,au as C,am as F,av as S,aw as R,aF as P,b4 as G}from"./Dwexfo5s.js";import{q as L,g as M,a as V,c as w,b as j,d as k,e as z,f as E,h as _,i as U,j as q,k as H,l as I,r as J}from"./WTQfBP9z.js";const K=s=>{const t=i(s,{visibleFilter:{toBeTypes:["Function"]},container:{toBeTypes:["object"]}}),r=i(s,{seriesDirection:{toBe:'"row" | "column"',test:o=>o==="row"||o==="column"},rowLabels:{toBeTypes:["string[]"]},columnLabels:{toBeTypes:["string[]"]},valueAxis:{toBeTypes:["object"]},groupAxis:{toBeTypes:["object"]},separateSeries:{toBeTypes:["boolean"]}});if(r.status==="error")return r;if(s.valueAxis){const o=i(s.valueAxis,{position:{toBe:'"bottom" | "left" | "top" | "right"',test:a=>a==="bottom"||a==="left"||a==="top"||a==="right"},scaleDomain:{toBe:'[number | "min" | "auto", number | "max" | "auto"]',test:a=>Array.isArray(a)&&a.length===2&&(typeof a[0]=="number"||a[0]==="min"||a[0]==="auto")&&(typeof a[1]=="number"||a[1]==="max"||a[1]==="auto")},scaleRange:{toBe:"[number, number]",test:a=>Array.isArray(a)&&a.length===2&&typeof a[0]=="number"&&typeof a[1]=="number"},label:{toBeTypes:["string"]}});if(o.status==="error")return o}if(s.groupAxis){const o=i(s.groupAxis,{position:{toBe:'"bottom" | "left" | "top" | "right"',test:a=>a==="bottom"||a==="left"||a==="top"||a==="right"},scaleDomain:{toBe:'[number, number | "max"]',test:a=>Array.isArray(a)&&a.length===2&&typeof a[0]=="number"&&(typeof a[1]=="number"||a[1]==="max")},scalePadding:{toBeTypes:["number"]},label:{toBeTypes:["string"]}});if(o.status==="error")return o}if(s.container){const o=i(s.container,{gap:{toBeTypes:["number"]},rowAmount:{toBeTypes:["number"]},columnAmount:{toBeTypes:["number"]}});if(o.status==="error")return o}return t},N=s=>i({data:s},{data:{toBe:"(DataGridDatum | DataGridValue)[][]",test:r=>Array.isArray(r)}}),Q=({subject:s,observer:t})=>{const r=O(t.fullChartParams$).pipe(e(1)),o=t.fullDataFormatter$.pipe(d(n=>n.separateSeries),C(),e(1)),a=L({computedData$:t.computedData$,fullDataFormatter$:t.fullDataFormatter$,layout$:t.layout$}),D=M({fullDataFormatter$:t.fullDataFormatter$,layout$:t.layout$}).pipe(e(1)),l=t.computedData$.pipe(d(n=>n.flat())).pipe(e(1)),f=F({datumList$:l,fullChartParams$:t.fullChartParams$,event$:s.event$}).pipe(e(1)),b=V({computedData$:t.computedData$}),y=S({datumList$:l}).pipe(e(1)),g=R({datumList$:l}).pipe(e(1)),m=w({computedData$:t.computedData$,fullDataFormatter$:t.fullDataFormatter$,layout$:t.layout$}).pipe(e(1)),A=j({computedData$:t.computedData$}).pipe(e(1)),x=k({computedLayoutData$:m}).pipe(e(1)),h=z({computedData$:t.computedData$,isSeriesSeprate$:o}).pipe(e(1)),u=E({computedData$:t.computedData$,fullDataFormatter$:t.fullDataFormatter$}).pipe(e(1)),c=_({computedData$:t.computedData$,groupScaleDomainValue$:u}).pipe(e(1)),p=U({fullDataFormatter$:t.fullDataFormatter$,layout$:t.layout$}).pipe(e(1)),T=q({gridAxesTransform$:p}).pipe(e(1)),$=H({computedData$:t.computedData$,groupScaleDomainValue$:u,filteredMinMaxValue$:c,fullDataFormatter$:t.fullDataFormatter$,layout$:t.layout$}).pipe(e(1)),B=I({gridContainerPosition$:a,gridAxesTransform$:p,gridGraphicTransform$:$});return{fullParams$:t.fullParams$,fullChartParams$:t.fullChartParams$,fullDataFormatter$:t.fullDataFormatter$,computedData$:t.computedData$,layout$:t.layout$,textSizePx$:r,isSeriesSeprate$:o,gridContainerPosition$:a,gridAxesSize$:D,gridHighlight$:f,seriesLabels$:b,SeriesDataMap$:y,GroupDataMap$:g,computedLayoutData$:m,visibleComputedData$:A,visibleComputedLayoutData$:x,computedStackedData$:h,groupScaleDomainValue$:u,filteredMinMaxValue$:c,gridAxesTransform$:p,gridAxesReverseTransform$:T,gridGraphicTransform$:$,gridGraphicReverseScale$:B}};class Y extends P{constructor(t,r){super({defaultDataFormatter:G,dataFormatterValidator:K,computedDataFn:J,dataValidator:N,contextObserverCallback:Q},t,r)}}export{Y as G};
