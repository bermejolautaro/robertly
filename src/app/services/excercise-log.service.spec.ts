import { ExerciseLogService } from '@services/excercise-log.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

describe('ExcerciseLogService', () => {
  let service: ExerciseLogService = null!;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ExerciseLogService] });
    service = TestBed.inject(ExerciseLogService);
  });

  it('test', fakeAsync(() => {
    const input = [
      { date: '1997/10/20', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 },
      { date: '1997/10/21', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 },
      { date: '1997/10/22', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 },
      { date: '1997/10/20', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'matias', weightKg: 12 },
    ];
    service.updateLogs$.next(input);

    tick(300);

    console.log(service.amountDaysTrainedPerUser());

    expect(69).toBe(69);
  }));
});
