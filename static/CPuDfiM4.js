import{S as _,t as m,d as S,e as T,f as G,s as P,g as C,O as te,x as z,Z as ae,$ as ie,a0 as re}from"./DTMfjTug.js";import{f as V,e as se,h as ne,i as oe,g as le,s as pe}from"./D2FdcmjD.js";import{k as ue,g as ge}from"./b2J-cE12.js";import{f as ce}from"./Bav_1stD.js";import{c as de}from"./CcLHzMHG.js";import{c as he}from"./BsvKXhGM.js";import{i as me}from"./CeoBBPq4.js";function $e(s="curveLinear",u){return ne().x(t=>t.axisX).y0(t=>u).y1(t=>t.axisY).curve(oe[s])}function De(s){let u=[[]],t=0;for(let r in s){if(s[r].visible==!1||s[r].value===void 0||s[r].value===null){u[t].length&&(t++,u[t]=[]);continue}u[t].push(s[r])}return u}function xe({selection:s,pathClassName:u,segmentData:t,areaPath:r,linearGradientIds:a,params:c}){return s.selectAll("path").data(t,(n,p)=>n.length?`${n[0].id}_${n[n.length-1].id}`:p).join(n=>n.append("path").classed(u,!0).attr("fill","none").style("vector-effect","non-scaling-stroke").style("cursor","pointer"),n=>n,n=>n.remove()).attr("fill",(n,p)=>n[0]?`url(#${a[n[0].seriesIndex]})`:"").attr("d",n=>r(n))}function fe({selection:s,seriesLabel:u,fullChartParams:t}){if(s.interrupt("highlight"),!u){s.transition("highlight").duration(200).style("opacity",1);return}s.each((r,a,c)=>{r===u?C(c[a]).style("opacity",1):C(c[a]).style("opacity",t.styles.unhighlightedOpacity)})}function Le({defsSelection:s,computedData:u,linearGradientIds:t,params:r}){s.selectAll("linearGradient").data(u??[]).join(a=>a.append("linearGradient").attr("x1","0%").attr("x2","0%").attr("y1","100%").attr("y2","0%").attr("spreadMethod","pad"),a=>a,a=>a.remove()).attr("id",(a,c)=>a[0]?t[a[0].seriesIndex]:"").html((a,c)=>{const h=a[0]?a[0].color:"";return`
        <stop offset="0%"   stop-color="${h}" stop-opacity="${r.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${h}" stop-opacity="${r.linearGradientOpacity[1]}"/>
      `})}function Se({defsSelection:s,clipPathData:u,transitionDuration:t,transitionEase:r}){s.selectAll("clipPath").data(u).join(a=>a.append("clipPath"),a=>a,a=>a.remove()).attr("id",a=>a.id).each((a,c,h)=>{C(h[c]).selectAll("rect").data([a]).join(n=>{const p=n.append("rect");return p.transition().duration(t).ease(se(r)).tween("tween",(y,w,$)=>x=>{const f=y.width*x;p.attr("x",0).attr("y",0).attr("width",d=>f).attr("height",d=>d.height)}),p},n=>n.attr("x",0).attr("y",0).attr("width",p=>p.width).attr("height",p=>p.height),n=>n.remove())})}const Ae=(s,{selection:u,computedData$:t,computedLayoutData$:r,visibleComputedData$:a,visibleComputedLayoutData$:c,seriesLabels$:h,SeriesDataMap$:n,GroupDataMap$:p,fullParams$:y,fullDataFormatter$:w,fullChartParams$:$,gridAxesTransform$:x,gridGraphicTransform$:f,gridAxesSize$:d,gridHighlight$:F,gridContainerPosition$:v,layout$:be,event$:M})=>{const D=new _,B=V(s,"clipPath-box"),N=le(s,"path"),{seriesSelection$:ye,axesSelection$:Pe,defsSelection$:R,graphicGSelection$:O}=ue({selection:u,pluginName:s,clipPathID:B,seriesLabels$:h,gridContainerPosition$:v,gridAxesTransform$:x,gridGraphicTransform$:f}),X=f.pipe(m(D),S(e=>-e.translate[1]/e.scale[1])),K=new te(e=>{const g=G({fullParams:y,valueAxisStart:X}).pipe(m(D)).subscribe(o=>{const l=$e(o.fullParams.lineCurve,o.valueAxisStart);e.next(l)});return()=>{g.unsubscribe()}}),W=$.pipe(S(e=>e.transitionDuration),T()),Y=$.pipe(S(e=>e.transitionEase),T());G({defsSelection:R,seriesLabels:h,axisSize:d,transitionDuration:W,transitionEase:Y}).pipe(m(D),P(async e=>e)).subscribe(e=>{const o=[{id:B,width:e.axisSize.width,height:e.axisSize.height}].concat(e.seriesLabels.map(l=>({id:`orbcharts__clipPath_${l}`,width:e.axisSize.width,height:e.axisSize.height})));Se({defsSelection:e.defsSelection,clipPathData:o,transitionDuration:e.transitionDuration,transitionEase:e.transitionEase})});const Z=t.pipe(S(e=>{const g=new Map;return e.flat().forEach(o=>g.set(o.id,o)),g})),q=ge({fullDataFormatter$:w,gridAxesSize$:d,computedData$:t,fullChartParams$:$}),J=$.pipe(m(D),S(e=>e.highlightTarget),T()),Q=h.pipe(m(D),S(e=>e.map((g,o)=>V(s,`lineargradient-${g}`)))),ee=G({graphicGSelection:O,defsSelection:R,visibleComputedLayoutData:c,linearGradientIds:Q,areaPath:K,params:y}).pipe(m(D),P(async e=>e),S(e=>{let g=[];return e.graphicGSelection.each((o,l,L)=>{const I=De(e.visibleComputedLayoutData[l]??[]);g[l]=xe({selection:C(L[l]),pathClassName:N,areaPath:e.areaPath,segmentData:I,linearGradientIds:e.linearGradientIds,params:e.params}),Le({defsSelection:e.defsSelection,computedData:e.visibleComputedLayoutData,linearGradientIds:e.linearGradientIds,params:e.params})}),g}));return G({pathSelectionArr:ee,computedData:t,SeriesDataMap:n,GroupDataMap:p,highlightTarget:J,gridGroupPositionFn:q}).pipe(m(D),P(async e=>e)).subscribe(e=>{e.pathSelectionArr.forEach(g=>{g.on("mouseover",(o,l)=>{o.stopPropagation();const L=l[0]?l[0].seriesLabel:"",{groupIndex:I,groupLabel:A}=e.gridGroupPositionFn(o),i=e.GroupDataMap.get(A).find(b=>b.seriesLabel===L)??l[0];M.next({type:"grid",eventName:"mouseover",pluginName:s,highlightTarget:e.highlightTarget,datum:i,gridIndex:i.gridIndex,series:e.SeriesDataMap.get(i.seriesLabel),seriesIndex:i.seriesIndex,seriesLabel:i.seriesLabel,groups:e.GroupDataMap.get(i.groupLabel),groupIndex:i.groupIndex,groupLabel:i.groupLabel,event:o,data:e.computedData})}).on("mousemove",(o,l)=>{o.stopPropagation();const L=l[0]?l[0].seriesLabel:"",{groupIndex:I,groupLabel:A}=e.gridGroupPositionFn(o),i=e.GroupDataMap.get(A).find(b=>b.seriesLabel===L)??l[0];M.next({type:"grid",eventName:"mousemove",pluginName:s,highlightTarget:e.highlightTarget,datum:i,gridIndex:i.gridIndex,series:e.SeriesDataMap.get(i.seriesLabel),seriesIndex:i.seriesIndex,seriesLabel:i.seriesLabel,groups:e.GroupDataMap.get(i.groupLabel),groupIndex:i.groupIndex,groupLabel:i.groupLabel,event:o,data:e.computedData})}).on("mouseout",(o,l)=>{o.stopPropagation();const L=l[0]?l[0].seriesLabel:"",{groupIndex:I,groupLabel:A}=e.gridGroupPositionFn(o),i=e.GroupDataMap.get(A).find(b=>b.seriesLabel===L)??l[0];M.next({type:"grid",eventName:"mouseout",pluginName:s,highlightTarget:e.highlightTarget,datum:i,gridIndex:i.gridIndex,series:e.SeriesDataMap.get(i.seriesLabel),seriesIndex:i.seriesIndex,seriesLabel:i.seriesLabel,groups:e.GroupDataMap.get(i.groupLabel),groupIndex:i.groupIndex,groupLabel:i.groupLabel,event:o,data:e.computedData})}).on("click",(o,l)=>{o.stopPropagation();const L=l[0]?l[0].seriesLabel:"",{groupIndex:I,groupLabel:A}=e.gridGroupPositionFn(o),i=e.GroupDataMap.get(A).find(b=>b.seriesLabel===L)??l[0];M.next({type:"grid",eventName:"click",pluginName:s,highlightTarget:e.highlightTarget,datum:i,gridIndex:i.gridIndex,series:e.SeriesDataMap.get(i.seriesLabel),seriesIndex:i.seriesIndex,seriesLabel:i.seriesLabel,groups:e.GroupDataMap.get(i.groupLabel),groupIndex:i.groupIndex,groupLabel:i.groupLabel,event:o,data:e.computedData})})})}),$.pipe(m(D),ce(e=>e.highlightTarget==="series"),P(e=>G({graphicGSelection:O,gridHighlight:F,DataMap:Z,fullChartParams:$}).pipe(m(D),P(async g=>g)))).subscribe(e=>{const g=e.gridHighlight[0]?e.gridHighlight[0].seriesLabel:null;fe({selection:e.graphicGSelection,seriesLabel:g,fullChartParams:e.fullChartParams})}),()=>{D.next(void 0)}},H="LineAreas",Fe=z(H,ae)(({selection:s,name:u,observer:t,subject:r})=>{const a=new _,c=Ae(H,{selection:s,computedData$:t.computedData$,visibleComputedData$:t.visibleComputedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:t.fullParams$,fullDataFormatter$:t.fullDataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,layout$:t.layout$,event$:r.event$});return()=>{a.next(void 0),c()}}),U="Dots",Ee=z(U,ie)(({selection:s,name:u,subject:t,observer:r})=>{const a=new _,c=de(U,{selection:s,computedData$:r.computedData$,computedLayoutData$:r.computedLayoutData$,visibleComputedData$:r.visibleComputedData$,visibleComputedLayoutData$:r.visibleComputedLayoutData$,seriesLabels$:r.seriesLabels$,SeriesDataMap$:r.SeriesDataMap$,GroupDataMap$:r.GroupDataMap$,fullParams$:r.fullParams$,fullChartParams$:r.fullChartParams$,gridAxesTransform$:r.gridAxesTransform$,gridGraphicTransform$:r.gridGraphicTransform$,gridGraphicReverseScale$:r.gridGraphicReverseScale$,gridAxesSize$:r.gridAxesSize$,gridHighlight$:r.gridHighlight$,gridContainerPosition$:r.gridContainerPosition$,event$:t.event$});return()=>{a.next(void 0),c()}}),j="ValueStackAxis",ke=z(j,re)(({selection:s,name:u,observer:t,subject:r})=>{const a=new _,c=t.computedData$.pipe(m(a),S(p=>{const y=new Array(p[0]?p[0].length:0).fill(null).map(($,x)=>p.reduce((f,d)=>{if(d&&d[x]){const F=d[x].value==null||d[x].visible==!1?0:d[x].value;return f+F}return f},0));return p.map(($,x)=>$.map((f,d)=>({...f,value:y[d]})))})),h=t.fullDataFormatter$.pipe(m(a),S(p=>p.grid.separateSeries),T(),pe(1)),n=he(j,{selection:s,computedData$:h.pipe(P(p=>me(()=>p,t.computedData$,c))),fullParams$:t.fullParams$,fullDataFormatter$:t.fullDataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridAxesReverseTransform$:t.gridAxesReverseTransform$,gridAxesSize$:t.gridAxesSize$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:h});return()=>{a.next(void 0),n()}}),ze=[[55,80,50,11,150],[35,40,15,65,120]];export{Ee as D,Fe as L,ke as V,Ae as c,ze as g};
