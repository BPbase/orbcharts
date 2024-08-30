import{g as b,S as y,t as d,m as A,d as W,e as f,s as P,c as O,z as _,O as D}from"./CjdleEie.js";import{c as U,d as F}from"./elroECq0.js";import{h as H,a as B,m as v,g as G}from"./CzUzxl8i.js";import{f as z}from"./DeVmvt24.js";import{c as q}from"./CDOey7kn.js";function J({computedDataSeries:g,startAngle:n,endAngle:a}){return H().startAngle(n).endAngle(a).value(t=>t.visible==!1?0:t.value).sort((t,h)=>t.sortedIndex-h.sortedIndex)(g).map((t,h)=>{let r=t;return r.id=t.data.id,r})}const N="Pie",K=G(N,"path");function Q({enter:g,exit:n,data:a,lastData:l,fullParams:s}){return!g.size()&&!n.size()?t=>{const h=a.map((r,u)=>{const c=l[u]??{startAngle:0,endAngle:0,value:0};return{...r,startAngle:r.startAngle*t+c.startAngle*(1-t),endAngle:r.endAngle*t+c.endAngle*(1-t),value:r.value*t+c.value*(1-t)}});return S(h,s.startAngle,s.endAngle,1)}:t=>S(a,s.startAngle,s.endAngle,t)}function S(g,n,a,l){return g.map((s,t)=>{const h=n+(s.startAngle-n)*l,r=h+(s.endAngle-s.startAngle)*l;return{...s,startAngle:h,endAngle:r}})}function M({selection:g,renderData:n,arc:a}){let l=g.selectAll("path").data(n,r=>r.id),s=l.enter().append("path").classed(K,!0),t=l.exit();s.append("path");const h=l.merge(s);return h.style("cursor","pointer").attr("fill",(r,u)=>r.data.color).attr("d",(r,u)=>a(r)),t.remove(),h}function V({pathSelection:g,ids:n,fullChartParams:a,arc:l,arcMouseover:s}){if(g.interrupt("highlight"),!n.length){g.transition("highlight").style("opacity",1).attr("d",t=>l(t));return}g.each((t,h,r)=>{const u=O(r[h]);n.includes(t.data.id)?u.style("opacity",1).transition("highlight").ease(_).duration(500).attr("d",c=>s(c)):u.style("opacity",a.styles.unhighlightedOpacity).transition("highlight").attr("d",c=>l(c))})}const te=b(N,U)(({selection:g,name:n,observer:a,subject:l})=>{const s=new y,t=g.append("g"),h=new y;let r=[],u=[];a.layout$.pipe(z()).subscribe(e=>{g.attr("transform",`translate(${e.width/2}, ${e.height/2})`),a.layout$.pipe(d(s)).subscribe(i=>{g.transition().attr("transform",`translate(${i.width/2}, ${i.height/2})`)})});const c=a.layout$.pipe(d(s),A(e=>e.width<e.height?e.width:e.height)),w=new D(e=>{f({computedData:a.computedData$,fullParams:a.fullParams$}).pipe(d(s),P(async i=>i)).subscribe(i=>{const m=J({computedDataSeries:i.computedData,startAngle:i.fullParams.startAngle,endAngle:i.fullParams.endAngle});e.next(m)})}),R=new D(e=>{f({shorterSideWith:c,fullParams:a.fullParams$}).pipe(d(s),P(async i=>i)).subscribe(i=>{const m=v({axisWidth:i.shorterSideWith,innerRadius:i.fullParams.innerRadius,outerRadius:i.fullParams.outerRadius,padAngle:i.fullParams.padAngle,cornerRadius:i.fullParams.cornerRadius});e.next(m)})}),L=new D(e=>{f({shorterSideWith:c,fullParams:a.fullParams$}).pipe(d(s),P(async i=>i)).subscribe(i=>{const m=v({axisWidth:i.shorterSideWith,innerRadius:i.fullParams.innerRadius,outerRadius:i.fullParams.outerMouseoverRadius,padAngle:i.fullParams.padAngle,cornerRadius:i.fullParams.cornerRadius});e.next(m)})}),C=a.fullChartParams$.pipe(d(s),A(e=>e.highlightTarget),W());return f({pieData:w,SeriesDataMap:a.SeriesDataMap$,arc:R,arcMouseover:L,computedData:a.computedData$,fullParams:a.fullParams$,fullChartParams:a.fullChartParams$,highlightTarget:C}).pipe(d(s),P(async e=>e)).subscribe(e=>{t.interrupt("graphicMove");let i=g.selectAll("path").data(e.pieData,x=>x.data.id),m=i.enter(),I=i.exit();const E=Q({enter:m,exit:I,data:e.pieData,lastData:r,fullParams:e.fullParams});t.transition("graphicMove").duration(e.fullChartParams.transitionDuration).ease(B(e.fullChartParams.transitionEase)).tween("move",(x,k)=>$=>{u=E($),M({selection:t,renderData:u,arc:e.arc}),l.event$.next({type:"series",pluginName:n,eventName:"transitionMove",event:void 0,highlightTarget:e.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",data:e.computedData})}).on("end",(x,k)=>{u=S(e.pieData,e.fullParams.startAngle,e.fullParams.endAngle,1);const $=M({selection:t,renderData:u,arc:e.arc});h.next($),r=Object.assign([],e.pieData),l.event$.next({type:"series",pluginName:n,eventName:"transitionEnd",event:void 0,highlightTarget:e.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",data:e.computedData}),$.on("mouseover",(p,o)=>{p.stopPropagation(),l.event$.next({type:"series",eventName:"mouseover",pluginName:n,highlightTarget:e.highlightTarget,datum:o.data,series:e.SeriesDataMap.get(o.data.seriesLabel),seriesIndex:o.data.seriesIndex,seriesLabel:o.data.seriesLabel,event:p,data:e.computedData})}).on("mousemove",(p,o)=>{p.stopPropagation(),l.event$.next({type:"series",eventName:"mousemove",pluginName:n,highlightTarget:e.highlightTarget,datum:o.data,series:e.SeriesDataMap.get(o.data.seriesLabel),seriesIndex:o.data.seriesIndex,seriesLabel:o.data.seriesLabel,event:p,data:e.computedData})}).on("mouseout",(p,o)=>{p.stopPropagation(),l.event$.next({type:"series",eventName:"mouseout",pluginName:n,highlightTarget:e.highlightTarget,datum:o.data,series:e.SeriesDataMap.get(o.data.seriesLabel),seriesIndex:o.data.seriesIndex,seriesLabel:o.data.seriesLabel,event:p,data:e.computedData})}).on("click",(p,o)=>{p.stopPropagation(),l.event$.next({type:"series",eventName:"click",pluginName:n,highlightTarget:e.highlightTarget,datum:o.data,series:e.SeriesDataMap.get(o.data.seriesLabel),seriesIndex:o.data.seriesIndex,seriesLabel:o.data.seriesLabel,event:p,data:e.computedData})})})}),f({pathSelection:h,highlight:a.seriesHighlight$,fullChartParams:a.fullChartParams$,arc:R,arcMouseover:L}).pipe(d(s),P(async e=>e)).subscribe(e=>{V({pathSelection:e.pathSelection,ids:e.highlight,fullChartParams:e.fullChartParams,arc:e.arc,arcMouseover:e.arcMouseover})}),()=>{s.next(void 0)}}),T="SeriesLegend",ae=b(T,F)(({selection:g,rootSelection:n,observer:a,subject:l})=>{const s=new y,t=a.SeriesDataMap$.pipe(d(s),A(u=>Array.from(u.keys()))),h=a.fullParams$.pipe(d(s),A(u=>{const c=[{listRectWidth:u.listRectWidth,listRectHeight:u.listRectHeight,listRectRadius:u.listRectRadius}];return{...u,seriesList:c}})),r=q(T,{rootSelection:n,seriesLabels$:t,fullParams$:h,layout$:a.layout$,fullChartParams$:a.fullChartParams$});return()=>{s.next(void 0),r()}});export{te as P,ae as S,J as m};