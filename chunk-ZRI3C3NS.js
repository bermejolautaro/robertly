import{d as T,m as b,w as l}from"./chunk-QQUWNONX.js";import{C as M,q as P,r as F}from"./chunk-DWM6OEN4.js";import{Db as f,Eb as u,Fb as i,Gb as o,Hb as g,Kb as v,Lc as y,Mb as _,Nb as E,Ya as c,Yb as p,Zb as C,ib as x,jc as h,kc as S,ma as a,ua as m,va as d}from"./chunk-QHOELIAC.js";var D=(e,n)=>n.exerciseId;function I(e,n){if(e&1){let t=v();i(0,"li",5),_("click",function(){let s=m(t).$implicit,w=E();return d(w.navigateToExercise(s.exerciseId))}),i(1,"span"),p(2),h(3,"titlecase"),o()()}if(e&2){let t=n.$implicit;c(2),C(S(3,1,t.name))}}function k(e,n){e&1&&(i(0,"div",4)(1,"div",6)(2,"span",7),p(3,"Loading..."),o()()())}var q=(()=>{class e{constructor(){this.router=a(T),this.exerciseApiService=a(b)}async ngOnInit(){await this.exerciseApiService.fetchExercises()}navigateToExercise(t){t&&this.router.navigate([l.EXERCISES,l.EDIT,t])}static{this.\u0275fac=function(r){return new(r||e)}}static{this.\u0275cmp=x({type:e,selectors:[["app-exercises-page"]],decls:6,vars:1,consts:[[1,"container","header-footer-padding"],[1,"d-flex","justify-content-end","mb-3"],[1,"list-group"],[1,"list-group-item","d-flex","align-items-center"],[1,"position-absolute","top-50","start-50","translate-middle"],[1,"list-group-item","d-flex","align-items-center",3,"click"],["role","status",1,"robertly-spinner","spinner-border","text-primary"],[1,"visually-hidden"]],template:function(r,s){r&1&&(i(0,"div",0),g(1,"div",1),i(2,"ul",2),f(3,I,4,3,"li",3,D,!1,k,4,0,"div",4),o()()),r&2&&(c(3),u(s.exerciseApiService.exercises()))},dependencies:[y,M,P,F],encapsulation:2,changeDetection:0})}}return e})();export{q as ExercisesPageComponent};
