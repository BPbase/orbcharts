import{e as tt,u as at,f as rt,o as st,c as it}from"./DXXz3Bhk.js";import{u as nt}from"./BTRSF-T3.js";import{S as f}from"./UFs7gonu.js";import{G as c}from"./DeHDosE6.js";import{m as se,M as $,a as D,b as C,c as j,d as h,e as b,f as U,g as ne}from"./DIH9tb3c.js";import{m as ot,_ as lt,i as ut,a as pt,O as Fe,b as Z,A as qe,D as gt,S as W,c as Et,t as L,d as B,e as re,f as me,s as ae,g as X,h as _t,j as ie,k as ct,l as St,n as mt,o as dt,p as Rt}from"./_HanNZE-.js";import{T as Tt,a as It,b as At,t as $t}from"./ytZCEmv_.js";import{L as y}from"./CPgczm6I.js";import{c as Dt,g as R,V as oe,D as v,L as q}from"./B9Zwa0Fx.js";import{B as H}from"./BD86OZl8.js";import{c as ht}from"./BHJpqrfM.js";import{o as Je}from"./OyNKowgb.js";import{c as Lt,B as le}from"./R626kBlH.js";import{c as Pt,B as ue}from"./DUirPVNd.js";import{G as S}from"./ErWJKII2.js";import{G as m,V as T}from"./BTHJBi3m.js";import{S as d}from"./9O5zJSZt.js";import{g as z,a as Ge,p as ft,m as xt,s as be}from"./InbBT3x0.js";import{m as Gt,a as Nt,T as r}from"./BRqMWAjz.js";import{g as Mt}from"./CD6lHqiY.js";import{f as Ct}from"./DYlwYz0t.js";import{c as Ke}from"./C92z20-z.js";import{g as Ot,a as yt,b as Bt,O as de}from"./VE-0ua4X.js";import{B as pe}from"./CWSIQ0jB.js";import{P as w}from"./DLOeOO_-.js";import{s as ge,P as Ut}from"./CUHAdHPc.js";import{P as V,R as J,a as K}from"./BUWfn9D6.js";import{S as x}from"./C64fF89M.js";import{P as Re,a as vt,b as Ft,c as Te,d as bt,e as Ht,f as zt,g as He,h as ze,i as kt,j as wt,k as Ie,l as Ae,m as $e,n as Vt,o as Zt,p as Xt,q as Wt,r as Ee,s as Yt,t as jt,u as qt,v as Jt,w as Kt,x as Qt,y as ea,z as ta,A as aa,B as ra,C as sa,D as ia,E as na,F as De,G as he,H as Le,I as Pe,J as oa,K as la,L as ua,M as pa,N as ga,O as Ea,Q as _a,R as ca}from"./9uq9pIpk.js";import{s as O}from"./B0vgvROQ.js";import{g as Sa}from"./Dflj-YB1.js";import"./DlIX7OSJ.js";import"./DxucBKdu.js";import"./DeE08nM3.js";var ma=["addListener","removeListener"],da=["addEventListener","removeEventListener"],Ra=["on","off"];function Ne(o,_,n,a){if(Z(n)&&(a=n,n=void 0),a)return Ne(o,_,n).pipe(ot(a));var i=lt(Aa(o)?da.map(function(g){return function(t){return o[g](_,t,n)}}):Ta(o)?ma.map(ke(o,_)):Ia(o)?Ra.map(ke(o,_)):[],2),u=i[0],I=i[1];if(!u&&ut(o))return Gt(function(g){return Ne(g,_,n)})(pt(o));if(!u)throw new TypeError("Invalid event target");return new Fe(function(g){var t=function(){for(var p=[],s=0;s<arguments.length;s++)p[s]=arguments[s];return g.next(1<p.length?p:p[0])};return u(t),function(){return I(t)}})}function ke(o,_){return function(n){return function(a){return o[n](_,a)}}}function Ta(o){return Z(o.addListener)&&Z(o.removeListener)}function Ia(o){return Z(o.on)&&Z(o.off)}function Aa(o){return Z(o.addEventListener)&&Z(o.removeEventListener)}const we="BarsDiverging",$a=qe(we,gt)(({selection:o,name:_,subject:n,observer:a})=>{const i=new W,u=ht(we,{selection:o,computedData$:a.computedData$,computedLayoutData$:a.computedLayoutData$,visibleComputedData$:a.visibleComputedData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,seriesLabels$:a.seriesLabels$,SeriesDataMap$:a.SeriesDataMap$,GroupDataMap$:a.GroupDataMap$,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridGraphicTransform$:a.gridGraphicTransform$,gridGraphicReverseScale$:a.gridGraphicReverseScale$,gridAxesSize$:a.gridAxesSize$,gridHighlight$:a.gridHighlight$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:Je(!0),event$:n.event$});return()=>{i.next(void 0),u()}});function Da(o,_){let n=new Fe(()=>{});return o.each(function(){const a=Ne(this,_);n=Nt(n,a)}),n}const Me="GroupAux",Ce=z(Me,"label-box");function ha({groupLabel:o,axisX:_,axisHeight:n,fullParams:a}){return a.showLine&&o?[{id:o,x1:_,x2:_,y1:0,y2:n}]:[]}function La({selection:o,pluginName:_,lineData:n,fullParams:a,fullChartParams:i}){const u=z(_,"auxline"),I=o.selectAll(`line.${u}`).data(n),g=I.enter().append("line").classed(u,!0).style("stroke",p=>Ge(a.lineColorType,i)).style("stroke-width",1).style("stroke-dasharray",a.lineDashArray??"none").style("pointer-events","none"),t=I.merge(g);return I.exit().remove(),g.attr("x1",p=>p.x1).attr("y1",p=>p.y1).attr("x2",p=>p.x2).attr("y2",p=>p.y2),I.transition().duration(50).attr("x1",p=>p.x1).attr("y1",p=>p.y1).attr("x2",p=>p.x2).attr("y2",p=>p.y2),t}function Pa(o){o.selectAll("line").data([]).exit().remove()}function fa({groupLabel:o,axisX:_,fullParams:n}){return n.showLabel&&o?[{id:o,x:_,y:-n.labelPadding,text:ft(o,n.labelTextFormat)}]:[]}function xa({selection:o,labelData:_,fullParams:n,fullChartParams:a,gridAxesReverseTransformValue:i,textSizePx:u}){const I=u+4,g=o.selectAll(`g.${Ce}`).data(_),t=g.enter().append("g").classed(Ce,!0).style("cursor","pointer"),p=t.merge(g);return t.attr("transform",(s,E)=>`translate(${s.x}, ${s.y})`),g.transition().duration(50).attr("transform",(s,E)=>`translate(${s.x}, ${s.y})`),g.exit().remove(),p.each((s,E,e)=>{const l=xt(s.text,u)+12,M=-l/2,A=X(e[E]).selectAll("rect").data([s]),G=A.enter().append("rect").attr("height",`${I}px`).attr("fill",N=>Ge(n.labelColorType,a)).attr("x",M).attr("y",-2).attr("rx",5).attr("ry",5).style("cursor","pointer");A.merge(G).attr("width",N=>`${l}px`).style("transform",i),A.exit().remove();const P=X(e[E]).selectAll("text").data([s]),k=P.enter().append("text").style("dominant-baseline","hanging").style("cursor","pointer");P.merge(k).text(N=>N.text).style("transform",i).attr("fill",N=>Ge(n.labelTextColorType,a)).attr("font-size",a.styles.textSize).attr("x",M+6),P.exit().remove()}),p}function Ga(o){o.selectAll(`g.${Ce}`).data([]).exit().remove()}const Ve=qe(Me,Et)(({selection:o,rootSelection:_,name:n,subject:a,observer:i})=>{const u=new W,I=_.insert("rect","g").classed(z(Me,"rect"),!0).attr("opacity",0),g=o.append("g");i.layout$.pipe(L(u)).subscribe(e=>{I.attr("width",e.rootWidth).attr("height",e.rootHeight)}),i.gridAxesTransform$.pipe(L(u),B(e=>e.value),re()).subscribe(e=>{g.style("transform",e)});const t=new Fe(e=>{me({fullDataFormatter:i.fullDataFormatter$,gridAxesSize:i.gridAxesSize$,computedData:i.computedData$}).pipe(L(u),ae(async l=>l)).subscribe(l=>{const A=l.computedData[0]?l.computedData[0].length-1:0,G=l.fullDataFormatter.grid.groupAxis.scaleDomain[0]==="auto"?0-l.fullDataFormatter.grid.groupAxis.scalePadding:l.fullDataFormatter.grid.groupAxis.scaleDomain[0]-l.fullDataFormatter.grid.groupAxis.scalePadding,P=l.fullDataFormatter.grid.groupAxis.scaleDomain[1]==="auto"?A+l.fullDataFormatter.grid.groupAxis.scalePadding:l.fullDataFormatter.grid.groupAxis.scaleDomain[1]+l.fullDataFormatter.grid.groupAxis.scalePadding,k=l.computedData[0]?l.computedData[0].length:0;let N=l.fullDataFormatter.grid.seriesDirection==="row"?(l.computedData[0]??[]).map(Q=>Q.groupLabel):l.computedData.map(Q=>Q[0].groupLabel);const F=new Array(k).fill(0).map((Q,Y)=>N[Y]!=null?N[Y]:String(Y)).filter((Q,Y)=>Y>=G&&Y<=P),Qe=l.fullDataFormatter.grid.groupAxis.scalePadding,et=_t({axisLabels:F,axisWidth:l.gridAxesSize.width,padding:Qe});e.next(et)})}),p=Mt({fullDataFormatter$:i.fullDataFormatter$,gridAxesSize$:i.gridAxesSize$,computedData$:i.computedData$,fullChartParams$:i.fullChartParams$}),s=i.fullChartParams$.pipe(L(u),B(e=>e.highlightTarget),re());return me({computedData:i.computedData$,gridAxesSize:i.gridAxesSize$,fullParams:i.fullParams$,fullChartParams:i.fullChartParams$,highlightTarget:s,SeriesDataMap:i.SeriesDataMap$,GroupDataMap:i.GroupDataMap$,gridGroupPositionFn:p,groupScale:t}).pipe(L(u),ae(async e=>e)).subscribe(e=>{_.on("mouseover",(l,M)=>{const{groupIndex:A,groupLabel:G}=e.gridGroupPositionFn(l);a.event$.next({type:"grid",pluginName:n,eventName:"mouseover",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.GroupDataMap.get(G)??[],groupIndex:A,groupLabel:G,event:l,data:e.computedData})}).on("mousemove",(l,M)=>{const{groupIndex:A,groupLabel:G}=e.gridGroupPositionFn(l);a.event$.next({type:"grid",pluginName:n,eventName:"mousemove",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.GroupDataMap.get(G)??[],groupIndex:A,groupLabel:G,event:l,data:e.computedData})}).on("mouseout",(l,M)=>{const{groupIndex:A,groupLabel:G}=e.gridGroupPositionFn(l);a.event$.next({type:"grid",pluginName:n,eventName:"mouseout",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.GroupDataMap.get(G)??[],groupIndex:A,groupLabel:G,event:l,data:e.computedData})}).on("click",(l,M)=>{l.stopPropagation();const{groupIndex:A,groupLabel:G}=e.gridGroupPositionFn(l);a.event$.next({type:"grid",pluginName:n,eventName:"click",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.GroupDataMap.get(G)??[],groupIndex:A,groupLabel:G,event:l,data:e.computedData})})}),me({event:a.event$.pipe(Ct(e=>e.eventName==="mouseover"||e.eventName==="mousemove")),computedData:i.computedData$,groupScale:t,gridAxesSize:i.gridAxesSize$,fullParams:i.fullParams$,fullChartParams:i.fullChartParams$,highlightTarget:s,gridAxesReverseTransform:i.gridAxesReverseTransform$,GroupDataMap:i.GroupDataMap$,gridGroupPositionFn:p,textSizePx:i.textSizePx$}).pipe(L(u),ae(async e=>e)).subscribe(e=>{const l=e.groupScale(e.event.groupLabel)??0,M=ha({groupLabel:e.event.groupLabel,axisX:l,axisHeight:e.gridAxesSize.height,fullParams:e.fullParams});La({selection:g,pluginName:n,lineData:M,fullParams:e.fullParams,fullChartParams:e.fullChartParams});const A=fa({groupLabel:e.event.groupLabel,axisX:l,fullParams:e.fullParams});xa({selection:g,labelData:A,fullParams:e.fullParams,fullChartParams:e.fullChartParams,gridAxesReverseTransformValue:e.gridAxesReverseTransform.value,textSizePx:e.textSizePx}).on("mouseover",(P,k)=>{const{groupIndex:N,groupLabel:F}=e.gridGroupPositionFn(P);a.event$.next({type:"grid",pluginName:n,eventName:"mouseover",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.event.groups,groupIndex:N,groupLabel:F,event:P,data:e.computedData})}).on("mousemove",(P,k)=>{const{groupIndex:N,groupLabel:F}=e.gridGroupPositionFn(P);a.event$.next({type:"grid",pluginName:n,eventName:"mousemove",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.event.groups,groupIndex:N,groupLabel:F,event:P,data:e.computedData})}).on("mouseout",(P,k)=>{const{groupIndex:N,groupLabel:F}=e.gridGroupPositionFn(P);a.event$.next({type:"grid",pluginName:n,eventName:"mouseout",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.event.groups,groupIndex:N,groupLabel:F,event:P,data:e.computedData})}).on("click",(P,k)=>{const{groupIndex:N,groupLabel:F}=e.gridGroupPositionFn(P);a.event$.next({type:"grid",pluginName:n,eventName:"click",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.event.groups,groupIndex:N,groupLabel:F,event:P,data:e.computedData})})}),Da(I,"mouseout").pipe(L(u)).subscribe(e=>{console.log("rootMouseout"),Pa(g),Ga(g)}),()=>{u.next(void 0),I.remove()}}),Oe="MultiBarStack",Ze=z(Oe,"grid"),_e=ie(Oe,ct)(({selection:o,name:_,subject:n,observer:a})=>{const i=new W,u=[];return se(a).pipe(L(i)).subscribe(g=>{u.forEach(t=>t()),o.selectAll(`g.${Ze}`).data(g).join("g").attr("class",Ze).each((t,p,s)=>{const E=X(s[p]),e=t.dataFormatter$.pipe(L(i),B(l=>l.grid.separateSeries),re(),be(1));u[p]=Lt(Oe,{selection:E,computedData$:t.computedData$,visibleComputedData$:t.visibleComputedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:a.fullParams$,fullDataFormatter$:t.dataFormatter$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridGraphicReverseScale$:t.gridGraphicReverseScale$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:e,event$:n.event$})})}),()=>{i.next(void 0),u.forEach(g=>g())}}),ye="MultiBarsTriangle",Xe=z(ye,"grid"),ce=ie(ye,St)(({selection:o,name:_,subject:n,observer:a})=>{const i=new W,u=[];return se(a).pipe(L(i)).subscribe(g=>{u.forEach(t=>t()),o.selectAll(`g.${Xe}`).data(g).join("g").attr("class",Xe).each((t,p,s)=>{const E=X(s[p]),e=t.dataFormatter$.pipe(L(i),B(l=>l.grid.separateSeries),re(),be(1));u[p]=Pt(ye,{selection:E,computedData$:t.computedData$,visibleComputedData$:t.visibleComputedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,fullDataFormatter$:t.dataFormatter$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:e,event$:n.event$})})}),()=>{i.next(void 0),u.forEach(g=>g())}}),Be="MultiLineAreas",We=z(Be,"grid"),fe=ie(Be,mt)(({selection:o,name:_,subject:n,observer:a})=>{const i=new W,u=[];return se(a).pipe(L(i)).subscribe(g=>{u.forEach(t=>t()),o.selectAll(`g.${We}`).data(g).join("g").attr("class",We).each((t,p,s)=>{const E=X(s[p]);u[p]=Dt(Be,{selection:E,computedData$:t.computedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedData$:t.visibleComputedData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullDataFormatter$:t.dataFormatter$,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,layout$:a.layout$,event$:n.event$})})}),()=>{i.next(void 0),u.forEach(g=>g())}}),Ue="MultiValueStackAxis",Ye=z(Ue,"grid"),xe=ie(Ue,dt)(({selection:o,name:_,subject:n,observer:a})=>{const i=new W,u=[];return se(a).pipe(L(i)).subscribe(g=>{u.forEach(t=>t()),o.selectAll(`g.${Ye}`).data(g).join("g").attr("class",Ye).each((t,p,s)=>{const E=X(s[p]),e=t.dataFormatter$.pipe(L(i),B(l=>l.grid.separateSeries),re(),be(1));u[p]=Ke(Ue,{selection:E,computedData$:t.computedStackedData$,fullParams$:a.fullParams$,fullDataFormatter$:t.dataFormatter$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridAxesReverseTransform$:t.gridAxesReverseTransform$,gridAxesSize$:t.gridAxesSize$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:e})})}),()=>{i.next(void 0),u.forEach(g=>g())}}),ve="OverlappingValueStackAxes",je=z(ve,"grid"),Na=ie(ve,Rt)(({selection:o,name:_,subject:n,observer:a})=>{const i=new W,u=[],I=a.fullParams$.pipe(L(i),B(s=>s.gridIndexes[0])),g=a.fullParams$.pipe(L(i),B(s=>s.gridIndexes[1])),t=me({firstGridIndex:I,secondGridIndex:g,fullDataFormatter:a.fullDataFormatter$}).pipe(L(i),ae(async s=>s),B(s=>{s.fullDataFormatter.gridList[s.secondGridIndex]||(s.fullDataFormatter.gridList[s.secondGridIndex]=Object.assign({},s.fullDataFormatter.gridList[s.firstGridIndex]));let E="";return s.fullDataFormatter.gridList[s.firstGridIndex].valueAxis.position==="left"?E="right":s.fullDataFormatter.gridList[s.firstGridIndex].valueAxis.position==="bottom"?E="top":s.fullDataFormatter.gridList[s.firstGridIndex].valueAxis.position==="top"?E="bottom":s.fullDataFormatter.gridList[s.firstGridIndex].valueAxis.position==="right"&&(E="left"),{type:"grid",visibleFilter:s.fullDataFormatter.visibleFilter,grid:{...s.fullDataFormatter.gridList[s.secondGridIndex],valueAxis:{...s.fullDataFormatter.gridList[s.secondGridIndex].valueAxis,position:E}},container:{...s.fullDataFormatter.container}}}));return Je(a).pipe(L(i),B(s=>({...s,fullParams$:s.fullParams$.pipe(B(E=>(E.gridIndexes.length>2&&(E.gridIndexes.length=2),E)))})),ae(s=>se(s)),B(s=>s.map((E,e)=>{if(e===0)return E;const l=Ot({fullDataFormatter$:t,layout$:a.layout$}),M=yt({gridAxesTransform$:l}),A=Bt({computedData$:E.computedData$,fullDataFormatter$:t,layout$:a.layout$});return{...E,gridAxesTransform$:l,gridAxesReverseTransform$:M,gridContainerPosition$:A}}))).pipe(L(i)).subscribe(s=>{u.forEach(E=>E()),o.selectAll(`g.${je}`).data(s).join("g").attr("class",je).each((E,e,l)=>{if(e>1)return;const M=X(l[e]);u[e]=Ke(ve,{selection:M,computedData$:e===0?E.computedStackedData$:E.computedData$,fullParams$:a.fullParams$.pipe(B(A=>e===0?A.firstAxis:A.secondAxis)),fullDataFormatter$:E.dataFormatter$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:E.gridAxesTransform$,gridAxesReverseTransform$:E.gridAxesReverseTransform$,gridAxesSize$:E.gridAxesSize$,gridContainerPosition$:E.gridContainerPosition$,isSeriesSeprate$:E.isSeriesSeprate$})})}),()=>{i.next(void 0),u.forEach(s=>s())}}),Ma=[[[1205,850,930,1111,1500]],[[55,60,50,70,75]]],ee=[[[1205,850,930,1111,1500],[735,900,880,1035,1120]],[[555,805,500,1150,1050],[1350,840,915,650,1200]],[[1200,1100,950,1105,850],[750,650,980,850,700]]],te=[[[1205,850,930,1111,1500],[735,900,880,1035,1120]],[[555,805,500,1150,1050],[1350,840,915,650,1200]],[[1200,1100,950,1105,850],[750,650,980,850,700]],[[680,880,770,330,710],[540,480,820,780,600]]],Se={series:{Bubbles:{PRESET_SERIES_BASIC:{chart:f,plugins:[pe,x,r],preset:Re,data:ge},PRESET_BUBBLES_SCALING_BY_RADIUS:{chart:f,plugins:[pe,x,r],preset:vt,data:ge},PRESET_BUBBLES_SEPARATE_SERIES:{chart:f,plugins:[pe,x,r],preset:Ft,data:ge},PRESET_SERIES_SUM_SERIES:{chart:f,plugins:[pe,x,r],preset:Te,data:ge}},Pie:{PRESET_SERIES_BASIC:{chart:f,plugins:[w,V,x,r],preset:Re,data:O},PRESET_PIE_WITH_INNER_LABELS:{chart:f,plugins:[w,V,x,r],preset:bt,data:O},PRESET_PIE_DONUT:{chart:f,plugins:[w,V,Ut,x,r],preset:Ht,data:O},PRESET_PIE_HALF_DONUT:{chart:f,plugins:[w,V,x,r],preset:zt,data:O},PRESET_SERIES_DESC:{chart:f,plugins:[w,V,x,r],preset:He,data:O},PRESET_SERIES_SEPARATE_SERIES:{chart:f,plugins:[w,V,x,r],preset:ze,data:O},PRESET_SERIES_SUM_SERIES:{chart:f,plugins:[w,V,x,r],preset:Te,data:O}},Rose:{PRESET_SERIES_BASIC:{chart:f,plugins:[J,K,x,r],preset:Re,data:O},PRESET_ROSE_SCALING_BY_RADIUS:{chart:f,plugins:[J,K,x,r],preset:kt,data:O},PRESET_SERIES_DESC:{chart:f,plugins:[J,K,x,r],preset:He,data:O},PRESET_SERIES_SEPARATE_SERIES:{chart:f,plugins:[J,K,x,r],preset:ze,data:O},PRESET_SERIES_SUM_SERIES:{chart:f,plugins:[J,K,x,r],preset:Te,data:O},PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES:{chart:f,plugins:[J,K,x,r],preset:wt,data:O}}},grid:{Bars:{PRESET_GRID_BASIC:{chart:c,plugins:[m,T,H,d,S,r],preset:Ie,data:R},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:c,plugins:[m,T,H,d,S,r],preset:Ae,data:R},PRESET_GRID_HORIZONTAL:{chart:c,plugins:[m,T,H,d,S,r],preset:$e,data:R},PRESET_BARS_ROUND:{chart:c,plugins:[m,T,H,d,S,r],preset:Vt,data:R},PRESET_BARS_HORIZONTAL_AND_ROUND:{chart:c,plugins:[m,T,H,d,S,r],preset:Zt,data:R},PRESET_BARS_THIN:{chart:c,plugins:[m,T,H,d,S,r],preset:Xt,data:R},PRESET_BARS_HORIZONTAL_AND_THIN:{chart:c,plugins:[m,T,H,d,S,r],preset:Wt,data:R},PRESET_GRID_SEPARATE_SERIES:{chart:c,plugins:[m,T,H,d,S,r],preset:Ee,data:R}},BarsDiverging:{PRESET_GRID_DIVERGING_SCALE:{chart:c,plugins:[m,T,$a,d,S,r],preset:Yt,data:Sa}},BarStack:{PRESET_GRID_BASIC:{chart:c,plugins:[m,oe,le,d,S,r],preset:Ie,data:R},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:c,plugins:[m,oe,le,d,S,r],preset:Ae,data:R},PRESET_GRID_HORIZONTAL:{chart:c,plugins:[m,oe,le,d,S,r],preset:$e,data:R},PRESET_GRID_SEPARATE_SERIES:{chart:c,plugins:[m,oe,le,d,S,r],preset:Ee,data:R}},BarsTriangle:{PRESET_GRID_BASIC:{chart:c,plugins:[m,T,ue,d,S,r],preset:Ie,data:R},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:c,plugins:[m,T,ue,d,S,r],preset:Ae,data:R},PRESET_GRID_HORIZONTAL:{chart:c,plugins:[m,T,ue,d,S,r],preset:$e,data:R},PRESET_GRID_SEPARATE_SERIES:{chart:c,plugins:[m,T,ue,d,S,r],preset:Ee,data:R}},Lines:{PRESET_LINES_BASIC:{chart:c,plugins:[m,T,y,v,d,S,r],preset:jt,data:R},PRESET_LINES_ROTATE_AXIS_LABEL:{chart:c,plugins:[m,T,y,v,d,S,r],preset:qt,data:R},PRESET_LINES_HORIZONTAL:{chart:c,plugins:[m,T,y,v,d,S,r],preset:Jt,data:R},PRESET_LINES_CURVE:{chart:c,plugins:[m,T,y,v,d,S,r],preset:Kt,data:R},PRESET_LINES_HIGHLIGHT_GROUP_DOTS:{chart:c,plugins:[m,T,y,Ve,v,d,S,r],preset:Qt,data:R},PRESET_GRID_SEPARATE_SERIES:{chart:c,plugins:[m,T,y,d,S,r],preset:Ee,data:R}},LineAreas:{PRESET_LINE_AREAS_BASIC:{chart:c,plugins:[m,T,q,y,v,d,S,r],preset:ea,data:R},PRESET_LINE_AREAS_ROTATE_AXIS_LABEL:{chart:c,plugins:[m,T,q,y,v,d,S,r],preset:ta,data:R},PRESET_LINE_AREAS_HORIZONTAL:{chart:c,plugins:[m,T,q,y,v,d,S,r],preset:aa,data:R},PRESET_LINE_AREAS_CURVE:{chart:c,plugins:[m,T,q,y,v,d,S,r],preset:ra,data:R},PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS:{chart:c,plugins:[m,T,q,y,Ve,v,d,S,r],preset:sa,data:R},PRESET_LINE_AREAS_SEPARATE_GRID:{chart:c,plugins:[m,T,q,y,d,S,r],preset:ia,data:R}}},multiGrid:{MultiBars:{PRESET_MULTI_BARS_DIVERGING:{chart:$,plugins:[D,C,j,h,r],preset:na,data:Ma},PRESET_MULTI_GRID_2_GRID_SLOT:{chart:$,plugins:[D,C,j,h,r],preset:De,data:b},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:$,plugins:[D,C,j,h,r],preset:he,data:ee},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:$,plugins:[D,C,j,h,r],preset:Le,data:te},PRESET_MULTI_GRID_BASIC:{chart:$,plugins:[D,de,j,U,ne,h,r],preset:Pe,data:b},PRESET_MULTI_GRID_ROUND_STYLE:{chart:$,plugins:[D,de,j,U,ne,h,r],preset:oa,data:b}},MultiBarStack:{PRESET_MULTI_GRID_2_GRID_SLOT:{chart:$,plugins:[D,xe,_e,h,r],preset:De,data:b},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:$,plugins:[D,xe,_e,h,r],preset:he,data:ee},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:$,plugins:[D,xe,_e,h,r],preset:Le,data:te},PRESET_MULTI_GRID_BASIC:{chart:$,plugins:[D,Na,_e,U,ne,h,r],preset:Pe,data:b}},MultiBarsTriangle:{PRESET_MULTI_GRID_2_GRID_SLOT:{chart:$,plugins:[D,C,ce,h,r],preset:De,data:b},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:$,plugins:[D,C,ce,h,r],preset:he,data:ee},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:$,plugins:[D,C,ce,h,r],preset:Le,data:te},PRESET_MULTI_GRID_BASIC:{chart:$,plugins:[D,de,ce,U,ne,h,r],preset:Pe,data:b}},MultiLines:{PRESET_MULTI_LINES_2_GRID_SLOT:{chart:$,plugins:[D,C,U,h,r],preset:la,data:b},PRESET_MULTI_LINES_3_GRID_SLOT:{chart:$,plugins:[D,C,U,h,r],preset:ua,data:ee},PRESET_MULTI_LINES_4_GRID_SLOT:{chart:$,plugins:[D,C,U,h,r],preset:pa,data:te}},MultiLineAreas:{PRESET_MULTI_LINE_AREAS_2_GRID_SLOT:{chart:$,plugins:[D,C,fe,U,h,r],preset:ga,data:b},PRESET_MULTI_LINE_AREAS_3_GRID_SLOT:{chart:$,plugins:[D,C,fe,U,h,r],preset:Ea,data:ee},PRESET_MULTI_LINE_AREAS_4_GRID_SLOT:{chart:$,plugins:[D,C,fe,U,h,r],preset:_a,data:te}}},tree:{TreeMap:{PRESET_TREE_BASIC:{chart:Tt,plugins:[It,At,r],preset:ca,data:$t}}}},Ca={id:"chart",style:{width:"100%",height:"100%"}},_r=tt({__name:"[presetName]",setup(o){const n=at().params,a=Se[n.chartType]&&Se[n.chartType][n.pluginName]&&Se[n.chartType][n.pluginName][n.presetName]?Se[n.chartType][n.pluginName][n.presetName]:null;return nt({title:n.pluginName}),rt(()=>{if(!a)return;const i=document.querySelector("#chart"),u=a.plugins.map(g=>new g),I=new a.chart(i,{preset:a.preset});I.plugins$.next(u),I.data$.next(a.data)}),(i,u)=>(st(),it("div",Ca))}});export{_r as default};
