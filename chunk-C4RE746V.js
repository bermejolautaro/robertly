import{a as ye}from"./chunk-7RCPJ3GN.js";import{a as Se}from"./chunk-FGULLVOY.js";import{A as xe,G as fe,I as ve,J as _e,K as Ce,M as Le,N as be,O as Ee,P as E,a as te,b as ie,c as k,d as oe,e as re,f as ne,g as ae,h as se,j as le,k as ce,m as de,p as pe,q as me,r as ue,s as ge,t as he}from"./chunk-CBB45TFN.js";import{f as Q,h as W,j as X,l as Z,m as ee}from"./chunk-T2LPKCIQ.js";import{Ab as m,Fb as x,Gb as f,Hb as v,Hc as V,Ib as _,Ic as J,Jb as s,Jc as U,Kb as n,Kc as $,Lb as u,Ob as Y,Sb as I,T as M,Tb as g,a as O,b as B,bb as a,cc as c,dc as F,ec as C,g as N,jb as q,nc as K,oc as z,pa as p,pc as H,rc as b,sc as A,tb as G,tc as R,v as j,xa as y,ya as S,yb as h,z as P}from"./chunk-D6SZDTIS.js";var Ie=t=>({"justify-content-between":t}),Ve=(t,o)=>({"btn-primary":t,"btn-secondary":o}),ke=()=>[];function Te(t,o){if(t&1&&(s(0,"div",20),c(1),n()),t&2){let e=o.$implicit;a(),F(e.value)}}function we(t,o){if(t&1&&(v(0,Te,2,1,"div",20,f),b(2,"keyvalue")),t&2){let e,i=g(2);_(A(2,0,(e=i.formGroup().errors)==null?null:e.exercise))}}function De(t,o){t&1&&(s(0,"div",14),u(1,"i",21),c(2," You have unsaved changes "),n())}function Pe(t,o){if(t&1&&(s(0,"div",15)(1,"span",22),c(2),n(),u(3,"input",23)(4,"input",24),n()),t&2){let e=o.$implicit,i=o.$index;a(2),C("Serie ",i+1,""),a(),m("formControl",e.controls.reps),a(),m("formControl",e.controls.weightInKg)}}function Me(t,o){if(t&1&&(s(0,"div",20),c(1),n()),t&2){let e=o.$implicit;a(),F(e.value)}}function Ge(t,o){if(t&1&&(v(0,Me,2,1,"div",20,f),b(2,"keyvalue")),t&2){let e,i=g(2);_(A(2,0,(e=i.formGroup().errors)==null?null:e.series))}}function Ye(t,o){if(t&1){let e=Y();s(0,"button",25),I("click",function(){y(e);let r=g(2);return S(r.openDeleteModal())}),c(1," Delete "),n()}}function Fe(t,o){if(t&1&&u(0,"app-exercise-log",28),t&2){let e=o.$implicit;m("exerciseLog",e)}}function Ae(t,o){if(t&1&&(s(0,"ul",30)(1,"li",31),c(2),n(),s(3,"li",32),c(4),b(5,"number"),n()()),t&2){let e=o.$implicit,i=o.$index;a(2),C("Serie ",i+1,""),a(2),C("",R(5,2,e.brzycki,"1.2-2"),"kg")}}function Re(t,o){if(t&1&&(s(0,"div",26)(1,"div",27),c(2,"Previous entries"),n(),v(3,Fe,1,1,"app-exercise-log",28,f),n(),s(5,"div",29)(6,"div",27),c(7,"Possible 1RM (Brzycky Formula)"),n(),v(8,Ae,6,5,"ul",30,f),s(10,"ul",30)(11,"li",31),c(12,"Average"),n(),s(13,"li",32),c(14),b(15,"number"),n()()()),t&2){let e,i,r,l=g(2);a(3),_((e=(e=l.originalValue.value())==null?null:e.recentLogs)!==null&&e!==void 0?e:K(4,ke)),a(5),_((i=l.originalValue.value())==null?null:i.series),a(6),C("",R(15,1,(r=l.originalValue.value())==null?null:r.brzyckiAverage,"1.2-2"),"kg")}}function Ue(t,o){if(t&1){let e=Y();s(0,"div",1)(1,"div",3)(2,"h4",4),c(3),n()(),s(4,"div",5)(5,"form"),u(6,"input",6),s(7,"div",7),u(8,"input",8),n(),s(9,"div",9),u(10,"app-typeahead",10),n(),s(11,"div",11)(12,"div",12),u(13,"app-typeahead",13),n(),h(14,we,3,2),n(),h(15,De,3,0,"div",14),v(16,Pe,5,3,"div",15,f),h(18,Ge,3,2),n()(),s(19,"div",16),h(20,Ye,2,0,"button",17),s(21,"button",18),I("click",function(){y(e);let r=g();return S(r.cancel())}),c(22," Cancel "),n(),s(23,"button",19,0),I("click",function(){y(e);let r=g();return S(r.save())}),c(25," Save "),n(),h(26,Re,16,5),n()()}if(t&2){let e=g();a(3),C(" ",e.mode()==="edit"?"Edit":"Create"," Log "),a(5),m("formControl",e.formGroup().controls.date),a(2),m("control",e.formGroup().controls.user)("items",e.users())("itemSelector",e.userSelector),a(3),m("control",e.formGroup().controls.exercise)("items",e.exerciseLogService.exercises())("itemSelector",e.exerciseSelector),a(),x(e.formGroup().controls.exercise.pristine?-1:14),a(),x(e.hasUnsavedChanges()?15:-1),a(),_(e.formGroup().controls.series.controls),a(2),x(e.formGroup().controls.series.pristine?-1:18),a(),m("ngClass",z(16,Ie,e.mode()==="edit")),a(),x(e.mode()==="edit"?20:-1),a(3),m("ngClass",H(18,Ve,e.formGroup().valid,e.formGroup().invalid))("disabled",e.formGroup().invalid),a(3),x(e.mode()==="edit"?26:-1)}}function $e(t,o){t&1&&(s(0,"div",2)(1,"div",33)(2,"span",34),c(3,"Loading..."),n()()())}var ht=(()=>{class t{constructor(){this.exerciseLogService=p(ne),this.authService=p(Le),this.location=p(Q),this.router=p(ie),this.toastService=p(Ce),this.exerciseLogApiService=p(ae),this.titleCasePipe=p(X),this.dayjsService=p(_e),this.dayjs=this.dayjsService.instance,this.route=p(te),this.modalService=p(xe),this.isLoading=J(()=>this.originalValue.isLoading()),this.paramMap=k(this.route.paramMap),this.exerciseLogId=V(()=>this.paramMap()?.get(E.LOGS_ID_PARAM)),this.url=k(this.route.url,{initialValue:[]}),this.mode=V(()=>this.url().some(e=>e.path===E.LOGS_CREATE)?"create":"edit"),this.formGroup=G(be()),this.formGroupValue=k(this.formGroup().valueChanges),this.userSelector=e=>typeof e=="string"?"":e?.name??"",this.exerciseSelector=e=>typeof e=="string"?"":this.titleCasePipe.transform(e?.name)??"",this.users=V(()=>{let e=this.authService.user();return[e,...e?.assignedUsers??[]]}),this.originalValue=oe({request:this.exerciseLogId,loader:({request:e})=>{let i=Number(e);return i?this.exerciseLogApiService.getExerciseLogById(i):j(null)}}),this.#e=$(()=>{let e=this.mode(),i=this.originalValue.value(),{user:r}=U(()=>({user:this.authService.user()}));e==="create"&&U(()=>{let l=this.dayjs().format("YYYY-MM-DD");this.formGroup.update(d=>(d.patchValue({date:l,user:r?.name??""}),d))}),e==="edit"&&i&&this.formGroup.update(l=>(l.reset(),l.patchValue({exercise:i.exercise,date:this.dayjsService.parseDate(i.date).format("YYYY-MM-DD"),user:i.user,series:i.series.map(d=>({exerciseLogId:d.exerciseLogId,serieId:d.serieId,reps:d.reps,weightInKg:d.weightInKg}))}),l))}),this.hasUnsavedChanges=G(!1),this.#t=$(()=>{let e=this.formGroupValue(),i=this.originalValue.value(),r=this.mode();if(!e){this.hasUnsavedChanges.set(!1);return}let l={series:T(i?.series.map(w=>B(O({},w),{brzycki:null})))??[]},d={series:T(e.series)};this.hasUnsavedChanges.set(r==="edit"&&!re(l,d))})}#e;#t;openDeleteModal(){let e=this.modalService.open(Ee,{centered:!0}),i=e.componentInstance;i.title="Delete Record",i.subtitle="<strong>Are you sure you want to delete this record?</strong>",i.body='This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>',i.okType="danger",e.closed.pipe(M(1)).subscribe(()=>{this.exerciseLogService.deleteLog$.next(this.originalValue.value())})}save(){return N(this,null,function*(){let e=this.mode(),i=this.formGroup();this.isLoading.set(!0);let r=i.value.user,l=i.value.exercise,d=this.dayjsService.parseDate(i.value.date),w=this.originalValue.value();if(!r)throw new Error("User cannot be null");if(i.valid&&typeof l!="string"&&l&&typeof r!="string"&&r){if(e==="create"){let D=Oe(i,r,l,d);try{let L=yield P(this.exerciseLogApiService.createExerciseLog(D));localStorage.removeItem(ve),this.toastService.ok("Log created successfully!"),this.router.navigate([E.LOGS,E.LOGS_EDIT,L])}catch(L){this.toastService.error(`${L}`)}}if(e==="edit"){let D=Ne(w?.id,i,r,l,d);try{yield P(this.exerciseLogApiService.updateExerciseLog(D)),this.toastService.ok("Log updated successfully!"),this.originalValue.reload()}catch(L){this.toastService.error(`${L}`)}}}this.isLoading.set(!1)})}cancel(){this.exerciseLogService.refreshLogs$.pipe(M(1)).subscribe(()=>{this.location.back()}),this.exerciseLogService.refreshLogs$.next()}static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275cmp=q({type:t,selectors:[["edit-exercise-log-page"]],decls:2,vars:1,consts:[["saveButton",""],[1,"footer-padding"],[1,"position-absolute","top-50","start-50","translate-middle"],[1,"modal-header"],["id","modal-basic-title",1,"modal-title"],[1,"modal-body"],["type","text","autofocus","autofocus",2,"display","none"],[1,"mb-2"],["type","date","placeholder","DD-MM-YYYY",1,"form-control",3,"formControl"],[1,"col-12","mb-2"],["placeholder","User",3,"control","items","itemSelector"],[1,"mb-3"],[1,"input-group"],["placeholder","Exercise",3,"control","items","itemSelector"],[1,"mb-2","px-2"],[1,"input-group","mb-2","align-items-center"],[1,"modal-footer",3,"ngClass"],["type","button",1,"btn","btn-danger","me-auto"],["type","button",1,"btn","btn-secondary",3,"click"],["type","button",1,"btn",3,"click","ngClass","disabled"],[1,"d-block","invalid-feedback"],["aria-hidden","true",1,"fa","fa-exclamation-circle"],[1,"input-group-text"],["type","number","placeholder","Reps",1,"form-control",3,"formControl"],["type","number","placeholder","Kg",1,"form-control",3,"formControl"],["type","button",1,"btn","btn-danger","me-auto",3,"click"],[1,"pt-5","w-100"],[1,"pb-2"],[1,"w-100",3,"exerciseLog"],[1,"pt-3","w-100"],[1,"list-group","list-group-horizontal","pb-1"],[1,"list-group-item","active"],[1,"list-group-item"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(i,r){i&1&&h(0,Ue,27,21,"div",1)(1,$e,4,0,"div",2),i&2&&x(r.isLoading()?1:0)},dependencies:[he,pe,se,me,le,ce,ue,ge,de,fe,ye,Se,Z,ee,W],styles:["[_nghost-%COMP%]{display:block;padding:0 .5rem;--bs-heading-color: white;--bs-modal-color: white;--bs-body-bg: var(--light-bg);--bs-body-color: var(--font-color);--bs-tertiary-bg: var(--primary);--bs-border-width: 0;--bs-modal-footer-border-width: 0;--bs-modal-header-border-width: 0;--bs-modal-header-padding: .5rem}.list-group[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 3fr;--bs-list-group-bg: var(--light-bg)}.list-group[_ngcontent-%COMP%]   .active[_ngcontent-%COMP%]{--bs-list-group-active-bg: var(--primary)}"],changeDetection:0})}}return t})();function Oe(t,o,e,i){return Be(o?.userId,o?.name??t.value.user,e.exerciseId,i,T(t.value.series))}function Be(t,o,e,i,r){return je(null,t,o,e,i,r)}function Ne(t,o,e,i,r){return{id:t,exerciseLog:{exerciseLogUsername:e?.name,exerciseLogUserId:e.userId,exerciseLogExerciseId:i.exerciseId,exerciseLogDate:r.format("YYYY-MM-DD"),series:T(o.value.series)}}}function je(t,o,e,i,r,l){return{id:t?.id,exerciseLog:{exerciseLogUsername:e.toLocaleLowerCase(),exerciseLogUserId:o,exerciseLogExerciseId:i,exerciseLogDate:r.format("YYYY-MM-DD"),series:l}}}function qe(t){return{exerciseLogId:t.exerciseLogId,serieId:t.serieId,reps:+t.reps,weightInKg:+t.weightInKg.toFixed(1),brzycki:null}}function T(t){return(t??[]).filter(o=>!!o.reps&&!!o.weightInKg).map(qe)}export{ht as EditExerciseLogPageComponent};