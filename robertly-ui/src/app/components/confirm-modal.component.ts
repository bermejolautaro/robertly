import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-modal',
    template: `<div class="modal-header">
      <h4
        class="modal-title"
        id="modal-title"
      >
        {{ title }}
      </h4>
      <button
        type="button"
        class="btn-close"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      <p [innerHTML]="subtitle"></p>
      <p [innerHTML]="body"></p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        (click)="modal.dismiss()"
      >
        {{ cancelText }}
      </button>
      <button
        type="button"
        class="btn btn-{{okType}}"
        (click)="modal.close()"
      >
        {{ okText }}
      </button>
    </div>`,
    styles: `

  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ConfirmModalComponent {
  @Input() public title: string = '';
  @Input() public subtitle: string = '';
  @Input() public body: string = '';

  @Input() public cancelText: string = 'Cancel';
  @Input() public okType: 'primary' | 'danger' = 'primary'
  @Input() public okText: string = 'Ok';

  public readonly modal = inject(NgbActiveModal);
}
