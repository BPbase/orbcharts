import{e as J,f as K,l as N,i as Q,g as R}from"./BeiEZ8Ba.js";import{k as V,g as Z}from"./Cha9ElIW.js";import{S as ee,d as S,e as E,f as M,t as m,s as y,g as v,O as te}from"./C-r1ajy-.js";import{f as ie}from"./CmcBniGk.js";function re(r="curveLinear"){return N().x(o=>o.axisX).y(o=>o.axisY).curve(Q[r])}function se(r){let o=[[]],g=0;for(let l in r){if(r[l].visible==!1||r[l].value===void 0||r[l].value===null){o[g].length&&(g++,o[g]=[]);continue}o[g].push(r[l])}return o}function ae({selection:r,pathClassName:o,segmentData:g,linePath:l,params:n}){return r.selectAll("path").data(g,(a,c)=>a.length?`${a[0].id}_${a[a.length-1].id}`:c).join(a=>a.append("path").classed(o,!0).attr("fill","none").attr("pointer-events","visibleStroke").style("vector-effect","non-scaling-stroke").style("cursor","pointer"),a=>a,a=>a.remove()).attr("stroke-width",n.lineWidth).attr("stroke",(a,c)=>a[0]&&a[0].color).attr("d",a=>l(a))}function oe({selection:r,seriesLabel:o,fullChartParams:g}){if(r.interrupt("highlight"),!o){r.transition("highlight").duration(200).style("opacity",1);return}r.each((l,n,d)=>{l===o?v(d[n]).style("opacity",1):v(d[n]).style("opacity",g.styles.unhighlightedOpacity)})}function ne({defsSelection:r,clipPathData:o,transitionDuration:g,transitionEase:l}){r.selectAll("clipPath").data(o).join(n=>n.append("clipPath"),n=>n,n=>n.remove()).attr("id",n=>n.id).each((n,d,a)=>{v(a[d]).selectAll("rect").data([n]).join(c=>{const u=c.append("rect");return u.transition().duration(g).ease(K(l)).tween("tween",(P,F,D)=>w=>{const T=P.width*w;u.attr("x",0).attr("y",0).attr("width",f=>T).attr("height",f=>f.height)}),u},c=>c.attr("x",0).attr("y",0).attr("width",u=>u.width).attr("height",u=>u.height),c=>c.remove())})}const be=(r,{selection:o,computedData$:g,computedLayoutData$:l,visibleComputedData$:n,visibleComputedLayoutData$:d,seriesLabels$:a,SeriesDataMap$:c,GroupDataMap$:u,fullParams$:P,fullDataFormatter$:F,fullChartParams$:D,gridAxesTransform$:w,gridGraphicTransform$:T,gridAxesSize$:f,gridHighlight$:O,gridContainerPosition$:j,event$:G})=>{const b=new ee,A=J(r,"clipPath-box"),z=R(r,"path"),{seriesSelection$:ge,axesSelection$:pe,defsSelection$:$,graphicGSelection$:C}=V({selection:o,pluginName:r,clipPathID:A,seriesLabels$:a,gridContainerPosition$:j,gridAxesTransform$:w,gridGraphicTransform$:T}),B=new te(e=>{const p=P.pipe(m(b)).subscribe(i=>{if(!i)return;const s=re(i.lineCurve);e.next(s)});return()=>{p.unsubscribe()}}),H=D.pipe(S(e=>e.transitionDuration),E()),U=D.pipe(S(e=>e.transitionEase),E());M({defsSelection:$,seriesLabels:a,axisSize:f,transitionDuration:H,transitionEase:U}).pipe(m(b),y(async e=>e)).subscribe(e=>{const i=[{id:A,width:e.axisSize.width,height:e.axisSize.height}].concat(e.seriesLabels.map(s=>({id:`orbcharts__clipPath_${s}`,width:e.axisSize.width,height:e.axisSize.height})));ne({defsSelection:e.defsSelection,clipPathData:i,transitionDuration:e.transitionDuration,transitionEase:e.transitionEase})});const W=g.pipe(S(e=>{const p=new Map;return e.flat().forEach(i=>p.set(i.id,i)),p})),X=Z({fullDataFormatter$:F,gridAxesSize$:f,computedData$:g,fullChartParams$:D}),Y=D.pipe(m(b),S(e=>e.highlightTarget),E()),q=M({graphicGSelection:C,visibleComputedLayoutData:d,linePath:B,params:P}).pipe(m(b),y(async e=>e),S(e=>{let p=[];return e.graphicGSelection.each((i,s,h)=>{const I=se(e.visibleComputedLayoutData[s]??[]);p[s]=ae({selection:v(h[s]),pathClassName:z,linePath:e.linePath,segmentData:I,params:e.params})}),p}));return M({pathSelectionArr:q,computedData:g,SeriesDataMap:c,GroupDataMap:u,highlightTarget:Y,gridGroupPositionFn:X}).pipe(m(b),y(async e=>e)).subscribe(e=>{e.pathSelectionArr.forEach(p=>{p.on("mouseover",(i,s)=>{i.stopPropagation();const h=s[0]?s[0].seriesLabel:"",{groupIndex:I,groupLabel:L}=e.gridGroupPositionFn(i),t=e.GroupDataMap.get(L).find(x=>x.seriesLabel===h)??s[0];G.next({type:"grid",eventName:"mouseover",pluginName:r,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:i,data:e.computedData})}).on("mousemove",(i,s)=>{i.stopPropagation();const h=s[0]?s[0].seriesLabel:"",{groupIndex:I,groupLabel:L}=e.gridGroupPositionFn(i),t=e.GroupDataMap.get(L).find(x=>x.seriesLabel===h)??s[0];G.next({type:"grid",eventName:"mousemove",pluginName:r,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:i,data:e.computedData})}).on("mouseout",(i,s)=>{i.stopPropagation();const h=s[0]?s[0].seriesLabel:"",{groupIndex:I,groupLabel:L}=e.gridGroupPositionFn(i),t=e.GroupDataMap.get(L).find(x=>x.seriesLabel===h)??s[0];G.next({type:"grid",eventName:"mouseout",pluginName:r,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:i,data:e.computedData})}).on("click",(i,s)=>{i.stopPropagation();const h=s[0]?s[0].seriesLabel:"",{groupIndex:I,groupLabel:L}=e.gridGroupPositionFn(i),t=e.GroupDataMap.get(L).find(x=>x.seriesLabel===h)??s[0];G.next({type:"grid",eventName:"click",pluginName:r,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:i,data:e.computedData})})})}),D.pipe(m(b),ie(e=>e.highlightTarget==="series"),y(e=>M({graphicGSelection:C,gridHighlight:O,DataMap:W,fullChartParams:D}).pipe(m(b),y(async p=>p)))).subscribe(e=>{const p=e.gridHighlight[0]?e.gridHighlight[0].seriesLabel:null;oe({selection:e.graphicGSelection,seriesLabel:p,fullChartParams:e.fullChartParams})}),()=>{b.next(void 0)}};export{be as c};