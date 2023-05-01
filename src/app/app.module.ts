import ***REMOVED*** NgModule, isDevMode ***REMOVED*** from '@angular/core';

import ***REMOVED*** HttpClientModule ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** NgbAccordionModule, NgbDropdownModule, NgbNavModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';
import ***REMOVED*** CommonModule ***REMOVED*** from '@angular/common';
import ***REMOVED*** BrowserModule ***REMOVED*** from '@angular/platform-browser';
import ***REMOVED*** ServiceWorkerModule ***REMOVED*** from '@angular/service-worker';
import ***REMOVED*** FormsModule, ReactiveFormsModule ***REMOVED*** from '@angular/forms';

import ***REMOVED*** AppComponent ***REMOVED*** from '@app/app.component';
import ***REMOVED*** IfNullEmptyArrayPipe ***REMOVED*** from '@pipes/if-null-empty-array.pipe';
import ***REMOVED*** ExcerciseRowsComponent ***REMOVED*** from '@components/excercise-rows.component';
import ***REMOVED*** GroupedExcerciseRowsComponent ***REMOVED*** from '@components/grouped-excercise-rows.component';
import ***REMOVED*** ExcerciseRowBodyComponent ***REMOVED*** from '@components/excercise-row-body.component';
import ***REMOVED*** ExcerciseRowTitleComponent ***REMOVED*** from '@components/excercise-row-title.component';
import ***REMOVED*** PersonalRecordComponent ***REMOVED*** from '@components/personal-record.component';
import ***REMOVED*** RouterModule, provideRouter, withDebugTracing ***REMOVED*** from '@angular/router';
import ***REMOVED*** ExcerciseLogsPageComponent ***REMOVED*** from '@app/pages/excercise-logs.page.component';
import ***REMOVED*** AppRoutingModule ***REMOVED*** from '@app/app-routing.module';

@NgModule(***REMOVED***
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    NgbDropdownModule,
    NgbNavModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    RouterModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', ***REMOVED***
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
***REMOVED***),
    ExcerciseRowsComponent,
    GroupedExcerciseRowsComponent,
    ExcerciseRowBodyComponent,
    ExcerciseRowTitleComponent,
    PersonalRecordComponent,
    ExcerciseLogsPageComponent,
    IfNullEmptyArrayPipe
  ],
  providers: [],
  bootstrap: [AppComponent]
***REMOVED***)
export class AppModule ***REMOVED*** ***REMOVED***
