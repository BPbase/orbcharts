import{s as c}from"./CCC3rdQu.js";import{S as u}from"./Bt5SAD7j.js";import"./DTMfjTug.js";import{T as d}from"./DmzJorQV.js";import{B as x}from"./C6VjE4J3.js";import{P as h}from"./B0MLoTzU.js";import{P as b}from"./BVX23IRm.js";import{P as S,s as $}from"./Ck1tI4vX.js";import{m as g,n as _,p as v,o as w,c as L}from"./CvDdBNY3.js";import"./D2FdcmjD.js";import"./Bav_1stD.js";const P={id:"chart",style:{width:"100%",height:"100vh"}},D=g({__name:"index",setup(F){let i;return _(()=>{const n=document.querySelector("#chart"),e=new u(n,{}),a=new h,o=new S,m=new b,l=new x,r=new d;e.chartParams$.next({padding:{top:200,right:200,bottom:200,left:200},highlightTarget:"series"}),e.plugins$.next([l,r]);let t=0,s=0;const p=4,f=1;i=c(()=>{t==0?(s==1&&(e.plugins$.next([a,o,r]),a.params$.next({innerRadius:0})),e.dataFormatter$.next({sumSeries:!1,separateSeries:!0,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]})):t==1?e.dataFormatter$.next({sumSeries:!0,separateSeries:!0,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]}):t==2?e.dataFormatter$.next({sumSeries:!0,separateSeries:!1,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]}):t==3?e.dataFormatter$.next({sumSeries:!1,separateSeries:!1,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]}):t==4&&(e.dataFormatter$.next({sumSeries:!1,separateSeries:!1,seriesLabels:["關鍵字","組織團體","地點","人物","企業品牌"]}),s==0?(e.plugins$.next([a,o,m,r]),a.params$.next({innerRadius:.5})):s==1&&e.plugins$.next([l,r])),t++,t>p&&(t=0,s++),s>f&&(s=0)},2e3),e.data$.next($)}),v(()=>{clearInterval(i)}),(n,e)=>(w(),L("div",P))}});export{D as default};
