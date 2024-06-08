import{K as N,D as W,S as L,f as k,t as D,m as v,d as R,c as S,s as P,a as E,b as A,e as H,g as _,h as U,x as q,y as z,i as O,O as F,p as G,j as K}from"./BI-Qty3x.js";import{s as V,u as J,o as Q,c as X}from"./BVidivMX.js";function Y(r,{text:n,radius:s,lineHeight:l,isBreakAll:c=!1,limit:h=0}){if(r==null||n==null){console.error("selection or text is not defined");return}s==null&&(s=r.node().getBBox().width/2);function o(t){let a;return c?a=t.split(""):a=t.split(/\s+/g),a[a.length-1]||a.pop(),a[0]||a.shift(),a}function g(t,a){return t&&a&&t.length>a&&(t=t.substring(0,a)+"..."),t}function p(t){var i;const a=document.createElement("canvas").getContext("2d");return((i=a==null?void 0:a.measureText(t))==null?void 0:i.width)??0}function f(t){const a=p(t.trim());return Math.sqrt(a*l)}function m(t,a){let i={width:0,text:""},u=1/0;const x=[];let d=" ";c&&(d="");for(let b=0,$=t.length;b<$;++b){const w=(i.text?i.text+d:"")+t[b],T=p(w);(u+T)/2<a?(i.width=u=T,i.text=w):(u=p(t[b]),i={width:u,text:t[b]},x.push(i))}return x}function M(t){let a=0;for(let i=0,u=t.length;i<u;++i){const x=(Math.abs(i-u/2+.5)+.5)*l,d=t[i].width/2;a=Math.max(a,Math.sqrt(d**2+x**2))}return a}function e(t,a){h>0&&(a=g(a,h));const i=o(a),u=f(a),x=m(i,u),d=M(x);let b=t.select("text");b.size()||(b=t.append("text")),b.attr("transform",`translate(0,0) scale(${s/d})`);const $=b.selectAll("tspan").data(x),w=$.enter().append("tspan").attr("x",0).merge($).attr("y",(T,C)=>(C-x.length/2+.8)*l).text(T=>T.text);return $.exit().remove(),$.merge(w)}return e(r,n)}let y;function Z(r,n){return E().velocityDecay(n.force.velocityDecay).force("collision",A().radius(s=>s.r+n.force.collisionSpacing)).force("charge",H().strength(s=>-Math.pow(s.r,2)*n.force.strength)).on("tick",()=>{r.attr("transform",s=>`translate(${s.x},${s.y})`)})}function j({data:r,bubbleGroupR:n,maxValue:s,avgValue:l}){const c=n/Math.sqrt(r.length),o=c*c*Math.PI/l,g=s*o;return Math.pow(g/Math.PI,.5)*.75}function ee({data:r,LastBubbleDataMap:n,graphicWidth:s,graphicHeight:l,scaleType:c}){const h=Math.min(s,l)/2,o=r.flat().filter(t=>t.value!=null&&t.visible!=!1),g=Math.max(...o.map(t=>t.value)),p=o.reduce((t,a)=>t+(a.value??0),0)/o.length,f=j({data:o,bubbleGroupR:h,maxValue:g,avgValue:p}),m=c==="area"?.5:1,M=G().domain([0,g]).range([0,f]).exponent(m);return o.map(t=>{const a=t,i=n.get(t.id);i?(a.x=i.x,a.y=i.y):(a.x=Math.random()*s,a.y=Math.random()*l);const u=M(a.value??0);return a.r=u,a._originR=u,a})}function B({graphicSelection:r,bubblesData:n,fullParams:s}){let l=r.selectAll("g").data(n,o=>o.id),c=l.enter().append("g").attr("cursor","pointer");c.style("font-size",12).style("fill","#ffffff").attr("text-anchor","middle").attr("transform",o=>`translate(${o.x},${o.y})`),c.append("circle").attr("class","node").attr("cx",0).attr("cy",0).attr("fill",o=>o.color),c.append("text").style("opacity",.8).attr("pointer-events","none"),l.exit().remove();const h=l.merge(c);return h.select("circle").transition().duration(200).attr("r",o=>o.r).attr("fill",o=>o.color),h.each((o,g,p)=>{const f=_(p[g]);let m=!0;o.label.length<=s.bubbleText.lineLengthMin&&(m=!1),f.call(Y,{text:o.label,radius:o.r*s.bubbleText.fillRate,lineHeight:s.bubbleText.lineHeight,isBreakAll:m})}),h}function te({data:r,highlightRIncrease:n,highlightIds:s}){if(n!=0){if(!s.length){r.forEach(l=>l.r=l._originR);return}r.forEach(l=>{s.includes(l.id)?l.r=l._originR+n:l.r=l._originR})}}function ae(){return U().on("start",(r,n)=>{r.active||y.alpha(1).restart(),n.fx=n.x,n.fy=n.y}).on("drag",(r,n)=>{r.active||y.alphaTarget(0),n.fx=r.x,n.fy=r.y}).on("end",(r,n)=>{n.fx=null,n.fy=null})}function I({fullParams:r,graphicWidth:n,graphicHeight:s}){y.force("x",q().strength(r.force.strength).x(0)).force("y",z().strength(r.force.strength).y(0)),y.alpha(1).restart()}function se({bubblesSelection:r,highlightIds:n,fullChartParams:s}){if(r.interrupt("highlight"),!n.length){r.transition("highlight").style("opacity",1);return}r.each((l,c,h)=>{const o=_(h[c]);n.includes(l.id)?o.style("opacity",1).transition("highlight").ease(O).duration(500):o.style("opacity",s.styles.unhighlightedOpacity)})}const ie=N("Bubbles",W)(({selection:r,name:n,observer:s,subject:l})=>{const c=new L,h=r.append("g"),o=new L;let g=new Map;s.layout$.pipe(k()).subscribe(e=>{r.attr("transform",`translate(${e.width/2}, ${e.height/2})`),s.layout$.pipe(D(c)).subscribe(t=>{r.transition().attr("transform",`translate(${t.width/2}, ${t.height/2})`)})});const p=s.fullParams$.pipe(D(c),v(e=>e.scaleType),R()),f=new F(e=>{S({layout:s.layout$,computedData:s.computedData$,scaleType:p}).pipe(D(c),P(async t=>t)).subscribe(t=>{const a=ee({data:t.computedData,LastBubbleDataMap:g,graphicWidth:t.layout.width,graphicHeight:t.layout.height,scaleType:t.scaleType});e.next(a)})});f.subscribe(e=>{g=new Map(e.map(t=>[t.id,t]))});const m=s.fullChartParams$.pipe(D(c),v(e=>e.highlightTarget),R());S({layout:s.layout$,computedData:s.computedData$,bubblesData:f,SeriesDataMap:s.SeriesDataMap$,fullParams:s.fullParams$,highlightTarget:m}).pipe(D(c),P(async e=>e)).subscribe(e=>{const t=B({graphicSelection:h,bubblesData:e.bubblesData,fullParams:e.fullParams});y=Z(t,e.fullParams),t.on("mouseover",(a,i)=>{l.event$.next({type:"series",eventName:"mouseover",pluginName:n,highlightTarget:e.highlightTarget,datum:i,series:e.SeriesDataMap.get(i.seriesLabel),seriesIndex:i.seriesIndex,seriesLabel:i.seriesLabel,event:a,data:e.computedData})}).on("mousemove",(a,i)=>{l.event$.next({type:"series",eventName:"mousemove",pluginName:n,highlightTarget:e.highlightTarget,datum:i,series:e.SeriesDataMap.get(i.seriesLabel),seriesIndex:i.seriesIndex,seriesLabel:i.seriesLabel,event:a,data:e.computedData})}).on("mouseout",(a,i)=>{l.event$.next({type:"series",eventName:"mouseout",pluginName:n,highlightTarget:e.highlightTarget,datum:i,series:e.SeriesDataMap.get(i.seriesLabel),seriesIndex:i.seriesIndex,seriesLabel:i.seriesLabel,event:a,data:e.computedData})}).on("click",(a,i)=>{l.event$.next({type:"series",eventName:"click",pluginName:n,highlightTarget:e.highlightTarget,datum:i,series:e.SeriesDataMap.get(i.seriesLabel),seriesIndex:i.seriesIndex,seriesLabel:i.seriesLabel,event:a,data:e.computedData})}).call(ae()),y.nodes(e.bubblesData),I({fullParams:e.fullParams,graphicWidth:e.layout.width,graphicHeight:e.layout.height}),o.next(t)});const M=s.seriesHighlight$.subscribe();return S({bubblesSelection:o,bubblesData:f,highlight:s.seriesHighlight$,fullChartParams:s.fullChartParams$,fullParams:s.fullParams$,layout:s.layout$}).pipe(D(c),P(async e=>e)).subscribe(e=>{se({bubblesSelection:e.bubblesSelection,highlightIds:e.highlight,fullChartParams:e.fullChartParams}),e.fullParams.highlightRIncrease&&(te({data:e.bubblesData,highlightRIncrease:e.fullParams.highlightRIncrease,highlightIds:e.highlight}),B({graphicSelection:h,bubblesData:e.bubblesData,fullParams:e.fullParams})),I({fullParams:e.fullParams,graphicWidth:e.layout.width,graphicHeight:e.layout.height}),y.nodes(e.bubblesData)}),()=>{c.next(void 0),M.unsubscribe()}}),ne={id:"chart",style:{width:"100%",height:"100vh"}},oe=V({__name:"bubbles",setup(r){return J(()=>{const n=document.querySelector("#chart"),s=new K(n),l=new ie;s.plugins$.next([l]),s.data$.next([15,38,25,17,26,72,64,29])}),(n,s)=>(Q(),X("div",ne))}});export{oe as default};
