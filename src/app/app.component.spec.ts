import ***REMOVED*** TestBed ***REMOVED*** from '@angular/core/testing';
import ***REMOVED*** RouterTestingModule ***REMOVED*** from '@angular/router/testing';
import ***REMOVED*** AppComponent ***REMOVED*** from './app.component';

describe('AppComponent', () => ***REMOVED***
  beforeEach(async () => ***REMOVED***
    await TestBed.configureTestingModule(***REMOVED***
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
***REMOVED***).compileComponents();
***REMOVED***);

  it('should create the app', () => ***REMOVED***
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
***REMOVED***);

  it(`should have as title 'gym-angular-excel'`, () => ***REMOVED***
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('gym-angular-excel');
***REMOVED***);

  it('should render title', () => ***REMOVED***
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('gym-angular-excel app is running!');
***REMOVED***);
***REMOVED***);
