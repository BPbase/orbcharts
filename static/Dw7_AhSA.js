import{k as j,l as sa,n as la,o as oa,p as na,q as ca,r as ua,u as da,v as _,w as p,y as Z,z as aa,A as U,B as g,C as pa,E as ma,F as $a,G as ga,H as fa,I as Da,$ as A,S as G,t as D,e as b,s as z,g as k,J as La,f as E,h as x}from"./DexWA3gZ.js";import{c as ba,a as ha,b as Aa,d as Ga,e as Pa,f as Ca,s as Ta,h as ya,i as xa,j as Sa}from"./DI7-T2IF.js";import{c as Fa}from"./BTMiU75A.js";import{c as Ma}from"./B4RuT2r5.js";import{s as I,g as S}from"./EQPZLwmk.js";import{c as Ra}from"./CB5D7e0Y.js";import{c as va}from"./Ce4fqC1I.js";import{a as _a,c as ka}from"./C0vpWZ-v.js";const Ea=u=>{const{data:l=[],dataFormatter:i,chartParams:r}=u;if(!l.length)return[];let n=[];try{const t=i.gridList[0]||j,$=l.map((s,c)=>i.gridList[c]||t),o=l.map((s,c)=>ba(s,$[c])),a=i.separateGrid?o.map((s,c)=>sa({transposedDataGrid:s,dataFormatterGrid:$[c],chartType:"multiGrid"})):o.map((s,c)=>la({transposedDataGrid:s,dataFormatterGrid:$[c],chartType:"multiGrid",gridIndex:c})),e=new Map;let d=0;a.flat().forEach((s,c)=>{if(!e.has(s)){const m=oa(d,r);e.set(s,m),d++}}),n=o.map((s,c)=>{const m=a[c],h=na({transposedDataGrid:s,dataFormatterGrid:$[c],chartType:"multiGrid",gridIndex:c});let f=0;return s.map((P,C)=>P.map((L,T)=>{const M=ca("multiGrid",c,C,T),R=h[T],v=m[C],y={id:L.id?L.id:M,index:f,label:L.label?L.label:M,description:L.description??"",data:L.data,value:L.value,gridIndex:c,seriesIndex:C,seriesLabel:v,groupIndex:T,groupLabel:R,color:e.get(v),visible:!0};return y.visible=i.visibleFilter(y,u),f++,y}))})}catch(t){throw Error(t)}return n},Ia=({fullDataFormatter$:u,computedData$:l,layout$:i,fullChartParams$:r,event$:n})=>{const t=new ua,$=da({datumList$:l.pipe(_(a=>a.flat().flat()),p(1)),fullChartParams$:r,event$:n}).pipe(p(1)),o=Oa({computedData$:l,fullDataFormatter$:u,layout$:i}).pipe(p(1));return Z({fullDataFormatter:u,computedData:l,multiGridContainer:o}).pipe(aa(async a=>a),_(a=>{t.next(void 0);const e=a.fullDataFormatter.gridList[0]??j;return a.computedData.map((d,s)=>{const c=a.fullDataFormatter.gridList[s]??e,m={type:"grid",visibleFilter:a.fullDataFormatter.visibleFilter,grid:{...c},container:{...a.fullDataFormatter.container}},h=U(m).pipe(g(t),p(1)),f=U(d).pipe(g(t),p(1)),O=U(a.multiGridContainer[s]).pipe(g(t),p(1)),P=ha({fullDataFormatter$:h,layout$:i}).pipe(g(t),p(1)),C=Aa({gridAxesTransform$:P}).pipe(g(t),p(1)),L=Ga({computedData$:f,fullDataFormatter$:h,layout$:i}).pipe(g(t),p(1)),T=Pa({gridContainerPosition$:O,gridAxesTransform$:P,gridGraphicTransform$:L}),M=Ca({fullDataFormatter$:h,layout$:i}).pipe(g(t),p(1)),R=f.pipe(_(ia=>ia.flat())).pipe(g(t),p(1)),v=Ta({computedData$:f}).pipe(g(t),p(1)),y=pa({datumList$:R}).pipe(g(t),p(1)),ta=ma({datumList$:R}).pipe(g(t),p(1)),ea=ya({computedData$:f}).pipe(g(t),p(1)),W=xa({computedData$:f,fullDataFormatter$:h,layout$:i}).pipe(g(t),p(1)),ra=Sa({computedLayoutData$:W}).pipe(g(t),p(1));return{gridContainerPosition$:O,gridAxesTransform$:P,gridAxesReverseTransform$:C,gridGraphicTransform$:L,gridGraphicReverseScale$:T,gridAxesSize$:M,gridHighlight$:$,seriesLabels$:v,SeriesDataMap$:y,GroupDataMap$:ta,dataFormatter$:h,computedData$:f,computedLayoutData$:W,visibleComputedData$:ea,visibleComputedLayoutData$:ra}})}))},Oa=({computedData$:u,fullDataFormatter$:l,layout$:i})=>Z({computedData:u,fullDataFormatter:l,layout:i}).pipe(aa(async r=>r),_(r=>{const n=r.fullDataFormatter.gridList[0]??j,t=r.computedData.reduce((e,d,s)=>{const m=(r.fullDataFormatter.gridList[s]??n).separateSeries?d.length:r.fullDataFormatter.separateGrid?1:0;return e+m},0)||1,$=$a(r.layout,r.fullDataFormatter.container,t);let o=0;return r.computedData.map((e,d)=>{const s=r.fullDataFormatter.gridList[d]??n,c=e.map((m,h)=>{const f=$[o];return s.separateSeries&&(o+=1),f});return!s.separateSeries&&r.fullDataFormatter.separateGrid&&(o+=1),c})})),Ua=({subject:u,observer:l})=>{const i=ga(l.fullChartParams$).pipe(p(1)),r=Ia({fullDataFormatter$:l.fullDataFormatter$,computedData$:l.computedData$,layout$:l.layout$,fullChartParams$:l.fullChartParams$,event$:u.event$}).pipe(p(1));return{fullParams$:l.fullParams$,fullChartParams$:l.fullChartParams$,fullDataFormatter$:l.fullDataFormatter$,computedData$:l.computedData$,layout$:l.layout$,textSizePx$:i,multiGridEachDetail$:r}};class Za extends fa{constructor(l,i){super({defaultDataFormatter:Da,computedDataFn:Ea,contextObserverFn:Ua},l,i)}}const za={position:"right",justify:"end",padding:28,backgroundFill:"none",backgroundStroke:"none",gap:10,listRectWidth:14,listRectHeight:14,listRectRadius:0,gridList:[{listRectWidth:14,listRectHeight:14,listRectRadius:0}],textColorType:"primary"},Na={labelOffset:[0,0],labelColorType:"primary",axisLineVisible:!0,axisLineColorType:"primary",tickFormat:u=>u,tickLineVisible:!0,tickPadding:20,tickFullLine:!1,tickFullLineDasharray:"none",tickColorType:"secondary",tickTextRotate:0,tickTextColorType:"primary",gridIndexes:[0]},Va={labelOffset:[0,0],labelColorType:"primary",axisLineVisible:!1,axisLineColorType:"primary",ticks:4,tickFormat:",.0f",tickLineVisible:!0,tickPadding:20,tickFullLine:!0,tickFullLineDasharray:"none",tickColorType:"secondary",tickTextRotate:0,tickTextColorType:"primary",gridIndexes:[0]},wa={barWidth:0,barPadding:1,barGroupPadding:40,barRadius:!1,gridIndexes:[0]},at={barWidth:0,barGroupPadding:10,barRadius:!1,gridIndexes:[0]},tt={barWidth:0,barPadding:1,barGroupPadding:20,linearGradientOpacity:[1,0],gridIndexes:[0]},Ba={lineCurve:"curveLinear",lineWidth:2,gridIndexes:[1]},et={lineCurve:"curveLinear",linearGradientOpacity:[1,0],gridIndexes:[1]},Ha={radius:4,fillColorType:"white",strokeColorType:"series",strokeWidth:2,onlyShowHighlighted:!1,gridIndexes:[1]},rt={firstAxis:{labelOffset:[0,0],labelColorType:"primary",axisLineVisible:!1,axisLineColorType:"primary",ticks:4,tickFormat:",.0f",tickLineVisible:!0,tickPadding:20,tickFullLine:!0,tickFullLineDasharray:"none",tickColorType:"secondary",tickTextRotate:0,tickTextColorType:"primary"},secondAxis:{labelOffset:[0,0],labelColorType:"primary",axisLineVisible:!1,axisLineColorType:"primary",ticks:4,tickFormat:",.0f",tickLineVisible:!0,tickPadding:20,tickFullLine:!0,tickFullLineDasharray:"none",tickColorType:"secondary",tickTextRotate:0,tickTextColorType:"primary"},gridIndexes:[0,1]},X="MultiGridLegend",it=A(X,za)(({selection:u,rootSelection:l,observer:i,subject:r})=>{const n=new G,t=i.multiGridEachDetail$.pipe(D(n),b(e=>e.map((s,c)=>s.SeriesDataMap$.pipe(b(m=>Array.from(m.keys()))))),z(e=>k(e)),b(e=>e.flat())),$=k({fullParams:i.fullParams$,computedData:i.computedData$}).pipe(D(n),z(async e=>e),b(e=>e.computedData.map((d,s)=>{const c=La(e.fullParams.gridList[s]??{},{listRectWidth:e.fullParams.listRectWidth,listRectHeight:e.fullParams.listRectHeight,listRectRadius:e.fullParams.listRectRadius});return d.map(m=>c)}).flat())),o=k({fullParams:i.fullParams$,seriesList:$}).pipe(D(n),z(async e=>e),b(e=>({...e.fullParams,seriesList:e.seriesList}))),a=Fa(X,{rootSelection:l,seriesLabels$:t,fullParams$:o,layout$:i.layout$,fullChartParams$:i.fullChartParams$,textSizePx$:i.textSizePx$});return()=>{n.next(void 0),a()}}),F=u=>{const l=u.fullParams$.pipe(b(i=>i.gridIndexes),E(),I(1));return k({multiGridEachDetail:u.multiGridEachDetail$,gridIndexes:l}).pipe(b(i=>i.gridIndexes.map(r=>i.multiGridEachDetail[r]??i.multiGridEachDetail[0])))},N="MultiBars",q=S(N,"grid"),st=A(N,wa)(({selection:u,name:l,subject:i,observer:r})=>{const n=new G,t=[];return F(r).pipe(D(n)).subscribe(o=>{t.forEach(a=>a()),u.selectAll(`g.${q}`).data(o).join("g").attr("class",q).each((a,e,d)=>{const s=x(d[e]),c=a.dataFormatter$.pipe(D(n),b(m=>m.grid.separateSeries),E(),I(1));t[e]=Ma(N,{selection:s,computedData$:a.computedData$,visibleComputedData$:a.visibleComputedData$,computedLayoutData$:a.computedLayoutData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,seriesLabels$:a.seriesLabels$,SeriesDataMap$:a.SeriesDataMap$,GroupDataMap$:a.GroupDataMap$,fullParams$:r.fullParams$,fullChartParams$:r.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridGraphicTransform$:a.gridGraphicTransform$,gridGraphicReverseScale$:a.gridGraphicReverseScale$,gridAxesSize$:a.gridAxesSize$,gridHighlight$:a.gridHighlight$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:c,event$:i.event$})})}),()=>{n.next(void 0),t.forEach(o=>o())}}),V="MultiLines",J=S(V,"grid"),lt=A(V,Ba)(({selection:u,name:l,subject:i,observer:r})=>{const n=new G,t=[];return F(r).pipe(D(n)).subscribe(o=>{t.forEach(a=>a()),u.selectAll(`g.${J}`).data(o).join("g").attr("class",J).each((a,e,d)=>{const s=x(d[e]);t[e]=Ra(V,{selection:s,computedData$:a.computedData$,computedLayoutData$:a.computedLayoutData$,visibleComputedData$:a.visibleComputedData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,seriesLabels$:a.seriesLabels$,SeriesDataMap$:a.SeriesDataMap$,GroupDataMap$:a.GroupDataMap$,fullDataFormatter$:a.dataFormatter$,fullParams$:r.fullParams$,fullChartParams$:r.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridGraphicTransform$:a.gridGraphicTransform$,gridAxesSize$:a.gridAxesSize$,gridHighlight$:a.gridHighlight$,gridContainerPosition$:a.gridContainerPosition$,event$:i.event$})})}),()=>{n.next(void 0),t.forEach(o=>o())}}),w="MultiDots",K=S(w,"grid"),ot=A(w,Ha)(({selection:u,name:l,subject:i,observer:r})=>{const n=new G,t=[];return F(r).pipe(D(n)).subscribe(o=>{t.forEach(a=>a()),u.selectAll(`g.${K}`).data(o).join("g").attr("class",K).each((a,e,d)=>{const s=x(d[e]);t[e]=va(w,{selection:s,computedData$:a.computedData$,visibleComputedData$:a.visibleComputedData$,computedLayoutData$:a.computedLayoutData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,seriesLabels$:a.seriesLabels$,SeriesDataMap$:a.SeriesDataMap$,GroupDataMap$:a.GroupDataMap$,fullParams$:r.fullParams$,fullChartParams$:r.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridGraphicTransform$:a.gridGraphicTransform$,gridGraphicReverseScale$:a.gridGraphicReverseScale$,gridAxesSize$:a.gridAxesSize$,gridHighlight$:a.gridHighlight$,gridContainerPosition$:a.gridContainerPosition$,event$:i.event$})})}),()=>{n.next(void 0),t.forEach(o=>o())}}),B="MultiGroupAxis",Q=S(B,"grid"),nt=A(B,Na)(({selection:u,name:l,subject:i,observer:r})=>{const n=new G,t=[];return F(r).pipe(D(n)).subscribe(o=>{t.forEach(a=>a()),u.selectAll(`g.${Q}`).data(o).join("g").attr("class",Q).each((a,e,d)=>{const s=x(d[e]),c=a.dataFormatter$.pipe(D(n),b(m=>m.grid.separateSeries),E(),I(1));t[e]=_a(B,{selection:s,computedData$:a.computedData$,fullParams$:r.fullParams$,fullDataFormatter$:a.dataFormatter$,fullChartParams$:r.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridAxesReverseTransform$:a.gridAxesReverseTransform$,gridAxesSize$:a.gridAxesSize$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:c})})}),()=>{n.next(void 0),t.forEach(o=>o())}}),H="MultiValueAxis",Y=S(H,"grid"),ct=A(H,Va)(({selection:u,name:l,subject:i,observer:r})=>{const n=new G,t=[];return F(r).pipe(D(n)).subscribe(o=>{t.forEach(a=>a()),u.selectAll(`g.${Y}`).data(o).join("g").attr("class",Y).each((a,e,d)=>{const s=x(d[e]),c=a.dataFormatter$.pipe(D(n),b(m=>m.grid.separateSeries),E(),I(1));t[e]=ka(H,{selection:s,computedData$:a.computedData$,fullParams$:r.fullParams$,fullDataFormatter$:a.dataFormatter$,fullChartParams$:r.fullChartParams$,gridAxesTransform$:a.gridAxesTransform$,gridAxesReverseTransform$:a.gridAxesReverseTransform$,gridAxesSize$:a.gridAxesSize$,gridContainerPosition$:a.gridContainerPosition$,isSeriesSeprate$:c})})}),()=>{n.next(void 0),t.forEach(o=>o())}}),ut=[[[1205,850,930,1111,1500],[735,900,880,1035,1120]],[[55,60,50,70,75],[35,40,45,65,80]]];export{at as D,Za as M,tt as a,et as b,nt as c,ct as d,st as e,it as f,ut as g,lt as h,ot as i,rt as j,F as m};
