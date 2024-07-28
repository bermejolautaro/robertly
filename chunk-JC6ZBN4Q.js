import{A as O,M as z,N as H,g as P,h as N,i as v,j as M,k as $,l as U,m as D,n as C,p as q,r as I,s as j,t as R,z as B}from"./chunk-J3SSN2MG.js";import{j as L}from"./chunk-25IAY4SZ.js";import{Bb as h,Eb as d,Fb as g,Ib as b,Jb as u,Kb as V,Qb as k,Vb as A,Wb as T,ab as l,bc as G,lb as f,oa as _,qa as y,qb as S,ub as F,va as a,vb as w,wa as m,wb as r,xb as c,yb as p}from"./chunk-KRYLBK2W.js";var K=(o,s)=>s.exerciseId;function Q(o,s){if(o&1){let t=h();r(0,"div",7)(1,"h4",8),u(2,"Edit Exercise"),c(),r(3,"button",9),d("click",function(){let n=a(t).$implicit;return m(n.dismiss())}),c()(),r(4,"div",10)(5,"form")(6,"div",11),p(7,"input",12),c(),r(8,"div",11),p(9,"app-typeahead",13),c(),r(10,"div",11),p(11,"app-typeahead",14),c()()(),r(12,"div",15)(13,"button",16),d("click",function(){let n=a(t).$implicit;return m(n.close())}),u(14," Save "),c()()}if(o&2){let t=g();l(7),f("formControl",t.exerciseForm.controls.name),l(2),f("control",t.exerciseForm.controls.muscleGroup)("items",t.exerciseLogService.muscleGroups),l(2),f("control",t.exerciseForm.controls.type)("items",t.exerciseLogService.types),l(2),f("disabled",t.exerciseForm.invalid||t.exerciseForm.pristine)}}function W(o,s){if(o&1){let t=h();r(0,"li",17),d("click",function(){let n=a(t).$implicit,x=g(),E=b(1);return m(x.open(E,n))}),r(1,"span"),u(2),A(3,"titlecase"),c(),r(4,"button",18),d("click",function(e){let x=a(t).$implicit;return g().deleteExercise(x),m(e.stopPropagation())}),p(5,"i",19),c()()}if(o&2){let t=s.$implicit;l(2),V(T(3,1,t.name))}}function X(o,s){o&1&&(r(0,"div",20)(1,"div",21)(2,"span",22),u(3,"Loading..."),c()()())}var me=(()=>{let s=class s{constructor(){this.modalService=_(B),this.exerciseLogService=_(P),this.exerciseApiService=_(z),this.exerciseForm=new U({name:new C("",[v.required]),muscleGroup:new C("",[v.required]),type:new C("",[v.required])}),this.isUpdate=!1,this.exerciseForm.controls.name.valueChanges.subscribe(i=>{this.exerciseForm.controls.name.patchValue(i?.toLowerCase()??"",{emitEvent:!1})})}ngOnInit(){this.fetchAndUpdateExercises()}open(i,e){this.exerciseForm.reset(),e&&this.exerciseForm.patchValue({name:e.name,muscleGroup:e.muscleGroup,type:e.type}),this.modalService.open(i,{centered:!0}).result.then(()=>{if(this.isUpdate=!!e,e){let n={id:e.exerciseId,name:this.exerciseForm.value.name.toLowerCase(),muscleGroup:this.exerciseForm.value.muscleGroup,type:this.exerciseForm.value.type};this.exerciseApiService.updateExercise(n).subscribe({next:()=>this.fetchAndUpdateExercises()})}else{let n={name:this.exerciseForm.value.name.toLowerCase(),muscleGroup:this.exerciseForm.value.muscleGroup,type:this.exerciseForm.value.type};this.exerciseApiService.createExercise(n).subscribe({next:()=>this.fetchAndUpdateExercises()})}},()=>{})}close(i){i.close()}deleteExercise(i){this.exerciseApiService.deleteExercise(i.exerciseId).subscribe({next:()=>this.fetchAndUpdateExercises()})}fetchAndUpdateExercises(){this.exerciseLogService.updateExercises$.next([]),this.exerciseApiService.getExercises().subscribe(i=>{this.exerciseLogService.updateExercises$.next(i)})}};s.\u0275fac=function(e){return new(e||s)},s.\u0275cmp=y({type:s,selectors:[["app-exercises-page"]],standalone:!0,features:[k],decls:12,vars:1,consts:[["content",""],[1,"container","footer-padding"],[1,"d-flex","justify-content-end","mb-3"],["type","button",1,"btn","btn-primary"],[1,"fa","fa-plus","me-2"],[3,"click"],[1,"list-group"],[1,"modal-header"],["id","modal-basic-title",1,"modal-title"],["type","button","aria-label","Close",1,"btn-close",3,"click"],[1,"modal-body"],[1,"mb-3"],["type","text","placeholder","Name",1,"form-control",3,"formControl"],["placeholder","Muscle Group",3,"control","items"],["placeholder","Type",3,"control","items"],[1,"modal-footer"],["type","button",1,"btn","btn-primary",3,"disabled","click"],[1,"list-group-item","d-flex","align-items-center",3,"click"],["type","button",1,"btn","btn-danger",2,"margin-left","auto","padding","0.075rem 0.35rem",3,"click"],[1,"fa","fa-trash"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"],["class","list-group-item d-flex align-items-center"]],template:function(e,n){if(e&1){let x=h();S(0,Q,15,6,"ng-template",null,0,G),r(2,"div",1)(3,"div",2)(4,"button",3),p(5,"i",4),r(6,"span",5),d("click",function(){a(x);let J=b(1);return m(n.open(J,null))}),u(7,"Add Exercise"),c()()(),r(8,"ul",6),F(9,W,6,3,"li",23,K,!1,X,4,0),c()()}e&2&&(l(9),w(n.exerciseLogService.exercises()))},dependencies:[L,O,j,q,N,M,$,D,R,I,H],changeDetection:0});let o=s;return o})();export{me as ExercisesPageComponent};