import{u as x}from"./BsUuXjCq.js";import{s as g}from"./CNtq7mfH.js";import"./BDGWi0VX.js";import{f as b,M as L,d as $,a as w,b as f,c as h,e as A}from"./IH3zweuV.js";import{O as I}from"./DpI8gaMM.js";import G from"./lpif6x3Y.js";import{e as v,f as D,g as M,o as F,c as T}from"./DFjCSVOO.js";import"./DxfMbjbg.js";import"./CQwdZll9.js";import"./Fzqo4Hg3.js";import"./DYZKcGZL.js";import"./CDy86HuF.js";import"./BBWxnvZZ.js";import"./DQbUVo-6.js";import"./D5hn8ZkN.js";import"./sGy0DaUD.js";import"./D9cSc4y_.js";const _={id:"chart",style:{width:"100%",height:"100%"}},N=v({__name:"index",setup(P){x({title:"Demo 2"});let m;return D(()=>{const u=document.querySelector("#chart"),e=new b(u,{}),s=new L,n=new $,o=new w,i=new f,t=new h,a=new A,d=new I;e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:1},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"]},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}]}),t.params$.next({gridIndexes:[0,1]}),a.params$.next({gridIndexes:[0,1]});let r=0,l=0;const c=8,p=1;m=g(()=>{r==0?(e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:2},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"]},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1]}),a.params$.next({gridIndexes:[0,1]})):r==1?(e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1]}),a.params$.next({gridIndexes:[0,1]})):r==2?(e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:2,columnAmount:2},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0}]}),t.params$.next({gridIndexes:[0,1]}),a.params$.next({gridIndexes:[0,1]})):r==3?(e.chartParams$.next({padding:{bottom:120},highlightTarget:"series"}),e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:2,columnAmount:1},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"]},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]})):r==4?(e.plugins$.next([t,a,s,n,o,i]),e.dataFormatter$.next({container:{rowAmount:2,columnAmount:3},gridList:[{seriesDirection:"column",rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0},{seriesDirection:"column",rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]})):r==5?(e.chartParams$.next({padding:{left:60,bottom:120}}),e.dataFormatter$.next({container:{rowAmount:2,columnAmount:3,gap:120},gridList:[{seriesDirection:"column",rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],separateSeries:!0,groupAxis:{position:"left"},valueAxis:{position:"bottom"}},{seriesDirection:"column",rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"],groupAxis:{position:"left"},valueAxis:{position:"bottom"}}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]})):r==6?(e.plugins$.next([t,a,s,n,o,i]),e.chartParams$.next({padding:{left:60,bottom:120}}),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:2},gridList:[{seriesDirection:"column",rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],groupAxis:{position:"left"},valueAxis:{position:"bottom"}},{seriesDirection:"column",rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]})):r==7?(e.plugins$.next([t,a,s,n,o,i]),e.chartParams$.next({padding:{left:60,bottom:120}}),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:2},gridList:[{seriesDirection:"column",rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"],groupAxis:{position:"left"},valueAxis:{position:"bottom"}},{seriesDirection:"column",rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!0}),t.params$.next({gridIndexes:[0,1],tickTextRotate:0}),a.params$.next({gridIndexes:[0,1]}),l==0?(s.params$.next({barRadius:!0}),n.params$.next({lineCurve:"curveMonotoneX"})):l==1&&(s.params$.next({}),n.params$.next({})),l++,l>p&&(l=0)):r==8&&(e.plugins$.next([t,d,s,n,o,i]),e.chartParams$.next({padding:{left:60,bottom:120}}),e.dataFormatter$.next({container:{rowAmount:1,columnAmount:1},gridList:[{rowLabels:["收入","支出"],columnLabels:["1月","2月","3月","4月","5月"]},{rowLabels:["午餐來客數","晚餐來客數"],columnLabels:["1月","2月","3月","4月","5月"]}],separateGrid:!1}),t.params$.next({gridIndexes:[0]})),r++,r>c&&(r=0)},2e3),e.data$.next(G)}),M(()=>{clearInterval(m)}),(u,e)=>(F(),T("div",_))}});export{N as default};
