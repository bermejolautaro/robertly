import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-paginator',
  template: `
    <div class="d-flex justify-content-center align-items-center gap-2">
      <button class="btn">
        <i
          (click)="firstPage()"
          class="fa fa-angle-double-left"
        ></i>
      </button>
      <button class="btn">
        <i
          (click)="prevPage()"
          class="fa fa-angle-left"
        ></i>
      </button>
      Page {{ currentPage() + 1 }} of {{ pageCount() }}
      <button
        class="btn"
        (click)="nextPage()"
      >
        <i class="fa fa-angle-right"></i>
      </button>
      <button
        class="btn"
        (click)="lastPage()"
      >
        <i class="fa fa-angle-double-right"></i>
      </button>
    </div>
  `,
  styles: `
    .btn {
      padding: 0.1rem;
    }
  `,
  standalone: true,
})
export class PaginatorComponent {
  public readonly currentPage = model<number>(0);
  public readonly pageCount = input<number>(0);

  public firstPage(): void {
    this.currentPage.update(() => 0);
  }

  public prevPage(): void {
    this.currentPage.update(x => Math.max(x - 1, 0));
  }

  public nextPage(): void {
    this.currentPage.update(x => Math.min(x + 1, this.pageCount() - 1));
  }

  public lastPage(): void {
    this.currentPage.update(() => this.pageCount() - 1);
  }
}
