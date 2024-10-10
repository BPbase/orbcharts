import{ak as W,S as C,$ as T,O as H,t as m,s as L,m as d,h as D,o as b,p as P,R as k,al as F,i as J,am as I,an as N,ao as j,Q as X}from"./E1orKXwV.js";import{s as w,m as Y}from"./7vaEhk_3.js";import{m as _,a as M,g as V,b as O}from"./EQqw3RI0.js";import{f as U}from"./CPHUsbqB.js";var z=function(o){W(e,o);function e(s){var a=o.call(this)||this;return a._value=s,a}return Object.defineProperty(e.prototype,"value",{get:function(){return this.getValue()},enumerable:!1,configurable:!0}),e.prototype._subscribe=function(s){var a=o.prototype._subscribe.call(this,s);return!a.closed&&s.next(this._value),a},e.prototype.getValue=function(){var s=this,a=s.hasError,l=s.thrownError,u=s._value;if(a)throw l;return this._throwIfClosed(),u},e.prototype.next=function(s){o.prototype.next.call(this,this._value=s)},e}(C);const A="PieLabels",B=V(A,"text");function Q(o,e,s,a){return o.map((l,u)=>{const[r,i]=e.centroid(l),[n,h]=s.centroid(l);return{pieDatum:l,arcIndex:u,arcLabel:l.data.label,x:r*a,y:i*a,mouseoverX:n*a,mouseoverY:h*a}}).filter(l=>l.pieDatum.data.visible)}function q(o,e,s,a){let l=o.selectAll("text").data(e,n=>n.pieDatum.id),u=l.enter().append("text").classed(B,!0),r=l.exit();u.append("text");const i=l.merge(u);return i.attr("font-weight","bold").attr("text-anchor","middle").style("dominant-baseline","middle").style("cursor",n=>a.highlightTarget&&a.highlightTarget!="none"?"pointer":"none").text(n=>s.labelFn(n.pieDatum.data)).attr("font-size",a.styles.textSize).attr("fill",(n,h)=>M({datum:n.pieDatum.data,colorType:s.labelColorType,fullChartParams:a})).transition().attr("transform",n=>"translate("+n.x+","+n.y+")"),r.remove(),i}function G({labelSelection:o,ids:e,fullChartParams:s}){if(o.interrupt("highlight"),!e.length){o.transition().duration(200).attr("transform",a=>"translate("+a.x+","+a.y+")").style("opacity",1);return}o.each((a,l,u)=>{const r=L(u[l]);e.includes(a.pieDatum.id)?r.style("opacity",1).transition().duration(200).attr("transform",i=>"translate("+i.mouseoverX+","+i.mouseoverY+")"):r.style("opacity",s.styles.unhighlightedOpacity).transition().duration(200).attr("transform",i=>"translate("+i.x+","+i.y+")")})}function K(o,e){const s=new C;let a=new C,l=[];const u=e.seriesContainerPosition$.pipe(m(s),d(r=>r.width<r.height?r.width:r.height),D());return b({shorterSideWith:u,containerVisibleComputedLayoutData:e.containerVisibleComputedLayoutData$,fullParams:e.fullParams$,fullChartParams:e.fullChartParams$}).pipe(m(s),P(async r=>r)).subscribe(r=>{const i=_({axisWidth:r.shorterSideWith,innerRadius:0,outerRadius:r.fullParams.outerRadius,padAngle:0,cornerRadius:0}),n=_({axisWidth:r.shorterSideWith,innerRadius:0,outerRadius:r.fullParams.outerRadiusWhileHighlight,padAngle:0,cornerRadius:0}),h=Y({data:r.containerVisibleComputedLayoutData,startAngle:r.fullParams.startAngle,endAngle:r.fullParams.endAngle});l=Q(h,i,n,r.fullParams.labelCentroid);const f=q(e.containerSelection,l,r.fullParams,r.fullChartParams);a.next(f)}),b({labelSelection:a,highlight:e.seriesHighlight$.pipe(d(r=>r.map(i=>i.id))),fullChartParams:e.fullChartParams$}).pipe(m(s),P(async r=>r)).subscribe(r=>{G({labelSelection:r.labelSelection,ids:r.highlight,fullChartParams:r.fullChartParams})}),()=>{s.next(void 0)}}const pe=T(A,H)(({selection:o,observer:e,subject:s})=>{const a=new C,{seriesCenterSelection$:l}=w({selection:o,pluginName:A,separateSeries$:e.separateSeries$,seriesLabels$:e.seriesLabels$,seriesContainerPosition$:e.seriesContainerPosition$}),u=[];return l.pipe(m(a)).subscribe(r=>{u.forEach(i=>i()),r.each((i,n,h)=>{const f=L(h[n]),g=e.visibleComputedLayoutData$.pipe(m(a),d(t=>t[n]??t[0])),$=e.seriesContainerPosition$.pipe(m(a),d(t=>t[n]??t[0]));u[n]=K(A,{containerSelection:f,containerVisibleComputedLayoutData$:g,fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,seriesHighlight$:e.seriesHighlight$,seriesContainerPosition$:$,event$:s.event$})})}),()=>{a.next(void 0)}}),R="Rose",Z=Math.PI*2,E=0;function ee({cornerRadius:o,outerRadius:e,axisWidth:s,maxValue:a,arcScaleType:l}){const u=s/2*e,r=l==="area"?.5:1,i=N().domain([0,a]).range([0,u]).exponent(r);return n=>{const h=i(n.prevValue),f=i(n.value),g=j(h,f);return $=>{const t=g($);return O().innerRadius(0).outerRadius(t).padAngle(E).padRadius(t).cornerRadius(o)(n)}}}function te({pathSelection:o,ids:e,fullParams:s,fullChartParams:a,tweenArc:l}){if(o.interrupt("highlight"),!e.length){o.transition("highlight").style("opacity",1).attr("d",u=>l(u)(1));return}o.each((u,r,i)=>{const n=L(i[r]);e.includes(u.data.id)?n.style("opacity",1).transition("highlight").ease(I).duration(500).attr("d",h=>l({...h,startAngle:h.startAngle-s.mouseoverAngleIncrease,endAngle:h.endAngle+s.mouseoverAngleIncrease})(1)):n.style("opacity",a.styles.unhighlightedOpacity).transition("highlight").attr("d",h=>l(h)(1))})}function ae(o,e){const s=new C,a=V(o,"path");let l=[];const u=e.seriesContainerPosition$.pipe(m(s),d(t=>t.width<t.height?t.width:t.height),D()),r=b({containerVisibleComputedLayoutData:e.containerVisibleComputedLayoutData$,fullParams:e.fullParams$}).pipe(m(s),P(async t=>t),d(t=>{const c=Z/t.containerVisibleComputedLayoutData.length;return t.containerVisibleComputedLayoutData.map((p,y)=>({id:p.id,data:p,index:y,value:p.value,startAngle:c*y,endAngle:c*(y+1),padAngle:E,prevValue:l[y]&&l[y].id===p.id?l[y].value:0}))})),i=e.fullChartParams$.pipe(m(s),d(t=>t.highlightTarget),D()),n=e.visibleComputedLayoutData$.pipe(d(t=>Math.max(...t.flat().map(c=>c.value))),D()),h=b({fullParams:e.fullParams$,axisWidth:u,maxValue:n}).pipe(m(s),P(async t=>t),d(t=>ee({cornerRadius:t.fullParams.cornerRadius,outerRadius:t.fullParams.outerRadius,axisWidth:t.axisWidth,maxValue:t.maxValue,arcScaleType:t.fullParams.arcScaleType}))),f=e.fullChartParams$.pipe(m(s),d(t=>t.transitionDuration),D()),g=new z(!1),$=new F(t=>{b({pieData:r,tweenArc:h,transitionDuration:f}).pipe(m(s),P(async c=>c)).subscribe(c=>{const p=c.pieData.map((S,v)=>(S.prevValue=l[v]&&l[v].id===S.id?l[v].value:0,S));g.next(!0);const y=e.containerSelection.selectAll("path").data(p,S=>S.id).join("path").classed(a,!0).style("cursor","pointer").attr("fill",(S,v)=>S.data.color);y.interrupt("graphicMove"),y.transition("graphicMove").duration(c.transitionDuration).attrTween("d",c.tweenArc).on("end",()=>{t.next(y),g.next(!1)}),l=Object.assign([],p)})}).pipe(J(1));return b({pathSelection:$,SeriesDataMap:e.SeriesDataMap$,computedData:e.computedData$,highlightTarget:i}).pipe(m(s),P(async t=>t)).subscribe(t=>{t.pathSelection.on("mouseover",(c,p)=>{c.stopPropagation(),e.event$.next({type:"series",eventName:"mouseover",pluginName:o,highlightTarget:t.highlightTarget,datum:p.data,series:t.SeriesDataMap.get(p.data.seriesLabel),seriesIndex:p.data.seriesIndex,seriesLabel:p.data.seriesLabel,event:c,data:t.computedData})}).on("mousemove",(c,p)=>{c.stopPropagation(),e.event$.next({type:"series",eventName:"mousemove",pluginName:o,highlightTarget:t.highlightTarget,datum:p.data,series:t.SeriesDataMap.get(p.data.seriesLabel),seriesIndex:p.data.seriesIndex,seriesLabel:p.data.seriesLabel,event:c,data:t.computedData})}).on("mouseout",(c,p)=>{c.stopPropagation(),e.event$.next({type:"series",eventName:"mouseout",pluginName:o,highlightTarget:t.highlightTarget,datum:p.data,series:t.SeriesDataMap.get(p.data.seriesLabel),seriesIndex:p.data.seriesIndex,seriesLabel:p.data.seriesLabel,event:c,data:t.computedData})}).on("click",(c,p)=>{c.stopPropagation(),e.event$.next({type:"series",eventName:"click",pluginName:o,highlightTarget:t.highlightTarget,datum:p.data,series:t.SeriesDataMap.get(p.data.seriesLabel),seriesIndex:p.data.seriesIndex,seriesLabel:p.data.seriesLabel,event:c,data:t.computedData})})}),b({pathSelection:$,highlight:e.seriesHighlight$.pipe(d(t=>t.map(c=>c.id))),fullParams:e.fullParams$,fullChartParams:e.fullChartParams$,tweenArc:h,isTransitionMoving:g}).pipe(m(s),P(async t=>t),U(t=>!t.isTransitionMoving)).subscribe(t=>{te({pathSelection:t.pathSelection,ids:t.highlight,fullParams:t.fullParams,fullChartParams:t.fullChartParams,tweenArc:t.tweenArc})}),()=>{s.next(void 0)}}const me=T(R,k)(({selection:o,name:e,subject:s,observer:a})=>{const l=new C,{seriesCenterSelection$:u}=w({selection:o,pluginName:R,separateSeries$:a.separateSeries$,seriesLabels$:a.seriesLabels$,seriesContainerPosition$:a.seriesContainerPosition$}),r=[];return u.pipe(m(l)).subscribe(i=>{r.forEach(n=>n()),i.each((n,h,f)=>{const g=L(f[h]),$=a.visibleComputedLayoutData$.pipe(m(l),d(c=>JSON.parse(JSON.stringify(c[h]??c[0])))),t=a.seriesContainerPosition$.pipe(m(l),d(c=>JSON.parse(JSON.stringify(c[h]??c[0]))));r[h]=ae(R,{containerSelection:g,computedData$:a.computedData$,visibleComputedData$:a.visibleComputedData$,visibleComputedLayoutData$:a.visibleComputedLayoutData$,containerVisibleComputedLayoutData$:$,SeriesDataMap$:a.SeriesDataMap$,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,seriesHighlight$:a.seriesHighlight$,seriesContainerPosition$:t,event$:s.event$})})}),()=>{l.next(void 0),r.forEach(i=>i())}}),x="RoseLabels",ie=V(x,"text");function se({pieData:o,centroid:e,arcScaleType:s,maxValue:a,axisWidth:l,outerRadius:u}){const r=l/2*u,i=s==="area"?.5:1,n=N().domain([0,a]).range([0,r]).exponent(i);return o.map((h,f)=>{const g=n(h.value),$=O().innerRadius(0).outerRadius(g).padAngle(0).padRadius(g).cornerRadius(0),[t,c]=$.centroid(h),[p,y]=[t,c];return{pieDatum:h,arcIndex:f,arcLabel:h.data.label,x:t*e,y:c*e,mouseoverX:p*e,mouseoverY:y*e}}).filter(h=>h.pieDatum.data.visible)}function re(o,e,s,a){let l=o.selectAll("text").data(e,n=>n.pieDatum.id),u=l.enter().append("text").classed(ie,!0),r=l.exit();u.append("text");const i=l.merge(u);return i.attr("font-weight","bold").attr("text-anchor","middle").style("dominant-baseline","middle").style("cursor",n=>a.highlightTarget&&a.highlightTarget!="none"?"pointer":"none").text(n=>s.labelFn(n.pieDatum.data)).attr("font-size",a.styles.textSize).attr("fill",(n,h)=>M({datum:n.pieDatum.data,colorType:s.labelColorType,fullChartParams:a})).transition().attr("transform",n=>"translate("+n.x+","+n.y+")"),r.remove(),i}function ne({labelSelection:o,ids:e,fullChartParams:s}){if(o.interrupt("highlight"),!e.length){o.transition().duration(200).attr("transform",a=>"translate("+a.x+","+a.y+")").style("opacity",1);return}o.each((a,l,u)=>{const r=L(u[l]);e.includes(a.pieDatum.data.id)?r.style("opacity",1).transition().duration(200).attr("transform",i=>"translate("+i.mouseoverX+","+i.mouseoverY+")"):r.style("opacity",s.styles.unhighlightedOpacity).transition().duration(200).attr("transform",i=>"translate("+i.x+","+i.y+")")})}function le(o,e){const s=new C;let a=new C,l=[];const u=e.seriesContainerPosition$.pipe(m(s),d(i=>i.width<i.height?i.width:i.height),D()),r=e.visibleComputedLayoutData$.pipe(d(i=>Math.max(...i.flat().map(n=>n.value))),D());return b({shorterSideWith:u,containerVisibleComputedLayoutData:e.containerVisibleComputedLayoutData$,maxValue:r,fullParams:e.fullParams$,fullChartParams:e.fullChartParams$}).pipe(m(s),P(async i=>i)).subscribe(i=>{const n=Math.PI*2/i.containerVisibleComputedLayoutData.length,h=i.containerVisibleComputedLayoutData.map((g,$)=>({id:g.id,data:g,index:$,value:g.value,startAngle:n*$,endAngle:n*($+1),padAngle:0}));l=se({pieData:h,centroid:i.fullParams.labelCentroid,arcScaleType:i.fullParams.arcScaleType,maxValue:i.maxValue,axisWidth:i.shorterSideWith,outerRadius:i.fullParams.outerRadius});const f=re(e.containerSelection,l,i.fullParams,i.fullChartParams);a.next(f)}),b({labelSelection:a,highlight:e.seriesHighlight$.pipe(d(i=>i.map(n=>n.id))),fullChartParams:e.fullChartParams$}).pipe(m(s),P(async i=>i)).subscribe(i=>{ne({labelSelection:i.labelSelection,ids:i.highlight,fullChartParams:i.fullChartParams})}),()=>{s.next(void 0)}}const ge=T(x,X)(({selection:o,observer:e,subject:s})=>{const a=new C,{seriesCenterSelection$:l}=w({selection:o,pluginName:x,separateSeries$:e.separateSeries$,seriesLabels$:e.seriesLabels$,seriesContainerPosition$:e.seriesContainerPosition$}),u=[];return l.pipe(m(a)).subscribe(r=>{u.forEach(i=>i()),r.each((i,n,h)=>{const f=L(h[n]),g=e.visibleComputedLayoutData$.pipe(m(a),d(t=>JSON.parse(JSON.stringify(t[n]??t[0])))),$=e.seriesContainerPosition$.pipe(m(a),d(t=>JSON.parse(JSON.stringify(t[n]??t[0]))));u[n]=le(x,{containerSelection:f,visibleComputedLayoutData$:e.visibleComputedLayoutData$,containerVisibleComputedLayoutData$:g,fullParams$:e.fullParams$,fullChartParams$:e.fullChartParams$,seriesHighlight$:e.seriesHighlight$,seriesContainerPosition$:$,event$:s.event$})})}),()=>{a.next(void 0)}});export{pe as P,me as R,ge as a};
