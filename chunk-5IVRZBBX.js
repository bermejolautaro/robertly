import{k as A,q as B,r as E,u as j,v as R,w as W,x as q,y as z,z as G}from"./chunk-JY52K3I6.js";import{h as N,j as $}from"./chunk-HKPS3N5F.js";import{$ as M,Ab as w,Cb as _,Fb as h,Gb as V,Ha as u,Hb as F,Ia as r,Ib as O,Jb as c,Ka as x,Kb as a,Lb as g,Ob as C,Sb as v,Tb as s,ab as i,cc as f,dc as T,ec as S,jb as P,mb as k,nc as I,pc as y,qc as D,rb as b,ua as p,va as m}from"./chunk-D2TTQ72P.js";var H=t=>({active:t});function J(t,l){if(t&1){let e=C();c(0,"button",6),v("click",function(){p(e);let o=s();return m(o.control().patchValue(null))}),g(1,"i",7),a()}}function K(t,l){t&1&&g(0,"div",9)}function L(t,l){if(t&1){let e=C();c(0,"button",8),v("click",function(){let o=p(e).$implicit,d=s();return m(d.control().patchValue(o))}),f(1),y(2,"titlecase"),a(),b(3,K,1,0,"div",9)}if(t&2){let e=l.$implicit,n=l.$index,o=l.$count,d=s();w("ngClass",I(5,H,d.isActive()(e))),i(),S(" ",D(2,3,d.formatter()(e))," "),i(2),h(n!==o-1?3:-1)}}var ie=(()=>{class t{constructor(){this.placeholder=r("Placeholder"),this.control=P(new A(null)),this.items=r([]),this.showClear=r(!0),this.formatter=r(e=>`${e??""}`),this.isActive=r(e=>this.selectedValue()===e),this.clearFilterClicked=u(),this.elementSelected=u(),this.selectedValue=x("")}ngOnInit(){this.control().valueChanges.pipe(M(this.control().value)).subscribe(e=>{this.selectedValue.set(e?this.formatter()(e):this.placeholder())})}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275cmp=k({type:t,selectors:[["app-dropdown"]],inputs:{placeholder:[1,"placeholder"],control:[1,"control"],items:[1,"items"],showClear:[1,"showClear"],formatter:[1,"formatter"],isActive:[1,"isActive"]},outputs:{control:"controlChange",clearFilterClicked:"clearFilterClicked",elementSelected:"elementSelected"},decls:10,vars:9,consts:[["ngbDropdown","",1,"d-flex","justify-content-center"],[1,"input-group","flex-nowrap","has-validation"],["type","button","ngbDropdownToggle","",1,"btn","btn-outline-primary","d-flex","justify-content-between","align-items-center","w-100","dropdown",3,"disabled"],[1,"dropdown-label"],["type","button",1,"btn","btn-outline-secondary"],["ngbDropdownMenu","",1,"w-100"],["type","button",1,"btn","btn-outline-secondary",3,"click"],[1,"fa","fa-times"],["ngbDropdownItem","",3,"click","ngClass"],[1,"dropdown-divider"]],template:function(n,o){n&1&&(c(0,"div",0)(1,"div",1)(2,"button",2)(3,"span",3),f(4),y(5,"titlecase"),a()(),b(6,J,2,0,"button",4),c(7,"div",5),F(8,L,4,7,null,null,V),a()()()),n&2&&(i(2),_("with-clear-icon",o.showClear()),w("disabled",o.control().disabled),i(),_("active",o.control().value),i(),T(D(5,7,o.selectedValue())),i(2),h(o.showClear()?6:-1),i(2),O(o.items()))},dependencies:[E,B,G,z,q,W,j,R,$,N],styles:["[_nghost-%COMP%]{display:block;width:100%}.with-clear-icon[_ngcontent-%COMP%]{border-top-right-radius:0;border-bottom-right-radius:0}.dropdown[_ngcontent-%COMP%]{--bs-btn-color: var(--body-bg);--bs-btn-border-color: var(--bs-border-color);--bs-btn-hover-border-color: var(--bs-border-color)}.dropdown[_ngcontent-%COMP%]   button.btn-outline-primary.show[_ngcontent-%COMP%], .dropdown[_ngcontent-%COMP%]   button.btn-outline-primary[_ngcontent-%COMP%]:hover{background-color:transparent;--bs-btn-active-border-color: var(--bs-border-color)}.dropdown-label[_ngcontent-%COMP%]{opacity:.6}.dropdown-label.active[_ngcontent-%COMP%]{opacity:1}"],changeDetection:0})}}return t})();export{ie as a};
