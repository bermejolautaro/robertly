import{d as b,n as W,o as A,w as _}from"./chunk-R3WUOK46.js";import{e as k,g as V,l as E,q as L,r as T}from"./chunk-JY52K3I6.js";import{r as M}from"./chunk-HKPS3N5F.js";import{Fb as x,Jb as o,Ka as y,Kb as r,Lb as v,Ob as I,Sb as p,Tb as s,ab as d,cc as m,fc as u,gc as h,hc as f,ma as g,mb as C,rb as w,ua as l,va as c,y as S}from"./chunk-D2TTQ72P.js";function O(i,D){if(i&1){let e=I();o(0,"div",2)(1,"button",3),p("click",function(){l(e);let t=s();return c(t.onClickSignInWithGoogle())}),v(2,"img",4),o(3,"span"),m(4,"Sign In with Google"),r()()(),o(5,"div",5)(6,"div",6)(7,"input",7),f("ngModelChange",function(t){l(e);let a=s();return h(a.email,t)||(a.email=t),c(t)}),r()(),o(8,"div",8)(9,"input",9),f("ngModelChange",function(t){l(e);let a=s();return h(a.password,t)||(a.password=t),c(t)}),r()(),o(10,"div",10)(11,"button",11),p("click",function(){l(e);let t=s();return c(t.onClickSignIn())}),m(12," Sign In "),r()()()}if(i&2){let e=s();d(7),u("ngModel",e.email),d(2),u("ngModel",e.password)}}function P(i,D){i&1&&(o(0,"div",1)(1,"div",12)(2,"span",13),m(3,"Loading..."),r()()())}var U=(()=>{class i{constructor(){this.authApiService=g(A),this.toastService=g(W),this.router=g(b),this.isLoading=y(!1),this.email="",this.password=""}async ngOnInit(){await this.authApiService.tryRefreshToken()}async onClickSignIn(){if(!(!this.email||!this.password)){try{this.isLoading.set(!0),await S(this.authApiService.signIn({email:this.email,password:this.password})),this.router.navigate([_.HOME])}catch{this.toastService.error("Sign in with email failed.")}this.isLoading.set(!1)}}async onClickSignInWithGoogle(){try{this.isLoading.set(!0),await this.authApiService.signInWithGoogle(),this.router.navigate([_.HOME])}catch{this.toastService.error("Sign in with google failed.")}this.isLoading.set(!1)}static{this.\u0275fac=function(n){return new(n||i)}}static{this.\u0275cmp=C({type:i,selectors:[["app-signin"]],decls:3,vars:1,consts:[[1,"container","my-3"],[1,"position-absolute","top-50","start-50","translate-middle"],[1,"d-flex","justify-content-center","mt-2"],["type","button",1,"btn","btn-light","w-100","sign-in-google",3,"click"],["width","32","height","32","ngSrc","assets/icons/google-sign-in.png"],[1,"my-3"],[1,"input-group"],["type","text","placeholder","Email",1,"form-control",3,"ngModelChange","ngModel"],[1,"input-group","my-1"],["type","password","placeholder","Password",1,"form-control",3,"ngModelChange","ngModel"],[1,"d-flex","justify-content-end","my-2"],["type","button",1,"btn","btn-primary","me-2",3,"click"],["role","status",1,"robertly-spinner","spinner-border","text-primary"],[1,"visually-hidden"]],template:function(n,t){n&1&&(o(0,"div",0),w(1,O,13,2)(2,P,4,0,"div",1),r()),n&2&&(d(),x(t.isLoading()?2:1))},dependencies:[L,k,V,E,T,M],styles:[".sign-in-google[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;border:1px solid rgb(226,232,240);background-color:#fff;gap:5px}"],changeDetection:0})}}return i})();export{U as SignInComponent};
