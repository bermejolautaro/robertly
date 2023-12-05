import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';
import ***REMOVED*** TestBed ***REMOVED*** from '@angular/core/testing';

describe('ExcerciseLogService', () => ***REMOVED***
  let service: ExerciseLogService = null!;

  beforeEach(() => ***REMOVED***
    TestBed.configureTestingModule(***REMOVED*** providers: [ExerciseLogService] ***REMOVED***);
    service = TestBed.inject(ExerciseLogService);
***REMOVED***);

  it('test', () => ***REMOVED***
    console.log(service.filteredLogs());
    service.updateLogs$.next([***REMOVED*** date: '1997/10/20', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 ***REMOVED***]);
    console.log(service.filteredLogs());
    service.selectedExcercise$.next('bicep curl');
    console.log(service.filteredLogs());

    expect(69).toBe(69);
***REMOVED***);
***REMOVED***);
