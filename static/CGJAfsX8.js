import{Z as m,S as g,t as i,m as n,B as f,au as y}from"./CllDRATP.js";import{c as R}from"./Bjf8oAlN.js";const l="GridLegend",b={name:l,defaultParams:f,layerIndex:y,validator:(a,{validateColumns:s})=>s(a,{placement:{toBe:'"top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end"',test:r=>["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"].includes(r)},padding:{toBeTypes:["number"]},backgroundFill:{toBeOption:"ColorType"},backgroundStroke:{toBeOption:"ColorType"},gap:{toBeTypes:["number"]},listRectWidth:{toBeTypes:["number"]},listRectHeight:{toBeTypes:["number"]},listRectRadius:{toBeTypes:["number"]},textColorType:{toBeOption:"ColorType"}})},$=m(b)(({selection:a,rootSelection:s,observer:t,subject:r})=>{const o=new g,p=t.SeriesDataMap$.pipe(i(o),n(e=>Array.from(e.keys()))),u=t.fullParams$.pipe(i(o),n(e=>{const d=[{listRectWidth:e.listRectWidth,listRectHeight:e.listRectHeight,listRectRadius:e.listRectRadius}];return{...e,seriesList:d}})),c=R(l,{rootSelection:s,seriesLabels$:p,fullParams$:u,layout$:t.layout$,fullChartParams$:t.fullChartParams$,textSizePx$:t.textSizePx$});return()=>{o.next(void 0),c()}});export{$ as G};