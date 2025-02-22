import{M as $,a as B,t as a,m as n,k as b,l as y,s as F,g as D,Z as C,j as I,_ as L,A as h,o as P}from"./QpO8sbuk.js";import{c as k}from"./PudTgByT.js";import{m as G}from"./C2hmLzlo.js";import{o as O}from"./DeQ-Icc0.js";const f="OverlappingValueAxes",x=D(f,"grid"),R={name:f,defaultParams:C,layerIndex:I,validator:(s,{validateColumns:l})=>{const g=l(s,{firstAxis:{toBeTypes:["object"]},secondAxis:{toBeTypes:["object"]},gridIndexes:{toBe:"[number, number]",test:i=>Array.isArray(i)&&i.length===2}});if(s.firstAxis){const i=l(s.firstAxis,{labelOffset:{toBe:"[number, number]",test:r=>Array.isArray(r)&&r.length===2&&typeof r[0]=="number"&&typeof r[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}});if(i.status==="error")return i}if(s.secondAxis){const i=l(s.secondAxis,{labelOffset:{toBe:"[number, number]",test:r=>Array.isArray(r)&&r.length===2&&typeof r[0]=="number"&&typeof r[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}});if(i.status==="error")return i}return g}},j=$(R)(({selection:s,name:l,subject:g,observer:i})=>{const r=new B,u=[],T=i.fullParams$.pipe(a(r),n(e=>e.gridIndexes[0])),A=i.fullParams$.pipe(a(r),n(e=>e.gridIndexes[1])),d=b({firstGridIndex:T,secondGridIndex:A,fullDataFormatter:i.fullDataFormatter$}).pipe(a(r),y(async e=>e),n(e=>{e.fullDataFormatter.gridList[e.secondGridIndex]||(e.fullDataFormatter.gridList[e.secondGridIndex]=Object.assign({},e.fullDataFormatter.gridList[e.firstGridIndex]));const t=e.fullDataFormatter.gridList[e.firstGridIndex].valueAxis.position;let o=t;return t==="left"?o="right":t==="bottom"?o="top":t==="top"?o="bottom":t==="right"&&(o="left"),{type:"grid",visibleFilter:e.fullDataFormatter.visibleFilter,...e.fullDataFormatter.gridList[e.secondGridIndex],valueAxis:{...e.fullDataFormatter.gridList[e.secondGridIndex].valueAxis,position:o},container:{...e.fullDataFormatter.container}}}));return O(i).pipe(a(r),n(e=>({...e,fullParams$:e.fullParams$.pipe(n(t=>(t.gridIndexes.length>2&&(t.gridIndexes.length=2),t)))})),y(e=>G(e)),n(e=>e.map((t,o)=>{if(o===0)return t;const p=L({fullDataFormatter$:d,layout$:i.layout$}),m=h({gridAxesTransform$:p}),c=P({computedData$:t.computedData$,fullDataFormatter$:d,layout$:i.layout$});return{...t,dataFormatter$:d,gridAxesTransform$:p,gridAxesReverseTransform$:m,gridContainerPosition$:c}}))).pipe(a(r)).subscribe(e=>{u.forEach(t=>t()),s.selectAll(`g.${x}`).data(e).join("g").attr("class",x).each((t,o,p)=>{if(o>1)return;const m=F(p[o]);u[o]=k(f,{selection:m,computedData$:t.computedData$,filteredMinMaxValue$:t.filteredMinMaxValue$,fullParams$:i.fullParams$.pipe(n(c=>o===0?c.firstAxis:c.secondAxis)),fullDataFormatter$:t.dataFormatter$,fullChartParams$:i.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridAxesReverseTransform$:t.gridAxesReverseTransform$,gridAxesSize$:t.gridAxesSize$,gridContainerPosition$:t.gridContainerPosition$,isSeriesSeprate$:t.isSeriesSeprate$})})}),()=>{r.next(void 0),u.forEach(e=>e())}}),N={name:"PRESET_MULTI_GRID_BASIC",description:"Basic MultiGrid",descriptionZh:"基本MultiGrid",chartParams:{colors:{light:{label:["#4BABFF","#94D6CB","#F9B052","#8454D4","#D58C75","#42C724","#FF8B8B","#904026","#C50669","#4B25B3"]}},padding:{top:40,right:40,bottom:100,left:80},highlightTarget:"series"},pluginParams:{MultiGridLegend:{placement:"bottom",padding:14,gridList:[{},{listRectHeight:2}]}}};export{j as O,N as P};
