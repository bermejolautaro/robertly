import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { lastValueFrom } from 'rxjs';
import { API_URL } from 'src/main';

export interface SerializableQueuedAction {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  payload: unknown;
  retries: number;
  maxRetries: number;
  optimisticType: string;
  userUuid: string;
  onActionDone?: (e: unknown) => void;
}

const QUEUE_KEY = 'offline-queue';

@Injectable({ providedIn: 'root' })
export class OfflineQueueService {
  public readonly isOnline = signal<boolean>(navigator.onLine);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private queue: SerializableQueuedAction[] = [];

  public constructor() {
    const queueAsString = localStorage.getItem(QUEUE_KEY);
    this.queue = queueAsString ? JSON.parse(queueAsString) : [];

    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  private saveQueue() {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
  }

  public enqueue(action: SerializableQueuedAction) {
    this.queue.push(action);
    this.saveQueue();
    if (this.isOnline()) {
      this.processQueue();
    }
  }

  public async processQueue() {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (!this.isOnline() || !this.authService.userUuid()) {
      return;
    }

    const actionProcessed: string[] = [];

    for (let i = 0; i < this.queue.length; i++) {
      const action = this.queue[i];

      if (!action) {
        continue;
      }

      if (action.userUuid !== this.authService.userUuid()) {
        actionProcessed.push(action.id);
        continue;
      }

      try {
        const request = new HttpRequest(
          action.method,
          `${this.apiUrl}/${action.endpoint}`,
          JSON.stringify(action.payload),
          {
            headers: httpHeaders,
          }
        );

        const response = await lastValueFrom(this.http.request(request));

        actionProcessed.push(action.id);
        this.saveQueue();
        this.toastService.ok('Log synced successfully!');

        if (action.onActionDone && response.type === HttpEventType.Response) {
          action.onActionDone(response.body);
        }
      } catch (error) {
        if (action.retries < action.maxRetries) {
          action.retries++;
        } else {
          actionProcessed.push(action.id);
          this.toastService.error('Max retries reached. Log synced failed.');
        }
        this.saveQueue();
      }
    }

    this.queue = this.queue.filter(action => !actionProcessed.includes(action.id));
    this.saveQueue();
  }
}
