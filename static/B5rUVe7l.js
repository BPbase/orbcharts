import{B as te,S as U,J as Pe,L as Ie,o as oe,t as m,m as S,d as O,j as P,k as G,b9 as Ge,s as Y,bc as he,ar as re,bd as Ce,be as Me,g as ee,K as Be,f as Re,a as we,aZ as $e,ad as _e,bf as ze,w as Fe,y as ke,q as Ee,ae as We,i as Oe,G as Ye,bg as He,bh as Ne,bi as Ve,bj as ge,bk as ve,bl as Ue}from"./CUAujy1K.js";import{c as je,a as Xe}from"./CX-pyEAo.js";import{r as pe,s as Ze,a as Ke,t as qe}from"./CvNJ1Mhf.js";import{d as de}from"./Ctxu_kSH.js";const De="Lines",Je={name:De,defaultParams:Pe,layerIndex:Ie,validator:(r,{validateColumns:n})=>n(r,{lineCurve:{toBeTypes:["string"]},lineWidth:{toBeTypes:["number"]}})},Et=te(Je)(({selection:r,rootSelection:n,name:t,observer:e,subject:i})=>{const o=new U,y=je(De,{selection:r,computedData$:e.computedData$,computedAxesData$:e.computedAxesData$,visibleComputedData$:e.visibleComputedData$,visibleComputedAxesData$:e.visibleComputedAxesData$,seriesLabels$:e.seriesLabels$,SeriesDataMap$:e.SeriesDataMap$,GroupDataMap$:e.GroupDataMap$,fullParams$:e.fullParams$,fullDataFormatter$:e.fullDataFormatter$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:e.gridAxesTransform$,gridGraphicTransform$:e.gridGraphicTransform$,gridAxesSize$:e.gridAxesSize$,gridHighlight$:e.gridHighlight$,gridContainerPosition$:e.gridContainerPosition$,allContainerPosition$:e.gridContainerPosition$,layout$:e.layout$,event$:i.event$});return()=>{o.next(void 0),y()}});function Qe(r="curveLinear",n){return Ce().x(t=>t.axisX).y0(t=>n).y1(t=>t.axisY).curve(Me[r])}function et(r){let n=[[]],t=0;for(let e in r){if(r[e].visible==!1||r[e].value===void 0||r[e].value===null){n[t].length&&(t++,n[t]=[]);continue}n[t].push(r[e])}return n}function tt({selection:r,pathClassName:n,segmentData:t,areaPath:e,linearGradientIds:i,params:o}){return r.selectAll("path").data(t,(d,f)=>d.length?`${d[0].id}_${d[d.length-1].id}`:f).join(d=>d.append("path").classed(n,!0).attr("fill","none").style("vector-effect","non-scaling-stroke").style("cursor","pointer"),d=>d,d=>d.remove()).attr("fill",(d,f)=>d[0]?`url(#${i[d[0].seriesIndex]})`:"").attr("d",d=>e(d))}function rt({selection:r,seriesLabel:n,fullChartParams:t}){if(r.interrupt("highlight"),!n){r.transition("highlight").duration(200).style("opacity",1);return}r.each((e,i,o)=>{e===n?Y(o[i]).style("opacity",1):Y(o[i]).style("opacity",t.styles.unhighlightedOpacity)})}function it({defsSelection:r,computedData:n,linearGradientIds:t,params:e}){r.selectAll("linearGradient").data(n??[]).join(i=>i.append("linearGradient").attr("x1","0%").attr("x2","0%").attr("y1","100%").attr("y2","0%").attr("spreadMethod","pad"),i=>i,i=>i.remove()).attr("id",(i,o)=>i[0]?t[i[0].seriesIndex]:"").html((i,o)=>{const y=i[0]?i[0].color:"";return`
        <stop offset="0%"   stop-color="${y}" stop-opacity="${e.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${y}" stop-opacity="${e.linearGradientOpacity[1]}"/>
      `})}function at({defsSelection:r,clipPathData:n,transitionDuration:t,transitionEase:e}){r.selectAll("clipPath").data(n).join(i=>i.append("clipPath"),i=>i,i=>i.remove()).attr("id",i=>i.id).each((i,o,y)=>{Y(y[o]).selectAll("rect").data([i]).join(d=>{const f=d.append("rect");return f.transition().duration(t).ease(he(e)).tween("tween",(L,C,I)=>z=>{const M=L.width*z;f.attr("x",0).attr("y",0).attr("width",B=>M).attr("height",B=>B.height)}),f},d=>d.attr("x",0).attr("y",0).attr("width",f=>f.width).attr("height",f=>f.height),d=>d.remove())})}const st=(r,{selection:n,computedData$:t,computedAxesData$:e,visibleComputedData$:i,visibleComputedAxesData$:o,seriesLabels$:y,SeriesDataMap$:d,GroupDataMap$:f,fullParams$:L,fullDataFormatter$:C,fullChartParams$:I,gridAxesTransform$:z,gridGraphicTransform$:M,gridAxesSize$:B,gridHighlight$:R,gridContainerPosition$:W,layout$:x,event$:w})=>{const A=new U,h=oe(r,"clipPath-box"),l=ee(r,"path"),{seriesSelection$:b,axesSelection$:T,defsSelection$:_,graphicGSelection$:H}=pe({selection:n,pluginName:r,clipPathID:h,seriesLabels$:y,gridContainerPosition$:W,gridAxesTransform$:z,gridGraphicTransform$:M}),N=M.pipe(m(A),S(p=>-p.translate[1]/p.scale[1])),X=new re(p=>{const F=P({fullParams:L,valueAxisStart:N}).pipe(m(A)).subscribe(s=>{const c=Qe(s.fullParams.lineCurve,s.valueAxisStart);p.next(c)});return()=>{F.unsubscribe()}}),k=I.pipe(S(p=>p.transitionDuration),O()),V=I.pipe(S(p=>p.transitionEase),O());P({defsSelection:_,seriesLabels:y,axisSize:B,transitionDuration:k,transitionEase:V}).pipe(m(A),G(async p=>p)).subscribe(p=>{const s=[{id:h,width:p.axisSize.width,height:p.axisSize.height}].concat(p.seriesLabels.map(c=>({id:`orbcharts__clipPath_${c}`,width:p.axisSize.width,height:p.axisSize.height})));at({defsSelection:p.defsSelection,clipPathData:s,transitionDuration:p.transitionDuration,transitionEase:p.transitionEase})});const K=t.pipe(S(p=>{const F=new Map;return p.flat().forEach(s=>F.set(s.id,s)),F})),q=Ze({fullDataFormatter$:C,gridAxesSize$:B,computedData$:t,fullChartParams$:I,gridContainerPosition$:W,layout$:x}),ie=I.pipe(m(A),S(p=>p.highlightTarget),O()),ae=y.pipe(m(A),S(p=>p.map((F,s)=>oe(r,`lineargradient-${F}`)))),se=P({graphicGSelection:H,defsSelection:_,visibleComputedAxesData:o,linearGradientIds:ae,areaPath:X,params:L}).pipe(m(A),G(async p=>p),S(p=>{let F=[];return p.graphicGSelection.each((s,c,g)=>{const v=et(p.visibleComputedAxesData[c]??[]);F[c]=tt({selection:Y(g[c]),pathClassName:l,areaPath:p.areaPath,segmentData:v,linearGradientIds:p.linearGradientIds,params:p.params}),it({defsSelection:p.defsSelection,computedData:p.visibleComputedAxesData,linearGradientIds:p.linearGradientIds,params:p.params})}),F}));return P({pathSelectionArr:se,computedData:t,SeriesDataMap:d,GroupDataMap:f,highlightTarget:ie,gridGroupPositionFn:q}).pipe(m(A),G(async p=>p)).subscribe(p=>{p.pathSelectionArr.forEach(F=>{F.on("mouseover",(s,c)=>{const g=c[0]?c[0].seriesLabel:"",{groupIndex:v,groupLabel:a}=p.gridGroupPositionFn(s),D=p.GroupDataMap.get(a).find(E=>E.seriesLabel===g)??c[0];w.next({type:"grid",eventName:"mouseover",pluginName:r,highlightTarget:p.highlightTarget,datum:D,gridIndex:D.gridIndex,series:p.SeriesDataMap.get(D.seriesLabel),seriesIndex:D.seriesIndex,seriesLabel:D.seriesLabel,group:p.GroupDataMap.get(D.groupLabel),groupIndex:D.groupIndex,groupLabel:D.groupLabel,event:s,data:p.computedData})}).on("mousemove",(s,c)=>{const g=c[0]?c[0].seriesLabel:"",{groupIndex:v,groupLabel:a}=p.gridGroupPositionFn(s),D=p.GroupDataMap.get(a).find(E=>E.seriesLabel===g)??c[0];w.next({type:"grid",eventName:"mousemove",pluginName:r,highlightTarget:p.highlightTarget,datum:D,gridIndex:D.gridIndex,series:p.SeriesDataMap.get(D.seriesLabel),seriesIndex:D.seriesIndex,seriesLabel:D.seriesLabel,group:p.GroupDataMap.get(D.groupLabel),groupIndex:D.groupIndex,groupLabel:D.groupLabel,event:s,data:p.computedData})}).on("mouseout",(s,c)=>{const g=c[0]?c[0].seriesLabel:"",{groupIndex:v,groupLabel:a}=p.gridGroupPositionFn(s),D=p.GroupDataMap.get(a).find(E=>E.seriesLabel===g)??c[0];w.next({type:"grid",eventName:"mouseout",pluginName:r,highlightTarget:p.highlightTarget,datum:D,gridIndex:D.gridIndex,series:p.SeriesDataMap.get(D.seriesLabel),seriesIndex:D.seriesIndex,seriesLabel:D.seriesLabel,group:p.GroupDataMap.get(D.groupLabel),groupIndex:D.groupIndex,groupLabel:D.groupLabel,event:s,data:p.computedData})}).on("click",(s,c)=>{const g=c[0]?c[0].seriesLabel:"",{groupIndex:v,groupLabel:a}=p.gridGroupPositionFn(s),D=p.GroupDataMap.get(a).find(E=>E.seriesLabel===g)??c[0];w.next({type:"grid",eventName:"click",pluginName:r,highlightTarget:p.highlightTarget,datum:D,gridIndex:D.gridIndex,series:p.SeriesDataMap.get(D.seriesLabel),seriesIndex:D.seriesIndex,seriesLabel:D.seriesLabel,group:p.GroupDataMap.get(D.groupLabel),groupIndex:D.groupIndex,groupLabel:D.groupLabel,event:s,data:p.computedData})})})}),I.pipe(m(A),Ge(p=>p.highlightTarget==="series"),G(p=>P({graphicGSelection:H,gridHighlight:R,DataMap:K,fullChartParams:I}).pipe(m(A),G(async F=>F)))).subscribe(p=>{const F=p.gridHighlight[0]?p.gridHighlight[0].seriesLabel:null;rt({selection:p.graphicGSelection,seriesLabel:F,fullChartParams:p.fullChartParams})}),()=>{A.next(void 0)}},fe="LineAreas",nt={name:fe,defaultParams:Be,layerIndex:Re,validator:(r,{validateColumns:n})=>n(r,{lineCurve:{toBeTypes:["string"]},linearGradientOpacity:{toBe:"[number, number]",test:e=>Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"}})},Wt=te(nt)(({selection:r,name:n,observer:t,subject:e})=>{const i=new U,o=st(fe,{selection:r,computedData$:t.computedData$,visibleComputedData$:t.visibleComputedData$,computedAxesData$:t.computedAxesData$,visibleComputedAxesData$:t.visibleComputedAxesData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:t.fullParams$,fullDataFormatter$:t.fullDataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,allContainerPosition$:t.gridContainerPosition$,layout$:t.layout$,event$:e.event$});return()=>{i.next(void 0),o()}}),be=.3;function ot({axisWidth:r,groupAmount:n,barGroupPadding:t=0}){const i=(n>1?r/(n-1):r)-t;return i>1?i:1}function lt(r,n){return r<=1?0:n/(r-1)*be}function pt(r,n){return r<=1?n:n*(1-be)}function ct({graphicGSelection:r,rectClassName:n,barData:t,zeroY:e,groupLabels:i,params:o,chartParams:y,barWidth:d,transformedBarRadius:f,delayGroup:L,transitionItem:C,isSeriesSeprate:I}){const z=d/2;return r.each((B,R,W)=>{Y(W[R]).selectAll(`rect.${n}`).data(t[R]??[],x=>x.id).join(x=>x.append("rect").classed(n,!0).attr("cursor","pointer").attr("height",w=>1),x=>x,x=>x.remove()).attr("transform",(x,w)=>`translate(${(x?x.axisX:0)-z}, 0)`).attr("fill",x=>x.color).attr("y",x=>e).attr("x",x=>0).attr("width",d).attr("rx",f[R][0]??1).attr("ry",f[R][1]??1).transition().duration(C).ease(he(y.transitionEase)).delay((x,w)=>x.groupIndex*L).attr("y",x=>x._barStartY).attr("height",x=>Math.abs(x._barHeight)||1)}),r.selectAll(`rect.${n}`)}function gt({defsSelection:r,clipPathData:n}){r.selectAll("clipPath").data(n).join(t=>t.append("clipPath"),t=>t,t=>t.remove()).attr("id",t=>t.id).each((t,e,i)=>{Y(i[e]).selectAll("rect").data([t]).join(o=>o.append("rect"),o=>o,o=>o.remove()).attr("x",0).attr("y",0).attr("width",o=>o.width).attr("height",o=>o.height)})}function ut({selection:r,ids:n,fullChartParams:t}){if(r.interrupt("highlight"),!n.length){r.transition("highlight").duration(200).style("opacity",1);return}r.each((e,i,o)=>{n.includes(e.id)?Y(o[i]).style("opacity",1):Y(o[i]).style("opacity",t.styles.unhighlightedOpacity)})}const ht=(r,{selection:n,computedData$:t,computedAxesData$:e,visibleComputedData$:i,visibleComputedAxesData$:o,seriesLabels$:y,SeriesDataMap$:d,GroupDataMap$:f,fullParams$:L,fullDataFormatter$:C,fullChartParams$:I,gridAxesTransform$:z,gridGraphicTransform$:M,gridGraphicReverseScale$:B,gridAxesSize$:R,gridHighlight$:W,gridContainerPosition$:x,isSeriesSeprate$:w,event$:A})=>{const h=new U,l=oe(r,"clipPath-box"),b=ee(r,"rect"),{seriesSelection$:T,axesSelection$:_,defsSelection$:H,graphicGSelection$:N}=pe({selection:n,pluginName:r,clipPathID:l,seriesLabels$:y,gridContainerPosition$:x,gridAxesTransform$:z,gridGraphicTransform$:M}),X=o.pipe(m(h),S(a=>a[0]&&a[0][0]?a[0][0].axisY-a[0][0].axisYFromZero:0),O()),k=P({computedData:t,params:L,axisSize:R,isSeriesSeprate:w}).pipe(m(h),G(async a=>a),S(a=>a.params.barWidth?a.params.barWidth:ot({axisWidth:a.axisSize.width,groupAmount:a.computedData[0]?a.computedData[0].length:0,barGroupPadding:a.params.barGroupPadding})),O()),V=P({computedData:t,barWidth:k,params:L,gridGraphicReverseScale:B}).pipe(m(h),G(async a=>a),S(a=>{const $=a.barWidth/2,u=a.params.barRadius===!0?$:a.params.barRadius===!1?0:typeof a.params.barRadius=="number"?a.params.barRadius:0;return a.computedData.map((D,E)=>{const j=a.gridGraphicReverseScale[E]??a.gridGraphicReverseScale[0],ne=u*j[0],J=u*j[1];return[ne,J]})})),K=i.pipe(m(h),S(a=>{const $=new Set;return a.forEach(u=>{u.forEach(D=>{$.add(D.groupLabel)})}),Array.from($)}),we(1)),q=I.pipe(m(h),S(a=>a.transitionDuration),O()),ie=new re(a=>{P({groupLabels:K,transitionDuration:q}).pipe(G(async $=>$)).subscribe($=>{const u=lt($.groupLabels.length,$.transitionDuration);a.next(u)})}).pipe(m(h),O()),ae=new re(a=>{P({groupLabels:K,transitionDuration:q}).pipe(G(async $=>$)).subscribe($=>{const u=pt($.groupLabels.length,$.transitionDuration);a.next(u)})}).pipe(m(h),O()),se=P({computedData:t,dataFormatter:C}).pipe(m(h),G(async a=>a),S(a=>{const $=a.computedData[0]?a.computedData[0].length-1:0,u=a.dataFormatter.groupAxis.scaleDomain[0],D=a.dataFormatter.groupAxis.scaleDomain[1]==="max"?$:a.dataFormatter.groupAxis.scaleDomain[1];return[u,D]})),p=P({visibleComputedAxesData:o,groupScaleDomain:se}).pipe(m(h),G(async a=>a),S(a=>{const $=a.groupScaleDomain[0],u=a.groupScaleDomain[1],E=a.visibleComputedAxesData.map(Z=>Z.filter((Q,wt)=>Q.groupIndex>=$&&Q.groupIndex<=u)).flat();if(E.length<=1)return 1;const j=E.reduce((Z,Q)=>Q.value>Z.value?Q:Z,E[0]),ne=j.groupIndex,J=E.filter(Z=>Z.groupIndex===ne).reduce((Z,Q)=>Z+Q.value,0);return j.value/J})),F=P({computedAxesData:e,yRatio:p,zeroY:X}).pipe(m(h),S(a=>{let $=a.computedAxesData[0]?a.computedAxesData[0].map(()=>a.zeroY):[];return a.computedAxesData.map((u,D)=>u.map((E,j)=>{const ne=$[j];let J=0;return E.visible&&(J=E.axisYFromZero*a.yRatio,$[j]=$[j]+J),{...E,_barStartY:ne,_barHeight:J}}))})),s=P({computedAxesData:e,zeroY:X}).pipe(m(h),S(a=>a.computedAxesData.map(($,u)=>$.map((D,E)=>({...D,_barStartY:a.zeroY,_barHeight:D.axisYFromZero}))))),c=w.pipe(G(a=>$e(()=>a,s,F)));P({defsSelection:H,gridAxesSize:R}).pipe(m(h),G(async a=>a)).subscribe(a=>{const $=[{id:l,width:a.gridAxesSize.width,height:a.gridAxesSize.height}];gt({defsSelection:a.defsSelection,clipPathData:$})});const g=I.pipe(m(h),S(a=>a.highlightTarget),O()),v=P({graphicGSelection:N,graphicData:c,zeroY:X,groupLabels:K,params:L,chartParams:I,highlightTarget:g,barWidth:k,transformedBarRadius:V,delayGroup:ie,transitionItem:ae,isSeriesSeprate:w}).pipe(m(h),G(async a=>a),S(a=>ct({graphicGSelection:a.graphicGSelection,rectClassName:b,barData:a.graphicData,zeroY:a.zeroY,groupLabels:a.groupLabels,params:a.params,chartParams:a.chartParams,barWidth:a.barWidth,transformedBarRadius:a.transformedBarRadius,delayGroup:a.delayGroup,transitionItem:a.transitionItem,isSeriesSeprate:a.isSeriesSeprate})));return P({barSelection:v,computedData:t,highlightTarget:g,SeriesDataMap:d,GroupDataMap:f}).subscribe(a=>{a.barSelection.on("mouseover",($,u)=>{$.stopPropagation(),A.next({type:"grid",eventName:"mouseover",pluginName:r,highlightTarget:a.highlightTarget,datum:u,gridIndex:u.gridIndex,series:a.SeriesDataMap.get(u.seriesLabel),seriesIndex:u.seriesIndex,seriesLabel:u.seriesLabel,group:a.GroupDataMap.get(u.groupLabel),groupIndex:u.groupIndex,groupLabel:u.groupLabel,event:$,data:a.computedData})}).on("mousemove",($,u)=>{$.stopPropagation(),A.next({type:"grid",eventName:"mousemove",pluginName:r,highlightTarget:a.highlightTarget,datum:u,gridIndex:u.gridIndex,series:a.SeriesDataMap.get(u.seriesLabel),seriesIndex:u.seriesIndex,seriesLabel:u.seriesLabel,group:a.GroupDataMap.get(u.groupLabel),groupIndex:u.groupIndex,groupLabel:u.groupLabel,event:$,data:a.computedData})}).on("mouseout",($,u)=>{$.stopPropagation(),A.next({type:"grid",eventName:"mouseout",pluginName:r,highlightTarget:a.highlightTarget,datum:u,gridIndex:u.gridIndex,series:a.SeriesDataMap.get(u.seriesLabel),seriesIndex:u.seriesIndex,seriesLabel:u.seriesLabel,group:a.GroupDataMap.get(u.groupLabel),groupIndex:u.groupIndex,groupLabel:u.groupLabel,event:$,data:a.computedData})}).on("click",($,u)=>{$.stopPropagation(),A.next({type:"grid",eventName:"click",pluginName:r,highlightTarget:a.highlightTarget,datum:u,gridIndex:u.gridIndex,series:a.SeriesDataMap.get(u.seriesLabel),seriesIndex:u.seriesIndex,seriesLabel:u.seriesLabel,group:a.GroupDataMap.get(u.groupLabel),groupIndex:u.groupIndex,groupLabel:u.groupLabel,event:$,data:a.computedData})})}),P({barSelection:v,highlight:W.pipe(S(a=>a.map($=>$.id))),fullChartParams:I}).pipe(m(h),G(async a=>a)).subscribe(a=>{ut({selection:a.barSelection,ids:a.highlight,fullChartParams:a.fullChartParams})}),()=>{h.next(void 0)}},ye="StackedBars",dt={name:ye,defaultParams:_e,layerIndex:5,validator:(r,{validateColumns:n})=>n(r,{barWidth:{toBeTypes:["number"]},barGroupPadding:{toBeTypes:["number"]},barRadius:{toBeTypes:["number","boolean"]}})},Ot=te(dt)(({selection:r,name:n,subject:t,observer:e})=>{const i=new U,o=ht(ye,{selection:r,computedData$:e.computedData$,computedAxesData$:e.computedAxesData$,visibleComputedData$:e.visibleComputedData$,visibleComputedAxesData$:e.visibleComputedAxesData$,seriesLabels$:e.seriesLabels$,SeriesDataMap$:e.SeriesDataMap$,GroupDataMap$:e.GroupDataMap$,fullParams$:e.fullParams$,fullDataFormatter$:e.fullDataFormatter$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:e.gridAxesTransform$,gridGraphicTransform$:e.gridGraphicTransform$,gridGraphicReverseScale$:e.gridGraphicReverseScale$,gridAxesSize$:e.gridAxesSize$,gridHighlight$:e.gridHighlight$,gridContainerPosition$:e.gridContainerPosition$,isSeriesSeprate$:e.isSeriesSeprate$,event$:t.event$});return()=>{i.next(void 0),o()}}),Se=.3;function me({axisWidth:r,groupAmount:n,barAmountOfGroup:t,barPadding:e=0,barGroupPadding:i=0}){const y=((n>1?r/(n-1):r)-i)/t-e;return y>1?y:1}function mt(r,n,t){const e=r/2,i=r*n.length+t.barPadding*n.length;return ze().domain(n).range([-i/2+e,i/2-e])}function xt(r,n){return r<=1?0:n/(r-1)*Se}function $t(r,n){return r<=1?n:n*(1-Se)}function Dt({graphicGSelection:r,pathGClassName:n,pathClassName:t,visibleComputedAxesData:e,linearGradientIds:i,zeroYArr:o,groupLabels:y,barScale:d,params:f,chartParams:L,barWidth:C,delayGroup:I,transitionItem:z,isSeriesSeprate:M}){const B=C/2;return r.each((W,x,w)=>{Y(w[x]).selectAll(`g.${n}`).data(e[x]??[]).join(h=>{const l=h.append("g").classed(n,!0).attr("cursor","pointer");return l.append("path").classed(t,!0).style("vector-effect","non-scaling-stroke").attr("d",b=>{const T=-B,_=o[x],H=o[x];return`M${T},${_} L${T+C/2},${H} ${T+C},${_}`}),l},h=>h,h=>h.remove()).attr("transform",h=>`translate(${M?0:d(h.seriesLabel)}, 0)`).select(`path.${t}`).attr("height",h=>Math.abs(h.axisYFromZero)||1).attr("y",h=>h.axisY<o[x]?h.axisY:o[x]).attr("x",h=>M?0:d(h.seriesLabel)).style("fill",h=>`url(#${i[h.seriesIndex]})`).attr("stroke",h=>h.color).attr("transform",h=>`translate(${h?h.axisX:0}, 0)`).transition().duration(z).ease(he(L.transitionEase)).delay((h,l)=>h.groupIndex*I).attr("d",h=>{const l=-B,b=o[x],T=h.axisY;return`M${l},${b} L${l+C/2},${T} ${l+C},${b}`})}),r.selectAll(`path.${t}`)}function ft({defsSelection:r,computedData:n,linearGradientIds:t,params:e}){r.selectAll("linearGradient").data(n??[]).join(i=>i.append("linearGradient").attr("x1","0%").attr("x2","0%").attr("y1","100%").attr("y2","0%").attr("spreadMethod","pad"),i=>i,i=>i.remove()).attr("id",(i,o)=>i[0]?t[i[0].seriesIndex]:"").html((i,o)=>{const y=i[0]?i[0].color:"";return`
        <stop offset="0%"   stop-color="${y}" stop-opacity="${e.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${y}" stop-opacity="${e.linearGradientOpacity[1]}"/>
      `})}function bt({defsSelection:r,clipPathData:n}){r.selectAll("clipPath").data(n).join(t=>t.append("clipPath"),t=>t,t=>t.remove()).attr("id",t=>t.id).each((t,e,i)=>{Y(i[e]).selectAll("rect").data([t]).join(o=>o.append("rect"),o=>o,o=>o.remove()).attr("x",0).attr("y",0).attr("width",o=>o.width).attr("height",o=>o.height)})}function yt({selection:r,ids:n,fullChartParams:t}){r.interrupt("highlight");const e=()=>{r.transition("highlight").duration(200).style("opacity",1)};if(!n.length){e();return}r.each((i,o,y)=>{n.includes(i.id)?Y(y[o]).style("opacity",1):Y(y[o]).style("opacity",t.styles.unhighlightedOpacity)})}const St=(r,{selection:n,computedData$:t,computedAxesData$:e,visibleComputedData$:i,visibleComputedAxesData$:o,fullDataFormatter$:y,seriesLabels$:d,SeriesDataMap$:f,GroupDataMap$:L,fullParams$:C,fullChartParams$:I,gridAxesTransform$:z,gridGraphicTransform$:M,gridAxesSize$:B,gridHighlight$:R,gridContainerPosition$:W,isSeriesSeprate$:x,event$:w})=>{const A=new U,h=oe(r,"clipPath-box"),l=ee(r,"pathG"),b=ee(r,"path"),{seriesSelection$:T,axesSelection$:_,defsSelection$:H,graphicGSelection$:N}=pe({selection:n,pluginName:r,clipPathID:h,seriesLabels$:d,gridContainerPosition$:W,gridAxesTransform$:z,gridGraphicTransform$:M});M.pipe(m(A),S(s=>-s.translate[1]/s.scale[1]));const X=o.pipe(S(s=>s.map(c=>c[0]?c[0].axisY-c[0].axisYFromZero:0)),O()),k=P({computedData:t,visibleComputedData:i,params:C,gridAxesSize:B,isSeriesSeprate:x}).pipe(m(A),G(async s=>s),S(s=>s.params.barWidth?s.params.barWidth:s.isSeriesSeprate?me({axisWidth:s.gridAxesSize.width,groupAmount:s.computedData[0]?s.computedData[0].length:0,barAmountOfGroup:1,barPadding:s.params.barPadding,barGroupPadding:s.params.barGroupPadding}):me({axisWidth:s.gridAxesSize.width,groupAmount:s.computedData[0]?s.computedData[0].length:0,barAmountOfGroup:s.visibleComputedData.length,barPadding:s.params.barPadding,barGroupPadding:s.params.barGroupPadding}))),V=i.pipe(m(A),S(s=>{const c=new Set;return s.forEach(g=>{g.forEach(v=>{c.add(v.groupLabel)})}),Array.from(c)})),K=new re(s=>{P({seriesLabels:d,barWidth:k,params:C}).pipe(m(A),G(async c=>c)).subscribe(c=>{const g=mt(c.barWidth,c.seriesLabels,c.params);s.next(g)})}),q=I.pipe(m(A),S(s=>s.transitionDuration),O()),ie=new re(s=>{P({groupLabels:V,transitionDuration:q}).pipe(G(async c=>c)).subscribe(c=>{const g=xt(c.groupLabels.length,c.transitionDuration);s.next(g)})}).pipe(m(A),O()),ae=new re(s=>{P({groupLabels:V,transitionDuration:q}).pipe(G(async c=>c)).subscribe(c=>{const g=$t(c.groupLabels.length,c.transitionDuration);s.next(g)})}).pipe(m(A),O());P({defsSelection:H,gridAxesSize:B}).pipe(m(A),G(async s=>s)).subscribe(s=>{const c=[{id:h,width:s.gridAxesSize.width,height:s.gridAxesSize.height}];bt({defsSelection:s.defsSelection,clipPathData:c})});const se=I.pipe(m(A),S(s=>s.highlightTarget),O()),p=d.pipe(m(A),S(s=>s.map((c,g)=>oe(r,`lineargradient-${c}`)))),F=P({graphicGSelection:N,defsSelection:H,computedData:t,visibleComputedAxesData:o,linearGradientIds:p,zeroYArr:X,groupLabels:V,barScale:K,params:C,chartParams:I,barWidth:k,delayGroup:ie,transitionItem:ae,isSeriesSeprate:x}).pipe(m(A),G(async s=>s),S(s=>(ft({defsSelection:s.defsSelection,computedData:s.computedData,linearGradientIds:s.linearGradientIds,params:s.params}),Dt({graphicGSelection:s.graphicGSelection,pathGClassName:l,pathClassName:b,visibleComputedAxesData:s.visibleComputedAxesData,linearGradientIds:s.linearGradientIds,zeroYArr:s.zeroYArr,groupLabels:s.groupLabels,barScale:s.barScale,params:s.params,chartParams:s.chartParams,barWidth:s.barWidth,delayGroup:s.delayGroup,transitionItem:s.transitionItem,isSeriesSeprate:s.isSeriesSeprate}))));return P({barSelection:F,computedData:t,highlightTarget:se,SeriesDataMap:f,GroupDataMap:L}).subscribe(s=>{s.barSelection.on("mouseover",(c,g)=>{c.stopPropagation(),w.next({type:"grid",eventName:"mouseover",pluginName:r,highlightTarget:s.highlightTarget,datum:g,gridIndex:g.gridIndex,series:s.SeriesDataMap.get(g.seriesLabel),seriesIndex:g.seriesIndex,seriesLabel:g.seriesLabel,group:s.GroupDataMap.get(g.groupLabel),groupIndex:g.groupIndex,groupLabel:g.groupLabel,event:c,data:s.computedData})}).on("mousemove",(c,g)=>{c.stopPropagation(),w.next({type:"grid",eventName:"mousemove",pluginName:r,highlightTarget:s.highlightTarget,datum:g,gridIndex:g.gridIndex,series:s.SeriesDataMap.get(g.seriesLabel),seriesIndex:g.seriesIndex,seriesLabel:g.seriesLabel,group:s.GroupDataMap.get(g.groupLabel),groupIndex:g.groupIndex,groupLabel:g.groupLabel,event:c,data:s.computedData})}).on("mouseout",(c,g)=>{c.stopPropagation(),w.next({type:"grid",eventName:"mouseout",pluginName:r,highlightTarget:s.highlightTarget,datum:g,gridIndex:g.gridIndex,series:s.SeriesDataMap.get(g.seriesLabel),seriesIndex:g.seriesIndex,seriesLabel:g.seriesLabel,group:s.GroupDataMap.get(g.groupLabel),groupIndex:g.groupIndex,groupLabel:g.groupLabel,event:c,data:s.computedData})}).on("click",(c,g)=>{c.stopPropagation(),w.next({type:"grid",eventName:"click",pluginName:r,highlightTarget:s.highlightTarget,datum:g,gridIndex:g.gridIndex,series:s.SeriesDataMap.get(g.seriesLabel),seriesIndex:g.seriesIndex,seriesLabel:g.seriesLabel,group:s.GroupDataMap.get(g.groupLabel),groupIndex:g.groupIndex,groupLabel:g.groupLabel,event:c,data:s.computedData})})}),P({barSelection:F,highlight:R.pipe(S(s=>s.map(c=>c.id))),fullChartParams:I}).pipe(m(A),G(async s=>s)).subscribe(s=>{yt({selection:s.barSelection,ids:s.highlight,fullChartParams:s.fullChartParams})}),()=>{A.next(void 0)}},Ae="BarsTriangle",At={name:Ae,defaultParams:Fe,layerIndex:5,validator:(r,{validateColumns:n})=>n(r,{barWidth:{toBeTypes:["number"]},barPadding:{toBeTypes:["number"]},barGroupPadding:{toBeTypes:["number"]},linearGradientOpacity:{toBe:"[number, number]",test:e=>Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"}})},Yt=te(At)(({selection:r,name:n,subject:t,observer:e})=>{const i=new U,o=St(Ae,{selection:r,computedData$:e.computedData$,computedAxesData$:e.computedAxesData$,visibleComputedData$:e.visibleComputedData$,visibleComputedAxesData$:e.visibleComputedAxesData$,fullDataFormatter$:e.fullDataFormatter$,seriesLabels$:e.seriesLabels$,SeriesDataMap$:e.SeriesDataMap$,GroupDataMap$:e.GroupDataMap$,fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:e.gridAxesTransform$,gridGraphicTransform$:e.gridGraphicTransform$,gridAxesSize$:e.gridAxesSize$,gridHighlight$:e.gridHighlight$,gridContainerPosition$:e.gridContainerPosition$,isSeriesSeprate$:e.isSeriesSeprate$,event$:t.event$});return()=>{i.next(void 0),o()}}),Le="Dots",Lt={name:Le,defaultParams:ke,layerIndex:Ee,validator:(r,{validateColumns:n})=>n(r,{radius:{toBeTypes:["number"]},fillColorType:{toBeOption:"ColorType"},strokeColorType:{toBeOption:"ColorType"},strokeWidth:{toBeTypes:["number"]},onlyShowHighlighted:{toBeTypes:["boolean"]}})},Ht=te(Lt)(({selection:r,name:n,subject:t,observer:e})=>{const i=new U,o=Xe(Le,{selection:r,computedData$:e.computedData$,computedAxesData$:e.computedAxesData$,visibleComputedData$:e.visibleComputedData$,visibleComputedAxesData$:e.visibleComputedAxesData$,seriesLabels$:e.seriesLabels$,SeriesDataMap$:e.SeriesDataMap$,GroupDataMap$:e.GroupDataMap$,fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:e.gridAxesTransform$,gridGraphicTransform$:e.gridGraphicTransform$,gridGraphicReverseScale$:e.gridGraphicReverseScale$,gridAxesSize$:e.gridAxesSize$,gridHighlight$:e.gridHighlight$,gridContainerPosition$:e.gridContainerPosition$,event$:t.event$});return()=>{i.next(void 0),o()}}),Te="StackedValueAxis",Tt={name:Te,defaultParams:We,layerIndex:Oe,validator:(r,{validateColumns:n})=>n(r,{labelOffset:{toBe:"[number, number]",test:e=>Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number","null"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}})},Nt=te(Tt)(({selection:r,name:n,observer:t,subject:e})=>{const i=new U,o=Ke(Te,{selection:r,computedData$:t.computedStackedData$,filteredMinMaxValue$:t.filteredMinMaxValue$,fullParams$:t.fullParams$,fullDataFormatter$:t.fullDataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridAxesReverseTransform$:t.gridAxesReverseTransform$,gridAxesSize$:t.gridAxesSize$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:t.isSeriesSeprate$});return()=>{i.next(void 0),o()}}),le="GroupAux",ue=ee(le,"label-box"),ce=6,xe=3,Pt={name:le,defaultParams:Ye,layerIndex:He,validator:(r,{validateColumns:n})=>n(r,{showLine:{toBeTypes:["boolean"]},showLabel:{toBeTypes:["boolean"]},lineDashArray:{toBeTypes:["string"]},lineColorType:{toBeOption:"ColorType"},labelColorType:{toBeOption:"ColorType"},labelTextColorType:{toBeOption:"ColorType"},labelTextFormat:{toBeTypes:["string","Function"]},labelPadding:{toBeTypes:["number"]},labelRotate:{toBeTypes:["number"]}})};function It({groupLabel:r,axisX:n,axisHeight:t,fullParams:e}){return e.showLine&&r?[{id:r,x1:n,x2:n,y1:0,y2:t}]:[]}function Gt({groupLabel:r,axisX:n,fullParams:t,textSizePx:e,rowAmount:i}){const o=Ne(r,t.labelTextFormat),y=o.split(`
`),d=y.reduce((C,I)=>I.length>C.length?I:C,""),f=Ve(d,e),L=e*y.length;return t.showLabel&&r?[{id:r,x:n,y:-t.labelPadding*i,text:o,textArr:y,textWidth:f,textHeight:L}]:[]}function Ct({selection:r,pluginName:n,lineData:t,fullParams:e,fullChartParams:i}){const o=ee(n,"auxline");return r.selectAll(`line.${o}`).data(t).join(d=>d.append("line").classed(o,!0).style("stroke-width",1).style("pointer-events","none").style("vector-effect","non-scaling-stroke").attr("x1",f=>f.x1).attr("y1",f=>f.y1).attr("x2",f=>f.x2).attr("y2",f=>f.y2),d=>d.transition().duration(50).attr("x1",L=>L.x1).attr("y1",L=>L.y1).attr("x2",L=>L.x2).attr("y2",L=>L.y2),d=>d.remove()).style("stroke",d=>ge(e.lineColorType,i)).style("stroke-dasharray",e.lineDashArray??"none")}function Mt(r){r.selectAll("line").data([]).exit().remove()}function Bt({selection:r,labelData:n,fullParams:t,fullDataFormatter:e,fullChartParams:i,textReverseTransformWithRotate:o,textSizePx:y}){return r.selectAll(`g.${ue}`).data(n).join(f=>f.append("g").classed(ue,!0).style("cursor","pointer").attr("transform",(L,C)=>`translate(${L.x}, ${L.y})`),f=>f.transition().duration(50).attr("transform",(C,I)=>`translate(${C.x}, ${C.y})`),f=>f.remove()).each((f,L,C)=>{const I=Y(C[L]),z=f.textWidth+ce*2,M=f.textHeight+xe*2;let B=-z/2,R=-2,W=B,x=R-3;e.groupAxis.position==="bottom"?(B=t.labelRotate?-z+M:-z/2,R=2,W=B,x=R-3):e.groupAxis.position==="left"?(B=-z+2,R=-M/2,W=B,x=R-3,t.labelRotate&&(x+=M)):e.groupAxis.position==="right"?(B=-2,R=-M/2,W=B,x=R-3,t.labelRotate&&(x+=M)):e.groupAxis.position==="top"&&(B=t.labelRotate?-z+M:-z/2,R=-M+6,W=-M,x=R-3);const w=I.selectAll("rect").data([f]).join(b=>b.append("rect").style("cursor","pointer").attr("rx",5).attr("ry",5),b=>b,b=>b.remove()).attr("width",b=>`${z}px`).attr("height",`${M}px`).attr("fill",b=>ge(t.labelColorType,i)).attr("x",W).attr("y",x).style("transform",o),A=I.selectAll("text").data([f]).join(b=>b.append("text").style("dominant-baseline","hanging").style("cursor","pointer"),b=>b,b=>b.remove()).style("transform",o).attr("fill",b=>ge(t.labelTextColorType,i)).attr("font-size",i.styles.textSize).attr("x",W+ce).attr("y",x+xe).each((b,T,_)=>{ve(Y(_[T]),{textArr:f.textArr,textSizePx:y,groupAxisPosition:e.groupAxis.position,isContainerRotated:!1})});let h=[];A.selectAll("tspan").each((b,T,_)=>{const N=Y(_[T]).node();N&&N.getBBox()&&h.push(N.getBBox().width)});const l=Math.max(...h);w.attr("width",l+ce*2)})}function Rt(r){r.selectAll(`g.${ue}`).data([]).exit().remove()}const Vt=te(Pt)(({selection:r,rootSelection:n,name:t,subject:e,observer:i})=>{const o=new U;let y=!1;const d=n.insert("rect","g").classed(ee(le,"rect"),!0).attr("opacity",0),{seriesSelection$:f,axesSelection$:L,defsSelection$:C,graphicGSelection$:I}=pe({selection:r,pluginName:le,clipPathID:"test",seriesLabels$:i.isSeriesSeprate$.pipe(G(l=>$e(()=>l,i.seriesLabels$,i.seriesLabels$.pipe(S(b=>[b[0]]))))),gridContainerPosition$:i.gridContainerPosition$,gridAxesTransform$:i.gridAxesTransform$,gridGraphicTransform$:i.gridGraphicTransform$});i.layout$.pipe(m(o)).subscribe(l=>{d.attr("width",l.rootWidth).attr("height",l.rootHeight)});const z=P({groupScaleDomainValue:i.groupScaleDomainValue$,gridAxesSize:i.gridAxesSize$}).pipe(m(o),G(async l=>l),S(l=>Ue().domain(l.groupScaleDomainValue).range([0,l.gridAxesSize.width]))),M=i.fullChartParams$.pipe(m(o),S(l=>l.highlightTarget),O()),B=de(n,"mousemove").pipe(m(o)),R=P({gridAxesReverseTransform:i.gridAxesReverseTransform$,gridContainerPosition:i.gridContainerPosition$}).pipe(m(o),G(async l=>l),S(l=>{const b=`rotateX(${l.gridAxesReverseTransform.rotateX}deg) rotateY(${l.gridAxesReverseTransform.rotateY}deg)`,T=`rotate(${l.gridAxesReverseTransform.rotate}deg)`,_=`scale(${1/l.gridContainerPosition[0].scale[0]}, ${1/l.gridContainerPosition[0].scale[1]})`;return`${b} ${T} ${_}`}),O()),W=P({textReverseTransform:R,fullParams:i.fullParams$}).pipe(m(o),G(async l=>l),S(l=>`${l.textReverseTransform} rotate(${l.fullParams.labelRotate}deg)`)),x=i.gridContainerPosition$.pipe(m(o),S(l=>l.reduce((T,_)=>_.columnIndex>T?_.columnIndex:T,0)+1),O()),w=i.gridContainerPosition$.pipe(m(o),S(l=>l.reduce((T,_)=>_.rowIndex>T?_.rowIndex:T,0)+1),O()),A=qe({rootSelection:n,fullDataFormatter$:i.fullDataFormatter$,containerSize$:i.containerSize$,gridAxesContainerSize$:i.gridAxesContainerSize$,computedData$:i.computedData$,gridContainerPosition$:i.gridContainerPosition$,layout$:i.layout$}).pipe(m(o));P({axesSelection:L,columnAmount:x,rowAmount:w,layout:i.layout$,rootMousemove:B,gridGroupPosition:A,computedData:i.computedData$,groupScale:z,gridAxesSize:i.gridAxesSize$,fullParams:i.fullParams$,fullDataFormatter:i.fullDataFormatter$,fullChartParams:i.fullChartParams$,highlightTarget:M,textReverseTransformWithRotate:W,GroupDataMap:i.GroupDataMap$,textSizePx:i.textSizePx$}).pipe(m(o),G(async l=>l)).subscribe(l=>{const{groupIndex:b,groupLabel:T}=l.gridGroupPosition,_=l.groupScale(b)??0,H=It({groupLabel:T,axisX:_,axisHeight:l.gridAxesSize.height,fullParams:l.fullParams});Ct({selection:l.axesSelection,pluginName:t,lineData:H,fullParams:l.fullParams,fullChartParams:l.fullChartParams});const N=Gt({groupLabel:T,axisX:_,fullParams:l.fullParams,textSizePx:l.textSizePx,rowAmount:l.rowAmount});Bt({selection:l.axesSelection,labelData:N,fullParams:l.fullParams,fullDataFormatter:l.fullDataFormatter,fullChartParams:l.fullChartParams,textReverseTransformWithRotate:l.textReverseTransformWithRotate,textSizePx:l.textSizePx}).on("mouseover",(k,V)=>{k.stopPropagation(),y=!0,e.event$.next({type:"grid",pluginName:t,eventName:"mouseover",highlightTarget:l.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",group:l.GroupDataMap.get(T)??[],groupIndex:b,groupLabel:T,event:k,data:l.computedData})}).on("mousemove",(k,V)=>{k.stopPropagation(),e.event$.next({type:"grid",pluginName:t,eventName:"mousemove",highlightTarget:l.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",group:l.GroupDataMap.get(T)??[],groupIndex:b,groupLabel:T,event:k,data:l.computedData})}).on("mouseout",(k,V)=>{k.stopPropagation(),y=!1,e.event$.next({type:"grid",pluginName:t,eventName:"mouseout",highlightTarget:l.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",group:l.GroupDataMap.get(T)??[],groupIndex:b,groupLabel:T,event:k,data:l.computedData})}).on("click",(k,V)=>{k.stopPropagation(),e.event$.next({type:"grid",pluginName:t,eventName:"click",highlightTarget:l.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",group:l.GroupDataMap.get(T)??[],groupIndex:b,groupLabel:T,event:k,data:l.computedData})})});const h=de(d,"mouseout").pipe(m(o));return P({rootRectMouseout:h,axesSelection:L}).pipe(m(o),G(async l=>l)).subscribe(l=>{setTimeout(()=>{y!=!0&&(Mt(l.axesSelection),Rt(l.axesSelection))})}),()=>{o.next(void 0),d.remove()}});export{Yt as B,Ht as D,Vt as G,Wt as L,Ot as S,St as a,st as b,ht as c,Et as d,Nt as e};
