import{c as y,au as F,a2 as P,a6 as p,ac as C,a8 as D,a9 as d,av as b,ag as g,a7 as u,a5 as L,ad as v,A as O,aw as A}from"./Cs0Bj4Sj.js";const M=n=>{const{data:e=[],dataFormatter:a,chartParams:i}=n;if(!e.length)return[];let r=[];try{const l=(t,s,m,o)=>{const c=y(a.type,s,m),$=a.seriesLabels[s]||F("series",s),f=P(s,i);return typeof t=="number"?{id:c,index:o,seq:0,label:c,description:"",data:{},value:t,seriesIndex:s,seriesLabel:$,color:f,visible:!0}:{id:t.id?t.id:c,index:o,seq:0,label:t.label?t.label:c,description:t.description,data:t.data??{},value:t.value,seriesIndex:s,seriesLabel:$,color:f,visible:!0}};r=e.map((t,s)=>Array.isArray(t)?t.map((m,o)=>l(m,s,o,r.length+o)):l(t,s,0,r.length)).flat().sort(a.sort??void 0).map((t,s)=>(t.seq=s,t)).map(t=>(t.visible=a.visibleFilter(t,n),t)).sort((t,s)=>t.index-s.index).reduce((t,s)=>(t[s.seriesIndex]||(t[s.seriesIndex]=[]),t[s.seriesIndex].push(s),t),[])}catch(l){throw Error(l)}return r},q=({fullDataFormatter$:n})=>n.pipe(p(e=>e.separateSeries),C()),x=({computedData$:n})=>n.pipe(p(e=>e.filter(a=>a.length).map(a=>a[0].seriesLabel)),C((e,a)=>JSON.stringify(e).length===JSON.stringify(a).length)),h=({computedData$:n})=>n.pipe(p(e=>e.map(a=>a.filter(i=>i.visible!=!1)))),w=({computedData$:n,fullDataFormatter$:e})=>D({computedData:n,fullDataFormatter:e}).pipe(d(async a=>a),p(a=>{const i=a.fullDataFormatter.sumSeries==!0?a.computedData.map(r=>[r.reduce((l,t)=>l==null?t:(l.value=l.value+t.value,l),null)]):a.computedData;return a.fullDataFormatter.separateSeries==!0?i.map(r=>r.sort((l,t)=>l.seq-t.seq)):[i.flat().sort((r,l)=>r.seq-l.seq)]})),E=({computedData$:n,fullDataFormatter$:e,layout$:a})=>D({computedData:n,fullDataFormatter:e,layout:a}).pipe(d(async r=>r),p(r=>r.fullDataFormatter.separateSeries?b(r.layout,r.fullDataFormatter.container,r.computedData.length):b(r.layout,r.fullDataFormatter.container,1))),R=({seriesContainerPosition$:n,seriesLabels$:e,separateSeries$:a})=>D({seriesContainerPosition:n,seriesLabels:e,separateSeries:a}).pipe(d(async i=>i),p(i=>i.separateSeries?new Map(i.seriesLabels.map((r,l)=>[r,i.seriesContainerPosition[l]??i.seriesContainerPosition[0]])):new Map(i.seriesLabels.map((r,l)=>[r,i.seriesContainerPosition[0]])))),T=({subject:n,observer:e})=>{const a=g(e.fullChartParams$).pipe(u(1)),i=q({fullDataFormatter$:e.fullDataFormatter$}),r=h({computedData$:e.computedData$}),l=w({computedData$:e.computedData$,fullDataFormatter$:e.fullDataFormatter$}).pipe(u(1)),t=h({computedData$:l}),s=e.computedData$.pipe(p(S=>S.flat())).pipe(u(1)),m=L({datumList$:s,fullChartParams$:e.fullChartParams$,event$:n.event$}).pipe(u(1)),o=x({computedData$:e.computedData$}),c=v({datumList$:s}).pipe(u(1)),$=E({computedData$:e.computedData$,fullDataFormatter$:e.fullDataFormatter$,layout$:e.layout$}).pipe(u(1)),f=R({seriesContainerPosition$:$,seriesLabels$:o,separateSeries$:i}).pipe(u(1));return{fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,fullDataFormatter$:e.fullDataFormatter$,computedData$:e.computedData$,layout$:e.layout$,textSizePx$:a,visibleComputedData$:r,visibleComputedLayoutData$:t,separateSeries$:i,computedLayoutData$:l,seriesHighlight$:m,seriesLabels$:o,SeriesDataMap$:c,seriesContainerPosition$:$,SeriesContainerPositionMap$:f}};class z extends O{constructor(e,a){super({defaultDataFormatter:A,computedDataFn:M,contextObserverFn:T},e,a)}}export{z as S};