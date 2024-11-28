import{a as k}from"./chunk-R422ZC2Y.js";import{a as M}from"./chunk-M36IB62C.js";import{c as R}from"./chunk-OQL5BUCD.js";import{a as x}from"./chunk-DFIK5POZ.js";import{G as b,I as A,L as D,e as m,f as C,m as g,s as v,z as T}from"./chunk-GHPPUNBP.js";import{d as L,j as V}from"./chunk-VKLU7C4A.js";import{Ab as h,Fc as I,Gb as w,Hb as P,Ib as E,Ic as y,Ja as S,Jb as s,Kb as o,Lb as n,Sb as f,bb as a,cc as _,ec as F,jb as d,pa as l,tb as c}from"./chunk-LRWZ4U2F.js";var N=(()=>{class r{constructor(){this.filtersChanged=S(),this.exerciseApiService=l(A),this.authService=l(D),this.exerciseLogApiService=l(x),this.titleCasePipe=l(V),this.userSelector=e=>e?.name??"",this.exerciseFormatter=e=>this.titleCasePipe.transform(e),this.weightFormatter=e=>isNaN(parseInt(e??""))?"":`${e}kg`,this.exerciseSelector=e=>typeof e=="string"?"":this.titleCasePipe.transform(e?.name)??"",this.userControl=new g(null),this.typeControl=new g(null),this.exerciseControl=new g(null),this.weightControl=new g(null),this.userControlValues=m(this.userControl.valueChanges),this.typeControlValues=m(this.typeControl.valueChanges),this.exerciseControlValues=m(this.exerciseControl.valueChanges),this.weightControlValues=m(this.weightControl.valueChanges),this.users=c([]),this.types=c([]),this.weights=c([]),this.exercises=c([]),this.filters=C({loader:()=>this.exerciseLogApiService.getFilters(this.userControl.value?.userId,this.exerciseControl.value?.exerciseId,this.typeControl.value,this.weightControl.value?+this.weightControl.value:null)}),this.#e=y(()=>{let e=this.filters.value(),i=this.authService.user();e&&(this.users.set([i,...i?.assignedUsers??[]]),this.types.set(e.types),this.weights.set(e.weights.map(t=>`${t}`)),this.exercises.set(this.exerciseApiService.exercises().filter(t=>e.exercisesIds.includes(t.exerciseId))))}),this.#t=y(()=>{let e=this.userControlValues(),i=this.typeControlValues(),t=this.exerciseControlValues(),p=this.weightControlValues(),u=e?[e.userId]:[],U=i?[i]:[],$=t?.exerciseId?[t.exerciseId]:[],q=p?[+p]:[];this.filters.reload(),this.filtersChanged.emit({userId:u,exercisesIds:$,types:U,weights:q})})}#e;#t;static{this.\u0275fac=function(i){return new(i||r)}}static{this.\u0275cmp=d({type:r,selectors:[["app-filters"]],outputs:{filtersChanged:"filtersChanged"},decls:9,vars:11,consts:[[1,"col-12","mb-2"],["placeholder","User",3,"control","items","itemSelector"],[1,"row","mb-2","gx-2"],[1,"col-12"],["placeholder","Type",3,"control","items"],["placeholder","Exercise",3,"control","items","itemSelector"],["placeholder","Weight (kg)",3,"control","items","itemSelector"]],template:function(i,t){i&1&&(s(0,"div",0),n(1,"app-typeahead",1),o(),s(2,"div",2)(3,"div",3),n(4,"app-dropdown",4),o()(),s(5,"div",0),n(6,"app-typeahead",5),o(),s(7,"div",0),n(8,"app-typeahead",6),o()),i&2&&(a(),h("control",t.userControl)("items",t.users())("itemSelector",t.userSelector),a(3),h("control",t.typeControl)("items",t.types()),a(2),h("control",t.exerciseControl)("items",t.exercises())("itemSelector",t.exerciseSelector),a(2),h("control",t.weightControl)("items",t.weights())("itemSelector",t.weightFormatter))},dependencies:[b,v,T,M,k],encapsulation:2,changeDetection:0})}}return r})();function B(r,j){if(r&1&&n(0,"app-exercise-log",8),r&2){let e=j.$implicit;h("exerciseLog",e)}}var ue=(()=>{class r{constructor(){this.document=l(L),this.exerciseLogApiService=l(x),this.currentPage=c(0),this.filter=c(null),this.logsResource=C({request:this.filter,loader:({request:e})=>{let i=e?.userId.at(0),t=e?.types.at(0),p=e?.exercisesIds.at(0),u=e?.weights.at(0);return this.exerciseLogApiService.getExerciseLogs(this.currentPage(),i,t??null,p??null,u??null)}}),this.logs=I(()=>this.logsResource.isLoading()?[null,null,null,null,null]:this.logsResource.value())}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"})}onFilterChange(e){this.currentPage.set(0),this.filter.set(e),this.logsResource.reload()}prevPage(){let e=this.currentPage();this.currentPage.update(i=>Math.max(i-1,0)),e!==this.currentPage()&&this.logsResource.reload()}nextPage(){let e=this.currentPage();this.currentPage.update(i=>i+1),e!==this.currentPage()&&this.logsResource.reload()}static{this.\u0275fac=function(i){return new(i||r)}}static{this.\u0275cmp=d({type:r,selectors:[["app-exercise-logs-page"]],decls:12,vars:1,consts:[[1,"header-footer-padding"],[1,"container"],[3,"filtersChanged"],[1,"container","d-flex","justify-content-end","align-items-center","gap-2"],[1,"btn","btn-secondary",3,"click"],[1,"fa","fa-angle-left"],[1,"fa","fa-angle-right"],[1,"mt-4"],[3,"exerciseLog"]],template:function(i,t){i&1&&(s(0,"div",0)(1,"div",1)(2,"app-filters",2),f("filtersChanged",function(u){return t.onFilterChange(u)}),o(),s(3,"div",3)(4,"button",4),f("click",function(){return t.prevPage()}),n(5,"i",5),o(),_(6),s(7,"button",4),f("click",function(){return t.nextPage()}),n(8,"i",6),o()(),s(9,"div",7),P(10,B,1,1,"app-exercise-log",8,w),o()()()),i&2&&(a(6),F(" ",t.currentPage()+1," "),a(4),E(t.logs()))},dependencies:[v,R,N],encapsulation:2,changeDetection:0})}}return r})();export{ue as ExerciseLogsPageComponent};
