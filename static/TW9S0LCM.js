import{y as m,a7 as p,S as R,t as a,m as i}from"./CjdleEie.js";import{c as d}from"./CDOey7kn.js";const r="GridLegend",y=m(r,p)(({selection:$,rootSelection:c,observer:e,subject:L})=>{const s=new R,l=e.SeriesDataMap$.pipe(a(s),i(t=>Array.from(t.keys()))),n=e.fullParams$.pipe(a(s),i(t=>{const o=[{listRectWidth:t.listRectWidth,listRectHeight:t.listRectHeight,listRectRadius:t.listRectRadius}];return{...t,seriesList:o}})),u=d(r,{rootSelection:c,seriesLabels$:l,fullParams$:n,layout$:e.layout$,fullChartParams$:e.fullChartParams$});return()=>{s.next(void 0),u()}});export{y as G};