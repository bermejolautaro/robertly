import{r as l,s as h,t as y,u as M,v as j}from"./chunk-QQUWNONX.js";import{Lc as p,e as i,ga as n,lb as a,ma as s}from"./chunk-QHOELIAC.js";var m=["DD-MM-YYYY","DD-M-YYYY","D-MM-YYYY","D-M-YYYY","YYYY-MM-DD","YYYY-M-DD","YYYY-MM-D","YYYY-M-D"],P="robertly-create-log-value";var Y=i(l()),f=i(h()),d=i(y()),u=i(M()),F=i(j());var D=(()=>{class t{constructor(){this.dayjs=Y.default,this.dayjs.extend(f.default),this.dayjs.extend(d.default),this.dayjs.extend(u.default),this.dayjs.locale("es-mx")}get instance(){return this.dayjs}parseDate(e){return this.instance(e,[...m])}static{this.\u0275fac=function(r){return new(r||t)}}static{this.\u0275prov=n({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();var A=(()=>{class t{transform(e,r,o){return e==null?"":e.toLocaleString(void 0,{minimumFractionDigits:0,maximumFractionDigits:1})}static{this.\u0275fac=function(r){return new(r||t)}}static{this.\u0275pipe=a({name:"padStart",type:t,pure:!0})}}return t})();var I=(()=>{class t{constructor(){this.dayjsService=s(D),this.titleCasePipe=s(p)}transform(e,r="Invalid Date"){let o=this.dayjsService.parseDate(e??"");return o.isValid()?this.titleCasePipe.transform(o.format("dddd[ - ]DD/MM/YYYY")):r}static{this.\u0275fac=function(r){return new(r||t)}}static{this.\u0275pipe=a({name:"parseToDate",type:t,pure:!0})}}return t})();export{A as a,P as b,D as c,I as d};
