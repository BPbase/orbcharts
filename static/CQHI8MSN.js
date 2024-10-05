import{e as E,u as F,f as C,o as I,c as T}from"./D8ccWnmM.js";import{u as V}from"./CWBAyBLC.js";import{S as w}from"./BDfp3Xtn.js";import{G as L}from"./DG488vna.js";import{M as P}from"./CyfEykAs.js";import{g as M,c as R,A as $,D as S,a as O}from"./DimhisTc.js";import{c as b}from"./d4Vqhbx6.js";import{T as _}from"./C1JpWaGB.js";import{D as j,p as B,a as G}from"./BABk-quj.js";const U=u=>{const{data:e,dataFormatter:a,chartParams:m}=u;if(!e.length)return[];const n={width:1e3,height:1e3};let r=[];try{const i=e.map((f,y)=>f.map((o,x)=>typeof o=="number"?{id:"",label:"",description:"",data:{},categoryLabel:"",value:o}:{id:o.id??"",label:o.label??"",description:o.description??"",data:o.data??{},categoryLabel:o.categoryLabel??"",value:o.value})),[d,p]=M(i.map(f=>f[0])),[l,h]=M(i.map(f=>f[1])),t=a.xAxis.position==="top"||a.xAxis.position==="bottom"?n.width:n.height,s=a.yAxis.position==="left"||a.yAxis.position==="right"?n.height:n.width,c=b({maxValue:p,minValue:d,axisWidth:t,scaleDomain:[d,p],scaleRange:[0,1]}),v=b({maxValue:h,minValue:l,axisWidth:s,scaleDomain:[l,h],scaleRange:[0,1]}),Q=[a.xAxis.scaleDomain[0]==="auto"?d:a.xAxis.scaleDomain[0],a.xAxis.scaleDomain[1]==="auto"?p:a.xAxis.scaleDomain[1]],X=[a.yAxis.scaleDomain[0]==="auto"?l:a.yAxis.scaleDomain[0],a.yAxis.scaleDomain[1]==="auto"?h:a.yAxis.scaleDomain[1]];let N=0;r=i.map((f,y)=>f.map((o,x)=>{const A=N;N++;const g=R(a.type,y,x),D={id:o.id?o.id:g,index:A,label:o.label?o.label:g,description:o.description??"",data:o.data,value:o.value,categoryIndex:0,categoryLabel:"",axis:x==0?c(o.value):v(o.value),visible:!0,color:""};return D.visible=a.visibleFilter(D,u),D}))}catch(i){throw Error(i)}return r},W=({subject:u,observer:e})=>({fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,fullDataFormatter$:e.fullDataFormatter$,computedData$:e.computedData$,layout$:e.layout$});class k extends ${constructor(e,a){super({defaultDataFormatter:S,computedDataFn:U,contextObserverFn:W},e,a)}}const q=u=>{const{data:e,dataFormatter:a,chartParams:m}=u;let n=[],r=[];try{let i=[],d=[];if(e.nodes)i=e.nodes,d=e.edges;else if(e[0])i=e[0],d=e[1];else return{nodes:[],edges:[]};n=i.map((t,s)=>({id:t.id,index:s,label:t.label??"",description:t.description??"",data:t.data??{},value:t.value??0,categoryIndex:0,categoryLabel:"",color:"",startNodes:[],startNodeIds:[],endNodes:[],endNodeIds:[],visible:!0}));const p=new Map(n.map(t=>[t.id,t]));r=d.map((t,s)=>({id:t.id,index:s,label:t.label??"",description:t.description??"",data:t.data??{},value:t.value??0,startNode:p.get(t.start),startNodeId:t.start,endNode:p.get(t.end),endNodeId:t.end,visible:!0}));const l=function(){const t=new Map;return r.forEach(s=>{const c=t.get(s.endNodeId)??[];c.push(s.startNode),t.set(s.endNodeId,c)}),t}(),h=function(){const t=new Map;return r.forEach(s=>{const c=t.get(s.startNodeId)??[];c.push(s.endNode),t.set(s.startNodeId,c)}),t}();Array.from(p).forEach(([t,s])=>{s.startNodes=l.get(t),s.startNodeIds=s.startNodes.map(c=>c.id),s.endNodes=h.get(t),s.endNodeIds=s.endNodes.map(c=>c.id),s.visible=a.visibleFilter(s,u)}),r=r.map(t=>(t.visible=!!(t.startNode.visible&&t.endNode.visible),t))}catch(i){throw Error(i)}return{nodes:n,edges:r}},H=({subject:u,observer:e})=>({fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,fullDataFormatter$:e.fullDataFormatter$,computedData$:e.computedData$,layout$:e.layout$});class z extends ${constructor(e,a){super({defaultDataFormatter:O,computedDataFn:q,contextObserverFn:H},e,a)}}async function J({chartType:u,pluginNames:e,presetName:a}){const m=j.find(l=>l.chartType===u),n=m==null?void 0:m.list.find(l=>l.mainPluginNames.join(",")===e.join(",")),r=(n==null?void 0:n.list.find(l=>l.presetName===a))??null;if(!r)return null;const i=r.allPluginNames.map(l=>{const h=B[l];return new h}),{default:d}=await r.getData();return{preset:G[a],plugins:i,data:d}}const K={id:"chart",style:{width:"100%",height:"100%"}},nt=E({__name:"[presetName]",setup(u){const a=F().params;return V({title:a.pluginName}),C(async()=>{const m=await J({chartType:a.chartType,pluginNames:a.pluginName.split(","),presetName:a.presetName});if(!m){console.error("demoData not found");return}const r={series:w,grid:L,multiGrid:P,multiValue:k,relationship:z,tree:_}[a.chartType],i=document.querySelector("#chart"),d=new r(i,{preset:m.preset});d.plugins$.next(m.plugins),d.data$.next(m.data)}),(m,n)=>(I(),T("div",K))}});export{nt as default};
