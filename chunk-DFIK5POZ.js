import{T as u,a as o,b as g}from"./chunk-GHPPUNBP.js";import{B as l,fa as h,ja as c,pa as n,tb as d}from"./chunk-LRWZ4U2F.js";var C=(()=>{class s{constructor(){this.http=n(g),this.apiUrl=n(u),this.recentlyUpdatedCache=d([]),this.recentlyUpdated=this.recentlyUpdatedCache.asReadonly()}getExerciseLogById(t){return this.http.get(`${this.apiUrl}/logs/${t}`)}getExerciseLogs(t=0,i=null,a=null,p=null,e=null){let r=new o;return i&&(r=r.append("userId",i)),a&&(r=r.append("exerciseType",a)),p&&(r=r.append("exerciseId",p)),e&&(r=r.append("weightInKg",e)),this.http.get(`${this.apiUrl}/logs?page=${t}&count=10`,{params:r}).pipe(l(f=>f.data))}getSeriesPerMuscle(){return this.http.get(`${this.apiUrl}/logs/series-per-muscle?serviceWorkerCache=true`)}getDaysTrained(){return this.http.get(`${this.apiUrl}/logs/days-trained?serviceWorkerCache=true`)}getRecentlyUpdated(){return this.http.get(`${this.apiUrl}/logs/recently-updated`).pipe(l(t=>t.data),h(t=>this.recentlyUpdatedCache.set(t)))}getExerciseLogsLatestWorkout(){return this.http.get(`${this.apiUrl}/logs/latest-workout`).pipe(l(t=>t.data))}getFilters(t=null,i,a=null,p=null){let e=new o;return t&&(e=e.append("userId",t)),i&&(e=e.append("exerciseId",i)),a&&(e=e.append("type",a)),p&&(e=e.append("weightInKg",p)),this.http.get(`${this.apiUrl}/logs/filters`,{params:e})}createExerciseLog(t){return this.http.post(`${this.apiUrl}/logs`,t)}updateExerciseLog(t){return this.http.put(`${this.apiUrl}/logs/${t.id}`,t)}deleteExerciseLog(t){return this.http.delete(`${this.apiUrl}/logs/${t}`)}static{this.\u0275fac=function(i){return new(i||s)}}static{this.\u0275prov=c({token:s,factory:s.\u0275fac,providedIn:"root"})}}return s})();export{C as a};
