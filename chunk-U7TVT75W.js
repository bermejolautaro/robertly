import{a as z}from"./chunk-EVLGUXNR.js";import{a as ye}from"./chunk-W7GTON6N.js";import{a as Ce}from"./chunk-5THT56CE.js";import{a as Ee}from"./chunk-3RPW3WBY.js";import"./chunk-6I2ARSHA.js";import{a as Se,b as be}from"./chunk-47Y6SWWH.js";import{a as ve}from"./chunk-U2RSITBA.js";import{c as ne,d as oe,k as ue,m as he,n as _e,p as fe,q as xe,w}from"./chunk-H7UNI6XH.js";import{A as pe,I as me,b as N,d as se,f as ae,h as le,m as de,p as ce,q as ge}from"./chunk-TXMB3Z4A.js";import{$b as E,Ac as Z,Bb as v,Cb as M,Db as P,Eb as T,Fb as l,Gb as s,Hb as S,Ia as G,Jc as ee,Ka as a,Kb as A,Mb as Y,Nb as u,Nc as ie,Pc as te,Qc as re,R as H,Ya as d,Yb as p,_b as V,ac as y,bc as L,cc as B,dc as J,ec as U,ib as X,jc as D,lc as O,ma as h,mc as R,nb as b,t as q,ua as f,va as x,wb as C,wc as Q,x as K,xc as F,yb as $,yc as I,zc as j}from"./chunk-SEHCXKDS.js";function Le(t,c){t&1&&(l(0,"div",14),S(1,"i",22),p(2," You have unsaved changes "),s())}function Ie(t,c){if(t&1){let e=A();l(0,"div",15)(1,"div",23)(2,"div",24)(3,"input",25),L("ngModelChange",function(i){let o=f(e).$implicit;return y(o().reps,i)||(o().reps=i),x(i)}),s()(),l(4,"div",24)(5,"input",26),L("ngModelChange",function(i){let o=f(e).$implicit;return y(o().weightInKg,i)||(o().weightInKg=i),x(i)}),s()()()()}if(t&2){let e=c.$implicit,r=u(2);d(3),E("ngModel",e().reps),C("disabled",!r.formEnabled()),d(2),E("ngModel",e().weightInKg),C("disabled",!r.formEnabled())}}function we(t,c){t&1&&S(0,"i",20)}function Me(t,c){t&1&&(S(0,"span",27),l(1,"span",28),p(2,"Loading..."),s())}function Pe(t,c){if(t&1&&S(0,"app-exercise-log",32),t&2){let e=c.$implicit;C("exerciseLog",e)}}function Te(t,c){if(t&1&&(l(0,"div",29)(1,"div",30)(2,"div",31),p(3,"Previous entries"),s(),P(4,Pe,1,1,"app-exercise-log",32,M),D(6,"slice"),s()()),t&2){u(2);let e=U(30);d(4),T(R(6,0,e.recentLogs,0,3))}}function Ve(t,c){if(t&1&&S(0,"app-exercise-log",32),t&2){let e=c.$implicit;C("exerciseLog",e)}}function De(t,c){if(t&1&&(l(0,"div",29)(1,"div",30)(2,"div",31),p(3,"Recently Updated"),s(),P(4,Ve,1,1,"app-exercise-log",32,M),D(6,"slice"),s()()),t&2){let e=u(3);d(4),T(R(6,0,e.exerciseLogApiService.recentlyUpdated(),0,3))}}function ke(t,c){if(t&1&&(l(0,"span",33),p(1),s(),l(2,"ul",34)(3,"li",35),p(4),D(5,"number"),s()()),t&2){let e=c.$implicit,r=c.$index;d(),V("Serie ",r+1,""),d(3),V("",O(5,2,e.brzycki,"1.2-2"),"kg")}}function Ke(t,c){if(t&1&&(l(0,"div",29)(1,"div",30)(2,"div",31),p(3,"Possible 1RM (Brzycky Formula)"),s(),P(4,ke,6,5,null,null,M),l(6,"span",33),p(7,"Average"),s(),l(8,"ul",34)(9,"li",35),p(10),D(11,"number"),s()()()()),t&2){u(2);let e=U(30);d(4),T(e.series),d(6),V("",O(11,1,e.brzyckiAverage,"1.2-2"),"kg")}}function Ae(t,c){if(t&1&&b(0,Te,7,4,"div",29)(1,De,7,4,"div",29)(2,Ke,12,4,"div",29),t&2){u();let e=U(30),r=u();v(e?0:-1),d(),v(r.exerciseLogApiService.recentlyUpdated().length?1:-1),d(),v(e?2:-1)}}function Ye(t,c){if(t&1){let e=A();l(0,"button",36),Y("click",function(){f(e);let i=u(2);return x(i.openDeleteModal())}),S(1,"i",37),l(2,"span"),p(3,"Delete"),s()()}}function Ue(t,c){if(t&1){let e=A();l(0,"div",0)(1,"div",2)(2,"div",3)(3,"h4",4),p(4),s(),l(5,"span",5),p(6,"Record your workout details and progress"),s()(),l(7,"div"),S(8,"input",6),l(9,"div",7)(10,"input",8),L("ngModelChange",function(i){f(e);let o=u();return y(o.formSignal.date,i)||(o.formSignal.date=i),x(i)}),s()(),l(11,"div",9)(12,"app-typeahead",10),L("valueChange",function(i){f(e);let o=u();return y(o.formSignal.user,i)||(o.formSignal.user=i),x(i)}),s()(),l(13,"div",11)(14,"div",12)(15,"app-typeahead",13),L("valueChange",function(i){f(e);let o=u();return y(o.formSignal.exercise,i)||(o.formSignal.exercise=i),x(i)}),s()()(),b(16,Le,3,0,"div",14),B(17),l(18,"div",11),P(19,Ie,6,4,"div",15,M),s()(),l(21,"div",16)(22,"div",17)(23,"button",18),Y("click",function(){f(e);let i=u();return x(i.cancel())}),p(24," Cancel "),s()(),l(25,"div",17)(26,"button",19),Y("click",function(){f(e);let i=u();return x(i.save())}),b(27,we,1,0,"i",20)(28,Me,3,0),p(29," Save "),s()()(),B(30),b(31,Ae,3,3)(32,Ye,4,0,"button",21),s()()}if(t&2){let e=u();d(4),V("",e.mode()==="edit"?"Edit":"Create"," Exercise Log"),d(6),E("ngModel",e.formSignal.date),C("disabled",!e.formEnabled()),d(2),E("value",e.formSignal.user),C("items",e.users())("itemSelector",e.userSelector)("disabled",!e.formEnabled()),d(3),E("value",e.formSignal.exercise),C("items",e.exerciseApiService.exercises())("itemSelector",e.exerciseSelector)("disabled",!e.formEnabled()),d(),v(e.hasUnsavedChanges()?16:-1);let r=e.formSignal.series();d(3),T(r),d(7),$("btn-primary",e.formValid())("btn-secondary",!e.formValid()||!e.hasUnsavedChanges()),C("disabled",!e.formValid()||e.isSaveLoading()||!e.hasUnsavedChanges()),d(),v(e.isSaveLoading()?28:27),d(3),J(e.originalValue.value()),d(),v(e.mode()==="edit"?31:-1),d(),v(e.mode()==="edit"?32:-1)}}function We(t,c){t&1&&(l(0,"div",1)(1,"div",38)(2,"span",39),p(3,"Loading..."),s()()())}var di=(()=>{class t{constructor(){this.exerciseLogId=G(null,{alias:"id",transform:Q}),this.authService=h(fe),this.exerciseLogApiService=h(ve),this.exerciseApiService=h(he),this.location=h(ee),this.router=h(oe),this.toastService=h(_e),this.titleCasePipe=h(ie),this.dayjsService=h(be),this.dayjs=this.dayjsService.instance,this.route=h(ne),this.modalService=h(pe),this.isSaveLoading=a(!1),this.isLoading=Z(()=>this.originalValue.isLoading()),this.paramMap=N(this.route.paramMap),this.url=N(this.route.url,{initialValue:[]}),this.mode=I(()=>this.url().some(e=>e.path===w.CREATE)?"create":"edit"),this.formSignal={user:a(null),exercise:a(null),date:a(""),series:a([a({serieId:null,reps:a(null),weightInKg:a(null)}),a({serieId:null,reps:a(null),weightInKg:a(null)}),a({serieId:null,reps:a(null),weightInKg:a(null)}),a({serieId:null,reps:a(null),weightInKg:a(null)}),a({serieId:null,reps:a(null),weightInKg:a(null)})])},this.formValid=I(()=>!0),this.formValue=I(()=>({user:this.formSignal.user(),exercise:this.formSignal.exercise(),date:this.formSignal.date(),series:this.formSignal.series()})),this.formEnabled=a(!0),this.userSelector=e=>e?.name??"",this.exerciseSelector=e=>this.titleCasePipe.transform(e?.name)??"",this.users=I(()=>{let e=this.authService.user();return[e,...e?.assignedUsers??[]]}),this.originalValue=se({request:this.exerciseLogId,loader:({request:e})=>e?this.exerciseLogApiService.getExerciseLogById(e):q(null)}),this.#e=j(()=>{this.originalValue.error()&&this.router.navigate([w.HOME])}),this.#i=j(()=>{let e=this.mode(),r=this.originalValue.value(),{user:i}=F(()=>({user:this.authService.user()}));e==="create"&&F(()=>{let o=this.dayjs().format("YYYY-MM-DD");this.formSignal.date.set(o),this.formSignal.user.set(i)}),e==="edit"&&r&&(this.formSignal.exercise.set(r.exercise),this.formSignal.date.set(this.dayjsService.parseDate(r.date).format("YYYY-MM-DD")),this.formSignal.user.set(r.user),this.formSignal.series.update(o=>{for(let g=0;g<o.length;g++)o[g]?.set({serieId:r.series[g]?.serieId??null,reps:a(r.series[g]?.reps?.toString()??null),weightInKg:a(r.series[g]?.weightInKg?.toString()??null)});return o}))}),this.hasUnsavedChanges=I(()=>{let e=this.formValue(),r=this.mode();if(r==="create"||!e.user)return!1;let i=this.originalValue.value(),o=i?.series.map(m=>({serieId:m.serieId,weightInKg:m.weightInKg?.toString()??null,reps:m.reps?.toString()??null}))??[],g=e.series.map(m=>m()).filter(m=>!!m.reps()||!!m.weightInKg()).map(m=>({serieId:m.serieId,reps:m.reps(),weightInKg:m.weightInKg()}));return r==="edit"&&!ue(o,g)||i?.exercise.exerciseId!==e.exercise?.exerciseId||i?.user.userId!==e.user.userId||this.dayjs(i?.date).unix()!==this.dayjs(e.date).unix()})}#e;#i;openDeleteModal(){let e=this.modalService.open(xe,{centered:!0});e.componentInstance.configurate({title:"Delete Record",subtitle:"<strong>Are you sure you want to delete this record?</strong>",body:'This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>',okType:"danger"}),e.closed.pipe(H(1)).subscribe(async()=>{let i=this.originalValue.value();if(i)try{await K(this.exerciseLogApiService.deleteExerciseLog(i.id)),this.toastService.ok("Log deleted successfully!"),this.router.navigate([w.HOME])}catch(o){let g=o;this.toastService.error(`${g.message}`)}})}async save(){let e=this.mode();this.isSaveLoading.set(!0);let r=this.formSignal.user(),i=this.formSignal.exercise(),o=this.dayjsService.parseDate(this.formSignal.date());if(!r)throw new Error("User cannot be null");if(this.formValid()&&typeof i!="string"&&i&&typeof r!="string"&&r){if(this.formEnabled.set(!1),e==="create"){let g=this.formSignal.series().map(n=>{let _=n();return{exerciseLogId:this.exerciseLogId(),serieId:_.serieId,reps:z(_.reps()),weightInKg:z(_.weightInKg()),brzycki:0}}),k=g.filter(n=>!!n.reps||!!n.weightInKg),W={seriesIdsToDelete:g.filter(n=>!n.reps||!n.weightInKg).filter(n=>!!n.serieId).map(n=>n.serieId),exerciseLog:{exerciseLogUsername:r?.name,exerciseLogUserId:r.userId,exerciseLogExerciseId:i.exerciseId??void 0,exerciseLogDate:o.format("YYYY-MM-DD"),series:k}};try{let n=await K(this.exerciseLogApiService.createExerciseLog(W));localStorage.removeItem(Se),this.toastService.ok("Log created successfully!"),this.router.navigate([w.EXERCISE_LOGS,w.EDIT,n])}catch(n){this.toastService.error(`${n}`)}}if(e==="edit"){let g=this.formSignal.series().map(n=>{let _=n();return{exerciseLogId:this.exerciseLogId(),serieId:_.serieId,reps:Number(_.reps()),weightInKg:Number(_.weightInKg()),brzycki:0}}),k=g.filter(n=>!!n.reps||!!n.weightInKg),W={seriesIdsToDelete:g.filter(n=>!n.reps||!n.weightInKg).filter(n=>!!n.serieId).map(n=>n.serieId),id:this.exerciseLogId(),exerciseLog:{exerciseLogUsername:r?.name,exerciseLogUserId:r.userId,exerciseLogExerciseId:i.exerciseId??void 0,exerciseLogDate:o.format("YYYY-MM-DD"),series:k}};try{await K(this.exerciseLogApiService.updateExerciseLog(W)),this.toastService.ok("Log updated successfully!"),this.originalValue.reload()}catch(n){let _=n;this.toastService.error(`${_.message}`)}}}this.isSaveLoading.set(!1),this.formEnabled.set(!0)}cancel(){this.location.back()}static{this.\u0275fac=function(r){return new(r||t)}}static{this.\u0275cmp=X({type:t,selectors:[["edit-exercise-log-page"]],inputs:{exerciseLogId:[1,"id","exerciseLogId"]},decls:2,vars:1,consts:[[1,"header-footer-padding"],[1,"position-absolute","top-50","start-50","translate-middle"],[1,"container"],[1,"pb-3"],[1,"title"],[1,"subtitle"],["type","text","autofocus","autofocus",2,"display","none"],[1,"mb-2"],["type","date","placeholder","DD-MM-YYYY",1,"form-control",3,"ngModelChange","ngModel","disabled"],[1,"col-12","mb-2"],["placeholder","User",3,"valueChange","value","items","itemSelector","disabled"],[1,"mb-3"],[1,"input-group"],["placeholder","Exercise",3,"valueChange","value","items","itemSelector","disabled"],[1,"mb-2","px-2"],[1,"pb-1"],[1,"row","g-2","mb-5"],[1,"col"],["type","button",1,"btn","btn-secondary","w-100",3,"click"],["type","button",1,"btn","w-100","d-flex","justify-content-center","align-items-center",3,"click","disabled"],["aria-hidden","true",1,"fa","fa-save","px-2"],["type","button",1,"btn","btn-danger","w-100","delete-button"],["aria-hidden","true",1,"fa","fa-exclamation-circle"],[1,"row","g-2"],[1,"col-6"],["type","text","placeholder","Reps","onlyNumbers","",1,"form-control",3,"ngModelChange","ngModel","disabled"],["type","text","placeholder","Weight (Kg)","onlyNumbers","",1,"form-control",3,"ngModelChange","ngModel","disabled"],["aria-hidden","true",1,"spinner-border","spinner-border-sm","mx-2"],["role","status",1,"visually-hidden"],[1,"card","mb-3"],[1,"card-body"],[1,"card-title"],[1,"w-100",3,"exerciseLog"],[1,"serie-label"],[1,"list-group","list-group-horizontal","pb-1"],[1,"list-group-item","w-100"],["type","button",1,"btn","btn-danger","w-100","delete-button",3,"click"],["aria-hidden","true",1,"fa","fa-trash","px-2"],["role","status",1,"robertly-spinner","spinner-border","text-primary"],[1,"visually-hidden"]],template:function(r,i){r&1&&b(0,Ue,33,21,"div",0)(1,We,4,0,"div",1),r&2&&v(i.isLoading()?1:0)},dependencies:[ge,ae,le,ce,de,me,Ce,Ee,te,re,ye],styles:["[_nghost-%COMP%]{--bs-body-bg: var(--light-bg);--bs-body-color: var(--font-color);--bs-tertiary-bg: var(--primary);--bs-border-width: 1px;--bs-border-color: rgba(255, 255, 255, .15)}.card[_ngcontent-%COMP%]{--bs-card-spacer-y: .5rem;--bs-card-spacer-x: .5rem}.title[_ngcontent-%COMP%]{margin:0}.subtitle[_ngcontent-%COMP%]{font-size:14px;opacity:.7}.card[_ngcontent-%COMP%]{background-color:var(--bg);border:1px solid rgba(255,255,255,.1)}.serie-label[_ngcontent-%COMP%]{font-size:12px;color:#ffffffbf;padding:0 .5rem}.delete-button[_ngcontent-%COMP%]{background-color:#301b23;--bs-btn-border-color: #6e363b;color:#fa8989}"],changeDetection:0})}}return t})();export{di as EditExerciseLogPageComponent};
