import ***REMOVED*** NgModule, isDevMode ***REMOVED*** from '@angular/core';

import ***REMOVED*** AppComponent ***REMOVED*** from './app.component';
import ***REMOVED*** HttpClientModule ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** NgbModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';
import ***REMOVED*** CommonModule ***REMOVED*** from '@angular/common';
import ***REMOVED*** BrowserModule ***REMOVED*** from '@angular/platform-browser';
import ***REMOVED*** ServiceWorkerModule ***REMOVED*** from '@angular/service-worker';
import ***REMOVED*** FormsModule, ReactiveFormsModule ***REMOVED*** from '@angular/forms';

@NgModule(***REMOVED***
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    NgbModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', ***REMOVED***
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
***REMOVED***)
  ],
  providers: [],
  bootstrap: [AppComponent]
***REMOVED***)
export class AppModule ***REMOVED*** ***REMOVED***
