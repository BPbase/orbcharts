import{n as Vt,u as jt,q as Yt,o as Wt,c as Zt}from"./BqFiurre.js";import{E as qt,D as Kt,f as Gt,a as Jt,S as H}from"./6pnb_YvY.js";import{D as Qt,a as te,b as ee,c as ae,d as ie,G as E,e as b}from"./Bz_gD2gR.js";import{c as Tt,i as it,a as z,m as P,o as re,b as ne,d as se,_ as oe,f as le,O as B,p as ue,g as pe,h as ce,Z,S as G,t as d,j as O,s as $,k as S,l as M,U as wt,n as zt,q as ge,K as Bt}from"./kGF9pzg7.js";import{g as me,f as ct,L as j}from"./DZ_DEq_Z.js";import{P as St,a as he,b as fe,c as xe,d as de,B as U,e as q,f as K,g as J,h as Ae,i as ye,j as De,k as $e,l as Te,m as Se}from"./CiyVAjJr.js";import{B as nt}from"./zo73p1Xa.js";import{B as st}from"./Bl46CmwT.js";import{g as Pe,a as gt,b as I,c as F,d as Le,p as rt,e as Ut,f as Ee,h as be,m as _e,i as Re,j as Pt,k as Fe,l as Lt}from"./B7hZ1RX6.js";import{B as Et}from"./Vlst94YD.js";import{m as Ie,S as X,P as Q}from"./3YCUX76b.js";function ve(o,i,e,n,r,g,u,m){var l=[],c=0,h=0,a=!1,t=function(){a&&!l.length&&!c&&i.complete()},p=function(x){return c<n?s(x):l.push(x)},s=function(x){c++;var A=!1;it(e(x,h++)).subscribe(Tt(i,function(f){i.next(f)},function(){A=!0},void 0,function(){if(A)try{c--;for(var f=function(){var y=l.shift();u||s(y)};l.length&&c<n;)f();t()}catch(y){i.error(y)}}))};return o.subscribe(Tt(i,p,function(){a=!0,t()})),function(){}}function dt(o,i,e){return e===void 0&&(e=1/0),z(i)?dt(function(n,r){return P(function(g,u){return i(n,g,r,u)})(it(o(n,r)))},e):(typeof i=="number"&&(e=i),re(function(n,r){return ve(n,r,o,e)}))}function ke(o){return o===void 0&&(o=1/0),dt(ne,o)}var Ne=["addListener","removeListener"],Ce=["addEventListener","removeEventListener"],Oe=["on","off"];function mt(o,i,e,n){if(z(e)&&(n=e,e=void 0),n)return mt(o,i,e).pipe(se(n));var r=oe(we(o)?Ce.map(function(m){return function(l){return o[m](i,l,e)}}):Me(o)?Ne.map(bt(o,i)):Ge(o)?Oe.map(bt(o,i)):[],2),g=r[0],u=r[1];if(!g&&le(o))return dt(function(m){return mt(m,i,e)})(it(o));if(!g)throw new TypeError("Invalid event target");return new B(function(m){var l=function(){for(var c=[],h=0;h<arguments.length;h++)c[h]=arguments[h];return m.next(1<c.length?c:c[0])};return g(l),function(){return u(l)}})}function bt(o,i){return function(e){return function(n){return o[e](i,n)}}}function Me(o){return z(o.addListener)&&z(o.removeListener)}function Ge(o){return z(o.on)&&z(o.off)}function we(o){return z(o.addEventListener)&&z(o.removeEventListener)}function ht(){for(var o=[],i=0;i<arguments.length;i++)o[i]=arguments[i];var e=ue(o),n=pe(o,1/0),r=o;return r.length?r.length===1?it(r[0]):ke(n)(ce(r,e)):qt}const at="Dots",ze=I(at,"g"),Be=I(at,"circle");function Ue({selection:o,data:i,fullParams:e,fullChartParams:n,graphicOppositeScale:r}){const g=l=>{const c=l.size();return n.transitionDuration/c};let u=0;return o.selectAll("g").data(i,l=>l.id).join(l=>(u=g(l),l.append("g").classed(ze,!0)),l=>l,l=>l.remove()).attr("transform",l=>`translate(${l.axisX}, ${l.axisY})`).each((l,c,h)=>{M(h[c]).selectAll("circle").data([l]).join(a=>a.append("circle").style("cursor","pointer").style("vector-effect","non-scaling-stroke").classed(Be,!0).attr("opacity",0).transition().delay((t,p)=>c*u).attr("opacity",1),a=>a.transition().duration(50).attr("opacity",1),a=>a.remove()).attr("r",e.radius).attr("fill",(a,t)=>gt({datum:a,colorType:e.fillColorType,fullChartParams:n})).attr("stroke",(a,t)=>gt({datum:a,colorType:e.strokeColorType,fullChartParams:n})).attr("stroke-width",e.strokeWidth).attr("transform",`scale(${r[0]}, ${r[1]})`)})}function He({selection:o,ids:i,onlyShowHighlighted:e,fullChartParams:n}){if(o.interrupt("highlight"),!i.length){o.transition("highlight").duration(200).style("opacity",e===!0?0:1);return}o.each((r,g,u)=>{i.includes(r.id)?M(u[g]).style("opacity",1).transition("highlight").duration(200):M(u[g]).style("opacity",e===!0?0:n.styles.unhighlightedOpacity).transition("highlight").duration(200)})}function Xe({defsSelection:o,clipPathData:i}){o.selectAll("clipPath").data(i).join(e=>e.append("clipPath"),e=>e,e=>e.remove()).attr("id",e=>e.id).each((e,n,r)=>{M(r[n]).selectAll("rect").data([e]).join("rect").attr("x",0).attr("y",0).attr("width",g=>g.width).attr("height",g=>g.height)})}const Y=Z(at,Qt)(({selection:o,name:i,subject:e,observer:n})=>{const r=new G,g=Pe(at,"clipPath-box"),u=o.append("g").attr("clip-path",`url(#${g})`),m=u.append("defs"),l=u.append("g"),c=new G;n.gridAxesTransform$.pipe(d(r),P(s=>s.value),O()).subscribe(s=>{u.style("transform",s)}),n.gridGraphicTransform$.pipe(d(r),$(async s=>s.value),O()).subscribe(s=>{l.transition().duration(50).style("transform",s)});const h=n.gridGraphicTransform$.pipe(d(r),P(s=>[1/s.scale[0],1/s.scale[1]]));n.gridAxesSize$.pipe(d(r),$(async s=>s)).subscribe(s=>{const x=[{id:g,width:s.width,height:s.height}];Xe({defsSelection:m,clipPathData:x})});const a=n.fullChartParams$.pipe(d(r),P(s=>s.highlightTarget),O());S({computedData:n.computedData$,visibleComputedData:n.visibleComputedData$,SeriesDataMap:n.SeriesDataMap$,GroupDataMap:n.GroupDataMap$,graphicOppositeScale:h,fullChartParams:n.fullChartParams$,fullParams:n.fullParams$,highlightTarget:a}).pipe(d(r),$(async s=>s)).subscribe(s=>{const x=Ue({selection:l,data:s.visibleComputedData.flat(),fullParams:s.fullParams,fullChartParams:s.fullChartParams,graphicOppositeScale:s.graphicOppositeScale});x.on("mouseover",(A,f)=>{A.stopPropagation(),e.event$.next({type:"grid",eventName:"mouseover",pluginName:i,highlightTarget:s.highlightTarget,datum:f,series:s.SeriesDataMap.get(f.seriesLabel),seriesIndex:f.seriesIndex,seriesLabel:f.seriesLabel,groups:s.GroupDataMap.get(f.groupLabel),groupIndex:f.groupIndex,groupLabel:f.groupLabel,event:A,data:s.computedData})}).on("mousemove",(A,f)=>{A.stopPropagation(),e.event$.next({type:"grid",eventName:"mousemove",pluginName:i,highlightTarget:s.highlightTarget,data:s.computedData,datum:f,series:s.SeriesDataMap.get(f.seriesLabel),seriesIndex:f.seriesIndex,seriesLabel:f.seriesLabel,groups:s.GroupDataMap.get(f.groupLabel),groupIndex:f.groupIndex,groupLabel:f.groupLabel,event:A})}).on("mouseout",(A,f)=>{A.stopPropagation(),e.event$.next({type:"grid",eventName:"mouseout",pluginName:i,highlightTarget:s.highlightTarget,datum:f,series:s.SeriesDataMap.get(f.seriesLabel),seriesIndex:f.seriesIndex,seriesLabel:f.seriesLabel,groups:s.GroupDataMap.get(f.groupLabel),groupIndex:f.groupIndex,groupLabel:f.groupLabel,event:A,data:s.computedData})}).on("click",(A,f)=>{A.stopPropagation(),e.event$.next({type:"grid",eventName:"click",pluginName:i,highlightTarget:s.highlightTarget,datum:f,series:s.SeriesDataMap.get(f.seriesLabel),seriesIndex:f.seriesIndex,seriesLabel:f.seriesLabel,groups:s.GroupDataMap.get(f.groupLabel),groupIndex:f.groupIndex,groupLabel:f.groupLabel,event:A,data:s.computedData})}),c.next(x)});const t=n.gridHighlight$.subscribe(),p=n.fullParams$.pipe(d(r),P(s=>s.onlyShowHighlighted),O());return n.fullChartParams$.pipe(d(r),$(s=>S({graphicSelection:c,highlight:n.gridHighlight$,onlyShowHighlighted:p,fullChartParams:n.fullChartParams$}).pipe(d(r),$(async x=>x)))).subscribe(s=>{He({selection:s.graphicSelection,ids:s.highlight,onlyShowHighlighted:s.onlyShowHighlighted,fullChartParams:s.fullChartParams})}),()=>{t.unsubscribe(),r.next(void 0)}}),At="GroupAxis",_t=I(At,"xAxis"),Rt=I(At,"groupingLabel"),ot=6;function Ve({selection:o,params:i,tickTextAlign:e,axisLabelAlign:n,gridAxesSize:r,fullDataFormatter:g,chartParams:u,groupScale:m,contentTransform:l}){const c=o.selectAll(`g.${_t}`).data([i]).join("g").classed(_t,!0);o.selectAll(`g.${Rt}`).data([i]).join("g").classed(Rt,!0).each((t,p,s)=>{M(s[p]).selectAll("text").data([t]).join(x=>x.append("text").style("font-weight","bold"),x=>x,x=>x.remove()).attr("text-anchor",n.textAnchor).attr("dominant-baseline",n.dominantBaseline).style("font-size",`${u.styles.textSize}px`).style("fill",F(i.labelColorType,u)).style("transform",l).text(x=>g.groupAxis.label)}).attr("transform",t=>`translate(${r.width+t.tickPadding+i.labelOffset[0]}, ${-t.tickPadding-ot-i.labelOffset[1]})`);const h=Le(m).scale(m).tickSize(i.tickFullLine==!0?-r.height:ot).tickSizeOuter(0).tickFormat(t=>rt(t,i.tickFormat)).tickPadding(i.tickPadding),a=c.transition().duration(100).call(h);return a.selectAll("line").style("fill","none").style("stroke",i.tickLineVisible==!0?F(i.tickColorType,u):"none").style("stroke-dasharray",i.tickFullLineDasharray).attr("pointer-events","none"),a.selectAll("path").style("fill","none").style("stroke",i.axisLineVisible==!0?F(i.axisLineColorType,u):"none").style("shape-rendering","crispEdges"),c.selectAll("text").style("font-family","sans-serif").style("font-size",`${u.styles.textSize}px`).style("color",F(i.tickTextColorType,u)).attr("text-anchor",e.textAnchor).attr("dominant-baseline",e.dominantBaseline).attr("transform-origin",`0 -${i.tickPadding+ot}`).style("transform",l),c}const _=Z(At,te)(({selection:o,name:i,observer:e,subject:n})=>{const r=new G,g=o.append("g");e.gridAxesTransform$.pipe(d(r),P(h=>h.value),O()).subscribe(h=>{g.style("transform",h).attr("opacity",0).transition().attr("opacity",1)});const u=S({fullParams:e.fullParams$,gridAxesOppositeTransform:e.gridAxesOppositeTransform$}).pipe(d(r),$(async h=>{const a=h.gridAxesOppositeTransform.rotate+h.fullParams.tickTextRotate;return`translate(${h.gridAxesOppositeTransform.translate[0]}px, ${h.gridAxesOppositeTransform.translate[1]}px) rotate(${a}deg) rotateX(${h.gridAxesOppositeTransform.rotateX}deg) rotateY(${h.gridAxesOppositeTransform.rotateY}deg)`}),O()),m=new B(h=>{S({fullDataFormatter:e.fullDataFormatter$,gridAxesSize:e.gridAxesSize$,computedData:e.computedData$}).pipe(d(r),$(async a=>a)).subscribe(a=>{const p=a.computedData[0]?a.computedData[0].length-1:0,s=a.fullDataFormatter.groupAxis.scaleDomain[0]==="auto"?0-a.fullDataFormatter.groupAxis.scalePadding:a.fullDataFormatter.groupAxis.scaleDomain[0]-a.fullDataFormatter.groupAxis.scalePadding,x=a.fullDataFormatter.groupAxis.scaleDomain[1]==="auto"?p+a.fullDataFormatter.groupAxis.scalePadding:a.fullDataFormatter.groupAxis.scaleDomain[1]+a.fullDataFormatter.groupAxis.scalePadding,A=a.computedData[0]?a.computedData[0].length:0;let f=a.fullDataFormatter.grid.seriesType==="row"?(a.computedData[0]??[]).map(N=>N.groupLabel):a.computedData.map(N=>N[0].groupLabel);const y=new Array(A).fill(0).map((N,v)=>f[v]!=null?f[v]:String(v)).filter((N,v)=>v>=s&&v<=x),L=a.fullDataFormatter.groupAxis.scalePadding,D=wt({axisLabels:y,axisWidth:a.gridAxesSize.width,padding:L});h.next(D)})}),l=e.fullDataFormatter$.pipe(d(r),P(h=>{let a="middle",t="hanging";return h.groupAxis.position==="bottom"?(a="middle",t="hanging"):h.groupAxis.position==="top"?(a="middle",t="auto"):h.groupAxis.position==="left"?(a="end",t="middle"):h.groupAxis.position==="right"&&(a="start",t="middle"),{textAnchor:a,dominantBaseline:t}})),c=e.fullDataFormatter$.pipe(d(r),P(h=>{let a="start",t="hanging";return h.groupAxis.position==="bottom"?t="hanging":h.groupAxis.position==="top"?t="auto":h.groupAxis.position==="left"?a="end":h.groupAxis.position==="right"&&(a="start"),h.valueAxis.position==="left"?a="start":h.valueAxis.position==="right"?a="end":h.valueAxis.position==="bottom"?t="auto":h.valueAxis.position==="top"&&(t="hanging"),{textAnchor:a,dominantBaseline:t}}));return S({params:e.fullParams$,tickTextAlign:l,axisLabelAlign:c,gridAxesSize:e.gridAxesSize$,fullDataFormatter:e.fullDataFormatter$,chartParams:e.fullChartParams$,groupScale:m,contentTransform:u}).pipe(d(r),$(async h=>h)).subscribe(h=>{Ve({selection:g,params:h.params,tickTextAlign:h.tickTextAlign,axisLabelAlign:h.axisLabelAlign,gridAxesSize:h.gridAxesSize,fullDataFormatter:h.fullDataFormatter,chartParams:h.chartParams,groupScale:h.groupScale,contentTransform:h.contentTransform})}),()=>{r.next(void 0)}}),yt="ValueAxis",Ft=I(yt,"g"),It=I(yt,"text"),vt=6;function je({selection:o,fullParams:i,tickTextAlign:e,axisLabelAlign:n,gridAxesSize:r,fullDataFormatter:g,fullChartParams:u,valueScale:m,contentTransform:l,minAndMax:c}){const h=o.selectAll(`g.${Ft}`).data([i]).join("g").classed(Ft,!0);o.selectAll(`g.${It}`).data([i]).join("g").classed(It,!0).each((x,A,f)=>{M(f[A]).selectAll("text").data([x]).join(y=>y.append("text").style("font-weight","bold"),y=>y,y=>y.remove()).attr("text-anchor",n.textAnchor).attr("dominant-baseline",n.dominantBaseline).style("font-size",`${u.styles.textSize}px`).style("fill",F(i.labelColorType,u)).style("transform",l).text(y=>g.valueAxis.label)}).attr("transform",x=>`translate(${-x.tickPadding+i.labelOffset[0]}, ${r.height+x.tickPadding+i.labelOffset[1]})`);const a=c[1]-c[0],t=Ut(m).scale(m).ticks(a>i.ticks?i.ticks:c[0]===0&&c[1]===0?1:Math.ceil(a)).tickFormat(x=>rt(x,i.tickFormat)).tickSize(i.tickFullLine==!0?-r.width:vt).tickPadding(i.tickPadding),p=h.transition().duration(100).call(t);return p.selectAll("line").style("fill","none").style("stroke",i.tickLineVisible==!0?F(i.tickColorType,u):"none").style("stroke-dasharray",i.tickFullLineDasharray).attr("pointer-events","none"),p.selectAll("path").style("fill","none").style("stroke",i.axisLineVisible==!0?F(i.axisLineColorType,u):"none").style("shape-rendering","crispEdges"),h.selectAll("text").style("font-family","sans-serif").style("font-size",`${u.styles.textSize}px`).style("color",F(i.tickTextColorType,u)).attr("text-anchor",e.textAnchor).attr("dominant-baseline",e.dominantBaseline).attr("transform-origin",`-${i.tickPadding+vt} 0`).style("transform",l),h}const k=Z(yt,ee)(({selection:o,name:i,observer:e,subject:n})=>{const r=new G,g=o.append("g");e.gridAxesTransform$.pipe(d(r),P(a=>a.value),O()).subscribe(a=>{g.style("transform",a).attr("opacity",0).transition().attr("opacity",1)});const u=S({fullParams:e.fullParams$,gridAxesOppositeTransform:e.gridAxesOppositeTransform$}).pipe(d(r),$(async a=>{const t=a.gridAxesOppositeTransform.rotate+a.fullParams.tickTextRotate;return`translate(${a.gridAxesOppositeTransform.translate[0]}px, ${a.gridAxesOppositeTransform.translate[1]}px) rotate(${t}deg) rotateX(${a.gridAxesOppositeTransform.rotateX}deg) rotateY(${a.gridAxesOppositeTransform.rotateY}deg)`}),O()),m=new B(a=>{S({fullDataFormatter:e.fullDataFormatter$,gridAxesSize:e.gridAxesSize$,computedData:e.computedData$}).pipe(d(r),$(async t=>t)).subscribe(t=>{const s=t.computedData[0]?t.computedData[0].length-1:0,x=t.fullDataFormatter.groupAxis.scaleDomain[0]==="auto"?0-t.fullDataFormatter.groupAxis.scalePadding:t.fullDataFormatter.groupAxis.scaleDomain[0]-t.fullDataFormatter.groupAxis.scalePadding,A=t.fullDataFormatter.groupAxis.scaleDomain[1]==="auto"?s+t.fullDataFormatter.groupAxis.scalePadding:t.fullDataFormatter.groupAxis.scaleDomain[1]+t.fullDataFormatter.groupAxis.scalePadding,f=t.computedData.map((L,D)=>L.filter((N,v)=>v>=x&&v<=A)),y=Ee(f.flat());a.next(y)})}),l=new B(a=>{S({fullDataFormatter:e.fullDataFormatter$,gridAxesSize:e.gridAxesSize$,minAndMax:m}).pipe(d(r),$(async t=>t)).subscribe(t=>{const p=zt({maxValue:t.minAndMax[1],minValue:t.minAndMax[0],axisWidth:t.gridAxesSize.height,scaleDomain:t.fullDataFormatter.valueAxis.scaleDomain,scaleRange:t.fullDataFormatter.valueAxis.scaleRange});a.next(p)})}),c=e.fullDataFormatter$.pipe(d(r),P(a=>{let t="start",p="hanging";return a.valueAxis.position==="left"?(t="end",p="middle"):a.valueAxis.position==="right"?(t="start",p="middle"):a.valueAxis.position==="bottom"?(t="middle",p="hanging"):a.valueAxis.position==="top"&&(t="middle",p="auto"),{textAnchor:t,dominantBaseline:p}})),h=e.fullDataFormatter$.pipe(d(r),P(a=>{let t="start",p="hanging";return a.groupAxis.position==="bottom"?p="auto":a.groupAxis.position==="top"?p="hanging":a.groupAxis.position==="left"?t="start":a.groupAxis.position==="right"&&(t="end"),a.valueAxis.position==="left"?t="end":a.valueAxis.position==="right"?t="start":a.valueAxis.position==="bottom"?p="hanging":a.valueAxis.position==="top"&&(p="auto"),{textAnchor:t,dominantBaseline:p}}));return S({fullParams:e.fullParams$,tickTextAlign:c,axisLabelAlign:h,computedData:e.computedData$,gridAxesSize:e.gridAxesSize$,fullDataFormatter:e.fullDataFormatter$,fullChartParams:e.fullChartParams$,valueScale:l,contentTransform:u,minAndMax:m}).pipe(d(r),$(async a=>a)).subscribe(a=>{je({selection:g,fullParams:a.fullParams,tickTextAlign:a.tickTextAlign,axisLabelAlign:a.axisLabelAlign,gridAxesSize:a.gridAxesSize,fullDataFormatter:a.fullDataFormatter,fullChartParams:a.fullChartParams,valueScale:a.valueScale,contentTransform:a.contentTransform,minAndMax:a.minAndMax})}),()=>{r.next(void 0)}}),Dt="ValueStackAxis",kt=I(Dt,"g"),Nt=I(Dt,"text"),Ct=6;function Ye({selection:o,fullParams:i,tickTextAlign:e,axisLabelAlign:n,gridAxesSize:r,fullDataFormatter:g,fullChartParams:u,valueScale:m,contentTransform:l,minAndMax:c}){const h=o.selectAll(`g.${kt}`).data([i]).join("g").classed(kt,!0);o.selectAll(`g.${Nt}`).data([i]).join("g").classed(Nt,!0).each((x,A,f)=>{M(f[A]).selectAll("text").data([x]).join(y=>y.append("text").style("font-weight","bold"),y=>y,y=>y.remove()).attr("text-anchor",n.textAnchor).attr("dominant-baseline",n.dominantBaseline).style("font-size",`${u.styles.textSize}px`).style("fill",F(i.labelColorType,u)).style("transform",l).text(y=>g.valueAxis.label)}).attr("transform",x=>`translate(${-x.tickPadding+i.labelOffset[0]}, ${r.height+x.tickPadding+i.labelOffset[1]})`);const a=c[1]-c[0],t=Ut(m).scale(m).ticks(a>i.ticks?i.ticks:c[0]===0&&c[1]===0?1:Math.ceil(a)).tickFormat(x=>rt(x,i.tickFormat)).tickSize(i.tickFullLine==!0?-r.width:Ct).tickPadding(i.tickPadding),p=h.transition().duration(100).call(t);return p.selectAll("line").style("fill","none").style("stroke",i.tickLineVisible==!0?F(i.tickColorType,u):"none").style("stroke-dasharray",i.tickFullLineDasharray).attr("pointer-events","none"),p.selectAll("path").style("fill","none").style("stroke",i.axisLineVisible==!0?F(i.axisLineColorType,u):"none").style("shape-rendering","crispEdges"),h.selectAll("text").style("font-family","sans-serif").style("font-size",`${u.styles.textSize}px`).style("color",F(i.tickTextColorType,u)).attr("text-anchor",e.textAnchor).attr("dominant-baseline",e.dominantBaseline).attr("transform-origin",`-${i.tickPadding+Ct} 0`).style("transform",l),h}const lt=Z(Dt,ae)(({selection:o,name:i,observer:e,subject:n})=>{const r=new G,g=o.append("g");e.gridAxesTransform$.pipe(d(r),P(a=>a.value),O()).subscribe(a=>{g.style("transform",a).attr("opacity",0).transition().attr("opacity",1)});const u=S({fullParams:e.fullParams$,gridAxesOppositeTransform:e.gridAxesOppositeTransform$}).pipe(d(r),$(async a=>{const t=a.gridAxesOppositeTransform.rotate+a.fullParams.tickTextRotate;return`translate(${a.gridAxesOppositeTransform.translate[0]}px, ${a.gridAxesOppositeTransform.translate[1]}px) rotate(${t}deg) rotateX(${a.gridAxesOppositeTransform.rotateX}deg) rotateY(${a.gridAxesOppositeTransform.rotateY}deg)`}),O()),m=new B(a=>{S({fullDataFormatter:e.fullDataFormatter$,gridAxesSize:e.gridAxesSize$,computedData:e.computedData$}).pipe(d(r),$(async t=>t)).subscribe(t=>{const s=t.computedData[0]?t.computedData[0].length-1:0,x=t.fullDataFormatter.groupAxis.scaleDomain[0]==="auto"?0-t.fullDataFormatter.groupAxis.scalePadding:t.fullDataFormatter.groupAxis.scaleDomain[0]-t.fullDataFormatter.groupAxis.scalePadding,A=t.fullDataFormatter.groupAxis.scaleDomain[1]==="auto"?s+t.fullDataFormatter.groupAxis.scalePadding:t.fullDataFormatter.groupAxis.scaleDomain[1]+t.fullDataFormatter.groupAxis.scalePadding,f=t.computedData.map((D,N)=>D.filter((v,C)=>C>=x&&C<=A)),y=new Array(f[0]?f[0].length:0).fill(null).map((D,N)=>f.reduce((v,C)=>{if(C&&C[N]){const w=C[N].value==null||C[N].visible==!1?0:C[N].value;return v+w}return v},0)),L=be(y);a.next(L)})}),l=new B(a=>{S({fullDataFormatter:e.fullDataFormatter$,gridAxesSize:e.gridAxesSize$,minAndMax:m}).pipe(d(r),$(async t=>t)).subscribe(t=>{const p=zt({maxValue:t.minAndMax[1],minValue:t.minAndMax[0],axisWidth:t.gridAxesSize.height,scaleDomain:t.fullDataFormatter.valueAxis.scaleDomain,scaleRange:t.fullDataFormatter.valueAxis.scaleRange});a.next(p)})}),c=e.fullDataFormatter$.pipe(d(r),P(a=>{let t="start",p="hanging";return a.valueAxis.position==="left"?(t="end",p="middle"):a.valueAxis.position==="right"?(t="start",p="middle"):a.valueAxis.position==="bottom"?(t="middle",p="hanging"):a.valueAxis.position==="top"&&(t="middle",p="auto"),{textAnchor:t,dominantBaseline:p}})),h=e.fullDataFormatter$.pipe(d(r),P(a=>{let t="start",p="hanging";return a.groupAxis.position==="bottom"?p="auto":a.groupAxis.position==="top"?p="hanging":a.groupAxis.position==="left"?t="start":a.groupAxis.position==="right"&&(t="end"),a.valueAxis.position==="left"?t="end":a.valueAxis.position==="right"?t="start":a.valueAxis.position==="bottom"?p="hanging":a.valueAxis.position==="top"&&(p="auto"),{textAnchor:t,dominantBaseline:p}}));return S({fullParams:e.fullParams$,tickTextAlign:c,axisLabelAlign:h,computedData:e.computedData$,gridAxesSize:e.gridAxesSize$,fullDataFormatter:e.fullDataFormatter$,fullChartParams:e.fullChartParams$,valueScale:l,contentTransform:u,minAndMax:m}).pipe(d(r),$(async a=>a)).subscribe(a=>{Ye({selection:g,fullParams:a.fullParams,tickTextAlign:a.tickTextAlign,axisLabelAlign:a.axisLabelAlign,gridAxesSize:a.gridAxesSize,fullDataFormatter:a.fullDataFormatter,fullChartParams:a.fullChartParams,valueScale:a.valueScale,contentTransform:a.contentTransform,minAndMax:a.minAndMax})}),()=>{r.next(void 0)}});function We(o,i){let e=new B(()=>{});return o.each(function(){const n=mt(this,i);e=ht(e,n)}),e}const ft="GroupArea",xt=I(ft,"label-box");function Ze({groupLabel:o,axisX:i,axisHeight:e,fullParams:n}){return n.showLine&&o?[{id:o,x1:i,x2:i,y1:0,y2:e}]:[]}function qe({selection:o,pluginName:i,lineData:e,fullParams:n,fullChartParams:r}){const g=I(i,"auxline"),u=o.selectAll(`line.${g}`).data(e),m=u.enter().append("line").classed(g,!0).style("stroke",c=>F(n.lineColorType,r)).style("stroke-width",1).style("stroke-dasharray",n.lineDashArray??"none").style("pointer-events","none"),l=u.merge(m);return u.exit().remove(),m.attr("x1",c=>c.x1).attr("y1",c=>c.y1).attr("x2",c=>c.x2).attr("y2",c=>c.y2),u.transition().duration(50).attr("x1",c=>c.x1).attr("y1",c=>c.y1).attr("x2",c=>c.x2).attr("y2",c=>c.y2),l}function Ke(o){o.selectAll("line").data([]).exit().remove()}function Je({groupLabel:o,axisX:i,fullParams:e}){return e.showLabel&&o?[{id:o,x:i,y:-e.labelPadding,text:rt(o,e.labelTextFormat)}]:[]}function Qe({selection:o,labelData:i,fullParams:e,fullChartParams:n,gridAxesOppositeTransformValue:r}){const g=n.styles.textSize+4,u=o.selectAll(`g.${xt}`).data(i),m=u.enter().append("g").classed(xt,!0).style("cursor","pointer"),l=m.merge(u);return m.attr("transform",(c,h)=>`translate(${c.x}, ${c.y})`),u.transition().duration(50).attr("transform",(c,h)=>`translate(${c.x}, ${c.y})`),u.exit().remove(),l.each((c,h,a)=>{const t=_e(c.text,n.styles.textSize)+12,p=-t/2,s=M(a[h]).selectAll("rect").data([c]),x=s.enter().append("rect").attr("height",`${g}px`).attr("fill",y=>F(e.labelColorType,n)).attr("x",p).attr("y",-2).attr("rx",5).attr("ry",5).style("cursor","pointer");s.merge(x).attr("width",y=>`${t}px`).style("transform",r),s.exit().remove();const A=M(a[h]).selectAll("text").data([c]),f=A.enter().append("text").style("dominant-baseline","hanging").style("cursor","pointer");A.merge(f).text(y=>y.text).style("transform",r).attr("fill",y=>F(e.labelTextColorType,n)).attr("font-size",n.styles.textSize).attr("x",p+6),A.exit().remove()}),l}function ta(o){o.selectAll(`g.${xt}`).data([]).exit().remove()}const W=Z(ft,ie)(({selection:o,rootSelection:i,name:e,subject:n,observer:r})=>{const g=new G,u=i.insert("rect","g").classed(I(ft,"rect"),!0).attr("opacity",0),m=o.append("g");r.layout$.pipe(d(g)).subscribe(t=>{u.attr("width",t.rootWidth).attr("height",t.rootHeight)}),r.gridAxesTransform$.pipe(d(g),P(t=>t.value),O()).subscribe(t=>{m.style("transform",t)});const l=new B(t=>{S({fullDataFormatter:r.fullDataFormatter$,gridAxesSize:r.gridAxesSize$,computedData:r.computedData$}).pipe(d(g),$(async p=>p)).subscribe(p=>{const x=p.computedData[0]?p.computedData[0].length-1:0,A=p.fullDataFormatter.groupAxis.scaleDomain[0]==="auto"?0-p.fullDataFormatter.groupAxis.scalePadding:p.fullDataFormatter.groupAxis.scaleDomain[0]-p.fullDataFormatter.groupAxis.scalePadding,f=p.fullDataFormatter.groupAxis.scaleDomain[1]==="auto"?x+p.fullDataFormatter.groupAxis.scalePadding:p.fullDataFormatter.groupAxis.scaleDomain[1]+p.fullDataFormatter.groupAxis.scalePadding,y=p.computedData[0]?p.computedData[0].length:0;let L=p.fullDataFormatter.grid.seriesType==="row"?(p.computedData[0]??[]).map(C=>C.groupLabel):p.computedData.map(C=>C[0].groupLabel);const D=new Array(y).fill(0).map((C,w)=>L[w]!=null?L[w]:String(w)).filter((C,w)=>w>=A&&w<=f),N=p.fullDataFormatter.groupAxis.scalePadding,v=wt({axisLabels:D,axisWidth:p.gridAxesSize.width,padding:N});t.next(v)})}),c=me({fullDataFormatter$:r.fullDataFormatter$,gridAxesSize$:r.gridAxesSize$,computedData$:r.computedData$,fullChartParams$:r.fullChartParams$}),h=r.fullChartParams$.pipe(d(g),P(t=>t.highlightTarget),O());return S({computedData:r.computedData$,gridAxesSize:r.gridAxesSize$,fullParams:r.fullParams$,fullChartParams:r.fullChartParams$,highlightTarget:h,SeriesDataMap:r.SeriesDataMap$,GroupDataMap:r.GroupDataMap$,gridGroupPositionFn:c,groupScale:l}).pipe(d(g),$(async t=>t)).subscribe(t=>{i.on("mouseover",(p,s)=>{const{groupIndex:x,groupLabel:A}=t.gridGroupPositionFn(p);n.event$.next({type:"grid",pluginName:e,eventName:"mouseover",highlightTarget:t.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",groups:t.GroupDataMap.get(A)??[],groupIndex:x,groupLabel:A,event:p,data:t.computedData})}).on("mousemove",(p,s)=>{const{groupIndex:x,groupLabel:A}=t.gridGroupPositionFn(p);n.event$.next({type:"grid",pluginName:e,eventName:"mousemove",highlightTarget:t.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",groups:t.GroupDataMap.get(A)??[],groupIndex:x,groupLabel:A,event:p,data:t.computedData})}).on("mouseout",(p,s)=>{const{groupIndex:x,groupLabel:A}=t.gridGroupPositionFn(p);n.event$.next({type:"grid",pluginName:e,eventName:"mouseout",highlightTarget:t.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",groups:t.GroupDataMap.get(A)??[],groupIndex:x,groupLabel:A,event:p,data:t.computedData})}).on("click",(p,s)=>{p.stopPropagation();const{groupIndex:x,groupLabel:A}=t.gridGroupPositionFn(p);n.event$.next({type:"grid",pluginName:e,eventName:"click",highlightTarget:t.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",groups:t.GroupDataMap.get(A)??[],groupIndex:x,groupLabel:A,event:p,data:t.computedData})})}),S({event:n.event$.pipe(ct(t=>t.eventName==="mouseover"||t.eventName==="mousemove")),computedData:r.computedData$,groupScale:l,gridAxesSize:r.gridAxesSize$,fullParams:r.fullParams$,fullChartParams:r.fullChartParams$,highlightTarget:h,gridAxesOppositeTransform:r.gridAxesOppositeTransform$,GroupDataMap:r.GroupDataMap$,gridGroupPositionFn:c}).pipe(d(g),$(async t=>t)).subscribe(t=>{const p=t.groupScale(t.event.groupLabel)??0,s=Ze({groupLabel:t.event.groupLabel,axisX:p,axisHeight:t.gridAxesSize.height,fullParams:t.fullParams});qe({selection:m,pluginName:e,lineData:s,fullParams:t.fullParams,fullChartParams:t.fullChartParams});const x=Je({groupLabel:t.event.groupLabel,axisX:p,fullParams:t.fullParams});Qe({selection:m,labelData:x,fullParams:t.fullParams,fullChartParams:t.fullChartParams,gridAxesOppositeTransformValue:t.gridAxesOppositeTransform.value}).on("mouseover",(f,y)=>{const{groupIndex:L,groupLabel:D}=t.gridGroupPositionFn(f);n.event$.next({type:"grid",pluginName:e,eventName:"mouseover",highlightTarget:t.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",groups:t.event.groups,groupIndex:L,groupLabel:D,event:f,data:t.computedData})}).on("mousemove",(f,y)=>{const{groupIndex:L,groupLabel:D}=t.gridGroupPositionFn(f);n.event$.next({type:"grid",pluginName:e,eventName:"mousemove",highlightTarget:t.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",groups:t.event.groups,groupIndex:L,groupLabel:D,event:f,data:t.computedData})}).on("mouseout",(f,y)=>{const{groupIndex:L,groupLabel:D}=t.gridGroupPositionFn(f);n.event$.next({type:"grid",pluginName:e,eventName:"mouseout",highlightTarget:t.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",groups:t.event.groups,groupIndex:L,groupLabel:D,event:f,data:t.computedData})}).on("click",(f,y)=>{const{groupIndex:L,groupLabel:D}=t.gridGroupPositionFn(f);n.event$.next({type:"grid",pluginName:e,eventName:"click",highlightTarget:t.highlightTarget,datum:null,series:[],seriesIndex:-1,seriesLabel:"",groups:t.event.groups,groupIndex:L,groupLabel:D,event:f,data:t.computedData})})}),We(u,"mouseout").pipe(d(g)).subscribe(t=>{console.log("rootMouseout"),Ke(m),ta(m)}),()=>{g.next(void 0),u.remove()}}),ea={backgroundColorType:"background",strokeColorType:"primary",backgroundOpacity:.8,textColorType:"primary",offset:[20,5],padding:10,textRenderFn:o=>{if(o.highlightTarget==="datum"&&o.datum)return[`${o.datum.label}: ${o.datum.value}`];if(o.highlightTarget==="series"){const i=o.seriesLabel,e=o.series.map(n=>n.value).join(",");return[i,e]}else if(o.highlightTarget==="group"){const i=o.groupLabel,e=o.groups.map(n=>n.value).join(",");return[i,e]}return[]},svgRenderFn:null},$t="Tooltip",Ot=I($t,"g"),aa=I($t,"box");function ia(o,i){const e=i.textSize*1.5;return o.filter(n=>n!="").map((n,r)=>{const g=r*e;return`<text font-size="${i.textSize}" fill="${i.textColor}" x="0" y="${g}" style="dominant-baseline:text-before-edge">${n}</text>`}).join()}function ra({rootSelection:o,pluginName:i,rootWidth:e,rootHeight:n,svgString:r,tooltipStyle:g,event:u}){o.interrupt("fadeout");const m=5,l=r?[r]:[],c=r?[g]:[],a=o.selectAll(`g.${Ot}`).data(l).join(D=>D.append("g").classed(Ot,!0).attr("pointer-events","none"),D=>D,D=>D.style("opacity",0).remove()).attr("transform",()=>`translate(${u.offsetX}, ${u.offsetY})`).selectAll(`g.${aa}`).data(c).join(D=>D.append("g").classed(I(i,"box"),!0)),t=a.selectAll("rect").data(c).join(D=>D.append("rect").attr("rx",m).attr("ry",m)).attr("fill",D=>D.backgroundColor).attr("stroke",D=>D.strokeColor).attr("opacity",D=>D.backgroundOpacity),p=a.selectAll("g").data(l).join(D=>D.append("g").classed(I(i,"content"),!0).attr("transform",()=>`translate(${g.padding}, ${g.padding})`));l.length&&Re(p,l[0]);const s=p!=null&&p.node()?Pt(p):{width:0,height:0};t.attr("width",s.width+g.padding*2).attr("height",s.height+g.padding*2);const x=a!=null&&a.node()?Pt(a):{width:0,height:0},A=e-x.width,f=n-x.height,y=u.offsetX+g.offset[0]>A?A-u.offsetX:g.offset[0],L=u.offsetY+g.offset[1]>f?f-u.offsetY:g.offset[1];a.attr("transform",D=>`translate(${y}, ${L})`),a.attr("transform",D=>`translate(${y}, ${L})`)}const T=ge($t,ea)(({selection:o,rootSelection:i,name:e,chartType:n,observer:r,subject:g})=>{const u=new G,m=g.event$.pipe(d(u),ct(s=>s.eventName==="mouseover"||s.eventName==="mousemove")),l=g.event$.pipe(d(u),ct(s=>s.eventName==="mouseout")),c=S({fullChartParams:r.fullChartParams$,fullParams:r.fullParams$}).pipe(d(u),$(async s=>s),P(s=>({backgroundColor:F(s.fullParams.backgroundColorType,s.fullChartParams),backgroundOpacity:s.fullParams.backgroundOpacity,strokeColor:F(s.fullParams.strokeColorType,s.fullChartParams),offset:s.fullParams.offset,padding:s.fullParams.padding,textSize:s.fullChartParams.styles.textSize,textColor:F(s.fullParams.textColorType,s.fullChartParams)}))),h=S({fullParams:r.fullParams$,tooltipStyle:c}).pipe(d(u),$(async s=>s),P(s=>s.fullParams.svgRenderFn?s.fullParams.svgRenderFn:x=>{const A=s.fullParams.textRenderFn(x);return ia(A,s.tooltipStyle)})),a=S({event:m,contentRenderFn:h}).pipe(d(u),$(async s=>s),P(s=>s.contentRenderFn(s.event))),t=l.pipe(d(u),P(s=>"")),p=ht(m,l).pipe(d(u),P(s=>s.event));return S({svgString:ht(a,t),event:p,layout:r.layout$,tooltipStyle:c}).pipe(d(u),$(async s=>s)).subscribe(s=>{ra({rootSelection:i,pluginName:e,rootWidth:s.layout.rootWidth,rootHeight:s.layout.rootHeight,svgString:s.svgString,tooltipStyle:s.tooltipStyle,event:s.event})}),function(){u.next(void 0)}}),Ht="PieEventTexts",Mt=I(Ht,"text");function ut(o,i){const e=o.selectAll(`text.${Mt}`).data(i),n=e.enter().append("text").classed(Mt,!0),r=e.merge(n);return r.each((g,u,m)=>{const l=M(m[u]).text(g.text);Object.keys(g.attr).forEach(c=>{l.attr(c,g.attr[c])}),Object.keys(g.style).forEach(c=>{l.style(c,g.style[c])})}),e.exit().remove(),r}function pt({eventData:o,eventName:i,t:e,eventFn:n,textAttrs:r,textStyles:g}){return n(o,i,e).map((m,l)=>({text:m,attr:r[l],style:g[l]}))}const na=Bt(Ht,Kt)(({selection:o,name:i,observer:e,subject:n})=>{const r=new G,g=o.append("g");let u;e.layout$.pipe(Gt()).subscribe(l=>{o.attr("transform",`translate(${l.width/2}, ${l.height/2})`),e.layout$.pipe(d(r)).subscribe(c=>{o.transition().attr("transform",`translate(${c.width/2}, ${c.height/2})`)})});const m=e.fullChartParams$.pipe(d(r),P(l=>l.highlightTarget),O());return S({computedData:e.computedData$,fullParams:e.fullParams$,fullChartParams:e.fullChartParams$,highlightTarget:m}).pipe(d(r),$(async l=>l)).subscribe(l=>{g.transition().duration(l.fullChartParams.transitionDuration).ease(Fe(l.fullChartParams.transitionEase)).tween("move",(c,h)=>a=>{const t=pt({eventData:{type:"series",pluginName:i,eventName:"transitionMove",event:c,highlightTarget:l.highlightTarget,data:l.computedData,series:[],seriesIndex:-1,seriesLabel:"",datum:null},eventName:"transitionMove",t:a,eventFn:l.fullParams.eventFn,textAttrs:l.fullParams.textAttrs,textStyles:l.fullParams.textStyles});ut(g,t)}).on("end",(c,h)=>{const a=pt({eventData:{type:"series",pluginName:i,eventName:"transitionEnd",event:c,highlightTarget:l.highlightTarget,data:l.computedData,series:[],seriesIndex:-1,seriesLabel:"",datum:null},eventName:"transitionMove",t:1,eventFn:l.fullParams.eventFn,textAttrs:l.fullParams.textAttrs,textStyles:l.fullParams.textStyles});ut(g,a),u&&u.unsubscribe(),u=n.event$.subscribe(t=>{const p=pt({eventData:t,eventName:t.eventName,t:1,eventFn:l.fullParams.eventFn,textAttrs:l.fullParams.textAttrs,textStyles:l.fullParams.textStyles});ut(g,p)})})}),()=>{r.next(void 0)}}),Xt="PieLabels",sa=I(Xt,"text");function oa(o,i,e,n){return o.map((r,g)=>{const[u,m]=i.centroid(r),[l,c]=e.centroid(r);return{pieDatum:r,arcIndex:g,arcLabel:r.data.label,x:u*n,y:m*n,mouseoverX:l*n,mouseoverY:c*n}}).filter(r=>r.pieDatum.data.visible)}function la(o,i,e,n){let r=o.selectAll("text").data(i,l=>l.pieDatum.id),g=r.enter().append("text").classed(sa,!0),u=r.exit();g.append("text");const m=r.merge(g);return m.attr("font-weight","bold").attr("text-anchor","middle").style("dominant-baseline","middle").style("cursor",l=>n.highlightTarget&&n.highlightTarget!="none"?"pointer":"none").text(l=>e.labelFn(l.pieDatum.data)).attr("font-size",n.styles.textSize).attr("fill",(l,c)=>gt({datum:l.pieDatum.data,colorType:e.labelColorType,fullChartParams:n})).transition().attr("transform",l=>"translate("+l.x+","+l.y+")"),u.remove(),m}function ua({labelSelection:o,ids:i,fullChartParams:e}){if(o.interrupt("highlight"),!i.length){o.transition().duration(200).attr("transform",n=>"translate("+n.x+","+n.y+")").style("opacity",1);return}o.each((n,r,g)=>{const u=M(g[r]);i.includes(n.pieDatum.id)?u.style("opacity",1).transition().duration(200).attr("transform",m=>"translate("+m.mouseoverX+","+m.mouseoverY+")"):u.style("opacity",e.styles.unhighlightedOpacity).transition().duration(200).attr("transform",m=>"translate("+m.x+","+m.y+")")})}const tt=Bt(Xt,Jt)(({selection:o,observer:i,subject:e})=>{const n=new G,r=o.append("g");let g=new G,u=[];return i.layout$.pipe(Gt()).subscribe(m=>{o.attr("transform",`translate(${m.width/2}, ${m.height/2})`),i.layout$.pipe(d(n)).subscribe(l=>{o.transition().attr("transform",`translate(${l.width/2}, ${l.height/2})`)})}),S({layout:i.layout$,computedData:i.computedData$,fullParams:i.fullParams$,fullChartParams:i.fullChartParams$}).pipe(d(n),$(async m=>m)).subscribe(m=>{const l=m.layout.width<m.layout.height?m.layout.width:m.layout.height,c=Lt({axisWidth:l,innerRadius:0,outerRadius:m.fullParams.outerRadius,padAngle:0,cornerRadius:0}),h=Lt({axisWidth:l,innerRadius:0,outerRadius:m.fullParams.outerMouseoverRadius,padAngle:0,cornerRadius:0}),a=Ie({computedDataSeries:m.computedData,startAngle:m.fullParams.startAngle,endAngle:m.fullParams.endAngle});u=oa(a,c,h,m.fullParams.labelCentroid);const t=la(r,u,m.fullParams,m.fullChartParams);g.next(t)}),S({labelSelection:g,highlight:i.seriesHighlight$,fullChartParams:i.fullChartParams$}).pipe(d(n),$(async m=>m)).subscribe(m=>{ua({labelSelection:m.labelSelection,ids:m.highlight,fullChartParams:m.fullChartParams})}),()=>{n.next(void 0)}}),V=[15,38,25,17,26,72,64,29],R=[[55,80,50,11,150],[35,40,15,65,120]],et={series:{Bubbles:{PRESET_SERIES_BASIC:{chart:H,plugins:[Et,X,T],preset:St,data:V},PRESET_BUBBLES_SCALING_BY_RADIUS:{chart:H,plugins:[Et,X,T],preset:he,data:V}},Pie:{PRESET_SERIES_BASIC:{chart:H,plugins:[Q,tt,X,T],preset:St,data:V},PRESET_PIE_WITH_INNER_LABELS:{chart:H,plugins:[Q,tt,X,T],preset:fe,data:V},PRESET_PIE_DONUT:{chart:H,plugins:[Q,tt,na,X,T],preset:xe,data:V},PRESET_PIE_HALF_DONUT:{chart:H,plugins:[Q,tt,X,T],preset:de,data:V}}},grid:{Bars:{PRESET_GRID_BASIC:{chart:E,plugins:[U,_,k,b,T],preset:q,data:R},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:E,plugins:[U,_,k,b,T],preset:K,data:R},PRESET_GRID_HORIZONTAL:{chart:E,plugins:[U,_,k,b,T],preset:J,data:R},PRESET_BARS_ROUND:{chart:E,plugins:[U,_,k,b,T],preset:Ae,data:R},PRESET_BARS_HORIZONTAL_AND_ROUND:{chart:E,plugins:[U,_,k,b,T],preset:ye,data:R},PRESET_BARS_THIN:{chart:E,plugins:[U,_,k,b,T],preset:De,data:R},PRESET_BARS_HORIZONTAL_AND_THIN:{chart:E,plugins:[U,_,k,b,T],preset:$e,data:R}},BarStack:{PRESET_GRID_BASIC:{chart:E,plugins:[nt,_,lt,b,T],preset:q,data:R},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:E,plugins:[nt,_,lt,b,T],preset:K,data:R},PRESET_GRID_HORIZONTAL:{chart:E,plugins:[nt,_,lt,b,T],preset:J,data:R}},BarsTriangle:{PRESET_GRID_BASIC:{chart:E,plugins:[st,_,k,b,T],preset:q,data:R},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:E,plugins:[st,_,k,b,T],preset:K,data:R},PRESET_GRID_HORIZONTAL:{chart:E,plugins:[st,_,k,b,T],preset:J,data:R}},Lines:{PRESET_GRID_BASIC:{chart:E,plugins:[j,_,k,W,Y,b,T],preset:q,data:R},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:E,plugins:[j,_,k,W,Y,b,T],preset:K,data:R},PRESET_GRID_HORIZONTAL:{chart:E,plugins:[j,_,k,W,Y,b,T],preset:J,data:R},PRESET_LINES_CURVE:{chart:E,plugins:[j,_,k,W,Y,b,T],preset:Te,data:R},PRESET_LINES_HIGHLIGHT_GROUP_DOTS:{chart:E,plugins:[j,_,k,W,Y,b,T],preset:Se,data:R}}}},pa={id:"chart",style:{width:"100%",height:"100vh"}},Sa=Vt({__name:"[presetName]",setup(o){const e=jt().params,n=et[e.chartType]&&et[e.chartType][e.pluginName]&&et[e.chartType][e.pluginName][e.presetName]?et[e.chartType][e.pluginName][e.presetName]:null;return Yt(()=>{if(!n)return;const r=document.querySelector("#chart"),g=n.plugins.map(m=>new m),u=new n.chart(r,{preset:n.preset});u.plugins$.next(g),u.data$.next(n.data)}),(r,g)=>(Wt(),Zt("div",pa))}});export{Sa as default};