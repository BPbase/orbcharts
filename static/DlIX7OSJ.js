import{S as le,f as g,t as u,s as h,d as f,g as H}from"./_HanNZE-.js";import{s as U,m as se,a as M,g as $}from"./InbBT3x0.js";const ie={listRectWidth:14,listRectHeight:14,listRectRadius:0};function q(P,p){const C=P<p.colors[p.colorScheme].series.length?P:P%p.colors[p.colorScheme].series.length;return p.colors[p.colorScheme].series[C]}const ue=(P,{rootSelection:p,seriesLabels$:C,fullParams$:c,layout$:A,fullChartParams$:W,textSizePx$:w})=>{const D=$(P,"root-position"),G=$(P,"legend-card"),J=$(P,"legend-list"),k=$(P,"legend-item"),o=new le,K=g({seriesLabels:C,fullChartParams:W}).pipe(u(o),h(async e=>e),f(e=>{const l=new Map;let t=0;return e.seriesLabels.forEach((s,i)=>{if(!l.has(s)){const a=q(t,e.fullChartParams);l.set(s,a),t++}}),l})),O=C.pipe(u(o),f(e=>{const l=new Set;let t=[];return e.forEach(s=>{l.has(s)?t.push(!1):t.push(!0),l.add(s)}),t})),T=c.pipe(u(o),f(e=>e.position==="bottom"||e.position==="top"?"row":"column")),Q=g({fullParams:c,layout:A}).pipe(u(o),h(async e=>e),f(e=>{const l=e.fullParams.padding*2+e.fullParams.gap*2;return e.fullParams.position==="bottom"||e.fullParams.position==="top"?e.layout.rootWidth-l:e.layout.rootHeight-l})),V=g({layout:A,fullParams:c}).pipe(u(o),h(async e=>e),f(e=>{let l=0,t=0;return e.fullParams.position==="bottom"?(t=e.layout.rootHeight,e.fullParams.justify==="start"?l=0:e.fullParams.justify==="center"?l=e.layout.rootWidth/2:e.fullParams.justify==="end"&&(l=e.layout.rootWidth)):e.fullParams.position==="right"?(l=e.layout.rootWidth,e.fullParams.justify==="start"?t=0:e.fullParams.justify==="center"?t=e.layout.rootHeight/2:e.fullParams.justify==="end"&&(t=e.layout.rootHeight)):e.fullParams.position==="top"?(t=0,e.fullParams.justify==="start"?l=0:e.fullParams.justify==="center"?l=e.layout.rootWidth/2:e.fullParams.justify==="end"&&(l=e.layout.rootWidth)):e.fullParams.position==="left"&&(l=0,e.fullParams.justify==="start"?t=0:e.fullParams.justify==="center"?t=e.layout.rootHeight/2:e.fullParams.justify==="end"&&(t=e.layout.rootHeight)),{x:l,y:t}})).pipe(u(o),f(e=>p.selectAll(`g.${D}`).data([e]).join(l=>l.append("g").classed(D,!0).attr("transform",t=>`translate(${t.x}, ${t.y})`),l=>l.transition().attr("transform",t=>`translate(${t.x}, ${t.y})`),l=>l.remove()))),Z=c.pipe(u(o),f(e=>e.seriesList[0]?e.seriesList[0]:ie)),E=g({visibleList:O,fullParams:c,fullChartParams:W,seriesLabels:C,lineDirection:T,lineMaxSize:Q,defaultListStyle:Z,SeriesLabelColorMap:K,textSizePx:w}).pipe(u(o),h(async e=>e),f(e=>e.seriesLabels.reduce((l,t,s)=>{if(!e.visibleList[s])return l;const i=se(t,e.textSizePx),a=e.textSizePx*1.5+i,y=e.SeriesLabelColorMap.get(t),x=l[0]&&l[0][0]?l[l.length-1][l[l.length-1].length-1]:null,{translateX:r,translateY:Y,lineIndex:S,itemIndex:d}=((m,B,n)=>{let b=0,X=0,j=0,R=0;if(m.lineDirection==="column"){let z=n?n.translateY+m.textSizePx+m.fullParams.gap:0;if(z+m.textSizePx>m.lineMaxSize){j=n.lineIndex+1,R=0,X=0;const te=B[B.length-1].reduce((F,I)=>I.itemWidth>F?I.itemWidth:F,0);b=n.translateX+te+m.fullParams.gap}else j=n?n.lineIndex:0,R=n?n.itemIndex+1:0,X=z,b=n?n.translateX:0}else{let z=n?n.translateX+n.itemWidth+m.fullParams.gap:0;z+a>m.lineMaxSize?(j=n.lineIndex+1,R=0,b=0):(j=n?n.lineIndex:0,R=n?n.itemIndex+1:0,b=z),X=(m.textSizePx+m.fullParams.gap)*j}return{translateX:b,translateY:X,lineIndex:j,itemIndex:R}})(e,l,x);l[S]||(l[S]=[]);const L=e.fullParams.seriesList[d]?e.fullParams.seriesList[d]:e.defaultListStyle;return l[S].push({id:t,seriesLabel:t,seriesIndex:s,lineIndex:S,itemIndex:d,text:t,itemWidth:a,translateX:r,translateY:Y,color:y,listRectWidth:L.listRectWidth,listRectHeight:L.listRectHeight,listRectRadius:L.listRectRadius}),l},[])),U(1)),N=g({fullParams:c,fullChartParams:W,lineDirection:T,lengendItems:E,textSizePx:w}).pipe(u(o),h(async e=>e),f(e=>{const{width:l,height:t}=((s,i)=>{let a=0,y=0;if(!i.length||!i[0].length)return{width:a,height:y};const x=i[0][i[0].length-1];return s.lineDirection==="column"?(a=i.reduce((r,Y)=>{const S=Y.reduce((d,L)=>L.itemWidth>d?L.itemWidth:d,0);return r+S},0),a+=s.fullParams.gap*(i.length-1),y=x.translateY+s.textSizePx):(a=x.translateX+x.itemWidth,y=s.textSizePx*i.length+s.fullParams.gap*(i.length-1)),{width:a,height:y}})(e,e.lengendItems);return{direction:e.lineDirection,width:l,height:t,translateX:e.fullParams.gap,translateY:e.fullParams.gap}}),U(1)),v=g({fullParams:c,lengendList:N}).pipe(u(o),h(async e=>e),f(e=>{const l=e.lengendList.width+e.fullParams.gap*2,t=e.lengendList.height+e.fullParams.gap*2;let s=0,i=0;return e.fullParams.position==="left"?e.fullParams.justify==="start"?(s=e.fullParams.padding,i=e.fullParams.padding):e.fullParams.justify==="center"?(s=e.fullParams.padding,i=-t/2):e.fullParams.justify==="end"&&(s=e.fullParams.padding,i=-t-e.fullParams.padding):e.fullParams.position==="right"?e.fullParams.justify==="start"?(s=-l-e.fullParams.padding,i=e.fullParams.padding):e.fullParams.justify==="center"?(s=-l-e.fullParams.padding,i=-t/2):e.fullParams.justify==="end"&&(s=-l-e.fullParams.padding,i=-t-e.fullParams.padding):e.fullParams.position==="top"?e.fullParams.justify==="start"?(s=e.fullParams.padding,i=e.fullParams.padding):e.fullParams.justify==="center"?(s=-l/2,i=e.fullParams.padding):e.fullParams.justify==="end"&&(s=-l-e.fullParams.padding,i=e.fullParams.padding):e.fullParams.justify==="start"?(s=e.fullParams.padding,i=-t-e.fullParams.padding):e.fullParams.justify==="center"?(s=-l/2,i=-t-e.fullParams.padding):e.fullParams.justify==="end"&&(s=-l-e.fullParams.padding,i=-t-e.fullParams.padding),{width:l,height:t,translateX:s,translateY:i}})),_=g({rootPositionSelection:V,fullParams:c,fullChartParams:W,legendCard:v}).pipe(u(o),h(async e=>e),f(e=>e.rootPositionSelection.selectAll("g").data([e.legendCard]).join(l=>l.append("g").classed(G,!0).attr("transform",t=>`translate(${t.translateX}, ${t.translateY})`),l=>l.transition().attr("transform",t=>`translate(${t.translateX}, ${t.translateY})`),l=>l.remove()).each((l,t,s)=>{H(s[t]).selectAll("rect").data([l]).join("rect").attr("width",i=>i.width).attr("height",i=>i.height).attr("fill",M(e.fullParams.backgroundFill,e.fullChartParams)).attr("stroke",M(e.fullParams.backgroundStroke,e.fullChartParams))}))),ee=g({lengendCardSelection:_,fullParams:c,lengendList:N}).pipe(u(o),h(async e=>e),f(e=>e.lengendCardSelection.selectAll("g").data([e.lengendList]).join(l=>l.append("g").classed(J,!0).attr("transform",t=>`translate(${t.translateX}, ${t.translateY})`),l=>l.transition().attr("transform",t=>`translate(${t.translateX}, ${t.translateY})`),l=>l.remove())));return g({lengendListSelection:ee,fullParams:c,fullChartParams:W,lengendItems:E,textSizePx:w}).pipe(u(o),h(async e=>e),f(e=>{const l=e.lengendItems[0]?e.lengendItems.flat():[];return e.lengendListSelection.selectAll(`g.${k}`).data(l).join(t=>t.append("g").classed(k,!0).attr("cursor","default"),t=>t,t=>t.remove()).attr("transform",(t,s)=>`translate(${t.translateX}, ${t.translateY})`).each((t,s,i)=>{const a=e.textSizePx/2,y=-t.listRectWidth/2,x=-t.listRectHeight/2;H(i[s]).selectAll("rect").data([t]).join("rect").attr("x",a).attr("y",a).attr("width",r=>r.listRectWidth).attr("height",r=>r.listRectHeight).attr("transform",r=>`translate(${y}, ${x})`).attr("fill",r=>r.color).attr("rx",r=>r.listRectRadius),H(i[s]).selectAll("text").data([t]).join(r=>r.append("text").attr("dominant-baseline","hanging"),r=>r,r=>r.remove()).attr("x",e.textSizePx*1.5).attr("font-size",e.fullChartParams.styles.textSize).attr("fill",r=>e.fullParams.textColorType==="series"?q(r.seriesIndex,e.fullChartParams):M(e.fullParams.textColorType,e.fullChartParams)).text(r=>r.text)})})).subscribe(),()=>{o.next(void 0)}};export{ue as c};
