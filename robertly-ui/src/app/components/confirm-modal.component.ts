import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  template: ` <div class="modal-header">
      <h4
        class="modal-title"
        id="modal-title"
      >
        {{ title() }}
      </h4>
      <button
        type="button"
        class="btn-close"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      <p [innerHTML]="subtitle()"></p>
      <p [innerHTML]="body()"></p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        (click)="modal.dismiss()"
      >
        {{ cancelText() }}
      </button>
      <button
        type="button"
        class="btn btn-{{ okType() }}"
        (click)="modal.close()"
      >
        {{ okText() }}
      </button>
    </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ConfirmModalComponent {
  public readonly title = model<string>('');
  public readonly subtitle = model<string>('');
  public readonly body = model<string>('');

  public readonly cancelText = model<string>('Cancel');
  public readonly okType = model<'primary' | 'danger'>('primary');
  public readonly okText = model<string>('Ok');

  public readonly modal = inject(NgbActiveModal);

  public configurate(config: {
    title?: string;
    subtitle?: string;
    body?: string;
    cancelText?: string;
    okType?: 'primary' | 'danger';
    okText?: string;
  }): void {
    if (config.title) {
      this.title.set(config.title);
    }

    if (config.subtitle) {
      this.subtitle.set(config.subtitle);
    }

    if (config.body) {
      this.body.set(config.body);
    }

    if (config.cancelText) {
      this.cancelText.set(config.cancelText);
    }

    if (config.okType) {
      this.okType.set(config.okType);
    }

    if (config.okText) {
      this.okText.set(config.okText);
    }
  }
}
