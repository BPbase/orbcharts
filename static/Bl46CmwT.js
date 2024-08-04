import{Z as R,S as O,t as g,m as x,j as f,s as y,O as N,k as I,l as C}from"./kGF9pzg7.js";import{h as Z}from"./Bz_gD2gR.js";import{g as U,k as _,b as E,n as F}from"./B7hZ1RX6.js";const B="BarsTriangle",W=E(B,"g"),Y=E(B,"g-content"),H=.3;function X({axisWidth:o,groupAmount:s,barAmountOfGroup:p,barPadding:a=0,barGroupPadding:i=0}){const l=(o/s-i)/p-a;return l>1?l:1}function j(o,s,p){const a=o/2,i=o*s.length+p.barPadding*s.length;return F().domain(s).range([-i/2+a,i/2-a])}function q(o,s){return o<=1?0:s/(o-1)*H}function J(o,s){return o<=1?s:s*(1-H)}function K({selection:o,barData:s,zeroY:p,groupLabels:a,barScale:i,params:l,chartParams:h,barWidth:u,delayGroup:L,transitionItem:b}){const P=o.selectAll(`g.${W}`).data(s,(m,D)=>a[D]),M=P.enter().append("g").classed(W,!0).attr("cursor","pointer");P.exit().remove();const T=P.merge(M);M.attr("transform",(m,D)=>`translate(${m[0]?m[0].axisX:0}, 0)`),P.attr("transform",(m,D)=>`translate(${m[0]?m[0].axisX:0}, 0)`);const S=u/2;return T.each((m,D,k)=>{const A=C(k[D]).selectAll("g").data(m,c=>c.id),w=A.enter().append("g").classed(Y,!0);w.append("path").style("vector-effect","non-scaling-stroke").attr("height",c=>0).attr("d",c=>{const d=i(c.seriesLabel),e=p,t=e;return`M${d-u/2},${e} L${d},${t} ${d+u/2},${e}`}),A.merge(w).select("path").style("fill",c=>`url(#${c.linearGradientId})`).attr("stroke",c=>c.color).attr("transform",`translate(${-S}, 0)`).transition().duration(b).ease(_(h.transitionEase)).delay((c,d)=>c.groupIndex*L).attr("transform",`translate(${-S}, 0)`).attr("height",c=>Math.abs(c.axisYFromZero)).attr("d",c=>{const d=i(c.seriesLabel),e=p,t=c.axisY;return`M${d},${e} L${d+u/2},${t} ${d+u},${e}`}),A.exit().remove()}),T.selectAll(`g.${Y}`)}function Q({defsSelection:o,barData:s,params:p}){const a=o.selectAll("linearGradient").data(s[0]??[],l=>l.seriesLabel),i=a.enter().append("linearGradient").attr("x1","0%").attr("x2","0%").attr("y1","100%").attr("y2","0%").attr("spreadMethod","pad");a.merge(i).attr("id",(l,h)=>l.linearGradientId).html((l,h)=>`
        <stop offset="0%"   stop-color="${l.color}" stop-opacity="${p.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${l.color}" stop-opacity="${p.linearGradientOpacity[1]}"/>
      `),a.exit().remove()}function V({defsSelection:o,clipPathData:s}){const p=o.selectAll("clipPath").data(s),a=p.enter().append("clipPath");p.merge(a).attr("id",i=>i.id),p.exit().remove(),p.merge(a).each((i,l,h)=>{const u=C(h[l]).selectAll("rect").data([i]),L=u.enter().append("rect");u.merge(L).attr("x",0).attr("y",0).attr("width",b=>b.width).attr("height",b=>b.height),u.exit().remove()})}function v({selection:o,ids:s,fullChartParams:p}){o.interrupt("highlight");const a=()=>{o.transition("highlight").duration(200).style("opacity",1)};if(!s.length){a();return}o.each((i,l,h)=>{s.includes(i.id)?C(h[l]).style("opacity",1):C(h[l]).style("opacity",p.styles.unhighlightedOpacity)})}const re=R(B,Z)(({selection:o,name:s,subject:p,observer:a})=>{const i=new O,l=U(B,"clipPath-box"),h=o.append("g").attr("clip-path",`url(#${l})`),u=h.append("defs"),L=h.append("g"),b=new O;a.gridAxesTransform$.pipe(g(i),x(e=>e.value),f()).subscribe(e=>{h.style("transform",e)}),a.gridGraphicTransform$.pipe(g(i),y(async e=>e.value),f()).subscribe(e=>{L.transition().duration(50).style("transform",e)});const P=a.computedData$.pipe(x(e=>e[0]&&e[0][0]?e[0][0].axisY-e[0][0].axisYFromZero:0),f()),M=new N(e=>{I({computedData:a.computedData$,params:a.fullParams$,axisSize:a.gridAxesSize$}).pipe(y(async t=>t)).subscribe(t=>{const n=X({axisWidth:t.axisSize.width,groupAmount:t.computedData[0]?t.computedData[0].length:0,barAmountOfGroup:t.computedData.length,barPadding:t.params.barPadding,barGroupPadding:t.params.barGroupPadding});e.next(n)})}).pipe(g(i),f()),T=a.computedData$.pipe(g(i),x(e=>e.map((t,n)=>t[0]?t[0].seriesLabel:String(n)))),S=a.computedData$.pipe(g(i),x(e=>e[0]?e[0].map(t=>t.groupLabel):[])),z=new N(e=>{I({seriesLabels:T,barWidth:M,params:a.fullParams$}).pipe(g(i),y(async t=>t)).subscribe(t=>{const n=j(t.barWidth,t.seriesLabels,t.params);e.next(n)})}),m=a.fullChartParams$.pipe(g(i),x(e=>e.transitionDuration),f()),D=new N(e=>{I({groupLabels:S,transitionDuration:m}).pipe(y(async t=>t)).subscribe(t=>{const n=q(t.groupLabels.length,t.transitionDuration);e.next(n)})}).pipe(g(i),f()),k=new N(e=>{I({groupLabels:S,transitionDuration:m}).pipe(y(async t=>t)).subscribe(t=>{const n=J(t.groupLabels.length,t.transitionDuration);e.next(n)})}).pipe(g(i),f()),w=a.computedData$.pipe(g(i),x(e=>{const t=e.length,n=e.reduce(($,G)=>Math.max($,G.length),0),r=new Array(n).fill(null).map(()=>new Array(t).fill(null));for(let $=0;$<t;$++)for(let G=0;G<n;G++)r[G][$]=e[$][G];return r})).pipe(g(i),x(e=>{const t=e.length?e[0].map(n=>U(s,`lineargradient-${n.seriesLabel}`)):[];return e.map(n=>n.map((r,$)=>({linearGradientId:t[$],...r})))}));a.gridAxesSize$.pipe(g(i)).subscribe(e=>{const t=[{id:l,width:e.width,height:e.height}];V({defsSelection:u,clipPathData:t})});const c=a.fullChartParams$.pipe(g(i),x(e=>e.highlightTarget),f());I({barData:w,computedData:a.computedData$,zeroY:P,groupLabels:S,barScale:z,params:a.fullParams$,chartParams:a.fullChartParams$,highlightTarget:c,barWidth:M,delayGroup:D,transitionItem:k,SeriesDataMap:a.SeriesDataMap$,GroupDataMap:a.GroupDataMap$}).pipe(g(i),y(async e=>e)).subscribe(e=>{const t=K({selection:L,barData:e.barData,zeroY:e.zeroY,groupLabels:e.groupLabels,barScale:e.barScale,params:e.params,chartParams:e.chartParams,barWidth:e.barWidth,delayGroup:e.delayGroup,transitionItem:e.transitionItem});Q({defsSelection:u,barData:e.barData,params:e.params}),t.on("mouseover",(n,r)=>{n.stopPropagation(),p.event$.next({type:"grid",eventName:"mouseover",pluginName:s,highlightTarget:e.highlightTarget,datum:r,series:e.SeriesDataMap.get(r.seriesLabel),seriesIndex:r.seriesIndex,seriesLabel:r.seriesLabel,groups:e.GroupDataMap.get(r.groupLabel),groupIndex:r.groupIndex,groupLabel:r.groupLabel,event:n,data:e.computedData})}).on("mousemove",(n,r)=>{n.stopPropagation(),p.event$.next({type:"grid",eventName:"mousemove",pluginName:s,highlightTarget:e.highlightTarget,datum:r,series:e.SeriesDataMap.get(r.seriesLabel),seriesIndex:r.seriesIndex,seriesLabel:r.seriesLabel,groups:e.GroupDataMap.get(r.groupLabel),groupIndex:r.groupIndex,groupLabel:r.groupLabel,event:n,data:e.computedData})}).on("mouseout",(n,r)=>{n.stopPropagation(),p.event$.next({type:"grid",eventName:"mouseout",pluginName:s,highlightTarget:e.highlightTarget,datum:r,series:e.SeriesDataMap.get(r.seriesLabel),seriesIndex:r.seriesIndex,seriesLabel:r.seriesLabel,groups:e.GroupDataMap.get(r.groupLabel),groupIndex:r.groupIndex,groupLabel:r.groupLabel,event:n,data:e.computedData})}).on("click",(n,r)=>{n.stopPropagation(),p.event$.next({type:"grid",eventName:"click",pluginName:s,highlightTarget:e.highlightTarget,datum:r,series:e.SeriesDataMap.get(r.seriesLabel),seriesIndex:r.seriesIndex,seriesLabel:r.seriesLabel,groups:e.GroupDataMap.get(r.groupLabel),groupIndex:r.groupIndex,groupLabel:r.groupLabel,event:n,data:e.computedData})}),b.next(t)});const d=a.gridHighlight$.subscribe();return I({pathSelection:b,highlight:a.gridHighlight$,fullChartParams:a.fullChartParams$}).pipe(g(i),y(async e=>e)).subscribe(e=>{v({selection:e.pathSelection,ids:e.highlight,fullChartParams:e.fullChartParams})}),()=>{i.next(void 0),d.unsubscribe()}});export{re as B};