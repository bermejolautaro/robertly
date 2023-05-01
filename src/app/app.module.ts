import { NgModule, isDevMode } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from '@app/app.component';
import { IfNullEmptyArrayPipe } from '@pipes/if-null-empty-array.pipe';
import { ExcerciseRowsComponent } from '@components/excercise-rows.component';
import { GroupedExcerciseRowsComponent } from '@components/grouped-excercise-rows.component';
import { ExcerciseRowBodyComponent } from '@components/excercise-row-body.component';
import { ExcerciseRowTitleComponent } from '@components/excercise-row-title.component';
import { PersonalRecordComponent } from '@components/personal-record.component';

@NgModule({
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ExcerciseRowsComponent,
    GroupedExcerciseRowsComponent,
    ExcerciseRowBodyComponent,
    ExcerciseRowTitleComponent,
    PersonalRecordComponent,
    IfNullEmptyArrayPipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
