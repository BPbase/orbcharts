import"./CUAujy1K.js";import{f as p,M as g,d as b,a as L,b as $,c as w,e as h}from"./ds9AdYnp.js";import{P as f,O as A}from"./BJPczetJ.js";import"./Bzswc46l.js";import I from"./lpif6x3Y.js";import{u as G}from"./CuxIfkvC.js";import{s as v}from"./BpPETan4.js";import{e as D,f as M,i as _,o as T,c as P}from"./qsxkcN87.js";import"./CvNJ1Mhf.js";import"./Ctxu_kSH.js";import"./BV53Rsjo.js";import"./CiHcmOf_.js";import"./CX-pyEAo.js";import"./DXMUCJyL.js";const F={id:"chart",style:{width:"100%",height:"100vh"}},J=D({__name:"index.client",setup(R){G({title:"Demo 2"});let m;return M(()=>{const u=document.querySelector("#chart"),e=new p(u,{preset:f}),s=new g,n=new b,o=new L,i=new $,t=new w,a=new h,d=new A;e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:1},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"]},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}]}),t.params$.next({gridIndexes:[0,1]}),a.params$.next({gridIndexes:[0,1]});let r=0,l=0;const c=8,x=1;m=v(()=>{r==0?(e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:2},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"]},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1]}),a.params$.next({gridIndexes:[0,1]})):r==1?(e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1]}),a.params$.next({gridIndexes:[0,1]})):r==2?(e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:2,columnAmount:2},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0}]}),t.params$.next({gridIndexes:[0,1]}),a.params$.next({gridIndexes:[0,1]})):r==3?(e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:2,columnAmount:1},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"]},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]})):r==4?(e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:2,columnAmount:3},gridList:[{seriesDirection:"column",rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0},{seriesDirection:"column",rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]})):r==5?(e.chartParams$.next({padding:{left:60,bottom:120}}),e.dataFormatter$.next({container:{rowAmount:2,columnAmount:3},gridList:[{seriesDirection:"column",rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0,groupAxis:{position:"left"},valueAxis:{position:"bottom"}},{seriesDirection:"column",rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"],groupAxis:{position:"left"},valueAxis:{position:"bottom"}}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]})):r==6?(e.plugins$.next([t,a,s,n,o,i]),e.chartParams$.next({padding:{left:60,bottom:120}}),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:2},gridList:[{seriesDirection:"column",rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],groupAxis:{position:"left"},valueAxis:{position:"bottom"}},{seriesDirection:"column",rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]})):r==7?(e.plugins$.next([t,a,s,n,o,i]),e.chartParams$.next({padding:{left:60,bottom:120}}),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:2},gridList:[{seriesDirection:"column",rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],groupAxis:{position:"left"},valueAxis:{position:"bottom"}},{seriesDirection:"column",rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]}),l==0?(s.params$.next({barRadius:!0}),n.params$.next({lineCurve:"curveMonotoneX"})):l==1&&(s.params$.next({}),n.params$.next({})),l++,l>x&&(l=0)):r==8&&(e.plugins$.next([t,d,s,n,o,i]),e.chartParams$.next({padding:{left:60,bottom:120}}),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:1},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"]},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!1}),t.params$.next({gridIndexes:[0]})),r++,r>c&&(r=0)},2e3),e.data$.next(I)}),_(()=>{clearInterval(m)}),(u,e)=>(T(),P("div",F))}});export{J as default};
