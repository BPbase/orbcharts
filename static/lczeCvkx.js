import{V as F,W as p,X as m,Y as z,N as I,Z as P,S as V,t as d,m as A,d as C,c as N,b as R,$ as v}from"./Bj-Bl9V3.js";import{z as L,g as T}from"./wVpfmAyl.js";import{E as U}from"./BpkNfDjM.js";var h=F(function(o){return function(){o(this),this.name="EmptyError",this.message="no elements in sequence"}});function Y(o){return p(function(a,i){var n=!1;a.subscribe(m(i,function(s){n=!0,i.next(s)},function(){n||i.next(o),i.complete()}))})}function _(o){return o<=0?function(){return U}:p(function(a,i){var n=0;a.subscribe(m(i,function(s){++n<=o&&(i.next(s),o<=n&&i.complete())}))})}function W(o){return o===void 0&&(o=X),p(function(a,i){var n=!1;a.subscribe(m(i,function(s){n=!0,i.next(s)},function(){return n?i.complete():i.error(o())}))})}function X(){return new h}function j(o,a){var i=arguments.length>=2;return function(n){return n.pipe(z,_(1),i?Y(a):W(function(){return new h}))}}const D="ScalingArea",q=T(D,"rect"),Q=I(D,P)(({selection:o,rootSelection:a,name:i,observer:n,subject:s})=>{const c=new V,f=a.insert("rect","g").classed(q,!0).attr("opacity",0);let r={k:1,x:0,y:0};n.layout$.pipe(d(c)).subscribe(t=>{f.attr("width",t.width).attr("height",t.height).attr("x",t.left).attr("y",t.top)});const y=n.computedData$.pipe(A(t=>t[0]?t[0].length-1:0),C());return N({initGroupAxis:n.fullDataFormatter$.pipe(A(t=>t.grid.groupAxis),j()),fullDataFormatter:n.fullDataFormatter$,groupMaxIndex:y,layout:n.layout$,axisSize:n.gridAxesSize$}).pipe(d(c),R(async t=>t)).subscribe(t=>{const l=t.groupMaxIndex,M=t.initGroupAxis.scaleDomain[0]==="auto"?0-t.initGroupAxis.scalePadding:t.initGroupAxis.scaleDomain[0]-t.initGroupAxis.scalePadding,S=t.initGroupAxis.scaleDomain[1]==="auto"?l+t.initGroupAxis.scalePadding:t.initGroupAxis.scaleDomain[1]+t.initGroupAxis.scalePadding,x=v({maxValue:t.groupMaxIndex,minValue:0,axisWidth:t.axisSize.width,scaleDomain:[M,S],scaleRange:[0,1]}).copy(),E=L().on("zoom",function(k){const e=k.transform,g=$=>{const w=Math.round($);return Math.min(l,Math.max(0,w))},u=t.fullDataFormatter.grid.groupAxis.position==="bottom"||t.fullDataFormatter.grid.groupAxis.position==="top"?e.rescaleX(x).domain().map(g):e.rescaleY(x).domain().map(g);u[0]<=0&&u[1]>=l?e.k<r.k&&(e.k=r.k,e.x=r.x,e.y=r.y):u[1]-u[0]<=1&&e.k>r.k&&(e.k=r.k,e.x=r.x,e.y=r.y),r.k=e.k,r.x=e.x,r.y=e.y;const G={...t.fullDataFormatter,grid:{...t.fullDataFormatter.grid,groupAxis:{...t.fullDataFormatter.grid.groupAxis,scaleDomain:u}}};s.dataFormatter$.next(G)});a.call(E)}),()=>{c.next(void 0),f.remove()}});export{Q as S};
