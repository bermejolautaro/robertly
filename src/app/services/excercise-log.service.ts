import { Injectable, computed, signal, effect } from '@angular/core';
import { ExerciseLog } from '@models/excercise-log.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as R from 'remeda';
import { Subject, delay, tap } from 'rxjs';
import { getPersonalRecord, groupExcerciseLogs, groupExerciseLogsByUser, mapGroupedToExcerciseRows } from '@helpers/excercise-log.helper';

interface SelectedExcercise {
  name: string;
  type: string;
}

type State = {
  logs: ExerciseLog[];
  filteredLogs: ExerciseLog[];
  selectedExercise: SelectedExcercise | null;
  selectedUsername: string | null;
  selectedType: string | null;
  loaded: boolean;
  error: string | null;
};

@Injectable()
export class ExerciseLogService {
  private readonly state = signal<State>({
    logs: [],
    filteredLogs: [],
    selectedExercise: null,
    selectedUsername: null,
    selectedType: null,
    loaded: false,
    error: null,
  });

  public readonly updateLogs$: Subject<ExerciseLog[]> = new Subject();
  public readonly selectedExcercise$: Subject<SelectedExcercise | null> = new Subject();
  public readonly selectedUsername$: Subject<string | null> = new Subject();
  public readonly selectedType$: Subject<string | null> = new Subject();

  public readonly loaded = computed(() => this.state().loaded);

  public readonly logs = computed(() => this.state().logs);

  public readonly filteredLogs = computed(() => {
    return this.state().filteredLogs;
  });

  public readonly types = computed(() =>
    R.pipe(
      this.state().filteredLogs,
      R.map(x => x.type),
      R.uniq()
    )
  );

  public readonly usernames = computed(() =>
    R.pipe(
      this.state().filteredLogs,
      R.map(x => x.user),
      R.uniq()
    )
  );

  public readonly excercises = computed(() => {
    return R.pipe(
      this.state().filteredLogs,
      R.map(x => ({ name: x.name, type: x.type })),
      R.uniqBy(x => x.name)
    );
  });

  public readonly selectedTypeLabel = computed(() => this.state().selectedType ?? 'Type');
  public readonly selectedExcerciseLabel = computed(() => this.state().selectedExercise ?? { name: 'Exercise', type: '' });
  public readonly selectedUsernameLabel = computed(() => this.state().selectedUsername ?? 'All Users');

  public readonly groupedLogs = computed(() => {
    const groups = groupExcerciseLogs(this.state().filteredLogs);
    const selectedUsername = this.state().selectedUsername;
    const selectedExcercise = this.state().selectedExercise;
    const selectedType = this.state().selectedType;

    const result = R.pipe(
      groups,
      R.map(([date, valuesByDate]) => {
        const filteredValuesByDate = R.pipe(
          valuesByDate,
          R.filter(([username]) => (!selectedUsername ? true : selectedUsername === username)),
          R.map(([username, valuesByUsername]) => {
            const filteredValuesByUsername = R.pipe(
              valuesByUsername,
              R.filter(([_excercise, row]) => (!selectedType ? true : row.type === selectedType)),
              R.filter(([excercise]) => (!selectedExcercise ? true : excercise === selectedExcercise.name)),
              R.filter(x => x.length > 0)
            );

            return [username, filteredValuesByUsername] as const;
          }),
          R.filter(([_, x]) => x.length > 0)
        );

        return [date, filteredValuesByDate] as const;
      }),
      R.filter(([_, x]) => x.length > 0)
    );

    return result;
  });

  public readonly exerciseRows = computed(() => {
    const rows = mapGroupedToExcerciseRows(this.groupedLogs());
    return R.pipe(
      rows,
      this.state().selectedType ? R.filter(x => x.type === this.state().selectedType) : R.identity,
      this.state().selectedExercise ? R.filter(x => x.excerciseName === this.state().selectedExercise?.name) : R.identity,
      this.state().selectedUsername ? R.filter(x => x.username === this.state().selectedUsername) : R.identity
    );
  });

  public readonly personalRecord = computed(() => {
    const excercise = this.state().selectedExercise?.name;
    const username = this.state().selectedUsername;
    return excercise && username ? getPersonalRecord(this.exerciseRows(), excercise, username) : null;
  });

  public readonly amountDaysTrainedPerUser = computed(() => {
    const logsGroupedByUser = groupExerciseLogsByUser(this.state().filteredLogs);
  });

  public constructor() {
    effect(() => console.log(this.state()));

    this.updateLogs$
      .pipe(
        tap(() => this.state.update(state => ({ ...state, loaded: false }))),
        delay(300),
        takeUntilDestroyed()
      )
      .subscribe({
        next: logs =>
          this.state.update(state => ({
            ...state,
            logs: logs,
            filteredLogs: logs.filter(x => !!x.name),
            loaded: true,
          })),
      });

    this.selectedExcercise$.pipe(takeUntilDestroyed()).subscribe({
      next: selectedExcercise =>
        this.state.update(state => ({
          ...state,
          selectedExercise: selectedExcercise,
          selectedType: selectedExcercise?.type ?? null,
        })),
    });

    this.selectedType$.pipe(takeUntilDestroyed()).subscribe({
      next: selectedType => {
        let selectedExercise = this.state().selectedExercise;

        if (selectedType && selectedExercise?.type && selectedType !== selectedExercise.type) {
          selectedExercise = null;
        }

        this.state.update(state => ({
          ...state,
          selectedType,
          selectedExercise,
        }));
      },
    });

    this.selectedUsername$.pipe(takeUntilDestroyed()).subscribe({
      next: selectedUsername =>
        this.state.update(state => ({
          ...state,
          selectedUsername,
        })),
    });
  }
}
