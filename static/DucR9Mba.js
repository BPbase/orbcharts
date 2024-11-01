import{S as _,t as g,m,h as P,o as $,p as S,_ as W,s as T,b as ee,r as te}from"./Cs0Bj4Sj.js";import{c as j,d as re,g as v,k as ie}from"./T4xlXSKD.js";import{l as ae}from"./DDtePU4_.js";const R=.3;function H({axisWidth:i,groupAmount:l,barAmountOfGroup:n,barPadding:a=0,barGroupPadding:o=0}){const u=(i/(l-1)-o)/n-a;return u>1?u:1}function se(i,l,n){const a=i/2,o=i*l.length+n.barPadding*l.length;return ie().domain(l).range([-o/2+a,o/2-a])}function ne(i,l){return i<=1?0:l/(i-1)*R}function oe(i,l){return i<=1?l:l*(1-R)}function pe({graphicGSelection:i,pathGClassName:l,pathClassName:n,visibleComputedLayoutData:a,linearGradientIds:o,zeroYArr:p,groupLabels:u,barScale:x,params:O,chartParams:M,barWidth:d,delayGroup:D,transitionItem:w,isSeriesSeprate:f}){const G=d/2;return i.each((z,h,y)=>{T(y[h]).selectAll(`g.${l}`).data(a[h]??[]).join(s=>{const b=s.append("g").classed(l,!0).attr("cursor","pointer");return b.append("path").classed(n,!0).style("vector-effect","non-scaling-stroke").attr("d",I=>{const L=-G,B=p[h],A=p[h];return`M${L},${B} L${L+d/2},${A} ${L+d},${B}`}),b},s=>s,s=>s.remove()).attr("transform",s=>`translate(${f?0:x(s.seriesLabel)}, 0)`).select(`path.${n}`).attr("height",s=>Math.abs(s.axisYFromZero)).attr("y",s=>s.axisY<p[h]?s.axisY:p[h]).attr("x",s=>f?0:x(s.seriesLabel)).style("fill",s=>`url(#${o[s.seriesIndex]})`).attr("stroke",s=>s.color).attr("transform",s=>`translate(${s?s.axisX:0}, 0)`).transition().duration(w).ease(re(M.transitionEase)).delay((s,b)=>s.groupIndex*D).attr("d",s=>{const b=-G,I=p[h],L=s.axisY;return`M${b},${I} L${b+d/2},${L} ${b+d},${I}`})}),i.selectAll(`path.${n}`)}function le({defsSelection:i,computedData:l,linearGradientIds:n,params:a}){i.selectAll("linearGradient").data(l??[]).join(o=>o.append("linearGradient").attr("x1","0%").attr("x2","0%").attr("y1","100%").attr("y2","0%").attr("spreadMethod","pad"),o=>o,o=>o.remove()).attr("id",(o,p)=>o[0]?n[o[0].seriesIndex]:"").html((o,p)=>{const u=o[0]?o[0].color:"";return`
        <stop offset="0%"   stop-color="${u}" stop-opacity="${a.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${u}" stop-opacity="${a.linearGradientOpacity[1]}"/>
      `})}function ce({defsSelection:i,clipPathData:l}){i.selectAll("clipPath").data(l).join(n=>n.append("clipPath"),n=>n,n=>n.remove()).attr("id",n=>n.id).each((n,a,o)=>{T(o[a]).selectAll("rect").data([n]).join(p=>p.append("rect"),p=>p,p=>p.remove()).attr("x",0).attr("y",0).attr("width",p=>p.width).attr("height",p=>p.height)})}function ge({selection:i,ids:l,fullChartParams:n}){i.interrupt("highlight");const a=()=>{i.transition("highlight").duration(200).style("opacity",1)};if(!l.length){a();return}i.each((o,p,u)=>{l.includes(o.id)?T(u[p]).style("opacity",1):T(u[p]).style("opacity",n.styles.unhighlightedOpacity)})}const ue=(i,{selection:l,computedData$:n,computedLayoutData$:a,visibleComputedData$:o,visibleComputedLayoutData$:p,fullDataFormatter$:u,seriesLabels$:x,SeriesDataMap$:O,GroupDataMap$:M,fullParams$:d,fullChartParams$:D,gridAxesTransform$:w,gridGraphicTransform$:f,gridAxesSize$:G,gridHighlight$:k,gridContainerPosition$:z,isSeriesSeprate$:h,event$:y})=>{const c=new _,s=j(i,"clipPath-box"),b=v(i,"pathG"),I=v(i,"path"),{seriesSelection$:L,axesSelection$:B,defsSelection$:A,graphicGSelection$:Z}=ae({selection:l,pluginName:i,clipPathID:s,seriesLabels$:x,gridContainerPosition$:z,gridAxesTransform$:w,gridGraphicTransform$:f});f.pipe(g(c),m(e=>-e.translate[1]/e.scale[1]));const X=p.pipe(m(e=>e.map(r=>r[0]?r[0].axisY-r[0].axisYFromZero:0)),P()),E=$({computedData:n,visibleComputedData:o,params:d,gridAxesSize:G,isSeriesSeprate:h}).pipe(g(c),S(async e=>e),m(e=>e.params.barWidth?e.params.barWidth:e.isSeriesSeprate?H({axisWidth:e.gridAxesSize.width,groupAmount:e.computedData[0]?e.computedData[0].length:0,barAmountOfGroup:1,barPadding:e.params.barPadding,barGroupPadding:e.params.barGroupPadding}):H({axisWidth:e.gridAxesSize.width,groupAmount:e.computedData[0]?e.computedData[0].length:0,barAmountOfGroup:e.visibleComputedData.length,barPadding:e.params.barPadding,barGroupPadding:e.params.barGroupPadding}))),C=o.pipe(g(c),m(e=>{const r=new Set;return e.forEach(t=>{t.forEach(N=>{r.add(N.groupLabel)})}),Array.from(r)})),q=new W(e=>{$({seriesLabels:x,barWidth:E,params:d}).pipe(g(c),S(async r=>r)).subscribe(r=>{const t=se(r.barWidth,r.seriesLabels,r.params);e.next(t)})}),F=D.pipe(g(c),m(e=>e.transitionDuration),P()),J=new W(e=>{$({groupLabels:C,transitionDuration:F}).pipe(S(async r=>r)).subscribe(r=>{const t=ne(r.groupLabels.length,r.transitionDuration);e.next(t)})}).pipe(g(c),P()),K=new W(e=>{$({groupLabels:C,transitionDuration:F}).pipe(S(async r=>r)).subscribe(r=>{const t=oe(r.groupLabels.length,r.transitionDuration);e.next(t)})}).pipe(g(c),P());$({defsSelection:A,gridAxesSize:G}).pipe(g(c),S(async e=>e)).subscribe(e=>{const r=[{id:s,width:e.gridAxesSize.width,height:e.gridAxesSize.height}];ce({defsSelection:e.defsSelection,clipPathData:r})});const Q=D.pipe(g(c),m(e=>e.highlightTarget),P()),V=x.pipe(g(c),m(e=>e.map((r,t)=>j(i,`lineargradient-${r}`)))),Y=$({graphicGSelection:Z,defsSelection:A,computedData:n,visibleComputedLayoutData:p,linearGradientIds:V,zeroYArr:X,groupLabels:C,barScale:q,params:d,chartParams:D,barWidth:E,delayGroup:J,transitionItem:K,isSeriesSeprate:h}).pipe(g(c),S(async e=>e),m(e=>(le({defsSelection:e.defsSelection,computedData:e.computedData,linearGradientIds:e.linearGradientIds,params:e.params}),pe({graphicGSelection:e.graphicGSelection,pathGClassName:b,pathClassName:I,visibleComputedLayoutData:e.visibleComputedLayoutData,linearGradientIds:e.linearGradientIds,zeroYArr:e.zeroYArr,groupLabels:e.groupLabels,barScale:e.barScale,params:e.params,chartParams:e.chartParams,barWidth:e.barWidth,delayGroup:e.delayGroup,transitionItem:e.transitionItem,isSeriesSeprate:e.isSeriesSeprate}))));return $({barSelection:Y,computedData:n,highlightTarget:Q,SeriesDataMap:O,GroupDataMap:M}).subscribe(e=>{e.barSelection.on("mouseover",(r,t)=>{r.stopPropagation(),y.next({type:"grid",eventName:"mouseover",pluginName:i,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:r,data:e.computedData})}).on("mousemove",(r,t)=>{r.stopPropagation(),y.next({type:"grid",eventName:"mousemove",pluginName:i,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:r,data:e.computedData})}).on("mouseout",(r,t)=>{r.stopPropagation(),y.next({type:"grid",eventName:"mouseout",pluginName:i,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:r,data:e.computedData})}).on("click",(r,t)=>{r.stopPropagation(),y.next({type:"grid",eventName:"click",pluginName:i,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:r,data:e.computedData})})}),$({barSelection:Y,highlight:k.pipe(m(e=>e.map(r=>r.id))),fullChartParams:D}).pipe(g(c),S(async e=>e)).subscribe(e=>{ge({selection:e.barSelection,ids:e.highlight,fullChartParams:e.fullChartParams})}),()=>{c.next(void 0)}},U="BarsTriangle",me=ee(U,te)(({selection:i,name:l,subject:n,observer:a})=>{const o=new _,p=ue(U,{selection:i,computedData$:a.computedData$,computedLayoutData$:a.computedLayoutData$,visibleComputedData$:a.visibleComputedData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,fullDataFormatter$:a.fullDataFormatter$,seriesLabels$:a.seriesLabels$,SeriesDataMap$:a.SeriesDataMap$,GroupDataMap$:a.GroupDataMap$,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridGraphicTransform$:a.gridGraphicTransform$,gridAxesSize$:a.gridAxesSize$,gridHighlight$:a.gridHighlight$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:a.isSeriesSeprate$,event$:n.event$});return()=>{o.next(void 0),p()}});export{me as B,ue as c};