import"./CllDRATP.js";import{G as a}from"./CtP5u3nm.js";import{B as i}from"./CVC2Adwf.js";import{G as n}from"./CGJAfsX8.js";import{a as m,V as s,G as p}from"./CQ4j4qgD.js";import{G as c}from"./iNQfby5f.js";import"./jxSGpqQa.js";import{P as d}from"./CTZlNuVH.js";import{u as l}from"./CLjwWANC.js";import{s as u}from"./Dje7igl5.js";import{e as f,f as _,g as w,o as G,c as h}from"./qBC4PKEg.js";import"./BU4XABUD.js";import"./CWRPK8C-.js";import"./3f-LgFZK.js";import"./NUoNOPYK.js";import"./Bjf8oAlN.js";import"./fpoLK5Sh.js";import"./DdT0iQQs.js";import"./CYJ21Kf6.js";import"./B8ff3D63.js";const x=[[55,80,50,11,150],[35,40,15,65,120],[75,90,600,50,120],[50,60,445,80,110]],A={id:"chart",style:{width:"100%",height:"100%"}},Z=f({__name:"index",setup(g){l({title:"Demo 0"});let r;return _(()=>{const o=document.querySelector("#chart"),t=new a(o,{preset:d});let e=0;r=u(()=>{e%2==1?t.dataFormatter$.next({container:{rowAmount:2,columnAmount:2},grid:{separateSeries:!0}}):e%2==0&&t.dataFormatter$.next({container:{rowAmount:1,columnAmount:1},grid:{separateSeries:!1}}),e++},2e3),t.plugins$.next([new m,new s,new i,new c,new p,new n]),t.data$.next(x)}),w(()=>{clearInterval(r)}),(o,t)=>(G(),h("div",A))}});export{Z as default};