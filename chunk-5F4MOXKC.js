import"./chunk-BYXBJQAS.js";import{a as D}from"./chunk-GPWZHJOU.js";import{O as I,f as w,g as F,s as k}from"./chunk-SC4N7HDS.js";import{d as b}from"./chunk-25IAY4SZ.js";import{Eb as g,Fb as S,Jb as a,Lb as y,Qb as T,Ya as p,ab as m,ea as u,lb as h,oa as l,qa as x,qb as _,rb as v,sb as C,ub as L,vb as E,wb as o,xb as r,yb as P}from"./chunk-KRYLBK2W.js";function A(e,i){if(e&1&&P(0,"app-exercise-log",7),e&2){let d=i.$implicit;h("exerciseLog",d)}}function R(e,i){if(e&1&&(o(0,"div",6),L(1,A,1,1,"app-exercise-log",7,C),r()),e&2){let d=S();m(1),E(d.logs())}}function j(e,i){e&1&&(o(0,"div",8)(1,"div",9)(2,"span",10),a(3,"Loading..."),r()()())}var te=(()=>{let i=class i{constructor(){this.document=l(b),this.exerciseLogApiService=l(w),this.exerciseLogService=l(F),this.currentPage=p(0),this.filter=p(null),this.logs=p([])}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"}),this.fetchLogs()}onFilterChange(t){this.filter.set(t),this.fetchLogs()}prevPage(){this.currentPage.update(t=>Math.max(t-1,0)),this.fetchLogs()}nextPage(){this.currentPage.update(t=>t+1),this.fetchLogs()}fetchLogs(){let t=this.filter(),s=t?.types.at(0),n=t?.exercisesIds.at(0),c=t?.weights.at(0),f=this.exerciseLogApiService.getExerciseLogs(this.currentPage(),s??null,n??null,c??null);this.exerciseLogService.withLoading(f.pipe(u(M=>{this.logs.set(M)})))}};i.\u0275fac=function(s){return new(s||i)},i.\u0275cmp=x({type:i,selectors:[["app-exercise-logs-page"]],standalone:!0,features:[T],decls:11,vars:3,consts:[[1,"footer-padding",3,"hidden"],[3,"filtersChanged"],[1,"container","d-flex","justify-content-end","align-items-center","gap-2"],[1,"btn","btn-secondary",3,"click"],[1,"mt-4"],["class","container"],[1,"container"],[3,"exerciseLog"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(s,n){s&1&&(o(0,"div",0)(1,"app-filters",1),g("filtersChanged",function(f){return n.onFilterChange(f)}),r(),o(2,"div",2)(3,"button",3),g("click",function(){return n.prevPage()}),a(4," < "),r(),a(5),o(6,"button",3),g("click",function(){return n.nextPage()}),a(7," > "),r()(),o(8,"div",4),_(9,R,3,0,"div",5)(10,j,4,0),r()()),s&2&&(h("hidden",!n.exerciseLogService.loaded()),m(5),y(" ",n.currentPage()," "),m(4),v(9,n.exerciseLogService.loaded()?9:10))},dependencies:[k,D,I],changeDetection:0});let e=i;return e})();export{te as ExerciseLogsPageComponent};
