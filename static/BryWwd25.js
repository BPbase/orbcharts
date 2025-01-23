import{ak as M,S as P,m as f,d as S,t as y,k as m,l as L,a as d,A as B,L as I,aT as w,s as C,aP as v,aU as A,aV as N,aW as R,aQ as k,aX as H,aY as _,w as F,aZ as U,a_ as E}from"./_6lsH1s8.js";const O="Bubbles",$=12,X={name:O,defaultParams:B,layerIndex:I,validator:(i,{validateColumns:s})=>{const t=s(i,{force:{toBeTypes:["object"]},bubbleLabel:{toBeTypes:["object"]},arcScaleType:{toBe:'"area" | "radius"',test:l=>l==="area"||l==="radius"}});if(i.force){const l=s(i.force,{velocityDecay:{toBeTypes:["number"]},collisionSpacing:{toBeTypes:["number"]},strength:{toBeTypes:["number"]}});if(l.status==="error")return l}if(i.bubbleLabel){const l=s(i.bubbleLabel,{colorType:{toBeOption:"ColorType"},fillRate:{toBeTypes:["number"]},lineHeight:{toBeTypes:["number"]},maxLineLength:{toBeTypes:["number"]}});if(l.status==="error")return l}return t}};let p;function Y(i,s){return A().velocityDecay(s.force.velocityDecay).force("collision",N().radius(t=>t.r+s.force.collisionSpacing)).force("charge",R().strength(t=>-Math.pow(t.r,2)*s.force.strength)).on("tick",()=>{i.attr("transform",t=>`translate(${t.x},${t.y})`)})}function j({visibleComputedLayoutData:i,LastBubbleDataMap:s,graphicWidth:t,graphicHeight:l,SeriesContainerPositionMap:o,scaleType:c}){const u=Math.min(t,l)/2,r=i.flat(),h=r.reduce((n,a)=>n+a.value,0),b=k().domain([0,h]).range([0,u]).exponent(c==="area"?.5:1),g=c==="area"?1:(()=>{const n=u*u*Math.PI;return Math.sqrt(n/H(r,a=>Math.PI*Math.pow(b(a.value),2)))})(),e=.9;return r.map(n=>{const a=n,x=s.get(a.id);if(x)a.x=x.x,a.y=x.y;else{const T=o.get(a.seriesLabel);a.x=Math.random()*T.width,a.y=Math.random()*T.height}const D=b(a.value??0)*g*e;return a.r=D,a._originR=D,a})}function V({selection:i,bubblesData:s,fullParams:t,fullChartParams:l,sumSeries:o}){const c=i.selectAll("g").data(s,r=>r.id).join(r=>{const h=r.append("g").attr("cursor","pointer").attr("font-size",$).style("fill","#ffffff").attr("text-anchor","middle");return h.append("circle").attr("class","node").attr("cx",0).attr("cy",0).attr("fill",b=>b.color),h.append("text").style("opacity",.8).attr("pointer-events","none"),h},r=>r,r=>r.remove()).attr("transform",r=>`translate(${r.x},${r.y})`),u=o?"seriesLabel":"label";return c.select("circle").transition().duration(200).attr("r",r=>r.r).attr("fill",r=>r.color),c.each((r,h,b)=>{const g=C(b[h]),e=r[u]??"";g.call(_,{text:e,radius:r.r*t.bubbleLabel.fillRate,lineHeight:$*t.bubbleLabel.lineHeight,isBreakAll:e.length<=t.bubbleLabel.maxLineLength?!1:t.bubbleLabel.wordBreakAll}),g.select("text").attr("fill",n=>F({datum:r,colorType:t.bubbleLabel.colorType,fullChartParams:l}))}),c}function W(){return w().on("start",(i,s)=>{i.active||p.alpha(1).restart(),s.fx=s.x,s.fy=s.y}).on("drag",(i,s)=>{i.active||p.alphaTarget(0),s.fx=i.x,s.fy=i.y}).on("end",(i,s)=>{s.fx=null,s.fy=null})}function q({fullParams:i,SeriesContainerPositionMap:s}){p.force("x",U().strength(i.force.strength).x(t=>s.get(t.seriesLabel).centerX)).force("y",E().strength(i.force.strength).y(t=>s.get(t.seriesLabel).centerY)),p.alpha(1).restart()}function z({bubblesSelection:i,highlightIds:s,fullChartParams:t}){if(i.interrupt("highlight"),!s.length){i.transition("highlight").style("opacity",1);return}i.each((l,o,c)=>{const u=C(c[o]);s.includes(l.id)?u.style("opacity",1).transition("highlight").ease(v).duration(500):u.style("opacity",t.styles.unhighlightedOpacity)})}const Q=M(X)(({selection:i,name:s,observer:t,subject:l})=>{const o=new P;let c=new Map;const u=t.fullDataFormatter$.pipe(f(e=>e.sumSeries),S()),r=t.fullParams$.pipe(y(o),f(e=>e.arcScaleType),S()),h=m({layout:t.layout$,SeriesContainerPositionMap:t.SeriesContainerPositionMap$,visibleComputedLayoutData:t.visibleComputedLayoutData$,scaleType:r}).pipe(y(o),L(async e=>e),f(e=>j({visibleComputedLayoutData:e.visibleComputedLayoutData,LastBubbleDataMap:c,graphicWidth:e.layout.width,graphicHeight:e.layout.height,SeriesContainerPositionMap:e.SeriesContainerPositionMap,scaleType:e.scaleType})),d(1));h.subscribe(e=>{c=new Map(e.map(n=>[n.id,n]))});const b=t.fullChartParams$.pipe(y(o),f(e=>e.highlightTarget),S()),g=m({bubblesData:h,fullParams:t.fullParams$,fullChartParams:t.fullChartParams$,SeriesContainerPositionMap:t.SeriesContainerPositionMap$,sumSeries:u}).pipe(y(o),L(async e=>e),f(e=>{p&&p.stop();const n=V({selection:i,bubblesData:e.bubblesData,fullParams:e.fullParams,fullChartParams:e.fullChartParams,sumSeries:e.sumSeries});return p=Y(n,e.fullParams),p.nodes(e.bubblesData),q({fullParams:e.fullParams,SeriesContainerPositionMap:e.SeriesContainerPositionMap}),n}));return m({bubblesSelection:g,computedData:t.computedData$,SeriesDataMap:t.SeriesDataMap$,highlightTarget:b}).pipe(y(o),L(async e=>e)).subscribe(e=>{e.bubblesSelection.on("mouseover",(n,a)=>{l.event$.next({type:"series",eventName:"mouseover",pluginName:s,highlightTarget:e.highlightTarget,datum:a,series:e.SeriesDataMap.get(a.seriesLabel),seriesIndex:a.seriesIndex,seriesLabel:a.seriesLabel,event:n,data:e.computedData})}).on("mousemove",(n,a)=>{l.event$.next({type:"series",eventName:"mousemove",pluginName:s,highlightTarget:e.highlightTarget,datum:a,series:e.SeriesDataMap.get(a.seriesLabel),seriesIndex:a.seriesIndex,seriesLabel:a.seriesLabel,event:n,data:e.computedData})}).on("mouseout",(n,a)=>{l.event$.next({type:"series",eventName:"mouseout",pluginName:s,highlightTarget:e.highlightTarget,datum:a,series:e.SeriesDataMap.get(a.seriesLabel),seriesIndex:a.seriesIndex,seriesLabel:a.seriesLabel,event:n,data:e.computedData})}).on("click",(n,a)=>{l.event$.next({type:"series",eventName:"click",pluginName:s,highlightTarget:e.highlightTarget,datum:a,series:e.SeriesDataMap.get(a.seriesLabel),seriesIndex:a.seriesIndex,seriesLabel:a.seriesLabel,event:n,data:e.computedData})}).call(W())}),m({bubblesSelection:g,bubblesData:h,highlight:t.seriesHighlight$.pipe(f(e=>e.map(n=>n.id))),fullChartParams:t.fullChartParams$,fullParams:t.fullParams$,sumSeries:u,SeriesContainerPositionMap:t.SeriesContainerPositionMap$}).pipe(y(o),L(async e=>e)).subscribe(e=>{z({bubblesSelection:e.bubblesSelection,highlightIds:e.highlight,fullChartParams:e.fullChartParams})}),()=>{o.next(void 0)}});export{Q as B};
