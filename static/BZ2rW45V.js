import{m as ke,u as Ve,n as Ze,o as Xe,c as We}from"./BZRjpnys.js";import{S as M}from"./C55koCnE.js";import{G as g}from"./DUbVQCgX.js";import{D as Ye,m as Ge,a as qe,b as Je,M as R,c as I,d as f,e as Y,f as h,g as v,h as C,i as j}from"./Ckd_qsWK.js";import{m as Ke,_ as Qe,i as je,a as et,O as Ne,b as k,x as Fe,D as tt,S as Q,c as at,t as G,d as pe,e as ge,f as Ee,s as _e,g as K,h as rt,j as Me}from"./C-r1ajy-.js";import{T as st,a as it,b as nt,t as ot}from"./DDx4ITOx.js";import{L as x}from"./2I89PLxh.js";import{c as lt,g as m,V as ee,D as y,L as Z}from"./BI9JjsZv.js";import{B as b}from"./BdOqpYEc.js";import{c as ut}from"./CGhq0c1m.js";import{o as pt}from"./CM3MldSs.js";import{c as gt,B as te}from"./DKXG_Wpi.js";import{c as Et,B as ae}from"./Zx7AKY3f.js";import{G as E}from"./y42ZON3W.js";import{G as _,V as d}from"./DVxdavA8.js";import{S as c}from"./DD34Abor.js";import{g as X,a as Le,p as _t,m as ct,s as He}from"./BeiEZ8Ba.js";import{m as St,a as mt,T as r}from"./Bqr0G1JL.js";import{g as dt}from"./Cha9ElIW.js";import{f as Tt}from"./CmcBniGk.js";import{O as re}from"./ClSpeHce.js";import{B as se}from"./D1dYtOBg.js";import{P as H}from"./Bp9OZYNL.js";import{P as Rt}from"./CRQ4t6D2.js";import{s as ie,P as z}from"./D7Uc4SHE.js";import{S as B}from"./CMrq8AOS.js";import{P as It,a as ht,b as Lt,c as Be,d as At,e as Dt,f as Pt,g as $t,h as ft,i as xt,j as ce,k as Se,l as me,m as Gt,n as Nt,o as Mt,p as Bt,q as ne,r as Ct,s as yt,t as Ot,u as Ut,v as vt,w as bt,x as Ft,y as Ht,z as zt,A as wt,B as kt,C as Vt,D as de,E as Te,F as Re,G as Ie,H as Zt,I as Xt,J as Wt,K as Yt,L as qt,M as Jt,N as Kt,O as Qt}from"./CVFjmBAB.js";import{g as jt}from"./Dflj-YB1.js";import"./D4pPQIKa.js";import"./CM_XUJKS.js";import"./C1jEQCFH.js";import"./BiLfoTzo.js";var ea=["addListener","removeListener"],ta=["addEventListener","removeEventListener"],aa=["on","off"];function Ae(i,S,s,a){if(k(s)&&(a=s,s=void 0),a)return Ae(i,S,s).pipe(Ke(a));var n=Qe(ia(i)?ta.map(function(p){return function(t){return i[p](S,t,s)}}):ra(i)?ea.map(Ce(i,S)):sa(i)?aa.map(Ce(i,S)):[],2),u=n[0],L=n[1];if(!u&&je(i))return St(function(p){return Ae(p,S,s)})(et(i));if(!u)throw new TypeError("Invalid event target");return new Ne(function(p){var t=function(){for(var l=[],T=0;T<arguments.length;T++)l[T]=arguments[T];return p.next(1<l.length?l:l[0])};return u(t),function(){return L(t)}})}function Ce(i,S){return function(s){return function(a){return i[s](S,a)}}}function ra(i){return k(i.addListener)&&k(i.removeListener)}function sa(i){return k(i.on)&&k(i.off)}function ia(i){return k(i.addEventListener)&&k(i.removeEventListener)}const ye="BarsDiverging",na=Fe(ye,tt)(({selection:i,name:S,subject:s,observer:a})=>{const n=new Q,u=ut(ye,{selection:i,computedData$:a.computedData$,computedLayoutData$:a.computedLayoutData$,visibleComputedData$:a.visibleComputedData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,seriesLabels$:a.seriesLabels$,SeriesDataMap$:a.SeriesDataMap$,GroupDataMap$:a.GroupDataMap$,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridGraphicTransform$:a.gridGraphicTransform$,gridGraphicReverseScale$:a.gridGraphicReverseScale$,gridAxesSize$:a.gridAxesSize$,gridHighlight$:a.gridHighlight$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:pt(!0),event$:s.event$});return()=>{n.next(void 0),u()}});function oa(i,S){let s=new Ne(()=>{});return i.each(function(){const a=Ae(this,S);s=mt(s,a)}),s}const De="GroupAux",Pe=X(De,"label-box");function la({groupLabel:i,axisX:S,axisHeight:s,fullParams:a}){return a.showLine&&i?[{id:i,x1:S,x2:S,y1:0,y2:s}]:[]}function ua({selection:i,pluginName:S,lineData:s,fullParams:a,fullChartParams:n}){const u=X(S,"auxline"),L=i.selectAll(`line.${u}`).data(s),p=L.enter().append("line").classed(u,!0).style("stroke",l=>Le(a.lineColorType,n)).style("stroke-width",1).style("stroke-dasharray",a.lineDashArray??"none").style("pointer-events","none"),t=L.merge(p);return L.exit().remove(),p.attr("x1",l=>l.x1).attr("y1",l=>l.y1).attr("x2",l=>l.x2).attr("y2",l=>l.y2),L.transition().duration(50).attr("x1",l=>l.x1).attr("y1",l=>l.y1).attr("x2",l=>l.x2).attr("y2",l=>l.y2),t}function pa(i){i.selectAll("line").data([]).exit().remove()}function ga({groupLabel:i,axisX:S,fullParams:s}){return s.showLabel&&i?[{id:i,x:S,y:-s.labelPadding,text:_t(i,s.labelTextFormat)}]:[]}function Ea({selection:i,labelData:S,fullParams:s,fullChartParams:a,gridAxesReverseTransformValue:n,textSizePx:u}){const L=u+4,p=i.selectAll(`g.${Pe}`).data(S),t=p.enter().append("g").classed(Pe,!0).style("cursor","pointer"),l=t.merge(p);return t.attr("transform",(T,N)=>`translate(${T.x}, ${T.y})`),p.transition().duration(50).attr("transform",(T,N)=>`translate(${T.x}, ${T.y})`),p.exit().remove(),l.each((T,N,e)=>{const o=ct(T.text,u)+12,O=-o/2,P=K(e[N]).selectAll("rect").data([T]),D=P.enter().append("rect").attr("height",`${L}px`).attr("fill",$=>Le(s.labelColorType,a)).attr("x",O).attr("y",-2).attr("rx",5).attr("ry",5).style("cursor","pointer");P.merge(D).attr("width",$=>`${o}px`).style("transform",n),P.exit().remove();const A=K(e[N]).selectAll("text").data([T]),F=A.enter().append("text").style("dominant-baseline","hanging").style("cursor","pointer");A.merge(F).text($=>$.text).style("transform",n).attr("fill",$=>Le(s.labelTextColorType,a)).attr("font-size",a.styles.textSize).attr("x",O+6),A.exit().remove()}),l}function _a(i){i.selectAll(`g.${Pe}`).data([]).exit().remove()}const Oe=Fe(De,at)(({selection:i,rootSelection:S,name:s,subject:a,observer:n})=>{const u=new Q,L=S.insert("rect","g").classed(X(De,"rect"),!0).attr("opacity",0),p=i.append("g");n.layout$.pipe(G(u)).subscribe(e=>{L.attr("width",e.rootWidth).attr("height",e.rootHeight)}),n.gridAxesTransform$.pipe(G(u),pe(e=>e.value),ge()).subscribe(e=>{p.style("transform",e)});const t=new Ne(e=>{Ee({fullDataFormatter:n.fullDataFormatter$,gridAxesSize:n.gridAxesSize$,computedData:n.computedData$}).pipe(G(u),_e(async o=>o)).subscribe(o=>{const P=o.computedData[0]?o.computedData[0].length-1:0,D=o.fullDataFormatter.grid.groupAxis.scaleDomain[0]==="auto"?0-o.fullDataFormatter.grid.groupAxis.scalePadding:o.fullDataFormatter.grid.groupAxis.scaleDomain[0]-o.fullDataFormatter.grid.groupAxis.scalePadding,A=o.fullDataFormatter.grid.groupAxis.scaleDomain[1]==="auto"?P+o.fullDataFormatter.grid.groupAxis.scalePadding:o.fullDataFormatter.grid.groupAxis.scaleDomain[1]+o.fullDataFormatter.grid.groupAxis.scalePadding,F=o.computedData[0]?o.computedData[0].length:0;let $=o.fullDataFormatter.grid.seriesDirection==="row"?(o.computedData[0]??[]).map(W=>W.groupLabel):o.computedData.map(W=>W[0].groupLabel);const U=new Array(F).fill(0).map((W,V)=>$[V]!=null?$[V]:String(V)).filter((W,V)=>V>=D&&V<=A),ze=o.fullDataFormatter.grid.groupAxis.scalePadding,we=rt({axisLabels:U,axisWidth:o.gridAxesSize.width,padding:ze});e.next(we)})}),l=dt({fullDataFormatter$:n.fullDataFormatter$,gridAxesSize$:n.gridAxesSize$,computedData$:n.computedData$,fullChartParams$:n.fullChartParams$}),T=n.fullChartParams$.pipe(G(u),pe(e=>e.highlightTarget),ge());return Ee({computedData:n.computedData$,gridAxesSize:n.gridAxesSize$,fullParams:n.fullParams$,fullChartParams:n.fullChartParams$,highlightTarget:T,SeriesDataMap:n.SeriesDataMap$,GroupDataMap:n.GroupDataMap$,gridGroupPositionFn:l,groupScale:t}).pipe(G(u),_e(async e=>e)).subscribe(e=>{S.on("mouseover",(o,O)=>{const{groupIndex:P,groupLabel:D}=e.gridGroupPositionFn(o);a.event$.next({type:"grid",pluginName:s,eventName:"mouseover",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.GroupDataMap.get(D)??[],groupIndex:P,groupLabel:D,event:o,data:e.computedData})}).on("mousemove",(o,O)=>{const{groupIndex:P,groupLabel:D}=e.gridGroupPositionFn(o);a.event$.next({type:"grid",pluginName:s,eventName:"mousemove",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.GroupDataMap.get(D)??[],groupIndex:P,groupLabel:D,event:o,data:e.computedData})}).on("mouseout",(o,O)=>{const{groupIndex:P,groupLabel:D}=e.gridGroupPositionFn(o);a.event$.next({type:"grid",pluginName:s,eventName:"mouseout",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.GroupDataMap.get(D)??[],groupIndex:P,groupLabel:D,event:o,data:e.computedData})}).on("click",(o,O)=>{o.stopPropagation();const{groupIndex:P,groupLabel:D}=e.gridGroupPositionFn(o);a.event$.next({type:"grid",pluginName:s,eventName:"click",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.GroupDataMap.get(D)??[],groupIndex:P,groupLabel:D,event:o,data:e.computedData})})}),Ee({event:a.event$.pipe(Tt(e=>e.eventName==="mouseover"||e.eventName==="mousemove")),computedData:n.computedData$,groupScale:t,gridAxesSize:n.gridAxesSize$,fullParams:n.fullParams$,fullChartParams:n.fullChartParams$,highlightTarget:T,gridAxesReverseTransform:n.gridAxesReverseTransform$,GroupDataMap:n.GroupDataMap$,gridGroupPositionFn:l,textSizePx:n.textSizePx$}).pipe(G(u),_e(async e=>e)).subscribe(e=>{const o=e.groupScale(e.event.groupLabel)??0,O=la({groupLabel:e.event.groupLabel,axisX:o,axisHeight:e.gridAxesSize.height,fullParams:e.fullParams});ua({selection:p,pluginName:s,lineData:O,fullParams:e.fullParams,fullChartParams:e.fullChartParams});const P=ga({groupLabel:e.event.groupLabel,axisX:o,fullParams:e.fullParams});Ea({selection:p,labelData:P,fullParams:e.fullParams,fullChartParams:e.fullChartParams,gridAxesReverseTransformValue:e.gridAxesReverseTransform.value,textSizePx:e.textSizePx}).on("mouseover",(A,F)=>{const{groupIndex:$,groupLabel:U}=e.gridGroupPositionFn(A);a.event$.next({type:"grid",pluginName:s,eventName:"mouseover",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.event.groups,groupIndex:$,groupLabel:U,event:A,data:e.computedData})}).on("mousemove",(A,F)=>{const{groupIndex:$,groupLabel:U}=e.gridGroupPositionFn(A);a.event$.next({type:"grid",pluginName:s,eventName:"mousemove",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.event.groups,groupIndex:$,groupLabel:U,event:A,data:e.computedData})}).on("mouseout",(A,F)=>{const{groupIndex:$,groupLabel:U}=e.gridGroupPositionFn(A);a.event$.next({type:"grid",pluginName:s,eventName:"mouseout",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.event.groups,groupIndex:$,groupLabel:U,event:A,data:e.computedData})}).on("click",(A,F)=>{const{groupIndex:$,groupLabel:U}=e.gridGroupPositionFn(A);a.event$.next({type:"grid",pluginName:s,eventName:"click",highlightTarget:e.highlightTarget,datum:null,gridIndex:0,series:[],seriesIndex:-1,seriesLabel:"",groups:e.event.groups,groupIndex:$,groupLabel:U,event:A,data:e.computedData})})}),oa(L,"mouseout").pipe(G(u)).subscribe(e=>{console.log("rootMouseout"),pa(p),_a(p)}),()=>{u.next(void 0),L.remove()}}),$e="MultiBarStack",Ue=X($e,"grid"),oe=Me($e,Ye)(({selection:i,name:S,subject:s,observer:a})=>{const n=new Q,u=[];return Ge(a).pipe(G(n)).subscribe(p=>{u.forEach(t=>t()),i.selectAll(`g.${Ue}`).data(p).join("g").attr("class",Ue).each((t,l,T)=>{const N=K(T[l]),e=t.dataFormatter$.pipe(G(n),pe(o=>o.grid.separateSeries),ge(),He(1));u[l]=gt($e,{selection:N,computedData$:t.computedData$,visibleComputedData$:t.visibleComputedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:a.fullParams$,fullDataFormatter$:t.dataFormatter$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridGraphicReverseScale$:t.gridGraphicReverseScale$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:e,event$:s.event$})})}),()=>{n.next(void 0),u.forEach(p=>p())}}),fe="MultiBarsTriangle",ve=X(fe,"grid"),le=Me(fe,qe)(({selection:i,name:S,subject:s,observer:a})=>{const n=new Q,u=[];return Ge(a).pipe(G(n)).subscribe(p=>{u.forEach(t=>t()),i.selectAll(`g.${ve}`).data(p).join("g").attr("class",ve).each((t,l,T)=>{const N=K(T[l]),e=t.dataFormatter$.pipe(G(n),pe(o=>o.grid.separateSeries),ge(),He(1));u[l]=Et(fe,{selection:N,computedData$:t.computedData$,visibleComputedData$:t.visibleComputedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,fullDataFormatter$:t.dataFormatter$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:e,event$:s.event$})})}),()=>{n.next(void 0),u.forEach(p=>p())}}),xe="MultiLineAreas",be=X(xe,"grid"),he=Me(xe,Je)(({selection:i,name:S,subject:s,observer:a})=>{const n=new Q,u=[];return Ge(a).pipe(G(n)).subscribe(p=>{u.forEach(t=>t()),i.selectAll(`g.${be}`).data(p).join("g").attr("class",be).each((t,l,T)=>{const N=K(T[l]);u[l]=lt(xe,{selection:N,computedData$:t.computedData$,computedLayoutData$:t.computedLayoutData$,visibleComputedData$:t.visibleComputedData$,visibleComputedLayoutData$:t.visibleComputedLayoutData$,seriesLabels$:t.seriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullDataFormatter$:t.dataFormatter$,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainerPosition$:t.gridContainerPosition$,layout$:a.layout$,event$:s.event$})})}),()=>{n.next(void 0),u.forEach(p=>p())}}),w=[[80,120,45],[50,30,15,28],[55,13,38]],q=[[[1205,850,930,1111,1500],[735,900,880,1035,1120]],[[555,805,500,1150,1050],[1350,840,915,650,1200]],[[1200,1100,950,1105,850],[750,650,980,850,700]]],J=[[[1205,850,930,1111,1500],[735,900,880,1035,1120]],[[555,805,500,1150,1050],[1350,840,915,650,1200]],[[1200,1100,950,1105,850],[750,650,980,850,700]],[[680,880,770,330,710],[540,480,820,780,600]]],ue={series:{Bubbles:{PRESET_BUBBLES_BASIC:{chart:M,plugins:[se,B,r],preset:It,data:ie},PRESET_BUBBLES_SCALING_BY_RADIUS:{chart:M,plugins:[se,B,r],preset:ht,data:ie},PRESET_BUBBLES_SEPARATE_SERIES:{chart:M,plugins:[se,B,r],preset:Lt,data:ie},PRESET_SERIES_SUM_SERIES:{chart:M,plugins:[se,B,r],preset:Be,data:ie}},Pie:{PRESET_PIE_BASIC:{chart:M,plugins:[H,z,B,r],preset:At,data:w},PRESET_PIE_WITH_INNER_LABELS:{chart:M,plugins:[H,z,B,r],preset:Dt,data:w},PRESET_PIE_DONUT:{chart:M,plugins:[H,z,Rt,B,r],preset:Pt,data:w},PRESET_PIE_HALF_DONUT:{chart:M,plugins:[H,z,B,r],preset:$t,data:w},PRESET_SERIES_DESC:{chart:M,plugins:[H,z,B,r],preset:ft,data:w},PRESET_SERIES_SEPARATE_SERIES:{chart:M,plugins:[H,z,B,r],preset:xt,data:w},PRESET_SERIES_SUM_SERIES:{chart:M,plugins:[H,z,B,r],preset:Be,data:w}}},grid:{Bars:{PRESET_GRID_BASIC:{chart:g,plugins:[_,d,b,c,E,r],preset:ce,data:m},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:g,plugins:[_,d,b,c,E,r],preset:Se,data:m},PRESET_GRID_HORIZONTAL:{chart:g,plugins:[_,d,b,c,E,r],preset:me,data:m},PRESET_BARS_ROUND:{chart:g,plugins:[_,d,b,c,E,r],preset:Gt,data:m},PRESET_BARS_HORIZONTAL_AND_ROUND:{chart:g,plugins:[_,d,b,c,E,r],preset:Nt,data:m},PRESET_BARS_THIN:{chart:g,plugins:[_,d,b,c,E,r],preset:Mt,data:m},PRESET_BARS_HORIZONTAL_AND_THIN:{chart:g,plugins:[_,d,b,c,E,r],preset:Bt,data:m},PRESET_GRID_SEPARATE_SERIES:{chart:g,plugins:[_,d,b,c,E,r],preset:ne,data:m}},BarsDiverging:{PRESET_GRID_DIVERGING_SCALE:{chart:g,plugins:[_,d,na,c,E,r],preset:Ct,data:jt}},BarStack:{PRESET_GRID_BASIC:{chart:g,plugins:[_,ee,te,c,E,r],preset:ce,data:m},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:g,plugins:[_,ee,te,c,E,r],preset:Se,data:m},PRESET_GRID_HORIZONTAL:{chart:g,plugins:[_,ee,te,c,E,r],preset:me,data:m},PRESET_GRID_SEPARATE_SERIES:{chart:g,plugins:[_,ee,te,c,E,r],preset:ne,data:m}},BarsTriangle:{PRESET_GRID_BASIC:{chart:g,plugins:[_,d,ae,c,E,r],preset:ce,data:m},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:g,plugins:[_,d,ae,c,E,r],preset:Se,data:m},PRESET_GRID_HORIZONTAL:{chart:g,plugins:[_,d,ae,c,E,r],preset:me,data:m},PRESET_GRID_SEPARATE_SERIES:{chart:g,plugins:[_,d,ae,c,E,r],preset:ne,data:m}},Lines:{PRESET_LINES_BASIC:{chart:g,plugins:[_,d,x,y,c,E,r],preset:yt,data:m},PRESET_LINES_ROTATE_AXIS_LABEL:{chart:g,plugins:[_,d,x,y,c,E,r],preset:Ot,data:m},PRESET_LINES_HORIZONTAL:{chart:g,plugins:[_,d,x,y,c,E,r],preset:Ut,data:m},PRESET_LINES_CURVE:{chart:g,plugins:[_,d,x,y,c,E,r],preset:vt,data:m},PRESET_LINES_HIGHLIGHT_GROUP_DOTS:{chart:g,plugins:[_,d,x,Oe,y,c,E,r],preset:bt,data:m},PRESET_GRID_SEPARATE_SERIES:{chart:g,plugins:[_,d,x,c,E,r],preset:ne,data:m}},LineAreas:{PRESET_LINE_AREAS_BASIC:{chart:g,plugins:[_,d,Z,x,y,c,E,r],preset:Ft,data:m},PRESET_LINE_AREAS_ROTATE_AXIS_LABEL:{chart:g,plugins:[_,d,Z,x,y,c,E,r],preset:Ht,data:m},PRESET_LINE_AREAS_HORIZONTAL:{chart:g,plugins:[_,d,Z,x,y,c,E,r],preset:zt,data:m},PRESET_LINE_AREAS_CURVE:{chart:g,plugins:[_,d,Z,x,y,c,E,r],preset:wt,data:m},PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS:{chart:g,plugins:[_,d,Z,x,Oe,y,c,E,r],preset:kt,data:m},PRESET_LINE_AREAS_SEPARATE_GRID:{chart:g,plugins:[_,d,Z,x,c,E,r],preset:Vt,data:m}}},multiGrid:{MultiBars:{PRESET_MULTI_GRID_2_GRID_SLOT:{chart:R,plugins:[I,f,Y,h,r],preset:de,data:v},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:R,plugins:[I,f,Y,h,r],preset:Te,data:q},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:R,plugins:[I,f,Y,h,r],preset:Re,data:J},PRESET_MULTI_GRID_BASIC:{chart:R,plugins:[I,re,Y,C,j,h,r],preset:Ie,data:v},PRESET_MULTI_GRID_ROUND_STYLE:{chart:R,plugins:[I,re,Y,C,j,h,r],preset:Zt,data:v}},MultiBarStack:{PRESET_MULTI_GRID_2_GRID_SLOT:{chart:R,plugins:[I,f,oe,h,r],preset:de,data:v},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:R,plugins:[I,f,oe,h,r],preset:Te,data:q},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:R,plugins:[I,f,oe,h,r],preset:Re,data:J},PRESET_MULTI_GRID_BASIC:{chart:R,plugins:[I,re,oe,C,j,h,r],preset:Ie,data:v}},MultiBarsTriangle:{PRESET_MULTI_GRID_2_GRID_SLOT:{chart:R,plugins:[I,f,le,h,r],preset:de,data:v},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:R,plugins:[I,f,le,h,r],preset:Te,data:q},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:R,plugins:[I,f,le,h,r],preset:Re,data:J},PRESET_MULTI_GRID_BASIC:{chart:R,plugins:[I,re,le,C,j,h,r],preset:Ie,data:v}},MultiLines:{PRESET_MULTI_LINES_2_GRID_SLOT:{chart:R,plugins:[I,f,C,h,r],preset:Xt,data:v},PRESET_MULTI_LINES_3_GRID_SLOT:{chart:R,plugins:[I,f,C,h,r],preset:Wt,data:q},PRESET_MULTI_LINES_4_GRID_SLOT:{chart:R,plugins:[I,f,C,h,r],preset:Yt,data:J}},MultiLineAreas:{PRESET_MULTI_LINE_AREAS_2_GRID_SLOT:{chart:R,plugins:[I,f,he,C,h,r],preset:qt,data:v},PRESET_MULTI_LINE_AREAS_3_GRID_SLOT:{chart:R,plugins:[I,f,he,C,h,r],preset:Jt,data:q},PRESET_MULTI_LINE_AREAS_4_GRID_SLOT:{chart:R,plugins:[I,f,he,C,h,r],preset:Kt,data:J}}},tree:{TreeMap:{PRESET_TREE_BASIC:{chart:st,plugins:[it,nt,r],preset:Qt,data:ot}}}},ca={id:"chart",style:{width:"100%",height:"100vh"}},Wa=ke({__name:"[presetName]",setup(i){const s=Ve().params,a=ue[s.chartType]&&ue[s.chartType][s.pluginName]&&ue[s.chartType][s.pluginName][s.presetName]?ue[s.chartType][s.pluginName][s.presetName]:null;return Ze(()=>{if(!a)return;const n=document.querySelector("#chart"),u=a.plugins.map(p=>new p),L=new a.chart(n,{preset:a.preset});L.plugins$.next(u),L.data$.next(a.data)}),(n,u)=>(Xe(),We("div",ca))}});export{Wa as default};