import{n as Ot,u as Bt,q as Nt,o as Mt,c as Ct}from"./DMobbbPK.js";import{D as yt,a as Ut,S as B}from"./CwhGnaGa.js";import{D as bt,a as Ht,G as l,b as _}from"./CoE9W8Wv.js";import{c as vt,D as wt,m as It,a as Ft,M as g,b as R,d as I,e as b,f as d,g as A,h as G,i as v}from"./Dz5U0gCi.js";import{u as Dt,S as O,t as x,m as Pt,s as Q,a as $t,b as tt,c as Lt,d as kt,e as St}from"./pf1r-l3X.js";import{L as f}from"./DroFc33V.js";import{B as $}from"./RLe8-rXg.js";import{i as Vt,c as Xt,B as N}from"./DxdebLWl.js";import{c as Zt,B as M}from"./BTzos9Dv.js";import{G as u,V as E,S as o,g as w,a as jt}from"./DrHCwjgP.js";import{c as zt,T as s}from"./BvDBDVBM.js";import{g as at,a as Yt,m as Et,b as Wt}from"./DSAQ5uLE.js";import{O as F}from"./DYDobDuc.js";import{B as Tt}from"./Dw11xyiw.js";import{m as qt,S as C,P as k}from"./BxZFCcRw.js";import{f as At}from"./D6aa6w3T.js";import{P as Kt,a as Jt,b as Qt,c as ta,d as aa,e as ea,f as et,g as st,h as rt,i as sa,j as ra,k as ia,l as na,m as V,n as X,o as Z,p as la,q as _a,r as ua,s as oa,t as Sa,u as it,v as nt,w as lt,x as _t,y as pa,z as ca,A as Ea,B as Ta}from"./BouS1YfV.js";import"./Dnxvd09k.js";import"./D-UAQHR3.js";import"./i5aQ9B8c.js";import"./BdegRq93.js";import"./OXZoKtl2.js";const mt="Dots",H=Dt(mt,bt)(({selection:S,name:p,subject:r,observer:e})=>{const n=new O,i=vt(mt,{selection:S,computedData$:e.computedData$,visibleComputedData$:e.visibleComputedData$,existedSeriesLabels$:e.existedSeriesLabels$,SeriesDataMap$:e.SeriesDataMap$,GroupDataMap$:e.GroupDataMap$,fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:e.gridAxesTransform$,gridGraphicTransform$:e.gridGraphicTransform$,gridGraphicReverseScale$:e.gridGraphicReverseScale$,gridAxesSize$:e.gridAxesSize$,gridHighlight$:e.gridHighlight$,gridContainer$:e.gridContainer$,event$:r.event$});return()=>{n.next(void 0),i()}}),gt="ValueStackAxis",y=Dt(gt,Ht)(({selection:S,name:p,observer:r,subject:e})=>{const n=new O,i=r.computedData$.pipe(x(n),Pt(a=>{const t=new Array(a[0]?a[0].length:0).fill(null).map((P,h)=>a.reduce((D,L)=>{if(L&&L[h]){const xt=L[h].value==null||L[h].visible==!1?0:L[h].value;return D+xt}return D},0));return a.map((P,h)=>P.map((D,L)=>({...D,value:t[L]})))})),T=zt(gt,{selection:S,computedData$:r.isSeriesPositionSeprate$.pipe(Q(a=>Vt(()=>a,r.computedData$,i))),fullParams$:r.fullParams$,fullDataFormatter$:r.fullDataFormatter$,fullChartParams$:r.fullChartParams$,gridAxesTransform$:r.gridAxesTransform$,gridAxesReverseTransform$:r.gridAxesReverseTransform$,gridAxesSize$:r.gridAxesSize$,gridContainer$:r.gridContainer$,isSeriesPositionSeprate$:r.isSeriesPositionSeprate$});return()=>{n.next(void 0),T()}}),pt="MultiBarStack",Rt=at(pt,"grid"),j=$t(pt,wt)(({selection:S,name:p,subject:r,observer:e})=>{const n=new O,i=[];return It(e).subscribe(a=>{i.forEach(t=>t()),S.selectAll(`g.${Rt}`).data(a).join("g").attr("class",Rt).each((t,c,P)=>{const h=tt(P[c]);i[c]=Xt(pt,{selection:h,computedData$:t.gridComputedData$,visibleComputedData$:t.visibleComputedData$,existedSeriesLabels$:t.existedSeriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:e.fullParams$,fullDataFormatter$:t.gridDataFormatter$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridGraphicReverseScale$:t.gridGraphicReverseScale$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainer$:t.gridContainer$,isSeriesPositionSeprate$:t.isSeriesPositionSeprate$,event$:r.event$})})}),()=>{n.next(void 0),i.forEach(a=>a())}}),ct="MultiBarsTriangle",dt=at(ct,"grid"),z=$t(ct,Ft)(({selection:S,name:p,subject:r,observer:e})=>{const n=new O,i=[];return It(e).subscribe(a=>{i.forEach(t=>t()),S.selectAll(`g.${dt}`).data(a).join("g").attr("class",dt).each((t,c,P)=>{const h=tt(P[c]);i[c]=Zt(ct,{selection:h,computedData$:t.gridComputedData$,visibleComputedData$:t.visibleComputedData$,existedSeriesLabels$:t.existedSeriesLabels$,SeriesDataMap$:t.SeriesDataMap$,GroupDataMap$:t.GroupDataMap$,fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridGraphicTransform$:t.gridGraphicTransform$,gridAxesSize$:t.gridAxesSize$,gridHighlight$:t.gridHighlight$,gridContainer$:t.gridContainer$,isSeriesPositionSeprate$:t.isSeriesPositionSeprate$,event$:r.event$})})}),()=>{n.next(void 0),i.forEach(a=>a())}}),ft="PieEventTexts",ht=at(ft,"text");function ut(S,p){const r=S.selectAll(`text.${ht}`).data(p),e=r.enter().append("text").classed(ht,!0),n=r.merge(e);return n.each((i,T,a)=>{const t=tt(a[T]).text(i.text);Object.keys(i.attr).forEach(c=>{t.attr(c,i.attr[c])}),Object.keys(i.style).forEach(c=>{t.style(c,i.style[c])})}),r.exit().remove(),n}function ot({eventData:S,eventName:p,t:r,eventFn:e,textAttrs:n,textStyles:i}){return e(S,p,r).map((a,t)=>({text:a,attr:n[t],style:i[t]}))}const ma=Lt(ft,yt)(({selection:S,name:p,observer:r,subject:e})=>{const n=new O,i=S.append("g");let T;r.layout$.pipe(At()).subscribe(t=>{S.attr("transform",`translate(${t.width/2}, ${t.height/2})`),r.layout$.pipe(x(n)).subscribe(c=>{S.transition().attr("transform",`translate(${c.width/2}, ${c.height/2})`)})});const a=r.fullChartParams$.pipe(x(n),Pt(t=>t.highlightTarget),kt());return St({computedData:r.computedData$,fullParams:r.fullParams$,fullChartParams:r.fullChartParams$,highlightTarget:a}).pipe(x(n),Q(async t=>t)).subscribe(t=>{i.transition().duration(t.fullChartParams.transitionDuration).ease(Yt(t.fullChartParams.transitionEase)).tween("move",(c,P)=>h=>{const D=ot({eventData:{type:"series",pluginName:p,eventName:"transitionMove",event:c,highlightTarget:t.highlightTarget,data:t.computedData,series:[],seriesIndex:-1,seriesLabel:"",datum:null},eventName:"transitionMove",t:h,eventFn:t.fullParams.eventFn,textAttrs:t.fullParams.textAttrs,textStyles:t.fullParams.textStyles});ut(i,D)}).on("end",(c,P)=>{const h=ot({eventData:{type:"series",pluginName:p,eventName:"transitionEnd",event:c,highlightTarget:t.highlightTarget,data:t.computedData,series:[],seriesIndex:-1,seriesLabel:"",datum:null},eventName:"transitionMove",t:1,eventFn:t.fullParams.eventFn,textAttrs:t.fullParams.textAttrs,textStyles:t.fullParams.textStyles});ut(i,h),T&&T.unsubscribe(),T=e.event$.subscribe(D=>{const L=ot({eventData:D,eventName:D.eventName,t:1,eventFn:t.fullParams.eventFn,textAttrs:t.fullParams.textAttrs,textStyles:t.fullParams.textStyles});ut(i,L)})})}),()=>{n.next(void 0)}}),Gt="PieLabels",ga=at(Gt,"text");function Ra(S,p,r,e){return S.map((n,i)=>{const[T,a]=p.centroid(n),[t,c]=r.centroid(n);return{pieDatum:n,arcIndex:i,arcLabel:n.data.label,x:T*e,y:a*e,mouseoverX:t*e,mouseoverY:c*e}}).filter(n=>n.pieDatum.data.visible)}function da(S,p,r,e){let n=S.selectAll("text").data(p,t=>t.pieDatum.id),i=n.enter().append("text").classed(ga,!0),T=n.exit();i.append("text");const a=n.merge(i);return a.attr("font-weight","bold").attr("text-anchor","middle").style("dominant-baseline","middle").style("cursor",t=>e.highlightTarget&&e.highlightTarget!="none"?"pointer":"none").text(t=>r.labelFn(t.pieDatum.data)).attr("font-size",e.styles.textSize).attr("fill",(t,c)=>Wt({datum:t.pieDatum.data,colorType:r.labelColorType,fullChartParams:e})).transition().attr("transform",t=>"translate("+t.x+","+t.y+")"),T.remove(),a}function ha({labelSelection:S,ids:p,fullChartParams:r}){if(S.interrupt("highlight"),!p.length){S.transition().duration(200).attr("transform",e=>"translate("+e.x+","+e.y+")").style("opacity",1);return}S.each((e,n,i)=>{const T=tt(i[n]);p.includes(e.pieDatum.id)?T.style("opacity",1).transition().duration(200).attr("transform",a=>"translate("+a.mouseoverX+","+a.mouseoverY+")"):T.style("opacity",r.styles.unhighlightedOpacity).transition().duration(200).attr("transform",a=>"translate("+a.x+","+a.y+")")})}const Y=Lt(Gt,Ut)(({selection:S,observer:p,subject:r})=>{const e=new O,n=S.append("g");let i=new O,T=[];return p.layout$.pipe(At()).subscribe(a=>{S.attr("transform",`translate(${a.width/2}, ${a.height/2})`),p.layout$.pipe(x(e)).subscribe(t=>{S.transition().attr("transform",`translate(${t.width/2}, ${t.height/2})`)})}),St({layout:p.layout$,computedData:p.computedData$,fullParams:p.fullParams$,fullChartParams:p.fullChartParams$}).pipe(x(e),Q(async a=>a)).subscribe(a=>{const t=a.layout.width<a.layout.height?a.layout.width:a.layout.height,c=Et({axisWidth:t,innerRadius:0,outerRadius:a.fullParams.outerRadius,padAngle:0,cornerRadius:0}),P=Et({axisWidth:t,innerRadius:0,outerRadius:a.fullParams.outerMouseoverRadius,padAngle:0,cornerRadius:0}),h=qt({computedDataSeries:a.computedData,startAngle:a.fullParams.startAngle,endAngle:a.fullParams.endAngle});T=Ra(h,c,P,a.fullParams.labelCentroid);const D=da(n,T,a.fullParams,a.fullChartParams);i.next(D)}),St({labelSelection:i,highlight:p.seriesHighlight$,fullChartParams:p.fullChartParams$}).pipe(x(e),Q(async a=>a)).subscribe(a=>{ha({labelSelection:a.labelSelection,ids:a.highlight,fullChartParams:a.fullChartParams})}),()=>{e.next(void 0)}}),U=[15,38,25,17,26,72,64,29],m=[[55,80,50,11,150],[35,40,15,65,120]],W=[[55,80,50,11,150],[35,40,15,65,120],[75,90,600,50,120]],q=[[[1205,850,930,1111,1500],[735,900,880,1035,1120]],[[555,805,500,1150,1050],[1350,840,915,650,1200]],[[1200,1100,950,1105,850],[750,650,980,850,700]]],K=[[[1205,850,930,1111,1500],[735,900,880,1035,1120]],[[555,805,500,1150,1050],[1350,840,915,650,1200]],[[1200,1100,950,1105,850],[750,650,980,850,700]],[[680,880,770,330,710],[540,480,820,780,600]]],J={series:{Bubbles:{PRESET_BUBBLES_BASIC:{chart:B,plugins:[Tt,C,s],preset:Kt,data:U},PRESET_BUBBLES_SCALING_BY_RADIUS:{chart:B,plugins:[Tt,C,s],preset:Jt,data:U}},Pie:{PRESET_PIE_BASIC:{chart:B,plugins:[k,Y,C,s],preset:Qt,data:U},PRESET_PIE_WITH_INNER_LABELS:{chart:B,plugins:[k,Y,C,s],preset:ta,data:U},PRESET_PIE_DONUT:{chart:B,plugins:[k,Y,ma,C,s],preset:aa,data:U},PRESET_PIE_HALF_DONUT:{chart:B,plugins:[k,Y,C,s],preset:ea,data:U}}},grid:{Bars:{PRESET_GRID_BASIC:{chart:l,plugins:[u,E,$,o,_,s],preset:et,data:m},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:l,plugins:[u,E,$,o,_,s],preset:st,data:m},PRESET_GRID_HORIZONTAL:{chart:l,plugins:[u,E,$,o,_,s],preset:rt,data:m},PRESET_BARS_ROUND:{chart:l,plugins:[u,E,$,o,_,s],preset:sa,data:m},PRESET_BARS_HORIZONTAL_AND_ROUND:{chart:l,plugins:[u,E,$,o,_,s],preset:ra,data:m},PRESET_BARS_THIN:{chart:l,plugins:[u,E,$,o,_,s],preset:ia,data:m},PRESET_BARS_HORIZONTAL_AND_THIN:{chart:l,plugins:[u,E,$,o,_,s],preset:na,data:m},PRESET_GRID_2_SERIES_SLOT:{chart:l,plugins:[u,E,$,o,_,s],preset:V,data:m},PRESET_GRID_3_SERIES_SLOT:{chart:l,plugins:[u,E,$,o,_,s],preset:X,data:W},PRESET_GRID_4_SERIES_SLOT:{chart:l,plugins:[u,E,$,o,_,s],preset:Z,data:w}},BarStack:{PRESET_GRID_BASIC:{chart:l,plugins:[u,y,N,o,_,s],preset:et,data:m},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:l,plugins:[u,y,N,o,_,s],preset:st,data:m},PRESET_GRID_HORIZONTAL:{chart:l,plugins:[u,y,N,o,_,s],preset:rt,data:m},PRESET_GRID_2_SERIES_SLOT:{chart:l,plugins:[u,y,N,o,_,s],preset:V,data:m},PRESET_GRID_3_SERIES_SLOT:{chart:l,plugins:[u,y,N,o,_,s],preset:X,data:W},PRESET_GRID_4_SERIES_SLOT:{chart:l,plugins:[u,y,N,o,_,s],preset:Z,data:w}},BarsTriangle:{PRESET_GRID_BASIC:{chart:l,plugins:[u,E,M,o,_,s],preset:et,data:m},PRESET_GRID_ROTATE_AXIS_LABEL:{chart:l,plugins:[u,E,M,o,_,s],preset:st,data:m},PRESET_GRID_HORIZONTAL:{chart:l,plugins:[u,E,M,o,_,s],preset:rt,data:m},PRESET_GRID_2_SERIES_SLOT:{chart:l,plugins:[u,E,M,o,_,s],preset:V,data:m},PRESET_GRID_3_SERIES_SLOT:{chart:l,plugins:[u,E,M,o,_,s],preset:X,data:W},PRESET_GRID_4_SERIES_SLOT:{chart:l,plugins:[u,E,M,o,_,s],preset:Z,data:w}},Lines:{PRESET_LINES_BASIC:{chart:l,plugins:[u,E,f,H,o,_,s],preset:la,data:m},PRESET_LINES_ROTATE_AXIS_LABEL:{chart:l,plugins:[u,E,f,H,o,_,s],preset:_a,data:m},PRESET_LINES_HORIZONTAL:{chart:l,plugins:[u,E,f,H,o,_,s],preset:ua,data:m},PRESET_LINES_CURVE:{chart:l,plugins:[u,E,f,H,o,_,s],preset:oa,data:m},PRESET_LINES_HIGHLIGHT_GROUP_DOTS:{chart:l,plugins:[u,E,f,H,jt,o,_,s],preset:Sa,data:m},PRESET_GRID_2_SERIES_SLOT:{chart:l,plugins:[u,E,f,o,_,s],preset:V,data:m},PRESET_GRID_3_SERIES_SLOT:{chart:l,plugins:[u,E,f,o,_,s],preset:X,data:W},PRESET_GRID_4_SERIES_SLOT:{chart:l,plugins:[u,E,f,o,_,s],preset:Z,data:w}}},multiGrid:{MultiBars:{PRESET_MULTI_GRID_2_GRID_SLOT:{chart:g,plugins:[R,I,b,d,s],preset:it,data:A},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:g,plugins:[R,I,b,d,s],preset:nt,data:q},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:g,plugins:[R,I,b,d,s],preset:lt,data:K},PRESET_MULTI_GRID_BASIC:{chart:g,plugins:[R,F,b,G,v,d,s],preset:_t,data:A},PRESET_MULTI_GRID_ROUND_STYLE:{chart:g,plugins:[R,F,b,G,v,d,s],preset:pa,data:A}},MultiBarStack:{PRESET_MULTI_GRID_2_GRID_SLOT:{chart:g,plugins:[R,I,j,d,s],preset:it,data:A},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:g,plugins:[R,I,j,d,s],preset:nt,data:q},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:g,plugins:[R,I,j,d,s],preset:lt,data:K},PRESET_MULTI_GRID_BASIC:{chart:g,plugins:[R,F,j,G,v,d,s],preset:_t,data:A}},MultiBarsTriangle:{PRESET_MULTI_GRID_2_GRID_SLOT:{chart:g,plugins:[R,I,z,d,s],preset:it,data:A},PRESET_MULTI_GRID_3_GRID_SLOT:{chart:g,plugins:[R,I,z,d,s],preset:nt,data:q},PRESET_MULTI_GRID_4_GRID_SLOT:{chart:g,plugins:[R,I,z,d,s],preset:lt,data:K},PRESET_MULTI_GRID_BASIC:{chart:g,plugins:[R,F,z,G,v,d,s],preset:_t,data:A}},MultiLines:{PRESET_MULTI_LINES_2_GRID_SLOT:{chart:g,plugins:[R,I,G,d,s],preset:ca,data:A},PRESET_MULTI_LINES_3_GRID_SLOT:{chart:g,plugins:[R,I,G,d,s],preset:Ea,data:q},PRESET_MULTI_LINES_4_GRID_SLOT:{chart:g,plugins:[R,I,G,d,s],preset:Ta,data:K}}}},Ia={id:"chart",style:{width:"100%",height:"100vh"}},Xa=Ot({__name:"[presetName]",setup(S){const r=Bt().params,e=J[r.chartType]&&J[r.chartType][r.pluginName]&&J[r.chartType][r.pluginName][r.presetName]?J[r.chartType][r.pluginName][r.presetName]:null;return Nt(()=>{if(!e)return;const n=document.querySelector("#chart"),i=e.plugins.map(a=>new a),T=new e.chart(n,{preset:e.preset});T.plugins$.next(i),T.data$.next(e.data)}),(n,i)=>(Mt(),Ct("div",Ia))}});export{Xa as default};
