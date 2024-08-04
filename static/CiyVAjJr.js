import{Z as V,S as C,t as P,m as g,j as m,O as A,k as I,s as T,l as R}from"./kGF9pzg7.js";import{f as X}from"./Bz_gD2gR.js";import{g as k,k as Z,b as j,n as q}from"./B7hZ1RX6.js";const f="Bars",x=j(f,"g"),U=j(f,"rect"),W=.3;function J({axisWidth:o,groupAmount:n,barAmountOfGroup:l,barPadding:r=0,barGroupPadding:s=0}){const d=(o/(n-1)-s)/l-r;return d>1?d:1}function K(o,n,l){const r=o/2,s=o*n.length+l.barPadding*n.length;return q().domain(n).range([-s/2+r,s/2-r])}function Q(o,n){return o<=1?0:n/(o-1)*W}function ee(o,n){return o<=1?n:n*(1-W)}function te({selection:o,data:n,zeroY:l,groupLabels:r,barScale:s,params:p,chartParams:d,barWidth:D,transformedBarRadius:E,delayGroup:N,transitionItem:B}){const b=D/2;return o.selectAll(`g.${x}`).data(n,(c,S)=>r[S]).join(c=>c.append("g").classed(x,!0).attr("cursor","pointer"),c=>c,c=>c.remove()).attr("transform",(c,S)=>`translate(${c[0]?c[0].axisX:0}, 0)`).each((c,S,G)=>{R(G[S]).selectAll("rect").data(c,_=>_.id).join(_=>_.append("rect").classed(U,!0).attr("height",y=>0),_=>_,_=>_.remove()).attr("fill",_=>_.color).attr("y",_=>_.axisY<l?_.axisY:l).attr("x",_=>s(_.seriesLabel)).attr("width",D).attr("transform",`translate(${-b}, 0)`).attr("rx",E[0]).attr("ry",E[1]).transition().duration(B).ease(Z(d.transitionEase)).delay((_,y)=>_.groupIndex*N).attr("height",_=>Math.abs(_.axisYFromZero))}).selectAll(`rect.${U}`)}function ae({defsSelection:o,clipPathData:n}){o.selectAll("clipPath").data(n).join(l=>l.append("clipPath"),l=>l,l=>l.remove()).attr("id",l=>l.id).each((l,r,s)=>{R(s[r]).selectAll("rect").data([l]).join(p=>p.append("rect"),p=>p,p=>p.remove()).attr("x",0).attr("y",0).attr("width",p=>p.width).attr("height",p=>p.height)})}function re({selection:o,ids:n,fullChartParams:l}){if(o.interrupt("highlight"),!n.length){o.transition("highlight").duration(200).style("opacity",1);return}o.each((r,s,p)=>{n.includes(r.id)?R(p[s]).style("opacity",1):R(p[s]).style("opacity",l.styles.unhighlightedOpacity)})}const Ze=V(f,X)(({selection:o,name:n,subject:l,observer:r})=>{const s=new C,p=k(f,"clipPath-box"),d=o.append("g").attr("clip-path",`url(#${p})`),D=d.append("defs"),E=d.append("g"),N=new C;r.gridAxesTransform$.pipe(P(s),g(e=>e.value),m()).subscribe(e=>{d.style("transform",e)}),r.gridGraphicTransform$.pipe(P(s),g(e=>e.value),m()).subscribe(e=>{E.transition().duration(50).style("transform",e)});const B=r.visibleComputedData$.pipe(g(e=>e[0]&&e[0][0]?e[0][0].axisY-e[0][0].axisYFromZero:0),m()),b=new A(e=>{I({computedData:r.computedData$,visibleComputedData:r.visibleComputedData$,params:r.fullParams$,gridAxesSize:r.gridAxesSize$}).pipe(T(async t=>t)).subscribe(t=>{const i=t.params.barWidth?t.params.barWidth:J({axisWidth:t.gridAxesSize.width,groupAmount:t.computedData[0]?t.computedData[0].length:0,barAmountOfGroup:t.visibleComputedData.length,barPadding:t.params.barPadding,barGroupPadding:t.params.barGroupPadding});e.next(i)})}).pipe(P(s),m()),H=I({gridGraphicTransform:r.gridGraphicTransform$,barWidth:b,params:r.fullParams$}).pipe(P(s),T(async e=>e),g(e=>{const t=e.barWidth/2,i=e.params.barRadius===!0?t:e.params.barRadius===!1?0:typeof e.params.barRadius=="number"?e.params.barRadius:0,a=i==0?0:i/e.gridGraphicTransform.scale[0],h=i==0?0:i/e.gridGraphicTransform.scale[1];return[a,h]})),$=r.visibleComputedData$.pipe(P(s),g(e=>{const t=new Set;return e.forEach(i=>{i.forEach(a=>{t.add(a.seriesLabel)})}),Array.from(t)})),c=r.visibleComputedData$.pipe(P(s),g(e=>{const t=new Set;return e.forEach(i=>{i.forEach(a=>{t.add(a.groupLabel)})}),Array.from(t)})),S=new A(e=>{I({seriesLabels:$,barWidth:b,params:r.fullParams$}).pipe(P(s),T(async t=>t)).subscribe(t=>{const i=K(t.barWidth,t.seriesLabels,t.params);e.next(i)})}),G=r.fullChartParams$.pipe(P(s),g(e=>e.transitionDuration),m()),_=new A(e=>{I({groupLabels:c,transitionDuration:G}).pipe(T(async t=>t)).subscribe(t=>{const i=Q(t.groupLabels.length,t.transitionDuration);e.next(i)})}).pipe(P(s),m()),y=new A(e=>{I({groupLabels:c,transitionDuration:G}).pipe(T(async t=>t)).subscribe(t=>{const i=ee(t.groupLabels.length,t.transitionDuration);e.next(i)})}).pipe(P(s),m()),z=r.visibleComputedData$.pipe(P(s),g(e=>{const t=e.length,i=e.reduce((h,O)=>Math.max(h,O.length),0),a=new Array(i).fill(null).map(()=>new Array(t).fill(null));for(let h=0;h<t;h++)for(let O=0;O<i;O++)a[O][h]=e[h][O];return a}));r.gridAxesSize$.pipe(P(s)).subscribe(e=>{const t=[{id:p,width:e.width,height:e.height}];ae({defsSelection:D,clipPathData:t})});const v=r.fullChartParams$.pipe(P(s),g(e=>e.highlightTarget),m());I({computedData:r.computedData$,barData$:z,zeroY:B,groupLabels:c,barScale:S,params:r.fullParams$,chartParams:r.fullChartParams$,highlightTarget:v,barWidth:b,transformedBarRadius:H,delayGroup:_,transitionItem:y,SeriesDataMap:r.SeriesDataMap$,GroupDataMap:r.GroupDataMap$}).pipe(P(s),T(async e=>e)).subscribe(e=>{const t=te({selection:E,data:e.barData$,zeroY:e.zeroY,groupLabels:e.groupLabels,barScale:e.barScale,params:e.params,chartParams:e.chartParams,barWidth:e.barWidth,transformedBarRadius:e.transformedBarRadius,delayGroup:e.delayGroup,transitionItem:e.transitionItem});t.on("mouseover",(i,a)=>{i.stopPropagation(),l.event$.next({type:"grid",eventName:"mouseover",pluginName:n,highlightTarget:e.highlightTarget,datum:a,series:e.SeriesDataMap.get(a.seriesLabel),seriesIndex:a.seriesIndex,seriesLabel:a.seriesLabel,groups:e.GroupDataMap.get(a.groupLabel),groupIndex:a.groupIndex,groupLabel:a.groupLabel,event:i,data:e.computedData})}).on("mousemove",(i,a)=>{i.stopPropagation(),l.event$.next({type:"grid",eventName:"mousemove",pluginName:n,highlightTarget:e.highlightTarget,datum:a,series:e.SeriesDataMap.get(a.seriesLabel),seriesIndex:a.seriesIndex,seriesLabel:a.seriesLabel,groups:e.GroupDataMap.get(a.groupLabel),groupIndex:a.groupIndex,groupLabel:a.groupLabel,event:i,data:e.computedData})}).on("mouseout",(i,a)=>{i.stopPropagation(),l.event$.next({type:"grid",eventName:"mouseout",pluginName:n,highlightTarget:e.highlightTarget,datum:a,series:e.SeriesDataMap.get(a.seriesLabel),seriesIndex:a.seriesIndex,seriesLabel:a.seriesLabel,groups:e.GroupDataMap.get(a.groupLabel),groupIndex:a.groupIndex,groupLabel:a.groupLabel,event:i,data:e.computedData})}).on("click",(i,a)=>{i.stopPropagation(),l.event$.next({type:"grid",eventName:"click",pluginName:n,highlightTarget:e.highlightTarget,datum:a,series:e.SeriesDataMap.get(a.seriesLabel),seriesIndex:a.seriesIndex,seriesLabel:a.seriesLabel,groups:e.GroupDataMap.get(a.groupLabel),groupIndex:a.groupIndex,groupLabel:a.groupLabel,event:i,data:e.computedData})}),N.next(t)});const Y=r.gridHighlight$.subscribe();return I({barSelection:N,highlight:r.gridHighlight$,fullChartParams:r.fullChartParams$}).pipe(P(s),T(async e=>e)).subscribe(e=>{re({selection:e.barSelection,ids:e.highlight,fullChartParams:e.fullChartParams})}),()=>{s.next(void 0),Y.unsubscribe()}}),ie={id:"CP_BOTTOM_LONG_PADDING",description:"間距下面加長留空",data:{padding:{top:60,right:60,bottom:180,left:60}}},se={id:"CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT",description:"間距下面留空及highlight群組",data:{padding:{top:60,right:60,bottom:120,left:60},highlightTarget:"group"}},oe={id:"CP_BOTTOM_PADDING",description:"間距下面留空",data:{padding:{top:60,right:60,bottom:120,left:60}}},ne={id:"CP_LEFT_PADDING",description:"間距右邊留空",data:{padding:{top:60,right:60,bottom:60,left:180}}},le={id:"CP_RIGHT_PADDING",description:"間距右邊留空",data:{padding:{top:60,right:180,bottom:60,left:60}}},pe=Object.freeze(Object.defineProperty({__proto__:null,CP_BOTTOM_LONG_PADDING:ie,CP_BOTTOM_PADDING:oe,CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT:se,CP_LEFT_PADDING:ne,CP_RIGHT_PADDING:le},Symbol.toStringTag,{value:"Module"})),_e={},ce=Object.freeze(Object.defineProperty({__proto__:null,temp:_e},Symbol.toStringTag,{value:"Module"})),Pe={id:"PP_BUBBLES_SCALING_BY_RADIUS",chartType:"series",pluginName:"Bubbles",description:"以半徑尺寸為比例的泡泡圖",data:{bubbleScaleType:"radius"}},de={id:"PP_PIE_DONUT",chartType:"series",pluginName:"Pie",description:"甜甜圈圖",data:{innerRadius:.5}},ge={id:"PP_PIE_HALF_DONUT",chartType:"series",pluginName:"Pie",description:"半圓甜甜圈圖",data:{innerRadius:.5,startAngle:-Math.PI/2,endAngle:Math.PI/2}},ue={id:"PP_PIE_LABELS_HALF_ANGLE",chartType:"series",pluginName:"PieLabels",description:"半圓甜甜圈資料標籤",data:{startAngle:-Math.PI/2,endAngle:Math.PI/2}},he={id:"PP_PIE_LABELS_INNER",chartType:"series",pluginName:"PieLabels",description:"圖內資料標籤",data:{labelCentroid:1.3,labelColorType:"primary"}},me={id:"PP_SERIES_LEGEND_BOTTOM",chartType:"series",pluginName:"SeriesLegend",description:"圓型圖例列點",data:{listRectRadius:7}},Ie=Object.freeze(Object.defineProperty({__proto__:null,PP_BUBBLES_SCALING_BY_RADIUS:Pe,PP_PIE_DONUT:de,PP_PIE_HALF_DONUT:ge,PP_PIE_LABELS_HALF_ANGLE:ue,PP_PIE_LABELS_INNER:he,PP_SERIES_LEGEND_ROUND:me},Symbol.toStringTag,{value:"Module"})),Te={id:"DF_BOTTOM_VALUE_AXIS",chartType:"grid",description:"底部橫向資料圖軸",data:{valueAxis:{position:"bottom"},groupAxis:{position:"left"}}},De=Object.freeze(Object.defineProperty({__proto__:null,DF_BOTTOM_VALUE_AXIS:Te},Symbol.toStringTag,{value:"Module"})),Se={id:"PP_BARS_ROUND",chartType:"grid",pluginName:"Bars",description:"圓角長條圖",data:{barWidth:0,barPadding:1,barGroupPadding:10,barRadius:!0}},Oe={id:"PP_BARS_THIN",chartType:"grid",pluginName:"Bars",description:"圓角長條圖",data:{barWidth:20,barPadding:1,barGroupPadding:10}},Ee={id:"PP_DOTS_ONLY_SHOW_HIGHLIGHTED",chartType:"grid",pluginName:"Dots",description:"顯示highlight圓點",data:{radius:3,fillColorType:"series",onlyShowHighlighted:!1}},be={id:"PP_DOTS_SOLID",chartType:"grid",pluginName:"Dots",description:"實心圓點",data:{radius:3,fillColorType:"series",onlyShowHighlighted:!1}},Le={id:"PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST",chartType:"grid",pluginName:"GridLegend",description:"底部圖例及線條列點",data:{position:"bottom",justify:"center",padding:14,listRectHeight:2}},Ne={id:"PP_GRID_LEGEND_BOTTOM",chartType:"grid",pluginName:"GridLegend",description:"底部圖例",data:{position:"bottom",justify:"center",padding:14}},Ge={id:"PP_GROUP_AXIS_ROTATE_LABEL",chartType:"grid",pluginName:"GroupAxis",description:"群組圖軸標籤文字傾斜",data:{tickTextRotate:40}},Ae={id:"PP_LINES_CURVE",chartType:"grid",pluginName:"Lines",description:"圓弧折線圖",data:{lineCurve:"curveMonotoneX",lineWidth:3}},Re=Object.freeze(Object.defineProperty({__proto__:null,PP_BARS_ROUND:Se,PP_BARS_THIN:Oe,PP_DOTS_ONLY_SHOW_HIGHLIGHTED:Ee,PP_DOTS_SOLID:be,PP_GRID_LEGEND_BOTTOM:Ne,PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST:Le,PP_GROUP_AXIS_ROTATE_LABEL:Ge,PP_LINES_CURVE:Ae},Symbol.toStringTag,{value:"Module"})),fe={},Be=Object.freeze(Object.defineProperty({__proto__:null,temp:fe},Symbol.toStringTag,{value:"Module"})),ye={},Me=Object.freeze(Object.defineProperty({__proto__:null,temp:ye},Symbol.toStringTag,{value:"Module"})),He={},$e=Object.freeze(Object.defineProperty({__proto__:null,temp:He},Symbol.toStringTag,{value:"Module"})),Ce={},xe=Object.freeze(Object.defineProperty({__proto__:null,temp:Ce},Symbol.toStringTag,{value:"Module"})),Ue={},Fe=Object.freeze(Object.defineProperty({__proto__:null,temp:Ue},Symbol.toStringTag,{value:"Module"})),je={},We=Object.freeze(Object.defineProperty({__proto__:null,temp:je},Symbol.toStringTag,{value:"Module"})),we={},ze=Object.freeze(Object.defineProperty({__proto__:null,temp:we},Symbol.toStringTag,{value:"Module"})),ve={},Ye=Object.freeze(Object.defineProperty({__proto__:null,temp:ve},Symbol.toStringTag,{value:"Module"})),F={series:ce,grid:De,multiGrid:Be,multiValue:$e,relationship:Fe,tree:ze},M={series:Ie,grid:Re,multiGrid:Me,multiValue:xe,relationship:We,tree:Ye},w=(o,n)=>{const l=n.chartParamsId?pe[n.chartParamsId].data:void 0,r=F[o][n.dataFormatterId]?F[o][n.dataFormatterId].data:void 0,s=n.allPluginParamsIds?n.allPluginParamsIds.reduce((p,d)=>{if(M[o][d]){const D=M[o][d].pluginName;p[D]=M[o][d].data}return p},{}):void 0;return{chartParams:l,dataFormatter:r,allPluginParams:s}},L=o=>w("series",o),u=o=>w("grid",o),qe=L({allPluginParamsIds:[],description:"基本Series參數"}),Je=L({allPluginParamsIds:["PP_BUBBLES_SCALING_BY_RADIUS","PP_SERIES_LEGEND_ROUND"],description:"以半徑尺寸為比例的泡泡圖"}),Ke=L({allPluginParamsIds:["PP_PIE_LABELS_INNER","PP_SERIES_LEGEND_ROUND"],description:"圓餅圖及內部資料標籤"}),Qe=L({allPluginParamsIds:["PP_PIE_DONUT","PP_SERIES_LEGEND_ROUND"],description:"甜甜圈圖"}),et=L({allPluginParamsIds:["PP_PIE_HALF_DONUT","PP_PIE_LABELS_HALF_ANGLE","PP_SERIES_LEGEND_ROUND"],description:"半圓甜甜圈圖"}),tt=u({chartParamsId:"CP_BOTTOM_LONG_PADDING",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM"],description:"基本Grid參數"}),at=u({chartParamsId:"CP_BOTTOM_PADDING",allPluginParamsIds:["PP_GROUP_AXIS_ROTATE_LABEL","PP_GRID_LEGEND_BOTTOM"],description:"傾斜標籤"}),rt=u({chartParamsId:"CP_BOTTOM_PADDING",dataFormatterId:"DF_BOTTOM_VALUE_AXIS",allPluginParamsIds:["PP_GRID_LEGEND_BOTTOM"],description:"橫向圓角長條圖"}),it=u({chartParamsId:"CP_BOTTOM_PADDING",allPluginParamsIds:["PP_BARS_ROUND","PP_GRID_LEGEND_BOTTOM"],description:"圓角長條圖"}),st=u({chartParamsId:"CP_BOTTOM_PADDING",dataFormatterId:"DF_BOTTOM_VALUE_AXIS",allPluginParamsIds:["PP_BARS_ROUND","PP_GRID_LEGEND_BOTTOM"],description:"橫向圓角長條圖"}),ot=u({chartParamsId:"CP_BOTTOM_PADDING",allPluginParamsIds:["PP_BARS_THIN","PP_GRID_LEGEND_BOTTOM"],description:"細長條圖"}),nt=u({chartParamsId:"CP_BOTTOM_PADDING",dataFormatterId:"DF_BOTTOM_VALUE_AXIS",allPluginParamsIds:["PP_BARS_ROUND","PP_GRID_LEGEND_BOTTOM"],description:"橫向圓角長條圖"}),lt=u({chartParamsId:"CP_BOTTOM_PADDING",allPluginParamsIds:["PP_LINES_CURVE","PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"弧線折線圖"}),pt=u({chartParamsId:"CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT",allPluginParamsIds:["PP_DOTS_ONLY_SHOW_HIGHLIGHTED","PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST"],description:"折線圖及Highlight Group圓點"});export{Ze as B,qe as P,Je as a,Ke as b,Qe as c,et as d,tt as e,at as f,rt as g,it as h,st as i,ot as j,nt as k,lt as l,pt as m};