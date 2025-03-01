import { Injectable, signal } from '@angular/core';
import * as R from 'remeda'

export interface Toast {
  delay?: number;
  text: string;
  type: 'success' | 'secondary' | 'danger'
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toasts = signal<Toast[]>([]);

  public show(toast: Toast): void {
    this.toasts.update(toasts => R.uniqueBy([...toasts, toast], x => x.text));
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
