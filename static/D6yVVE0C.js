import{v as k,a1 as F,S as G,t as u,m,d as $,e as z,s as w,a2 as I}from"./Bt7wG3zu.js";import{z as P,g as C}from"./vANVmeqg.js";import{f as N}from"./DiaHYm7N.js";const x="ScalingArea",R=C(x,"rect"),W=k(x,F)(({selection:_,rootSelection:r,name:L,observer:a,subject:g})=>{const s=new G,c=r.insert("rect","g").classed(R,!0).attr("opacity",0);let o={k:1,x:0,y:0};a.layout$.pipe(u(s)).subscribe(t=>{c.attr("width",t.width).attr("height",t.height).attr("x",t.left).attr("y",t.top)});const A=a.computedData$.pipe(m(t=>t[0]?t[0].length-1:0),$());return z({initGroupAxis:a.fullDataFormatter$.pipe(m(t=>t.grid.groupAxis),N()),fullDataFormatter:a.fullDataFormatter$,groupMaxIndex:A,layout:a.layout$,axisSize:a.gridAxesSize$}).pipe(u(s),w(async t=>t)).subscribe(t=>{const e=t.groupMaxIndex,f=t.initGroupAxis.scaleDomain[0]==="auto"?0-t.initGroupAxis.scalePadding:t.initGroupAxis.scaleDomain[0]-t.initGroupAxis.scalePadding,D=t.initGroupAxis.scaleDomain[1]==="auto"?e+t.initGroupAxis.scalePadding:t.initGroupAxis.scaleDomain[1]+t.initGroupAxis.scalePadding,l=I({maxValue:t.groupMaxIndex,minValue:0,axisWidth:t.axisSize.width,scaleDomain:[f,D],scaleRange:[0,1]}).copy(),d=P().on("zoom",function(M){const i=M.transform,p=y=>{const S=Math.round(y);return Math.min(e,Math.max(0,S))},n=t.fullDataFormatter.grid.groupAxis.position==="bottom"||t.fullDataFormatter.grid.groupAxis.position==="top"?i.rescaleX(l).domain().map(p):i.rescaleY(l).domain().map(p);n[0]<=0&&n[1]>=e?i.k<o.k&&(i.k=o.k,i.x=o.x,i.y=o.y):n[1]-n[0]<=1&&i.k>o.k&&(i.k=o.k,i.x=o.x,i.y=o.y),o.k=i.k,o.x=i.x,o.y=i.y;const h={...t.fullDataFormatter,grid:{...t.fullDataFormatter.grid,groupAxis:{...t.fullDataFormatter.grid.groupAxis,scaleDomain:n}}};g.dataFormatter$.next(h)});r.call(d)}),()=>{s.next(void 0),c.remove()}});export{W as S};
