import{ay as I,aQ as g,aU as v,b8 as C,m as F,aP as N,aR as w,be as E,bi as M,bf as O}from"./CllDRATP.js";var P=new I(function(e){return e.complete()});function k(e,n,r,t,a,l,o,A){var f=[],i=0,x=0,p=!1,c=function(){p&&!f.length&&!i&&n.complete()},y=function(u){return i<t?d(u):f.push(u)},d=function(u){i++;var h=!1;v(r(u,x++)).subscribe(g(n,function(s){n.next(s)},function(){h=!0},void 0,function(){if(h)try{i--;for(var s=function(){var m=f.shift();o||d(m)};f.length&&i<t;)s();c()}catch(m){n.error(m)}}))};return e.subscribe(g(n,y,function(){p=!0,c()})),function(){}}function b(e,n,r){return r===void 0&&(r=1/0),C(n)?b(function(t,a){return F(function(l,o){return n(t,l,a,o)})(v(e(t,a)))},r):(typeof n=="number"&&(r=n),N(function(t,a){return k(t,a,e,r)}))}function z(e){return e===void 0&&(e=1/0),b(w,e)}function R(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var r=E(e),t=M(e,1/0),a=e;return a.length?a.length===1?v(a[0]):z(t)(O(a,r)):P}export{P as E,R as a,b as m};