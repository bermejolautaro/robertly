import{a as y}from"./chunk-5DURPXFT.js";import{B as L,e as h,o as _}from"./chunk-PWFKK35O.js";import{d as C}from"./chunk-QN4ZLGYB.js";import{Eb as l,Fb as d,Hb as g,Ib as f,Jb as i,Kb as n,Lb as u,Tb as x,bb as s,bc as v,jb as p,qa as a,xb as c,zb as m}from"./chunk-RORB2MO5.js";function S(e,r){if(e&1&&u(0,"app-exercise-log",3),e&2){let t=r.$implicit;m("exerciseLog",t)}}function T(e,r){if(e&1&&(i(0,"div",1),g(1,S,1,1,"app-exercise-log",3,d),n()),e&2){let t=x();s(),f(t.logs.value())}}function D(e,r){e&1&&(i(0,"div",2)(1,"div",4)(2,"span",5),v(3,"Loading..."),n()()())}var O=(()=>{class e{constructor(){this.document=a(C),this.exerciseLogApiService=a(_),this.logs=h({loader:()=>this.exerciseLogApiService.getExerciseLogsLatestWorkout()})}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"})}static{this.\u0275fac=function(o){return new(o||e)}}static{this.\u0275cmp=p({type:e,selectors:[["app-home-page"]],decls:3,vars:1,consts:[[1,"footer-padding"],[1,"container"],[1,"position-absolute","top-50","start-50","translate-middle"],[3,"exerciseLog"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(o,E){o&1&&(i(0,"div",0),c(1,T,3,0,"div",1)(2,D,4,0,"div",2),n()),o&2&&(s(),l(E.logs.isLoading()?2:1))},dependencies:[L,y],encapsulation:2,changeDetection:0})}}return e})();export{O as HomePageComponent};
