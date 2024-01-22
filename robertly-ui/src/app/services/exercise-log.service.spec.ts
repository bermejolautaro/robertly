import { ExerciseLogService } from '@services/exercise-log.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

describe('ExerciseLogService', () => {
  // let service: ExerciseLogService = null!;

  // beforeEach(() => {
  //   TestBed.configureTestingModule({ providers: [ExerciseLogService] });
  //   service = TestBed.inject(ExerciseLogService);
  // });

  // it('amountDaysTrainedPerUser', fakeAsync(() => {
  //   const input = [
  //     { date: '1997/10/20', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 },
  //     { date: '1997/10/21', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 },
  //     { date: '1997/10/22', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 },
  //     { date: '1997/10/20', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'matias', weightKg: 12 },
  //   ];
  //   service.updateLogs$.next(input);

  //   tick(300);

  //   const result = service.amountDaysTrainedPerUser();

  //   const expected = { lautaro: 3, matias: 1 };

  //   expect(result).toEqual(expected);
  // }));
});
