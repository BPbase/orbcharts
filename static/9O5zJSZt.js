import{ad as $,ae as p,af as m,ag as z,A as I,ah as P,S as C,t as d,d as A,e as V,f as N,s as R,ai as v}from"./_HanNZE-.js";import{z as L,g as T}from"./InbBT3x0.js";import{E as U}from"./BRqMWAjz.js";var h=$(function(i){return function(){i(this),this.name="EmptyError",this.message="no elements in sequence"}});function _(i){return p(function(o,a){var n=!1;o.subscribe(m(a,function(s){n=!0,a.next(s)},function(){n||a.next(i),a.complete()}))})}function Y(i){return i<=0?function(){return U}:p(function(o,a){var n=0;o.subscribe(m(a,function(s){++n<=i&&(a.next(s),i<=n&&a.complete())}))})}function j(i){return i===void 0&&(i=q),p(function(o,a){var n=!1;o.subscribe(m(a,function(s){n=!0,a.next(s)},function(){return n?a.complete():a.error(i())}))})}function q(){return new h}function O(i,o){var a=arguments.length>=2;return function(n){return n.pipe(z,Y(1),a?_(o):j(function(){return new h}))}}const D="ScalingArea",W=T(D,"rect"),Z=I(D,P)(({selection:i,rootSelection:o,name:a,observer:n,subject:s})=>{const c=new C,f=o.insert("rect","g").classed(W,!0).attr("opacity",0);let r={k:1,x:0,y:0};n.layout$.pipe(d(c)).subscribe(t=>{f.attr("width",t.width).attr("height",t.height).attr("x",t.left).attr("y",t.top)});const y=n.computedData$.pipe(A(t=>t[0]?t[0].length-1:0),V());return N({initGroupAxis:n.fullDataFormatter$.pipe(A(t=>t.grid.groupAxis),O()),fullDataFormatter:n.fullDataFormatter$,groupMaxIndex:y,layout:n.layout$,axisSize:n.gridAxesSize$}).pipe(d(c),R(async t=>t)).subscribe(t=>{const l=t.groupMaxIndex,M=t.initGroupAxis.scaleDomain[0]==="auto"?0-t.initGroupAxis.scalePadding:t.initGroupAxis.scaleDomain[0]-t.initGroupAxis.scalePadding,S=t.initGroupAxis.scaleDomain[1]==="auto"?l+t.initGroupAxis.scalePadding:t.initGroupAxis.scaleDomain[1]+t.initGroupAxis.scalePadding,x=v({maxValue:t.groupMaxIndex,minValue:0,axisWidth:t.axisSize.width,scaleDomain:[M,S],scaleRange:[0,1]}).copy(),E=L().on("zoom",function(k){const e=k.transform,g=w=>{const F=Math.round(w);return Math.min(l,Math.max(0,F))},u=t.fullDataFormatter.grid.groupAxis.position==="bottom"||t.fullDataFormatter.grid.groupAxis.position==="top"?e.rescaleX(x).domain().map(g):e.rescaleY(x).domain().map(g);u[0]<=0&&u[1]>=l?e.k<r.k&&(e.k=r.k,e.x=r.x,e.y=r.y):u[1]-u[0]<=1&&e.k>r.k&&(e.k=r.k,e.x=r.x,e.y=r.y),r.k=e.k,r.x=e.x,r.y=e.y;const G={...t.fullDataFormatter,grid:{...t.fullDataFormatter.grid,groupAxis:{...t.fullDataFormatter.grid.groupAxis,scaleDomain:u}}};s.dataFormatter$.next(G)});o.call(E)}),()=>{c.next(void 0),f.remove()}});export{Z as S};
