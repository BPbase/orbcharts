import"./Dqvogce1.js";import{G as a}from"./E9YFUZhL.js";import{B as i}from"./BrAb1Wmn.js";import{G as n}from"./CrP7L5Pd.js";import{a as m,V as s,G as p}from"./BZGskxC0.js";import{G as c}from"./DAMxcXxz.js";import"./CBh_fxzA.js";import{P as d}from"./Deh7JXdr.js";import{u as l}from"./DbSYOUuV.js";import{s as u}from"./Db-dljs6.js";import{e as f,f as _,g as w,o as G,c as h}from"./CQodV3LZ.js";import"./Bx734kX0.js";import"./CDXy8Wbk.js";import"./72oJS6XY.js";import"./DMno0sFV.js";import"./C21pD4V8.js";import"./Cax8W97L.js";import"./CMAIQOh1.js";import"./CWRBibWU.js";import"./ClYA6iuU.js";const x=[[55,80,50,11,150],[35,40,15,65,120],[75,90,600,50,120],[50,60,445,80,110]],A={id:"chart",style:{width:"100%",height:"100%"}},Z=f({__name:"index",setup(g){l({title:"Demo 0"});let r;return _(()=>{const o=document.querySelector("#chart"),t=new a(o,{preset:d});let e=0;r=u(()=>{e%2==1?t.dataFormatter$.next({container:{rowAmount:2,columnAmount:2},grid:{separateSeries:!0}}):e%2==0&&t.dataFormatter$.next({container:{rowAmount:1,columnAmount:1},grid:{separateSeries:!1}}),e++},2e3),t.plugins$.next([new m,new s,new i,new c,new p,new n]),t.data$.next(x)}),w(()=>{clearInterval(r)}),(o,t)=>(G(),h("div",A))}});export{Z as default};
