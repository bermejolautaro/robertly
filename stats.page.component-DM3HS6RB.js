import{C as T,D as I,E as W,F as O,G as $,a as E,b as K,f as F,i as q,j as z,m as H,n as J,o as Q,p as X,q as Z}from"./chunk-LDKP2LSB.js";import{$ as D,A as V,B as h,Ca as C,Da as U,E as R,F as c,Fa as Y,G as S,Ga as G,Ha as P,I as v,J as _,O as r,T as g,U as L,V as d,W as n,X as o,Y as A,Z as k,aa as y,g as N,ga as l,ha as x,ia as f,ma as w,oa as m,pa as u,va as j}from"./chunk-QGWUL66F.js";import"./chunk-LWEHNFHP.js";function M(e){return Object.keys(e)}(function(e){function t(s){return e(s)}e.strict=t})(M||(M={}));function re(e,t){if(e&1){let s=k();n(0,"button",14),D("click",function(){let a=v(s).$implicit,b=y();return _(b.selectedWeekDropdownSignal.set(a))}),l(1),o()}if(e&2){let s=t.$implicit;r(1),f(" ",s," ")}}function se(e,t){if(e&1&&(n(0,"td",11),l(1),m(2,"titlecase"),o()),e&2){let s=t.$implicit;r(1),f(" ",u(2,1,s.key)," ")}}function le(e,t){if(e&1&&(n(0,"td",16),l(1),o()),e&2){let s=t.$implicit,i=y().$implicit;r(1),f(" ",s.value[i]||0," ")}}function ae(e,t){if(e&1&&(n(0,"tr")(1,"td",13),l(2),m(3,"titlecase"),o(),g(4,le,2,1,"td",15),m(5,"keyvalue"),n(6,"td",16),l(7,"10"),o()()),e&2){let s=t.$implicit,i=y();r(2),x(u(3,2,s)),r(2),d("ngForOf",u(5,4,i.seriesPerMuscleGroupWeeklySignal()[i.selectedWeekSignal()]))}}var ee=(()=>{let t=class{constructor(){this.muscleGroups=E,this.rowsSignal=S([]),this.daysGroupByWeekSignal=c(()=>F(Q(this.rowsSignal()),i=>i.length)),this.seriesPerMuscleGroupWeeklySignal=c(()=>H(this.rowsSignal())),this.weeksSignal=c(()=>M(this.seriesPerMuscleGroupWeeklySignal())),this.selectedWeekDropdownSignal=S(null),this.selectedWeekSignal=c(()=>this.selectedWeekDropdownSignal()??this.weeksSignal()[0]),this.selectedWeekDropdownValue=c(()=>this.selectedWeekSignal()??"Week"),this.daysTrainedMessage=c(()=>{let i=this.daysGroupByWeekSignal()[this.selectedWeekSignal()];return`${i} ${i===1?"day":"days"} trained this week`})}set rows(i){this.rowsSignal.set(i)}},e=t;return(()=>{t.\u0275fac=function(p){return new(p||t)}})(),(()=>{t.\u0275cmp=h({type:t,selectors:[["app-series-per-muscle-group-weekly"]],inputs:{rows:"rows"},standalone:!0,features:[w],decls:24,vars:7,consts:[[1,"card","border-0","shadow-material-1"],[1,"card-body"],[1,"card-title","mb-3"],[1,"mb-3"],["ngbDropdown","",1,"d-flex","justify-content-center"],["type","button","ngbDropdownToggle","",1,"btn","btn-outline-primary","w-100"],["ngbDropdownMenu","",1,"w-100"],["ngbDropdownItem","",3,"click",4,"ngFor","ngForOf"],[1,"table","table-sm","m-0","mb-3"],["scope","col",1,"fw-semibold"],["class","text-center fw-semibold",4,"ngFor","ngForOf"],[1,"text-center","fw-semibold"],[4,"ngFor","ngForOf"],[1,"fw-semibold"],["ngbDropdownItem","",3,"click"],["class","text-center",4,"ngFor","ngForOf"],[1,"text-center"]],template:function(p,a){p&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h5"),l(4,"Series Per Muscle Group - Weekly"),o()(),n(5,"div",3)(6,"div",4)(7,"button",5),l(8),o(),n(9,"div",6),g(10,re,2,1,"button",7),o()()(),n(11,"table",8)(12,"thead")(13,"tr")(14,"td",9),l(15,"Muscle Group"),o(),g(16,se,3,3,"td",10),m(17,"keyvalue"),n(18,"td",11),l(19,"Target"),o()()(),n(20,"tbody"),g(21,ae,8,6,"tr",12),o()(),n(22,"div",13),l(23),o()()()),p&2&&(r(8),x(a.selectedWeekDropdownValue()),r(2),d("ngForOf",a.weeksSignal()),r(6),d("ngForOf",u(17,5,a.seriesPerMuscleGroupWeeklySignal()[a.selectedWeekSignal()])),r(5),d("ngForOf",a.muscleGroups),r(2),f(" ",a.daysTrainedMessage()," "))},dependencies:[C,G,P,$,O,W,I,T],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0})})(),e})();var te=(()=>{let t=class{transform(i){return K(i).format("MMMM[ - ]YYYY")}},e=t;return(()=>{t.\u0275fac=function(p){return new(p||t)}})(),(()=>{t.\u0275pipe=R({name:"parseToMonth",type:t,pure:!0,standalone:!0})})(),e})();function pe(e,t){if(e&1){let s=k();n(0,"button",14),D("click",function(){let a=v(s).$implicit,b=y();return _(b.selectedMonthDropdownSignal.set(a))}),l(1),m(2,"parseToMonth"),o()}if(e&2){let s=t.$implicit;r(1),f(" ",u(2,1,s)," ")}}function ce(e,t){if(e&1&&(n(0,"td",11),l(1),m(2,"titlecase"),o()),e&2){let s=t.$implicit;r(1),f(" ",u(2,1,s.key)," ")}}function de(e,t){if(e&1&&(n(0,"td",16),l(1),o()),e&2){let s=t.$implicit,i=y().$implicit;r(1),f(" ",s.value[i]||0," ")}}function me(e,t){if(e&1&&(n(0,"tr")(1,"td",13),l(2),m(3,"titlecase"),o(),g(4,de,2,1,"td",15),m(5,"keyvalue"),n(6,"td",16),l(7,"40"),o()()),e&2){let s=t.$implicit,i=y();r(2),x(u(3,2,s)),r(2),d("ngForOf",u(5,4,i.seriesPerMuscleGroupMonthlySignal()[i.selectedMonthSignal()]))}}var ie=(()=>{let t=class{constructor(){this.muscleGroups=E,this.rowsSignal=S([]),this.daysGroupByMonthSignal=c(()=>F(X(this.rowsSignal()),i=>i.length)),this.seriesPerMuscleGroupMonthlySignal=c(()=>J(this.rowsSignal())),this.monthsSignal=c(()=>M(this.seriesPerMuscleGroupMonthlySignal())),this.selectedMonthDropdownSignal=S(null),this.selectedMonthSignal=c(()=>this.selectedMonthDropdownSignal()??this.monthsSignal()[0]),this.selectedWeekDropdownValue=c(()=>this.selectedMonthSignal()??"Month"),this.daysTrainedMessage=c(()=>{let i=this.daysGroupByMonthSignal()[this.selectedMonthSignal()];return`${i} ${i===1?"day":"days"} trained this month`})}set rows(i){this.rowsSignal.set(i)}},e=t;return(()=>{t.\u0275fac=function(p){return new(p||t)}})(),(()=>{t.\u0275cmp=h({type:t,selectors:[["app-series-per-muscle-group-monthly"]],inputs:{rows:"rows"},standalone:!0,features:[w],decls:25,vars:9,consts:[[1,"card","border-0","shadow-material-1"],[1,"card-body"],[1,"card-title","mb-3"],[1,"mb-3"],["ngbDropdown","",1,"d-flex","justify-content-center"],["type","button","ngbDropdownToggle","",1,"btn","btn-outline-primary","w-100"],["ngbDropdownMenu","",1,"w-100"],["ngbDropdownItem","",3,"click",4,"ngFor","ngForOf"],[1,"table","table-sm","m-0","mb-3"],["scope","col",1,"fw-semibold"],["class","text-center fw-semibold",4,"ngFor","ngForOf"],[1,"text-center","fw-semibold"],[4,"ngFor","ngForOf"],[1,"fw-semibold"],["ngbDropdownItem","",3,"click"],["class","text-center",4,"ngFor","ngForOf"],[1,"text-center"]],template:function(p,a){p&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h5"),l(4,"Series Per Muscle Group - Monthly"),o()(),n(5,"div",3)(6,"div",4)(7,"button",5),l(8),m(9,"parseToMonth"),o(),n(10,"div",6),g(11,pe,3,3,"button",7),o()()(),n(12,"table",8)(13,"thead")(14,"tr")(15,"td",9),l(16,"Muscle Group"),o(),g(17,ce,3,3,"td",10),m(18,"keyvalue"),n(19,"td",11),l(20,"Target"),o()()(),n(21,"tbody"),g(22,me,8,6,"tr",12),o()(),n(23,"div",13),l(24),o()()()),p&2&&(r(8),f(" ",u(9,5,a.selectedWeekDropdownValue())," "),r(3),d("ngForOf",a.monthsSignal()),r(6),d("ngForOf",u(18,7,a.seriesPerMuscleGroupMonthlySignal()[a.selectedMonthSignal()])),r(5),d("ngForOf",a.muscleGroups),r(2),f(" ",a.daysTrainedMessage()," "))},dependencies:[C,G,P,te,$,O,W,I,T],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0})})(),e})();function ue(e,t){if(e&1&&(n(0,"div",2),A(1,"app-series-per-muscle-group-weekly",3)(2,"app-series-per-muscle-group-monthly",3),o()),e&2){let s=t.ngIf;r(1),d("rows",s),r(1),d("rows",s)}}function ge(e,t){e&1&&(n(0,"div",4)(1,"div",5)(2,"span",6),l(3,"Loading..."),o()()())}var Je=(()=>{let t=class{constructor(){this.excerciseLogApiService=V(Z),this.rows$=this.excerciseLogApiService.getExcerciseLogs().pipe(N(i=>z(q(i))))}},e=t;return(()=>{t.\u0275fac=function(p){return new(p||t)}})(),(()=>{t.\u0275cmp=h({type:t,selectors:[["app-stats-page"]],standalone:!0,features:[w],decls:4,vars:4,consts:[["class","container my-4",4,"ngIf","ngIfElse"],["loadingSpinner",""],[1,"container","my-4"],[1,"mb-4",3,"rows"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(p,a){if(p&1&&(g(0,ue,3,2,"div",0),m(1,"async"),g(2,ge,4,0,"ng-template",null,1,j)),p&2){let b=L(3);d("ngIf",u(1,2,a.rows$))("ngIfElse",b)}},dependencies:[U,Y,ee,ie],changeDetection:0})})(),e})();export{Je as StatsPageComponent};
