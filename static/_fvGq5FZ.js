import{a$ as F,Y,S as j,t as i,b0 as O,o as P,p as x,m}from"./PGufJ0Z3.js";import{g as y,u as X,v as N,h as b}from"./C1EDXMJI.js";import{f as w}from"./BPJ4d9ab.js";import{a as R}from"./B_z0SETL.js";const T="Tooltip",A=y(T,"g"),M=y(T,"box");function H(r,l){const p=l.textSizePx*1.5,s=(r==null?[]:Array.isArray(r)?r:typeof r=="string"?r.split(`
`):[r]).filter(n=>n!="").map((n,o)=>`<tspan x="0" y="${o*p}">${n}</tspan>`).join("");return s?`<text font-size="${l.textSize}" fill="${l.textColor}" x="0" y="0" style="dominant-baseline:text-before-edge">
    ${s}
  </text>`:""}function D({rootSelection:r,pluginName:l,rootWidth:p,rootHeight:v,svgString:s,tooltipStyle:n,event:o}){r.interrupt("fadeout");const u=5,f=s?[s]:[],g=s?[n]:[],a=r.selectAll(`g.${A}`).data(f).join(e=>e.append("g").classed(A,!0).attr("pointer-events","none"),e=>e,e=>e.style("opacity",0).remove()).attr("transform",()=>`translate(${o.offsetX}, ${o.offsetY})`).selectAll(`g.${M}`).data(g).join(e=>e.append("g").classed(y(l,"box"),!0)),S=a.selectAll("rect").data(g).join(e=>e.append("rect").attr("rx",u).attr("ry",u)).attr("fill",e=>e.backgroundColor).attr("stroke",e=>e.strokeColor).attr("opacity",e=>e.backgroundOpacity),c=a.selectAll("g").data(f).join(e=>e.append("g").classed(y(l,"content"),!0).attr("transform",()=>`translate(${n.padding}, ${n.padding})`));f.length&&X(c,f[0]);const d=c!=null&&c.node()?N(c):{width:0,height:0};S.attr("width",d.width+n.padding*2).attr("height",d.height+n.padding*2);const t=a!=null&&a.node()?N(a):{width:0,height:0},$=p-t.width,h=v-t.height,z=o.offsetX+n.offset[0]>$?$-o.offsetX:n.offset[0],k=o.offsetY+n.offset[1]>h?h-o.offsetY:n.offset[1];a.attr("transform",e=>`translate(${z}, ${k})`),a.attr("transform",e=>`translate(${z}, ${k})`)}const I=F(T,Y)(({selection:r,rootSelection:l,name:p,chartType:v,observer:s,subject:n})=>{const o=new j,u=n.event$.pipe(i(o),w(t=>t.eventName==="mouseover"||t.eventName==="mousemove")),f=n.event$.pipe(i(o),w(t=>t.eventName==="mouseout")),g=O(s.fullChartParams$),C=P({fullChartParams:s.fullChartParams$,fullParams:s.fullParams$,textSizePx:g}).pipe(i(o),x(async t=>t),m(t=>({backgroundColor:b(t.fullParams.backgroundColorType,t.fullChartParams),backgroundOpacity:t.fullParams.backgroundOpacity,strokeColor:b(t.fullParams.strokeColorType,t.fullChartParams),offset:t.fullParams.offset,padding:t.fullParams.padding,textSize:t.fullChartParams.styles.textSize,textSizePx:t.textSizePx,textColor:b(t.fullParams.textColorType,t.fullChartParams)}))),a=P({fullParams:s.fullParams$,tooltipStyle:C}).pipe(i(o),x(async t=>t),m(t=>t.fullParams.svgRenderFn?t.fullParams.svgRenderFn:$=>{const h=t.fullParams.textRenderFn($);return H(h,t.tooltipStyle)})),S=P({event:u,contentRenderFn:a}).pipe(i(o),x(async t=>t),m(t=>t.contentRenderFn(t.event))),c=f.pipe(i(o),m(t=>"")),d=R(u,f).pipe(i(o),m(t=>t.event));return P({svgString:R(S,c),event:d,layout:s.layout$,tooltipStyle:C}).pipe(i(o),x(async t=>t)).subscribe(t=>{D({rootSelection:l,pluginName:p,rootWidth:t.layout.rootWidth,rootHeight:t.layout.rootHeight,svgString:t.svgString,tooltipStyle:t.tooltipStyle,event:t.event})}),function(){o.next(void 0)}});export{I as T};
