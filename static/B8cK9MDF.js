import{S as P,O as S,e as D,t as g,s as x,m as p,x as C,c as b}from"./Bt7wG3zu.js";import{k as v,m as L}from"./BZcsYITz.js";import{c as O}from"./CD7KWqPx.js";import{g as T}from"./vANVmeqg.js";import{o as F}from"./uoaLhK_V.js";function h(u,d,m,a){const{gap:o,rowAmount:e,columnAmount:i}=d,c=(u.width-o*(i-1))/i,l=(u.height-o*(e-1))/e,n=a*c+a*o,r=m*l+m*o,t=[n,r],s=[c/u.width,l/u.height];return{translate:t,scale:s}}const w=({fullDataFormatter$:u,layout$:d})=>{const m=new P;function a({xAxis:o,yAxis:e,width:i,height:c}){if(!o||!e)return{translate:[0,0],scale:[1,1],rotate:0,rotateX:0,rotateY:0,value:""};let l=0,n=0,r=0,t=0,s=0;return o.position==="bottom"?e.position==="left"?(t=180,n=c):e.position==="right"?(t=180,s=180,l=i,n=c):(t=180,n=c):o.position==="top"?e.position==="left"||(e.position==="right"?(s=180,l=i):(t=180,n=c)):o.position==="left"?e.position==="bottom"?(r=-90,n=c):e.position==="top"?(r=-90,s=180):(t=180,n=c):o.position==="right"&&(e.position==="bottom"?(r=-90,t=180,n=c,l=i):e.position==="top"?(r=-90,t=180,s=180,l=i):(t=180,n=c)),{translate:[l,n],scale:[1,1],rotate:r,rotateX:t,rotateY:s,value:`translate(${l}px, ${n}px) rotate(${r}deg) rotateX(${t}deg) rotateY(${s}deg)`}}return new S(o=>(D({fullDataFormatter:u,layout:d}).pipe(g(m),x(async e=>e)).subscribe(e=>{const i=a({xAxis:e.fullDataFormatter.grid.groupAxis,yAxis:e.fullDataFormatter.grid.valueAxis,width:e.layout.width,height:e.layout.height});o.next(i)}),function(){m.next(void 0)}))},X=({gridAxesTransform$:u})=>u.pipe(p(d=>{const m=[0,0],a=[1/d.scale[0],1/d.scale[1]],o=d.rotate*-1,e=d.rotateX*-1,i=d.rotateY*-1;return{translate:m,scale:a,rotate:o,rotateX:e,rotateY:i,value:`translate(${m[0]}px, ${m[1]}px) rotate(${o}deg) rotateX(${e}deg) rotateY(${i}deg)`}})),Y=({computedData$:u,fullDataFormatter$:d,fullChartParams$:m,layout$:a})=>D({computedData:u,fullDataFormatter:d,fullChartParams:m,layout:a}).pipe(x(async e=>e),p(e=>{const i=e.fullDataFormatter.grid;if(!!(i.seriesSlotIndexes&&i.seriesSlotIndexes.length===e.computedData.length))return e.computedData.map((l,n)=>{const r=i.seriesSlotIndexes[n]%e.fullDataFormatter.container.columnAmount,t=Math.floor(i.seriesSlotIndexes[n]/e.fullDataFormatter.container.columnAmount),{translate:s,scale:f}=h(e.layout,e.fullDataFormatter.container,t,r);return{slotIndex:i.seriesSlotIndexes[n],rowIndex:t,columnIndex:r,translate:s,scale:f}});{const l=i.slotIndex%e.fullDataFormatter.container.columnAmount,n=Math.floor(i.slotIndex/e.fullDataFormatter.container.columnAmount);return e.computedData.map((r,t)=>{const{translate:s,scale:f}=h(e.layout,e.fullDataFormatter.container,n,l);return{slotIndex:i.slotIndex,rowIndex:n,columnIndex:l,translate:s,scale:f}})}})),A="OverlappingValueAxes",G=T(A,"grid"),M=C(A,v)(({selection:u,name:d,subject:m,observer:a})=>{const o=new P,e=[],i=a.fullParams$.pipe(g(o),p(r=>r.gridIndexes[0])),c=a.fullParams$.pipe(g(o),p(r=>r.gridIndexes[1])),l=D({firstGridIndex:i,secondGridIndex:c}).pipe(g(o),x(r=>a.fullDataFormatter$.pipe(g(o),p(t=>{t.gridList[r.secondGridIndex]||(t.gridList[r.secondGridIndex]=Object.assign({},t.gridList[r.firstGridIndex]));let s="";return t.gridList[r.firstGridIndex].valueAxis.position==="left"?s="right":t.gridList[r.firstGridIndex].valueAxis.position==="bottom"?s="top":t.gridList[r.firstGridIndex].valueAxis.position==="top"?s="bottom":t.gridList[r.firstGridIndex].valueAxis.position==="right"&&(s="left"),{type:"grid",grid:{...t.gridList[r.secondGridIndex],valueAxis:{...t.gridList[r.secondGridIndex].valueAxis,position:s}},container:{...t.container}}}))));return F(a).pipe(g(o),p(r=>({...r,fullParams$:r.fullParams$.pipe(p(t=>(t.gridIndexes.length>2&&(t.gridIndexes.length=2),t)))})),x(r=>L(r)),p(r=>r.map((t,s)=>{if(s===0)return t;const f=w({fullDataFormatter$:l,layout$:a.layout$}),I=X({gridAxesTransform$:f}),$=Y({computedData$:t.gridComputedData$,fullDataFormatter$:l,fullChartParams$:a.fullChartParams$,layout$:a.layout$});return{...t,gridAxesTransform$:f,gridAxesReverseTransform$:I,gridContainer$:$}}))).subscribe(r=>{e.forEach(t=>t()),u.selectAll(`g.${G}`).data(r).join("g").attr("class",G).each((t,s,f)=>{if(s>1)return;const I=b(f[s]);e[s]=O(A,{selection:I,computedData$:t.gridComputedData$,fullParams$:a.fullParams$.pipe(p($=>s===0?$.firstAxis:$.secondAxis)),fullDataFormatter$:t.gridDataFormatter$,fullChartParams$:a.fullChartParams$,gridAxesTransform$:t.gridAxesTransform$,gridAxesReverseTransform$:t.gridAxesReverseTransform$,gridAxesSize$:t.gridAxesSize$,gridContainer$:t.gridContainer$,isSeriesPositionSeprate$:t.isSeriesPositionSeprate$})})}),()=>{o.next(void 0),e.forEach(r=>r())}});export{M as O};
