import{S as tt}from"./DmoGU6Vx.js";import{G as et}from"./Z7cQtAAS.js";import{m as I,M as at,a as it,b as rt,c as st,d as ot,e as nt,f as lt}from"./BQjnXl-9.js";import{m as ut,M as dt,a as ct,S as pt,X as gt,b as mt,c as At,d as Et}from"./KJ_5walk.js";import{A as _t,D as St,p as Tt,S as $,a as v,L as b,d as D,t as _,s as T,m as S,b as x,c as y,e as X,f as w,g as Y,h as Pt,i as j,j as z,k as f,l as h,w as Rt,n as ht,r as Lt,o as W,q as $t,u as Z,v as ft,C as It,x as Dt,y as xt,z as bt,B as yt,E as Mt,F as Gt,G as Bt,H as Ct,I as Nt,J as Ut,K as Ft,M as Ot,N as Vt,O as kt,P as Ht,Q as vt,R as Xt,T as wt,U as Yt,V as jt,W as zt,X as Wt,Y as Zt,Z as Kt,_ as qt,$ as Jt,a0 as Qt,a1 as te,a2 as ee,a3 as ae,a4 as ie,a5 as re,a6 as se,a7 as oe,a8 as ne,a9 as le,aa as ue,ab as de,ac as ce}from"./Dh2HIxf9.js";import{T as pe,a as ge,b as me,c as Ae}from"./B_qY48_U.js";import{L as Ee}from"./JDXoJ0sD.js";import{c as _e,D as Se,G as Te,L as Pe,V as Re}from"./BYCTkSPf.js";import{B as he}from"./B_1yZaOW.js";import{c as Le}from"./B2qvV4JZ.js";import{o as K}from"./CI_cX0XP.js";import{c as $e,B as fe}from"./BgUNiOxS.js";import{c as Ie,B as De}from"./F86Q-wTd.js";import{G as xe}from"./B3WW6BtS.js";import{G as be,a as ye,V as Me}from"./BbW7QRQ9.js";import{G as Ge}from"./aTRNi1FN.js";import{g as L,a as Be,b as U}from"./2zdWaanV.js";import{M as Ce,P as Ne}from"./Dwsvq3lt.js";import{c as q}from"./vPaWCS1v.js";import{O as Ue}from"./CGtf4kwh.js";import{B as Fe}from"./tNszz0-Z.js";import{P as Oe,S as Ve}from"./CUoRVxLn.js";import{P as ke}from"./BrGe2MUe.js";import{P as He,R as ve,a as Xe}from"./D6ZnOKrs.js";import{S as we}from"./Bdaohbb4.js";import{P as Ye,a as je,b as ze,c as We,d as Ze,e as Ke,f as qe,g as Je,h as Qe}from"./jxSGpqQa.js";import{P as ta}from"./BRrqFK4Q.js";import{P as ea}from"./Cc_MHWpl.js";import{P as aa}from"./CTZlNuVH.js";import{D as ia}from"./D8jFtsR8.js";import{e as ra,u as sa,f as oa,o as na,c as la}from"./vhe1d5S_.js";import{u as ua}from"./wQD3UP3s.js";import"./BqHtTwBw.js";import"./Cv4SEgNo.js";import"./BdQNpCo1.js";import"./E19rGNXz.js";import"./8z5i525a.js";import"./CkpYqoar.js";import"./CYPt39Eq.js";import"./vO0dTazL.js";import"./DdT0iQQs.js";import"./CTmab9gO.js";import"./BgLAXcIT.js";const da=s=>({status:"success",columnName:"",expectToBe:""}),ca=s=>{const{data:u,dataFormatter:o,chartParams:t}=s;let a=[],l=[];try{let A=[],g=[];if(u.nodes)A=u.nodes,g=u.edges;else if(u[0])A=u[0],g=u[1];else return{nodes:[],edges:[]};a=A.map((e,d)=>({id:e.id,index:d,label:e.label??"",description:e.description??"",data:e.data??{},value:e.value??0,categoryIndex:0,categoryLabel:"",color:"",startNodes:[],startNodeIds:[],endNodes:[],endNodeIds:[],visible:!0}));const i=new Map(a.map(e=>[e.id,e]));l=g.map((e,d)=>({id:e.id,index:d,label:e.label??"",description:e.description??"",data:e.data??{},startNode:i.get(e.start),startNodeId:e.start,endNode:i.get(e.end),endNodeId:e.end,visible:!0}));const p=function(){const e=new Map;return l.forEach(d=>{const c=e.get(d.endNodeId)??[];c.push(d.startNode),e.set(d.endNodeId,c)}),e}(),n=function(){const e=new Map;return l.forEach(d=>{const c=e.get(d.startNodeId)??[];c.push(d.endNode),e.set(d.startNodeId,c)}),e}();Array.from(i).forEach(([e,d])=>{d.startNodes=p.get(e),d.startNodeIds=d.startNodes.map(c=>c.id),d.endNodes=n.get(e),d.endNodeIds=d.endNodes.map(c=>c.id),d.visible=o.visibleFilter(d,s)}),l=l.map(e=>(e.visible=!!(e.startNode.visible&&e.endNode.visible),e))}catch(A){throw Error(A)}return{nodes:a,edges:l}},pa=s=>({status:"success",columnName:"",expectToBe:""}),ga=({subject:s,observer:u})=>({fullParams$:u.fullParams$,fullChartParams$:u.fullChartParams$,fullDataFormatter$:u.fullDataFormatter$,computedData$:u.computedData$,layout$:u.layout$});class ma extends _t{constructor(u,o){super({defaultDataFormatter:St,dataFormatterValidator:da,computedDataFn:ca,dataValidator:pa,contextObserverCallback:ga},u,o)}}const J="BarsPN",Aa={name:J,defaultParams:v,layerIndex:b,validator:(s,{validateColumns:u})=>u(s,{barWidth:{toBeTypes:["number"]},barPadding:{toBeTypes:["number"]},barGroupPadding:{toBeTypes:["number"]},barRadius:{toBeTypes:["number","boolean"]}})},Ea=Tt(Aa)(({selection:s,name:u,subject:o,observer:t})=>{const a=new $,l=Le(J,{selection:s,computedData$:t.computedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedData$:t.visibleComputedData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:t.fullParams$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridGraphicReverseScale$:t.gridGraphicReverseScale$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:K(!0),event$:o.event$});return()=>{a.next(void 0),l()}}),M="MultiBarStack",F=L(M,"grid"),_a={name:M,defaultParams:X,layerIndex:b,validator:(s,{validateColumns:u})=>u(s,{gridIndexes:{toBe:'number[] | "all"',test:t=>t==="all"||Array.isArray(t)&&t.every(a=>typeof a=="number")},barWidth:{toBeTypes:["number"]},barGroupPadding:{toBeTypes:["number"]},barRadius:{toBeTypes:["number","boolean"]}})},Sa=D(_a)(({selection:s,name:u,subject:o,observer:t})=>{const a=new $,l=[];return I(t).pipe(_(a)).subscribe(g=>{l.forEach(i=>i()),s.selectAll(`g.${F}`).data(g).join("g").attr("class",F).each((i,p,n)=>{const e=T(n[p]),d=i.dataFormatter$.pipe(_(a),S(c=>c.grid.separateSeries),x(),y(1));l[p]=$e(M,{selection:e,computedData$:i.computedData$,visibleComputedData$:i.visibleComputedData$,computedLayoutData$:i.computedLayoutData$,visibleComputedLayoutData$:i.visibleComputedLayoutData$,seriesLabels$:i.seriesLabels$,SeriesDataMap$:i.SeriesDataMap$,GroupDataMap$:i.GroupDataMap$,fullParams$:t.fullParams$,fullDataFormatter$:i.dataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:i.gridAxesTransform$,gridGraphicTransform$:i.gridGraphicTransform$,gridGraphicReverseScale$:i.gridGraphicReverseScale$,gridAxesSize$:i.gridAxesSize$,gridHighlight$:i.gridHighlight$,gridContainerPosition$:i.gridContainerPosition$,isSeriesSeprate$:d,event$:o.event$})})}),()=>{a.next(void 0),l.forEach(g=>g())}}),G="MultiBarsTriangle",O=L(G,"grid"),Ta={name:G,defaultParams:w,layerIndex:b,validator:(s,{validateColumns:u})=>u(s,{gridIndexes:{toBe:'number[] | "all"',test:t=>t==="all"||Array.isArray(t)&&t.every(a=>typeof a=="number")},barWidth:{toBeTypes:["number"]},barPadding:{toBeTypes:["number"]},barGroupPadding:{toBeTypes:["number"]},linearGradientOpacity:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"}})},Pa=D(Ta)(({selection:s,name:u,subject:o,observer:t})=>{const a=new $,l=[];return I(t).pipe(_(a)).subscribe(g=>{l.forEach(i=>i()),s.selectAll(`g.${O}`).data(g).join("g").attr("class",O).each((i,p,n)=>{const e=T(n[p]),d=i.dataFormatter$.pipe(_(a),S(c=>c.grid.separateSeries),x(),y(1));l[p]=Ie(G,{selection:e,computedData$:i.computedData$,visibleComputedData$:i.visibleComputedData$,computedLayoutData$:i.computedLayoutData$,visibleComputedLayoutData$:i.visibleComputedLayoutData$,seriesLabels$:i.seriesLabels$,SeriesDataMap$:i.SeriesDataMap$,GroupDataMap$:i.GroupDataMap$,fullParams$:t.fullParams$,fullChartParams$:t.fullChartParams$,fullDataFormatter$:i.dataFormatter$,gridAxesTransform$:i.gridAxesTransform$,gridGraphicTransform$:i.gridGraphicTransform$,gridAxesSize$:i.gridAxesSize$,gridHighlight$:i.gridHighlight$,gridContainerPosition$:i.gridContainerPosition$,isSeriesSeprate$:d,event$:o.event$})})}),()=>{a.next(void 0),l.forEach(g=>g())}}),B="MultiLineAreas",V=L(B,"grid"),Ra={name:B,defaultParams:Y,layerIndex:Pt,validator:(s,{validateColumns:u})=>u(s,{gridIndexes:{toBe:'number[] | "all"',test:t=>t==="all"||Array.isArray(t)&&t.every(a=>typeof a=="number")},lineCurve:{toBeTypes:["string"]},linearGradientOpacity:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"}})},ha=D(Ra)(({selection:s,name:u,subject:o,observer:t})=>{const a=new $,l=[],A=t.multiGridContainerPosition$.pipe(_(a),S(i=>i.flat()));return I(t).pipe(_(a)).subscribe(i=>{l.forEach(p=>p()),s.selectAll(`g.${V}`).data(i).join("g").attr("class",V).each((p,n,e)=>{const d=T(e[n]);l[n]=_e(B,{selection:d,computedData$:p.computedData$,computedLayoutData$:p.computedLayoutData$,visibleComputedData$:p.visibleComputedData$,visibleComputedLayoutData$:p.visibleComputedLayoutData$,seriesLabels$:p.seriesLabels$,SeriesDataMap$:p.SeriesDataMap$,GroupDataMap$:p.GroupDataMap$,fullDataFormatter$:p.dataFormatter$,fullParams$:t.fullParams$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:p.gridAxesTransform$,gridGraphicTransform$:p.gridGraphicTransform$,gridAxesSize$:p.gridAxesSize$,gridHighlight$:p.gridHighlight$,gridContainerPosition$:p.gridContainerPosition$,allContainerPosition$:A,layout$:t.layout$,event$:o.event$})})}),()=>{a.next(void 0),l.forEach(i=>i())}}),C="MultiValueStackAxis",k=L(C,"grid"),La={name:C,defaultParams:j,layerIndex:z,validator:(s,{validateColumns:u})=>u(s,{gridIndexes:{toBe:'number[] | "all"',test:t=>t==="all"||Array.isArray(t)&&t.every(a=>typeof a=="number")},labelOffset:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number","null"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}})},$a=D(La)(({selection:s,name:u,subject:o,observer:t})=>{const a=new $,l=[];return I(t).pipe(_(a)).subscribe(g=>{l.forEach(i=>i()),s.selectAll(`g.${k}`).data(g).join("g").attr("class",k).each((i,p,n)=>{const e=T(n[p]),d=i.dataFormatter$.pipe(_(a),S(c=>c.grid.separateSeries),x(),y(1));l[p]=q(C,{selection:e,computedData$:i.computedStackedData$,filteredMinMaxValue$:i.filteredMinMaxValue$,fullParams$:t.fullParams$,fullDataFormatter$:i.dataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:i.gridAxesTransform$,gridAxesReverseTransform$:i.gridAxesReverseTransform$,gridAxesSize$:i.gridAxesSize$,gridContainerPosition$:i.gridContainerPosition$,isSeriesSeprate$:d})})}),()=>{a.next(void 0),l.forEach(g=>g())}}),N="OverlappingValueStackAxes",H=L(N,"grid"),fa={name:N,defaultParams:W,layerIndex:z,validator:(s,{validateColumns:u})=>{const o=u(s,{firstAxis:{toBeTypes:["object"]},secondAxis:{toBeTypes:["object"]},gridIndexes:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2}});if(s.firstAxis){const t=u(s.firstAxis,{labelOffset:{toBe:"[number, number]",test:a=>Array.isArray(a)&&a.length===2&&typeof a[0]=="number"&&typeof a[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}});if(t.status==="error")return t}if(s.secondAxis){const t=u(s.secondAxis,{labelOffset:{toBe:"[number, number]",test:a=>Array.isArray(a)&&a.length===2&&typeof a[0]=="number"&&typeof a[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}});if(t.status==="error")return t}return o}},Ia=D(fa)(({selection:s,name:u,subject:o,observer:t})=>{const a=new $,l=[],A=t.fullParams$.pipe(_(a),S(n=>n.gridIndexes[0])),g=t.fullParams$.pipe(_(a),S(n=>n.gridIndexes[1])),i=f({firstGridIndex:A,secondGridIndex:g,fullDataFormatter:t.fullDataFormatter$}).pipe(_(a),h(async n=>n),S(n=>{n.fullDataFormatter.gridList[n.secondGridIndex]||(n.fullDataFormatter.gridList[n.secondGridIndex]=Object.assign({},n.fullDataFormatter.gridList[n.firstGridIndex]));const e=n.fullDataFormatter.gridList[n.firstGridIndex].valueAxis.position;let d=e;return e==="left"?d="right":e==="bottom"?d="top":e==="top"?d="bottom":e==="right"&&(d="left"),{type:"grid",visibleFilter:n.fullDataFormatter.visibleFilter,grid:{...n.fullDataFormatter.gridList[n.secondGridIndex],valueAxis:{...n.fullDataFormatter.gridList[n.secondGridIndex].valueAxis,position:d}},container:{...n.fullDataFormatter.container}}}));return K(t).pipe(_(a),S(n=>({...n,fullParams$:n.fullParams$.pipe(S(e=>(e.gridIndexes.length>2&&(e.gridIndexes.length=2),e)))})),h(n=>I(n)),S(n=>n.map((e,d)=>{if(d===0)return e;const c=Rt({fullDataFormatter$:i,layout$:t.layout$}),R=ht({gridAxesTransform$:c}),r=Lt({computedData$:e.computedData$,fullDataFormatter$:i,layout$:t.layout$});return{...e,dataFormatter$:i,gridAxesTransform$:c,gridAxesReverseTransform$:R,gridContainerPosition$:r}}))).pipe(_(a)).subscribe(n=>{l.forEach(e=>e()),s.selectAll(`g.${H}`).data(n).join("g").attr("class",H).each((e,d,c)=>{if(d>1)return;const R=T(c[d]);l[d]=q(N,{selection:R,computedData$:d===0?e.computedStackedData$:e.computedData$,filteredMinMaxValue$:e.filteredMinMaxValue$,fullParams$:t.fullParams$.pipe(S(r=>d===0?r.firstAxis:r.secondAxis)),fullDataFormatter$:e.dataFormatter$,fullChartParams$:t.fullChartParams$,gridAxesTransform$:e.gridAxesTransform$,gridAxesReverseTransform$:e.gridAxesReverseTransform$,gridAxesSize$:e.gridAxesSize$,gridContainerPosition$:e.gridContainerPosition$,isSeriesSeprate$:e.isSeriesSeprate$})})}),()=>{a.next(void 0),l.forEach(n=>n())}}),P="Scatter",Da={name:P,defaultParams:Z,layerIndex:ft,validator:(s,{validateColumns:u})=>u(s,{radius:{toBeTypes:["number"]},fillColorType:{toBeOption:"ColorType"},strokeColorType:{toBeOption:"ColorType"},strokeWidth:{toBeTypes:["number"]}})};function xa({graphicGSelection:s,circleGClassName:u,circleClassName:o,visibleComputedLayoutData:t,fullParams:a,fullChartParams:l,graphicReverseScale:A}){const g=n=>{const e=n.size();return l.transitionDuration/e};let i=0;return s.each((n,e,d)=>{T(d[e]).selectAll("g").data(t[e],c=>c.id).join(c=>(i=g(c),c.append("g").classed(u,!0)),c=>c,c=>c.remove()).attr("transform",c=>`translate(${c.axisX}, ${c.axisY})`).each((c,R,r)=>{T(r[R]).selectAll("circle").data([c]).join(E=>E.append("circle").style("cursor","pointer").style("vector-effect","non-scaling-stroke").classed(o,!0).attr("opacity",0).transition().delay((m,gi)=>R*i).attr("opacity",1),E=>E.transition().duration(50).attr("opacity",1),E=>E.remove()).attr("r",a.radius).attr("fill",(E,m)=>U({datum:E,colorType:a.fillColorType,fullChartParams:l})).attr("stroke",(E,m)=>U({datum:E,colorType:a.strokeColorType,fullChartParams:l})).attr("stroke-width",a.strokeWidth).attr("transform",`scale(${A[e][0]??1}, ${A[e][1]??1})`)})}),s.selectAll(`circle.${o}`)}function ba({selection:s,ids:u,fullChartParams:o}){if(s.interrupt("highlight"),!u.length){s.transition("highlight").duration(200).style("opacity",1);return}s.each((t,a,l)=>{u.includes(t.id)?T(l[a]).style("opacity",1).transition("highlight").duration(200):T(l[a]).style("opacity",o.styles.unhighlightedOpacity).transition("highlight").duration(200)})}function ya({defsSelection:s,clipPathData:u}){s.selectAll("clipPath").data(u).join(o=>o.append("clipPath"),o=>o,o=>o.remove()).attr("id",o=>o.id).each((o,t,a)=>{T(a[t]).selectAll("rect").data([o]).join("rect").attr("x",0).attr("y",0).attr("width",l=>l.width).attr("height",l=>l.height)})}const Ma=$t(Da)(({selection:s,name:u,subject:o,observer:t})=>{const a=new $,l=Be(P,"clipPath-box"),A=L(P,"circleG"),g=L(P,"circle"),{categorySelection$:i,axesSelection$:p,defsSelection$:n,graphicGSelection$:e}=ut({selection:s,pluginName:P,clipPathID:l,categoryLabels$:t.categoryLabels$,multiValueContainerPosition$:t.multiValueContainerPosition$,multiValueGraphicTransform$:t.multiValueGraphicTransform$}),d=f({computedData:t.computedData$,multiValueGraphicReverseScale:t.multiValueGraphicReverseScale$}).pipe(_(a),h(async r=>r),S(r=>r.computedData.map((E,m)=>r.multiValueGraphicReverseScale[m])));f({defsSelection:n,layout:t.layout$}).pipe(_(a),h(async r=>r)).subscribe(r=>{const E=[{id:l,width:r.layout.width,height:r.layout.height}];ya({defsSelection:r.defsSelection,clipPathData:E})});const c=f({graphicGSelection:e,visibleComputedLayoutData:t.visibleComputedLayoutData$,graphicReverseScale:d,fullChartParams:t.fullChartParams$,fullParams:t.fullParams$}).pipe(_(a),h(async r=>r),S(r=>xa({graphicGSelection:r.graphicGSelection,circleGClassName:A,circleClassName:g,visibleComputedLayoutData:r.visibleComputedLayoutData,fullParams:r.fullParams,fullChartParams:r.fullChartParams,graphicReverseScale:r.graphicReverseScale}))),R=t.fullChartParams$.pipe(_(a),S(r=>r.highlightTarget),x());return f({graphicSelection:c,computedData:t.computedData$,CategoryDataMap:t.CategoryDataMap$,highlightTarget:R}).pipe(_(a),h(async r=>r)).subscribe(r=>{r.graphicSelection.on("mouseover",(E,m)=>{o.event$.next({type:"multiValue",eventName:"mouseover",pluginName:P,highlightTarget:r.highlightTarget,datum:m,category:r.CategoryDataMap.get(m.categoryLabel),categoryIndex:m.categoryIndex,categoryLabel:m.categoryLabel,data:r.computedData,event:E})}).on("mousemove",(E,m)=>{o.event$.next({type:"multiValue",eventName:"mousemove",pluginName:P,highlightTarget:r.highlightTarget,datum:m,category:r.CategoryDataMap.get(m.categoryLabel),categoryIndex:m.categoryIndex,categoryLabel:m.categoryLabel,data:r.computedData,event:E})}).on("mouseout",(E,m)=>{o.event$.next({type:"multiValue",eventName:"mouseout",pluginName:P,highlightTarget:r.highlightTarget,datum:m,category:r.CategoryDataMap.get(m.categoryLabel),categoryIndex:m.categoryIndex,categoryLabel:m.categoryLabel,data:r.computedData,event:E})}).on("click",(E,m)=>{o.event$.next({type:"multiValue",eventName:"click",pluginName:P,highlightTarget:r.highlightTarget,datum:m,category:r.CategoryDataMap.get(m.categoryLabel),categoryIndex:m.categoryIndex,categoryLabel:m.categoryLabel,data:r.computedData,event:E})})}),f({graphicSelection:c,highlight:t.multiValueHighlight$.pipe(S(r=>r.map(E=>E.id))),fullChartParams:t.fullChartParams$}).pipe(_(a),h(async r=>r)).subscribe(r=>{ba({selection:r.graphicSelection,ids:r.highlight,fullChartParams:r.fullChartParams})}),()=>{a.next(void 0)}}),Ga=Object.freeze(Object.defineProperty({__proto__:null,BarStack:fe,Bars:he,BarsPN:Ea,BarsTriangle:De,Bubbles:Fe,CONTAINER_PLUGIN_PARAMS:It,DEFAULT_BARS_DIVERGING_PARAMS:Dt,DEFAULT_BARS_PARAMS:v,DEFAULT_BARS_TRIANGLE_PARAMS:xt,DEFAULT_BAR_STACK_PARAMS:bt,DEFAULT_BUBBLES_PARAMS:yt,DEFAULT_DOTS_PARAMS:Mt,DEFAULT_GRID_LEGEND_PARAMS:Gt,DEFAULT_GRID_TOOLTIP_PARAMS:Bt,DEFAULT_GRID_ZOOM_PARAMS:Ct,DEFAULT_GROUP_AUX_PARAMS:Nt,DEFAULT_GROUP_AXIS_PARAMS:Ut,DEFAULT_LINES_PARAMS:Ft,DEFAULT_LINE_AREAS_PARAMS:Ot,DEFAULT_MULTI_BARS_PARAMS:Vt,DEFAULT_MULTI_BARS_TRIANGLE_PARAMS:w,DEFAULT_MULTI_BAR_STACK_PARAMS:X,DEFAULT_MULTI_DOTS_PARAMS:kt,DEFAULT_MULTI_GRID_LEGEND_PARAMS:Ht,DEFAULT_MULTI_GRID_TOOLTIP_PARAMS:vt,DEFAULT_MULTI_GROUP_AXIS_PARAMS:Xt,DEFAULT_MULTI_LINES_PARAMS:wt,DEFAULT_MULTI_LINE_AREAS_PARAMS:Y,DEFAULT_MULTI_VALUE_AXIS_PARAMS:j,DEFAULT_MULTI_VALUE_LEGEND_PARAMS:Yt,DEFAULT_MULTI_VALUE_STACK_AXIS_PARAMS:jt,DEFAULT_MULTI_VALUE_TOOLTIP_PARAMS:zt,DEFAULT_OVERLAPPING_VALUE_AXES_PARAMS:Wt,DEFAULT_OVERLAPPING_VALUE_STACK_AXES_PARAMS:W,DEFAULT_PIE_EVENT_TEXTS_PARAMS:Zt,DEFAULT_PIE_LABELS_PARAMS:Kt,DEFAULT_PIE_PARAMS:qt,DEFAULT_ROSE_LABELS_PARAMS:Jt,DEFAULT_ROSE_PARAMS:Qt,DEFAULT_SCATTER_BUBBLES_PARAMS:te,DEFAULT_SCATTER_PARAMS:Z,DEFAULT_SERIES_LEGEND_PARAMS:ee,DEFAULT_SERIES_TOOLTIP_PARAMS:ae,DEFAULT_TREE_LEGEND_PARAMS:ie,DEFAULT_TREE_MAP_PARAMS:re,DEFAULT_TREE_TOOLTIP_PARAMS:se,DEFAULT_VALUE_AXIS_PARAMS:oe,DEFAULT_VALUE_STACK_AXIS_PARAMS:ne,DEFAULT_X_Y_AUX_PARAMS:le,DEFAULT_X_Y_AXES_PARAMS:ue,DEFAULT_X_Y_ZOOM_PARAMS:de,Dots:Se,GridLegend:xe,GridTooltip:be,GridZoom:Ge,GroupAux:Te,GroupAxis:ye,LineAreas:Pe,Lines:Ee,MultiBarStack:Sa,MultiBars:at,MultiBarsTriangle:Pa,MultiDots:it,MultiGridLegend:rt,MultiGridTooltip:Ce,MultiGroupAxis:st,MultiLineAreas:ha,MultiLines:ot,MultiValueAxis:nt,MultiValueLegend:dt,MultiValueStackAxis:$a,MultiValueTooltip:ct,OverlappingValueAxes:Ue,OverlappingValueStackAxes:Ia,Pie:Oe,PieEventTexts:ke,PieLabels:He,Rose:ve,RoseLabels:Xe,Scatter:Ma,ScatterBubbles:pt,SeriesLegend:Ve,SeriesTooltip:we,TOOLTIP_PARAMS:ce,TreeLegend:pe,TreeMap:ge,TreeTooltip:me,ValueAxis:Me,ValueStackAxis:Re,XYAux:gt,XYAxes:mt,XYZoom:At},Symbol.toStringTag,{value:"Module"})),Ba={name:"PRESET_BUBBLES_SCALING_BY_RADIUS",description:"以半徑尺寸為比例的泡泡圖",allPluginParams:{Bubbles:{arcScaleType:"radius"},SeriesLegend:{listRectRadius:7}}},Ca={name:"PRESET_BUBBLES_SEPARATE_SERIES",description:"分開顯示Series泡泡",chartParams:{padding:{top:160,right:160,bottom:160,left:160}},dataFormatter:{separateSeries:!0},allPluginParams:{Bubbles:{},SeriesLegend:{listRectRadius:7},SeriesTooltip:{}}},Na={name:"PRESET_SERIES_BASIC",description:"基本Series參數",allPluginParams:{SeriesLegend:{listRectRadius:7}}},Ua={name:"PRESET_BARS_HORIZONTAL_AND_ROUND",description:"橫向圓角長條圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160}},dataFormatter:{grid:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}}},allPluginParams:{Bars:{barWidth:0,barPadding:1,barGroupPadding:10,barRadius:!0},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectRadius:7}}},Fa={name:"PRESET_BARS_HORIZONTAL_AND_THIN",description:"橫向細長長條圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160}},dataFormatter:{grid:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}}},allPluginParams:{Bars:{barWidth:20,barPadding:1,barGroupPadding:10},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14}}},Oa={name:"PRESET_BARS_THIN",description:"細長條圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},allPluginParams:{Bars:{barWidth:20,barPadding:1,barGroupPadding:10},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14}}},Va={name:"PRESET_GRID_HORIZONTAL",description:"橫向圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160}},dataFormatter:{grid:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}}},allPluginParams:{GridLegend:{placement:"bottom",padding:14}}},ka={name:"PRESET_GRID_PN_SCALE",description:"正負值分向圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},dataFormatter:{grid:{valueAxis:{scaleDomain:["auto","auto"],scaleRange:[.05,.95]}}},allPluginParams:{GridLegend:{placement:"bottom",padding:14}}},Ha={name:"PRESET_GRID_ROTATE_AXIS_LABEL",description:"傾斜標籤",chartParams:{padding:{top:60,right:60,bottom:160,left:60}},allPluginParams:{GroupAux:{labelRotate:-30},GroupAxis:{tickPadding:15,tickTextRotate:-30},GridLegend:{placement:"bottom",padding:14}}},va={name:"PRESET_LINE_AREAS_BASIC",description:"基本LineArea參數",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},dataFormatter:{grid:{groupAxis:{scalePadding:0}}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Xa={name:"PRESET_LINE_AREAS_CURVE",description:"弧線折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},dataFormatter:{grid:{groupAxis:{scalePadding:0}}},allPluginParams:{Lines:{lineCurve:"curveMonotoneX",lineWidth:3},LineAreas:{lineCurve:"curveMonotoneX"},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},wa={name:"PRESET_LINE_AREAS_HORIZONTAL",description:"橫向折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160},highlightTarget:"series"},dataFormatter:{grid:{valueAxis:{position:"bottom"},groupAxis:{position:"left",scalePadding:0}}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Ya={name:"PRESET_LINE_AREAS_LOOSE_TICKS",description:"寬鬆標籤",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},dataFormatter:{grid:{groupAxis:{scalePadding:0}}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{ticks:6},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},ja={name:"PRESET_LINE_AREAS_ROTATE_AXIS_LABEL",description:"傾斜標籤",chartParams:{padding:{top:60,right:60,bottom:160,left:60},highlightTarget:"series"},dataFormatter:{grid:{groupAxis:{scalePadding:0}}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{tickPadding:15,tickTextRotate:-30},ValueAxis:{},GroupAux:{labelRotate:-30},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},za={name:"PRESET_LINE_AREAS_SEPARATE_SERIES",description:"LineAreas 分開顯示Series",chartParams:{padding:{top:60,right:60,bottom:160,left:60},highlightTarget:"series"},dataFormatter:{grid:{separateSeries:!0,groupAxis:{scalePadding:0}}},allPluginParams:{Lines:{},LineAreas:{},Dots:{},GroupAxis:{tickPadding:15,tickTextRotate:-30},ValueAxis:{},GroupAux:{labelRotate:-30},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Wa={name:"PRESET_LINES_BASIC",description:"基本Lines參數",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{Lines:{},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Za={name:"PRESET_LINES_CURVE",description:"弧線折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{Lines:{lineCurve:"curveMonotoneX",lineWidth:3},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Ka={name:"PRESET_LINES_HORIZONTAL",description:"橫向折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:160},highlightTarget:"series"},dataFormatter:{grid:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}}},allPluginParams:{Lines:{},Dots:{},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},qa={name:"PRESET_LINES_LOOSE_TICKS",description:"寬鬆標籤",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{Lines:{},Dots:{},GroupAxis:{ticks:6},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Ja={name:"PRESET_LINES_ROTATE_AXIS_LABEL",description:"傾斜標籤",chartParams:{padding:{top:60,right:60,bottom:160,left:60},highlightTarget:"series"},allPluginParams:{Lines:{},Dots:{},GroupAxis:{tickPadding:15,tickTextRotate:-30},ValueAxis:{},GroupAux:{labelRotate:-30},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},Qa={name:"PRESET_LINES_WITH_SOLID_DOTS",description:"折線圖及實心圓點",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{Lines:{},Dots:{radius:3,fillColorType:"series",onlyShowHighlighted:!1},GroupAxis:{},ValueAxis:{},GroupAux:{},GridLegend:{placement:"bottom",padding:14,listRectHeight:2}}},ti={name:"PRESET_MULTI_GRID_BASIC",description:"基本MultiGrid參數",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{MultiGridLegend:{placement:"bottom",padding:14,gridList:[{},{listRectHeight:2}]}}},ei={name:"PRESET_MULTI_GRID_DIVERGING",description:"雙向折線圖",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},dataFormatter:{gridList:[{groupAxis:{position:"right"},valueAxis:{position:"bottom"}},{groupAxis:{position:"left"},valueAxis:{position:"bottom"}}],container:{gap:200,rowAmount:1,columnAmount:2},separateGrid:!0},allPluginParams:{MultiGroupAxis:{tickPadding:60,gridIndexes:[0]},MultiValueAxis:{gridIndexes:[0,1]},MultiValueStackAxis:{gridIndexes:[0,1]},MultiBars:{gridIndexes:[0,1]},MultiBarStack:{gridIndexes:[0,1]},MultiBarsTriangle:{gridIndexes:[0,1]},MultiLines:{gridIndexes:[0,1]},MultiLineAreas:{gridIndexes:[0,1]},MultiDots:{gridIndexes:[0,1]},MultiGridLegend:{placement:"bottom",padding:14}}},ai={name:"PRESET_MULTI_GRID_ROUND_STYLE",description:"MultiGrid圓弧風格",chartParams:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"series"},allPluginParams:{MultiBars:{barWidth:0,barPadding:1,barGroupPadding:10,barRadius:!0},MultiBarStack:{},MultiDots:{},MultiGridLegend:{placement:"bottom",padding:14,gridList:[{listRectRadius:7},{listRectHeight:2}]},MultiGroupAxis:{},MultiLineAreas:{},MultiLines:{lineCurve:"curveMonotoneX",lineWidth:3},MultiValueAxis:{},MultiValueStackAxis:{},OverlappingValueAxes:{},OverlappingValueStackAxes:{}}},Q={},ii={name:"PRESET_MULTI_LINE_AREAS_SEPARATE_GRID",description:"2組區域圖表",chartParams:{padding:{top:60,right:60,bottom:160,left:60}},dataFormatter:{gridList:[{groupAxis:{scalePadding:0}},{groupAxis:{scalePadding:0}}],separateGrid:!0},allPluginParams:{...Q,MultiGroupAxis:{tickTextRotate:-30,gridIndexes:"all"},MultiValueAxis:{gridIndexes:"all"},MultiValueStackAxis:{gridIndexes:"all"},MultiBars:{gridIndexes:"all"},MultiBarStack:{gridIndexes:"all"},MultiBarsTriangle:{gridIndexes:"all"},MultiLines:{gridIndexes:"all"},MultiLineAreas:{gridIndexes:"all"},MultiDots:{gridIndexes:"all"},MultiGridLegend:{placement:"bottom",padding:14,gridList:[{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2}]}}},ri={name:"PRESET_MULTI_LINES_SEPARATE_GRID",description:"多組分開折線圖表",chartParams:{padding:{top:60,right:60,bottom:160,left:60}},dataFormatter:{separateGrid:!0},allPluginParams:{...Q,MultiGroupAxis:{tickTextRotate:-30,gridIndexes:"all"},MultiValueAxis:{gridIndexes:"all"},MultiValueStackAxis:{gridIndexes:"all"},MultiBars:{gridIndexes:"all"},MultiBarStack:{gridIndexes:"all"},MultiBarsTriangle:{gridIndexes:"all"},MultiLines:{gridIndexes:"all"},MultiLineAreas:{gridIndexes:"all"},MultiDots:{gridIndexes:"all"},MultiGridLegend:{placement:"bottom",padding:14,gridList:[{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2},{listRectHeight:2}]}}},si={name:"PRESET_MULTI_VALUE_BASIC",description:"基本MultiValue參數",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},allPluginParams:{MultiValueLegend:{placement:"bottom",padding:14}}},oi={name:"PRESET_MULTI_VALUE_SEPARATE_CATEGORY",description:"MultiValue 分開顯示category",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},dataFormatter:{separateCategory:!0},allPluginParams:{MultiValueLegend:{placement:"bottom",padding:14}}},ni={name:"PRESET_SCATTER_BUBBLES_SCALING_BY_RADIUS",description:"ScatterBubbles以半徑尺寸為比例",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},allPluginParams:{MultiValueLegend:{placement:"bottom",padding:14},ScatterBubbles:{arcScaleType:"radius"}}},li={name:"PRESET_SCATTER_BUBBLES_LINEAR_OPACITY",description:"ScatterBubbles漸變透明度",chartParams:{padding:{top:60,right:60,bottom:120,left:60}},allPluginParams:{MultiValueLegend:{placement:"bottom",padding:14},ScatterBubbles:{valueLinearOpacity:[.6,.95]}}},ui={name:"PRESET_TREE_BASIC",description:"基本Tree參數",chartParams:{padding:{top:40,right:40,bottom:60,left:40}},allPluginParams:{TreeMap:{},TreeLegend:{placement:"bottom",padding:14}}},di=Object.freeze(Object.defineProperty({__proto__:null,PRESET_BARS_HORIZONTAL_AND_ROUND:Ua,PRESET_BARS_HORIZONTAL_AND_THIN:Fa,PRESET_BARS_ROUND:ta,PRESET_BARS_THIN:Oa,PRESET_BUBBLES_SCALING_BY_RADIUS:Ba,PRESET_BUBBLES_SEPARATE_SERIES:Ca,PRESET_GRID_BASIC:ea,PRESET_GRID_HORIZONTAL:Va,PRESET_GRID_PN_SCALE:ka,PRESET_GRID_ROTATE_AXIS_LABEL:Ha,PRESET_GRID_SEPARATE_SERIES:aa,PRESET_LINES_BASIC:Wa,PRESET_LINES_CURVE:Za,PRESET_LINES_HORIZONTAL:Ka,PRESET_LINES_LOOSE_TICKS:qa,PRESET_LINES_ROTATE_AXIS_LABEL:Ja,PRESET_LINES_WITH_SOLID_DOTS:Qa,PRESET_LINE_AREAS_BASIC:va,PRESET_LINE_AREAS_CURVE:Xa,PRESET_LINE_AREAS_HORIZONTAL:wa,PRESET_LINE_AREAS_LOOSE_TICKS:Ya,PRESET_LINE_AREAS_ROTATE_AXIS_LABEL:ja,PRESET_LINE_AREAS_SEPARATE_SERIES:za,PRESET_MULTI_GRID_BASIC:ti,PRESET_MULTI_GRID_DIVERGING:ei,PRESET_MULTI_GRID_ROUND_STYLE:ai,PRESET_MULTI_GRID_SEPARATE_GRID:Ne,PRESET_MULTI_LINES_SEPARATE_GRID:ri,PRESET_MULTI_LINE_AREAS_SEPARATE_GRID:ii,PRESET_MULTI_VALUE_BASIC:si,PRESET_MULTI_VALUE_SEPARATE_CATEGORY:oi,PRESET_PIE_BASIC:Ye,PRESET_PIE_DONUT:je,PRESET_PIE_HALF_DONUT:ze,PRESET_PIE_WITH_INNER_LABELS:We,PRESET_ROSE_BASIC:Ze,PRESET_ROSE_SCALING_BY_RADIUS:Ke,PRESET_SCATTER_BUBBLES_LINEAR_OPACITY:li,PRESET_SCATTER_BUBBLES_SCALING_BY_RADIUS:ni,PRESET_SERIES_BASIC:Na,PRESET_SERIES_SEPARATE_SERIES:qe,PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES:Je,PRESET_SERIES_SUM_SERIES:Qe,PRESET_TREE_BASIC:ui},Symbol.toStringTag,{value:"Module"}));async function ci({chartType:s,pluginNames:u,presetName:o}){const t=ia.find(p=>p.chartType===s),a=t==null?void 0:t.list.find(p=>p.mainPluginNames.join(",")===u.join(",")),l=(a==null?void 0:a.list.find(p=>p.presetName===o))??null;if(!l)return null;const A=l.allPluginNames.map(p=>{const n=Ga[p];return new n}),{default:g}=await l.getData();return{preset:di[o],plugins:A,data:g}}const pi={id:"chart",style:{width:"100%",height:"100%"}},ir=ra({__name:"[presetName]",setup(s){const o=sa().params;return ua({title:o.pluginName}),oa(async()=>{const t=await ci({chartType:o.chartType,pluginNames:o.pluginName.split(","),presetName:o.presetName});if(!t){console.error("demoData not found");return}const l={series:tt,grid:et,multiGrid:lt,multiValue:Et,relationship:ma,tree:Ae}[o.chartType],A=document.querySelector("#chart"),g=new l(A,{preset:t.preset});g.plugins$.next(t.plugins),g.data$.next(t.data)}),(t,a)=>(na(),la("div",pi))}});export{ir as default};