import"./CjdleEie.js";import{G as i}from"./CX0rQqAK.js";import{L as s}from"./RigWL6Jr.js";import{L as n,g as m}from"./C9r9HfvB.js";import{G as p,V as c}from"./BbrMZ-fa.js";import{S as l}from"./8bpyd_pO.js";import{T as d}from"./CrDNbRWq.js";import{n as h,q as g,o as u,c as f}from"./CL5as7Q2.js";import"./W937OcHy.js";import"./CzUzxl8i.js";import"./xOzsrLZS.js";import"./DIeAF1OD.js";import"./5rDUwiLZ.js";import"./BrLgnobm.js";import"./DeVmvt24.js";import"./Degl7Xeb.js";const x={id:"chart",style:{width:"100%",height:"100vh"}},D=h({__name:"index",setup(_){return g(()=>{const r=document.querySelector("#chart"),t=new i(r,{});t.dataFormatter$.next({grid:{groupAxis:{scalePadding:0}}}),t.chartParams$.subscribe(a=>{console.log(a)});const e=new s,o=new n;t.chartParams$.next({highlightTarget:"series"}),t.plugins$.next([e,o,new p,new c,new l,new d]),t.data$.next(m)}),(r,t)=>(u(),f("div",x))}});export{D as default};