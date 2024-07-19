import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  template: `<div class="modal-header">
      <h4
        class="modal-title"
        id="modal-title"
      >
        Profile deletion
      </h4>
      <button
        type="button"
        class="btn-close"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      <p>
        <strong>Are you sure you want to delete this record?</strong>
      </p>
      <p>
        This record will be permanently deleted.
        <span class="text-danger">This operation can not be undone.</span>
      </p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        (click)="modal.dismiss()"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-danger"
        (click)="modal.close()"
      >
        Ok
      </button>
    </div>`,
  styles: `

  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ConfirmModalComponent {
  public readonly modal = inject(NgbActiveModal);
}
