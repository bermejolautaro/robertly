import{E as I,F,G as W,H as O,I as $,J as B,a as E,b as z,f as T,i as H,j as J,l as Q,n as X,o as Z,p as ee,q as te,r as ie}from"./chunk-V4ZDPGEC.js";import{Aa as M,Ba as f,Ea as w,Ga as c,Ha as m,I as L,J as h,M as A,Na as Y,O as _,P as v,Ta as C,Ua as K,V as u,W as S,Wa as q,X as r,Xa as G,Ya as P,ea as d,j as V,ja as g,oa as n,pa as o,qa as j,ta as k,wa as D,xa as y,y as R,ya as U,za as s}from"./chunk-G3COIXSD.js";function b(e){return Object.keys(e)}(function(e){e.strict=e})(b||(b={}));function le(e,t){if(e&1){let a=k();n(0,"button",14),D("click",function(){let l=_(a).$implicit,x=y();return v(x.selectedWeekDropdownSignal.set(l))}),s(1),o()}if(e&2){let a=t.$implicit;r(1),f(" ",a," ")}}function pe(e,t){if(e&1&&(n(0,"td",11),s(1),c(2,"titlecase"),o()),e&2){let a=t.$implicit;r(1),f(" ",m(2,1,a.key)," ")}}function de(e,t){if(e&1&&(n(0,"td",16),s(1),o()),e&2){let a=t.$implicit,i=y().$implicit;r(1),f(" ",a.value[i]||0," ")}}function ce(e,t){if(e&1&&(n(0,"tr")(1,"td",13),s(2),c(3,"titlecase"),o(),g(4,de,2,1,"td",15),c(5,"keyvalue"),n(6,"td",16),s(7,"10"),o()()),e&2){let a=t.$implicit,i=y();r(2),M(m(3,2,a)),r(2),d("ngForOf",m(5,4,i.seriesPerMuscleGroupWeeklySignal()[i.selectedWeekSignal()]))}}var ne=(()=>{let t=class t{constructor(){this.muscleGroups=E,this.rowsSignal=S([]),this.daysGroupByWeekSignal=u(()=>T(ee(this.rowsSignal()),i=>i.length)),this.seriesPerMuscleGroupWeeklySignal=u(()=>X(this.rowsSignal())),this.weeksSignal=u(()=>b(this.seriesPerMuscleGroupWeeklySignal())),this.selectedWeekDropdownSignal=S(null),this.selectedWeekSignal=u(()=>this.selectedWeekDropdownSignal()??this.weeksSignal()[0]),this.selectedWeekDropdownValue=u(()=>this.selectedWeekSignal()??"Week"),this.daysTrainedMessage=u(()=>{let i=this.daysGroupByWeekSignal()[this.selectedWeekSignal()];return`${i} ${i===1?"day":"days"} trained this week`})}set rows(i){this.rowsSignal.set(i)}};t.\u0275fac=function(p){return new(p||t)},t.\u0275cmp=h({type:t,selectors:[["app-series-per-muscle-group-weekly"]],inputs:{rows:"rows"},standalone:!0,features:[w],decls:24,vars:7,consts:[[1,"card","border-0","shadow-material-1"],[1,"card-body"],[1,"card-title","mb-3"],[1,"mb-3"],["ngbDropdown","",1,"d-flex","justify-content-center"],["type","button","ngbDropdownToggle","",1,"btn","btn-outline-primary","w-100"],["ngbDropdownMenu","",1,"w-100"],["ngbDropdownItem","",3,"click",4,"ngFor","ngForOf"],[1,"table","table-sm","m-0","mb-3"],["scope","col",1,"fw-semibold"],["class","text-center fw-semibold",4,"ngFor","ngForOf"],[1,"text-center","fw-semibold"],[4,"ngFor","ngForOf"],[1,"fw-semibold"],["ngbDropdownItem","",3,"click"],["class","text-center",4,"ngFor","ngForOf"],[1,"text-center"]],template:function(p,l){p&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h5"),s(4,"Series Per Muscle Group - Weekly"),o()(),n(5,"div",3)(6,"div",4)(7,"button",5),s(8),o(),n(9,"div",6),g(10,le,2,1,"button",7),o()()(),n(11,"table",8)(12,"thead")(13,"tr")(14,"td",9),s(15,"Muscle Group"),o(),g(16,pe,3,3,"td",10),c(17,"keyvalue"),n(18,"td",11),s(19,"Target"),o()()(),n(20,"tbody"),g(21,ce,8,6,"tr",12),o()(),n(22,"div",13),s(23),o()()()),p&2&&(r(8),M(l.selectedWeekDropdownValue()),r(2),d("ngForOf",l.weeksSignal()),r(6),d("ngForOf",m(17,5,l.seriesPerMuscleGroupWeeklySignal()[l.selectedWeekSignal()])),r(5),d("ngForOf",l.muscleGroups),r(2),f(" ",l.daysTrainedMessage()," "))},dependencies:[C,G,P,B,$,O,W,I,F],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0});let e=t;return e})();var oe=(()=>{let t=class t{transform(i){return z(i).format("MMMM[ - ]YYYY")}};t.\u0275fac=function(p){return new(p||t)},t.\u0275pipe=A({name:"parseToMonth",type:t,pure:!0,standalone:!0});let e=t;return e})();function me(e,t){if(e&1){let a=k();n(0,"button",14),D("click",function(){let l=_(a).$implicit,x=y();return v(x.selectedMonthDropdownSignal.set(l))}),s(1),c(2,"parseToMonth"),o()}if(e&2){let a=t.$implicit;r(1),f(" ",m(2,1,a)," ")}}function ue(e,t){if(e&1&&(n(0,"td",11),s(1),c(2,"titlecase"),o()),e&2){let a=t.$implicit;r(1),f(" ",m(2,1,a.key)," ")}}function ge(e,t){if(e&1&&(n(0,"td",16),s(1),o()),e&2){let a=t.$implicit,i=y().$implicit;r(1),f(" ",a.value[i]||0," ")}}function fe(e,t){if(e&1&&(n(0,"tr")(1,"td",13),s(2),c(3,"titlecase"),o(),g(4,ge,2,1,"td",15),c(5,"keyvalue"),n(6,"td",16),s(7,"40"),o()()),e&2){let a=t.$implicit,i=y();r(2),M(m(3,2,a)),r(2),d("ngForOf",m(5,4,i.seriesPerMuscleGroupMonthlySignal()[i.selectedMonthSignal()]))}}var re=(()=>{let t=class t{constructor(){this.muscleGroups=E,this.rowsSignal=S([]),this.daysGroupByMonthSignal=u(()=>T(te(this.rowsSignal()),i=>i.length)),this.seriesPerMuscleGroupMonthlySignal=u(()=>Z(this.rowsSignal())),this.monthsSignal=u(()=>b(this.seriesPerMuscleGroupMonthlySignal())),this.selectedMonthDropdownSignal=S(null),this.selectedMonthSignal=u(()=>this.selectedMonthDropdownSignal()??this.monthsSignal()[0]),this.selectedWeekDropdownValue=u(()=>this.selectedMonthSignal()??"Month"),this.daysTrainedMessage=u(()=>{let i=this.daysGroupByMonthSignal()[this.selectedMonthSignal()];return`${i} ${i===1?"day":"days"} trained this month`})}set rows(i){this.rowsSignal.set(i)}};t.\u0275fac=function(p){return new(p||t)},t.\u0275cmp=h({type:t,selectors:[["app-series-per-muscle-group-monthly"]],inputs:{rows:"rows"},standalone:!0,features:[w],decls:25,vars:9,consts:[[1,"card","border-0","shadow-material-1"],[1,"card-body"],[1,"card-title","mb-3"],[1,"mb-3"],["ngbDropdown","",1,"d-flex","justify-content-center"],["type","button","ngbDropdownToggle","",1,"btn","btn-outline-primary","w-100"],["ngbDropdownMenu","",1,"w-100"],["ngbDropdownItem","",3,"click",4,"ngFor","ngForOf"],[1,"table","table-sm","m-0","mb-3"],["scope","col",1,"fw-semibold"],["class","text-center fw-semibold",4,"ngFor","ngForOf"],[1,"text-center","fw-semibold"],[4,"ngFor","ngForOf"],[1,"fw-semibold"],["ngbDropdownItem","",3,"click"],["class","text-center",4,"ngFor","ngForOf"],[1,"text-center"]],template:function(p,l){p&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h5"),s(4,"Series Per Muscle Group - Monthly"),o()(),n(5,"div",3)(6,"div",4)(7,"button",5),s(8),c(9,"parseToMonth"),o(),n(10,"div",6),g(11,me,3,3,"button",7),o()()(),n(12,"table",8)(13,"thead")(14,"tr")(15,"td",9),s(16,"Muscle Group"),o(),g(17,ue,3,3,"td",10),c(18,"keyvalue"),n(19,"td",11),s(20,"Target"),o()()(),n(21,"tbody"),g(22,fe,8,6,"tr",12),o()(),n(23,"div",13),s(24),o()()()),p&2&&(r(8),f(" ",m(9,5,l.selectedWeekDropdownValue())," "),r(3),d("ngForOf",l.monthsSignal()),r(6),d("ngForOf",m(18,7,l.seriesPerMuscleGroupMonthlySignal()[l.selectedMonthSignal()])),r(5),d("ngForOf",l.muscleGroups),r(2),f(" ",l.daysTrainedMessage()," "))},dependencies:[C,G,P,oe,B,$,O,W,I,F],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0});let e=t;return e})();function ye(e,t){if(e&1&&(n(0,"td"),s(1),o()),e&2){let a=t.ngIf,i=y(2);r(1),f("",i.amountDaysTrained(a)," days")}}function he(e,t){if(e&1&&(n(0,"div",2),j(1,"app-series-per-muscle-group-weekly",3)(2,"app-series-per-muscle-group-monthly",3),n(3,"div",4)(4,"div",5)(5,"div",6)(6,"h5"),s(7,"Miscellaneous"),o(),n(8,"table",7)(9,"tbody")(10,"tr")(11,"td"),s(12,"Days trained"),o(),g(13,ye,2,1,"td",8),c(14,"async"),o()()()()()()()),e&2){let a=t.ngIf,i=y();r(1),d("rows",a),r(1),d("rows",a),r(11),d("ngIf",m(14,3,i.logs$))}}function Se(e,t){e&1&&(n(0,"div",9)(1,"div",10)(2,"span",11),s(3,"Loading..."),o()()())}var et=(()=>{let t=class t{constructor(){this.excerciseLogApiService=L(ie),this.amountDaysTrained=Q,this.logs$=this.excerciseLogApiService.getExcerciseLogs().pipe(R(1)),this.rows$=this.logs$.pipe(V(i=>J(H(i))))}};t.\u0275fac=function(p){return new(p||t)},t.\u0275cmp=h({type:t,selectors:[["app-stats-page"]],standalone:!0,features:[w],decls:4,vars:4,consts:[["class","container my-4",4,"ngIf","ngIfElse"],["loadingSpinner",""],[1,"container","my-4"],[1,"mb-4",3,"rows"],[1,"card","border-0","shadow-material-1"],[1,"card-body"],[1,"card-title","mb-3"],[1,"table","table-sm","m-0","mb-3"],[4,"ngIf"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(p,l){if(p&1&&(g(0,he,15,5,"div",0),c(1,"async"),g(2,Se,4,0,"ng-template",null,1,Y)),p&2){let x=U(3);d("ngIf",m(1,2,l.rows$))("ngIfElse",x)}},dependencies:[K,q,ne,re],changeDetection:0});let e=t;return e})();export{et as StatsPageComponent};
