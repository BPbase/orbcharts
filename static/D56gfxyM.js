import{S as tt}from"./BriDrTA2.js";import{G as et}from"./r0weBORd.js";import{m as $,M as at,a as it,b as rt,c as st,d as ot,e as nt,f as lt}from"./5E2FGidZ.js";import{m as ut,M as ct,a as dt,S as pt,X as gt,b as mt,c as At,d as Et}from"./C7Z9abg_.js";import{R as _t,a as St,b as Tt}from"./nVk9Xalw.js";import{T as Rt,a as Pt,b as ht,c as Lt}from"./BnwvCHrm.js";import{y as Dt,S as D,D as v,L as b,v as f,t as E,s as T,m as S,d as x,a as y,g as L,b as X,c as w,e as Y,f as It,h as z,i as j,j as I,k as h,w as $t,l as ft,r as xt,n as W,o as bt,p as yt,q as Z,u as Mt,x as F,C as Gt,z as Ct,A as Bt,B as Ot,E as Ft,F as Nt,G as Ut,H as Vt,I as kt,J as Ht,K as vt,M as Xt,N as wt,O as Yt,P as zt,Q as jt,R as Wt,T as Zt,U as Kt,V as qt,W as Jt,X as Qt,Y as te,Z as ee,_ as ae,$ as ie,a0 as re,a1 as se,a2 as oe,a3 as ne,a4 as le,a5 as ue,a6 as ce,a7 as de,a8 as pe,a9 as ge,aa as me,ab as Ae,ac as Ee,ad as _e,ae as Se,af as Te,ag as Re,ah as Pe}from"./Dwexfo5s.js";import{L as he}from"./DwQTsXO_.js";import{c as Le,D as De,G as Ie,L as $e,S as fe}from"./B6aGwh8X.js";import{B as xe}from"./CBMpehba.js";import{c as be}from"./CfjXXqc8.js";import{o as K}from"./CIbwCDbN.js";import{c as ye,S as Me}from"./XOLrCdYI.js";import{c as Ge,B as Ce}from"./2gZ7ltGx.js";import{G as Be}from"./Af0sKrGF.js";import{G as Oe,a as Fe,V as Ne}from"./DAawb37x.js";import{G as Ue}from"./CNB3JtBu.js";import{M as Ve,P as ke}from"./DD4dxt3k.js";import{c as q}from"./Dds0sVy_.js";import{O as He}from"./CTmZDbBu.js";import{B as ve}from"./Ctyjp-M9.js";import{P as Xe,S as we}from"./DMYPvo4Z.js";import{P as Ye}from"./CjXaDvy5.js";import{P as ze,R as je,a as We}from"./CYnQENP6.js";import{S as Ze}from"./C2YISIwJ.js";import{P as Ke,a as qe,b as Je,c as Qe,d as ta,e as ea,f as aa,g as ia,h as ra}from"./jxSGpqQa.js";import{P as sa}from"./BRrqFK4Q.js";import{P as oa}from"./Cc_MHWpl.js";import{P as na}from"./BVzYfoRN.js";import{D as la}from"./8-E0hQaC.js";import{e as ua,u as ca,f as da,o as pa,c as ga}from"./DFIu7zzG.js";import{u as ma}from"./BznNgufG.js";import"./WTQfBP9z.js";import"./B7uJrhWe.js";import"./BPseGaW9.js";import"./Cngx3B8B.js";import"./ByZY14vp.js";import"./CHqHavpo.js";import"./DJcmKy8g.js";import"./BsgDhu_S.js";import"./CO7k2OkK.js";import"./DdT0iQQs.js";const J="BarsPN",Aa={name:J,defaultParams:v,layerIndex:b,validator:(o,{validateColumns:c})=>c(o,{barWidth:{toBeTypes:["number"]},barPadding:{toBeTypes:["number"]},barGroupPadding:{toBeTypes:["number"]},barRadius:{toBeTypes:["number","boolean"]}})},Ea=Dt(Aa)(({selection:o,name:c,subject:s,observer:t})=>{const e=new D,l=be(J,{selection:o,computedData$:t.computedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedData$:t.visibleComputedData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:t.fullParams$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridGraphicReverseScale$:t.gridGraphicReverseScale$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:K(!0),event$:s.event$});return()=>{e.next(void 0),l()}}),M="MultiStackedBar",N=L(M,"grid"),_a={name:M,defaultParams:X,layerIndex:b,validator:(o,{validateColumns:c})=>c(o,{gridIndexes:{toBe:'number[] | "all"',test:t=>t==="all"||Array.isArray(t)&&t.every(e=>typeof e=="number")},barWidth:{toBeTypes:["number"]},barGroupPadding:{toBeTypes:["number"]},barRadius:{toBeTypes:["number","boolean"]}})},Sa=f(_a)(({selection:o,name:c,subject:s,observer:t})=>{const e=new D,l=[];return $(t).pipe(E(e)).subscribe(m=>{l.forEach(a=>a()),o.selectAll(`g.${N}`).data(m).join("g").attr("class",N).each((a,u,r)=>{const n=T(r[u]),p=a.dataFormatter$.pipe(E(e),S(d=>d.separateSeries),x(),y(1));l[u]=ye(M,{selection:n,computedData$:a.computedData$,visibleComputedData$:a.visibleComputedData$,computedLayoutData$:a.computedLayoutData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,seriesLabels$:a.seriesLabels$,SeriesDataMap$:a.SeriesDataMap$,GroupDataMap$:a.GroupDataMap$,fullParams$:t.fullParams$,fullDataFormatter$:a.dataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridGraphicTransform$:a.gridGraphicTransform$,gridGraphicReverseScale$:a.gridGraphicReverseScale$,gridAxesSize$:a.gridAxesSize$,gridHighlight$:a.gridHighlight$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:p,event$:s.event$})})}),()=>{e.next(void 0),l.forEach(m=>m())}}),G="MultiBarsTriangle",U=L(G,"grid"),Ta={name:G,defaultParams:w,layerIndex:b,validator:(o,{validateColumns:c})=>c(o,{gridIndexes:{toBe:'number[] | "all"',test:t=>t==="all"||Array.isArray(t)&&t.every(e=>typeof e=="number")},barWidth:{toBeTypes:["number"]},barPadding:{toBeTypes:["number"]},barGroupPadding:{toBeTypes:["number"]},linearGradientOpacity:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"}})},Ra=f(Ta)(({selection:o,name:c,subject:s,observer:t})=>{const e=new D,l=[];return $(t).pipe(E(e)).subscribe(m=>{l.forEach(a=>a()),o.selectAll(`g.${U}`).data(m).join("g").attr("class",U).each((a,u,r)=>{const n=T(r[u]),p=a.dataFormatter$.pipe(E(e),S(d=>d.separateSeries),x(),y(1));l[u]=Ge(G,{selection:n,computedData$:a.computedData$,visibleComputedData$:a.visibleComputedData$,computedLayoutData$:a.computedLayoutData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,seriesLabels$:a.seriesLabels$,SeriesDataMap$:a.SeriesDataMap$,GroupDataMap$:a.GroupDataMap$,fullParams$:t.fullParams$,fullChartParams$:t.fullChartParams$,fullDataFormatter$:a.dataFormatter$,gridAxesTransform$:a.gridAxesTransform$,gridGraphicTransform$:a.gridGraphicTransform$,gridAxesSize$:a.gridAxesSize$,gridHighlight$:a.gridHighlight$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:p,event$:s.event$})})}),()=>{e.next(void 0),l.forEach(m=>m())}}),C="MultiLineAreas",V=L(C,"grid"),Pa={name:C,defaultParams:Y,layerIndex:It,validator:(o,{validateColumns:c})=>c(o,{gridIndexes:{toBe:'number[] | "all"',test:t=>t==="all"||Array.isArray(t)&&t.every(e=>typeof e=="number")},lineCurve:{toBeTypes:["string"]},linearGradientOpacity:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"}})},ha=f(Pa)(({selection:o,name:c,subject:s,observer:t})=>{const e=new D,l=[],_=t.multiGridContainerPosition$.pipe(E(e),S(a=>a.flat()));return $(t).pipe(E(e)).subscribe(a=>{l.forEach(u=>u()),o.selectAll(`g.${V}`).data(a).join("g").attr("class",V).each((u,r,n)=>{const p=T(n[r]);l[r]=Le(C,{selection:p,computedData$:u.computedData$,computedLayoutData$:u.computedLayoutData$,visibleComputedData$:u.visibleComputedData$,visibleComputedLayoutData$:u.visibleComputedLayoutData$,seriesLabels$:u.seriesLabels$,SeriesDataMap$:u.SeriesDataMap$,GroupDataMap$:u.GroupDataMap$,fullDataFormatter$:u.dataFormatter$,fullParams$:t.fullParams$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:u.gridAxesTransform$,gridGraphicTransform$:u.gridGraphicTransform$,gridAxesSize$:u.gridAxesSize$,gridHighlight$:u.gridHighlight$,gridContainerPosition$:u.gridContainerPosition$,allContainerPosition$:_,layout$:t.layout$,event$:s.event$})})}),()=>{e.next(void 0),l.forEach(a=>a())}}),B="MultiStackedValueAxis",k=L(B,"grid"),La={name:B,defaultParams:z,layerIndex:j,validator:(o,{validateColumns:c})=>c(o,{gridIndexes:{toBe:'number[] | "all"',test:t=>t==="all"||Array.isArray(t)&&t.every(e=>typeof e=="number")},labelOffset:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number","null"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}})},Da=f(La)(({selection:o,name:c,subject:s,observer:t})=>{const e=new D,l=[];return $(t).pipe(E(e)).subscribe(m=>{l.forEach(a=>a()),o.selectAll(`g.${k}`).data(m).join("g").attr("class",k).each((a,u,r)=>{const n=T(r[u]),p=a.dataFormatter$.pipe(E(e),S(d=>d.separateSeries),x(),y(1));l[u]=q(B,{selection:n,computedData$:a.computedStackedData$,filteredMinMaxValue$:a.filteredMinMaxValue$,fullParams$:t.fullParams$,fullDataFormatter$:a.dataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridAxesReverseTransform$:a.gridAxesReverseTransform$,gridAxesSize$:a.gridAxesSize$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:p})})}),()=>{e.next(void 0),l.forEach(m=>m())}}),O="OverlappingStackedValueAxes",H=L(O,"grid"),Ia={name:O,defaultParams:W,layerIndex:j,validator:(o,{validateColumns:c})=>{const s=c(o,{firstAxis:{toBeTypes:["object"]},secondAxis:{toBeTypes:["object"]},gridIndexes:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2}});if(o.firstAxis){const t=c(o.firstAxis,{labelOffset:{toBe:"[number, number]",test:e=>Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}});if(t.status==="error")return t}if(o.secondAxis){const t=c(o.secondAxis,{labelOffset:{toBe:"[number, number]",test:e=>Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}});if(t.status==="error")return t}return s}},$a=f(Ia)(({selection:o,name:c,subject:s,observer:t})=>{const e=new D,l=[],_=t.fullParams$.pipe(E(e),S(r=>r.gridIndexes[0])),m=t.fullParams$.pipe(E(e),S(r=>r.gridIndexes[1])),a=I({firstGridIndex:_,secondGridIndex:m,fullDataFormatter:t.fullDataFormatter$}).pipe(E(e),h(async r=>r),S(r=>{r.fullDataFormatter.gridList[r.secondGridIndex]||(r.fullDataFormatter.gridList[r.secondGridIndex]=Object.assign({},r.fullDataFormatter.gridList[r.firstGridIndex]));const n=r.fullDataFormatter.gridList[r.firstGridIndex].valueAxis.position;let p=n;return n==="left"?p="right":n==="bottom"?p="top":n==="top"?p="bottom":n==="right"&&(p="left"),{type:"grid",visibleFilter:r.fullDataFormatter.visibleFilter,...r.fullDataFormatter.gridList[r.secondGridIndex],valueAxis:{...r.fullDataFormatter.gridList[r.secondGridIndex].valueAxis,position:p},container:{...r.fullDataFormatter.container}}}));return K(t).pipe(E(e),S(r=>({...r,fullParams$:r.fullParams$.pipe(S(n=>(n.gridIndexes.length>2&&(n.gridIndexes.length=2),n)))})),h(r=>$(r)),S(r=>r.map((n,p)=>{if(p===0)return n;const d=$t({fullDataFormatter$:a,layout$:t.layout$}),P=ft({gridAxesTransform$:d}),i=xt({computedData$:n.computedData$,fullDataFormatter$:a,layout$:t.layout$});return{...n,dataFormatter$:a,gridAxesTransform$:d,gridAxesReverseTransform$:P,gridContainerPosition$:i}}))).pipe(E(e)).subscribe(r=>{l.forEach(n=>n()),o.selectAll(`g.${H}`).data(r).join("g").attr("class",H).each((n,p,d)=>{if(p>1)return;const P=T(d[p]);l[p]=q(O,{selection:P,computedData$:p===0?n.computedStackedData$:n.computedData$,filteredMinMaxValue$:n.filteredMinMaxValue$,fullParams$:t.fullParams$.pipe(S(i=>p===0?i.firstAxis:i.secondAxis)),fullDataFormatter$:n.dataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:n.gridAxesTransform$,gridAxesReverseTransform$:n.gridAxesReverseTransform$,gridAxesSize$:n.gridAxesSize$,gridContainerPosition$:n.gridContainerPosition$,isSeriesSeprate$:n.isSeriesSeprate$})})}),()=>{e.next(void 0),l.forEach(r=>r())}}),R="Scatter",fa={name:R,defaultParams:Z,layerIndex:Mt,validator:(o,{validateColumns:c})=>c(o,{radius:{toBeTypes:["number"]},fillColorType:{toBeOption:"ColorType"},strokeColorType:{toBeOption:"ColorType"},strokeWidth:{toBeTypes:["number"]}})};function xa({graphicGSelection:o,circleGClassName:c,circleClassName:s,visibleComputedLayoutData:t,fullParams:e,fullChartParams:l,graphicReverseScale:_}){const m=r=>{const n=r.size();return l.transitionDuration/n};let a=0;return o.each((r,n,p)=>{T(p[n]).selectAll("g").data(t[n],d=>d.id).join(d=>(a=m(d),d.append("g").classed(c,!0)),d=>d,d=>d.remove()).attr("transform",d=>`translate(${d.axisX}, ${d.axisY})`).each((d,P,i)=>{T(i[P]).selectAll("circle").data([d]).join(A=>A.append("circle").style("cursor","pointer").style("vector-effect","non-scaling-stroke").classed(s,!0).attr("opacity",0).transition().delay((g,_i)=>P*a).attr("opacity",1),A=>A.transition().duration(50).attr("opacity",1),A=>A.remove()).attr("r",e.radius).attr("fill",(A,g)=>F({datum:A,colorType:e.fillColorType,fullChartParams:l})).attr("stroke",(A,g)=>F({datum:A,colorType:e.strokeColorType,fullChartParams:l})).attr("stroke-width",e.strokeWidth).attr("transform",`scale(${_[n][0]??1}, ${_[n][1]??1})`)})}),o.selectAll(`circle.${s}`)}function ba({selection:o,ids:c,fullChartParams:s}){if(o.interrupt("highlight"),!c.length){o.transition("highlight").duration(200).style("opacity",1);return}o.each((t,e,l)=>{c.includes(t.id)?T(l[e]).style("opacity",1).transition("highlight").duration(200):T(l[e]).style("opacity",s.styles.unhighlightedOpacity).transition("highlight").duration(200)})}function ya({defsSelection:o,clipPathData:c}){o.selectAll("clipPath").data(c).join(s=>s.append("clipPath"),s=>s,s=>s.remove()).attr("id",s=>s.id).each((s,t,e)=>{T(e[t]).selectAll("rect").data([s]).join("rect").attr("x",0).attr("y",0).attr("width",l=>l.width).attr("height",l=>l.height)})}const Ma=bt(fa)(({selection:o,name:c,subject:s,observer:t})=>{const e=new D,l=yt(R,"clipPath-box"),_=L(R,"circleG"),m=L(R,"circle"),{categorySelection$:a,axesSelection$:u,defsSelection$:r,graphicGSelection$:n}=ut({selection:o,pluginName:R,clipPathID:l,categoryLabels$:t.categoryLabels$,multiValueContainerPosition$:t.multiValueContainerPosition$,multiValueGraphicTransform$:t.multiValueGraphicTransform$}),p=I({computedData:t.computedData$,multiValueGraphicReverseScale:t.multiValueGraphicReverseScale$}).pipe(E(e),h(async i=>i),S(i=>i.computedData.map((A,g)=>i.multiValueGraphicReverseScale[g])));I({defsSelection:r,layout:t.layout$}).pipe(E(e),h(async i=>i)).subscribe(i=>{const A=[{id:l,width:i.layout.width,height:i.layout.height}];ya({defsSelection:i.defsSelection,clipPathData:A})});const d=I({graphicGSelection:n,visibleComputedLayoutData:t.visibleComputedLayoutData$,graphicReverseScale:p,fullChartParams:t.fullChartParams$,fullParams:t.fullParams$}).pipe(E(e),h(async i=>i),S(i=>xa({graphicGSelection:i.graphicGSelection,circleGClassName:_,circleClassName:m,visibleComputedLayoutData:i.visibleComputedLayoutData,fullParams:i.fullParams,fullChartParams:i.fullChartParams,graphicReverseScale:i.graphicReverseScale}))),P=t.fullChartParams$.pipe(E(e),S(i=>i.highlightTarget),x());return I({graphicSelection:d,computedData:t.computedData$,CategoryDataMap:t.CategoryDataMap$,highlightTarget:P}).pipe(E(e),h(async i=>i)).subscribe(i=>{i.graphicSelection.on("mouseover",(A,g)=>{s.event$.next({type:"multiValue",eventName:"mouseover",pluginName:R,highlightTarget:i.highlightTarget,datum:g,category:i.CategoryDataMap.get(g.categoryLabel),categoryIndex:g.categoryIndex,categoryLabel:g.categoryLabel,data:i.computedData,event:A})}).on("mousemove",(A,g)=>{s.event$.next({type:"multiValue",eventName:"mousemove",pluginName:R,highlightTarget:i.highlightTarget,datum:g,category:i.CategoryDataMap.get(g.categoryLabel),categoryIndex:g.categoryIndex,categoryLabel:g.categoryLabel,data:i.computedData,event:A})}).on("mouseout",(A,g)=>{s.event$.next({type:"multiValue",eventName:"mouseout",pluginName:R,highlightTarget:i.highlightTarget,datum:g,category:i.CategoryDataMap.get(g.categoryLabel),categoryIndex:g.categoryIndex,categoryLabel:g.categoryLabel,data:i.computedData,event:A})}).on("click",(A,g)=>{s.event$.next({type:"multiValue",eventName:"click",pluginName:R,highlightTarget:i.highlightTarget,datum:g,category:i.CategoryDataMap.get(g.categoryLabel),categoryIndex:g.categoryIndex,categoryLabel:g.categoryLabel,data:i.computedData,event:A})})}),I({graphicSelection:d,highlight:t.multiValueHighlight$.pipe(S(i=>i.map(A=>A.id))),fullChartParams:t.fullChartParams$}).pipe(E(e),h(async i=>i)).subscribe(i=>{ba({selection:i.graphicSelection,ids:i.highlight,fullChartParams:i.fullChartParams})}),()=>{e.next(void 0)}}),Ga=Object.freeze(Object.defineProperty({__proto__:null,Bars:xe,BarsPN:Ea,BarsTriangle:Ce,Bubbles:ve,CONTAINER_PLUGIN_PARAMS:Gt,DEFAULT_BARS_DIVERGING_PARAMS:Ct,DEFAULT_BARS_PARAMS:v,DEFAULT_BARS_TRIANGLE_PARAMS:Bt,DEFAULT_BUBBLES_PARAMS:Ot,DEFAULT_DOTS_PARAMS:Ft,DEFAULT_FORCE_DIRECTED_PARAMS:Nt,DEFAULT_GRID_LEGEND_PARAMS:Ut,DEFAULT_GRID_TOOLTIP_PARAMS:Vt,DEFAULT_GRID_ZOOM_PARAMS:kt,DEFAULT_GROUP_AUX_PARAMS:Ht,DEFAULT_GROUP_AXIS_PARAMS:vt,DEFAULT_LINES_PARAMS:Xt,DEFAULT_LINE_AREAS_PARAMS:wt,DEFAULT_MULTI_BARS_PARAMS:Yt,DEFAULT_MULTI_BARS_TRIANGLE_PARAMS:w,DEFAULT_MULTI_DOTS_PARAMS:zt,DEFAULT_MULTI_GRID_LEGEND_PARAMS:jt,DEFAULT_MULTI_GRID_TOOLTIP_PARAMS:Wt,DEFAULT_MULTI_GROUP_AXIS_PARAMS:Zt,DEFAULT_MULTI_LINES_PARAMS:Kt,DEFAULT_MULTI_LINE_AREAS_PARAMS:Y,DEFAULT_MULTI_STACKED_BAR_PARAMS:X,DEFAULT_MULTI_STACKED_VALUE_AXIS_PARAMS:qt,DEFAULT_MULTI_VALUE_AXIS_PARAMS:z,DEFAULT_MULTI_VALUE_LEGEND_PARAMS:Jt,DEFAULT_MULTI_VALUE_TOOLTIP_PARAMS:Qt,DEFAULT_OVERLAPPING_STACKED_VALUE_AXES_PARAMS:W,DEFAULT_OVERLAPPING_VALUE_AXES_PARAMS:te,DEFAULT_PIE_EVENT_TEXTS_PARAMS:ee,DEFAULT_PIE_LABELS_PARAMS:ae,DEFAULT_PIE_PARAMS:ie,DEFAULT_RELATIONSHIP_LEGEND_PARAMS:re,DEFAULT_RELATIONSHIP_TOOLTIP_PARAMS:se,DEFAULT_ROSE_LABELS_PARAMS:oe,DEFAULT_ROSE_PARAMS:ne,DEFAULT_SCATTER_BUBBLES_PARAMS:le,DEFAULT_SCATTER_PARAMS:Z,DEFAULT_SERIES_LEGEND_PARAMS:ue,DEFAULT_SERIES_TOOLTIP_PARAMS:ce,DEFAULT_STACKED_BAR_PARAMS:de,DEFAULT_STACKED_VALUE_AXIS_PARAMS:pe,DEFAULT_TREE_LEGEND_PARAMS:ge,DEFAULT_TREE_MAP_PARAMS:me,DEFAULT_TREE_TOOLTIP_PARAMS:Ae,DEFAULT_VALUE_AXIS_PARAMS:Ee,DEFAULT_X_Y_AUX_PARAMS:_e,DEFAULT_X_Y_AXES_PARAMS:Se,DEFAULT_X_Y_ZOOM_PARAMS:Te,Dots:De,ForceDirected:Re,GridLegend:Be,GridTooltip:Oe,GridZoom:Ue,GroupAux:Ie,GroupAxis:Fe,LineAreas:$e,Lines:he,MultiBars:at,MultiBarsTriangle:Ra,MultiDots:it,MultiGridLegend:rt,MultiGridTooltip:Ve,MultiGroupAxis:st,MultiLineAreas:ha,MultiLines:ot,MultiStackedBar:Sa,MultiStackedValueAxis:Da,MultiValueAxis:nt,MultiValueLegend:ct,MultiValueTooltip:dt,OverlappingStackedValueAxes:$a,OverlappingValueAxes:He,Pie:Xe,PieEventTexts:Ye,PieLabels:ze,RelationshipLegend:_t,RelationshipTooltip:St,Rose:je,RoseLabels:We,Scatter:Ma,ScatterBubbles:pt,SeriesLegend:we,SeriesTooltip:Ze,StackedBar:Me,StackedValueAxis:fe,TOOLTIP_PARAMS:Pe,TreeLegend:Rt,TreeMap:Pt,TreeTooltip:ht,ValueAxis:Ne,XYAux:gt,XYAxes:mt,XYZoom:At},Symbol.toStringTag,{value:"Module"})),Ca={name:"PRESET_BUBBLES_SCALING_BY_RADIUS",description:"以半徑尺寸為比例的泡泡圖",allPluginParams:{Bubbles:{arcScaleType:"radius"},SeriesLegend:{listRectRadius:7}}},Ba={name:"PRESET_BUBBLES_SEPARATE_SERIES",description:"分開顯示Series泡泡",chartParams:{padding:{top:160,right:160,bottom:160,left:160}},dataFormatter:{separateSeries:!0},allPluginParams:{Bubbles:{},SeriesLegend:{listRectRadius:7},SeriesTooltip:{}}},Oa={name:"PRESET_SERIES_BASIC",description:"基本Series參數",allPluginParams:{SeriesLegend:{listRectRadius:7}}},Fa={name:"PRESET_BARS_HORIZONTAL_AND_ROUND",description:"橫向圓角長條圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160}},dataFormatter:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}},allPluginParams:{Bars:{barWidth:0,barPadding:1,barGroupPadding:10,barRadius:!0},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectRadius:7}}},Na={name:"PRESET_BARS_HORIZONTAL_AND_THIN",description:"橫向細長長條圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160}},dataFormatter:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}},allPluginParams:{Bars:{barWidth:20,barPadding:1,barGroupPadding:10},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14}}},Ua={name:"PRESET_BARS_THIN",description:"細長條圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},allPluginParams:{Bars:{barWidth:20,barPadding:1,barGroupPadding:10},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14}}},Va={name:"PRESET_GRID_HORIZONTAL",description:"橫向圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160}},dataFormatter:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}},allPluginParams:{GridLegend:{placement:"bottom",padding:14}}},ka={name:"PRESET_GRID_PN_SCALE",description:"正負值分向圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},dataFormatter:{valueAxis:{scaleDomain:["auto","auto"],scaleRange:[.05,.95]}},allPluginParams:{GridLegend:{placement:"bottom",padding:14}}},Ha={name:"PRESET_GRID_ROTATE_AXIS_LABEL",description:"傾斜標籤",chartParams:{padding:{top:60,right:60,bottom:160,left:60}},allPluginParams:{GroupAux:{labelRotate:-30},GroupAxis:{tickPadding:15,tickTextRotate:-30},GridLegend:{placement:"bottom",padding:14}}},va={name:"PRESET_LINE_AREAS_BASIC",description:"基本LineArea參數",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},dataFormatter:{groupAxis:{scalePadding:0}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Xa={name:"PRESET_LINE_AREAS_CURVE",description:"弧線折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},dataFormatter:{groupAxis:{scalePadding:0}},allPluginParams:{Lines:{lineCurve:"curveMonotoneX",lineWidth:3},LineAreas:{lineCurve:"curveMonotoneX"},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},wa={name:"PRESET_LINE_AREAS_HORIZONTAL",description:"橫向折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160},highlightTarget:"series"},dataFormatter:{valueAxis:{position:"bottom"},groupAxis:{position:"left",scalePadding:0}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Ya={name:"PRESET_LINE_AREAS_LOOSE_TICKS",description:"寬鬆標籤",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},dataFormatter:{groupAxis:{scalePadding:0}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{ticks:6},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},za={name:"PRESET_LINE_AREAS_ROTATE_AXIS_LABEL",description:"傾斜標籤",chartParams:{padding:{top:60,right:60,bottom:160,left:60},highlightTarget:"series"},dataFormatter:{groupAxis:{scalePadding:0}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{tickPadding:15,tickTextRotate:-30},ValueAxis:{},GroupAux:{labelRotate:-30},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},ja={name:"PRESET_LINE_AREAS_SEPARATE_SERIES",description:"LineAreas 分開顯示Series",chartParams:{padding:{top:60,right:60,bottom:160,left:60},highlightTarget:"series"},dataFormatter:{separateSeries:!0,groupAxis:{scalePadding:0}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{tickPadding:15,tickTextRotate:-30},ValueAxis:{},GroupAux:{labelRotate:-30},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Wa={name:"PRESET_LINES_BASIC",description:"基本Lines參數",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{Lines:{},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Za={name:"PRESET_LINES_CURVE",description:"弧線折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{Lines:{lineCurve:"curveMonotoneX",lineWidth:3},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Ka={name:"PRESET_LINES_HORIZONTAL",description:"橫向折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160},highlightTarget:"series"},dataFormatter:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}},allPluginParams:{Lines:{},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},qa={name:"PRESET_LINES_LOOSE_TICKS",description:"寬鬆標籤",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{Lines:{},Dots:{},GroupAxis:{ticks:6},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Ja={name:"PRESET_LINES_ROTATE_AXIS_LABEL",description:"傾斜標籤",chartParams:{padding:{top:60,right:60,bottom:160,left:60},highlightTarget:"series"},allPluginParams:{Lines:{},Dots:{},GroupAxis:{tickPadding:15,tickTextRotate:-30},ValueAxis:{},GroupAux:{labelRotate:-30},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Qa={name:"PRESET_LINES_WITH_SOLID_DOTS",description:"折線圖及實心圓點",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{Lines:{},Dots:{radius:3,fillColorType:"label",onlyShowHighlighted:!1},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},ti={name:"PRESET_MULTI_GRID_BASIC",description:"基本MultiGrid參數",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{MultiGridLegend:{placement:"bottom",padding:14,gridList:[{},{listRectHeight:2}]}}},ei={name:"PRESET_MULTI_GRID_DIVERGING",description:"雙向折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},dataFormatter:{gridList:[{groupAxis:{position:"right"},valueAxis:{position:"bottom"}},{groupAxis:{position:"left"},valueAxis:{position:"bottom"}}],container:{gap:200,rowAmount:1,columnAmount:2},separateGrid:!0},allPluginParams:{MultiGroupAxis:{tickPadding:60,gridIndexes:[0]},MultiValueAxis:{gridIndexes:[0,1]},MultiStackedValueAxis:{gridIndexes:[0,1]},MultiBars:{gridIndexes:[0,1]},MultiStackedBar:{gridIndexes:[0,1]},MultiBarsTriangle:{gridIndexes:[0,1]},MultiLines:{gridIndexes:[0,1]},MultiLineAreas:{gridIndexes:[0,1]},MultiDots:{gridIndexes:[0,1]},MultiGridLegend:{placement:"bottom",padding:14}}},ai={name:"PRESET_MULTI_GRID_ROUND_STYLE",description:"MultiGrid圓弧風格",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{MultiBars:{barWidth:0,barPadding:1,barGroupPadding:10,barRadius:!0},MultiStackedBar:{},MultiDots:{},MultiGridLegend:{placement:"bottom",padding:14,gridList:[{listRectRadius:7},{listRectHeight:2}]},MultiGroupAxis:{},MultiLineAreas:{},MultiLines:{lineCurve:"curveMonotoneX",lineWidth:3},MultiValueAxis:{},MultiStackedValueAxis:{},OverlappingValueAxes:{},OverlappingStackedValueAxes:{}}},Q={},ii={name:"PRESET_MULTI_LINE_AREAS_SEPARATE_GRID",description:"2組區域圖表",chartParams:{padding:{top:60,right:60,bottom:160,left:60}},dataFormatter:{gridList:[{groupAxis:{scalePadding:0}},{groupAxis:{scalePadding:0}}],separateGrid:!0},allPluginParams:{...Q,MultiGroupAxis:{tickTextRotate:-30,gridIndexes:"all"},MultiValueAxis:{gridIndexes:"all"},MultiStackedValueAxis:{gridIndexes:"all"},MultiBars:{gridIndexes:"all"},MultiStackedBar:{gridIndexes:"all"},MultiBarsTriangle:{gridIndexes:"all"},MultiLines:{gridIndexes:"all"},MultiLineAreas:{gridIndexes:"all"},MultiDots:{gridIndexes:"all"},MultiGridLegend:{placement:"bottom",padding:14,gridList:[{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2}]}}},ri={name:"PRESET_MULTI_LINES_SEPARATE_GRID",description:"多組分開折線圖表",chartParams:{padding:{top:60,right:60,bottom:160,left:60}},dataFormatter:{separateGrid:!0},allPluginParams:{...Q,MultiGroupAxis:{tickTextRotate:-30,gridIndexes:"all"},MultiValueAxis:{gridIndexes:"all"},MultiStackedValueAxis:{gridIndexes:"all"},MultiBars:{gridIndexes:"all"},MultiStackedBar:{gridIndexes:"all"},MultiBarsTriangle:{gridIndexes:"all"},MultiLines:{gridIndexes:"all"},MultiLineAreas:{gridIndexes:"all"},MultiDots:{gridIndexes:"all"},MultiGridLegend:{placement:"bottom",padding:14,gridList:[{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2}]}}},si={name:"PRESET_MULTI_VALUE_BASIC",description:"基本MultiValue參數",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},allPluginParams:{MultiValueLegend:{placement:"bottom",padding:14}}},oi={name:"PRESET_MULTI_VALUE_SEPARATE_CATEGORY",description:"MultiValue 分開顯示category",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},dataFormatter:{separateCategory:!0},allPluginParams:{MultiValueLegend:{placement:"bottom",padding:14}}},ni={name:"PRESET_SCATTER_BUBBLES_SCALING_BY_RADIUS",description:"ScatterBubbles以半徑尺寸為比例",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},allPluginParams:{MultiValueLegend:{placement:"bottom",padding:14},ScatterBubbles:{arcScaleType:"radius"}}},li={name:"PRESET_SCATTER_BUBBLES_LINEAR_OPACITY",description:"ScatterBubbles漸變透明度",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},allPluginParams:{MultiValueLegend:{placement:"bottom",padding:14},ScatterBubbles:{valueLinearOpacity:[.6,.95]}}},ui={name:"PRESET_FORCE_DIRECTED_BASIC",description:"基本Force Directed參數",allPluginParams:{ForceDirected:{},RelationshipLegend:{listRectRadius:7}}},ci={name:"PRESET_FORCE_DIRECTED_NONE_ZOOM",description:"基本Force Directed參數",allPluginParams:{ForceDirected:{zoomable:!1},RelationshipLegend:{listRectRadius:7}}},di={name:"PRESET_FORCE_DIRECTED_FIX_FONT_SIZE",description:"基本Force Directed參數",allPluginParams:{ForceDirected:{node:{labelSizeFixed:!0},edge:{labelSizeFixed:!0}},RelationshipLegend:{listRectRadius:7}}},pi={name:"PRESET_FORCE_DIRECTED_NONE_ARROW",description:"基本Force Directed參數",allPluginParams:{ForceDirected:{edge:{arrowWidth:0,arrowHeight:0}},RelationshipLegend:{listRectRadius:7}}},gi={name:"PRESET_TREE_MAP_BASIC",description:"基本Tree Map參數",chartParams:{padding:{top:40,right:40,bottom:60,left:40}},allPluginParams:{TreeMap:{},TreeLegend:{placement:"bottom",padding:14}}},mi=Object.freeze(Object.defineProperty({__proto__:null,PRESET_BARS_HORIZONTAL_AND_ROUND:Fa,PRESET_BARS_HORIZONTAL_AND_THIN:Na,PRESET_BARS_ROUND:sa,PRESET_BARS_THIN:Ua,PRESET_BUBBLES_SCALING_BY_RADIUS:Ca,PRESET_BUBBLES_SEPARATE_SERIES:Ba,PRESET_FORCE_DIRECTED_BASIC:ui,PRESET_FORCE_DIRECTED_FIX_FONT_SIZE:di,PRESET_FORCE_DIRECTED_NONE_ARROW:pi,PRESET_FORCE_DIRECTED_NONE_ZOOM:ci,PRESET_GRID_BASIC:oa,PRESET_GRID_HORIZONTAL:Va,PRESET_GRID_PN_SCALE:ka,PRESET_GRID_ROTATE_AXIS_LABEL:Ha,PRESET_GRID_SEPARATE_SERIES:na,PRESET_LINES_BASIC:Wa,PRESET_LINES_CURVE:Za,PRESET_LINES_HORIZONTAL:Ka,PRESET_LINES_LOOSE_TICKS:qa,PRESET_LINES_ROTATE_AXIS_LABEL:Ja,PRESET_LINES_WITH_SOLID_DOTS:Qa,PRESET_LINE_AREAS_BASIC:va,PRESET_LINE_AREAS_CURVE:Xa,PRESET_LINE_AREAS_HORIZONTAL:wa,PRESET_LINE_AREAS_LOOSE_TICKS:Ya,PRESET_LINE_AREAS_ROTATE_AXIS_LABEL:za,PRESET_LINE_AREAS_SEPARATE_SERIES:ja,PRESET_MULTI_GRID_BASIC:ti,PRESET_MULTI_GRID_DIVERGING:ei,PRESET_MULTI_GRID_ROUND_STYLE:ai,PRESET_MULTI_GRID_SEPARATE_GRID:ke,PRESET_MULTI_LINES_SEPARATE_GRID:ri,PRESET_MULTI_LINE_AREAS_SEPARATE_GRID:ii,PRESET_MULTI_VALUE_BASIC:si,PRESET_MULTI_VALUE_SEPARATE_CATEGORY:oi,PRESET_PIE_BASIC:Ke,PRESET_PIE_DONUT:qe,PRESET_PIE_HALF_DONUT:Je,PRESET_PIE_WITH_INNER_LABELS:Qe,PRESET_ROSE_BASIC:ta,PRESET_ROSE_SCALING_BY_RADIUS:ea,PRESET_SCATTER_BUBBLES_LINEAR_OPACITY:li,PRESET_SCATTER_BUBBLES_SCALING_BY_RADIUS:ni,PRESET_SERIES_BASIC:Oa,PRESET_SERIES_SEPARATE_SERIES:aa,PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES:ia,PRESET_SERIES_SUM_SERIES:ra,PRESET_TREE_MAP_BASIC:gi},Symbol.toStringTag,{value:"Module"}));async function Ai({chartType:o,pluginNames:c,presetName:s}){const t=la.find(u=>u.chartType===o),e=t==null?void 0:t.list.find(u=>u.mainPluginNames.join(",")===c.join(",")),l=(e==null?void 0:e.list.find(u=>u.presetName===s))??null;if(!l)return null;const _=l.allPluginNames.map(u=>{const r=Ga[u];return new r}),{default:m}=await l.getData();return{preset:mi[s],plugins:_,data:m}}const Ei={id:"chart",style:{width:"100%",height:"100%"}},or=ua({__name:"[presetName]",setup(o){const s=ca().params;return ma({title:s.pluginName}),da(async()=>{const t=await Ai({chartType:s.chartType,pluginNames:s.pluginName.split(","),presetName:s.presetName});if(!t){console.error("demoData not found");return}const l={series:tt,grid:et,multiGrid:lt,multiValue:Et,relationship:Tt,tree:Lt}[s.chartType],_=document.querySelector("#chart"),m=new l(_,{preset:t.preset});m.plugins$.next(t.plugins),m.data$.next(t.data)}),(t,e)=>(pa(),ga("div",Ei))}});export{or as default};
