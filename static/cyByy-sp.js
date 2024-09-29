import{aH as N,q as G,x as D,F as E,z,B as U,J as j,y as p,w as K,aI as _,K as V,aJ as q,aK as W,S as O,t as b,m,i as C,j as P,d as Q,s as f}from"./hQFDSd1w.js";import{c as X}from"./D33HThNu.js";import{r as Y,s as Z,t as ee,h as R,g as J}from"./CrPrLvvz.js";import{o as ae}from"./CHVS6dvM.js";const te=c=>{const{data:l=[],dataFormatter:n,chartParams:a}=c,t=new Map(n.categoryLabels.map((s,u)=>[s,u]));let d={id:"",index:0,label:"",description:"",categoryIndex:0,categoryLabel:"",color:"",visible:!0,data:{},value:0,level:0,seq:0,children:[]};try{const s=function(){if(N(l)===!0)return structuredClone(l);if(Array.isArray(l)===!1)return{id:""};let r;const o=new Map;l.forEach(i=>{if(!i.parent)r=i;else{const g=o.get(i.parent)??[];g.push(i),o.set(i.parent,g)}});const v=i=>({id:i.id,label:i.label,data:i.data,value:i.value,categoryLabel:i.categoryLabel,children:(o.get(i.id)??[]).map(g=>v(g))});return r?v(r):{id:""}}();let u=0;const e=(r,o,v)=>{const i=o+1,g=r.categoryLabel??null;let M=0;g!=null&&(t.has(g)||t.set(g,t.size),M=t.get(g)??0);const $=u;u++;const h={id:r.id,index:$,level:o,seq:v,label:r.label??"",description:r.description??"",categoryIndex:M,categoryLabel:g,color:G(M,a),data:r.data??{},value:r.value,visible:!0,children:(r.children??[]).map((A,x)=>e(A,i,x))};return h.visible=n.visibleFilter(h,c),h};d=e(s,0,0)}catch(s){throw Error(s)}return d},ie=({computedData$:c})=>c.pipe(D(l=>{function n(a,t){return a.push(t),t.children&&t.children.forEach(d=>{a=n(a,d)}),a}return n([],l)})),le=({nodeList$:c,fullDataFormatter$:l})=>{const n=l.pipe(D(a=>a.categoryLabels),E((a,t)=>JSON.stringify(a).length===JSON.stringify(t).length));return z({nodeList:c,categoryLabels:n}).pipe(U(async a=>a),D(a=>{const t=new Set(a.categoryLabels),d=new Set(a.nodeList.filter(s=>s.visible).map(s=>s.categoryLabel));return Array.from(d).forEach(s=>{t.has(s)||t.add(s)}),Array.from(t).forEach(s=>{d.has(s)||d.delete(s)}),Array.from(t)}),E((a,t)=>JSON.stringify(a).length===JSON.stringify(t).length))},re=({computedData$:c})=>c.pipe(D(l=>{function n(a){return a.children&&(a.children=a.children.filter(t=>t.visible).map(t=>n(t))),a}return n(l)})),oe=({subject:c,observer:l})=>{const n=j(l.fullChartParams$).pipe(p(1)),a=ie({computedData$:l.computedData$}).pipe(p(1)),t=K({datumList$:a,fullChartParams$:l.fullChartParams$,event$:c.event$}).pipe(p(1)),d=le({nodeList$:a,fullDataFormatter$:l.fullDataFormatter$}).pipe(p(1)),s=_({datumList$:a}).pipe(p(1)),u=re({computedData$:l.computedData$}).pipe(p(1));return{fullParams$:l.fullParams$,fullChartParams$:l.fullChartParams$,fullDataFormatter$:l.fullDataFormatter$,computedData$:l.computedData$,layout$:l.layout$,textSizePx$:n,treeHighlight$:t,existCategoryLabels$:d,CategoryDataMap$:s,visibleComputedData$:u}};class be extends V{constructor(l,n){super({defaultDataFormatter:q,computedDataFn:te,contextObserverFn:oe},l,n)}}const ne={paddingInner:2,paddingOuter:2,labelColorType:"primary",squarifyRatio:1.618034,sort:(c,l)=>l.value-c.value},se={position:"right",justify:"end",padding:28,backgroundFill:"none",backgroundStroke:"none",gap:10,listRectWidth:14,listRectHeight:14,listRectRadius:0,textColorType:"primary"},F="TreeLegend",ye=W(F,se)(({selection:c,rootSelection:l,observer:n,subject:a})=>{const t=new O,d=n.CategoryDataMap$.pipe(b(t),m(e=>Array.from(e.keys()))),s=n.fullParams$.pipe(b(t),m(e=>{const r=[{listRectWidth:e.listRectWidth,listRectHeight:e.listRectHeight,listRectRadius:e.listRectRadius}];return{...e,seriesList:r}})),u=X(F,{rootSelection:l,seriesLabels$:d,fullParams$:s,layout$:n.layout$,fullChartParams$:n.fullChartParams$,textSizePx$:n.textSizePx$});return()=>{t.next(void 0),u()}}),y="TreeMap",w=J(y,"tree"),B=J(y,"tile");function ce({selection:c,treeData:l,fullParams:n,fullChartParams:a,textSizePx:t}){const d=t/2,s=t,u=c.selectAll(`g.${w}`).data(l,e=>e.data.id).join("g").attr("class",w);return u.attr("transform",e=>!e.x0||!e.y0?null:`translate(${e.x0},${e.y0})`).each((e,r,o)=>{const v=f(o[r]);v.selectAll(`rect.${B}`).data([e],i=>i.data.id).join("rect").attr("id",i=>i.data.id).attr("class",B).attr("cursor","pointer").attr("width",i=>i.x1-i.x0).attr("height",i=>i.y1-i.y0).attr("fill",i=>i.data.color).attr("data-name",i=>i.data.label).attr("data-category",i=>i.data.categoryLabel).attr("data-value",i=>i.data.value),v.selectAll("g").data([e]).join("g").each((i,g,M)=>{f(M[g]).selectAll("text").data([i]).join("text").text(h=>h.data.label).attr("dominant-baseline","hanging").attr("x",d).attr("y",d).attr("font-size",a.styles.textSize).each(function(h){const A=f(this),x=h.data.label.split(/\s+/).reverse();let T,L=[];const I=A.attr("x");let k=A.attr("y"),H=0,S=A.text(null).append("tspan").attr("cursor","pointer").attr("fill",R(n.labelColorType,a)).attr("font-size",a.styles.textSize).attr("x",I).attr("y",k);for(;T=x.pop();)L.push(T),S.text(L.join(" ")),S.node().getComputedTextLength()>h.x1-h.x0-d&&(L.pop(),S.text(L.join(" ")),L=[T],H+=s,S=A.append("tspan").attr("cursor","pointer").attr("fill",R(n.labelColorType,a)).attr("font-size",a.styles.textSize).attr("x",I).attr("y",k).attr("dy",H+"px").text(T))})})}),u}function de({selection:c,ids:l,fullChartParams:n}){if(c.interrupt("highlight"),!l.length){c.transition("highlight").duration(200).style("opacity",1);return}c.each((a,t,d)=>{l.includes(a.data.id)?f(d[t]).style("opacity",1):f(d[t]).style("opacity",n.styles.unhighlightedOpacity)})}const Ae=W(y,ne)(({selection:c,name:l,subject:n,observer:a})=>{const t=new O,d=C({layout:a.layout$,visibleComputedData:a.visibleComputedData$,fullParams:a.fullParams$,fullDataFormatter:a.fullDataFormatter$,fullChartParams:a.fullChartParams$}).pipe(b(t),P(async e=>e),m(e=>{const r=Y().size([e.layout.width,e.layout.height]).paddingInner(e.fullParams.paddingInner).paddingOuter(e.fullParams.paddingOuter).round(!0).tile(Z.ratio(e.fullParams.squarifyRatio)),o=ee(e.visibleComputedData).sum(i=>i.value).sort(e.fullParams.sort);return r(o),o.leaves()})),s=C({selection:ae(c),treeData:d,fullParams:a.fullParams$,fullChartParams:a.fullChartParams$,textSizePx:a.textSizePx$}).pipe(b(t),P(async e=>e),m(e=>ce({selection:c,treeData:e.treeData,fullParams:e.fullParams,fullChartParams:e.fullChartParams,textSizePx:e.textSizePx}))),u=a.fullChartParams$.pipe(b(t),m(e=>e.highlightTarget),Q());return C({cellSelection:s,computedData:a.computedData$,treeData:d,fullParams:a.fullParams$,fullChartParams:a.fullChartParams$,highlightTarget:u,CategoryDataMap:a.CategoryDataMap$}).pipe(b(t),P(async e=>e)).subscribe(e=>{e.cellSelection.on("mouseover",(r,o)=>{r.stopPropagation(),n.event$.next({type:"tree",eventName:"mouseover",pluginName:y,highlightTarget:e.highlightTarget,datum:o.data,category:e.CategoryDataMap.get(o.data.categoryLabel),categoryIndex:o.data.categoryIndex,categoryLabel:o.data.categoryLabel,event:r,data:e.computedData})}).on("mousemove",(r,o)=>{r.stopPropagation(),n.event$.next({type:"tree",eventName:"mousemove",pluginName:y,highlightTarget:e.highlightTarget,datum:o.data,category:e.CategoryDataMap.get(o.data.categoryLabel),categoryIndex:o.data.categoryIndex,categoryLabel:o.data.categoryLabel,event:r,data:e.computedData})}).on("mouseout",(r,o)=>{r.stopPropagation(),n.event$.next({type:"tree",eventName:"mouseout",pluginName:y,highlightTarget:e.highlightTarget,datum:o.data,category:e.CategoryDataMap.get(o.data.categoryLabel),categoryIndex:o.data.categoryIndex,categoryLabel:o.data.categoryLabel,event:r,data:e.computedData})}).on("click",(r,o)=>{r.stopPropagation(),n.event$.next({type:"tree",eventName:"click",pluginName:y,highlightTarget:e.highlightTarget,datum:o.data,category:e.CategoryDataMap.get(o.data.categoryLabel),categoryIndex:o.data.categoryIndex,categoryLabel:o.data.categoryLabel,event:r,data:e.computedData})})}),C({cellSelection:s,highlight:a.treeHighlight$.pipe(m(e=>e.map(r=>r.id))),fullChartParams:a.fullChartParams$}).pipe(b(t),P(async e=>e)).subscribe(e=>{de({selection:e.cellSelection,ids:e.highlight,fullChartParams:e.fullChartParams})}),()=>{t.next(void 0)}}),pe={label:"Movies",children:[{label:"Action",children:[{label:"Avatar ",categoryLabel:"Action",value:"760505847",id:"Movies.Action.Avatar "},{label:"Jurassic World ",categoryLabel:"Action",value:"652177271",id:"Movies.Action.Jurassic World "},{label:"The Avengers ",categoryLabel:"Action",value:"623279547",id:"Movies.Action.The Avengers "},{label:"The Dark Knight ",categoryLabel:"Action",value:"533316061",id:"Movies.Action.The Dark Knight "},{label:"Star Wars: Episode I - The Phantom Menace ",categoryLabel:"Action",value:"474544677",id:"Movies.Action.Star Wars: Episode I - The Phantom Menace "},{label:"Star Wars: Episode IV - A New Hope ",categoryLabel:"Action",value:"460935665",id:"Movies.Action.Star Wars: Episode IV - A New Hope "},{label:"Avengers: Age of Ultron ",categoryLabel:"Action",value:"458991599",id:"Movies.Action.Avengers: Age of Ultron "},{label:"The Dark Knight Rises ",categoryLabel:"Action",value:"448130642",id:"Movies.Action.The Dark Knight Rises "},{label:"Pirates of the Caribbean: Dead Man's Chest ",categoryLabel:"Action",value:"423032628",id:"Movies.Action.Pirates of the Caribbean: Dead Man's Chest "},{label:"Iron Man 3",categoryLabel:"Action",value:"408992272",id:"Movies.Action.Iron Man 3"},{label:"Captain America: Civil War ",categoryLabel:"Action",value:"407197282",id:"Movies.Action.Captain America: Civil War "},{label:"Spider-Man ",categoryLabel:"Action",value:"403706375",id:"Movies.Action.Spider-Man "},{label:"Transformers: Revenge of the Fallen ",categoryLabel:"Action",value:"402076689",id:"Movies.Action.Transformers: Revenge of the Fallen "},{label:"Star Wars: Episode III - Revenge of the Sith ",categoryLabel:"Action",value:"380262555",id:"Movies.Action.Star Wars: Episode III - Revenge of the Sith "},{label:"The Lord of the Rings: The Return of the King ",categoryLabel:"Action",value:"377019252",id:"Movies.Action.The Lord of the Rings: The Return of the King "},{label:"Spider-Man 2",categoryLabel:"Action",value:"373377893",id:"Movies.Action.Spider-Man 2"},{label:"Deadpool ",categoryLabel:"Action",value:"363024263",id:"Movies.Action.Deadpool "},{label:"Transformers: Dark of the Moon ",categoryLabel:"Action",value:"352358779",id:"Movies.Action.Transformers: Dark of the Moon "},{label:"American Sniper ",categoryLabel:"Action",value:"350123553",id:"Movies.Action.American Sniper "},{label:"Furious 7",categoryLabel:"Action",value:"350034110",id:"Movies.Action.Furious 7"},{label:"The Lord of the Rings: The Two Towers ",categoryLabel:"Action",value:"340478898",id:"Movies.Action.The Lord of the Rings: The Two Towers "},{label:"Spider-Man 3",categoryLabel:"Action",value:"336530303",id:"Movies.Action.Spider-Man 3"},{label:"Minions ",categoryLabel:"Action",value:"336029560",id:"Movies.Action.Minions "},{label:"Guardians of the Galaxy ",categoryLabel:"Action",value:"333130696",id:"Movies.Action.Guardians of the Galaxy "},{label:"Batman v Superman: Dawn of Justice ",categoryLabel:"Action",value:"330249062",id:"Movies.Action.Batman v Superman: Dawn of Justice "},{label:"Transformers ",categoryLabel:"Action",value:"318759914",id:"Movies.Action.Transformers "},{label:"Iron Man ",categoryLabel:"Action",value:"318298180",id:"Movies.Action.Iron Man "},{label:"Indiana Jones and the Kingdom of the Crystal Skull ",categoryLabel:"Action",value:"317011114",id:"Movies.Action.Indiana Jones and the Kingdom of the Crystal Skull "},{label:"The Lord of the Rings: The Fellowship of the Ring ",categoryLabel:"Action",value:"313837577",id:"Movies.Action.The Lord of the Rings: The Fellowship of the Ring "},{label:"Iron Man 2",categoryLabel:"Action",value:"312057433",id:"Movies.Action.Iron Man 2"},{label:"Star Wars: Episode II - Attack of the Clones ",categoryLabel:"Action",value:"310675583",id:"Movies.Action.Star Wars: Episode II - Attack of the Clones "},{label:"Pirates of the Caribbean: At World's End ",categoryLabel:"Action",value:"309404152",id:"Movies.Action.Pirates of the Caribbean: At World's End "},{label:"Star Wars: Episode VI - Return of the Jedi ",categoryLabel:"Action",value:"309125409",id:"Movies.Action.Star Wars: Episode VI - Return of the Jedi "},{label:"Independence Day ",categoryLabel:"Action",value:"306124059",id:"Movies.Action.Independence Day "},{label:"Pirates of the Caribbean: The Curse of the Black Pearl ",categoryLabel:"Action",value:"305388685",id:"Movies.Action.Pirates of the Caribbean: The Curse of the Black Pearl "},{label:"Skyfall ",categoryLabel:"Action",value:"304360277",id:"Movies.Action.Skyfall "},{label:"Inception ",categoryLabel:"Action",value:"292568851",id:"Movies.Action.Inception "},{label:"Man of Steel ",categoryLabel:"Action",value:"291021565",id:"Movies.Action.Man of Steel "},{label:"Star Wars: Episode V - The Empire Strikes Back ",categoryLabel:"Action",value:"290158751",id:"Movies.Action.Star Wars: Episode V - The Empire Strikes Back "},{label:"The Matrix Reloaded ",categoryLabel:"Action",value:"281492479",id:"Movies.Action.The Matrix Reloaded "},{label:"The Amazing Spider-Man ",categoryLabel:"Action",value:"262030663",id:"Movies.Action.The Amazing Spider-Man "},{label:"The Incredibles ",categoryLabel:"Action",value:"261437578",id:"Movies.Action.The Incredibles "},{label:"Captain America: The Winter Soldier ",categoryLabel:"Action",value:"259746958",id:"Movies.Action.Captain America: The Winter Soldier "},{label:"The Lego Movie ",categoryLabel:"Action",value:"257756197",id:"Movies.Action.The Lego Movie "},{label:"Star Trek ",categoryLabel:"Action",value:"257704099",id:"Movies.Action.Star Trek "},{label:"Batman ",categoryLabel:"Action",value:"251188924",id:"Movies.Action.Batman "},{label:"Night at the Museum ",categoryLabel:"Action",value:"250863268",id:"Movies.Action.Night at the Museum "}],id:"Movies.Action"},{label:"Drama",children:[{label:"Titanic ",categoryLabel:"Drama",value:"658672302",id:"Movies.Drama.Titanic "},{label:"The Sixth Sense ",categoryLabel:"Drama",value:"293501675",id:"Movies.Drama.The Sixth Sense "},{label:"I Am Legend ",categoryLabel:"Drama",value:"256386216",id:"Movies.Drama.I Am Legend "}],id:"Movies.Drama"},{label:"Adventure",children:[{label:"Shrek 2",categoryLabel:"Adventure",value:"436471036",id:"Movies.Adventure.Shrek 2"},{label:"The Hunger Games: Catching Fire ",categoryLabel:"Adventure",value:"424645577",id:"Movies.Adventure.The Hunger Games: Catching Fire "},{label:"The Lion King ",categoryLabel:"Adventure",value:"422783777",id:"Movies.Adventure.The Lion King "},{label:"Toy Story 3",categoryLabel:"Adventure",value:"414984497",id:"Movies.Adventure.Toy Story 3"},{label:"The Hunger Games ",categoryLabel:"Adventure",value:"407999255",id:"Movies.Adventure.The Hunger Games "},{label:"Frozen ",categoryLabel:"Adventure",value:"400736600",id:"Movies.Adventure.Frozen "},{label:"Finding Nemo ",categoryLabel:"Adventure",value:"380838870",id:"Movies.Adventure.Finding Nemo "},{label:"The Jungle Book ",categoryLabel:"Adventure",value:"362645141",id:"Movies.Adventure.The Jungle Book "},{label:"Jurassic Park ",categoryLabel:"Adventure",value:"356784000",id:"Movies.Adventure.Jurassic Park "},{label:"Inside Out ",categoryLabel:"Adventure",value:"356454367",id:"Movies.Adventure.Inside Out "},{label:"The Hunger Games: Mockingjay - Part 1",categoryLabel:"Adventure",value:"337103873",id:"Movies.Adventure.The Hunger Games: Mockingjay - Part 1"},{label:"Alice in Wonderland ",categoryLabel:"Adventure",value:"334185206",id:"Movies.Adventure.Alice in Wonderland "},{label:"Shrek the Third ",categoryLabel:"Adventure",value:"320706665",id:"Movies.Adventure.Shrek the Third "},{label:"Harry Potter and the Sorcerer's Stone ",categoryLabel:"Adventure",value:"317557891",id:"Movies.Adventure.Harry Potter and the Sorcerer's Stone "},{label:"The Hobbit: An Unexpected Journey ",categoryLabel:"Adventure",value:"303001229",id:"Movies.Adventure.The Hobbit: An Unexpected Journey "},{label:"Harry Potter and the Half-Blood Prince ",categoryLabel:"Adventure",value:"301956980",id:"Movies.Adventure.Harry Potter and the Half-Blood Prince "},{label:"The Twilight Saga: Eclipse ",categoryLabel:"Adventure",value:"300523113",id:"Movies.Adventure.The Twilight Saga: Eclipse "},{label:"The Twilight Saga: New Moon ",categoryLabel:"Adventure",value:"296623634",id:"Movies.Adventure.The Twilight Saga: New Moon "},{label:"Up ",categoryLabel:"Adventure",value:"292979556",id:"Movies.Adventure.Up "},{label:"The Twilight Saga: Breaking Dawn - Part 2",categoryLabel:"Adventure",value:"292298923",id:"Movies.Adventure.The Twilight Saga: Breaking Dawn - Part 2"},{label:"Harry Potter and the Order of the Phoenix ",categoryLabel:"Adventure",value:"292000866",id:"Movies.Adventure.Harry Potter and the Order of the Phoenix "},{label:"The Chronicles of Narnia: The Lion, the Witch and the Wardrobe ",categoryLabel:"Adventure",value:"291709845",id:"Movies.Adventure.The Chronicles of Narnia: The Lion, the Witch and the Wardrobe "},{label:"Harry Potter and the Goblet of Fire ",categoryLabel:"Adventure",value:"289994397",id:"Movies.Adventure.Harry Potter and the Goblet of Fire "},{label:"Monsters, Inc. ",categoryLabel:"Adventure",value:"289907418",id:"Movies.Adventure.Monsters, Inc. "},{label:"The Hunger Games: Mockingjay - Part 2",categoryLabel:"Adventure",value:"281666058",id:"Movies.Adventure.The Hunger Games: Mockingjay - Part 2"},{label:"Gravity ",categoryLabel:"Adventure",value:"274084951",id:"Movies.Adventure.Gravity "},{label:"Monsters University ",categoryLabel:"Adventure",value:"268488329",id:"Movies.Adventure.Monsters University "},{label:"Shrek ",categoryLabel:"Adventure",value:"267652016",id:"Movies.Adventure.Shrek "},{label:"Harry Potter and the Chamber of Secrets ",categoryLabel:"Adventure",value:"261970615",id:"Movies.Adventure.Harry Potter and the Chamber of Secrets "},{label:"Jaws ",categoryLabel:"Adventure",value:"260000000",id:"Movies.Adventure.Jaws "},{label:"The Hobbit: The Desolation of Smaug ",categoryLabel:"Adventure",value:"258355354",id:"Movies.Adventure.The Hobbit: The Desolation of Smaug "},{label:"The Hobbit: The Battle of the Five Armies ",categoryLabel:"Adventure",value:"255108370",id:"Movies.Adventure.The Hobbit: The Battle of the Five Armies "},{label:"Men in Black ",categoryLabel:"Adventure",value:"250147615",id:"Movies.Adventure.Men in Black "}],id:"Movies.Adventure"},{label:"Family",children:[{label:"E.T. the Extra-Terrestrial ",categoryLabel:"Family",value:"434949459",id:"Movies.Family.E.T. the Extra-Terrestrial "}],id:"Movies.Family"},{label:"Animation",children:[{label:"Despicable Me 2",categoryLabel:"Animation",value:"368049635",id:"Movies.Animation.Despicable Me 2"},{label:"The Secret Life of Pets ",categoryLabel:"Animation",value:"323505540",id:"Movies.Animation.The Secret Life of Pets "},{label:"Despicable Me ",categoryLabel:"Animation",value:"251501645",id:"Movies.Animation.Despicable Me "}],id:"Movies.Animation"},{label:"Comedy",children:[{label:"Forrest Gump ",categoryLabel:"Comedy",value:"329691196",id:"Movies.Comedy.Forrest Gump "},{label:"Home Alone ",categoryLabel:"Comedy",value:"285761243",id:"Movies.Comedy.Home Alone "},{label:"Meet the Fockers ",categoryLabel:"Comedy",value:"279167575",id:"Movies.Comedy.Meet the Fockers "},{label:"The Hangover ",categoryLabel:"Comedy",value:"277313371",id:"Movies.Comedy.The Hangover "},{label:"How the Grinch Stole Christmas ",categoryLabel:"Comedy",value:"260031035",id:"Movies.Comedy.How the Grinch Stole Christmas "},{label:"The Hangover Part II ",categoryLabel:"Comedy",value:"254455986",id:"Movies.Comedy.The Hangover Part II "}],id:"Movies.Comedy"},{label:"Biography",children:[{label:"The Blind Side ",categoryLabel:"Biography",value:"255950375",id:"Movies.Biography.The Blind Side "}],id:"Movies.Biography"}],id:"Movies"};export{be as T,Ae as a,ye as b,pe as t};
