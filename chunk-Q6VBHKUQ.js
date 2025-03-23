import{a as z}from"./chunk-YIWIJQG4.js";import{a as F}from"./chunk-GB6OAMIK.js";import{a as D}from"./chunk-5LJZRERB.js";import{a as I}from"./chunk-T7VIOC4T.js";import"./chunk-4BULIK76.js";import{a as H}from"./chunk-CJDWQQAO.js";import"./chunk-KPV7ZK4F.js";import{e as b,y as B}from"./chunk-ASOKKE6H.js";import{d as S,p as U}from"./chunk-6EYGD3XX.js";import{Cb as w,Db as T,Eb as P,Fb as e,Gb as i,Hb as r,Ic as W,Ka as k,Kb as V,Mb as m,Uc as A,Ya as c,Yb as n,_b as C,dc as O,ib as M,kc as x,ma as f,nc as R,ua as s,va as d,wb as g,zc as u}from"./chunk-ARLDQED4.js";function j(p,E){if(p&1&&r(0,"app-exercise-log",17),p&2){let l=E.$implicit;g("exerciseLog",l)}}function G(p,E){if(p&1&&r(0,"app-exercise-log",17),p&2){let l=E.$implicit;g("exerciseLog",l)}}var oe=(()=>{class p{constructor(){this.document=f(W),this.exerciseLogApiService=f(D),this.foodLogsApiService=f(H),this.router=f(b),this.Paths=B,this.daysPerWeekTarget=u(()=>4),this.showMoreRecentlyUpdated=k(!1),this.recentlyUpdatedAmountToShow=u(()=>this.showMoreRecentlyUpdated()?this.recentlyUpdatedLogsResource.value()?.length??10:2),this.showMoreLatestWorkout=k(!1),this.latestWorkoutAmountToShow=u(()=>this.showMoreLatestWorkout()?this.latestWorkoutLogsResource.value()?.length??10:2),this.isLoading=u(()=>this.recentlyUpdatedLogsResource.isLoading()&&this.latestWorkoutLogsResource.isLoading()&&this.exerciseLogStats.isLoading()),this.exerciseLogStats=S({loader:()=>this.exerciseLogApiService.getDaysTrained()}),this.recentlyUpdatedLogsResource=S({loader:()=>this.exerciseLogApiService.getRecentlyUpdated()}),this.latestWorkoutLogsResource=S({loader:()=>this.exerciseLogApiService.getExerciseLogsLatestWorkout()}),this.macros=S({loader:()=>this.foodLogsApiService.getMacros(Intl.DateTimeFormat().resolvedOptions().timeZone)}),this.recentlyUpdatedLogs=u(()=>this.recentlyUpdatedLogsResource.isLoading()?[null,null]:this.recentlyUpdatedLogsResource.value()),this.latestWorkoutLogs=u(()=>this.latestWorkoutLogsResource.isLoading()?[null,null]:this.latestWorkoutLogsResource.value())}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"})}navigateTo(l){this.router.navigate(l)}toggleShowMoreRecentlyUpdated(){this.showMoreRecentlyUpdated.update(l=>!l)}toggleShowMoreLatestWorkout(){this.showMoreLatestWorkout.update(l=>!l)}static{this.\u0275fac=function(L){return new(L||p)}}static{this.\u0275cmp=M({type:p,selectors:[["app-home-page"]],decls:81,vars:22,consts:[[1,"header-footer-padding"],[1,"container"],[1,"pb-3",2,"display","grid","grid-template-columns","1fr 1fr 1fr"],[1,"d-flex","justify-content-center","align-items-center","flex-column"],[3,"value","maxValue"],[2,"text-align","center","font-size","12px","padding","0.5rem"],[1,"pt-4"],[3,"current","goal","label"],[1,"services"],[1,"service",3,"click"],[1,"service-icon"],[1,"iconoir-book"],[1,"iconoir-plus-circle-solid"],[1,"btn","btn-link"],[1,"iconoir-pizza-slice"],[1,"iconoir-gym"],[1,"pt-4","pb-2"],[3,"exerciseLog"],[2,"font-size","14px","padding","0 0.4rem",3,"click"]],template:function(L,t){if(L&1){let o=V();e(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),O(4),r(5,"app-ring",4),e(6,"div",5),n(7,"Days trained this week"),i()(),e(8,"div",3),r(9,"app-ring",4),e(10,"div",5),n(11,"Days trained this month"),i()(),e(12,"div",3),r(13,"app-ring",4),e(14,"div",5),n(15,"Days trained this year"),i()()(),e(16,"div",6),r(17,"app-progress-bar",7)(18,"app-progress-bar",7),i(),e(19,"div",6)(20,"div",8)(21,"div",9),m("click",function(){return s(o),d(t.navigateTo([t.Paths.FOOD_LOGS,t.Paths.CREATE]))}),e(22,"div",10),r(23,"i",11)(24,"i",12),i(),e(25,"span",13),n(26," Add Food Log"),i()(),e(27,"div",9),m("click",function(){return s(o),d(t.navigateTo([t.Paths.EXERCISE_LOGS,t.Paths.CREATE]))}),e(28,"div",10),r(29,"i",11)(30,"i",12),i(),e(31,"span",13),n(32,"Add Exercise Log"),i()(),e(33,"div",9),m("click",function(){return s(o),d(t.navigateTo([t.Paths.FOODS,t.Paths.CREATE]))}),e(34,"div",10),r(35,"i",14)(36,"i",12),i(),e(37,"span",13),n(38,"Add Food"),i()(),e(39,"div",9),m("click",function(){return s(o),d(t.navigateTo([t.Paths.EXERCISES,t.Paths.CREATE]))}),e(40,"div",10),r(41,"i",15)(42,"i",12),i(),e(43,"span",13),n(44,"Add Exercise"),i()(),e(45,"div",9),m("click",function(){return s(o),d(t.navigateTo([t.Paths.FOOD_LOGS]))}),e(46,"div",10),r(47,"i",11),i(),e(48,"span",13),n(49,"Food Logs"),i()(),e(50,"div",9),m("click",function(){return s(o),d(t.navigateTo([t.Paths.EXERCISE_LOGS]))}),e(51,"div",10),r(52,"i",11),i(),e(53,"span",13),n(54,"Exercise Logs"),i()(),e(55,"div",9),m("click",function(){return s(o),d(t.navigateTo([t.Paths.FOODS]))}),e(56,"div",10),r(57,"i",14),i(),e(58,"span",13),n(59,"Foods"),i()(),e(60,"div",9),m("click",function(){return s(o),d(t.navigateTo([t.Paths.EXERCISES]))}),e(61,"div",10),r(62,"i",15),i(),e(63,"span",13),n(64,"Exercises"),i()()()(),e(65,"div",16)(66,"h6"),n(67,"Recently updated"),i()(),T(68,j,1,1,"app-exercise-log",17,w),x(70,"slice"),e(71,"div",18),m("click",function(){return s(o),d(t.toggleShowMoreRecentlyUpdated())}),n(72),i(),e(73,"div",16)(74,"h6"),n(75,"Latest Workout"),i()(),T(76,G,1,1,"app-exercise-log",17,w),x(78,"slice"),e(79,"div",18),m("click",function(){return s(o),d(t.toggleShowMoreLatestWorkout())}),n(80),i()()()}if(L&2){let o,a,y,v,_,h=t.exerciseLogStats.value();c(5),g("value",(o=h==null?null:h.daysTrainedThisWeek)!==null&&o!==void 0?o:0)("maxValue",t.daysPerWeekTarget()*1),c(4),g("value",(a=h==null?null:h.daysTrainedThisMonth)!==null&&a!==void 0?a:0)("maxValue",t.daysPerWeekTarget()*4),c(4),g("value",(y=h==null?null:h.daysTrainedThisYear)!==null&&y!==void 0?y:0)("maxValue",t.daysPerWeekTarget()*52),c(4),g("current",(v=(v=t.macros.value())==null?null:v.caloriesInDate)!==null&&v!==void 0?v:0)("goal",2300)("label","Calories"),c(),g("current",(_=(_=t.macros.value())==null?null:_.proteinInDate)!==null&&_!==void 0?_:0)("goal",130)("label","Protein"),c(50),P(R(70,14,t.recentlyUpdatedLogs(),0,t.recentlyUpdatedAmountToShow())),c(4),C(" ",t.showMoreRecentlyUpdated()?"Show less...":"Show more..."," "),c(4),P(R(78,18,t.latestWorkoutLogs(),0,t.latestWorkoutAmountToShow())),c(4),C(" ",t.showMoreLatestWorkout()?"Show less...":"Show more..."," ")}},dependencies:[U,z,F,I,A],styles:[".services[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;align-items:start;margin-top:.5rem;background-color:var(--light-bg);border-radius:5px;padding:.9rem 0;gap:1rem .5rem}.service[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center}.service[_ngcontent-%COMP%]   .iconoir-plus-circle-solid[_ngcontent-%COMP%]{width:0;height:0;position:relative;top:-26px;right:2px;font-size:18px;color:#a78cf3}.service[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{padding:0;font-size:10px;text-decoration:none;color:#fff;width:64px}.service-icon[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;border-radius:100%;color:#ffffffe6;border:2px solid rgba(255,255,255,.4);padding:1.1rem;width:36px;height:36px;margin-bottom:.15rem}.service-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:22px}"],changeDetection:0})}}return p})();export{oe as HomePageComponent};
