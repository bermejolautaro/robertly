import{a as k}from"./chunk-4BULIK76.js";import{$b as v,Bb as s,Fb as i,Gb as o,Hb as C,Ia as h,Nb as d,Ya as n,Yb as g,Zb as f,_b as _,ib as O,kc as m,mc as M,nb as c,wa as x,xb as P,zb as u,zc as a}from"./chunk-ARLDQED4.js";function w(e,l){e&1&&(x(),i(0,"svg",9),C(1,"path",12)(2,"path",13)(3,"path",14),o())}function b(e,l){e&1&&(x(),i(0,"svg",10),C(1,"path",15),o())}function E(e,l){if(e&1&&(c(0,w,4,0,":svg:svg",9)(1,b,2,0,":svg:svg",10),i(2,"span",11),g(3),o()),e&2){let t=d();s(t.isDangerousExcess()?0:1),n(3),_("(",t.achievedPercentage()-100,"% over)")}}function y(e,l){if(e&1&&(i(0,"span",7),g(1),m(2,"padStart"),o()),e&2){let t=d();n(),_("",M(2,1,t.goalPercentage(),2),"%")}}function S(e,l){if(e&1&&(i(0,"span",7),g(1),o()),e&2){let t=d(2);n(),_("",t.excessPercentage(),"%")}}function B(e,l){if(e&1&&(i(0,"div",16),c(1,S,2,1,"span",7),o()),e&2){let t=d();P("width",t.excessPercentage(),"%"),n(),s(t.excessPercentage()>5?1:-1)}}var D=(()=>{class e{constructor(){this.current=h.required(),this.goal=h.required(),this.label=h("Value"),this.isExceeded=a(()=>this.current()>this.goal()),this.goalPercentage=a(()=>this.isExceeded()?200-Math.round(this.current()*100/this.goal()):this.achievedPercentage()),this.excessPercentage=a(()=>this.isExceeded()?100-this.goalPercentage():0),this.achievedPercentage=a(()=>Math.round(this.current()/this.goal()*100)),this.isDangerousExcess=a(()=>this.achievedPercentage()>=120),this.isLow=a(()=>this.achievedPercentage()<=70)}static{this.\u0275fac=function(p){return new(p||e)}}static{this.\u0275cmp=O({type:e,selectors:[["app-progress-bar"]],inputs:{current:[1,"current"],goal:[1,"goal"],label:[1,"label"]},decls:13,vars:13,consts:[[1,"progress-container"],[1,"progress-header"],[1,"label"],[1,"value"],[1,"progress-bar-container"],[1,"progress-bar-wrapper"],[1,"goal-portion"],[1,"percentage-text"],[1,"excess-portion",3,"width"],["xmlns","http://www.w3.org/2000/svg","width","16","height","16","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"warning-icon"],["xmlns","http://www.w3.org/2000/svg","width","16","height","16","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"check-icon"],[1,"excess-text"],["d","m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"],["d","M12 9v4"],["d","M12 17h.01"],["d","M20 6 9 17l-5-5"],[1,"excess-portion"]],template:function(p,r){p&1&&(i(0,"div",0)(1,"div",1)(2,"span",2),g(3),o(),i(4,"div",3),g(5),m(6,"padStart"),c(7,E,4,2),o()(),i(8,"div",4)(9,"div",5)(10,"div",6),c(11,y,3,4,"span",7),o(),c(12,B,2,3,"div",8),o()()()),p&2&&(n(3),f(r.label()),n(2),v(" ",M(6,10,r.current(),2)," / ",r.goal()," "),n(2),s(r.isExceeded()?7:-1),n(3),u(r.isLow()?"danger-color":null),P("width",r.goalPercentage(),"%"),n(),s(r.goalPercentage()>5?11:-1),n(),s(r.isExceeded()?12:-1))},dependencies:[k],styles:[".progress-container[_ngcontent-%COMP%]{width:100%;margin-bottom:16px}.progress-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.label[_ngcontent-%COMP%], .value[_ngcontent-%COMP%]{font-size:14px;font-weight:500}.value[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.2rem}.warning-icon[_ngcontent-%COMP%], .check-icon[_ngcontent-%COMP%]{margin-left:4px;height:16px;width:16px;vertical-align:middle}.warning-icon[_ngcontent-%COMP%]{color:#ef4444}.check-icon[_ngcontent-%COMP%]{color:#10b981}.excess-text[_ngcontent-%COMP%]{margin-left:4px;color:#ef4444}.progress-bar-container[_ngcontent-%COMP%]{height:24px;width:100%;background-color:var(--light-bg);border-radius:10px;overflow:hidden;position:relative;border:2px solid #505662}.progress-bar-wrapper[_ngcontent-%COMP%]{height:100%;width:100%;display:flex;overflow:hidden}.goal-portion[_ngcontent-%COMP%]{height:100%;background-color:#27bb65;transition:width .3s ease-in-out;display:flex;align-items:center;justify-content:center}.excess-portion[_ngcontent-%COMP%]{height:100%;background-color:#ef4444;transition:width .3s ease-in-out;display:flex;align-items:center;justify-content:center}.percentage-text[_ngcontent-%COMP%]{font-size:12px;font-weight:500;color:#fff;padding:0 8px}.legend[_ngcontent-%COMP%]{display:flex;gap:16px;padding-top:4px;font-size:12px}.legend-item[_ngcontent-%COMP%]{display:flex;align-items:center}.legend-color[_ngcontent-%COMP%]{width:12px;height:12px;border-radius:9999px;margin-right:4px}.goal-color[_ngcontent-%COMP%]{background-color:#1f2937}.danger-color[_ngcontent-%COMP%]{background-color:#ef4444}.achievement-text[_ngcontent-%COMP%]{font-size:12px;text-align:center;margin-top:8px}.dark[_nghost-%COMP%]   .progress-bar-container[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .progress-bar-container[_ngcontent-%COMP%]{background-color:#374151}.dark[_nghost-%COMP%]   .goal-portion[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .goal-portion[_ngcontent-%COMP%]{background-color:#e5e7eb}.dark[_nghost-%COMP%]   .goal-portion[_ngcontent-%COMP%]   .percentage-text[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .goal-portion[_ngcontent-%COMP%]   .percentage-text[_ngcontent-%COMP%]{color:#1f2937}.dark[_nghost-%COMP%]   .excess-portion[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .excess-portion[_ngcontent-%COMP%]{background-color:#dc2626}.dark[_nghost-%COMP%]   .goal-color[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .goal-color[_ngcontent-%COMP%]{background-color:#e5e7eb}.dark[_nghost-%COMP%]   .excess-color[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .excess-color[_ngcontent-%COMP%]{background-color:#dc2626}.dark[_nghost-%COMP%]   .excess-text[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .excess-text[_ngcontent-%COMP%]{color:#f87171}.dark[_nghost-%COMP%]   .warning-icon[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .warning-icon[_ngcontent-%COMP%]{color:#f87171}.dark[_nghost-%COMP%]   .check-icon[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .check-icon[_ngcontent-%COMP%]{color:#34d399}"]})}}return e})();export{D as a};
