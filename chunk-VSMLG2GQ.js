import{D as b,E as D}from"./chunk-C3W2BF6O.js";import{Aa as f,Ab as c,Cb as g,Eb as k,Gc as n,Jc as O,Kb as v,La as h,Lb as u,Mb as C,Xb as _,cb as a,dc as M,fc as y,kb as d,ub as i}from"./chunk-W53POS3V.js";var q=(()=>{class r{constructor(){this.value=h(0),this.maxValue=h(1),this.count=i(0),this.percent=n(()=>Math.min(100,this.value()*100/this.maxValue())),this.percentClass=n(()=>{let t=this.percent();return t>=70?"success":t>=50?"average":"danger"}),this.size=i(100),this.strokeWidth=i(7),this.radius=n(()=>this.size()/2-this.strokeWidth()*2),this.circumference=n(()=>this.radius()*2*Math.PI),this.strokeDashOffset=i(this.circumference()),this.transition=i("none"),this.strokeDashArray=n(()=>{let t=this.circumference();return`${t} ${t}`}),this.#e=O(()=>{let t=this.percent(),s=this.circumference(),e=s-t/100*s,o=800;setTimeout(()=>{this.transition.set(`stroke-dashoffset ${o}ms`),this.strokeDashOffset.set(e),this.animateCountUp(this.value(),o)},1e3)})}animateCountUp(t,s=2e3){let e=this.count(),o=performance.now(),l=z=>{let P=z-o,w=m=>m*(2-m),p=Math.min(P/s,1),T=w(p),V=Math.round(e+(t-e)*T);this.count.set(V),p<1?requestAnimationFrame(l):this.count.set(t)};requestAnimationFrame(l)}ngOnInit(){this.transition.set("none"),this.strokeDashOffset.set(this.circumference())}#e;static{this.\u0275fac=function(s){return new(s||r)}}static{this.\u0275cmp=d({type:r,selectors:[["app-ring"]],inputs:{value:[1,"value"],maxValue:[1,"maxValue"]},decls:5,vars:20,consts:[["tooltipClass","ring-tooltip","ontouchstart","","tabindex","-1",1,"progress-ring",3,"ngbTooltip"],["x","50%","y","52%","fill","white",1,"progress-ring__text"],["fill","transparent","stroke","",1,"progress-ring__circle","default"],["fill","transparent",1,"progress-ring__circle"]],template:function(s,e){s&1&&(f(),v(0,"svg",0)(1,"text",1),M(2),u(),C(3,"circle",2)(4,"circle",3),u()),s&2&&(_("ngbTooltip","",e.value()," / ",e.maxValue(),""),c("height",e.size())("width",e.size()),a(2),y(" ",e.count()," "),a(),c("stroke-width",e.strokeWidth())("r",e.radius())("cx",e.size()/2)("cy",e.size()/2),a(),k(e.percentClass()),g("transition",e.transition()),c("stroke-width",e.strokeWidth())("stroke-dasharray",e.strokeDashArray())("stroke-dashoffset",e.strokeDashOffset())("r",e.radius())("cx",e.size()/2)("cy",e.size()/2))},dependencies:[D,b],styles:["svg[_ngcontent-%COMP%]:focus{outline:none}.progress-ring__text[_ngcontent-%COMP%]{font-size:24px;font-weight:700;transform-origin:50% 50%;text-anchor:middle;dominant-baseline:middle}.progress-ring__circle[_ngcontent-%COMP%]{transform:rotate(-90deg);transform-origin:50% 50%;stroke:var(--light-bg)}.success[_ngcontent-%COMP%]{stroke:#27bb65}.average[_ngcontent-%COMP%]{stroke:#fdcd00}.danger[_ngcontent-%COMP%]{stroke:#c33e37}"],changeDetection:0})}}return r})();export{q as a};
