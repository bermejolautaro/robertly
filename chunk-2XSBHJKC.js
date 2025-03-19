import{a as W}from"./chunk-LJA7ROG2.js";import{c as G,d as R,m as K,n as Q,q as U,w as b}from"./chunk-6PXCT3Y7.js";import{A as H,I as J,b as D,e as V,f as u,g as N,h as O,i as q,j,k as h,m as z,o as X,p as $,q as B}from"./chunk-FDMSHLJI.js";import{Bb as x,Fb as r,Gb as o,Hb as a,Ia as _,Jc as I,Ka as F,Kb as M,Mb as p,Nb as T,Nc as L,R as y,Ya as s,Yb as l,_b as k,ib as w,ma as n,nb as v,ua as S,va as E,wb as d,x as m,yb as P,yc as g,zc as A}from"./chunk-SEHCXKDS.js";function Z(i,C){i&1&&a(0,"i",12)}function ee(i,C){i&1&&(a(0,"span",14),r(1,"span",15),l(2,"Loading..."),o())}function te(i,C){if(i&1){let e=M();r(0,"button",16),p("click",function(){S(e);let t=T();return E(t.openDeleteModal())}),a(1,"i",17),r(2,"span"),l(3,"Delete"),o()()}}var xe=(()=>{class i{constructor(){this.location=n(I),this.router=n(R),this.toastService=n(Q),this.titleCasePipe=n(L),this.route=n(G),this.modalService=n(H),this.exerciseApiService=n(K),this.exerciseIdFromRoute=_(void 0,{alias:"id"}),this.url=D(this.route.url,{initialValue:[]}),this.mode=g(()=>this.url().some(e=>e.path===b.CREATE)?"create":"edit"),this.exercise=g(()=>this.exerciseApiService.exercises().find(e=>e.exerciseId===this.exerciseIdFromRoute())),this.isSaveLoading=F(!1),this.titleCaseSelector=e=>e?this.titleCasePipe.transform(e):"",this.exerciseForm=new q({name:new h("",[u.required]),muscleGroup:new h("",[u.required]),type:new h("",[u.required])}),A(()=>{let e=this.exercise();e&&this.exerciseForm.patchValue({name:e.name,muscleGroup:e.muscleGroup,type:e.type})})}openDeleteModal(){let e=this.modalService.open(U,{centered:!0});e.componentInstance.configurate({title:"Delete Record",subtitle:"<strong>Are you sure you want to delete this record?</strong>",body:'This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>',okType:"danger"}),e.closed.pipe(y(1)).subscribe(async()=>{let t=this.exercise();if(t?.exerciseId)try{await m(this.exerciseApiService.deleteExercise(t.exerciseId)),this.router.navigate([b.EXERCISES])}catch(f){let Y=f;this.toastService.error(`${Y.message}`)}})}async save(){this.isSaveLoading.set(!0),this.exerciseForm.disable();try{if(this.mode()==="create"){let e={name:this.exerciseForm.value.name.toLowerCase(),muscleGroup:this.exerciseForm.value.muscleGroup.toLowerCase(),type:this.exerciseForm.value.type.toLowerCase()};await m(this.exerciseApiService.createExercise(e))}else{let e={exerciseId:this.exercise().exerciseId,name:this.exerciseForm.value.name.toLowerCase(),muscleGroup:this.exerciseForm.value.muscleGroup.toLowerCase(),type:this.exerciseForm.value.type.toLowerCase()};await m(this.exerciseApiService.updateExercise(e))}}catch{this.toastService.error("An error occurred while saving the exercise.")}finally{this.isSaveLoading.set(!1),this.exerciseForm.enable(),this.router.navigate([b.EXERCISES])}}cancel(){this.location.back()}static{this.\u0275fac=function(c){return new(c||i)}}static{this.\u0275cmp=w({type:i,selectors:[["edit-exercise-page"]],inputs:{exerciseIdFromRoute:[1,"id","exerciseIdFromRoute"]},decls:23,vars:15,consts:[[1,"header-footer-padding"],[1,"container"],[1,"pb-3"],[1,"title"],[1,"mb-3"],["type","text","placeholder","Name",1,"form-control",3,"formControl"],["placeholder","Muscle Group",3,"control","items","itemSelector"],["placeholder","Type",3,"control","items","itemSelector"],[1,"row","g-2","mb-3"],[1,"col"],["type","button",1,"btn","btn-secondary","w-100",3,"click"],["type","button",1,"btn","w-100","d-flex","justify-content-center","align-items-center",3,"click","disabled"],["aria-hidden","true",1,"fa","fa-save","px-2"],["type","button",1,"btn","btn-danger","w-100","delete-button"],["aria-hidden","true",1,"spinner-border","spinner-border-sm","mx-2"],["role","status",1,"visually-hidden"],["type","button",1,"btn","btn-danger","w-100","delete-button",3,"click"],["aria-hidden","true",1,"fa","fa-trash","px-2"]],template:function(c,t){c&1&&(r(0,"div",0)(1,"div",1)(2,"div",2)(3,"h4",3),l(4),o()(),r(5,"div")(6,"form")(7,"div",4),a(8,"input",5),o(),r(9,"div",4),a(10,"app-typeahead",6),o(),r(11,"div",4),a(12,"app-typeahead",7),o()()(),r(13,"div",8)(14,"div",9)(15,"button",10),p("click",function(){return t.cancel()}),l(16," Cancel "),o()(),r(17,"div",9)(18,"button",11),p("click",function(){return t.save()}),v(19,Z,1,0,"i",12)(20,ee,3,0),l(21," Save "),o()()(),v(22,te,4,0,"button",13),o()()),c&2&&(s(4),k("",t.mode()==="edit"?"Edit":"Create"," Exercise"),s(4),d("formControl",t.exerciseForm.controls.name),s(2),d("control",t.exerciseForm.controls.muscleGroup)("items",t.exerciseApiService.muscleGroups())("itemSelector",t.titleCaseSelector),s(2),d("control",t.exerciseForm.controls.type)("items",t.exerciseApiService.types())("itemSelector",t.titleCaseSelector),s(6),P("btn-primary",t.exerciseForm.valid)("btn-secondary",t.exerciseForm.invalid),d("disabled",t.exerciseForm.invalid||t.isSaveLoading()),s(),x(t.isSaveLoading()?20:19),s(3),x(t.mode()==="edit"?22:-1))},dependencies:[B,z,V,N,O,X,$,j,J,W],styles:["[_nghost-%COMP%]{--bs-body-bg: var(--light-bg);--bs-body-color: var(--font-color);--bs-tertiary-bg: var(--primary);--bs-border-width: 1px;--bs-border-color: rgba(255, 255, 255, .15)}.card[_ngcontent-%COMP%]{--bs-card-spacer-y: .5rem;--bs-card-spacer-x: .5rem}.title[_ngcontent-%COMP%]{margin:0}.subtitle[_ngcontent-%COMP%]{font-size:14px;opacity:.7}.card[_ngcontent-%COMP%]{background-color:var(--bg);border:1px solid rgba(255,255,255,.1)}.serie-label[_ngcontent-%COMP%]{font-size:12px;color:#ffffffbf;padding:0 .5rem}.delete-button[_ngcontent-%COMP%]{background-color:#301b23;--bs-btn-border-color: #6e363b;color:#fa8989}"],changeDetection:0})}}return i})();export{xe as EditExercisePageComponent};
