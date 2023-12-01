import{A as L,B as j,C as $,D as P,E as Le,F as je,G as $e,H as Pe,I as Fe,J as Me,c as E,d as b,e as A,g as ne,h as be,i as Ce,j as Ee,k as Re,m as Se,r as Te,s as Ie,t as Ae,u as Be,v as De,w as Ne,x as B,y as D,z as N}from"./chunk-Z6KQER73.js";import{Aa as ve,C as me,Ca as w,D as ue,Fa as g,Ga as x,Ia as ee,J as ge,Ja as te,K as v,La as ie,Ma as we,N as xe,P as Q,Q as q,Ra as S,Sa as T,Ta as W,Va as ye,Wa as I,X as s,da as p,e as Y,ea as Z,f as R,ia as m,j as y,ja as z,k as G,ka as fe,la as _e,ma as c,na as r,oa as h,p as re,pa as K,q as ce,sa as C,t as se,ta as u,u as ae,w as pe,wa as he,x as le,xa as l,z as de,za as _}from"./chunk-MSZ6ARN3.js";function J(e){return e}var ke=(()=>{let t=class t{transform(a){return a??[]}};t.\u0275fac=function(o){return new(o||t)},t.\u0275pipe=xe({name:"ifNullEmptyArray",type:t,pure:!0,standalone:!0});let e=t;return e})();function qe(e,t){e&1&&h(0,"i",8)}function ze(e,t){if(e&1&&(c(0,"div",6),l(1),g(2,"titlecase"),m(3,qe,1,0,"i",7),r()),e&2){let i=u(2);Z("font-size",1,"rem"),s(1),_(" ",x(2,4,i.excerciseRow.excerciseName)," "),s(2),p("ngIf",i.showStar)}}function Ke(e,t){if(e&1&&(c(0,"div",4),m(1,ze,4,6,"div",5),r()),e&2){let i=u();p("ngClass",i.showDate&&i.showUsername?"fw-semibold":null),s(1),p("ngIf",i.showExcercise)}}function We(e,t){if(e&1&&(c(0,"div",9),l(1),g(2,"titlecase"),r()),e&2){let i=u();Z("font-size",.8,"rem"),s(1),ve(" ",i.excerciseRow.date," - ",x(2,4,i.excerciseRow.username)," ")}}var M=(()=>{let t=class t{constructor(){this.showStar=!1,this.showExcercise=!0,this.showDate=!0,this.showUsername=!0}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=v({type:t,selectors:[["app-excercise-row-title"]],inputs:{showStar:"showStar",showExcercise:"showExcercise",showDate:"showDate",showUsername:"showUsername",excerciseRow:"excerciseRow"},standalone:!0,features:[w],decls:4,vars:2,consts:[[1,"w-100"],["class","row w-100 pb-1",3,"ngClass",4,"ngIf"],[1,"row"],["class","col d-flex text-muted",3,"fontSize",4,"ngIf"],[1,"row","w-100","pb-1",3,"ngClass"],["class","col d-flex align-items-center gap-1",3,"fontSize",4,"ngIf"],[1,"col","d-flex","align-items-center","gap-1"],["class","fa fa-star",4,"ngIf"],[1,"fa","fa-star"],[1,"col","d-flex","text-muted"]],template:function(o,n){o&1&&(c(0,"div",0),m(1,Ke,2,2,"div",1),c(2,"div",2),m(3,We,3,6,"div",3),r()()),o&2&&(s(1),p("ngIf",n.excerciseRow),s(2),p("ngIf",n.showDate))},dependencies:[W,S,I],styles:["[_nghost-%COMP%]{display:flex;flex:1}"],changeDetection:0});let e=t;return e})();var Je=(e,t)=>t.serie;function Xe(e,t){if(e&1&&(c(0,"tr",3)(1,"td",4),l(2),r(),c(3,"td",5),l(4),r(),c(5,"td",5),l(6),r()()),e&2){let i=t.$implicit;s(2),_("Serie ",i.serie,""),s(2),_("",i.reps," reps"),s(2),_("",i.weightKg,"kg")}}function Ye(e,t){if(e&1&&(c(0,"tr",3)(1,"td",4),l(2,"Total"),r(),c(3,"td",5),l(4),r(),c(5,"td",5),l(6),r()()),e&2){let i=u(2);s(4),_("",i.excerciseRow.total," reps"),s(2),_("",i.excerciseRow.series[0].weightKg,"kg")}}function Ze(e,t){if(e&1&&(c(0,"tr",3)(1,"td",4),l(2,"Average"),r(),c(3,"td",5),l(4),r(),c(5,"td",5),l(6),r()()),e&2){let i=u(2);s(4),_("",i.excerciseRow.average," reps"),s(2),_("",i.excerciseRow.series[0].weightKg,"kg")}}function et(e,t){if(e&1&&(c(0,"table",1)(1,"tbody"),fe(2,Xe,7,3,"tr",2,Je),m(4,Ye,7,2,"tr",2)(5,Ze,7,2,"tr",2),c(6,"tr",3)(7,"td",4),l(8,"Tonnage"),r(),c(9,"td",5),l(10,"\xA0"),r(),c(11,"td",5),l(12),r()()()()),e&2){let i=u();s(2),_e(i.excerciseRow.series),s(2),z(4,i.excerciseRow.total?4:-1),s(1),z(5,i.excerciseRow.average?5:-1),s(7),_("",i.excerciseRow.tonnage,"kg")}}var k=(()=>{let t=class t{};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=v({type:t,selectors:[["app-excercise-row-body"]],inputs:{excerciseRow:"excerciseRow"},standalone:!0,features:[w],decls:1,vars:1,consts:[["class","table table-striped table-sm m-0"],[1,"table","table-striped","table-sm","m-0"],["class","row"],[1,"row"],[1,"fw-bold","col"],[1,"col","text-center"]],template:function(o,n){o&1&&m(0,et,13,3,"table",0),o&2&&z(0,n.excerciseRow?0:-1)},changeDetection:0});let e=t;return e})();function tt(e,t){if(e&1&&h(0,"app-excercise-row-body",7),e&2){let i=u().$implicit;p("excerciseRow",i)}}function it(e,t){if(e&1&&(c(0,"div",4)(1,"h2",5)(2,"button",6),h(3,"app-excercise-row-title",7),r()(),c(4,"div",8)(5,"div",9),m(6,tt,1,1,"ng-template"),r()()()),e&2){let i=t.$implicit;p("ngClass",i.highlighted?"accordion-highlight "+i.highlighted:null),s(3),p("excerciseRow",i)}}var Ue=(()=>{let t=class t{constructor(){this.excerciseRows=[]}filteredRows(){return this.excerciseRows.filter(a=>!!a.series.at(0)?.serie)}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=v({type:t,selectors:[["app-excercise-rows"]],inputs:{excerciseRows:"excerciseRows"},standalone:!0,features:[w],decls:4,vars:1,consts:[[1,"row","my-2"],[1,"col"],["ngbAccordion",""],["ngbAccordionItem","",3,"ngClass",4,"ngFor","ngForOf"],["ngbAccordionItem","",3,"ngClass"],["ngbAccordionHeader",""],["ngbAccordionButton",""],[3,"excerciseRow"],["ngbAccordionCollapse",""],["ngbAccordionBody",""]],template:function(o,n){o&1&&(c(0,"div",0)(1,"div",1)(2,"div",2),m(3,it,7,2,"div",3),r()()()),o&2&&(s(3),p("ngForOf",n.filteredRows()))},dependencies:[T,S,P,N,$,j,L,B,D,M,k],changeDetection:0});let e=t;return e})();function nt(e,t){if(e&1&&h(0,"app-excercise-row-body",14),e&2){let i=u().$implicit;p("excerciseRow",i[1])}}function ot(e,t){if(e&1&&(c(0,"div",12)(1,"h2",5)(2,"button",6),h(3,"app-excercise-row-title",13),r()(),c(4,"div",9)(5,"div",10),m(6,nt,1,1,"ng-template"),r()()()),e&2){let i=t.$implicit;p("ngClass",i[1].highlighted?"accordion-highlight "+i[1].highlighted:null),s(3),p("showUsername",!1)("showDate",!1)("excerciseRow",i[1])}}function rt(e,t){if(e&1&&(c(0,"div",2),m(1,ot,7,4,"div",11),r()),e&2){let i=u().$implicit;s(1),p("ngForOf",i[1])}}function ct(e,t){if(e&1&&(c(0,"div",4)(1,"h2",5)(2,"button",6)(3,"div",7)(4,"div",8),l(5),g(6,"titlecase"),r()()()(),c(7,"div",9)(8,"div",10),m(9,rt,2,1,"ng-template"),r()()()),e&2){let i=t.$implicit;s(5),_(" ",x(6,1,i[0])," ")}}function st(e,t){if(e&1&&(c(0,"div",2),m(1,ct,10,3,"div",3),r()),e&2){let i=u().$implicit;s(1),p("ngForOf",i[1])}}function at(e,t){if(e&1&&(c(0,"div",4)(1,"h2",5)(2,"button",6)(3,"div",7)(4,"div",8),l(5),r()()()(),c(6,"div",9)(7,"div",10),m(8,st,2,1,"ng-template"),r()()()),e&2){let i=t.$implicit;s(5),_(" ",i[0]," ")}}var Oe=(()=>{let t=class t{constructor(){this.groupedExcerciseLogs=[]}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=v({type:t,selectors:[["app-grouped-excercise-rows"]],inputs:{groupedExcerciseLogs:"groupedExcerciseLogs"},standalone:!0,features:[w],decls:4,vars:1,consts:[[1,"row","my-2"],[1,"col"],["ngbAccordion",""],["ngbAccordionItem","",4,"ngFor","ngForOf"],["ngbAccordionItem",""],["ngbAccordionHeader",""],["ngbAccordionButton",""],[1,"row","w-100"],[1,"col","d-flex","align-items-center","justify-content-center","text-center"],["ngbAccordionCollapse",""],["ngbAccordionBody",""],["ngbAccordionItem","",3,"ngClass",4,"ngFor","ngForOf"],["ngbAccordionItem","",3,"ngClass"],[3,"showUsername","showDate","excerciseRow"],[3,"excerciseRow"]],template:function(o,n){o&1&&(c(0,"div",0)(1,"div",1)(2,"div",2),m(3,at,9,1,"div",3),r()()()),o&2&&(s(3),p("ngForOf",n.groupedExcerciseLogs))},dependencies:[T,P,N,$,j,L,B,D,I,S,k,M],changeDetection:0});let e=t;return e})();function pt(e,t){if(e&1&&h(0,"app-excercise-row-body",7),e&2){let i=u();p("excerciseRow",i.personalRecord)}}var Ge=(()=>{let t=class t{};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=v({type:t,selectors:[["app-personal-record"]],inputs:{personalRecord:"personalRecord"},standalone:!0,features:[w],decls:8,vars:2,consts:[["ngbAccordion",""],["ngbAccordionItem","",1,"accordion-highlight","light-blue"],["ngbAccordionHeader",""],["ngbAccordionButton",""],[3,"excerciseRow","showStar"],["ngbAccordionCollapse",""],["ngbAccordionBody",""],[3,"excerciseRow"]],template:function(o,n){o&1&&(c(0,"div",0)(1,"div",1)(2,"h2",2)(3,"button",3),h(4,"app-excercise-row-title",4),r()(),c(5,"div",5)(6,"div",6),m(7,pt,1,1,"ng-template"),r()()()()),o&2&&(s(4),p("excerciseRow",n.personalRecord)("showStar",!0))},dependencies:[M,k,P,N,$,j,L,B,D],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0});let e=t;return e})();var lt=["typeaheadInput"],dt=["instance"];function mt(e,t){if(e&1){let i=K();c(0,"button",8),C("click",function(){let n=Q(i).$implicit,d=u();return q(d.selectedTypeSubject.next(n))}),l(1),g(2,"titlecase"),r()}if(e&2){let i=t.$implicit;s(1),_(" ",x(2,1,i)," ")}}function ut(e,t){if(e&1){let i=K();c(0,"button",8),C("click",function(){let n=Q(i).$implicit,d=u();return q(d.selectedExcerciseSubject.next(n))}),l(1),g(2,"titlecase"),r()}if(e&2){let i=t.$implicit;s(1),_(" ",x(2,1,i)," ")}}function gt(e,t){if(e&1){let i=K();c(0,"button",8),C("click",function(){let n=Q(i).$implicit,d=u();return q(d.selectedUsernameSubject.next(n))}),l(1),g(2,"titlecase"),r()}if(e&2){let i=t.$implicit;s(1),_(" ",x(2,1,i)," ")}}function xt(e,t){if(e&1&&h(0,"app-personal-record",25),e&2){let i=t.ngIf;p("personalRecord",i)}}function ft(e,t){if(e&1&&(c(0,"div",22),m(1,xt,1,1,"app-personal-record",23),g(2,"async"),h(3,"app-grouped-excercise-rows",24),g(4,"ifNullEmptyArray"),g(5,"async"),r()),e&2){let i=u(2);s(1),p("ngIf",x(2,2,i.personalRecord$)),s(2),p("groupedExcerciseLogs",x(4,4,x(5,6,i.groupedLogs$)))}}function _t(e,t){if(e&1&&h(0,"app-personal-record",25),e&2){let i=t.ngIf;p("personalRecord",i)}}function ht(e,t){if(e&1&&(c(0,"div",22),m(1,_t,1,1,"app-personal-record",23),g(2,"async"),h(3,"app-excercise-rows",26),g(4,"ifNullEmptyArray"),g(5,"async"),r()),e&2){let i=u(2);s(1),p("ngIf",x(2,2,i.personalRecord$)),s(2),p("excerciseRows",x(4,4,x(5,6,i.excerciseRows$)))}}function vt(e,t){if(e&1&&(c(0,"div"),m(1,ft,6,8,"div",21)(2,ht,6,8,"div",21),r()),e&2){let i=u();s(1),p("ngIf",i.isGrouped),s(1),p("ngIf",!i.isGrouped)}}function wt(e,t){e&1&&(c(0,"div",27)(1,"div",28)(2,"span",29),l(3,"Loading..."),r()()())}var ci=(()=>{let t=class t{onExcerciseTypeaheadChange(a){this.selectedExcerciseSubject.next(a),this.typeaheadInput?.nativeElement.blur()}constructor(){this.excerciseRowsSubject=new R([]),this.types=[],this.selectedTypeSubject=new R(null),this.excercisesSubject=new R([]),this.selectedExcerciseSubject=new R(null),this.usernames=[],this.selectedUsernameSubject=new R(null),this.groupedLogsSubject=new R([]),this.isGrouped=!1,this.isLoading=!0,this.excerciseTypeAhead="",this.typeaheadInput=null,this.instance=null,this.focus$=new Y,this.click$=new Y,this.search=a=>{let o=a.pipe(ae()),n=this.click$.pipe(se(100),ce(()=>!this.instance.isPopupOpen()),y(()=>"")),d=this.focus$;return re(o,d,n).pipe(ue(this.excercises$),y(([f,U])=>f===""?U:U.filter(O=>O.toLowerCase().includes(f.toLowerCase()))))},this.excerciseLogApiService=ge(Te),this.selectedType$=this.selectedTypeSubject.pipe(de(null),le(),me(([a,o])=>{if(a===o||!o)return;let n=this.selectedExcerciseSubject.value,d=this.excerciseRowsSubject.value.find(f=>f.excerciseName===n)?.type;o!=d&&this.selectedExcerciseSubject.next(null)}),y(([,a])=>a??"Type")),this.selectedExcercise$=this.selectedExcerciseSubject.pipe(y(a=>a??"Excercise")),this.selectedUsername$=this.selectedUsernameSubject.pipe(y(a=>a??"Username")),this.excercises$=G([this.excercisesSubject,this.selectedTypeSubject]).pipe(y(([a,o])=>o?a.filter(n=>n.type===o):a),y(a=>a.map(o=>o.name))),this.excerciseRows$=G([this.excerciseRowsSubject,this.selectedExcerciseSubject,this.selectedTypeSubject,this.selectedUsernameSubject]).pipe(y(([a,o,n,d])=>E(a,n?b(f=>f.type===n):J,o?b(f=>f.excerciseName===o):J,d?b(f=>f.username===d):J))),this.groupedLogs$=G([this.groupedLogsSubject,this.selectedExcerciseSubject,this.selectedTypeSubject,this.selectedUsernameSubject]).pipe(y(([a,o,n,d])=>E(a,A(([U,O])=>{let Ve=E(O,b(([V])=>d?d===V:!0),A(([V,X])=>{let He=E(X,b(([H,Qe])=>n?Qe.type===n:!0),b(([H])=>o?H===o:!0),b(H=>H.length>0));return[V,He]}),b(([V,X])=>X.length>0));return[U,Ve]}),b(([U,O])=>O.length>0)))),this.personalRecord$=G([this.selectedUsernameSubject,this.selectedExcerciseSubject]).pipe(y(([a,o])=>a&&o?Se(this.excerciseRowsSubject.value,o,a):null))}ngOnInit(){this.isLoading=!0,this.excerciseLogApiService.getExcerciseLogs().pipe(pe(()=>this.isLoading=!1)).subscribe(a=>{this.groupedLogsSubject.next(Ce(a)),this.excerciseRowsSubject.next(Ee(this.groupedLogsSubject.value)),this.types=E(a,A(n=>n.type),ne()),this.usernames=E(a,A(n=>n.user),ne());let o=E(a,A(n=>({name:n.name,type:n.type})),be(n=>n.name));this.excercisesSubject.next(o),console.log(Re(this.excerciseRowsSubject.value))})}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=v({type:t,selectors:[["app-excercise-logs-page"]],viewQuery:function(o,n){if(o&1&&(te(lt,7),te(dt,7)),o&2){let d;ee(d=ie())&&(n.typeaheadInput=d.first),ee(d=ie())&&(n.instance=d.first)}},standalone:!0,features:[w],decls:49,vars:25,consts:[[1,"container","my-4"],["type","text","placeholder","Excercise",1,"form-control","mb-2",3,"ngModel","ngbTypeahead","ngModelChange","selectItem","focus","click"],["typeaheadInput","","instance","ngbTypeahead"],[1,"row","mb-2","gx-2"],[1,"col-6"],["ngbDropdown","",1,"d-flex","justify-content-center"],["type","button","ngbDropdownToggle","",1,"btn","btn-outline-primary","w-100","d-flex","justify-content-between","align-items-center"],["ngbDropdownMenu","",1,"w-100"],["ngbDropdownItem","",3,"click"],["ngbDropdownItem","",3,"click",4,"ngFor","ngForOf"],[2,"overflow","scroll","max-height","400px"],[1,"d-flex","justify-content-center","align-items-center","border-top","border-1"],[1,"fa","fa-caret-down"],[1,"row","mb-2"],[1,"col-12"],[1,"row"],[1,"form-check","form-switch","d-flex","align-items-center","gap-1"],["type","checkbox","role","switch",1,"form-check-input",3,"ngModel","ngModelChange"],[1,"form-check-label"],[4,"ngIf","ngIfElse"],["loadingSpinner",""],["class","container",4,"ngIf"],[1,"container"],["class","mb-3",3,"personalRecord",4,"ngIf"],[3,"groupedExcerciseLogs"],[1,"mb-3",3,"personalRecord"],[3,"excerciseRows"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"]],template:function(o,n){if(o&1&&(c(0,"div",0)(1,"input",1,2),C("ngModelChange",function(f){return n.excerciseTypeAhead=f})("selectItem",function(f){return n.onExcerciseTypeaheadChange(f.item)})("focus",function(f){return n.focus$.next(f.target.value)})("click",function(f){return n.click$.next(f.target.value),n.excerciseTypeAhead=""}),r(),c(4,"div",3)(5,"div",4)(6,"div",5)(7,"button",6),l(8),g(9,"titlecase"),g(10,"async"),r(),c(11,"div",7)(12,"button",8),C("click",function(){return n.selectedTypeSubject.next(null)}),l(13,"Clear filter"),r(),m(14,mt,3,3,"button",9),r()()(),c(15,"div",4)(16,"div",5)(17,"button",6),l(18),g(19,"titlecase"),g(20,"async"),r(),c(21,"div",7)(22,"div",10)(23,"button",8),C("click",function(){return n.selectedExcerciseSubject.next(null)}),l(24,"Clear filter"),r(),m(25,ut,3,3,"button",9),g(26,"async"),r(),c(27,"div",11),h(28,"i",12),r()()()()(),c(29,"div",13)(30,"div",14)(31,"div",5)(32,"button",6),l(33),g(34,"titlecase"),g(35,"async"),r(),c(36,"div",7)(37,"button",8),C("click",function(){return n.selectedUsernameSubject.next(null)}),l(38,"Clear filter"),r(),m(39,gt,3,3,"button",9),r()()()(),c(40,"div",15)(41,"div",14)(42,"div",16)(43,"input",17),C("ngModelChange",function(f){return n.isGrouped=f}),r(),c(44,"label",18),l(45,"Grouped"),r()()()()(),m(46,vt,3,2,"div",19)(47,wt,4,0,"ng-template",null,20,we)),o&2){let d=he(48);s(1),p("ngModel",n.excerciseTypeAhead)("ngbTypeahead",n.search),s(7),_(" ",x(9,11,x(10,13,n.selectedType$))," "),s(6),p("ngForOf",n.types),s(4),_(" ",x(19,15,x(20,17,n.selectedExcercise$))," "),s(7),p("ngForOf",x(26,19,n.excercises$)),s(8),_(" ",x(34,21,x(35,23,n.selectedUsername$))," "),s(6),p("ngForOf",n.usernames),s(4),p("ngModel",n.isGrouped),s(3),p("ngIf",!n.isLoading)("ngIfElse",d)}},dependencies:[T,W,Ne,Ae,Ie,Be,De,ye,I,ke,Ge,Oe,Ue,Fe,Pe,$e,je,Le,Me],changeDetection:0});let e=t;return e})();export{ci as ExcerciseLogsPageComponent};
