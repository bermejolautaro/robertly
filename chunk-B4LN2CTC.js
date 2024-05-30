import{b as R}from"./chunk-A2TXVP3M.js";import{b as I,c as l,p as B}from"./chunk-OK3EMDMU.js";import{d as P,j as g}from"./chunk-FE5KJT64.js";import{F as h,Fb as T,Jb as p,Kb as A,Mb as M,Qb as m,Vb as u,Wb as C,ab as a,ea as _,lb as S,oa as n,qa as d,qb as y,rb as f,sb as L,ta as w,ub as E,vb as b,wb as c,xb as s,yb as D}from"./chunk-UBKAMZXI.js";var v=(()=>{let e=class e{constructor(){this.dayjsService=n(I),this.titleCasePipe=n(g)}transform(r,i="Invalid Date"){let o=this.dayjsService.parseDate(r??"");return o.isValid()?this.titleCasePipe.transform(o.format("dddd[ - ]DD/MM/YYYY")):i}};e.\u0275fac=function(i){return new(i||e)},e.\u0275pipe=w({name:"parseToDate",type:e,pure:!0,standalone:!0});let t=e;return t})();var N=(()=>{let e=class e{constructor(){this.exerciseLogService=n(l)}};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=d({type:e,selectors:[["app-exercise-log"]],inputs:{exerciseLog:"exerciseLog"},standalone:!0,features:[m],decls:7,vars:7,consts:[[1,"log"],[1,"title"],[1,"hint"]],template:function(i,o){i&1&&(c(0,"div",0)(1,"div",1),p(2),u(3,"titlecase"),s(),c(4,"div",2),p(5),u(6,"parseToDate"),s()()),i&2&&(a(2),A(C(3,3,o.exerciseLog.exercise.name)),a(3),M("",C(6,5,o.exerciseLog.date)," - ",o.exerciseLog.user.name,""))},dependencies:[g,v],styles:[".log[_ngcontent-%COMP%]{background-color:var(--light-bg);color:var(--font-color);margin-bottom:8px;border-radius:5px;padding:.2rem .6rem}.log[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-size:15px;font-weight:600;margin-bottom:5px}.log[_ngcontent-%COMP%]   .hint[_ngcontent-%COMP%]{font-size:12px;opacity:.8}"],changeDetection:0});let t=e;return t})();function k(t,e){}function O(t,e){if(t&1&&D(0,"app-exercise-log",2),t&2){let x=e.$implicit;S("exerciseLog",x)}}function $(t,e){if(t&1&&(c(0,"div",1),E(1,O,1,1,"app-exercise-log",2,L),s()),t&2){let x=T();a(1),b(x.exerciseLogService.logs())}}function j(t,e){t&1&&(c(0,"div",3)(1,"div",4)(2,"span",5),p(3,"Loading..."),s()()())}var je=(()=>{let e=class e{constructor(){this.document=n(P),this.exerciseLogApiService=n(R),this.exerciseLogService=n(l),this.isGrouped=!1}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"});let r=this.exerciseLogApiService.getExerciseLogsv2();this.exerciseLogService.logs().length||this.exerciseLogService.withLoading(h([r]).pipe(_(([i])=>{this.exerciseLogService.updateLogs$.next(i)})))}};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=d({type:e,selectors:[["app-exercise-logs-page"]],standalone:!0,features:[m],decls:3,vars:2,consts:[["class","container"],[1,"container"],[3,"exerciseLog"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(i,o){i&1&&y(0,k,0,0)(1,$,3,0,"div",0)(2,j,4,0),i&2&&(f(0,o.exerciseLogService.loaded()?0:-1),a(1),f(1,o.exerciseLogService.loaded()?1:2))},dependencies:[B,N],changeDetection:0});let t=e;return t})();export{je as ExerciseLogsPageComponent};