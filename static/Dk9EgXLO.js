import{a7 as p,S as u,a0 as i,a9 as m}from"./CllDRATP.js";import{c as y}from"./CYJ21Kf6.js";const n="SeriesTooltip",T={name:n,defaultParams:i,layerIndex:m,validator:(r,{validateColumns:o})=>o(r,{backgroundColorType:{toBeOption:"ColorType"},backgroundOpacity:{toBeTypes:["number"]},strokeColorType:{toBeOption:"ColorType"},offset:{toBe:"[number, number]",test:e=>Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"},padding:{toBeTypes:["number"]},textColorType:{toBeOption:"ColorType"},renderFn:{toBeTypes:["Function"]}})},d=p(T)(({selection:r,rootSelection:o,name:a,subject:e,observer:t})=>{const s=new u,l=y(n,{rootSelection:o,fullParams$:t.fullParams$,fullChartParams$:t.fullChartParams$,layout$:t.layout$,event$:e.event$});return()=>{s.next(void 0),l()}});export{d as S};