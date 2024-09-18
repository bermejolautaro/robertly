import{L as O,M as z,g as L,h as P,i as v,j as N,k as M,l as $,m as U,n as E,p as D,r as q,s as I,t as j,y as R,z as B}from"./chunk-G5X3D3MJ.js";import{j as G}from"./chunk-OFWY3YEL.js";import{Ab as r,Bb as s,Ca as a,Cb as p,Da as m,Fb as h,Jb as d,Kb as g,Rb as b,Sb as u,Tb as w,Za as l,_b as V,dc as k,ec as A,gc as T,lb as S,pa as _,qb as x,sa as y,yb as C,zb as F}from"./chunk-24QZLUFP.js";var J=(n,o)=>o.exerciseId;function K(n,o){if(n&1){let t=h();r(0,"div",9)(1,"h4",10),u(2,"Edit Exercise"),s(),r(3,"button",11),d("click",function(){let e=a(t).$implicit;return m(e.dismiss())}),s()(),r(4,"div",12)(5,"form")(6,"div",13),p(7,"input",14),s(),r(8,"div",13),p(9,"app-typeahead",15),s(),r(10,"div",13),p(11,"app-typeahead",16),s()()(),r(12,"div",17)(13,"button",18),d("click",function(){let e=a(t).$implicit;return m(e.close())}),u(14," Save "),s()()}if(n&2){let t=g();l(7),x("formControl",t.exerciseForm.controls.name),l(2),x("control",t.exerciseForm.controls.muscleGroup)("items",t.exerciseLogService.muscleGroups),l(2),x("control",t.exerciseForm.controls.type)("items",t.exerciseLogService.types),l(2),x("disabled",t.exerciseForm.invalid||t.exerciseForm.pristine)}}function Q(n,o){if(n&1){let t=h();r(0,"li",19),d("click",function(){let e=a(t).$implicit,c=g(),f=b(1);return m(c.open(f,e))}),r(1,"span"),u(2),k(3,"titlecase"),s(),r(4,"button",20),d("click",function(e){let c=a(t).$implicit;return g().deleteExercise(c),m(e.stopPropagation())}),p(5,"i",21),s()()}if(n&2){let t=o.$implicit;l(2),w(A(3,1,t.name))}}function W(n,o){n&1&&(r(0,"div",8)(1,"div",22)(2,"span",23),u(3,"Loading..."),s()()())}var me=(()=>{let o=class o{constructor(){this.modalService=_(R),this.exerciseLogService=_(L),this.exerciseApiService=_(O),this.exerciseForm=new $({name:new E("",[v.required]),muscleGroup:new E("",[v.required]),type:new E("",[v.required])}),this.isUpdate=!1,this.exerciseForm.controls.name.valueChanges.subscribe(i=>{this.exerciseForm.controls.name.patchValue(i?.toLowerCase()??"",{emitEvent:!1})})}ngOnInit(){this.fetchAndUpdateExercises()}open(i,e){this.exerciseForm.reset(),e&&this.exerciseForm.patchValue({name:e.name,muscleGroup:e.muscleGroup,type:e.type}),this.modalService.open(i,{centered:!0}).result.then(()=>{if(this.isUpdate=!!e,e){let c={id:e.exerciseId,name:this.exerciseForm.value.name.toLowerCase(),muscleGroup:this.exerciseForm.value.muscleGroup,type:this.exerciseForm.value.type};this.exerciseApiService.updateExercise(c).subscribe({next:()=>this.fetchAndUpdateExercises()})}else{let c={name:this.exerciseForm.value.name.toLowerCase(),muscleGroup:this.exerciseForm.value.muscleGroup,type:this.exerciseForm.value.type};this.exerciseApiService.createExercise(c).subscribe({next:()=>this.fetchAndUpdateExercises()})}},()=>{})}close(i){i.close()}deleteExercise(i){this.exerciseApiService.deleteExercise(i.exerciseId).subscribe({next:()=>this.fetchAndUpdateExercises()})}fetchAndUpdateExercises(){this.exerciseLogService.updateExercises$.next([]),this.exerciseApiService.getExercises().subscribe(i=>{this.exerciseLogService.updateExercises$.next(i)})}};o.\u0275fac=function(e){return new(e||o)},o.\u0275cmp=y({type:o,selectors:[["app-exercises-page"]],standalone:!0,features:[V],decls:12,vars:1,consts:[["content",""],[1,"container","footer-padding"],[1,"d-flex","justify-content-end","mb-3"],["type","button",1,"btn","btn-primary"],[1,"fa","fa-plus","me-2"],[3,"click"],[1,"list-group"],[1,"list-group-item","d-flex","align-items-center"],[1,"position-absolute","top-50","start-50","translate-middle"],[1,"modal-header"],["id","modal-basic-title",1,"modal-title"],["type","button","aria-label","Close",1,"btn-close",3,"click"],[1,"modal-body"],[1,"mb-3"],["type","text","placeholder","Name",1,"form-control",3,"formControl"],["placeholder","Muscle Group",3,"control","items"],["placeholder","Type",3,"control","items"],[1,"modal-footer"],["type","button",1,"btn","btn-primary",3,"click","disabled"],[1,"list-group-item","d-flex","align-items-center",3,"click"],["type","button",1,"btn","btn-danger",2,"margin-left","auto","padding","0.075rem 0.35rem",3,"click"],[1,"fa","fa-trash"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(e,c){if(e&1){let f=h();S(0,K,15,6,"ng-template",null,0,T),r(2,"div",1)(3,"div",2)(4,"button",3),p(5,"i",4),r(6,"span",5),d("click",function(){a(f);let H=b(1);return m(c.open(H,null))}),u(7,"Add Exercise"),s()()(),r(8,"ul",6),C(9,Q,6,3,"li",7,J,!1,W,4,0,"div",8),s()()}e&2&&(l(9),F(c.exerciseLogService.exercises()))},dependencies:[G,B,I,D,P,N,M,U,j,q,z],changeDetection:0});let n=o;return n})();export{me as ExercisesPageComponent};
