import{S as O,k as x,t as d,l as D,m as L,b as m,s as I}from"./Dh2HIxf9.js";import{a as _,b as k,g as $}from"./2zdWaanV.js";import{n as B}from"./BqHtTwBw.js";function E({graphicGSelection:r,circleGClassName:g,circleClassName:i,visibleComputedLayoutData:b,fullParams:n,fullChartParams:o,graphicReverseScale:p}){const S=y=>{const h=y.size();return o.transitionDuration/h};let v=0;return r.each((y,h,f)=>{I(f[h]).selectAll("g").data(b[h],s=>s.id).join(s=>(v=S(s),s.append("g").classed(g,!0)),s=>s,s=>s.remove()).attr("transform",s=>`translate(${s.axisX}, ${s.axisY})`).each((s,C,G)=>{I(G[C]).selectAll("circle").data([s]).join(l=>l.append("circle").style("cursor","pointer").style("vector-effect","non-scaling-stroke").classed(i,!0).attr("opacity",0).transition().delay((u,c)=>C*v).attr("opacity",1),l=>l.transition().duration(50).attr("opacity",1),l=>l.remove()).attr("r",n.radius).attr("fill",(l,u)=>k({datum:l,colorType:n.fillColorType,fullChartParams:o})).attr("stroke",(l,u)=>k({datum:l,colorType:n.strokeColorType,fullChartParams:o})).attr("stroke-width",n.strokeWidth).attr("transform",`scale(${p[h][0]??1}, ${p[h][1]??1})`)})}),r.selectAll(`circle.${i}`)}function W({selection:r,ids:g,onlyShowHighlighted:i,fullChartParams:b}){if(r.interrupt("highlight"),!g.length){r.transition("highlight").duration(200).style("opacity",i===!0?0:1);return}r.each((n,o,p)=>{g.includes(n.id)?I(p[o]).style("opacity",1).transition("highlight").duration(200):I(p[o]).style("opacity",i===!0?0:b.styles.unhighlightedOpacity).transition("highlight").duration(200)})}function X({defsSelection:r,clipPathData:g}){r.selectAll("clipPath").data(g).join(i=>i.append("clipPath"),i=>i,i=>i.remove()).attr("id",i=>i.id).each((i,b,n)=>{I(n[b]).selectAll("rect").data([i]).join("rect").attr("x",0).attr("y",0).attr("width",o=>o.width).attr("height",o=>o.height)})}const Q=(r,{selection:g,computedData$:i,computedLayoutData$:b,visibleComputedData$:n,visibleComputedLayoutData$:o,seriesLabels$:p,SeriesDataMap$:S,GroupDataMap$:v,fullParams$:T,fullChartParams$:y,gridAxesTransform$:h,gridGraphicTransform$:f,gridGraphicReverseScale$:s,gridAxesSize$:C,gridHighlight$:G,gridContainerPosition$:l,event$:u})=>{const c=new O,w=_(r,"clipPath-box"),A=$(r,"circleG"),P=$(r,"circle"),{seriesSelection$:Y,axesSelection$:q,defsSelection$:j,graphicGSelection$:z}=B({selection:g,pluginName:r,clipPathID:w,seriesLabels$:p,gridContainerPosition$:l,gridAxesTransform$:h,gridGraphicTransform$:f}),R=x({computedData:i,gridGraphicReverseScale:s}).pipe(d(c),D(async e=>e),L(e=>e.computedData.map((a,t)=>e.gridGraphicReverseScale[t])));x({defsSelection:j,gridAxesSize:C}).pipe(d(c),D(async e=>e)).subscribe(e=>{const a=[{id:w,width:e.gridAxesSize.width,height:e.gridAxesSize.height}];X({defsSelection:e.defsSelection,clipPathData:a})});const H=y.pipe(d(c),L(e=>e.highlightTarget),m()),M=x({graphicGSelection:z,visibleComputedLayoutData:o,graphicReverseScale:R,fullChartParams:y,fullParams:T}).pipe(d(c),D(async e=>e),L(e=>E({graphicGSelection:e.graphicGSelection,circleGClassName:A,circleClassName:P,visibleComputedLayoutData:e.visibleComputedLayoutData,fullParams:e.fullParams,fullChartParams:e.fullChartParams,graphicReverseScale:e.graphicReverseScale})));x({graphicSelection:M,computedData:i,SeriesDataMap:S,GroupDataMap:v,highlightTarget:H}).pipe(d(c),D(async e=>e)).subscribe(e=>{e.graphicSelection.on("mouseover",(a,t)=>{u.next({type:"grid",eventName:"mouseover",pluginName:r,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:a,data:e.computedData})}).on("mousemove",(a,t)=>{u.next({type:"grid",eventName:"mousemove",pluginName:r,highlightTarget:e.highlightTarget,data:e.computedData,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:a})}).on("mouseout",(a,t)=>{u.next({type:"grid",eventName:"mouseout",pluginName:r,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:a,data:e.computedData})}).on("click",(a,t)=>{u.next({type:"grid",eventName:"click",pluginName:r,highlightTarget:e.highlightTarget,datum:t,gridIndex:t.gridIndex,series:e.SeriesDataMap.get(t.seriesLabel),seriesIndex:t.seriesIndex,seriesLabel:t.seriesLabel,groups:e.GroupDataMap.get(t.groupLabel),groupIndex:t.groupIndex,groupLabel:t.groupLabel,event:a,data:e.computedData})})});const U=T.pipe(d(c),L(e=>e.onlyShowHighlighted),m());return x({graphicSelection:M,highlight:G.pipe(L(e=>e.map(a=>a.id))),onlyShowHighlighted:U,fullChartParams:y}).pipe(d(c),D(async e=>e)).subscribe(e=>{W({selection:e.graphicSelection,ids:e.highlight,onlyShowHighlighted:e.onlyShowHighlighted,fullChartParams:e.fullChartParams})}),()=>{c.next(void 0)}};export{Q as c};