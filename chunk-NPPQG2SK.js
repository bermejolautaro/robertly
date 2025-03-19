import{a as te}from"./chunk-EVLGUXNR.js";import{a as oe}from"./chunk-W7GTON6N.js";import{a as ne}from"./chunk-N4UYAAYU.js";import{a as ee}from"./chunk-5THT56CE.js";import{c as q,d as G,n as x,q as $,w as y}from"./chunk-H7UNI6XH.js";import{A as Z,b as H,d as J,f as K,h as Q,m as X,p as Y}from"./chunk-TXMB3Z4A.js";import{$b as p,Bb as M,Fb as i,Gb as r,Hb as b,Ia as A,Jc as z,Ka as s,Kb as I,Mb as F,Nb as O,Nc as U,R as V,Ya as d,Yb as g,_b as R,ac as f,bc as c,gc as B,ib as N,ma as m,nb as v,t as W,ua as k,va as L,wb as u,x as h,yb as D,yc as S,zc as j}from"./chunk-SEHCXKDS.js";var ie=()=>["g","ml"];function re(l,E){l&1&&b(0,"i",15)}function ae(l,E){l&1&&(b(0,"span",17),i(1,"span",18),g(2,"Loading..."),r())}function de(l,E){if(l&1){let o=I();i(0,"button",19),F("click",function(){k(o);let e=O();return L(e.openDeleteModal())}),b(1,"i",20),i(2,"span"),g(3,"Delete"),r()()}}var we=(()=>{class l{constructor(){this.location=m(z),this.router=m(G),this.toastService=m(x),this.titleCasePipe=m(U),this.route=m(q),this.modalService=m(Z),this.foodsApiService=m(ne),this.foodIdFromRoute=A(void 0,{alias:"id"}),this.url=H(this.route.url,{initialValue:[]}),this.mode=S(()=>this.url().some(o=>o.path===y.CREATE)?"create":"edit"),this.food=J({loader:()=>{let o=this.foodIdFromRoute();return o?this.foodsApiService.getFoodById(o):W(null)}}),this.isSaveLoading=s(!1),this.titleCaseSelector=o=>o?this.titleCasePipe.transform(o):"",this.foodFormSignal={name:s(null),calories:s(null),protein:s(null),fat:s(null),unit:s(null),amount:s(null)},this.foodFormValue=S(()=>{let o=this.foodFormSignal.name();if(!o)return null;let a=this.foodFormSignal.fat(),e=te(a),n=this.foodFormSignal.calories(),t=n?Number(n):null;if(!t)return null;let _=this.foodFormSignal.protein(),C=_?Number(_):null;if(!C)return null;let w=this.foodFormSignal.unit();if(!w)return null;let P=this.foodFormSignal.amount(),T=P?Number(P):null;return T?{name:o,calories:t,protein:C,fat:e,unit:w,amount:T}:null}),this.foodFormEnabled=s(!0),this.foodFormValid=S(()=>{let o=this.foodFormValue();if(!o)return!1;let{name:a,calories:e,protein:n,unit:t,fat:_,amount:C}=o;return!0}),j(()=>{let o=this.food.value();o&&(this.foodFormSignal.name.set(o.name),this.foodFormSignal.calories.set(o.calories.toString()),this.foodFormSignal.protein.set(o.protein.toString()),this.foodFormSignal.fat.set(o.fat?.toString()??""),this.foodFormSignal.unit.set(o.unit),this.foodFormSignal.amount.set(o.amount.toString()))})}openDeleteModal(){let o=this.modalService.open($,{centered:!0});o.componentInstance.configurate({title:"Delete Record",subtitle:"<strong>Are you sure you want to delete this record?</strong>",body:'This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>',okType:"danger"}),o.closed.pipe(V(1)).subscribe(async()=>{let e=this.food.value();if(e?.foodId)try{await h(this.foodsApiService.deleteFood(e.foodId)),this.router.navigate([y.FOODS])}catch(n){let t=n;this.toastService.error(`${t.message}`)}})}async save(){let o=this.foodFormValue();if(!o||!this.foodFormValid())return;this.isSaveLoading.set(!0),this.foodFormEnabled.set(!1);let a={foodId:this.food.value()?.foodId??null,name:o.name,calories:o.calories,protein:o.protein,fat:o.fat,unit:o.unit.toLowerCase(),amount:o.amount};try{this.mode()==="create"?await h(this.foodsApiService.createFood(a)):await h(this.foodsApiService.updateFood(a))}catch{this.toastService.error("An error occurred while saving this food.")}finally{this.isSaveLoading.set(!1),this.foodFormEnabled.set(!0),this.router.navigate([y.FOODS])}}cancel(){this.location.back()}static{this.\u0275fac=function(a){return new(a||l)}}static{this.\u0275cmp=N({type:l,selectors:[["edit-food-page"]],inputs:{foodIdFromRoute:[1,"id","foodIdFromRoute"]},decls:28,vars:22,consts:[[1,"header-footer-padding"],[1,"container"],[1,"pb-3"],[1,"title"],[1,"mb-3"],["type","text","placeholder","Name",1,"form-control",3,"ngModelChange","ngModel","disabled"],["type","text","placeholder","Calories","onlyNumbers","",1,"form-control",3,"ngModelChange","ngModel","disabled"],["type","text","placeholder","Protein","onlyNumbers","",1,"form-control",3,"ngModelChange","ngModel","disabled"],["type","text","placeholder","Fat","onlyNumbers","",1,"form-control",3,"ngModelChange","ngModel","disabled"],["placeholder","Unit",3,"valueChange","value","items","disabled"],["type","text","placeholder","Amount Per Unit","onlyNumbers","",1,"form-control",3,"ngModelChange","ngModel","disabled"],[1,"row","g-2","mb-3"],[1,"col"],["type","button",1,"btn","btn-secondary","w-100",3,"click"],["type","button",1,"btn","w-100","d-flex","justify-content-center","align-items-center",3,"click","disabled"],["aria-hidden","true",1,"fa","fa-save","px-2"],["type","button",1,"btn","btn-danger","w-100","delete-button"],["aria-hidden","true",1,"spinner-border","spinner-border-sm","mx-2"],["role","status",1,"visually-hidden"],["type","button",1,"btn","btn-danger","w-100","delete-button",3,"click"],["aria-hidden","true",1,"fa","fa-trash","px-2"]],template:function(a,e){a&1&&(i(0,"div",0)(1,"div",1)(2,"div",2)(3,"h4",3),g(4),r()(),i(5,"div")(6,"div",4)(7,"input",5),c("ngModelChange",function(t){return f(e.foodFormSignal.name,t)||(e.foodFormSignal.name=t),t}),r()(),i(8,"div",4)(9,"input",6),c("ngModelChange",function(t){return f(e.foodFormSignal.calories,t)||(e.foodFormSignal.calories=t),t}),r()(),i(10,"div",4)(11,"input",7),c("ngModelChange",function(t){return f(e.foodFormSignal.protein,t)||(e.foodFormSignal.protein=t),t}),r()(),i(12,"div",4)(13,"input",8),c("ngModelChange",function(t){return f(e.foodFormSignal.fat,t)||(e.foodFormSignal.fat=t),t}),r()(),i(14,"div",4)(15,"app-typeahead",9),c("valueChange",function(t){return f(e.foodFormSignal.unit,t)||(e.foodFormSignal.unit=t),t}),r()(),i(16,"div",4)(17,"input",10),c("ngModelChange",function(t){return f(e.foodFormSignal.amount,t)||(e.foodFormSignal.amount=t),t}),r()()(),i(18,"div",11)(19,"div",12)(20,"button",13),F("click",function(){return e.cancel()}),g(21," Cancel "),r()(),i(22,"div",12)(23,"button",14),F("click",function(){return e.save()}),v(24,re,1,0,"i",15)(25,ae,3,0),g(26," Save "),r()()(),v(27,de,4,0,"button",16),r()()),a&2&&(d(4),R("",e.mode()==="edit"?"Edit":"Create"," Food"),d(3),p("ngModel",e.foodFormSignal.name),u("disabled",!e.foodFormEnabled()),d(2),p("ngModel",e.foodFormSignal.calories),u("disabled",!e.foodFormEnabled()),d(2),p("ngModel",e.foodFormSignal.protein),u("disabled",!e.foodFormEnabled()),d(2),p("ngModel",e.foodFormSignal.fat),u("disabled",!e.foodFormEnabled()),d(2),p("value",e.foodFormSignal.unit),u("items",B(21,ie))("disabled",!e.foodFormEnabled()),d(2),p("ngModel",e.foodFormSignal.amount),u("disabled",!e.foodFormEnabled()),d(6),D("btn-primary",e.foodFormValid())("btn-secondary",!e.foodFormValid()),u("disabled",!e.foodFormValid()||e.isSaveLoading()),d(),M(e.isSaveLoading()?25:24),d(3),M(e.mode()==="edit"?27:-1))},dependencies:[Y,K,Q,X,ee,oe],styles:["[_nghost-%COMP%]{--bs-body-bg: var(--light-bg);--bs-body-color: var(--font-color);--bs-tertiary-bg: var(--primary);--bs-border-width: 1px;--bs-border-color: rgba(255, 255, 255, .15)}.card[_ngcontent-%COMP%]{--bs-card-spacer-y: .5rem;--bs-card-spacer-x: .5rem}.title[_ngcontent-%COMP%]{margin:0}.subtitle[_ngcontent-%COMP%]{font-size:14px;opacity:.7}.card[_ngcontent-%COMP%]{background-color:var(--bg);border:1px solid rgba(255,255,255,.1)}.serie-label[_ngcontent-%COMP%]{font-size:12px;color:#ffffffbf;padding:0 .5rem}.delete-button[_ngcontent-%COMP%]{background-color:#301b23;--bs-btn-border-color: #6e363b;color:#fa8989}"],changeDetection:0})}}return l})();export{we as EditFoodPageComponent};
