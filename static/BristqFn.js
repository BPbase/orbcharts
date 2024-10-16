import{S as O,o as m,h as B,t as p,p as v,m as y,i as U,s as G,ay as q,$ as W,aD as H}from"./2XQAe-5D.js";import{h as L,n as J,i as E,g as C,o as K,q as Q}from"./Cfi7iaje.js";const Z=6;function _({selection:h,groupingLabelClassName:b,fullParams:t,axisLabelAlign:d,gridAxesSize:f,fullDataFormatter:n,chartParams:A,textReverseTransform:k}){const l=t.tickPadding+t.labelOffset[0],a=t.tickPadding+t.labelOffset[1];let c=0,s=0;n.grid.groupAxis.position==="bottom"?(s=a,n.grid.valueAxis.position==="left"?c=l:n.grid.valueAxis.position==="right"&&(c=-l)):n.grid.groupAxis.position==="top"?(s=-a,n.grid.valueAxis.position==="left"?c=l:n.grid.valueAxis.position==="right"&&(c=-l)):n.grid.groupAxis.position==="left"?(c=-l,n.grid.valueAxis.position==="bottom"?s=-a:n.grid.valueAxis.position==="top"&&(s=a)):n.grid.groupAxis.position==="right"&&(c=l,n.grid.valueAxis.position==="bottom"?s=-a:n.grid.valueAxis.position==="top"&&(s=a)),h.selectAll(`g.${b}`).data([t]).join("g").classed(b,!0).each((u,g,S)=>{G(S[g]).selectAll("text").data([u]).join(x=>x.append("text").style("font-weight","bold"),x=>x,x=>x.remove()).attr("text-anchor",d.textAnchor).attr("dominant-baseline",d.dominantBaseline).attr("font-size",A.styles.textSize).style("fill",L(t.labelColorType,A)).style("transform",k).attr("x",c).attr("y",s).text(x=>n.grid.groupAxis.label)}).attr("transform",u=>`translate(${f.width}, 0)`)}function N({selection:h,xAxisClassName:b,fullParams:t,tickTextAlign:d,gridAxesSize:f,fullDataFormatter:n,chartParams:A,groupScale:k,groupScaleDomain:l,groupLabels:a,textReverseTransformWithRotate:c}){const s=h.selectAll(`g.${b}`).data([t]).join("g").classed(b,!0),u=Math.floor(l[1])-Math.ceil(l[0])+1;let g=0,S=0;n.grid.groupAxis.position==="left"?(g=0,S=-t.tickPadding):n.grid.groupAxis.position==="right"?(g=0,S=t.tickPadding):n.grid.groupAxis.position==="bottom"?(g=t.tickPadding,S=0):n.grid.groupAxis.position==="top"&&(g=-t.tickPadding,S=-0);const x=J(k).scale(k).ticks(t.ticks==="all"||t.ticks>u?u:t.ticks).tickSize(t.tickFullLine==!0?f.height:-Z).tickSizeOuter(0).tickFormat(z=>{const M=a[z]??"";return E(M,t.tickFormat)}).tickPadding(g),T=s.transition().duration(100).call(x);return T.selectAll("line").style("fill","none").style("stroke",t.tickLineVisible==!0?L(t.tickColorType,A):"none").style("stroke-dasharray",t.tickFullLineDasharray).attr("pointer-events","none"),T.selectAll("path").style("fill","none").style("stroke",t.axisLineVisible==!0?L(t.axisLineColorType,A):"none").style("shape-rendering","crispEdges"),s.selectAll("text").attr("font-size",A.styles.textSize).style("color",L(t.tickTextColorType,A)).attr("text-anchor",d.textAnchor).attr("dominant-baseline",d.dominantBaseline).attr("x",S).style("transform",c).attr("dy",0),s}const le=(h,{selection:b,computedData$:t,fullParams$:d,fullDataFormatter$:f,fullChartParams$:n,gridAxesTransform$:A,gridAxesReverseTransform$:k,gridAxesSize$:l,gridContainerPosition$:a,isSeriesSeprate$:c})=>{const s=new O,u=C(h,"container"),g=C(h,"xAxisG"),S=C(h,"xAxis"),x=C(h,"groupingLabel"),T=m({computedData:t.pipe(B((e,o)=>e.length===o.length)),isSeriesSeprate:c}).pipe(p(s),v(async e=>e),y(e=>e.isSeriesSeprate?e.computedData:[e.computedData[0]]),y((e,o)=>b.selectAll(`g.${u}`).data(e,r=>r[0]?r[0].seriesIndex:o).join("g").classed(u,!0))),D=T.pipe(p(s),y((e,o)=>e.selectAll(`g.${g}`).data([g]).join("g").classed(g,!0)));m({containerSelection:T,gridContainerPosition:a}).pipe(p(s),v(async e=>e)).subscribe(e=>{e.containerSelection.attr("transform",(o,r)=>{const R=e.gridContainerPosition[r]??e.gridContainerPosition[0],$=R.translate,j=R.scale;return`translate(${$[0]}, ${$[1]}) scale(${j[0]}, ${j[1]})`})}),m({axisSelection:D,gridAxesTransform:A}).pipe(p(s),v(async e=>e)).subscribe(e=>{e.axisSelection.style("transform",e.gridAxesTransform.value)});const z=m({gridAxesReverseTransform:k,gridContainerPosition:a}).pipe(p(s),v(async e=>e),y(e=>{const o=`rotateX(${e.gridAxesReverseTransform.rotateX}deg) rotateY(${e.gridAxesReverseTransform.rotateY}deg)`,r=`rotate(${e.gridAxesReverseTransform.rotate}deg)`,R=`scale(${1/e.gridContainerPosition[0].scale[0]}, ${1/e.gridContainerPosition[0].scale[1]})`;return`${o} ${r} ${R}`}),B()),M=m({textReverseTransform:z,fullParams:d}).pipe(p(s),v(async e=>e),y(e=>`${e.textReverseTransform} rotate(${e.fullParams.tickTextRotate}deg)`)),P=m({fullDataFormatter:f,gridAxesSize:l,computedData:t}).pipe(p(s),v(async e=>e),y(e=>{const r=e.computedData[0]?e.computedData[0].length-1:0,R=e.fullDataFormatter.grid.groupAxis.scaleDomain[0]==="auto"?0-e.fullDataFormatter.grid.groupAxis.scalePadding:e.fullDataFormatter.grid.groupAxis.scaleDomain[0]-e.fullDataFormatter.grid.groupAxis.scalePadding,$=e.fullDataFormatter.grid.groupAxis.scaleDomain[1]==="auto"?r+e.fullDataFormatter.grid.groupAxis.scalePadding:e.fullDataFormatter.grid.groupAxis.scaleDomain[1]+e.fullDataFormatter.grid.groupAxis.scalePadding;return[R,$]}),U(1)),F=m({groupScaleDomain:P,gridAxesSize:l}).pipe(p(s),v(async e=>e),y(e=>q().domain(e.groupScaleDomain).range([0,e.gridAxesSize.width]))),X=t.pipe(y(e=>(e[0]??[]).map(o=>o.groupLabel))),Y=m({fullDataFormatter:f,fullParams:d}).pipe(p(s),v(async e=>e),y(e=>{let o="middle",r="hanging";return e.fullDataFormatter.grid.groupAxis.position==="bottom"?(o=e.fullParams.tickTextRotate?"end":"middle",r="hanging"):e.fullDataFormatter.grid.groupAxis.position==="top"?(o=e.fullParams.tickTextRotate?"start":"middle",r="auto"):e.fullDataFormatter.grid.groupAxis.position==="left"?(o="end",r="middle"):e.fullDataFormatter.grid.groupAxis.position==="right"&&(o="start",r="middle"),{textAnchor:o,dominantBaseline:r}})),i=f.pipe(p(s),y(e=>{let o="start",r="hanging";return e.grid.groupAxis.position==="bottom"?r="hanging":e.grid.groupAxis.position==="top"?r="auto":e.grid.groupAxis.position==="left"?o="end":e.grid.groupAxis.position==="right"&&(o="start"),e.grid.valueAxis.position==="left"?o="start":e.grid.valueAxis.position==="right"?o="end":e.grid.valueAxis.position==="bottom"?r="auto":e.grid.valueAxis.position==="top"&&(r="hanging"),{textAnchor:o,dominantBaseline:r}}));return m({axisSelection:D,fullParams:d,tickTextAlign:Y,axisLabelAlign:i,gridAxesSize:l,fullDataFormatter:f,chartParams:n,groupScale:F,groupScaleDomain:P,groupLabels:X,textReverseTransform:z,textReverseTransformWithRotate:M}).pipe(p(s),v(async e=>e)).subscribe(e=>{N({selection:e.axisSelection,xAxisClassName:S,fullParams:e.fullParams,tickTextAlign:e.tickTextAlign,gridAxesSize:e.gridAxesSize,fullDataFormatter:e.fullDataFormatter,chartParams:e.chartParams,groupScale:e.groupScale,groupScaleDomain:e.groupScaleDomain,groupLabels:e.groupLabels,textReverseTransformWithRotate:e.textReverseTransformWithRotate}),_({selection:e.axisSelection,groupingLabelClassName:x,fullParams:e.fullParams,axisLabelAlign:e.axisLabelAlign,gridAxesSize:e.gridAxesSize,fullDataFormatter:e.fullDataFormatter,chartParams:e.chartParams,textReverseTransform:e.textReverseTransform})}),()=>{s.next(void 0)}},ee=6;function ie({selection:h,textClassName:b,fullParams:t,axisLabelAlign:d,gridAxesSize:f,fullDataFormatter:n,fullChartParams:A,textReverseTransform:k}){const l=t.tickPadding-t.labelOffset[0],a=t.tickPadding+t.labelOffset[1];let c=0,s=0;n.grid.groupAxis.position==="bottom"?(s=-a,n.grid.valueAxis.position==="left"?c=-l:n.grid.valueAxis.position==="right"&&(c=l)):n.grid.groupAxis.position==="top"?(s=a,n.grid.valueAxis.position==="left"?c=-l:n.grid.valueAxis.position==="right"&&(c=l)):n.grid.groupAxis.position==="left"?(c=l,n.grid.valueAxis.position==="bottom"?s=a:n.grid.valueAxis.position==="top"&&(s=-a)):n.grid.groupAxis.position==="right"&&(c=-l,n.grid.valueAxis.position==="bottom"?s=a:n.grid.valueAxis.position==="top"&&(s=-a)),h.selectAll(`g.${b}`).data([t]).join("g").classed(b,!0).each((u,g,S)=>{G(S[g]).selectAll("text").data([u]).join(x=>x.append("text").style("font-weight","bold"),x=>x,x=>x.remove()).attr("text-anchor",d.textAnchor).attr("dominant-baseline",d.dominantBaseline).attr("font-size",A.styles.textSize).style("fill",L(t.labelColorType,A)).style("transform",k).attr("x",c).attr("y",s).text(x=>n.grid.valueAxis.label)}).attr("transform",u=>`translate(0, ${f.height})`)}function te({selection:h,yAxisClassName:b,fullParams:t,tickTextAlign:d,gridAxesSize:f,fullDataFormatter:n,fullChartParams:A,valueScale:k,textReverseTransformWithRotate:l,minAndMax:a}){const c=h.selectAll(`g.${b}`).data([t]).join("g").classed(b,!0),s=a[1]-a[0];let u=0,g=0;n.grid.valueAxis.position==="left"?(u=t.tickPadding,g=0):n.grid.valueAxis.position==="right"?(u=-t.tickPadding,g=0):n.grid.valueAxis.position==="bottom"?(u=0,g=t.tickPadding):n.grid.valueAxis.position==="top"&&(u=0,g=-t.tickPadding);const S=K(k).scale(k).ticks(s>t.ticks?t.ticks:a[0]===0&&a[1]===0?1:Math.ceil(s)).tickFormat(D=>E(D,t.tickFormat)).tickSize(t.tickFullLine==!0?-f.width:ee).tickPadding(u),x=c.transition().duration(100).call(S);x.selectAll("line").style("fill","none").style("stroke",t.tickLineVisible==!0?L(t.tickColorType,A):"none").style("stroke-dasharray",t.tickFullLineDasharray).attr("pointer-events","none"),x.selectAll("path").style("fill","none").style("stroke",t.axisLineVisible==!0?L(t.axisLineColorType,A):"none").style("shape-rendering","crispEdges");const T=c.selectAll("text").attr("font-size",A.styles.textSize).style("color",L(t.tickTextColorType,A)).attr("text-anchor",d.textAnchor).attr("dominant-baseline",d.dominantBaseline).attr("y",g);return T.style("transform",l),(n.grid.valueAxis.position==="bottom"||n.grid.valueAxis.position==="top")&&T.attr("dy",0),c}const ae=(h,{selection:b,computedData$:t,fullParams$:d,fullDataFormatter$:f,fullChartParams$:n,gridAxesTransform$:A,gridAxesReverseTransform$:k,gridAxesSize$:l,gridContainerPosition$:a,isSeriesSeprate$:c})=>{const s=new O,u=C(h,"container"),g=C(h,"yAxisG"),S=C(h,"yAxis"),x=C(h,"text"),T=m({computedData:t.pipe(B((i,e)=>i.length===e.length)),isSeriesSeprate:c}).pipe(p(s),v(async i=>i),y(i=>i.isSeriesSeprate?i.computedData:[i.computedData[0]]),y((i,e)=>b.selectAll(`g.${u}`).data(i,o=>o[0]?o[0].seriesIndex:e).join("g").classed(u,!0))),D=T.pipe(p(s),y((i,e)=>i.selectAll(`g.${g}`).data([g]).join("g").classed(g,!0)));m({containerSelection:T,gridContainerPosition:a}).pipe(p(s),v(async i=>i)).subscribe(i=>{i.containerSelection.attr("transform",(e,o)=>{const r=i.gridContainerPosition[o]??i.gridContainerPosition[0],R=r.translate,$=r.scale;return`translate(${R[0]}, ${R[1]}) scale(${$[0]}, ${$[1]})`})}),m({axisSelection:D,gridAxesTransform:A}).pipe(p(s),v(async i=>i)).subscribe(i=>{i.axisSelection.style("transform",i.gridAxesTransform.value)});const z=m({gridAxesReverseTransform:k,gridContainerPosition:a}).pipe(p(s),v(async i=>i),y(i=>{const e=`rotateX(${i.gridAxesReverseTransform.rotateX}deg) rotateY(${i.gridAxesReverseTransform.rotateY}deg)`,o=`rotate(${i.gridAxesReverseTransform.rotate}deg)`,r=`scale(${1/i.gridContainerPosition[0].scale[0]}, ${1/i.gridContainerPosition[0].scale[1]})`;return`${e} ${o} ${r}`}),B()),M=m({textReverseTransform:z,fullParams:d}).pipe(p(s),v(async i=>i),y(i=>`${i.textReverseTransform} rotate(${i.fullParams.tickTextRotate}deg)`)),P=new W(i=>{m({fullDataFormatter:f,gridAxesSize:l,computedData:t}).pipe(p(s),v(async e=>e)).subscribe(e=>{const r=e.computedData[0]?e.computedData[0].length-1:0,R=e.fullDataFormatter.grid.groupAxis.scaleDomain[0]==="auto"?0-e.fullDataFormatter.grid.groupAxis.scalePadding:e.fullDataFormatter.grid.groupAxis.scaleDomain[0]-e.fullDataFormatter.grid.groupAxis.scalePadding,$=e.fullDataFormatter.grid.groupAxis.scaleDomain[1]==="auto"?r+e.fullDataFormatter.grid.groupAxis.scalePadding:e.fullDataFormatter.grid.groupAxis.scaleDomain[1]+e.fullDataFormatter.grid.groupAxis.scalePadding,j=e.computedData.map((I,se)=>I.filter((oe,w)=>w>=R&&w<=$)),V=Q(j.flat());V[0]===V[1]&&(V[0]=V[1]-1),i.next(V)})}),F=new W(i=>{m({fullDataFormatter:f,gridAxesSize:l,minAndMax:P}).pipe(p(s),v(async e=>e)).subscribe(e=>{const o=H({maxValue:e.minAndMax[1],minValue:e.minAndMax[0],axisWidth:e.gridAxesSize.height,scaleDomain:e.fullDataFormatter.grid.valueAxis.scaleDomain,scaleRange:e.fullDataFormatter.grid.valueAxis.scaleRange});i.next(o)})}),X=m({fullDataFormatter:f,fullParams:d}).pipe(p(s),v(async i=>i),y(i=>{let e="start",o="hanging";return i.fullDataFormatter.grid.valueAxis.position==="left"?(e="end",o="middle"):i.fullDataFormatter.grid.valueAxis.position==="right"?(e="start",o="middle"):i.fullDataFormatter.grid.valueAxis.position==="bottom"?(e=i.fullParams.tickTextRotate?"end":"middle",o="hanging"):i.fullDataFormatter.grid.valueAxis.position==="top"&&(e=i.fullParams.tickTextRotate?"start":"middle",o="auto"),{textAnchor:e,dominantBaseline:o}})),Y=f.pipe(p(s),y(i=>{let e="start",o="hanging";return i.grid.groupAxis.position==="bottom"?o="auto":i.grid.groupAxis.position==="top"?o="hanging":i.grid.groupAxis.position==="left"?e="start":i.grid.groupAxis.position==="right"&&(e="end"),i.grid.valueAxis.position==="left"?e="end":i.grid.valueAxis.position==="right"?e="start":i.grid.valueAxis.position==="bottom"?o="hanging":i.grid.valueAxis.position==="top"&&(o="auto"),{textAnchor:e,dominantBaseline:o}}));return m({axisSelection:D,fullParams:d,tickTextAlign:X,axisLabelAlign:Y,computedData:t,gridAxesSize:l,fullDataFormatter:f,fullChartParams:n,valueScale:F,textReverseTransform:z,textReverseTransformWithRotate:M,minAndMax:P}).pipe(p(s),v(async i=>i)).subscribe(i=>{te({selection:i.axisSelection,yAxisClassName:S,fullParams:i.fullParams,tickTextAlign:i.tickTextAlign,gridAxesSize:i.gridAxesSize,fullDataFormatter:i.fullDataFormatter,fullChartParams:i.fullChartParams,valueScale:i.valueScale,textReverseTransformWithRotate:i.textReverseTransformWithRotate,minAndMax:i.minAndMax}),ie({selection:i.axisSelection,textClassName:x,fullParams:i.fullParams,axisLabelAlign:i.axisLabelAlign,gridAxesSize:i.gridAxesSize,fullDataFormatter:i.fullDataFormatter,fullChartParams:i.fullChartParams,textReverseTransform:i.textReverseTransform})}),()=>{s.next(void 0)}};export{le as a,ae as c};
