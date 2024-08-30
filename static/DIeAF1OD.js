import{e as K,a as N,g as Q,l as R,j as V}from"./CzUzxl8i.js";import{a as Z,g as ee}from"./W937OcHy.js";import{S as te,m as P,d as E,e as F,t as S,s as f,c as y,O as C}from"./CjdleEie.js";import{f as ie}from"./5rDUwiLZ.js";function se(i="curveLinear"){return R().x(a=>a.axisX).y(a=>a.axisY).curve(V[i])}function re(i){let a=[[]],o=0;for(let c in i){if(i[c].visible==!1||i[c].value===void 0||i[c].value===null){a[o].length&&(o++,a[o]=[]);continue}a[o].push(i[c])}return a}function ae({selection:i,pathClassName:a,segmentData:o,linePath:c,params:n}){return i.selectAll("path").data(o,(s,h)=>s.length?`${s[0].id}_${s[s.length-1].id}`:h).join(s=>s.append("path").classed(a,!0).attr("fill","none").attr("pointer-events","visibleStroke").style("vector-effect","non-scaling-stroke").style("cursor","pointer"),s=>s,s=>s.remove()).attr("stroke-width",n.lineWidth).attr("stroke",(s,h)=>s[0]&&s[0].color).attr("d",s=>c(s))}function ne({selection:i,seriesLabel:a,fullChartParams:o}){if(i.interrupt("highlight"),!a){i.transition("highlight").duration(200).style("opacity",1);return}i.each((c,n,d)=>{c===a?y(d[n]).style("opacity",1):y(d[n]).style("opacity",o.styles.unhighlightedOpacity)})}function oe({defsSelection:i,clipPathData:a,transitionDuration:o,transitionEase:c}){i.selectAll("clipPath").data(a).join(n=>n.append("clipPath"),n=>n,n=>n.remove()).attr("id",n=>n.id).each((n,d,s)=>{y(s[d]).selectAll("rect").data([n]).join(h=>{const l=h.append("rect");return l.transition().duration(o).ease(N(c)).tween("tween",(G,j,M)=>w=>{const v=G.width*w;l.attr("x",0).attr("y",0).attr("width",L=>v).attr("height",L=>L.height)}),l},h=>h.attr("x",0).attr("y",0).attr("width",l=>l.width).attr("height",l=>l.height),h=>h.remove())})}const de=(i,{selection:a,computedData$:o,existSeriesLabels$:c,SeriesDataMap$:n,GroupDataMap$:d,fullParams$:s,fullDataFormatter$:h,fullChartParams$:l,gridAxesTransform$:G,gridGraphicTransform$:j,gridAxesSize$:M,gridHighlight$:w,gridContainer$:v,event$:L})=>{const b=new te,O=K(i,"clipPath-box"),U=Q(i,"path"),{seriesSelection$:ge,axesSelection$:pe,defsSelection$:A,graphicGSelection$:z}=Z({selection:a,pluginName:i,clipPathID:O,existSeriesLabels$:c,gridContainer$:v,gridAxesTransform$:G,gridGraphicTransform$:j}),W=new C(e=>{const r=s.pipe(S(b)).subscribe(u=>{if(!u)return;const x=se(u.lineCurve);e.next(x)});return()=>{r.unsubscribe()}}),B=new C(e=>{o.pipe(S(b),f(async r=>r)).subscribe(r=>{const u=r[0]&&r[0][0]?r.map(x=>x[0].seriesLabel):[];e.next(u)})}),$=l.pipe(P(e=>e.transitionDuration),E()),X=l.pipe(P(e=>e.transitionEase),E());F({defsSelection:A,seriesLabels:B,axisSize:M,transitionDuration:$,transitionEase:X}).pipe(S(b),f(async e=>e)).subscribe(e=>{const u=[{id:O,width:e.axisSize.width,height:e.axisSize.height}].concat(e.seriesLabels.map(x=>({id:`orbcharts__clipPath_${x}`,width:e.axisSize.width,height:e.axisSize.height})));oe({defsSelection:e.defsSelection,clipPathData:u,transitionDuration:e.transitionDuration,transitionEase:e.transitionEase})});const Y=o.pipe(P(e=>{const r=new Map;return e.flat().forEach(u=>r.set(u.id,u)),r})),q=ee({fullDataFormatter$:h,gridAxesSize$:M,computedData$:o,fullChartParams$:l}),H=l.pipe(S(b),P(e=>e.highlightTarget),E());return F({graphicGSelection:z,seriesLabels:B,computedData:o,SeriesDataMap:n,GroupDataMap:d,linePath:W,params:s,highlightTarget:H,gridGroupPositionFn:q}).pipe(S(b),f(async e=>e)).subscribe(e=>{e.graphicGSelection.each((r,u,x)=>{const J=re(e.computedData[u]??[]);ae({selection:y(x[u]),pathClassName:U,linePath:e.linePath,segmentData:J,params:e.params}).on("mouseover",(g,p)=>{g.stopPropagation();const D=p[0]?p[0].seriesLabel:"",{groupIndex:T,groupLabel:m}=e.gridGroupPositionFn(g),t=e.GroupDataMap.get(m).find(I=>I.seriesLabel===D)??p[0];L.next({type:"grid",eventName:"mouseover",pluginName:i,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:g,data:e.computedData})}).on("mousemove",(g,p)=>{g.stopPropagation();const D=p[0]?p[0].seriesLabel:"",{groupIndex:T,groupLabel:m}=e.gridGroupPositionFn(g),t=e.GroupDataMap.get(m).find(I=>I.seriesLabel===D)??p[0];L.next({type:"grid",eventName:"mousemove",pluginName:i,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:g,data:e.computedData})}).on("mouseout",(g,p)=>{g.stopPropagation();const D=p[0]?p[0].seriesLabel:"",{groupIndex:T,groupLabel:m}=e.gridGroupPositionFn(g),t=e.GroupDataMap.get(m).find(I=>I.seriesLabel===D)??p[0];L.next({type:"grid",eventName:"mouseout",pluginName:i,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:g,data:e.computedData})}).on("click",(g,p)=>{g.stopPropagation();const D=p[0]?p[0].seriesLabel:"",{groupIndex:T,groupLabel:m}=e.gridGroupPositionFn(g),t=e.GroupDataMap.get(m).find(I=>I.seriesLabel===D)??p[0];L.next({type:"grid",eventName:"click",pluginName:i,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:g,data:e.computedData})})})}),l.pipe(S(b),ie(e=>e.highlightTarget==="series"),f(e=>F({graphicGSelection:z,highlight:w,DataMap:Y,fullChartParams:l}).pipe(S(b),f(async r=>r)))).subscribe(e=>{const r=e.DataMap.get(e.highlight[0]);ne({selection:e.graphicGSelection,seriesLabel:r&&r.seriesLabel?r.seriesLabel:null,fullChartParams:e.fullChartParams})}),()=>{b.next(void 0)}};export{de as c};