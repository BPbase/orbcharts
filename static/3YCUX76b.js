import{K as N,S as D,t as d,m as y,j as W,k as f,s as P,l as _,a2 as O,O as x}from"./kGF9pzg7.js";import{c as U,f as F,d as G}from"./6pnb_YvY.js";import{s as B,k as K,l as M,b as H,r as q}from"./B7hZ1RX6.js";function z({computedDataSeries:u,startAngle:n,endAngle:a}){return B().startAngle(n).endAngle(a).value(t=>t.visible==!1?0:t.value).sort((t,g)=>t.sortedIndex-g.sortedIndex)(u).map((t,g)=>{let i=t;return i.id=t.data.id,i})}const R="Pie",J=H(R,"path");function Q({enter:u,exit:n,data:a,lastData:l,fullParams:s}){return!u.size()&&!n.size()?t=>{const g=a.map((i,h)=>{const p=l[h]??{startAngle:0,endAngle:0,value:0};return{...i,startAngle:i.startAngle*t+p.startAngle*(1-t),endAngle:i.endAngle*t+p.endAngle*(1-t),value:i.value*t+p.value*(1-t)}});return S(g,s.startAngle,s.endAngle,1)}:t=>S(a,s.startAngle,s.endAngle,t)}function S(u,n,a,l){return u.map((s,t)=>{const g=n+(s.startAngle-n)*l,i=g+(s.endAngle-s.startAngle)*l;return{...s,startAngle:g,endAngle:i}})}function T({selection:u,renderData:n,arc:a}){let l=u.selectAll("path").data(n,i=>i.id),s=l.enter().append("path").classed(J,!0),t=l.exit();s.append("path");const g=l.merge(s);return g.style("cursor","pointer").attr("fill",(i,h)=>i.data.color).attr("d",(i,h)=>a(i)),t.remove(),g}function V({pathSelection:u,ids:n,fullChartParams:a,arc:l,arcMouseover:s}){if(u.interrupt("highlight"),!n.length){u.transition("highlight").style("opacity",1).attr("d",t=>l(t));return}u.each((t,g,i)=>{const h=_(i[g]);n.includes(t.data.id)?h.style("opacity",1).transition("highlight").ease(O).duration(500).attr("d",p=>s(p)):h.style("opacity",a.styles.unhighlightedOpacity).transition("highlight").attr("d",p=>l(p))})}const j=N(R,U)(({selection:u,name:n,observer:a,subject:l})=>{const s=new D,t=u.append("g"),g=new D;let i=[],h=[];a.layout$.pipe(F()).subscribe(e=>{u.attr("transform",`translate(${e.width/2}, ${e.height/2})`),a.layout$.pipe(d(s)).subscribe(r=>{u.transition().attr("transform",`translate(${r.width/2}, ${r.height/2})`)})});const p=a.layout$.pipe(d(s),y(e=>e.width<e.height?e.width:e.height)),w=new x(e=>{f({computedData:a.computedData$,fullParams:a.fullParams$}).pipe(d(s),P(async r=>r)).subscribe(r=>{const m=z({computedDataSeries:r.computedData,startAngle:r.fullParams.startAngle,endAngle:r.fullParams.endAngle});e.next(m)})}),L=new x(e=>{f({shorterSideWith:p,fullParams:a.fullParams$}).pipe(d(s),P(async r=>r)).subscribe(r=>{const m=M({axisWidth:r.shorterSideWith,innerRadius:r.fullParams.innerRadius,outerRadius:r.fullParams.outerRadius,padAngle:r.fullParams.padAngle,cornerRadius:r.fullParams.cornerRadius});e.next(m)})}),v=new x(e=>{f({shorterSideWith:p,fullParams:a.fullParams$}).pipe(d(s),P(async r=>r)).subscribe(r=>{const m=M({axisWidth:r.shorterSideWith,innerRadius:r.fullParams.innerRadius,outerRadius:r.fullParams.outerMouseoverRadius,padAngle:r.fullParams.padAngle,cornerRadius:r.fullParams.cornerRadius});e.next(m)})}),I=a.fullChartParams$.pipe(d(s),y(e=>e.highlightTarget),W());return f({pieData:w,SeriesDataMap:a.SeriesDataMap$,arc:L,arcMouseover:v,computedData:a.computedData$,fullParams:a.fullParams$,fullChartParams:a.fullChartParams$,highlightTarget:I}).pipe(d(s),P(async e=>e)).subscribe(e=>{t.interrupt("graphicMove");let r=u.selectAll("path").data(e.pieData,A=>A.data.id),m=r.enter(),C=r.exit();const k=Q({enter:m,exit:C,data:e.pieData,lastData:i,fullParams:e.fullParams});t.transition("graphicMove").duration(e.fullChartParams.transitionDuration).ease(K(e.fullChartParams.transitionEase)).tween("move",(A,E)=>$=>{h=k($),T({selection:t,renderData:h,arc:e.arc}),l.event$.next({type:"series",pluginName:n,eventName:"transitionMove",event:void 0,highlightTarget:e.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",data:e.computedData})}).on("end",(A,E)=>{h=S(e.pieData,e.fullParams.startAngle,e.fullParams.endAngle,1);const $=T({selection:t,renderData:h,arc:e.arc});g.next($),i=Object.assign([],e.pieData),l.event$.next({type:"series",pluginName:n,eventName:"transitionEnd",event:void 0,highlightTarget:e.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",data:e.computedData}),$.on("mouseover",(c,o)=>{c.stopPropagation(),l.event$.next({type:"series",eventName:"mouseover",pluginName:n,highlightTarget:e.highlightTarget,datum:o.data,series:e.SeriesDataMap.get(o.data.seriesLabel),seriesIndex:o.data.seriesIndex,seriesLabel:o.data.seriesLabel,event:c,data:e.computedData})}).on("mousemove",(c,o)=>{c.stopPropagation(),l.event$.next({type:"series",eventName:"mousemove",pluginName:n,highlightTarget:e.highlightTarget,datum:o.data,series:e.SeriesDataMap.get(o.data.seriesLabel),seriesIndex:o.data.seriesIndex,seriesLabel:o.data.seriesLabel,event:c,data:e.computedData})}).on("mouseout",(c,o)=>{c.stopPropagation(),l.event$.next({type:"series",eventName:"mouseout",pluginName:n,highlightTarget:e.highlightTarget,datum:o.data,series:e.SeriesDataMap.get(o.data.seriesLabel),seriesIndex:o.data.seriesIndex,seriesLabel:o.data.seriesLabel,event:c,data:e.computedData})}).on("click",(c,o)=>{c.stopPropagation(),l.event$.next({type:"series",eventName:"click",pluginName:n,highlightTarget:e.highlightTarget,datum:o.data,series:e.SeriesDataMap.get(o.data.seriesLabel),seriesIndex:o.data.seriesIndex,seriesLabel:o.data.seriesLabel,event:c,data:e.computedData})})})}),f({pathSelection:g,highlight:a.seriesHighlight$,fullChartParams:a.fullChartParams$,arc:L,arcMouseover:v}).pipe(d(s),P(async e=>e)).subscribe(e=>{V({pathSelection:e.pathSelection,ids:e.highlight,fullChartParams:e.fullChartParams,arc:e.arc,arcMouseover:e.arcMouseover})}),()=>{s.next(void 0)}}),b="SeriesLegend",ee=N(b,G)(({selection:u,rootSelection:n,observer:a,subject:l})=>{const s=new D,t=a.SeriesDataMap$.pipe(d(s),y(i=>Array.from(i.keys()))),g=q(b,{rootSelection:n,seriesLabels$:t,fullParams$:a.fullParams$,layout$:a.layout$,fullChartParams$:a.fullChartParams$});return()=>{s.next(void 0),g()}});export{j as P,ee as S,z as m};