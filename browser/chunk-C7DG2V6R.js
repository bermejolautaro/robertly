import{B as M,C as E,V as $,W as k,d as F,w as H}from"./chunk-PWFKK35O.js";import{$b as I,B as c,Fc as u,Jb as m,K as C,Ka as a,Kb as h,Lb as T,Ob as V,Sb as d,W as y,_b as b,bb as g,jb as v,m as f,tb as _,ub as w,ya as s,za as p,zb as S}from"./chunk-RORB2MO5.js";var D=["typeaheadInput"],B=(()=>{class o{constructor(){this.inputHtml=w.required("typeaheadInput"),this.items=a.required(),this.control=a.required(),this.itemSelector=a(t=>`${t??""}`),this.placeholder=a("Placeholder"),this.internalControl=_(new H(null)),this.internalControlValues=F(this.internalControl().valueChanges),this.#e=u(()=>{let t=this.internalControlValues();t?this.control().patchValue(t):this.control().reset()}),this.#t=u(()=>{let t=this.control();this.items(),t&&this.internalControl.update(e=>(e.patchValue(t.value),e))}),this.#n=u(()=>{let t=this.internalControlValues(),e=this.inputHtml();e&&(e.nativeElement.value=this.itemSelector()(t))}),this.focus$=new f,this.search=null}#e;#t;#n;ngOnInit(){this.search=N(this.focus$,this.items,this.itemSelector())}clear(){let t=this.inputHtml();this.internalControl.update(e=>(e.reset(),e)),t&&(t.nativeElement.value="")}onSelectItem(t){this.internalControl.update(e=>(e.patchValue(t.item),e))}static{this.\u0275fac=function(e){return new(e||o)}}static{this.\u0275cmp=v({type:o,selectors:[["app-typeahead"]],viewQuery:function(e,n){e&1&&b(n.inputHtml,D,5),e&2&&I()},inputs:{items:[1,"items"],control:[1,"control"],itemSelector:[1,"itemSelector"],placeholder:[1,"placeholder"]},decls:5,vars:5,consts:[["typeaheadInput",""],[1,"input-group"],["type","text",1,"form-control",3,"selectItem","focus","placeholder","ngbTypeahead","popupClass","resultFormatter","inputFormatter"],["type","button",1,"btn","btn-outline-secondary",3,"click"],[1,"fa","fa-times"]],template:function(e,n){if(e&1){let i=V();m(0,"div",1)(1,"input",2,0),d("selectItem",function(l){return s(i),p(n.onSelectItem(l))})("focus",function(){return s(i),p(n.focus$.next(n.internalControl().value))}),h(),m(3,"button",3),d("click",function(){return s(i),p(n.clear())}),T(4,"i",4),h()()}e&2&&(g(),S("placeholder",n.placeholder())("ngbTypeahead",n.search)("popupClass","typeahead")("resultFormatter",n.itemSelector())("inputFormatter",n.itemSelector()))},dependencies:[E,M,k,$],styles:["[_nghost-%COMP%]{display:block;width:100%}"],changeDetection:0})}}return o})();function N(o,q,t){return e=>{let n=e.pipe(y());return C(n,o.pipe(c(i=>t(i)))).pipe(c(i=>{let r=q();return i?r.filter(l=>!!l).filter(l=>t(l).toLowerCase().includes(i.toLowerCase())):r}))}}export{B as a};
