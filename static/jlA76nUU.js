import{aR as Pe,aS as te,aT as me,aU as ge,aV as Ce,aW as O,a9 as V,aa as R,a7 as I,a5 as ie,aX as se,ad as ue,ae as ke,aY as pe,ah as de,aZ as Ge,g as Ie,aj as Te,a_ as Ne,c as Re,al as Ee,a$ as Oe,b0 as Xe,b1 as Ye,b2 as je,aP as Ve,at as le,b3 as N,m as M,f as X,o as w,p as A,e as J,s as ee,S as ze,d as We,b4 as Se}from"./BmSCDJil.js";import{g as ne}from"./DQaJP6Gt.js";import{m as Ue,a as He}from"./BRZTqlJD.js";function q(e,n){return e==null||n==null?NaN:e<n?-1:e>n?1:e>=n?0:NaN}function qe(e,n){return e==null||n==null?NaN:n<e?-1:n>e?1:n>=e?0:NaN}function we(e){let n,r,t;e.length!==2?(n=q,r=(u,l)=>q(e(u),l),t=(u,l)=>e(u)-l):(n=e===q||e===qe?e:Je,r=e,t=e);function o(u,l,s=0,g=u.length){if(s<g){if(n(l,l)!==0)return g;do{const m=s+g>>>1;r(u[m],l)<0?s=m+1:g=m}while(s<g)}return s}function a(u,l,s=0,g=u.length){if(s<g){if(n(l,l)!==0)return g;do{const m=s+g>>>1;r(u[m],l)<=0?s=m+1:g=m}while(s<g)}return s}function i(u,l,s=0,g=u.length){const m=o(u,l,s,g-1);return m>s&&t(u[m-1],l)>-t(u[m],l)?m-1:m}return{left:o,center:i,right:a}}function Je(){return 0}function Ze(e){return e===null?NaN:+e}const Be=we(q),_e=Be.right;we(Ze).center;const Qe=Math.sqrt(50),Ke=Math.sqrt(10),en=Math.sqrt(2);function Z(e,n,r){const t=(n-e)/Math.max(0,r),o=Math.floor(Math.log10(t)),a=t/Math.pow(10,o),i=a>=Qe?10:a>=Ke?5:a>=en?2:1;let u,l,s;return o<0?(s=Math.pow(10,-o)/i,u=Math.round(e*s),l=Math.round(n*s),u/s<e&&++u,l/s>n&&--l,s=-s):(s=Math.pow(10,o)*i,u=Math.round(e/s),l=Math.round(n/s),u*s<e&&++u,l*s>n&&--l),l<u&&.5<=r&&r<2?Z(e,n,r*2):[u,l,s]}function nn(e,n,r){if(n=+n,e=+e,r=+r,!(r>0))return[];if(e===n)return[e];const t=n<e,[o,a,i]=t?Z(n,e,r):Z(e,n,r);if(!(a>=o))return[];const u=a-o+1,l=new Array(u);if(t)if(i<0)for(let s=0;s<u;++s)l[s]=(a-s)/-i;else for(let s=0;s<u;++s)l[s]=(a-s)*i;else if(i<0)for(let s=0;s<u;++s)l[s]=(o+s)/-i;else for(let s=0;s<u;++s)l[s]=(o+s)*i;return l}function re(e,n,r){return n=+n,e=+e,r=+r,Z(e,n,r)[2]}function tn(e,n,r){n=+n,e=+e,r=+r;const t=n<e,o=t?re(n,e,r):re(e,n,r);return(t?-1:1)*(o<0?1/-o:o)}function rn(e,n){n||(n=[]);var r=e?Math.min(n.length,e.length):0,t=n.slice(),o;return function(a){for(o=0;o<r;++o)t[o]=e[o]*(1-a)+n[o]*a;return t}}function an(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function on(e,n){var r=n?n.length:0,t=e?Math.min(r,e.length):0,o=new Array(t),a=new Array(r),i;for(i=0;i<t;++i)o[i]=ce(e[i],n[i]);for(;i<r;++i)a[i]=n[i];return function(u){for(i=0;i<t;++i)a[i]=o[i](u);return a}}function sn(e,n){var r=new Date;return e=+e,n=+n,function(t){return r.setTime(e*(1-t)+n*t),r}}function un(e,n){var r={},t={},o;(e===null||typeof e!="object")&&(e={}),(n===null||typeof n!="object")&&(n={});for(o in n)o in e?r[o]=ce(e[o],n[o]):t[o]=n[o];return function(a){for(o in r)t[o]=r[o](a);return t}}function ce(e,n){var r=typeof n,t;return n==null||r==="boolean"?Pe(n):(r==="number"?te:r==="string"?(t=me(n))?(n=t,ge):Ce:n instanceof me?ge:n instanceof Date?sn:an(n)?rn:Array.isArray(n)?on:typeof n.valueOf!="function"&&typeof n.toString!="function"||isNaN(n)?un:te)(e,n)}function ln(e,n){return e=+e,n=+n,function(r){return Math.round(e*(1-r)+n*r)}}function cn(e){return Math.abs(e=Math.round(e))>=1e21?e.toLocaleString("en").replace(/,/g,""):e.toString(10)}function B(e,n){if((r=(e=n?e.toExponential(n-1):e.toExponential()).indexOf("e"))<0)return null;var r,t=e.slice(0,r);return[t.length>1?t[0]+t.slice(2):t,+e.slice(r+1)]}function j(e){return e=B(Math.abs(e)),e?e[1]:NaN}function fn(e,n){return function(r,t){for(var o=r.length,a=[],i=0,u=e[0],l=0;o>0&&u>0&&(l+u+1>t&&(u=Math.max(1,t-l)),a.push(r.substring(o-=u,o+u)),!((l+=u+1)>t));)u=e[i=(i+1)%e.length];return a.reverse().join(n)}}function mn(e){return function(n){return n.replace(/[0-9]/g,function(r){return e[+r]})}}var gn=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function _(e){if(!(n=gn.exec(e)))throw new Error("invalid format: "+e);var n;return new fe({fill:n[1],align:n[2],sign:n[3],symbol:n[4],zero:n[5],width:n[6],comma:n[7],precision:n[8]&&n[8].slice(1),trim:n[9],type:n[10]})}_.prototype=fe.prototype;function fe(e){this.fill=e.fill===void 0?" ":e.fill+"",this.align=e.align===void 0?">":e.align+"",this.sign=e.sign===void 0?"-":e.sign+"",this.symbol=e.symbol===void 0?"":e.symbol+"",this.zero=!!e.zero,this.width=e.width===void 0?void 0:+e.width,this.comma=!!e.comma,this.precision=e.precision===void 0?void 0:+e.precision,this.trim=!!e.trim,this.type=e.type===void 0?"":e.type+""}fe.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(this.width===void 0?"":Math.max(1,this.width|0))+(this.comma?",":"")+(this.precision===void 0?"":"."+Math.max(0,this.precision|0))+(this.trim?"~":"")+this.type};function pn(e){e:for(var n=e.length,r=1,t=-1,o;r<n;++r)switch(e[r]){case".":t=o=r;break;case"0":t===0&&(t=r),o=r;break;default:if(!+e[r])break e;t>0&&(t=0);break}return t>0?e.slice(0,t)+e.slice(o+1):e}var Ae;function dn(e,n){var r=B(e,n);if(!r)return e+"";var t=r[0],o=r[1],a=o-(Ae=Math.max(-8,Math.min(8,Math.floor(o/3)))*3)+1,i=t.length;return a===i?t:a>i?t+new Array(a-i+1).join("0"):a>0?t.slice(0,a)+"."+t.slice(a):"0."+new Array(1-a).join("0")+B(e,Math.max(0,n+a-1))[0]}function he(e,n){var r=B(e,n);if(!r)return e+"";var t=r[0],o=r[1];return o<0?"0."+new Array(-o).join("0")+t:t.length>o+1?t.slice(0,o+1)+"."+t.slice(o+1):t+new Array(o-t.length+2).join("0")}const xe={"%":(e,n)=>(e*100).toFixed(n),b:e=>Math.round(e).toString(2),c:e=>e+"",d:cn,e:(e,n)=>e.toExponential(n),f:(e,n)=>e.toFixed(n),g:(e,n)=>e.toPrecision(n),o:e=>Math.round(e).toString(8),p:(e,n)=>he(e*100,n),r:he,s:dn,X:e=>Math.round(e).toString(16).toUpperCase(),x:e=>Math.round(e).toString(16)};function be(e){return e}var ye=Array.prototype.map,De=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function hn(e){var n=e.grouping===void 0||e.thousands===void 0?be:fn(ye.call(e.grouping,Number),e.thousands+""),r=e.currency===void 0?"":e.currency[0]+"",t=e.currency===void 0?"":e.currency[1]+"",o=e.decimal===void 0?".":e.decimal+"",a=e.numerals===void 0?be:mn(ye.call(e.numerals,String)),i=e.percent===void 0?"%":e.percent+"",u=e.minus===void 0?"−":e.minus+"",l=e.nan===void 0?"NaN":e.nan+"";function s(m){m=_(m);var f=m.fill,d=m.align,p=m.sign,b=m.symbol,y=m.zero,S=m.width,c=m.comma,x=m.precision,D=m.trim,v=m.type;v==="n"?(c=!0,v="g"):xe[v]||(x===void 0&&(x=12),D=!0,v="g"),(y||f==="0"&&d==="=")&&(y=!0,f="0",d="=");var $=b==="$"?r:b==="#"&&/[boxX]/.test(v)?"0"+v.toLowerCase():"",L=b==="$"?t:/[%p]/.test(v)?i:"",z=xe[v],W=/[defgprs%]/.test(v);x=x===void 0?6:/[gprs]/.test(v)?Math.max(1,Math.min(21,x)):Math.max(0,Math.min(20,x));function P(h){var C=$,F=L,k,K,E;if(v==="c")F=z(h)+F,h="";else{h=+h;var T=h<0||1/h<0;if(h=isNaN(h)?l:z(Math.abs(h),x),D&&(h=pn(h)),T&&+h==0&&p!=="+"&&(T=!1),C=(T?p==="("?p:u:p==="-"||p==="("?"":p)+C,F=(v==="s"?De[8+Ae/3]:"")+F+(T&&p==="("?")":""),W){for(k=-1,K=h.length;++k<K;)if(E=h.charCodeAt(k),48>E||E>57){F=(E===46?o+h.slice(k+1):h.slice(k))+F,h=h.slice(0,k);break}}}c&&!y&&(h=n(h,1/0));var U=C.length+h.length+F.length,G=U<S?new Array(S-U+1).join(f):"";switch(c&&y&&(h=n(G+h,G.length?S-F.length:1/0),G=""),d){case"<":h=C+h+F+G;break;case"=":h=C+G+h+F;break;case"^":h=G.slice(0,U=G.length>>1)+C+h+F+G.slice(U);break;default:h=G+C+h+F;break}return a(h)}return P.toString=function(){return m+""},P}function g(m,f){var d=s((m=_(m),m.type="f",m)),p=Math.max(-8,Math.min(8,Math.floor(j(f)/3)))*3,b=Math.pow(10,-p),y=De[8+p/3];return function(S){return d(b*S)+y}}return{format:s,formatPrefix:g}}var H,Le,Fe;xn({thousands:",",grouping:[3],currency:["$",""]});function xn(e){return H=hn(e),Le=H.format,Fe=H.formatPrefix,H}function bn(e){return Math.max(0,-j(Math.abs(e)))}function yn(e,n){return Math.max(0,Math.max(-8,Math.min(8,Math.floor(j(n)/3)))*3-j(Math.abs(e)))}function Dn(e,n){return e=Math.abs(e),n=Math.abs(n)-e,Math.max(0,j(n)-j(e))+1}function vn(e,n){switch(arguments.length){case 0:break;case 1:this.range(e);break;default:this.range(n).domain(e);break}return this}function Mn(e){return function(){return e}}function Sn(e){return+e}var ve=[0,1];function Y(e){return e}function ae(e,n){return(n-=e=+e)?function(r){return(r-e)/n}:Mn(isNaN(n)?NaN:.5)}function wn(e,n){var r;return e>n&&(r=e,e=n,n=r),function(t){return Math.max(e,Math.min(n,t))}}function An(e,n,r){var t=e[0],o=e[1],a=n[0],i=n[1];return o<t?(t=ae(o,t),a=r(i,a)):(t=ae(t,o),a=r(a,i)),function(u){return a(t(u))}}function Ln(e,n,r){var t=Math.min(e.length,n.length)-1,o=new Array(t),a=new Array(t),i=-1;for(e[t]<e[0]&&(e=e.slice().reverse(),n=n.slice().reverse());++i<t;)o[i]=ae(e[i],e[i+1]),a[i]=r(n[i],n[i+1]);return function(u){var l=_e(e,u,1,t)-1;return a[l](o[l](u))}}function Fn(e,n){return n.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown())}function $n(){var e=ve,n=ve,r=ce,t,o,a,i=Y,u,l,s;function g(){var f=Math.min(e.length,n.length);return i!==Y&&(i=wn(e[0],e[f-1])),u=f>2?Ln:An,l=s=null,m}function m(f){return f==null||isNaN(f=+f)?a:(l||(l=u(e.map(t),n,r)))(t(i(f)))}return m.invert=function(f){return i(o((s||(s=u(n,e.map(t),te)))(f)))},m.domain=function(f){return arguments.length?(e=Array.from(f,Sn),g()):e.slice()},m.range=function(f){return arguments.length?(n=Array.from(f),g()):n.slice()},m.rangeRound=function(f){return n=Array.from(f),r=ln,g()},m.clamp=function(f){return arguments.length?(i=f?!0:Y,g()):i!==Y},m.interpolate=function(f){return arguments.length?(r=f,g()):r},m.unknown=function(f){return arguments.length?(a=f,m):a},function(f,d){return t=f,o=d,g()}}function Pn(){return $n()(Y,Y)}function Cn(e,n,r,t){var o=tn(e,n,r),a;switch(t=_(t??",f"),t.type){case"s":{var i=Math.max(Math.abs(e),Math.abs(n));return t.precision==null&&!isNaN(a=yn(o,i))&&(t.precision=a),Fe(t,i)}case"":case"e":case"g":case"p":case"r":{t.precision==null&&!isNaN(a=Dn(o,Math.max(Math.abs(e),Math.abs(n))))&&(t.precision=a-(t.type==="e"));break}case"f":case"%":{t.precision==null&&!isNaN(a=bn(o))&&(t.precision=a-(t.type==="%")*2);break}}return Le(t)}function kn(e){var n=e.domain;return e.ticks=function(r){var t=n();return nn(t[0],t[t.length-1],r??10)},e.tickFormat=function(r,t){var o=n();return Cn(o[0],o[o.length-1],r??10,t)},e.nice=function(r){r==null&&(r=10);var t=n(),o=0,a=t.length-1,i=t[o],u=t[a],l,s,g=10;for(u<i&&(s=i,i=u,u=s,s=o,o=a,a=s);g-- >0;){if(s=re(i,u,r),s===l)return t[o]=i,t[a]=u,n(t);if(s>0)i=Math.floor(i/s)*s,u=Math.ceil(u/s)*s;else if(s<0)i=Math.ceil(i*s)/s,u=Math.floor(u*s)/s;else break;l=s}return e},e}function $e(){var e=Pn();return e.copy=function(){return Fn(e,$e())},vn.apply(e,arguments),kn(e)}const Q=({maxValue:e=1,minValue:n=0,axisWidth:r,scaleDomain:t=O.scaleDomain,scaleRange:o=O.scaleRange})=>{const a=t[0]??O.scaleDomain[0],i=t[1]??O.scaleDomain[1],u=o[0]??O.scaleRange[0],l=o[1]??O.scaleRange[1];let s=a==="auto"?n<0?n:0:a==="min"?n:a,g=i==="auto"?e>=0?e:0:i==="max"?e:i;const m=e-(e-s)/(1-u),f=g/l;return $e().domain([m,f]).range([0,r])},zn=({computedData$:e,fullDataFormatter$:n,layout$:r})=>{function t(a,i,u){const l=i.grid.groupAxis.position==="top"||i.grid.groupAxis.position==="bottom"?u.width:u.height,s=a[0]?a[0].length-1:0;return Q({maxValue:s,minValue:0,axisWidth:l,scaleDomain:[0,s],scaleRange:[0,1]})}function o(a,i,u){const l=i.grid.valueAxis.position==="left"||i.grid.valueAxis.position==="right"?u.height:u.width,s=a.flat(),[g,m]=Ie(s);return Q({maxValue:m,minValue:g,axisWidth:l,scaleDomain:[g,m],scaleRange:[0,1]})}return V({computedData:e,fullDataFormatter:n,layout:r}).pipe(R(async a=>a),I(a=>{const i=t(a.computedData,a.fullDataFormatter,a.layout),u=o(a.computedData,a.fullDataFormatter,a.layout),l=u(0);return a.computedData.map((s,g)=>s.map((m,f)=>{const d=i(f),p=u(m.value??0);return{...m,axisX:d,axisY:p,axisYFromZero:p-l}}))}))},Wn=({fullDataFormatter$:e,layout$:n})=>{const r=new ie;function t({xAxis:o,yAxis:a,width:i,height:u}){if(!o||!a)return{translate:[0,0],scale:[1,1],rotate:0,rotateX:0,rotateY:0,value:""};let l=0,s=0,g=0,m=0,f=0;return o.position==="bottom"?a.position==="left"?(m=180,s=u):a.position==="right"?(m=180,f=180,l=i,s=u):(m=180,s=u):o.position==="top"?a.position==="left"||(a.position==="right"?(f=180,l=i):(m=180,s=u)):o.position==="left"?a.position==="bottom"?(g=-90,s=u):a.position==="top"?(g=-90,f=180):(m=180,s=u):o.position==="right"?a.position==="bottom"?(g=-90,m=180,s=u,l=i):a.position==="top"?(g=-90,m=180,f=180,l=i):(m=180,s=u):(m=180,s=u),{translate:[l,s],scale:[1,1],rotate:g,rotateX:m,rotateY:f,value:`translate(${l}px, ${s}px) rotate(${g}deg) rotateX(${m}deg) rotateY(${f}deg)`}}return new se(o=>(V({fullDataFormatter:e,layout:n}).pipe(ue(r),R(async a=>a)).subscribe(a=>{const i=t({xAxis:a.fullDataFormatter.grid.groupAxis,yAxis:a.fullDataFormatter.grid.valueAxis,width:a.layout.width,height:a.layout.height});o.next(i)}),function(){r.next(void 0)}))},Un=({gridAxesTransform$:e})=>e.pipe(I(n=>{const r=[0,0],t=[1/n.scale[0],1/n.scale[1]],o=n.rotate*-1,a=n.rotateX*-1,i=n.rotateY*-1;return{translate:r,scale:t,rotate:o,rotateX:a,rotateY:i,value:`translate(${r[0]}px, ${r[1]}px) rotateX(${a}deg) rotateY(${i}deg) rotate(${o}deg)`}})),Hn=({computedData$:e,fullDataFormatter$:n,layout$:r})=>{const t=new ie;function o({data:a,groupAxis:i,valueAxis:u,width:l,height:s}){let g=0,m=0,f=0,d=0;const p=i.position==="top"||i.position==="bottom"?l:s,b=0,y=a[0]?a[0].length-1:0,S=i.scaleDomain[0]-i.scalePadding,c=i.scaleDomain[1]==="max"?y+i.scalePadding:i.scaleDomain[1]+i.scalePadding,x=Q({maxValue:y,minValue:b,axisWidth:p,scaleDomain:[S,c],scaleRange:[0,1]}),D=x(b),v=x(y);b==y?(g=0,f=1):(g=D,f=(v-D)/p);const $=a.map((k,K)=>k.filter((E,T)=>T>=S&&T<=c&&E.visible==!0)),L=pe($);L[0]===L[1]&&(L[0]=L[1]-1);const z=u.position==="left"||u.position==="right"?s:l,W=Q({maxValue:L[1],minValue:L[0],axisWidth:z,scaleDomain:u.scaleDomain,scaleRange:u.scaleRange}),P=pe(a);P[0]===P[1]&&(P[0]=P[1]-1);const h=W(P[0]),C=W(P[1]);return m=h,d=(C-h)/z,{translate:[g,m],scale:[f,d],rotate:0,rotateX:0,rotateY:0,value:`translate(${g}px, ${m}px) scale(${f}, ${d})`}}return new se(a=>(V({computedData:e,fullDataFormatter:n,layout:r}).pipe(ue(t),R(async i=>i)).subscribe(i=>{const u=o({data:i.computedData,groupAxis:i.fullDataFormatter.grid.groupAxis,valueAxis:i.fullDataFormatter.grid.valueAxis,width:i.layout.width,height:i.layout.height});a.next(u)}),function(){t.next(void 0)}))},qn=({gridContainerPosition$:e,gridAxesTransform$:n,gridGraphicTransform$:r})=>V({gridContainerPosition:e,gridAxesTransform:n,gridGraphicTransform:r}).pipe(R(async t=>t),I(t=>t.gridAxesTransform.rotate==0||t.gridAxesTransform.rotate==180?t.gridContainerPosition.map((o,a)=>[1/t.gridGraphicTransform.scale[0]/t.gridContainerPosition[a].scale[0],1/t.gridGraphicTransform.scale[1]/t.gridContainerPosition[a].scale[1]]):t.gridContainerPosition.map((o,a)=>[1/t.gridGraphicTransform.scale[0]/t.gridContainerPosition[a].scale[1],1/t.gridGraphicTransform.scale[1]/t.gridContainerPosition[a].scale[0]]))),Jn=({fullDataFormatter$:e,layout$:n})=>{const r=new ie;function t({xAxisPosition:o,yAxisPosition:a,width:i,height:u}){return(o==="bottom"||o==="top")&&(a==="left"||a==="right")?{width:i,height:u}:(o==="left"||o==="right")&&(a==="bottom"||a==="top")?{width:u,height:i}:{width:i,height:u}}return new se(o=>{V({fullDataFormatter:e,layout:n}).pipe(ue(r),R(async a=>a)).subscribe(a=>{const i=t({xAxisPosition:a.fullDataFormatter.grid.groupAxis.position,yAxisPosition:a.fullDataFormatter.grid.valueAxis.position,width:a.layout.width,height:a.layout.height});return o.next(i),function(){r.next(void 0)}})})},Zn=({computedData$:e})=>e.pipe(I(n=>n.filter(r=>r.length).map(r=>r[0].seriesLabel)),ke((n,r)=>JSON.stringify(n).length===JSON.stringify(r).length)),Bn=({computedData$:e})=>e.pipe(I(n=>n.map(t=>t.filter(o=>o.visible==!0)).filter(t=>t.length))),_n=({computedLayoutData$:e})=>e.pipe(I(n=>n.map(t=>t.filter(o=>o.visible==!0)).filter(t=>t.length))),Qn=({computedData$:e,fullDataFormatter$:n,layout$:r})=>V({computedData:e,fullDataFormatter:n,layout:r}).pipe(R(async o=>o),I(o=>{if(o.fullDataFormatter.grid.separateSeries)return de(o.layout,o.fullDataFormatter.container,o.computedData.length);{const a=de(o.layout,o.fullDataFormatter.container,1);return o.computedData.map((i,u)=>a[0])}})),Kn=({isSeriesSeprate$:e,computedData$:n})=>{const r=n.pipe(I(t=>{const o=new Array(t[0]?t[0].length:0).fill(null).map((i,u)=>t.reduce((l,s)=>{if(s&&s[u]){const g=s[u].value==null||s[u].visible==!1?0:s[u].value;return l+g}return l},0));return t.map((i,u)=>i.map((l,s)=>({...l,value:o[s]})))}));return e.pipe(R(t=>Ge(()=>t,n,r)))};function Gn(e,n){if(!e.length)return[];try{const r=e.reduce((i,u)=>u.length>i?u.length:i,0),o=e.map((i,u)=>{if(i.length===r)return i;const l=Object.assign([],i);for(let s=l.length;s<r;s++)l[s]=null;return l}).map((i,u)=>i.map((l,s)=>l==null?{id:"",label:"",data:{},value:null}:typeof l=="number"?{id:"",label:"",data:{},value:l}:{id:l.id??"",label:l.label??"",data:l.data??{},value:l.value}));return Oe(n.seriesDirection,o)}catch{return[]}}const et=e=>{const{data:n=[],dataFormatter:r,chartParams:t}=e;if(!n.length)return[];let o;try{const a=Gn(n,r.grid),i=Te({transposedDataGrid:a,dataFormatterGrid:r.grid,chartType:"grid"}),u=Ne({transposedDataGrid:a,dataFormatterGrid:r.grid,chartType:"grid"});let l=0;o=a.map((s,g)=>s.map((m,f)=>{const d=Re("grid",0,g,f),p=u[f],b={id:m.id?m.id:d,index:l,label:m.label?m.label:d,description:m.description??"",data:m.data,value:m.value,gridIndex:0,seriesIndex:g,seriesLabel:i[g],groupIndex:f,groupLabel:p,color:Ee(g,t),visible:!0};return b.visible=r.visibleFilter(b,e),l++,b}))}catch(a){throw Error(a)}return o};var In=["addListener","removeListener"],Tn=["addEventListener","removeEventListener"],Nn=["on","off"];function oe(e,n,r,t){if(N(r)&&(t=r,r=void 0),t)return oe(e,n,r).pipe(Xe(t));var o=Ye(On(e)?Tn.map(function(u){return function(l){return e[u](n,l,r)}}):Rn(e)?In.map(Me(e,n)):En(e)?Nn.map(Me(e,n)):[],2),a=o[0],i=o[1];if(!a&&je(e))return Ue(function(u){return oe(u,n,r)})(Ve(e));if(!a)throw new TypeError("Invalid event target");return new le(function(u){var l=function(){for(var s=[],g=0;g<arguments.length;g++)s[g]=arguments[g];return u.next(1<s.length?s:s[0])};return a(l),function(){return i(l)}})}function Me(e,n){return function(r){return function(t){return e[r](n,t)}}}function Rn(e){return N(e.addListener)&&N(e.removeListener)}function En(e){return N(e.on)&&N(e.off)}function On(e){return N(e.addEventListener)&&N(e.removeEventListener)}function Xn(e,n){let r=new le(()=>{});return e.each(function(){const t=oe(this,n);r=He(r,t)}),r}const nt=({selection:e,pluginName:n,clipPathID:r,seriesLabels$:t,gridContainerPosition$:o,gridAxesTransform$:a,gridGraphicTransform$:i})=>{const u=ne(n,"series"),l=ne(n,"axes"),s=ne(n,"graphic"),g=t.pipe(M((p,b)=>e.selectAll(`g.${u}`).data(p,y=>y).join(y=>y.append("g").classed(u,!0).each((S,c,x)=>{ee(x[c]).selectAll(`g.${l}`).data([c]).join(D=>D.append("g").classed(l,!0).attr("clip-path",`url(#${r})`).each((v,$,L)=>{ee(L[$]).selectAll("defs").data([$]).join("defs"),ee(L[$]).selectAll("g").data([$]).join("g").classed(s,!0)}),D=>D,D=>D.remove())}),y=>y,y=>y.remove())),X(1));w({seriesSelection:g,gridContainerPosition:o}).pipe(A(async p=>p)).subscribe(p=>{p.seriesSelection.transition().attr("transform",(b,y)=>{const S=p.gridContainerPosition[y]??p.gridContainerPosition[0],c=S.translate,x=S.scale;return`translate(${c[0]}, ${c[1]}) scale(${x[0]}, ${x[1]})`})});const m=w({seriesSelection:g,gridAxesTransform:a}).pipe(A(async p=>p),M(p=>p.seriesSelection.select(`g.${l}`).style("transform",p.gridAxesTransform.value)),X(1)),f=m.pipe(M(p=>p.select("defs")),X(1)),d=w({axesSelection:m,gridGraphicTransform:i}).pipe(A(async p=>p),M(p=>{const b=p.axesSelection.select(`g.${s}`);return b.transition().duration(50).style("transform",p.gridGraphicTransform.value),b}),X(1));return{seriesSelection$:g,axesSelection$:m,defsSelection$:f,graphicGSelection$:d}},tt=({fullDataFormatter$:e,gridAxesSize$:n,computedData$:r,fullChartParams$:t,gridContainerPosition$:o,layout$:a})=>{const i=new ze,u=w({fullDataFormatter:e,gridAxesSize:n,computedData:r}).pipe(A(async f=>f),M(f=>{const d=f.computedData[0]?f.computedData[0].length-1:0,p=f.fullDataFormatter.grid.groupAxis.scaleDomain[0]-f.fullDataFormatter.grid.groupAxis.scalePadding,b=f.fullDataFormatter.grid.groupAxis.scaleDomain[1]==="max"?d+f.fullDataFormatter.grid.groupAxis.scalePadding:f.fullDataFormatter.grid.groupAxis.scaleDomain[1]+f.fullDataFormatter.grid.groupAxis.scalePadding;return[p,b]}),X(1)),l=w({fullDataFormatter:e,computedData:r}).pipe(A(async f=>f),M(f=>f.fullDataFormatter.grid.seriesDirection==="row"?(f.computedData[0]??[]).map(d=>d.groupLabel):f.computedData.map(d=>d[0].groupLabel))),s=w({groupScaleDomain:u,groupLabels:l}).pipe(A(async f=>f),M(f=>f.groupLabels.filter((d,p)=>p>=f.groupScaleDomain[0]&&p<=f.groupScaleDomain[1]))),g=o.pipe(M(f=>f.reduce((p,b)=>b.columnIndex>p?b.columnIndex:p,0)+1),J()),m=o.pipe(M(f=>f.reduce((p,b)=>b.rowIndex>p?b.rowIndex:p,0)+1),J());return new le(f=>{w({dataFormatter:e,axisSize:n,fullChartParams:t,scaleRangeGroupLabels:s,groupLabels:l,groupScaleDomain:u,columnAmount:g,rowAmount:m,layout:a}).pipe(We(i),A(async d=>d)).subscribe(d=>{const p=d.dataFormatter.grid.valueAxis.position==="right"||d.dataFormatter.grid.valueAxis.position==="bottom",b=Se({axisLabels:d.scaleRangeGroupLabels,axisWidth:d.axisSize.width,padding:d.dataFormatter.grid.groupAxis.scalePadding,reverse:p}),y=c=>d.dataFormatter.grid.groupAxis.position==="bottom"||d.dataFormatter.grid.groupAxis.position==="top"?c.offsetX-d.fullChartParams.padding.left:c.offsetY-d.fullChartParams.padding.top,S=c=>{const x={offsetX:c.offsetX*d.columnAmount%d.layout.rootWidth,offsetY:c.offsetY*d.rowAmount%d.layout.rootHeight},D=y(x),v=b(D),$=Math.ceil(d.groupScaleDomain[0]),L=v+$;return{groupIndex:L,groupLabel:d.groupLabels[L]??""}};return f.next(S),function(){i.next(void 0)}})})},rt=({rootSelection:e,fullDataFormatter$:n,gridAxesSize$:r,computedData$:t,fullChartParams$:o,gridContainerPosition$:a,layout$:i})=>{const u=Xn(e,"mousemove"),l=w({fullDataFormatter:n,gridAxesSize:r,computedData:t}).pipe(A(async c=>c),M(c=>{const x=c.computedData[0]?c.computedData[0].length-1:0,D=c.fullDataFormatter.grid.groupAxis.scaleDomain[0]-c.fullDataFormatter.grid.groupAxis.scalePadding,v=c.fullDataFormatter.grid.groupAxis.scaleDomain[1]==="max"?x+c.fullDataFormatter.grid.groupAxis.scalePadding:c.fullDataFormatter.grid.groupAxis.scaleDomain[1]+c.fullDataFormatter.grid.groupAxis.scalePadding;return[D,v]}),X(1)),s=w({fullDataFormatter:n,computedData:t}).pipe(A(async c=>c),M(c=>c.fullDataFormatter.grid.seriesDirection==="row"?(c.computedData[0]??[]).map(x=>x.groupLabel):c.computedData.map(x=>x[0].groupLabel))),g=w({groupScaleDomain:l,groupLabels:s}).pipe(A(async c=>c),M(c=>c.groupLabels.filter((x,D)=>D>=c.groupScaleDomain[0]&&D<=c.groupScaleDomain[1]))),m=n.pipe(M(c=>c.grid.valueAxis.position==="right"||c.grid.valueAxis.position==="bottom")),f=w({reverse:m,gridAxesSize:r,scaleRangeGroupLabels:g,fullDataFormatter:n}).pipe(A(async c=>c),M(c=>Se({axisLabels:c.scaleRangeGroupLabels,axisWidth:c.gridAxesSize.width,padding:c.fullDataFormatter.grid.groupAxis.scalePadding,reverse:c.reverse}))),d=a.pipe(M(c=>c.reduce((D,v)=>v.columnIndex>D?v.columnIndex:D,0)+1),J()),p=a.pipe(M(c=>c.reduce((D,v)=>v.rowIndex>D?v.rowIndex:D,0)+1),J()),b=w({fullDataFormatter:n,fullChartParams:o,rootMousemove:u,columnAmount:d,rowAmount:p,layout:i}).pipe(A(async c=>c),M(c=>{const x={offsetX:c.rootMousemove.offsetX*c.columnAmount%c.layout.rootWidth,offsetY:c.rootMousemove.offsetY*c.rowAmount%c.layout.rootHeight};return c.fullDataFormatter.grid.groupAxis.position==="bottom"||c.fullDataFormatter.grid.groupAxis.position==="top"?x.offsetX-c.fullChartParams.padding.left:x.offsetY-c.fullChartParams.padding.top})),y=w({xIndexScale:f,axisValue:b,groupScaleDomain:l}).pipe(A(async c=>c),M(c=>{const x=c.xIndexScale(c.axisValue),D=Math.ceil(c.groupScaleDomain[0]);return x+D})),S=w({groupIndex:y,groupLabels:s}).pipe(A(async c=>c),M(c=>c.groupLabels[c.groupIndex]??""));return w({groupIndex:y,groupLabel:S}).pipe(A(async c=>c),M(c=>({groupIndex:c.groupIndex,groupLabel:c.groupLabel})))};export{Un as a,Hn as b,Q as c,qn as d,Jn as e,Zn as f,Wn as g,Bn as h,zn as i,_n as j,Kn as k,Gn as l,nt as m,tt as n,Xn as o,rt as p,Qn as q,et as r};
