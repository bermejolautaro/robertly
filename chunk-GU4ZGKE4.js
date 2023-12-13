import{$ as we,B as me,D as L,E as R,F as P,G as D,H as I,I as A,J as F,K as ge,L as xe,M as ue,N as he,O as fe,P as _e,l as K,m as q,n as se,o as ae,p as le,r as pe,w as de}from"./chunk-XPOI3TV5.js";import{$a as h,A as O,Ab as oe,Cb as C,Db as v,Gb as Q,Hb as j,Jb as z,Ka as s,L as W,Oa as H,Va as d,Wa as V,Yb as re,_a as m,ab as Z,ac as y,bb as ee,bc as ce,cb as b,db as T,dc as E,eb as o,fa as $,fb as r,gb as u,ha as f,j as U,jb as te,ma as J,mb as S,na as Y,nb as g,r as G,rb as p,tb as x,ub as ie,vb as ne,yb as _}from"./chunk-MUKCVDLF.js";function Ee(e,t){e&1&&u(0,"i",8)}function be(e,t){if(e&1&&(o(0,"div",6),p(1),C(2,"titlecase"),m(3,Ee,1,0,"i",7),r()),e&2){let i=g(2);V("font-size",1,"rem"),s(1),x(" ",v(2,4,i.exerciseRow.excerciseName)," "),s(2),h(3,i.showStar?3:-1)}}function Te(e,t){if(e&1&&(o(0,"div",4),m(1,be,4,6,"div",5),r()),e&2){let i=g();d("ngClass",i.showDate&&i.showUsername?"fw-semibold":null),s(1),h(1,i.showExercise?1:-1)}}function Se(e,t){if(e&1&&(o(0,"div",9),p(1),C(2,"titlecase"),r()),e&2){let i=g();V("font-size",.8,"rem"),s(1),ie(" ",i.exerciseRow.date," - ",v(2,4,i.exerciseRow.username)," ")}}var N=(()=>{let t=class t{constructor(){this.showStar=!1,this.showExercise=!0,this.showDate=!0,this.showUsername=!0}};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=f({type:t,selectors:[["app-excercise-row-title"]],inputs:{showStar:"showStar",showExercise:"showExercise",showDate:"showDate",showUsername:"showUsername",exerciseRow:"exerciseRow"},standalone:!0,features:[_],decls:4,vars:2,consts:[[1,"w-100"],["class","row w-100 pb-1",3,"ngClass"],[1,"row"],["class","col d-flex text-muted",3,"fontSize"],[1,"row","w-100","pb-1",3,"ngClass"],["class","col d-flex align-items-center gap-1",3,"fontSize"],[1,"col","d-flex","align-items-center","gap-1"],["class","fa fa-star"],[1,"fa","fa-star"],[1,"col","d-flex","text-muted"]],template:function(c,n){c&1&&(o(0,"div",0),m(1,Te,2,2,"div",1),o(2,"div",2),m(3,Se,3,6,"div",3),r()()),c&2&&(s(1),h(1,n.exerciseRow?1:-1),s(2),h(3,n.showDate?3:-1))},dependencies:[y,E],styles:["[_nghost-%COMP%]{display:flex;flex:1}"],changeDetection:0});let e=t;return e})();var Le=(e,t)=>t.serie;function Re(e,t){if(e&1&&(o(0,"tr",3)(1,"td",4),p(2),r(),o(3,"td",5),p(4),r(),o(5,"td",5),p(6),r()()),e&2){let i=t.$implicit;s(2),x("Serie ",i.serie,""),s(2),x("",i.reps," reps"),s(2),x("",i.weightKg,"kg")}}function Pe(e,t){if(e&1&&(o(0,"tr",3)(1,"td",4),p(2,"Total"),r(),o(3,"td",5),p(4),r(),o(5,"td",5),p(6),r()()),e&2){let i=g(2);s(4),x("",i.exerciseRow.total," reps"),s(2),x("",i.exerciseRow.series[0].weightKg,"kg")}}function De(e,t){if(e&1&&(o(0,"tr",3)(1,"td",4),p(2,"Average"),r(),o(3,"td",5),p(4),r(),o(5,"td",5),p(6),r()()),e&2){let i=g(2);s(4),x("",i.exerciseRow.average," reps"),s(2),x("",i.exerciseRow.series[0].weightKg,"kg")}}function Ie(e,t){if(e&1&&(o(0,"table",1)(1,"tbody"),b(2,Re,7,3,"tr",2,Le),m(4,Pe,7,2,"tr",2)(5,De,7,2,"tr",2),o(6,"tr",3)(7,"td",4),p(8,"Tonnage"),r(),o(9,"td",5),p(10,"\xA0"),r(),o(11,"td",5),p(12),r()()()()),e&2){let i=g();s(2),T(i.exerciseRow.series),s(2),h(4,i.exerciseRow.total?4:-1),s(1),h(5,i.exerciseRow.average?5:-1),s(7),x("",i.exerciseRow.tonnage,"kg")}}var M=(()=>{let t=class t{};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=f({type:t,selectors:[["app-excercise-row-body"]],inputs:{exerciseRow:"exerciseRow"},standalone:!0,features:[_],decls:1,vars:1,consts:[["class","table table-striped table-sm m-0"],[1,"table","table-striped","table-sm","m-0"],["class","row"],[1,"row"],[1,"fw-bold","col"],[1,"col","text-center"]],template:function(c,n){c&1&&m(0,Ie,13,3,"table",0),c&2&&h(0,n.exerciseRow?0:-1)},changeDetection:0});let e=t;return e})();function Ae(e,t){if(e&1&&u(0,"app-excercise-row-body",6),e&2){let i=g().$implicit;d("exerciseRow",i)}}function Fe(e,t){if(e&1&&(o(0,"div",3)(1,"h2",4)(2,"button",5),u(3,"app-excercise-row-title",6),r()(),o(4,"div",7)(5,"div",8),m(6,Ae,1,1,"ng-template"),r()()()),e&2){let i=t.$implicit;d("ngClass",i.highlighted?"accordion-highlight "+i.highlighted:null),s(3),d("exerciseRow",i)}}var Ce=(()=>{let t=class t{constructor(){this.exerciseRows=[]}};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=f({type:t,selectors:[["app-excercise-rows"]],inputs:{exerciseRows:"exerciseRows"},standalone:!0,features:[_],decls:5,vars:0,consts:[[1,"row","my-2"],[1,"col"],["ngbAccordion",""],["ngbAccordionItem","",3,"ngClass"],["ngbAccordionHeader",""],["ngbAccordionButton",""],[3,"exerciseRow"],["ngbAccordionCollapse",""],["ngbAccordionBody",""]],template:function(c,n){c&1&&(o(0,"div",0)(1,"div",1)(2,"div",2),b(3,Fe,7,2,"div",3,Z),r()()()),c&2&&(s(3),T(n.exerciseRows))},dependencies:[y,F,P,A,I,D,L,R,N,M],changeDetection:0});let e=t;return e})();function Ne(e,t){if(e&1&&u(0,"app-excercise-row-body",14),e&2){let i=g().$implicit;d("exerciseRow",i[1])}}function Me(e,t){if(e&1&&(o(0,"div",12)(1,"h2",5)(2,"button",6),u(3,"app-excercise-row-title",13),r()(),o(4,"div",9)(5,"div",10),m(6,Ne,1,1,"ng-template"),r()()()),e&2){let i=t.$implicit;d("ngClass",i[1].highlighted?"accordion-highlight "+i[1].highlighted:null),s(3),d("showUsername",!1)("showDate",!1)("exerciseRow",i[1])}}function Be(e,t){if(e&1&&(o(0,"div",2),m(1,Me,7,4,"div",11),r()),e&2){let i=g().$implicit;s(1),d("ngForOf",i[1])}}function $e(e,t){if(e&1&&(o(0,"div",4)(1,"h2",5)(2,"button",6)(3,"div",7)(4,"div",8),p(5),C(6,"titlecase"),r()()()(),o(7,"div",9)(8,"div",10),m(9,Be,2,1,"ng-template"),r()()()),e&2){let i=t.$implicit;s(5),x(" ",v(6,1,i[0])," ")}}function ke(e,t){if(e&1&&(o(0,"div",2),m(1,$e,10,3,"div",3),r()),e&2){let i=g().$implicit;s(1),d("ngForOf",i[1])}}function Ue(e,t){if(e&1&&(o(0,"div",4)(1,"h2",5)(2,"button",6)(3,"div",7)(4,"div",8),p(5),r()()()(),o(6,"div",9)(7,"div",10),m(8,ke,2,1,"ng-template"),r()()()),e&2){let i=t.$implicit;s(5),x(" ",i[0]," ")}}var ve=(()=>{let t=class t{constructor(){this.exerciseLogsPerExerciseNamePerUsernamePerDateList=[]}ngOnInit(){}};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=f({type:t,selectors:[["app-grouped-excercise-rows"]],inputs:{exerciseLogsPerExerciseNamePerUsernamePerDateList:["groupedExcerciseLogs","exerciseLogsPerExerciseNamePerUsernamePerDateList"]},standalone:!0,features:[_],decls:4,vars:1,consts:[[1,"row","my-2"],[1,"col"],["ngbAccordion",""],["ngbAccordionItem","",4,"ngFor","ngForOf"],["ngbAccordionItem",""],["ngbAccordionHeader",""],["ngbAccordionButton",""],[1,"row","w-100"],[1,"col","d-flex","align-items-center","justify-content-center","text-center"],["ngbAccordionCollapse",""],["ngbAccordionBody",""],["ngbAccordionItem","",3,"ngClass",4,"ngFor","ngForOf"],["ngbAccordionItem","",3,"ngClass"],[3,"showUsername","showDate","exerciseRow"],[3,"exerciseRow"]],template:function(c,n){c&1&&(o(0,"div",0)(1,"div",1)(2,"div",2),m(3,Ue,9,1,"div",3),r()()()),c&2&&(s(3),d("ngForOf",n.exerciseLogsPerExerciseNamePerUsernamePerDateList))},dependencies:[ce,F,P,A,I,D,L,R,E,y,M,N],changeDetection:0});let e=t;return e})();function Ge(e,t){if(e&1&&u(0,"app-excercise-row-body",7),e&2){let i=g();d("exerciseRow",i.personalRecord)}}var ye=(()=>{let t=class t{};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=f({type:t,selectors:[["app-personal-record"]],inputs:{personalRecord:"personalRecord"},standalone:!0,features:[_],decls:8,vars:2,consts:[["ngbAccordion",""],["ngbAccordionItem","",1,"accordion-highlight","light-blue"],["ngbAccordionHeader",""],["ngbAccordionButton",""],[3,"exerciseRow","showStar"],["ngbAccordionCollapse",""],["ngbAccordionBody",""],[3,"exerciseRow"]],template:function(c,n){c&1&&(o(0,"div",0)(1,"div",1)(2,"h2",2)(3,"button",3),u(4,"app-excercise-row-title",4),r()(),o(5,"div",5)(6,"div",6),m(7,Ge,1,1,"ng-template"),r()()()()),c&2&&(s(4),d("exerciseRow",n.personalRecord)("showStar",!0))},dependencies:[N,M,F,P,A,I,D,L,R],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0});let e=t;return e})();var Oe=["exerciseTypeaheadInput"],We=["weightTypeaheadInput"],He=e=>({active:e});function Ve(e,t){if(e&1){let i=te();o(0,"button",15),S("click",function(){let n=J(i).$implicit,l=g();return Y(l.exerciseLogService.selectedType$.next(n))}),p(1),C(2,"titlecase"),r()}if(e&2){let i=t.$implicit,a=g();d("ngClass",oe(4,He,i===a.exerciseLogService.selectedType())),s(1),x(" ",v(2,2,i)," ")}}function Qe(e,t){e&1&&u(0,"app-personal-record",19),e&2&&d("personalRecord",t)}function je(e,t){if(e&1&&u(0,"app-grouped-excercise-rows",18),e&2){let i=g(2);d("groupedExcerciseLogs",i.exerciseLogService.groupedLogs())}}function ze(e,t){if(e&1&&u(0,"app-excercise-rows",20),e&2){let i=g(2);d("exerciseRows",i.exerciseLogService.exerciseRows())}}function Ke(e,t){if(e&1&&(o(0,"div",16),m(1,Qe,1,1,"app-personal-record",17)(2,je,1,1,"app-grouped-excercise-rows",18)(3,ze,1,1),r()),e&2){let i=g(),a;s(1),h(1,(a=i.exerciseLogService.personalRecord())?1:-1,a),s(1),h(2,i.isGrouped?2:3)}}function qe(e,t){e&1&&(o(0,"div",21)(1,"div",22)(2,"span",23),p(3,"Loading..."),r()()())}var k="Clear Filter",It=(()=>{let t=class t{constructor(){this.titleCasePipe=$(E),this.document=$(re),this.exerciseLogService=$(se),this.EXERCISE_PLACEHOLDER=K,this.WEIGHT_PLACEHOLDER=q,this.isGrouped=!1,this.exerciseTypeahead="",this.exerciseTypeaheadInput=null,this.exerciseFocus$=new U,this.exerciseSearch=a=>{let c=a.pipe(W());return O(c,this.exerciseFocus$).pipe(G(()=>{let n=this.exerciseLogService.exercises().map(l=>l.name);return this.exerciseLogService.selectedExercise()&&n.unshift(k),this.exerciseTypeahead===""||this.exerciseTypeahead===K?n:n.filter(l=>!!l).filter(l=>l.toLowerCase().includes(this.exerciseTypeahead.toLowerCase()))}))},this.weightTypeahead="",this.weightTypeaheadInput=null,this.weightFocus$=new U,this.weightSearch=a=>{let c=a.pipe(W());return O(c,this.weightFocus$).pipe(G(()=>{let n=this.exerciseLogService.weights().map(l=>`${l}`);return this.exerciseLogService.selectedWeight()&&n.unshift(k),this.weightTypeahead===""||this.weightTypeahead===q?n:n.filter(l=>!!l).filter(l=>l.includes(this.weightTypeahead))}))},this.exerciseFormatter=a=>this.titleCasePipe.transform(a),this.weightFormatter=a=>isNaN(parseInt(a))?a:`${a}kg`,H(()=>this.exerciseTypeahead=this.exerciseLogService.selectedExerciseLabel()),H(()=>this.weightTypeahead=this.exerciseLogService.selectedWeightLabel())}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"})}onExerciseTypeaheadChange(a){let c=this.exerciseLogService.exercises().filter(n=>n.name===a.item).at(0)??null;a.item===k&&(c=null),this.exerciseLogService.selectedExercise$.next(c),this.exerciseTypeahead=this.exerciseLogService.selectedExerciseLabel(),this.exerciseTypeaheadInput?.nativeElement.blur(),this.exerciseLogService.selectedWeight$.next(null),this.weightTypeahead=this.exerciseLogService.selectedWeightLabel()}onWeightTypeaheadChange(a){let c=this.exerciseLogService.weights().filter(n=>`${n}`===a.item).at(0)??null;a.item===k&&(c=null),this.exerciseLogService.selectedWeight$.next(c),this.weightTypeaheadInput?.nativeElement.blur()}};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=f({type:t,selectors:[["app-excercise-logs-page"]],viewQuery:function(c,n){if(c&1&&(j(Oe,7),j(We,7)),c&2){let l;Q(l=z())&&(n.exerciseTypeaheadInput=l.first),Q(l=z())&&(n.weightTypeaheadInput=l.first)}},standalone:!0,features:[ne([E]),_],decls:26,vars:15,consts:[[1,"container","my-4"],[1,"row","mb-2","gx-2"],[1,"col-12"],["ngbDropdown","",1,"d-flex","justify-content-center"],["type","button","ngbDropdownToggle","",1,"btn","btn-outline-primary","w-100","d-flex","justify-content-between","align-items-center"],["ngbDropdownMenu","",1,"w-100"],["ngbDropdownItem","",3,"click"],["type","text",1,"form-control","mb-2",3,"ngModel","ngbTypeahead","popupClass","resultFormatter","inputFormatter","ngModelChange","selectItem","focus","blur"],["exerciseTypeaheadInput",""],["weightTypeaheadInput",""],[1,"row"],[1,"form-check","form-switch","d-flex","align-items-center","gap-1"],["type","checkbox","role","switch",1,"form-check-input",3,"ngModel","ngModelChange"],[1,"form-check-label"],["class","container"],["ngbDropdownItem","",3,"ngClass","click"],[1,"container"],["class","mb-3",3,"personalRecord"],[3,"groupedExcerciseLogs"],[1,"mb-3",3,"personalRecord"],[3,"exerciseRows"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"],["ngbDropdownItem","",3,"ngClass"]],template:function(c,n){c&1&&(o(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"button",4),p(5),C(6,"titlecase"),r(),o(7,"div",5)(8,"button",6),S("click",function(){return n.exerciseLogService.selectedType$.next(null)}),p(9,"Clear filter"),r(),b(10,Ve,3,6,"button",24,ee),r()()()(),o(12,"div",2)(13,"input",7,8),S("ngModelChange",function(w){return n.exerciseTypeahead=w})("selectItem",function(w){return n.onExerciseTypeaheadChange(w)})("focus",function(){return n.exerciseTypeahead="",n.exerciseFocus$.next(n.exerciseTypeahead)})("blur",function(){return n.exerciseTypeahead=n.exerciseLogService.selectedExerciseLabel()}),r()(),o(15,"div",2)(16,"input",7,9),S("ngModelChange",function(w){return n.weightTypeahead=w})("selectItem",function(w){return n.onWeightTypeaheadChange(w)})("focus",function(){return n.weightTypeahead="",n.weightFocus$.next(n.weightTypeahead)})("blur",function(){return n.weightTypeahead=n.exerciseLogService.selectedWeightLabel()}),r()(),o(18,"div",10)(19,"div",2)(20,"div",11)(21,"input",12),S("ngModelChange",function(w){return n.isGrouped=w}),r(),o(22,"label",13),p(23,"Grouped"),r()()()()(),m(24,Ke,4,2,"div",14)(25,qe,4,0)),c&2&&(s(5),x(" ",v(6,13,n.exerciseLogService.selectedTypeLabel())," "),s(5),T(n.exerciseLogService.types()),s(3),d("ngModel",n.exerciseTypeahead)("ngbTypeahead",n.exerciseSearch)("popupClass","typeahead")("resultFormatter",n.exerciseFormatter)("inputFormatter",n.exerciseFormatter),s(3),d("ngModel",n.weightTypeahead)("ngbTypeahead",n.weightSearch)("popupClass","typeahead")("resultFormatter",n.weightFormatter)("inputFormatter",n.weightFormatter),s(5),d("ngModel",n.isGrouped),s(3),h(24,n.exerciseLogService.loaded()?24:25))},dependencies:[y,me,le,ae,pe,de,E,ye,ve,Ce,_e,fe,he,ue,ge,xe,we],changeDetection:0});let e=t;return e})();export{It as ExcerciseLogsPageComponent};