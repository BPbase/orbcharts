import{S as d}from"./DEG3bALa.js";import"./D0O9ZvbE.js";import{B as x}from"./DcYvjw-H.js";import{P as S,S as $}from"./DSaSc3uZ.js";import{P as b}from"./B_Zp5ORe.js";import{P as L,R as g,a as h}from"./C0-80VGl.js";import _ from"./0eJhi8kD.js";import{u as w}from"./DCTqTP3K.js";import{s as P}from"./DyWZykAc.js";import{e as R,f as v,g as F,o as B,c as E}from"./DFejP5Qw.js";import"./DdT0iQQs.js";import"./CLAZhRXT.js";import"./2MvoWBLz.js";import"./GqbKohf6.js";const I={id:"chart",style:{width:"100%",height:"100%"}},N=R({__name:"index",setup(M){w({title:"Demo 1"});let n;return v(()=>{const o=document.querySelector("#chart"),e=new d(o,{}),r=new S,i=new L,p=new g,m=new h,f=new b,l=new x,a=new $;i.params$.next({outerRadius:1.2}),m.params$.next({outerRadius:1.2}),e.chartParams$.next({padding:{top:200,right:200,bottom:200,left:200}}),e.plugins$.next([l,a]),e.dataFormatter$.next({sumSeries:!1,separateSeries:!1,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]});let s=0,t=0;const u=4,c=1;n=P(()=>{s==0?(t==1&&(e.plugins$.next([r,i,a]),r.params$.next({innerRadius:0})),e.dataFormatter$.next({sumSeries:!1,separateSeries:!0,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]})):s==1?t==1?e.plugins$.next([p,m,a]):e.dataFormatter$.next({sumSeries:!0,separateSeries:!0,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]}):s==2?e.dataFormatter$.next({sumSeries:!0,separateSeries:!1,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]}):s==3?e.dataFormatter$.next({sumSeries:!1,separateSeries:!1,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]}):s==4&&(e.dataFormatter$.next({sumSeries:!1,separateSeries:!1,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]}),t==0?(r.params$.next({innerRadius:.5}),e.plugins$.next([r,i,f,a])):t==1&&e.plugins$.next([l,a])),s++,s>u&&(s=0,t++),t>c&&(t=0)},2e3),e.data$.next(_)}),F(()=>{clearInterval(n)}),(o,e)=>(B(),E("div",I))}});export{N as default};
