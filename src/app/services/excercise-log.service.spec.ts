import { ExerciseLogService } from '@services/excercise-log.service';
import { TestBed } from '@angular/core/testing';

describe('ExcerciseLogService', () => {
  let service: ExerciseLogService = null!;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ExerciseLogService] });
    service = TestBed.inject(ExerciseLogService);
  });

  it('test', () => {
    console.log(service.filteredLogs());
    service.updateLogs$.next([{ date: '1997/10/20', name: 'bicep curl', reps: 12, serie: 1, type: 'push', user: 'lautaro', weightKg: 12 }]);
    console.log(service.filteredLogs());
    service.selectedExcercise$.next('bicep curl');
    console.log(service.filteredLogs());

    expect(69).toBe(69);
  });
});
