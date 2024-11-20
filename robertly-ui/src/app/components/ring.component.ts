import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-ring',
  template: ` <svg
    class="progress-ring"
    [attr.height]="this.size() "
    [attr.width]="this.size()"
  >
    <text
      class="progress-ring__text"
      x="50%"
      y="52%"
      fill="white"
    >
      {{ value() }}
    </text>
    <circle
      class="progress-ring__circle default"
      [attr.stroke-width]="strokeWidth()"
      fill="transparent"
      [attr.r]="this.radius()"
      [attr.cx]="this.size() / 2"
      [attr.cy]="this.size() / 2"
      stroke =
    />
    <circle
      #ring
      class="progress-ring__circle"
      [class.success]="isSuccess()"
      [class.danger]="isDanger()"
      [attr.stroke-width]="strokeWidth()"
      fill="transparent"
      [attr.r]="this.radius()"
      [attr.cx]="this.size() / 2"
      [attr.cy]="this.size() / 2"
    />

  </svg>`,
  styles: `
    .progress-ring__text {
      font-size: 24px;
      font-weight: bold;
      transform-origin: 50% 50%;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .progress-ring__circle {
      transition: stroke-dashoffset 0.35s;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
      stroke: #fdcd00;
    }

    .default {
      stroke: var(--light-bg);
    }

    .success {
        stroke: #27bb65;
    }

    .danger {
        stroke: #c33e37;
    }
      `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class RingComponent {
  public readonly ring = viewChild<ElementRef<SVGCircleElement>>('ring');
  public readonly value = input<number>(100);
  public readonly maxValue = input<number>(100);
  public readonly percent = computed(() => Math.min(100, (this.value() * 100) / this.maxValue()));
  public readonly isSuccess = computed(() => this.percent() >= 80);
  public readonly isDanger = computed(() => this.percent() < 50);

  public readonly size = signal(100);
  public readonly strokeWidth = signal(7);

  public readonly radius = computed(() => (this.size() / 2) - (this.strokeWidth() * 2));

  #asd = effect(() => {
    const radius = this.radius();
    const percent = this.percent();
    const ring = this.ring();

    if (ring) {
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - (percent / 100) * circumference;

      ring.nativeElement.style.strokeDasharray = `${circumference} ${circumference}`;
      ring.nativeElement.style.strokeDashoffset = `${offset}`;
    }
  });
}
