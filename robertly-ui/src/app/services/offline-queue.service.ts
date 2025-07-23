import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
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
}

const QUEUE_KEY = 'offline-queue';

@Injectable({ providedIn: 'root' })
export class OfflineQueueService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private queue: SerializableQueuedAction[] = [];
  private isOnline = signal<boolean>(navigator.onLine);

  public constructor() {
    const queueAsString = localStorage.getItem(QUEUE_KEY);
    this.queue = queueAsString ? JSON.parse(queueAsString) : [];

    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));

    effect(async () => {
      if (this.isOnline()) {
        await this.processQueue();
      }
    });
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

    for (const action of this.queue) {
      const action = this.queue[0];

      if (!action) {
        this.queue.shift();
        continue;
      }

      if (action.userUuid !== this.authService.userUuid()) {
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

        await lastValueFrom(this.http.request(request));
        this.queue.shift();
        this.saveQueue();
        this.toastService.ok('Log synced successfully!');
      } catch (error) {
        if (action.retries < action.maxRetries) {
          action.retries++;
        } else {
          this.queue.shift();
          this.toastService.error('Max retries reached. Log synced failed.');
        }
        this.saveQueue();
      }
    }
  }
}
