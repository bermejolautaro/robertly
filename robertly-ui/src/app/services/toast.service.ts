import { Injectable, signal } from '@angular/core';

export interface Toast {
  delay?: number;
  text: string;
  type: 'success' | 'secondary' | 'danger'
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toasts = signal<Toast[]>([]);

  public show(toast: Toast): void {
    this.toasts.update(toasts => [...toasts, toast]);
  }

  public ok(text: string) {
    this.show({ text, type: 'success'});
  }

  public error(text?: string) {
    this.show({ text: text ?? 'An error ocurred', type: 'danger'});
  }

  public remove(toast: Toast): void {
    this.toasts.update(toasts => toasts.filter(t => t !== toast));
  }

  public clear(): void {
    this.toasts.set([]);
  }
}
