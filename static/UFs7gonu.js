import{y as A,a7 as y,w as F,C as p,J as h,F as D,G as S,a8 as $,N as P,E as u,B as C,K as L,P as R,a9 as E}from"./_HanNZE-.js";const _=s=>{const{data:e=[],dataFormatter:a,chartParams:n}=s;if(!e.length)return[];let r=[];try{const i=(t,l,m,o)=>{const c=A(a.type,l,m),d=a.seriesLabels[l]||y("series",l),f=F(l,n);return typeof t=="number"?{id:c,index:o,seq:0,label:c,description:"",data:{},value:t,seriesIndex:l,seriesLabel:d,color:f,visible:!0}:{id:t.id?t.id:c,index:o,seq:0,label:t.label?t.label:c,description:t.description,data:t.data??{},value:t.value,seriesIndex:l,seriesLabel:d,color:f,visible:!0}};r=e.map((t,l)=>Array.isArray(t)?t.map((m,o)=>i(m,l,o,r.length+o)):i(t,l,0,r.length)).flat().sort(a.sort??void 0).map((t,l)=>(t.seq=l,t)).map(t=>(t.visible=a.visibleFilter(t,s),t)).sort((t,l)=>t.index-l.index).reduce((t,l)=>(t[l.seriesIndex]||(t[l.seriesIndex]=[]),t[l.seriesIndex].push(l),t),[])}catch(i){throw Error(i)}return r},v=({fullDataFormatter$:s})=>s.pipe(p(e=>e.separateSeries),h()),T=({computedData$:s})=>s.pipe(p(e=>e.filter(a=>a.length).map(a=>a[0].seriesLabel)),h((e,a)=>JSON.stringify(e).length===JSON.stringify(a).length)),b=({computedData$:s})=>s.pipe(p(e=>e.map(a=>a.filter(n=>n.visible!=!1)))),M=({computedData$:s,fullDataFormatter$:e})=>D({computedData:s,fullDataFormatter:e}).pipe(S(async a=>a),p(a=>{const n=a.fullDataFormatter.sumSeries==!0?a.computedData.map(r=>[r.reduce((i,t)=>i==null?t:(i.value=i.value+t.value,i),null)]):a.computedData;return a.fullDataFormatter.separateSeries==!0?n.map(r=>r.sort((i,t)=>i.seq-t.seq)):[n.flat().sort((r,i)=>r.seq-i.seq)]})),O=({computedData$:s,fullDataFormatter$:e,layout$:a})=>D({computedData:s,fullDataFormatter:e,layout:a}).pipe(S(async r=>r),p(r=>r.fullDataFormatter.separateSeries?$(r.layout,r.fullDataFormatter.container,r.computedData.length):$(r.layout,r.fullDataFormatter.container,1))),x=({seriesContainerPosition$:s,seriesLabels$:e,separateSeries$:a})=>D({seriesContainerPosition:s,seriesLabels:e,separateSeries:a}).pipe(S(async n=>n),p(n=>n.separateSeries?new Map(n.seriesLabels.map((r,i)=>[r,n.seriesContainerPosition[i]??n.seriesContainerPosition[0]])):new Map(n.seriesLabels.map((r,i)=>[r,n.seriesContainerPosition[0]])))),U=({subject:s,observer:e})=>{const a=P(e.fullChartParams$).pipe(u(1)),n=v({fullDataFormatter$:e.fullDataFormatter$}),r=b({computedData$:e.computedData$}),i=M({computedData$:e.computedData$,fullDataFormatter$:e.fullDataFormatter$}).pipe(u(1)),t=b({computedData$:i}),l=e.computedData$.pipe(p(g=>g.flat())).pipe(u(1)),m=C({datumList$:l,fullChartParams$:e.fullChartParams$,event$:s.event$}).pipe(u(1)),o=T({computedData$:e.computedData$}),c=L({datumList$:l}).pipe(u(1)),d=O({computedData$:e.computedData$,fullDataFormatter$:e.fullDataFormatter$,layout$:e.layout$}).pipe(u(1)),f=x({seriesContainerPosition$:d,seriesLabels$:o,separateSeries$:n}).pipe(u(1));return{fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,fullDataFormatter$:e.fullDataFormatter$,computedData$:e.computedData$,layout$:e.layout$,textSizePx$:a,visibleComputedData$:r,visibleComputedLayoutData$:t,separateSeries$:n,computedLayoutData$:i,seriesHighlight$:m,seriesLabels$:o,SeriesDataMap$:c,seriesContainerPosition$:d,SeriesContainerPositionMap$:f}};class I extends R{constructor(e,a){super({defaultDataFormatter:E,computedDataFn:_,contextObserverFn:U},e,a)}}const w={force:{strength:.03,velocityDecay:.2,collisionSpacing:2},bubbleText:{fillRate:.6,lineHeight:12,lineLengthMin:4},highlightRIncrease:0,arcScaleType:"area"},B={outerRadius:.95,innerRadius:0,mouseoverOuterRadius:1,startAngle:0,endAngle:Math.PI*2,padAngle:.02,cornerRadius:0},N={eventFn:(s,e,a)=>e==="mouseover"||e==="mousemove"?[String(s.datum.value)]:[String(Math.round(s.data.reduce((n,r)=>n+r.reduce((i,t)=>i+(t.value??0),0),0)*a))],textAttrs:[{transform:"translate(0, 0)"}],textStyles:[{"font-weight":"bold","text-anchor":"middle","pointer-events":"none","dominant-baseline":"middle","font-size":64,fill:"#000"}]},k={outerRadius:.95,mouseoverOuterRadius:1,startAngle:0,endAngle:Math.PI*2,labelCentroid:2.3,labelColorType:"series",labelFn:s=>String(s.label)},z={outerRadius:.95,cornerRadius:0,arcScaleType:"area",mouseoverAngleIncrease:.05},H={outerRadius:.95,labelCentroid:2.5,labelFn:s=>String(s.label),labelColorType:"series",arcScaleType:"area"},J={position:"right",justify:"end",padding:28,backgroundFill:"none",backgroundStroke:"none",gap:10,listRectWidth:14,listRectHeight:14,listRectRadius:0,textColorType:"primary"};export{N as D,I as S,J as a,k as b,z as c,H as d,w as e,B as f};
