import{S as p}from"./DmoGU6Vx.js";import"./Dh2HIxf9.js";import{B as c}from"./tNszz0-Z.js";import{P as l,S as n}from"./CUoRVxLn.js";import{P as u,R as d,a as x}from"./D6ZnOKrs.js";import{S as r}from"./Bdaohbb4.js";import f from"./D8PqYJWw.js";import{e as w,f as h,o as $,c as S}from"./vhe1d5S_.js";import"./DdT0iQQs.js";import"./2zdWaanV.js";import"./E19rGNXz.js";import"./CkpYqoar.js";import"./vO0dTazL.js";import"./BdQNpCo1.js";const _={id:"chart",style:{width:"100%",height:"100%"}},M=w({__name:"index",setup(b){return h(()=>{const o=document.querySelector("#chart"),e=new p(o,{}),i=new l;new u,new c;const t=new d,s=new x,a=new n;t.params$.next({arcScaleType:"area"}),e.dataFormatter$.next({}),a.params$.next({position:"bottom"}),setTimeout(()=>{e.dataFormatter$.next({sumSeries:!0,separateSeries:!1}),e.plugins$.next([t,s,new r]),setTimeout(()=>{e.plugins$.next([t,s,new n,new r])},2e3)},2e3),e.chartParams$.subscribe(m=>{console.log(m)}),e.chartParams$.next({}),e.plugins$.next([t,s,a,new r]),i.params$.next({innerRadius:.5}),e.data$.next(f)}),(o,e)=>($(),S("div",_))}});export{M as default};