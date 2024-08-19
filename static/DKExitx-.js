import{e as K,g as N,a as Q,l as R,k as V}from"./B2YBZYj8.js";import{a as Z,g as ee}from"./1ujJLabB.js";import{S as te,m as P,d as E,c as F,t as f,s as I,b as y,O as C}from"./qbpNAjKn.js";import{f as ie}from"./C8y5ZR3_.js";function se(i="curveLinear"){return R().x(a=>a.axisX).y(a=>a.axisY).curve(V[i])}function re(i){let a=[[]],n=0;for(let c in i){if(i[c].visible==!1||i[c].value===void 0||i[c].value===null){a[n].length&&(n++,a[n]=[]);continue}a[n].push(i[c])}return a}function ae({selection:i,pathClassName:a,segmentData:n,linePath:c,params:o}){return i.selectAll("path").data(n,(s,h)=>s.length?`${s[0].id}_${s[s.length-1].id}`:h).join(s=>s.append("path").classed(a,!0).attr("fill","none").attr("pointer-events","visibleStroke").style("vector-effect","non-scaling-stroke").style("cursor","pointer"),s=>s,s=>s.remove()).attr("stroke-width",o.lineWidth).attr("stroke",(s,h)=>s[0]&&s[0].color).attr("d",s=>c(s))}function oe({selection:i,seriesLabel:a,fullChartParams:n}){if(i.interrupt("highlight"),!a){i.transition("highlight").duration(200).style("opacity",1);return}i.each((c,o,L)=>{c===a?y(L[o]).style("opacity",1):y(L[o]).style("opacity",n.styles.unhighlightedOpacity)})}function ne({defsSelection:i,clipPathData:a,transitionDuration:n,transitionEase:c}){i.selectAll("clipPath").data(a).join(o=>o.append("clipPath"),o=>o,o=>o.remove()).attr("id",o=>o.id).each((o,L,s)=>{y(s[L]).selectAll("rect").data([o]).join(h=>{const l=h.append("rect");return l.transition().duration(n).ease(N(c)).tween("tween",(G,O,M)=>w=>{const v=G.width*w;l.attr("x",0).attr("y",0).attr("width",D=>v).attr("height",D=>D.height)}),l},h=>h.attr("x",0).attr("y",0).attr("width",l=>l.width).attr("height",l=>l.height),h=>h.remove())})}const Le=(i,{selection:a,computedData$:n,existedSeriesLabels$:c,SeriesDataMap$:o,GroupDataMap$:L,fullParams$:s,fullDataFormatter$:h,fullChartParams$:l,gridAxesTransform$:G,gridGraphicTransform$:O,gridAxesSize$:M,gridHighlight$:w,gridContainer$:v,event$:D})=>{const b=new te,j=K(i,"clipPath-box"),U=Q(i,"path"),{seriesSelection$:pe,axesSelection$:ge,defsSelection$:A,graphicGSelection$:z}=Z({selection:a,pluginName:i,clipPathID:j,existedSeriesLabels$:c,gridContainer$:v,gridAxesTransform$:G,gridGraphicTransform$:O}),W=new C(e=>{const r=s.pipe(f(b)).subscribe(u=>{if(!u)return;const x=se(u.lineCurve);e.next(x)});return()=>{r.unsubscribe()}}),B=new C(e=>{n.pipe(f(b),I(async r=>r)).subscribe(r=>{const u=r[0]&&r[0][0]?r.map(x=>x[0].seriesLabel):[];e.next(u)})}),$=l.pipe(P(e=>e.transitionDuration),E()),X=l.pipe(P(e=>e.transitionEase),E());F({defsSelection:A,seriesLabels:B,axisSize:M,transitionDuration:$,transitionEase:X}).pipe(f(b),I(async e=>e)).subscribe(e=>{const u=[{id:j,width:e.axisSize.width,height:e.axisSize.height}].concat(e.seriesLabels.map(x=>({id:`orbcharts__clipPath_${x}`,width:e.axisSize.width,height:e.axisSize.height})));ne({defsSelection:e.defsSelection,clipPathData:u,transitionDuration:e.transitionDuration,transitionEase:e.transitionEase})});const Y=n.pipe(P(e=>{const r=new Map;return e.flat().forEach(u=>r.set(u.id,u)),r})),q=ee({fullDataFormatter$:h,gridAxesSize$:M,computedData$:n,fullChartParams$:l}),H=l.pipe(f(b),P(e=>e.highlightTarget),E());return F({graphicGSelection:z,seriesLabels:B,computedData:n,SeriesDataMap:o,GroupDataMap:L,linePath:W,params:s,highlightTarget:H,gridGroupPositionFn:q}).pipe(f(b),I(async e=>e)).subscribe(e=>{e.graphicGSelection.each((r,u,x)=>{const J=re(e.computedData[u]??[]);ae({selection:y(x[u]),pathClassName:U,linePath:e.linePath,segmentData:J,params:e.params}).on("mouseover",(p,g)=>{p.stopPropagation();const m=g[0]?g[0].seriesLabel:"",{groupIndex:T,groupLabel:d}=e.gridGroupPositionFn(p),t=e.GroupDataMap.get(d).find(S=>S.seriesLabel===m)??g[0];D.next({type:"grid",eventName:"mouseover",pluginName:i,highlightTarget:e.highlightTarget,datum:t,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:p,data:e.computedData})}).on("mousemove",(p,g)=>{p.stopPropagation();const m=g[0]?g[0].seriesLabel:"",{groupIndex:T,groupLabel:d}=e.gridGroupPositionFn(p),t=e.GroupDataMap.get(d).find(S=>S.seriesLabel===m)??g[0];D.next({type:"grid",eventName:"mousemove",pluginName:i,highlightTarget:e.highlightTarget,datum:t,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:p,data:e.computedData})}).on("mouseout",(p,g)=>{p.stopPropagation();const m=g[0]?g[0].seriesLabel:"",{groupIndex:T,groupLabel:d}=e.gridGroupPositionFn(p),t=e.GroupDataMap.get(d).find(S=>S.seriesLabel===m)??g[0];D.next({type:"grid",eventName:"mouseout",pluginName:i,highlightTarget:e.highlightTarget,datum:t,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:p,data:e.computedData})}).on("click",(p,g)=>{p.stopPropagation();const m=g[0]?g[0].seriesLabel:"",{groupIndex:T,groupLabel:d}=e.gridGroupPositionFn(p),t=e.GroupDataMap.get(d).find(S=>S.seriesLabel===m)??g[0];D.next({type:"grid",eventName:"click",pluginName:i,highlightTarget:e.highlightTarget,datum:t,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:p,data:e.computedData})})})}),l.pipe(f(b),ie(e=>e.highlightTarget==="series"),I(e=>F({graphicGSelection:z,highlight:w,DataMap:Y,fullChartParams:l}).pipe(f(b),I(async r=>r)))).subscribe(e=>{const r=e.DataMap.get(e.highlight[0]);oe({selection:e.graphicGSelection,seriesLabel:r&&r.seriesLabel?r.seriesLabel:null,fullChartParams:e.fullChartParams})}),()=>{b.next(void 0)}};export{Le as c};
