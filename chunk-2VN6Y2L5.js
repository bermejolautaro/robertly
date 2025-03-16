import{a as Q}from"./chunk-JSAGN3LZ.js";import{c as G,d as D,m as B,n as H,p as J,q as K,w as m}from"./chunk-QQUWNONX.js";import{B as Y,J as $,b as S,e as N,f,g as V,h as O,i as R,j as q,k as g,m as j,o as z,q as U,r as X}from"./chunk-DWM6OEN4.js";import{Bb as h,Fb as n,Gb as o,Hb as c,Hc as I,Ka as y,Kb as M,Lc as L,Mb as b,Nb as T,R as E,Ya as s,Yb as l,_b as k,ib as F,ma as a,nb as u,ua as _,va as w,wb as d,x as p,xc as v,yb as P,yc as A}from"./chunk-QHOELIAC.js";function Z(i,x){i&1&&(n(0,"div",8),c(1,"i",15),l(2," You have unsaved changes "),o())}function ee(i,x){i&1&&c(0,"i",13)}function te(i,x){i&1&&(c(0,"span",16),n(1,"span",17),l(2,"Loading..."),o())}function ie(i,x){if(i&1){let e=M();n(0,"button",18),b("click",function(){_(e);let t=T();return w(t.openDeleteModal())}),c(1,"i",19),n(2,"span"),l(3,"Delete"),o()()}}var Ce=(()=>{class i{constructor(){this.exerciseApiService=a(B),this.location=a(I),this.router=a(D),this.toastService=a(H),this.titleCasePipe=a(L),this.route=a(G),this.modalService=a(Y),this.authService=a(J),this.paramMap=S(this.route.paramMap),this.exerciseId=v(()=>this.paramMap()?.get(m.ID)),this.url=S(this.route.url,{initialValue:[]}),this.hasUnsavedChanges=y(!1),this.isSaveLoading=y(!1),this.mode=v(()=>this.url().some(e=>e.path===m.CREATE)?"create":"edit"),this.titleCaseSelector=e=>e?this.titleCasePipe.transform(e):"",this.exercise=v(()=>{let e=this.exerciseId();return this.exerciseApiService.exercises().find(r=>r.exerciseId===Number(e))}),this.#e=A(()=>{let e=this.exercise();e&&this.exerciseForm.patchValue({name:e.name,muscleGroup:e.muscleGroup,type:e.type})}),this.exerciseForm=new R({name:new g("",[f.required]),muscleGroup:new g("",[f.required]),type:new g("",[f.required])})}#e;openDeleteModal(){let e=this.modalService.open(K,{centered:!0}),r=e.componentInstance;r.title.set("Delete Record"),r.subtitle.set("<strong>Are you sure you want to delete this record?</strong>"),r.body.set('This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>'),r.okType.set("danger"),e.closed.pipe(E(1)).subscribe(async()=>{let t=this.exercise();if(t?.exerciseId)try{await p(this.exerciseApiService.deleteExercise(t.exerciseId)),this.router.navigate([m.EXERCISES])}catch(C){let W=C;this.toastService.error(`${W.message}`)}})}async save(){if(this.isSaveLoading.set(!0),this.exerciseForm.disable(),this.mode()==="create"){let e={name:this.exerciseForm.value.name.toLowerCase(),muscleGroup:this.exerciseForm.value.muscleGroup.toLowerCase(),type:this.exerciseForm.value.type.toLowerCase()};await p(this.exerciseApiService.createExercise(e))}else{let e={exerciseId:this.exercise().exerciseId,name:this.exerciseForm.value.name.toLowerCase(),muscleGroup:this.exerciseForm.value.muscleGroup.toLowerCase(),type:this.exerciseForm.value.type.toLowerCase()};await p(this.exerciseApiService.updateExercise(e))}this.isSaveLoading.set(!1),this.exerciseForm.enable(),this.router.navigate([m.EXERCISES])}cancel(){this.location.back()}static{this.\u0275fac=function(r){return new(r||i)}}static{this.\u0275cmp=F({type:i,selectors:[["edit-exercise-page"]],decls:24,vars:16,consts:[[1,"header-footer-padding"],[1,"container"],[1,"pb-3"],[1,"title"],[1,"mb-3"],["type","text","placeholder","Name",1,"form-control",3,"formControl"],["placeholder","Muscle Group",3,"control","items","itemSelector"],["placeholder","Type",3,"control","items","itemSelector"],[1,"mb-2","px-2"],[1,"row","g-2","mb-3"],[1,"col"],["type","button",1,"btn","btn-secondary","w-100",3,"click"],["type","button",1,"btn","w-100","d-flex","justify-content-center","align-items-center",3,"click","disabled"],["aria-hidden","true",1,"fa","fa-save","px-2"],["type","button",1,"btn","btn-danger","w-100","delete-button"],["aria-hidden","true",1,"fa","fa-exclamation-circle"],["aria-hidden","true",1,"spinner-border","spinner-border-sm","mx-2"],["role","status",1,"visually-hidden"],["type","button",1,"btn","btn-danger","w-100","delete-button",3,"click"],["aria-hidden","true",1,"fa","fa-trash","px-2"]],template:function(r,t){r&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h4",3),l(4),o()(),n(5,"div")(6,"form")(7,"div",4),c(8,"input",5),o(),n(9,"div",4),c(10,"app-typeahead",6),o(),n(11,"div",4),c(12,"app-typeahead",7),o(),u(13,Z,3,0,"div",8),o()(),n(14,"div",9)(15,"div",10)(16,"button",11),b("click",function(){return t.cancel()}),l(17," Cancel "),o()(),n(18,"div",10)(19,"button",12),b("click",function(){return t.save()}),u(20,ee,1,0,"i",13)(21,te,3,0),l(22," Save "),o()()(),u(23,ie,4,0,"button",14),o()()),r&2&&(s(4),k("",t.mode()==="edit"?"Edit":"Create"," Exercise"),s(4),d("formControl",t.exerciseForm.controls.name),s(2),d("control",t.exerciseForm.controls.muscleGroup)("items",t.exerciseApiService.muscleGroups())("itemSelector",t.titleCaseSelector),s(2),d("control",t.exerciseForm.controls.type)("items",t.exerciseApiService.types())("itemSelector",t.titleCaseSelector),s(),h(t.hasUnsavedChanges()?13:-1),s(6),P("btn-primary",t.exerciseForm.valid)("btn-secondary",t.exerciseForm.invalid),d("disabled",t.exerciseForm.invalid||t.isSaveLoading()),s(),h(t.isSaveLoading()?21:20),s(3),h(t.mode()==="edit"?23:-1))},dependencies:[X,j,N,V,O,z,U,q,$,Q],styles:["[_nghost-%COMP%]{--bs-body-bg: var(--light-bg);--bs-body-color: var(--font-color);--bs-tertiary-bg: var(--primary);--bs-border-width: 1px;--bs-border-color: rgba(255, 255, 255, .15)}.card[_ngcontent-%COMP%]{--bs-card-spacer-y: .5rem;--bs-card-spacer-x: .5rem}.title[_ngcontent-%COMP%]{margin:0}.subtitle[_ngcontent-%COMP%]{font-size:14px;opacity:.7}.card[_ngcontent-%COMP%]{background-color:var(--bg);border:1px solid rgba(255,255,255,.1)}.serie-label[_ngcontent-%COMP%]{font-size:12px;color:#ffffffbf;padding:0 .5rem}.delete-button[_ngcontent-%COMP%]{background-color:#301b23;--bs-btn-border-color: #6e363b;color:#fa8989}"],changeDetection:0})}}return i})();export{Ce as EditExercisePageComponent};
