import{a as D}from"./chunk-CIDZOAJG.js";import{c as b}from"./chunk-QG63WFVY.js";import{a as E,d as c,q as T}from"./chunk-IU3Y72BR.js";import{d as y}from"./chunk-FE5KJT64.js";import{F as s,Fb as w,Jb as L,Qb as S,ab as p,ea as l,lb as f,oa as r,qa as x,qb as u,rb as d,sb as C,ub as v,vb as h,wb as m,xb as g,yb as _}from"./chunk-UBKAMZXI.js";function A(e,t){}function I(e,t){if(e&1&&_(0,"app-exercise-log",2),e&2){let a=t.$implicit;f("exerciseLog",a)}}function R(e,t){if(e&1&&(m(0,"div",1),v(1,I,1,1,"app-exercise-log",2,C),g()),e&2){let a=w();p(1),h(a.exerciseLogService.logs())}}function M(e,t){e&1&&(m(0,"div",3)(1,"div",4)(2,"span",5),L(3,"Loading..."),g()()())}var Le=(()=>{let t=class t{constructor(){this.document=r(y),this.exerciseLogApiService=r(b),this.exerciseLogService=r(c),this.isGrouped=!1,this.exerciseLogService.refreshLogs$.pipe(E()).subscribe(o=>{let i=this.exerciseLogApiService.getExerciseLogsLatestWorkout();this.exerciseLogService.withLoading(s([i]).pipe(l(([n])=>{this.exerciseLogService.updateLogs$.next(n)})))})}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"});let o=this.exerciseLogApiService.getExerciseLogsLatestWorkout();this.exerciseLogService.logs().length||this.exerciseLogService.withLoading(s([o]).pipe(l(([i])=>{this.exerciseLogService.updateLogs$.next(i)})))}};t.\u0275fac=function(i){return new(i||t)},t.\u0275cmp=x({type:t,selectors:[["app-exercise-logs-page"]],standalone:!0,features:[S],decls:3,vars:2,consts:[["class","container"],[1,"container"],[3,"exerciseLog"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(i,n){i&1&&u(0,A,0,0)(1,R,3,0,"div",0)(2,M,4,0),i&2&&(d(0,n.exerciseLogService.loaded()?0:-1),p(1),d(1,n.exerciseLogService.loaded()?1:2))},dependencies:[T,D],changeDetection:0});let e=t;return e})();export{Le as ExerciseLogsPageComponent};
