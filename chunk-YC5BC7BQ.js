import{a as b,d as z}from"./chunk-7TAS5YYO.js";import{d as B,w as f}from"./chunk-QQUWNONX.js";import{Bb as P,Cb as S,Db as M,Eb as T,Fb as i,Gb as n,Hb as s,Ia as E,Kb as y,Lc as k,Mb as O,Nb as m,Ya as o,Yb as r,Zb as c,_b as g,cc as w,dc as I,ec as D,ib as h,jc as l,kc as x,lc as v,ma as _,nb as L,ua as C,va as u}from"./chunk-QHOELIAC.js";function F(t,p){if(t&1&&(i(0,"div",7)(1,"div"),r(2),l(3,"padStart"),n(),i(4,"div"),r(5),l(6,"padStart"),n()()),t&2){let e=p.$implicit;o(2),g("",v(3,2,e.reps,2)," reps"),o(3),g("",v(6,5,e.weightInKg,2),"kg")}}function R(t,p){if(t&1){let e=y();i(0,"div",1),O("click",function(){C(e);let d=m();return u(d.navigateToEditLog())}),i(1,"div",2)(2,"div",3)(3,"div",4),r(4),l(5,"titlecase"),n(),i(6,"div",5),r(7),l(8,"parseToDate"),n(),i(9,"div",5),r(10),n()(),i(11,"div",6),M(12,F,7,8,"div",7,S),n()()()}if(t&2){m();let e=D(0);o(4),c(x(5,3,e.exercise.name)),o(3),c(x(8,5,e.date)),o(3),c(e.user.name),o(2),T(e.series)}}function j(t,p){t&1&&(i(0,"div",0)(1,"div",2)(2,"div",8)(3,"div",4),s(4,"span",9),n(),i(5,"div",5),s(6,"span",10),n()()()())}var Q=(()=>{class t{constructor(){this.router=_(B),this.exerciseLog=E()}navigateToEditLog(){let e=this.exerciseLog();e&&this.router.navigate([f.EXERCISE_LOGS,f.EDIT,e.id])}static{this.\u0275fac=function(a){return new(a||t)}}static{this.\u0275cmp=h({type:t,selectors:[["app-exercise-log"]],inputs:{exerciseLog:[1,"exerciseLog"]},decls:3,vars:2,consts:[[1,"log"],[1,"log",3,"click"],[2,"display","grid","grid-template-columns","auto auto"],[1,"d-flex","flex-column","align-self-center"],[1,"title"],[1,"hint"],[1,"series"],[1,"serie"],[1,"d-flex","flex-column","placeholder-glow"],[1,"placeholder","col-6"],[1,"placeholder","col-12"]],template:function(a,d){if(a&1&&(w(0),L(1,R,14,7,"div",0)(2,j,7,0,"div",0)),a&2){let V=I(d.exerciseLog());o(),P(V?1:2)}},dependencies:[k,z,b],styles:[".log[_ngcontent-%COMP%]{background-color:var(--light-bg);color:var(--font-color);margin-bottom:8px;border-radius:5px;padding:.2rem .6rem}.log[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-size:15px;font-weight:600}.log[_ngcontent-%COMP%]   .hint[_ngcontent-%COMP%]{font-size:12px;opacity:.8}.log[_ngcontent-%COMP%]   .series[_ngcontent-%COMP%]{display:grid;font-size:12px;opacity:.8}.log[_ngcontent-%COMP%]   .series[_ngcontent-%COMP%]   .serie[_ngcontent-%COMP%]{display:grid;grid-template-columns:1.5fr 1fr;white-space:pre-wrap;text-align:right}"],changeDetection:0})}}return t})();export{Q as a};
