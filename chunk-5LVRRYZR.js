import{I as D,J as O,q,r as E}from"./chunk-JY52K3I6.js";import{$b as v,Ab as $,Hc as M,I as y,Ia as u,Jb as _,K as w,Kb as g,Lb as V,N as I,Ob as F,Sb as C,T,ab as b,ac as H,ib as f,jb as S,k as h,mb as k,ua as c,va as s,z as p}from"./chunk-D2TTQ72P.js";var A=["typeaheadInput"],L=["typeaheadInstance"],X=(()=>{class r{constructor(){this.typeaheadInputHtml=f.required("typeaheadInput"),this.typeaheadInstance=f.required("typeaheadInstance"),this.items=u.required(),this.control=S.required(),this.itemSelector=u(n=>`${n??""}`),this.placeholder=u("Placeholder"),this.#e=M(()=>{let n=this.control(),e=this.typeaheadInputHtml();e&&(e.nativeElement.value=this.itemSelector()(n.value))}),this.focus$=new h,this.click$=new h,this.search=null}#e;ngOnInit(){this.search=j(this.focus$,this.click$,this.typeaheadInstance(),this.items,this.itemSelector())}clear(){let n=this.typeaheadInputHtml();this.control.update(e=>(e.reset(),e)),n&&(n.nativeElement.value="")}onSelectItem(n){this.control.update(e=>(e.patchValue(n.item),e))}static{this.\u0275fac=function(e){return new(e||r)}}static{this.\u0275cmp=k({type:r,selectors:[["app-typeahead"]],viewQuery:function(e,t){e&1&&(v(t.typeaheadInputHtml,A,5),v(t.typeaheadInstance,L,5)),e&2&&H(2)},inputs:{items:[1,"items"],control:[1,"control"],itemSelector:[1,"itemSelector"],placeholder:[1,"placeholder"]},outputs:{control:"controlChange"},decls:6,vars:6,consts:[["typeaheadInput","","typeaheadInstance","ngbTypeahead"],[1,"input-group"],["type","text",1,"form-control",3,"selectItem","focus","click","placeholder","ngbTypeahead","popupClass","resultFormatter","inputFormatter","disabled"],["type","button",1,"btn","btn-outline-secondary",3,"click"],[1,"fa","fa-times"]],template:function(e,t){if(e&1){let a=F();_(0,"div",1)(1,"input",2,0),C("selectItem",function(d){return c(a),s(t.onSelectItem(d))})("focus",function(){return c(a),s(t.focus$.next(t.control().value))})("click",function(){return c(a),s(t.click$.next(t.control().value))}),g(),_(4,"button",3),C("click",function(){return c(a),s(t.clear())}),V(5,"i",4),g()()}e&2&&(b(),$("placeholder",t.placeholder())("ngbTypeahead",t.search)("popupClass","typeahead")("resultFormatter",t.itemSelector())("inputFormatter",t.itemSelector())("disabled",t.control().disabled))},dependencies:[E,q,O,D],styles:["[_nghost-%COMP%]{display:block;width:100%}"],changeDetection:0})}}return r})();function j(r,Q,n,e,t){return a=>{let l=a.pipe(T()),d=r.pipe(p(i=>({type:"focus",value:t(i)}))),N=Q.pipe(p(i=>({type:"click",value:t(i)}))),P=y(d,N).pipe(I(50),w(i=>!!i.length),p(i=>i.map(o=>o.type).includes("focus")&&i.map(o=>o.type).includes("click")?"":i.map(o=>o.type).includes("click")?n.isPopupOpen()?null:"":null));return y(l,P).pipe(p(i=>{let o=e();return i===null?[]:i?o.filter(m=>!!m).filter(m=>t(m).toLowerCase().includes(i.toLowerCase())):o}))}}export{X as a};
