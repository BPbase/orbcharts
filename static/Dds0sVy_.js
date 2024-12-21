import{S as G,j as y,d as Y,t as A,k as S,m as b,a as I,s as w,aZ as C,g as z,a$ as U,aK as K,b3 as Z}from"./Dwexfo5s.js";import{h as q,c as E,i as F}from"./ByZY14vp.js";import{b as H}from"./DdT0iQQs.js";const J=6;function Q(v,k){return v.map((i,d)=>{const f=E(i,k),s=typeof f=="string"?f.split(`
`):[f];return{text:f,textArr:s}})}function _({selection:v,groupingLabelClassName:k,fullParams:i,axisLabelAlign:d,gridAxesSize:f,fullDataFormatter:s,chartParams:h,textReverseTransform:R}){const p=i.tickPadding+i.labelOffset[0],g=i.tickPadding+i.labelOffset[1];let a=0,l=0;s.groupAxis.position==="bottom"?(l=g,s.valueAxis.position==="left"?a=p:s.valueAxis.position==="right"&&(a=-p)):s.groupAxis.position==="top"?(l=-g,s.valueAxis.position==="left"?a=p:s.valueAxis.position==="right"&&(a=-p)):s.groupAxis.position==="left"?(a=-p,s.valueAxis.position==="bottom"?l=-g:s.valueAxis.position==="top"&&(l=g)):s.groupAxis.position==="right"&&(a=p,s.valueAxis.position==="bottom"?l=-g:s.valueAxis.position==="top"&&(l=g)),v.selectAll(`g.${k}`).data([i]).join("g").classed(k,!0).each((o,T,m)=>{w(m[T]).selectAll("text").data([o]).join(c=>c.append("text").style("font-weight","bold"),c=>c,c=>c.remove()).attr("text-anchor",d.textAnchor).attr("dominant-baseline",d.dominantBaseline).attr("font-size",h.styles.textSize).style("fill",C(i.labelColorType,h)).style("transform",R).attr("x",a).attr("y",l).text(c=>s.groupAxis.label)}).attr("transform",o=>`translate(${f.width}, 0)`)}function N({selection:v,xAxisClassName:k,fullParams:i,tickTextAlign:d,gridAxesSize:f,fullDataFormatter:s,chartParams:h,groupScale:R,groupScaleDomain:p,groupLabelData:g,textReverseTransformWithRotate:a,textSizePx:l}){const o=v.selectAll(`g.${k}`).data([i]).join("g").classed(k,!0),T=Math.floor(p[1])-Math.ceil(p[0])+1;let m=0,c=0;s.groupAxis.position==="left"?(m=0,c=-i.tickPadding):s.groupAxis.position==="right"?(m=0,c=i.tickPadding):s.groupAxis.position==="bottom"?(m=i.tickPadding,c=0):s.groupAxis.position==="top"&&(m=-i.tickPadding,c=-0);const V=q(R).scale(R).ticks(i.ticks==="all"||i.ticks>T?T:i.ticks).tickSize(i.tickFullLine==!0?f.height:-J).tickSizeOuter(0).tickFormat(L=>{var M;return((M=g[L])==null?void 0:M.text)??""}).tickPadding(m),$=o.transition().duration(100).call(V).on("end",(L,M)=>{o.selectAll(".tick text").each((D,B,X)=>{var n;const t=((n=g[D])==null?void 0:n.textArr)??[];H(w(X[B]),{textArr:t,textSizePx:l,groupAxisPosition:s.groupAxis.position})})});return $.selectAll("line").style("fill","none").style("stroke",i.tickLineVisible==!0?C(i.tickColorType,h):"none").style("stroke-dasharray",i.tickFullLineDasharray).attr("pointer-events","none"),$.selectAll("path").style("fill","none").style("stroke",i.axisLineVisible==!0?C(i.axisLineColorType,h):"none").style("shape-rendering","crispEdges"),o.selectAll("text").attr("font-size",h.styles.textSize).attr("fill",C(i.tickTextColorType,h)).attr("text-anchor",d.textAnchor).attr("dominant-baseline",d.dominantBaseline).attr("x",c).style("transform",a).attr("dy",0),o}const re=(v,{selection:k,computedData$:i,fullParams$:d,fullDataFormatter$:f,fullChartParams$:s,gridAxesTransform$:h,gridAxesReverseTransform$:R,gridAxesSize$:p,gridContainerPosition$:g,isSeriesSeprate$:a,textSizePx$:l})=>{const o=new G,T=z(v,"container"),m=z(v,"xAxisG"),c=z(v,"xAxis"),V=z(v,"groupingLabel"),$=y({computedData:i.pipe(Y((e,r)=>e.length===r.length)),isSeriesSeprate:a}).pipe(A(o),S(async e=>e),b(e=>e.isSeriesSeprate?e.computedData:[e.computedData[0]]),b((e,r)=>k.selectAll(`g.${T}`).data(e,u=>u[0]?u[0].seriesIndex:r).join("g").classed(T,!0))),P=$.pipe(A(o),b((e,r)=>e.selectAll(`g.${m}`).data([m]).join("g").classed(m,!0)));y({containerSelection:$,gridContainerPosition:g}).pipe(A(o),S(async e=>e)).subscribe(e=>{e.containerSelection.attr("transform",(r,u)=>{const j=e.gridContainerPosition[u]??e.gridContainerPosition[0],W=j.translate,O=j.scale;return`translate(${W[0]}, ${W[1]}) scale(${O[0]}, ${O[1]})`})}),y({axisSelection:P,gridAxesTransform:h}).pipe(A(o),S(async e=>e)).subscribe(e=>{e.axisSelection.style("transform",e.gridAxesTransform.value)});const L=y({gridAxesReverseTransform:R,gridContainerPosition:g}).pipe(A(o),S(async e=>e),b(e=>{const r=`rotateX(${e.gridAxesReverseTransform.rotateX}deg) rotateY(${e.gridAxesReverseTransform.rotateY}deg)`,u=`rotate(${e.gridAxesReverseTransform.rotate}deg)`,j=`scale(${1/e.gridContainerPosition[0].scale[0]}, ${1/e.gridContainerPosition[0].scale[1]})`;return`${r} ${u} ${j}`}),Y()),M=y({textReverseTransform:L,fullParams:d}).pipe(A(o),S(async e=>e),b(e=>`${e.textReverseTransform} rotate(${e.fullParams.tickTextRotate}deg)`)),D=y({fullDataFormatter:f,gridAxesSize:p,computedData:i}).pipe(A(o),S(async e=>e),b(e=>{const r=e.computedData[0]?e.computedData[0].length-1:0,u=e.fullDataFormatter.groupAxis.scaleDomain[0]-e.fullDataFormatter.groupAxis.scalePadding,j=e.fullDataFormatter.groupAxis.scaleDomain[1]==="max"?r+e.fullDataFormatter.groupAxis.scalePadding:e.fullDataFormatter.groupAxis.scaleDomain[1]+e.fullDataFormatter.groupAxis.scalePadding;return[u,j]}),I(1)),B=y({groupScaleDomain:D,gridAxesSize:p}).pipe(A(o),S(async e=>e),b(e=>U().domain(e.groupScaleDomain).range([0,e.gridAxesSize.width]))),X=i.pipe(b(e=>(e[0]??[]).map(r=>r.groupLabel))),t=y({fullDataFormatter:f,fullParams:d}).pipe(A(o),S(async e=>e),b(e=>{let r="middle",u="hanging";return e.fullDataFormatter.groupAxis.position==="bottom"?(r=e.fullParams.tickTextRotate?"end":"middle",u="hanging"):e.fullDataFormatter.groupAxis.position==="top"?(r=e.fullParams.tickTextRotate?"start":"middle",u="auto"):e.fullDataFormatter.groupAxis.position==="left"?(r="end",u="middle"):e.fullDataFormatter.groupAxis.position==="right"&&(r="start",u="middle"),{textAnchor:r,dominantBaseline:u}})),n=f.pipe(A(o),b(e=>{let r="start",u="hanging";return e.groupAxis.position==="bottom"?u="hanging":e.groupAxis.position==="top"?u="auto":e.groupAxis.position==="left"?r="end":e.groupAxis.position==="right"&&(r="start"),e.valueAxis.position==="left"?r="start":e.valueAxis.position==="right"?r="end":e.valueAxis.position==="bottom"?u="auto":e.valueAxis.position==="top"&&(u="hanging"),{textAnchor:r,dominantBaseline:u}})),x=y({groupLabels:X,fullParams:d}).pipe(A(o),S(async e=>e),b(e=>Q(e.groupLabels,e.fullParams.tickFormat)));return y({axisSelection:P,fullParams:d,tickTextAlign:t,axisLabelAlign:n,gridAxesSize:p,fullDataFormatter:f,chartParams:s,groupScale:B,groupScaleDomain:D,groupLabelData:x,textReverseTransform:L,textReverseTransformWithRotate:M,textSizePx:l}).pipe(A(o),S(async e=>e)).subscribe(e=>{N({selection:e.axisSelection,xAxisClassName:c,fullParams:e.fullParams,tickTextAlign:e.tickTextAlign,gridAxesSize:e.gridAxesSize,fullDataFormatter:e.fullDataFormatter,chartParams:e.chartParams,groupScale:e.groupScale,groupScaleDomain:e.groupScaleDomain,groupLabelData:e.groupLabelData,textReverseTransformWithRotate:e.textReverseTransformWithRotate,textSizePx:e.textSizePx}),_({selection:e.axisSelection,groupingLabelClassName:V,fullParams:e.fullParams,axisLabelAlign:e.axisLabelAlign,gridAxesSize:e.gridAxesSize,fullDataFormatter:e.fullDataFormatter,chartParams:e.chartParams,textReverseTransform:e.textReverseTransform})}),()=>{o.next(void 0)}},ee=6;function te({selection:v,textClassName:k,fullParams:i,axisLabelAlign:d,gridAxesSize:f,fullDataFormatter:s,fullChartParams:h,textReverseTransform:R}){const p=i.tickPadding-i.labelOffset[0],g=i.tickPadding+i.labelOffset[1];let a=0,l=0;s.groupAxis.position==="bottom"?(l=-g,s.valueAxis.position==="left"?a=-p:s.valueAxis.position==="right"&&(a=p)):s.groupAxis.position==="top"?(l=g,s.valueAxis.position==="left"?a=-p:s.valueAxis.position==="right"&&(a=p)):s.groupAxis.position==="left"?(a=p,s.valueAxis.position==="bottom"?l=g:s.valueAxis.position==="top"&&(l=-g)):s.groupAxis.position==="right"&&(a=-p,s.valueAxis.position==="bottom"?l=g:s.valueAxis.position==="top"&&(l=-g)),v.selectAll(`g.${k}`).data([i]).join("g").classed(k,!0).each((o,T,m)=>{w(m[T]).selectAll("text").data([o]).join(c=>c.append("text").style("font-weight","bold"),c=>c,c=>c.remove()).attr("text-anchor",d.textAnchor).attr("dominant-baseline",d.dominantBaseline).attr("font-size",h.styles.textSize).style("fill",C(i.labelColorType,h)).style("transform",R).attr("x",a).attr("y",l).text(c=>s.valueAxis.label)}).attr("transform",o=>`translate(0, ${f.height})`)}function ie({selection:v,yAxisClassName:k,fullParams:i,tickTextAlign:d,gridAxesSize:f,fullDataFormatter:s,fullChartParams:h,valueScale:R,textReverseTransformWithRotate:p,filteredMinMaxValue:g}){const a=v.selectAll(`g.${k}`).data([i]).join("g").classed(k,!0);let l=0,o=0;s.valueAxis.position==="left"?(l=i.tickPadding,o=0):s.valueAxis.position==="right"?(l=-i.tickPadding,o=0):s.valueAxis.position==="bottom"?(l=0,o=i.tickPadding):s.valueAxis.position==="top"&&(l=0,o=-i.tickPadding);const T=F(R).scale(R).ticks(i.ticks).tickFormat(V=>E(V,i.tickFormat)).tickSize(i.tickFullLine==!0?-f.width:ee).tickPadding(l),m=a.transition().duration(100).call(T);m.selectAll("line").style("fill","none").style("stroke",i.tickLineVisible==!0?C(i.tickColorType,h):"none").style("stroke-dasharray",i.tickFullLineDasharray).attr("pointer-events","none"),m.selectAll("path").style("fill","none").style("stroke",i.axisLineVisible==!0?C(i.axisLineColorType,h):"none").style("shape-rendering","crispEdges");const c=a.selectAll("text").attr("font-size",h.styles.textSize).style("color",C(i.tickTextColorType,h)).attr("text-anchor",d.textAnchor).attr("dominant-baseline",d.dominantBaseline).attr("y",o).attr("dy",0);return c.style("transform",p),(s.valueAxis.position==="bottom"||s.valueAxis.position==="top")&&c.attr("dy",0),a}const le=(v,{selection:k,computedData$:i,filteredMinMaxValue$:d,fullParams$:f,fullDataFormatter$:s,fullChartParams$:h,gridAxesTransform$:R,gridAxesReverseTransform$:p,gridAxesSize$:g,gridContainerPosition$:a,isSeriesSeprate$:l})=>{const o=new G,T=z(v,"container"),m=z(v,"yAxisG"),c=z(v,"yAxis"),V=z(v,"text"),$=y({computedData:i.pipe(Y((t,n)=>t.length===n.length)),isSeriesSeprate:l}).pipe(A(o),S(async t=>t),b(t=>t.isSeriesSeprate?t.computedData:[t.computedData[0]]),b((t,n)=>k.selectAll(`g.${T}`).data(t,x=>x[0]?x[0].seriesIndex:n).join("g").classed(T,!0))),P=$.pipe(A(o),b((t,n)=>t.selectAll(`g.${m}`).data([m]).join("g").classed(m,!0)));y({containerSelection:$,gridContainerPosition:a}).pipe(A(o),S(async t=>t)).subscribe(t=>{t.containerSelection.attr("transform",(n,x)=>{const e=t.gridContainerPosition[x]??t.gridContainerPosition[0],r=e.translate,u=e.scale;return`translate(${r[0]}, ${r[1]}) scale(${u[0]}, ${u[1]})`})}),y({axisSelection:P,gridAxesTransform:R}).pipe(A(o),S(async t=>t)).subscribe(t=>{t.axisSelection.style("transform",t.gridAxesTransform.value)});const L=y({gridAxesReverseTransform:p,gridContainerPosition:a}).pipe(A(o),S(async t=>t),b(t=>{const n=`rotateX(${t.gridAxesReverseTransform.rotateX}deg) rotateY(${t.gridAxesReverseTransform.rotateY}deg)`,x=`rotate(${t.gridAxesReverseTransform.rotate}deg)`,e=`scale(${1/t.gridContainerPosition[0].scale[0]}, ${1/t.gridContainerPosition[0].scale[1]})`;return`${n} ${x} ${e}`}),Y()),M=y({textReverseTransform:L,fullParams:f}).pipe(A(o),S(async t=>t),b(t=>`${t.textReverseTransform} rotate(${t.fullParams.tickTextRotate}deg)`)),D=new K(t=>{y({fullDataFormatter:s,gridAxesSize:g,filteredMinMaxValue:d}).pipe(A(o),S(async n=>n)).subscribe(n=>{let x=n.filteredMinMaxValue[1],e=n.filteredMinMaxValue[0];x===e&&x===0&&(x=1);const r=Z({maxValue:x,minValue:e,axisWidth:n.gridAxesSize.height,scaleDomain:n.fullDataFormatter.valueAxis.scaleDomain,scaleRange:n.fullDataFormatter.valueAxis.scaleRange});t.next(r)})}),B=y({fullDataFormatter:s,fullParams:f}).pipe(A(o),S(async t=>t),b(t=>{let n="start",x="hanging";return t.fullDataFormatter.valueAxis.position==="left"?(n="end",x="middle"):t.fullDataFormatter.valueAxis.position==="right"?(n="start",x="middle"):t.fullDataFormatter.valueAxis.position==="bottom"?(n=t.fullParams.tickTextRotate?"end":"middle",x="hanging"):t.fullDataFormatter.valueAxis.position==="top"&&(n=t.fullParams.tickTextRotate?"start":"middle",x="auto"),{textAnchor:n,dominantBaseline:x}})),X=s.pipe(A(o),b(t=>{let n="start",x="hanging";return t.groupAxis.position==="bottom"?x="auto":t.groupAxis.position==="top"?x="hanging":t.groupAxis.position==="left"?n="start":t.groupAxis.position==="right"&&(n="end"),t.valueAxis.position==="left"?n="end":t.valueAxis.position==="right"?n="start":t.valueAxis.position==="bottom"?x="hanging":t.valueAxis.position==="top"&&(x="auto"),{textAnchor:n,dominantBaseline:x}}));return y({axisSelection:P,fullParams:f,tickTextAlign:B,axisLabelAlign:X,computedData:i,gridAxesSize:g,fullDataFormatter:s,fullChartParams:h,valueScale:D,textReverseTransform:L,textReverseTransformWithRotate:M,filteredMinMaxValue:d}).pipe(A(o),S(async t=>t)).subscribe(t=>{ie({selection:t.axisSelection,yAxisClassName:c,fullParams:t.fullParams,tickTextAlign:t.tickTextAlign,gridAxesSize:t.gridAxesSize,fullDataFormatter:t.fullDataFormatter,fullChartParams:t.fullChartParams,valueScale:t.valueScale,textReverseTransformWithRotate:t.textReverseTransformWithRotate,filteredMinMaxValue:t.filteredMinMaxValue}),te({selection:t.axisSelection,textClassName:V,fullParams:t.fullParams,axisLabelAlign:t.axisLabelAlign,gridAxesSize:t.gridAxesSize,fullDataFormatter:t.fullDataFormatter,fullChartParams:t.fullChartParams,textReverseTransform:t.textReverseTransform})}),()=>{o.next(void 0)}};export{re as a,le as c};
