import{Z as i,S as s,H as T,l,a4 as c,E as $,a9 as d}from"./CeSasmr-.js";import{a as f,c as A}from"./DHf1X0Vq.js";import{c as x}from"./BPJf5JbP.js";const p="GroupAxis",B={name:p,defaultParams:T,layerIndex:l,validator:(o,{validateColumns:r})=>r(o,{labelOffset:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBe:'number | null | "all"',test:t=>t===null||t==="all"||typeof t=="number"},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}})},k=i(B)(({selection:o,name:r,observer:e,subject:t})=>{const a=new s,n=f(p,{selection:o,computedData$:e.computedData$,fullParams$:e.fullParams$,fullDataFormatter$:e.fullDataFormatter$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:e.gridAxesTransform$,gridAxesReverseTransform$:e.gridAxesReverseTransform$,gridAxesSize$:e.gridAxesSize$,gridContainerPosition$:e.gridContainerPosition$,isSeriesSeprate$:e.isSeriesSeprate$,textSizePx$:e.textSizePx$});return()=>{a.next(void 0),n()}}),u="ValueAxis",g={name:u,defaultParams:c,layerIndex:l,validator:(o,{validateColumns:r})=>r(o,{labelOffset:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"},labelColorType:{toBeOption:"ColorType"},axisLineVisible:{toBeTypes:["boolean"]},axisLineColorType:{toBeOption:"ColorType"},ticks:{toBeTypes:["number","null"]},tickFormat:{toBeTypes:["string","Function"]},tickLineVisible:{toBeTypes:["boolean"]},tickPadding:{toBeTypes:["number"]},tickFullLine:{toBeTypes:["boolean"]},tickFullLineDasharray:{toBeTypes:["string"]},tickColorType:{toBeOption:"ColorType"},tickTextRotate:{toBeTypes:["number"]},tickTextColorType:{toBeOption:"ColorType"}})},O=i(g)(({selection:o,name:r,observer:e,subject:t})=>{const a=new s,n=A(u,{selection:o,computedData$:e.computedData$,fullParams$:e.fullParams$,fullDataFormatter$:e.fullDataFormatter$,fullChartParams$:e.fullChartParams$,gridAxesTransform$:e.gridAxesTransform$,gridAxesReverseTransform$:e.gridAxesReverseTransform$,gridAxesSize$:e.gridAxesSize$,gridContainerPosition$:e.gridContainerPosition$,isSeriesSeprate$:e.isSeriesSeprate$});return()=>{a.next(void 0),n()}}),m="GridTooltip",C={name:m,defaultParams:$,layerIndex:d,validator:(o,{validateColumns:r})=>r(o,{backgroundColorType:{toBeOption:"ColorType"},backgroundOpacity:{toBeTypes:["number"]},strokeColorType:{toBeOption:"ColorType"},offset:{toBe:"[number, number]",test:t=>Array.isArray(t)&&t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"},padding:{toBeTypes:["number"]},textColorType:{toBeOption:"ColorType"},renderFn:{toBeTypes:["Function"]}})},F=i(C)(({selection:o,rootSelection:r,name:e,subject:t,observer:a})=>{const n=new s,y=x(m,{rootSelection:r,fullParams$:a.fullParams$,fullChartParams$:a.fullChartParams$,layout$:a.layout$,event$:t.event$});return()=>{n.next(void 0),y()}});export{F as G,O as V,k as a};
