import{a as B}from"./chunk-UHC75XPR.js";import{a as q}from"./chunk-SDZBR5WF.js";import{a as z}from"./chunk-VGWT7OUG.js";import{a as w}from"./chunk-DU72JDDR.js";import"./chunk-BMPGKSU7.js";import"./chunk-BKM2CJT2.js";import{o as U,r as $}from"./chunk-2UKEB32I.js";import{I as O,b as g,d as _,l as f,p as y,y as N}from"./chunk-6EYGD3XX.js";import{$b as A,Ac as I,Bb as L,Cb as b,Db as T,Eb as k,Fb as n,Gb as s,Ha as V,Hb as c,Ic as R,Ka as a,Kb as M,Mb as h,Nb as d,Rc as j,Ya as o,Yb as v,Zb as D,ib as x,ma as p,nb as E,ua as S,va as P,wb as u,zc as F}from"./chunk-ARLDQED4.js";var K=(()=>{class r{constructor(){this.filtersChanged=V(),this.exerciseApiService=p(U),this.authService=p($),this.exerciseLogApiService=p(w),this.titleCasePipe=p(j),this.userSelector=e=>e?.name??"",this.exerciseFormatter=e=>this.titleCasePipe.transform(e),this.weightFormatter=e=>isNaN(parseInt(e??""))?"":`${e}kg`,this.exerciseSelector=e=>typeof e=="string"?"":this.titleCasePipe.transform(e?.name)??"",this.userControl=new f(null),this.typeControl=new f(null),this.exerciseControl=new f(null),this.weightControl=new f(null),this.userControlValues=g(this.userControl.valueChanges),this.typeControlValues=g(this.typeControl.valueChanges),this.exerciseControlValues=g(this.exerciseControl.valueChanges),this.weightControlValues=g(this.weightControl.valueChanges),this.users=a([]),this.types=a([]),this.weights=a([]),this.exercises=a([]),this.filters=_({loader:()=>this.exerciseLogApiService.getFilters(this.userControl.value?.userId,this.exerciseControl.value?.exerciseId,this.typeControl.value,this.weightControl.value?+this.weightControl.value:null)}),I(()=>{let e=this.filters.value(),i=this.authService.user();e&&(this.users.set([i,...i?.assignedUsers??[]]),this.types.set(e.types),this.weights.set(e.weights.map(t=>`${t}`)),this.exercises.set(this.exerciseApiService.exercises().filter(t=>e.exercisesIds.includes(t.exerciseId))))}),I(()=>{let e=this.userControlValues(),i=this.typeControlValues(),t=this.exerciseControlValues(),l=this.weightControlValues(),m=e?[e.userId]:[],W=i?[i]:[],G=t?.exerciseId?[t.exerciseId]:[],H=l?[+l]:[];this.filters.reload(),this.filtersChanged.emit({userId:m,exercisesIds:G,types:W,weights:H})})}static{this.\u0275fac=function(i){return new(i||r)}}static{this.\u0275cmp=x({type:r,selectors:[["app-filters"]],outputs:{filtersChanged:"filtersChanged"},decls:9,vars:11,consts:[[1,"col-12","mb-2"],["placeholder","User",3,"control","items","itemSelector"],[1,"row","mb-2","gx-2"],[1,"col-12"],["placeholder","Type",3,"control","items"],["placeholder","Exercise",3,"control","items","itemSelector"],["placeholder","Weight (kg)",3,"control","items","itemSelector"]],template:function(i,t){i&1&&(n(0,"div",0),c(1,"app-typeahead",1),s(),n(2,"div",2)(3,"div",3),c(4,"app-dropdown",4),s()(),n(5,"div",0),c(6,"app-typeahead",5),s(),n(7,"div",0),c(8,"app-typeahead",6),s()),i&2&&(o(),u("control",t.userControl)("items",t.users())("itemSelector",t.userSelector),o(3),u("control",t.typeControl)("items",t.types()),o(2),u("control",t.exerciseControl)("items",t.exercises())("itemSelector",t.exerciseSelector),o(2),u("control",t.weightControl)("items",t.weights())("itemSelector",t.weightFormatter))},dependencies:[O,y,N,q,z],encapsulation:2,changeDetection:0})}}return r})();function Q(r,C){if(r&1&&(n(0,"span",3),v(1),s()),r&2){let e=d();o(),D(e.filtersCount())}}function X(r,C){if(r&1&&c(0,"app-exercise-log",9),r&2){let e=C.$implicit;u("exerciseLog",e)}}function Y(r,C){r&1&&(n(0,"div",10),v(1,"No results found"),s())}function Z(r,C){if(r&1){let e=M();n(0,"div",11)(1,"button",12)(2,"i",13),h("click",function(){S(e);let t=d();return P(t.prevPage())}),s()(),v(3),n(4,"button",14),h("click",function(){S(e);let t=d();return P(t.nextPage())}),c(5,"i",15),s()()}if(r&2){let e,i=d();o(3),A(" Page ",i.currentPage()+1," of ",((e=(e=i.logsResource.value())==null?null:e.pageCount)!==null&&e!==void 0?e:0)+1," ")}}var we=(()=>{class r{constructor(){this.document=p(R),this.exerciseLogApiService=p(w),this.showFilters=a(!1),this.currentPage=a(0),this.filter=a(null),this.filtersCount=F(()=>{let e=this.filter();return e?Object.values(e).reduce((i,t)=>i+t.length,0):0}),this.logsResource=_({request:this.filter,loader:({request:e})=>{let i=e?.userId.at(0),t=e?.types.at(0),l=e?.exercisesIds.at(0),m=e?.weights.at(0);return this.exerciseLogApiService.getExerciseLogs(this.currentPage(),i,t??null,l??null,m??null)}}),this.logs=F(()=>this.logsResource.isLoading()?[null,null,null,null,null]:this.logsResource.value()?.data)}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"})}onFilterChange(e){this.currentPage.set(0),this.filter.set(e),this.logsResource.reload()}prevPage(){let e=this.currentPage();this.currentPage.update(i=>Math.max(i-1,0)),e!==this.currentPage()&&this.logsResource.reload()}nextPage(){let e=this.currentPage();this.currentPage.update(i=>Math.min(i+1,this.logsResource.value()?.pageCount??1/0)),e!==this.currentPage()&&this.logsResource.reload()}static{this.\u0275fac=function(i){return new(i||r)}}static{this.\u0275cmp=x({type:r,selectors:[["app-exercise-logs-page"]],decls:13,vars:4,consts:[[1,"header-footer-padding"],[1,"container"],[1,"d-flex","justify-content-end"],[1,"active-filters"],[1,"btn","btn-secondary",3,"click"],[1,"fa","fa-sliders"],[1,"mt-2",3,"hidden"],[3,"filtersChanged"],[1,"mt-2"],[3,"exerciseLog"],[1,"d-flex","justify-content-center","align-items-center","my-5"],[1,"d-flex","justify-content-center","align-items-center","gap-2"],[1,"btn"],[1,"fa","fa-angle-left",3,"click"],[1,"btn",3,"click"],[1,"fa","fa-angle-right"]],template:function(i,t){if(i&1&&(n(0,"div",0)(1,"div",1)(2,"div",2),E(3,Q,2,1,"span",3),n(4,"button",4),h("click",function(){return t.showFilters.set(!t.showFilters())}),c(5,"i",5),s()(),n(6,"div",6)(7,"app-filters",7),h("filtersChanged",function(m){return t.onFilterChange(m)}),s()(),n(8,"div",8),T(9,X,1,1,"app-exercise-log",9,b,!1,Y,2,0,"div",10),s(),E(12,Z,6,2,"div",11),s()()),i&2){let l;o(3),L(t.filtersCount()?3:-1),o(3),u("hidden",!t.showFilters()),o(3),k(t.logs()),o(3),L((l=t.logs())!=null&&l.length?12:-1)}},dependencies:[y,B,K],styles:[".toggle-filters[_ngcontent-%COMP%]{border:1px solid white;border-radius:5px;width:2rem;height:2rem}.active-filters[_ngcontent-%COMP%]{display:inline;position:relative;text-align:center;background:#ef4444;border-radius:100%;width:18px;height:18px;font-size:12px;font-weight:700;top:-6px;right:-44px}"],changeDetection:0})}}return r})();export{we as ExerciseLogsPageComponent};
