import{w as O,x as h,k as f,y as D,z as S,O as v,B as M,C as z,J as q}from"./BOl0c7Gx.js";import{o as K}from"./CAxiItTp.js";import{g as U,k as Q,b as R,n as V}from"./CXENxt6o.js";const H="BaseBarsTriangle",W=R(H,"g"),Y=R(H,"g-content"),_=.3;function ee({axisWidth:a,groupAmount:o,barAmountOfGroup:n,barPadding:i=0,barGroupPadding:l=0}){const p=(a/o-l)/n-i;return p>1?p:1}function te(a,o,n){const i=a/2,l=a*o.length+n.barPadding*o.length;return V().domain(o).range([-l/2+i,l/2-i])}function re(a,o){return a<=1?0:o/(a-1)*_}function ae(a,o){return a<=1?o:o*(1-_)}function se({selection:a,barData:o,zeroY:n,groupLabels:i,barScale:l,params:p,chartParams:u,barWidth:d,delayGroup:w,transitionItem:x}){const G=a.selectAll(`g.${W}`).data(o,(m,y)=>i[y]),I=G.enter().append("g").classed(W,!0).attr("cursor","pointer");G.exit().remove();const c=G.merge(I);I.attr("transform",(m,y)=>`translate(${m[0]?m[0].axisX:0}, 0)`),G.attr("transform",(m,y)=>`translate(${m[0]?m[0].axisX:0}, 0)`);const A=d/2;return c.each((m,y,k)=>{const B=z(k[y]).selectAll("g").data(m,g=>g.id),N=B.enter().append("g").classed(Y,!0);N.append("path").style("vector-effect","non-scaling-stroke").attr("height",g=>0).attr("d",g=>{const b=l(g.seriesLabel),$=n,P=$;return`M${b-d/2},${$} L${b},${P} ${b+d/2},${$}`}),B.merge(N).select("path").style("fill",g=>`url(#${g.linearGradientId})`).attr("stroke",g=>g.color).attr("transform",`translate(${-A}, 0)`).transition().duration(x).ease(Q(u.transitionEase)).delay((g,b)=>g.groupIndex*w).attr("transform",`translate(${-A}, 0)`).attr("height",g=>Math.abs(g.axisYFromZero)).attr("d",g=>{const b=l(g.seriesLabel),$=n,P=g.axisY;return`M${b},${$} L${b+d/2},${P} ${b+d},${$}`}),B.exit().remove()}),c.selectAll(`g.${Y}`)}function ie({defsSelection:a,barData:o,params:n}){const i=a.selectAll("linearGradient").data(o[0]??[],p=>p.seriesLabel),l=i.enter().append("linearGradient").attr("x1","0%").attr("x2","0%").attr("y1","100%").attr("y2","0%").attr("spreadMethod","pad");i.merge(l).attr("id",(p,u)=>p.linearGradientId).html((p,u)=>`
        <stop offset="0%"   stop-color="${p.color}" stop-opacity="${n.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${p.color}" stop-opacity="${n.linearGradientOpacity[1]}"/>
      `),i.exit().remove()}function ne({defsSelection:a,clipPathData:o}){const n=a.selectAll("clipPath").data(o),i=n.enter().append("clipPath");n.merge(i).attr("id",l=>l.id),n.exit().remove(),n.merge(i).each((l,p,u)=>{const d=z(u[p]).selectAll("rect").data([l]),w=d.enter().append("rect");d.merge(w).attr("x",0).attr("y",0).attr("width",x=>x.width).attr("height",x=>x.height),d.exit().remove()})}function oe({selection:a,ids:o,fullChartParams:n}){a.interrupt("highlight");const i=()=>{a.transition("highlight").duration(200).style("opacity",1)};if(!o.length){i();return}a.each((l,p,u)=>{o.includes(l.id)?z(u[p]).style("opacity",1):z(u[p]).style("opacity",n.styles.unhighlightedOpacity)})}const pe=(a,{selection:o,computedData$:n,SeriesDataMap$:i,GroupDataMap$:l,fullParams$:p,fullChartParams$:u,gridAxesTransform$:d,gridGraphicTransform$:w,gridAxesSize$:x,gridHighlight$:G,event$:I})=>{const c=new O,A=U(a,"clipPath-box"),C=o.append("g").attr("clip-path",`url(#${A})`),m=C.append("defs"),y=C.append("g"),k=new O;d.pipe(h(c),f(e=>e.value),D()).subscribe(e=>{C.style("transform",e)}),w.pipe(h(c),S(async e=>e.value),D()).subscribe(e=>{y.transition().duration(50).style("transform",e)});const B=n.pipe(f(e=>e[0]&&e[0][0]?e[0][0].axisY-e[0][0].axisYFromZero:0),D()),N=new v(e=>{M({computedData:n,params:p,axisSize:x}).pipe(S(async t=>t)).subscribe(t=>{const s=ee({axisWidth:t.axisSize.width,groupAmount:t.computedData[0]?t.computedData[0].length:0,barAmountOfGroup:t.computedData.length,barPadding:t.params.barPadding,barGroupPadding:t.params.barGroupPadding});e.next(s)})}).pipe(h(c),D()),g=n.pipe(h(c),f(e=>e.map((t,s)=>t[0]?t[0].seriesLabel:String(s)))),b=n.pipe(h(c),f(e=>e[0]?e[0].map(t=>t.groupLabel):[])),$=new v(e=>{M({seriesLabels:g,barWidth:N,params:p}).pipe(h(c),S(async t=>t)).subscribe(t=>{const s=te(t.barWidth,t.seriesLabels,t.params);e.next(s)})}),P=u.pipe(h(c),f(e=>e.transitionDuration),D()),F=new v(e=>{M({groupLabels:b,transitionDuration:P}).pipe(S(async t=>t)).subscribe(t=>{const s=re(t.groupLabels.length,t.transitionDuration);e.next(s)})}).pipe(h(c),D()),j=new v(e=>{M({groupLabels:b,transitionDuration:P}).pipe(S(async t=>t)).subscribe(t=>{const s=ae(t.groupLabels.length,t.transitionDuration);e.next(s)})}).pipe(h(c),D()),J=n.pipe(h(c),f(e=>{const t=e.length,s=e.reduce((L,T)=>Math.max(L,T.length),0),r=new Array(s).fill(null).map(()=>new Array(t).fill(null));for(let L=0;L<t;L++)for(let T=0;T<s;T++)r[T][L]=e[L][T];return r})).pipe(h(c),f(e=>{const t=e.length?e[0].map(s=>U(a,`lineargradient-${s.seriesLabel}`)):[];return e.map(s=>s.map((r,L)=>({linearGradientId:t[L],...r})))}));x.pipe(h(c)).subscribe(e=>{const t=[{id:A,width:e.width,height:e.height}];ne({defsSelection:m,clipPathData:t})});const X=u.pipe(h(c),f(e=>e.highlightTarget),D());M({barData:J,computedData:n,zeroY:B,groupLabels:b,barScale:$,params:p,chartParams:u,highlightTarget:X,barWidth:N,delayGroup:F,transitionItem:j,SeriesDataMap:i,GroupDataMap:l}).pipe(h(c),S(async e=>e)).subscribe(e=>{const t=se({selection:y,barData:e.barData,zeroY:e.zeroY,groupLabels:e.groupLabels,barScale:e.barScale,params:e.params,chartParams:e.chartParams,barWidth:e.barWidth,delayGroup:e.delayGroup,transitionItem:e.transitionItem});ie({defsSelection:m,barData:e.barData,params:e.params}),t.on("mouseover",(s,r)=>{s.stopPropagation(),I.next({type:"grid",eventName:"mouseover",pluginName:a,highlightTarget:e.highlightTarget,datum:r,series:e.SeriesDataMap.get(r.seriesLabel),seriesIndex:r.seriesIndex,seriesLabel:r.seriesLabel,groups:e.GroupDataMap.get(r.groupLabel),groupIndex:r.groupIndex,groupLabel:r.groupLabel,event:s,data:e.computedData})}).on("mousemove",(s,r)=>{s.stopPropagation(),I.next({type:"grid",eventName:"mousemove",pluginName:a,highlightTarget:e.highlightTarget,datum:r,series:e.SeriesDataMap.get(r.seriesLabel),seriesIndex:r.seriesIndex,seriesLabel:r.seriesLabel,groups:e.GroupDataMap.get(r.groupLabel),groupIndex:r.groupIndex,groupLabel:r.groupLabel,event:s,data:e.computedData})}).on("mouseout",(s,r)=>{s.stopPropagation(),I.next({type:"grid",eventName:"mouseout",pluginName:a,highlightTarget:e.highlightTarget,datum:r,series:e.SeriesDataMap.get(r.seriesLabel),seriesIndex:r.seriesIndex,seriesLabel:r.seriesLabel,groups:e.GroupDataMap.get(r.groupLabel),groupIndex:r.groupIndex,groupLabel:r.groupLabel,event:s,data:e.computedData})}).on("click",(s,r)=>{s.stopPropagation(),I.next({type:"grid",eventName:"click",pluginName:a,highlightTarget:e.highlightTarget,datum:r,series:e.SeriesDataMap.get(r.seriesLabel),seriesIndex:r.seriesIndex,seriesLabel:r.seriesLabel,groups:e.GroupDataMap.get(r.groupLabel),groupIndex:r.groupIndex,groupLabel:r.groupLabel,event:s,data:e.computedData})}),k.next(t)});const Z=G.subscribe();return M({pathSelection:k,highlight:G,fullChartParams:u}).pipe(h(c),S(async e=>e)).subscribe(e=>{oe({selection:e.pathSelection,ids:e.highlight,fullChartParams:e.fullChartParams})}),()=>{c.next(void 0),Z.unsubscribe()}},E="BarsTriangle",ue=q(E,K)(({selection:a,name:o,subject:n,observer:i})=>{const l=new O,p=pe(E,{selection:a,computedData$:i.computedData$,SeriesDataMap$:i.SeriesDataMap$,GroupDataMap$:i.GroupDataMap$,fullParams$:i.fullParams$,fullChartParams$:i.fullChartParams$,gridAxesTransform$:i.gridAxesTransform$,gridGraphicTransform$:i.gridGraphicTransform$,gridAxesSize$:i.gridAxesSize$,gridHighlight$:i.gridHighlight$,event$:n.event$});return()=>{l.next(void 0),p()}});export{ue as B};
