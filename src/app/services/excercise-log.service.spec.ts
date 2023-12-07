import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';
import ***REMOVED*** TestBed, fakeAsync, tick ***REMOVED*** from '@angular/core/testing';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

describe('ExcerciseLogService', () => ***REMOVED***
  let service: ExerciseLogService = null!;
  dayjs.extend(isoWeek);

  beforeEach(() => ***REMOVED***
    TestBed.configureTestingModule(***REMOVED*** providers: [ExerciseLogService] ***REMOVED***);
    service = TestBed.inject(ExerciseLogService);
***REMOVED***);

  it('amountDaysTrainedPerUser', fakeAsync(() => ***REMOVED***
    const input = [
      ***REMOVED*** date: '1997/10/20', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 ***REMOVED***,
      ***REMOVED*** date: '1997/10/21', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 ***REMOVED***,
      ***REMOVED*** date: '1997/10/22', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 ***REMOVED***,
      ***REMOVED*** date: '1997/10/20', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'matias', weightKg: 12 ***REMOVED***,
    ];
    service.updateLogs$.next(input);

    tick(300);

    const result = service.amountDaysTrainedPerUser();

    const expected = ***REMOVED*** lautaro: 3, matias: 1***REMOVED***;

    expect(result).toEqual(expected);
***REMOVED***));
***REMOVED***);
