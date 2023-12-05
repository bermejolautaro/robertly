import{$b as A,Ab as G,Ba as J,Bb as C,Ga as d,H as Q,Ha as O,Ja as p,Ka as f,La as W,Ma as k,Na as $,Oa as n,Pa as o,Qa as x,Ra as X,Rb as re,Sb as ce,Ta as B,Tb as ae,Ua as m,Ub as se,Va as l,Vb as le,Wa as U,Wb as pe,Xa as g,Xb as E,Y as P,Ya as Y,Yb as S,Za as Z,Zb as R,_,_b as T,ab as v,ac as D,bc as I,ca as K,cb as w,cc as de,da as q,db as h,dc as me,eb as ee,ec as ge,fb as te,fc as xe,gc as ue,hb as ie,hc as fe,ib as ne,ic as _e,j as H,r as j,vb as oe,y as z,ya as r,zb as b}from"./chunk-Y5YE2ILX.js";function Ce(e,t){e&1&&x(0,"i",8)}function ye(e,t){if(e&1&&(n(0,"div",6),l(1),w(2,"titlecase"),p(3,Ce,1,0,"i",7),o()),e&2){let i=m(2);O("font-size",1,"rem"),r(1),g(" ",h(2,4,i.exerciseRow.excerciseName)," "),r(2),f(3,i.showStar?3:-1)}}function be(e,t){if(e&1&&(n(0,"div",4),p(1,ye,4,6,"div",5),o()),e&2){let i=m();d("ngClass",i.showDate&&i.showUsername?"fw-semibold":null),r(1),f(1,i.showExercise?1:-1)}}function Ee(e,t){if(e&1&&(n(0,"div",9),l(1),w(2,"titlecase"),o()),e&2){let i=m();O("font-size",.8,"rem"),r(1),Y(" ",i.exerciseRow.date," - ",h(2,4,i.exerciseRow.username)," ")}}var L=(()=>{let t=class t{constructor(){this.showStar=!1,this.showExercise=!0,this.showDate=!0,this.showUsername=!0}};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=_({type:t,selectors:[["app-excercise-row-title"]],inputs:{showStar:"showStar",showExercise:"showExercise",showDate:"showDate",showUsername:"showUsername",exerciseRow:"exerciseRow"},standalone:!0,features:[v],decls:4,vars:2,consts:[[1,"w-100"],["class","row w-100 pb-1",3,"ngClass"],[1,"row"],["class","col d-flex text-muted",3,"fontSize"],[1,"row","w-100","pb-1",3,"ngClass"],["class","col d-flex align-items-center gap-1",3,"fontSize"],[1,"col","d-flex","align-items-center","gap-1"],["class","fa fa-star"],[1,"fa","fa-star"],[1,"col","d-flex","text-muted"]],template:function(c,a){c&1&&(n(0,"div",0),p(1,be,2,2,"div",1),n(2,"div",2),p(3,Ee,3,6,"div",3),o()()),c&2&&(r(1),f(1,a.exerciseRow?1:-1),r(2),f(3,a.showDate?3:-1))},dependencies:[b,C],styles:["[_nghost-%COMP%]{display:flex;flex:1}"],changeDetection:0});let e=t;return e})();var Se=(e,t)=>t.serie;function Re(e,t){if(e&1&&(n(0,"tr",3)(1,"td",4),l(2),o(),n(3,"td",5),l(4),o(),n(5,"td",5),l(6),o()()),e&2){let i=t.$implicit;r(2),g("Serie ",i.serie,""),r(2),g("",i.reps," reps"),r(2),g("",i.weightKg,"kg")}}function Te(e,t){if(e&1&&(n(0,"tr",3)(1,"td",4),l(2,"Total"),o(),n(3,"td",5),l(4),o(),n(5,"td",5),l(6),o()()),e&2){let i=m(2);r(4),g("",i.exerciseRow.total," reps"),r(2),g("",i.exerciseRow.series[0].weightKg,"kg")}}function Ae(e,t){if(e&1&&(n(0,"tr",3)(1,"td",4),l(2,"Average"),o(),n(3,"td",5),l(4),o(),n(5,"td",5),l(6),o()()),e&2){let i=m(2);r(4),g("",i.exerciseRow.average," reps"),r(2),g("",i.exerciseRow.series[0].weightKg,"kg")}}function De(e,t){if(e&1&&(n(0,"table",1)(1,"tbody"),k(2,Re,7,3,"tr",2,Se),p(4,Te,7,2,"tr",2)(5,Ae,7,2,"tr",2),n(6,"tr",3)(7,"td",4),l(8,"Tonnage"),o(),n(9,"td",5),l(10,"\xA0"),o(),n(11,"td",5),l(12),o()()()()),e&2){let i=m();r(2),$(i.exerciseRow.series),r(2),f(4,i.exerciseRow.total?4:-1),r(1),f(5,i.exerciseRow.average?5:-1),r(7),g("",i.exerciseRow.tonnage,"kg")}}var N=(()=>{let t=class t{};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=_({type:t,selectors:[["app-excercise-row-body"]],inputs:{exerciseRow:"exerciseRow"},standalone:!0,features:[v],decls:1,vars:1,consts:[["class","table table-striped table-sm m-0"],[1,"table","table-striped","table-sm","m-0"],["class","row"],[1,"row"],[1,"fw-bold","col"],[1,"col","text-center"]],template:function(c,a){c&1&&p(0,De,13,3,"table",0),c&2&&f(0,a.exerciseRow?0:-1)},changeDetection:0});let e=t;return e})();function Ie(e,t){if(e&1&&x(0,"app-excercise-row-body",7),e&2){let i=m().$implicit;d("exerciseRow",i)}}function Le(e,t){if(e&1&&(n(0,"div",4)(1,"h2",5)(2,"button",6),x(3,"app-excercise-row-title",7),o()(),n(4,"div",8)(5,"div",9),p(6,Ie,1,1,"ng-template"),o()()()),e&2){let i=t.$implicit;d("ngClass",i.highlighted?"accordion-highlight "+i.highlighted:null),r(3),d("exerciseRow",i)}}var ve=(()=>{let t=class t{constructor(){this.exerciseRows=[]}filteredRows(){return this.exerciseRows.filter(s=>!!s.series.at(0)?.serie)}};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=_({type:t,selectors:[["app-excercise-rows"]],inputs:{exerciseRows:"exerciseRows"},standalone:!0,features:[v],decls:4,vars:1,consts:[[1,"row","my-2"],[1,"col"],["ngbAccordion",""],["ngbAccordionItem","",3,"ngClass",4,"ngFor","ngForOf"],["ngbAccordionItem","",3,"ngClass"],["ngbAccordionHeader",""],["ngbAccordionButton",""],[3,"exerciseRow"],["ngbAccordionCollapse",""],["ngbAccordionBody",""]],template:function(c,a){c&1&&(n(0,"div",0)(1,"div",1)(2,"div",2),p(3,Le,7,2,"div",3),o()()()),c&2&&(r(3),d("ngForOf",a.filteredRows()))},dependencies:[G,b,I,R,D,A,T,E,S,L,N],changeDetection:0});let e=t;return e})();function Ne(e,t){if(e&1&&x(0,"app-excercise-row-body",14),e&2){let i=m().$implicit;d("exerciseRow",i[1])}}function Fe(e,t){if(e&1&&(n(0,"div",12)(1,"h2",5)(2,"button",6),x(3,"app-excercise-row-title",13),o()(),n(4,"div",9)(5,"div",10),p(6,Ne,1,1,"ng-template"),o()()()),e&2){let i=t.$implicit;d("ngClass",i[1].highlighted?"accordion-highlight "+i[1].highlighted:null),r(3),d("showUsername",!1)("showDate",!1)("exerciseRow",i[1])}}function Be(e,t){if(e&1&&(n(0,"div",2),p(1,Fe,7,4,"div",11),o()),e&2){let i=m().$implicit;r(1),d("ngForOf",i[1])}}function Me(e,t){if(e&1&&(n(0,"div",4)(1,"h2",5)(2,"button",6)(3,"div",7)(4,"div",8),l(5),w(6,"titlecase"),o()()()(),n(7,"div",9)(8,"div",10),p(9,Be,2,1,"ng-template"),o()()()),e&2){let i=t.$implicit;r(5),g(" ",h(6,1,i[0])," ")}}function Pe(e,t){if(e&1&&(n(0,"div",2),p(1,Me,10,3,"div",3),o()),e&2){let i=m().$implicit;r(1),d("ngForOf",i[1])}}function ke(e,t){if(e&1&&(n(0,"div",4)(1,"h2",5)(2,"button",6)(3,"div",7)(4,"div",8),l(5),o()()()(),n(6,"div",9)(7,"div",10),p(8,Pe,2,1,"ng-template"),o()()()),e&2){let i=t.$implicit;r(5),g(" ",i[0]," ")}}var we=(()=>{let t=class t{constructor(){this.groupedExcerciseLogs=[]}};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=_({type:t,selectors:[["app-grouped-excercise-rows"]],inputs:{groupedExcerciseLogs:"groupedExcerciseLogs"},standalone:!0,features:[v],decls:4,vars:1,consts:[[1,"row","my-2"],[1,"col"],["ngbAccordion",""],["ngbAccordionItem","",4,"ngFor","ngForOf"],["ngbAccordionItem",""],["ngbAccordionHeader",""],["ngbAccordionButton",""],[1,"row","w-100"],[1,"col","d-flex","align-items-center","justify-content-center","text-center"],["ngbAccordionCollapse",""],["ngbAccordionBody",""],["ngbAccordionItem","",3,"ngClass",4,"ngFor","ngForOf"],["ngbAccordionItem","",3,"ngClass"],[3,"showUsername","showDate","exerciseRow"],[3,"exerciseRow"]],template:function(c,a){c&1&&(n(0,"div",0)(1,"div",1)(2,"div",2),p(3,ke,9,1,"div",3),o()()()),c&2&&(r(3),d("ngForOf",a.groupedExcerciseLogs))},dependencies:[G,I,R,D,A,T,E,S,C,b,N,L],changeDetection:0});let e=t;return e})();function $e(e,t){if(e&1&&x(0,"app-excercise-row-body",7),e&2){let i=m();d("exerciseRow",i.personalRecord)}}var he=(()=>{let t=class t{};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=_({type:t,selectors:[["app-personal-record"]],inputs:{personalRecord:"personalRecord"},standalone:!0,features:[v],decls:8,vars:2,consts:[["ngbAccordion",""],["ngbAccordionItem","",1,"accordion-highlight","light-blue"],["ngbAccordionHeader",""],["ngbAccordionButton",""],[3,"exerciseRow","showStar"],["ngbAccordionCollapse",""],["ngbAccordionBody",""],[3,"exerciseRow"]],template:function(c,a){c&1&&(n(0,"div",0)(1,"div",1)(2,"h2",2)(3,"button",3),x(4,"app-excercise-row-title",4),o()(),n(5,"div",5)(6,"div",6),p(7,$e,1,1,"ng-template"),o()()()()),c&2&&(r(4),d("exerciseRow",a.personalRecord)("showStar",!0))},dependencies:[L,N,I,R,D,A,T,E,S],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0});let e=t;return e})();var Ge=["typeaheadInput"];function Oe(e,t){if(e&1&&(n(0,"div"),l(1),o(),n(2,"div"),l(3),w(4,"titlecase"),o()),e&2){let i=t.result,s=t.term;r(1),U(s),r(2),U(h(4,2,i))}}function Ue(e,t){if(e&1){let i=X();n(0,"button",9),B("click",function(){let a=K(i).$implicit,u=m();return q(u.excerciseLogService.selectedType$.next(a))}),l(1),w(2,"titlecase"),o()}if(e&2){let i=t.$implicit;r(1),g(" ",h(2,1,i)," ")}}function Ve(e,t){e&1&&x(0,"app-personal-record",18),e&2&&d("personalRecord",t)}function He(e,t){if(e&1&&x(0,"app-grouped-excercise-rows",17),e&2){let i=m(2);d("groupedExcerciseLogs",i.excerciseLogService.groupedLogs())}}function je(e,t){if(e&1&&x(0,"app-excercise-rows",19),e&2){let i=m(2);d("exerciseRows",i.excerciseLogService.exerciseRows())}}function ze(e,t){if(e&1&&(n(0,"div",15),p(1,Ve,1,1,"app-personal-record",16)(2,He,1,1,"app-grouped-excercise-rows",17)(3,je,1,1),o()),e&2){let i=m(),s;r(1),f(1,(s=i.excerciseLogService.personalRecord())?1:-1,s),r(1),f(2,i.isGrouped?2:3)}}function Qe(e,t){e&1&&(n(0,"div",20)(1,"div",21)(2,"span",22),l(3,"Loading..."),o()()())}var It=(()=>{let t=class t{constructor(){this.titleCasePipe=P(C),this.document=P(oe),this.excerciseLogService=P(re),this.isGrouped=!1,this.excerciseTypeAhead="",this.typeaheadInput=null,this.focus$=new H,this.search=s=>{let c=s.pipe(Q());return z(c,this.focus$).pipe(j(a=>{let u=["Clear Filter",...this.excerciseLogService.excercises().map(F=>F.name)],y=this.excerciseLogService.selectedExcerciseLabel();return a===""||a===y.name?u:u.filter(F=>!!F).filter(F=>F.toLowerCase().includes(a.toLowerCase()))}))},this.formatter=s=>this.titleCasePipe.transform(s),J(()=>this.excerciseTypeAhead=this.excerciseLogService.selectedExcerciseLabel().name)}ngOnInit(){this.document.defaultView?.scroll({top:0,left:0,behavior:"smooth"})}onExcerciseTypeaheadChange(s){let c=this.excerciseLogService.excercises().filter(a=>a.name===s.item).at(0)??null;s.item==="Clear Filter"&&(c=null),this.excerciseLogService.selectedExcercise$.next(c),this.typeaheadInput?.nativeElement.blur()}};t.\u0275fac=function(c){return new(c||t)},t.\u0275cmp=_({type:t,selectors:[["app-excercise-logs-page"]],viewQuery:function(c,a){if(c&1&&te(Ge,7),c&2){let u;ee(u=ie())&&(a.typeaheadInput=u.first)}},standalone:!0,features:[Z([C]),v],decls:25,vars:10,consts:[[1,"container","my-4"],["rt",""],[1,"col-12"],["type","text","placeholder","Exercise",1,"form-control","mb-2",3,"ngModel","ngbTypeahead","popupClass","resultFormatter","inputFormatter","ngModelChange","selectItem","focus","click"],["typeaheadInput",""],[1,"row","mb-2","gx-2"],["ngbDropdown","",1,"d-flex","justify-content-center"],["type","button","ngbDropdownToggle","",1,"btn","btn-outline-primary","w-100","d-flex","justify-content-between","align-items-center"],["ngbDropdownMenu","",1,"w-100"],["ngbDropdownItem","",3,"click"],[1,"row"],[1,"form-check","form-switch","d-flex","align-items-center","gap-1"],["type","checkbox","role","switch",1,"form-check-input",3,"ngModel","ngModelChange"],[1,"form-check-label"],["class","container"],[1,"container"],["class","mb-3",3,"personalRecord"],[3,"groupedExcerciseLogs"],[1,"mb-3",3,"personalRecord"],[3,"exerciseRows"],[1,"position-absolute","top-50","start-50","translate-middle"],["role","status",1,"spinner-border","text-primary"],[1,"visually-hidden"],["ngbDropdownItem",""]],template:function(c,a){c&1&&(n(0,"div",0),p(1,Oe,5,4,"ng-template",null,1,ne),n(3,"div",2)(4,"input",3,4),B("ngModelChange",function(y){return a.excerciseTypeAhead=y})("selectItem",function(y){return a.onExcerciseTypeaheadChange(y)})("focus",function(){return a.focus$.next(a.excerciseTypeAhead)})("click",function(){return a.excerciseTypeAhead=""}),o()(),n(6,"div",5)(7,"div",2)(8,"div",6)(9,"button",7),l(10),w(11,"titlecase"),o(),n(12,"div",8)(13,"button",9),B("click",function(){return a.excerciseLogService.selectedType$.next(null)}),l(14,"Clear filter"),o(),k(15,Ue,3,3,"button",23,W),o()()()(),n(17,"div",10)(18,"div",2)(19,"div",11)(20,"input",12),B("ngModelChange",function(y){return a.isGrouped=y}),o(),n(21,"label",13),l(22,"Grouped"),o()()()()(),p(23,ze,4,2,"div",14)(24,Qe,4,0)),c&2&&(r(4),d("ngModel",a.excerciseTypeAhead)("ngbTypeahead",a.search)("popupClass","exercise-typeahead")("resultFormatter",a.formatter)("inputFormatter",a.formatter),r(6),g(" ",h(11,8,a.excerciseLogService.selectedTypeLabel())," "),r(5),$(a.excerciseLogService.types()),r(5),d("ngModel",a.isGrouped),r(3),f(23,a.excerciseLogService.loaded()?23:24))},dependencies:[pe,ae,ce,se,le,C,he,we,ve,fe,ue,xe,ge,de,me,_e],styles:[".exercise-typeahead{overflow-y:scroll;overflow-x:hidden;max-height:400px}"],changeDetection:0});let e=t;return e})();export{It as ExcerciseLogsPageComponent};
