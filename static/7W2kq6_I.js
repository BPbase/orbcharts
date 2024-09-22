import{z as A,a9 as y,x as F,E as p,K as h,G as D,H as S,aa as b,P,F as u,C,L,Q as E,ab as R}from"./DumZHm4J.js";const _=s=>{const{data:e=[],dataFormatter:a,chartParams:i}=s;if(!e.length)return[];let r=[];try{const n=(t,l,m,o)=>{const c=A(a.type,l,m),d=a.seriesLabels[l]||y("series",l),f=F(l,i);return typeof t=="number"?{id:c,index:o,seq:0,label:c,description:"",data:{},value:t,seriesIndex:l,seriesLabel:d,color:f,visible:!0}:{id:t.id?t.id:c,index:o,seq:0,label:t.label?t.label:c,description:t.description,data:t.data??{},value:t.value,seriesIndex:l,seriesLabel:d,color:f,visible:!0}};r=e.map((t,l)=>Array.isArray(t)?t.map((m,o)=>n(m,l,o,r.length+o)):n(t,l,0,r.length)).flat().sort(a.sort??void 0).map((t,l)=>(t.seq=l,t)).map(t=>(t.visible=a.visibleFilter(t,s),t)).sort((t,l)=>t.index-l.index).reduce((t,l)=>(t[l.seriesIndex]||(t[l.seriesIndex]=[]),t[l.seriesIndex].push(l),t),[])}catch(n){throw Error(n)}return r},T=({fullDataFormatter$:s})=>s.pipe(p(e=>e.separateSeries),h()),v=({computedData$:s})=>s.pipe(p(e=>e.filter(a=>a.length).map(a=>a[0].seriesLabel)),h((e,a)=>JSON.stringify(e).length===JSON.stringify(a).length)),$=({computedData$:s})=>s.pipe(p(e=>e.map(a=>a.filter(i=>i.visible!=!1)))),M=({computedData$:s,fullDataFormatter$:e})=>D({computedData:s,fullDataFormatter:e}).pipe(S(async a=>a),p(a=>{const i=a.fullDataFormatter.sumSeries==!0?a.computedData.map(r=>[r.reduce((n,t)=>n==null?t:(n.value=n.value+t.value,n),null)]):a.computedData;return a.fullDataFormatter.separateSeries==!0?i.map(r=>r.sort((n,t)=>n.seq-t.seq)):[i.flat().sort((r,n)=>r.seq-n.seq)]})),O=({computedData$:s,fullDataFormatter$:e,layout$:a})=>D({computedData:s,fullDataFormatter:e,layout:a}).pipe(S(async r=>r),p(r=>r.fullDataFormatter.separateSeries?b(r.layout,r.fullDataFormatter.container,r.computedData.length):b(r.layout,r.fullDataFormatter.container,1))),x=({seriesContainerPosition$:s,seriesLabels$:e,separateSeries$:a})=>D({seriesContainerPosition:s,seriesLabels:e,separateSeries:a}).pipe(S(async i=>i),p(i=>i.separateSeries?new Map(i.seriesLabels.map((r,n)=>[r,i.seriesContainerPosition[n]??i.seriesContainerPosition[0]])):new Map(i.seriesLabels.map((r,n)=>[r,i.seriesContainerPosition[0]])))),U=({subject:s,observer:e})=>{const a=P(e.fullChartParams$).pipe(u(1)),i=T({fullDataFormatter$:e.fullDataFormatter$}),r=$({computedData$:e.computedData$}),n=M({computedData$:e.computedData$,fullDataFormatter$:e.fullDataFormatter$}).pipe(u(1)),t=$({computedData$:n}),l=e.computedData$.pipe(p(g=>g.flat())).pipe(u(1)),m=C({datumList$:l,fullChartParams$:e.fullChartParams$,event$:s.event$}).pipe(u(1)),o=v({computedData$:e.computedData$}),c=L({datumList$:l}).pipe(u(1)),d=O({computedData$:e.computedData$,fullDataFormatter$:e.fullDataFormatter$,layout$:e.layout$}).pipe(u(1)),f=x({seriesContainerPosition$:d,seriesLabels$:o,separateSeries$:i}).pipe(u(1));return{fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,fullDataFormatter$:e.fullDataFormatter$,computedData$:e.computedData$,layout$:e.layout$,textSizePx$:a,visibleComputedData$:r,visibleComputedLayoutData$:t,separateSeries$:i,computedLayoutData$:n,seriesHighlight$:m,seriesLabels$:o,SeriesDataMap$:c,seriesContainerPosition$:d,SeriesContainerPositionMap$:f}};class H extends E{constructor(e,a){super({defaultDataFormatter:R,computedDataFn:_,contextObserverFn:U},e,a)}}const I={force:{strength:.08,velocityDecay:.3,collisionSpacing:2},bubbleText:{fillRate:.6,lineHeight:12,lineLengthMin:4},arcScaleType:"area"},w={outerRadius:.95,innerRadius:0,outerRadiusWhileHighlight:1,startAngle:0,endAngle:Math.PI*2,padAngle:.02,cornerRadius:0},B={eventFn:(s,e,a)=>e==="mouseover"||e==="mousemove"?[String(s.datum.value)]:[String(Math.round(s.data.reduce((i,r)=>i+r.reduce((n,t)=>n+(t.value??0),0),0)*a))],textAttrs:[{transform:"translate(0, 0)"}],textStyles:[{"font-weight":"bold","text-anchor":"middle","pointer-events":"none","dominant-baseline":"middle","font-size":64,fill:"#000"}]},z={outerRadius:.95,outerRadiusWhileHighlight:1,startAngle:0,endAngle:Math.PI*2,labelCentroid:2.3,labelColorType:"primary",labelFn:s=>String(s.label)},k={outerRadius:.95,cornerRadius:0,arcScaleType:"area",mouseoverAngleIncrease:.05},N={outerRadius:.95,labelCentroid:2.5,labelFn:s=>String(s.label),labelColorType:"primary",arcScaleType:"area"},W={position:"right",justify:"end",padding:28,backgroundFill:"none",backgroundStroke:"none",gap:10,listRectWidth:14,listRectHeight:14,listRectRadius:0,textColorType:"primary"};export{B as D,H as S,W as a,z as b,k as c,N as d,I as e,w as f};
