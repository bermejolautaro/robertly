import{a as D}from"./chunk-OUFG6VXL.js";import{B as A,e as P,p as H}from"./chunk-SRFMWQP5.js";import{d as T,n as W}from"./chunk-MYBBF3QI.js";import{Ab as x,Ec as E,Fb as f,Gb as v,Ib as _,Jb as C,Kb as o,Lb as i,Mb as S,Pb as w,Tb as L,Ub as p,bb as a,cc as r,dc as k,jb as g,oc as M,qa as c,rc as y,tb as u,ya as m,yb as h,za as d}from"./chunk-26H5WKEY.js";function b(e,s){if(e&1&&S(0,"app-exercise-log",4),e&2){let t=s.$implicit;x("exerciseLog",t)}}function V(e,s){if(e&1){let t=w();o(0,"div",1)(1,"div",3)(2,"h6"),r(3,"Recently updated"),i()(),o(4,"div",3)(5,"h6"),r(6,"Latest Workout"),i()(),_(7,b,1,1,"app-exercise-log",4,v),M(9,"slice"),o(10,"div",5),L("click",function(){m(t);let l=p();return d(l.toggleShowMore())}),r(11),i()()}if(e&2){let t=p();a(7),C(y(9,1,t.latestWorkoutLogs.value(),0,t.latestWorkoutAmountToShow())),a(4),k(t.showMore()?"Show less...":"Show more...")}}function F(e,s){e&1&&(o(0,"div",2)(1,"div",6)(2,"span",7),r(3,"Loading..."),i()()())}var q=(()=>{class e{constructor(){this.document=c(T),this.exerciseLogApiService=c(H),this.showMore=u(!1),this.latestWorkoutAmountToShow=E(()=>this.showMore()?this.latestWorkoutLogs.value()?.length??10:3),this.latestWorkoutLogs=P({loader:()=>this.exerciseLogApiService.getExerciseLogsLatestWorkout()})}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"})}toggleShowMore(){this.showMore.update(t=>!t)}static{this.\u0275fac=function(n){return new(n||e)}}static{this.\u0275cmp=g({type:e,selectors:[["app-home-page"]],decls:3,vars:1,consts:[[1,"footer-padding"],[1,"container"],[1,"position-absolute","top-50","start-50","translate-middle"],[1,"pb-2"],[3,"exerciseLog"],[2,"font-size","14px","padding","0 .4rem",3,"click"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(n,l){n&1&&(o(0,"div",0),h(1,V,12,5,"div",1)(2,F,4,0,"div",2),i()),n&2&&(a(),f(l.latestWorkoutLogs.isLoading()?2:1))},dependencies:[A,D,W],encapsulation:2,changeDetection:0})}}return e})();export{q as HomePageComponent};
