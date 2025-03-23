import{a as Z}from"./chunk-5LJZRERB.js";import{A as ee,e as q,g as I,h as $,i as G,j as Y,k as O,l as V,n as A,o as X}from"./chunk-ASOKKE6H.js";import{B as U,d as H,p as K,q as Q}from"./chunk-6EYGD3XX.js";import{Ac as J,Bb as R,Bc as N,Cb as m,Db as u,Eb as _,Fb as o,Gb as a,Hb as d,Ka as C,Mb as b,Nb as f,Rc as W,Ya as r,Yb as c,Zb as w,_b as B,a as h,b as M,ib as L,kc as D,lc as E,ma as v,nb as S,tb as y,ub as k,wb as F,yb as T}from"./chunk-ARLDQED4.js";var j=()=>[W,import("./chunk-SNGSQISQ.js").then(e=>e.RingComponent)];function te(e,n){if(e&1&&(o(0,"div",4),d(1,"app-ring",5),o(2,"div",6),c(3),D(4,"titlecase"),a()()),e&2){let t=f().$implicit;r(),F("value",t.totalSeries)("maxValue",t.target*1),r(2),B(" ",E(4,3,t.muscleGroup)," ")}}function ie(e,n){e&1&&d(0,"div")}function re(e,n){e&1&&(S(0,te,5,5)(1,ie,1,0),y(2,0,j,null,1),k(0,-1))}function ne(e,n){if(e&1&&(o(0,"div",0)(1,"div",2),c(2),a(),o(3,"div",3),u(4,re,4,0,null,null,m),a()()),e&2){let t=n.$implicit;r(2),w(t[0]),r(2),_(t[1])}}function oe(e,n){if(e&1&&u(0,ne,6,1,"div",0,m),e&2){let t=f();_(t.seriesPerWeek())}}function ae(e,n){if(e&1&&(o(0,"div",4),d(1,"app-ring",5),o(2,"div",6),c(3),D(4,"titlecase"),a()()),e&2){let t=f().$implicit;r(),F("value",t.totalSeries)("maxValue",t.target*4),r(2),B(" ",E(4,3,t.muscleGroup)," ")}}function se(e,n){e&1&&d(0,"div")}function le(e,n){e&1&&(S(0,ae,5,5)(1,se,1,0),y(2,0,j,null,1),k(0,-1))}function ce(e,n){if(e&1&&(o(0,"div",0)(1,"div",2),c(2),a(),o(3,"div",3),u(4,le,4,0,null,null,m),a()()),e&2){let t=n.$implicit;r(2),w(t[0]),r(2),_(t[1])}}function pe(e,n){if(e&1&&u(0,ce,6,1,"div",0,m),e&2){let t=f();_(t.seriesPerMonth())}}function me(e,n){if(e&1&&(o(0,"div",4),d(1,"app-ring",5),o(2,"div",6),c(3),D(4,"titlecase"),a()()),e&2){let t=f().$implicit;r(),F("value",t.totalSeries)("maxValue",t.target*52),r(2),B(" ",E(4,3,t.muscleGroup)," ")}}function ue(e,n){e&1&&d(0,"div")}function _e(e,n){e&1&&(S(0,me,5,5)(1,ue,1,0),y(2,0,j,null,1),k(0,-1))}function de(e,n){if(e&1&&(o(0,"div",0)(1,"div",2),c(2),a(),o(3,"div",3),u(4,_e,4,0,null,null,m),a()()),e&2){let t=n.$implicit;r(2),w(t[0]),r(2),_(t[1])}}function fe(e,n){if(e&1&&u(0,de,6,1,"div",0,m),e&2){let t=f();_(t.seriesPerYear())}}function Pe(e){switch(e){case"biceps":case"triceps":case"calves":case"shoulders":return 6;case"back":case"legs":case"chest":return 10;case"forearms":case"glutes":return 3;default:return 10}}var we=(()=>{class e{constructor(){this.router=v(q),this.exerciseLogApiService=v(Z),this.dayjs=v(ee),this.exercisesApiService=v(X),this.titleCasePipe=v(W),this.seriesPerMuscle=H({loader:()=>this.exerciseLogApiService.getSeriesPerMuscle()}),this.defaultValues=N(()=>this.exercisesApiService.muscleGroups().map(t=>({totalSeries:0,muscleGroup:t??"",firstDateInPeriod:"",month:0,week:0,year:0,target:Pe(t)}))),this.period=C("week"),this.seriesPerWeek=C([]),this.seriesPerMonth=C([]),this.seriesPerYear=C([]),this.#e=J(()=>{let t=this.seriesPerMuscle.value();if(t){let P=I(t.seriesPerMuscleWeekly,V(i=>`${i.year}-${i.week.toString().padStart(2,"0")}`),Y(i=>this.defaultValues().map(l=>{let p=i.find(g=>g.muscleGroup===l.muscleGroup);return p?M(h({},p),{target:l.target}):l})),A(),$(i=>i[0]),G(),O(i=>[`Week ${i[0].split("-")[1]} of ${i[0].split("-")[0]}`,i[1]])),s=I(t.seriesPerMuscleYearly,V(i=>`${i.year}`),Y(i=>this.defaultValues().map(l=>{let p=i.find(g=>g.muscleGroup===l.muscleGroup);return p?M(h({},p),{target:l.target}):l})),A(),$(i=>i[0]),G()),x=I(t.seriesPerMuscleMonthly,V(i=>`${i.year.toString()}-${i.month.toString().padStart(2,"0")}-01`),Y(i=>this.defaultValues().map(l=>{let p=i.find(g=>g.muscleGroup===l.muscleGroup);return p?M(h({},p),{target:l.target}):l})),A(),$(i=>i[0]),G(),O(i=>[this.titleCasePipe.transform(this.dayjs(i[0]).format("MMM[ - ]YYYY")),i[1]]));this.seriesPerWeek.set(P),this.seriesPerMonth.set(x),this.seriesPerYear.set(s)}})}#e;static{this.\u0275fac=function(P){return new(P||e)}}static{this.\u0275cmp=L({type:e,selectors:[["app-series-per-muscle-page"]],decls:10,vars:9,consts:[[1,"pb-4"],[1,"btn","me-1","badge","rounded-pill","chip",3,"click"],[1,"pb-2","text-end"],[2,"display","grid","grid-template-columns","1fr 1fr 1fr 1fr 1fr","gap","0.5rem 0.2rem"],[1,"d-flex","justify-content-center","align-items-center","flex-column"],["size","s",3,"value","maxValue"],[2,"text-align","center","font-size","12px"]],template:function(P,s){P&1&&(o(0,"div",0)(1,"button",1),b("click",function(){return s.period.set("week")}),c(2," Week "),a(),o(3,"button",1),b("click",function(){return s.period.set("month")}),c(4," Month "),a(),o(5,"button",1),b("click",function(){return s.period.set("year")}),c(6," Year "),a()(),S(7,oe,2,0)(8,pe,2,0)(9,fe,2,0)),P&2&&(r(),T("active",s.period()==="week"),r(2),T("active",s.period()==="month"),r(2),T("active",s.period()==="year"),r(2),R(s.period()==="week"?7:-1),r(),R(s.period()==="month"?8:-1),r(),R(s.period()==="year"?9:-1))},dependencies:[U,K,Q],styles:[".badge.chip[_ngcontent-%COMP%]{font-size:16px;font-weight:400}.badge.chip.active[_ngcontent-%COMP%]{--bs-btn-active-border-color: transparent;--bs-btn-active-bg: var(--primary)}"],changeDetection:0})}}return e})();export{we as SeriesPerMusclePageComponent};
