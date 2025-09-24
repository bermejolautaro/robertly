import { ChangeDetectionStrategy, Component, computed, effect, input, model, signal } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ring',
  template: ` <svg
    class="progress-ring"
    [attr.height]="dimensions()"
    [attr.width]="dimensions()"
    ngbTooltip="{{ value() }} / {{ maxValue() }}"
    tooltipClass="ring-tooltip"
    ontouchstart
    tabindex="-1"
  >
    <text
      class="progress-ring__text"
      x="50%"
      y="52%"
      fill="white"
      [style.fontSize]="fontSize()"
    >
      {{ count() }}
    </text>

    <circle
      class="progress-ring__circle default"
      [attr.stroke-width]="strokeWidth()"
      fill="transparent"
      [attr.r]="this.radius()"
      [attr.cx]="this.dimensions() / 2"
      [attr.cy]="this.dimensions() / 2"
      stroke=""
    />

    <circle
      class="progress-ring__circle"
      [style.transition]="transition()"
      [class]="progressClass()"
      [attr.stroke-width]="strokeWidth()"
      [attr.stroke-dasharray]="strokeDashArray()"
      [attr.stroke-dashoffset]="strokeDashOffset()"
      fill="transparent"
      [attr.r]="this.radius()"
      [attr.cx]="this.dimensions() / 2"
      [attr.cy]="this.dimensions() / 2"
    />

    @if (showExcess()) {
      <circle
        class="progress-ring__circle excess"
        [style.transition]="transition()"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="excessStrokeDashArray()"
        [attr.stroke-dashoffset]="excessStrokeDashOffset()"
        fill="transparent"
        [attr.r]="this.radius()"
        [attr.cx]="this.dimensions() / 2"
        [attr.cy]="this.dimensions() / 2"
      />
    }
  </svg>`,
  styles: `
    svg:focus {
      outline: none;
    }

    .progress-ring__text {
      font-size: 24px;
      font-weight: bold;
      transform-origin: 50% 50%;
      text-anchor: middle;
      dominant-baseline: middle;
    }

    .progress-ring__circle {
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
      stroke: var(--light-bg);
    }

    .excess {
      stroke: #00c3ff;
    }

    .success {
      stroke: #27bb65;
    }

    .average {
      stroke: #fdcd00;
    }

    .danger {
      stroke: #c33e37;
    }

    .default {
      stroke: var(--light-bg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbTooltipModule],
})
export class RingComponent {
  public readonly value = input<number>(0);
  public readonly maxValue = input<number>(1);
  public readonly size = model<'l' | 'm' | 's'>('m');

  public readonly count = signal(0);
  public readonly showExcess = signal(false);

  public readonly percent = computed(() => (this.value() * 100) / this.maxValue());
  
  public readonly progressClass = computed(() => {
    const percent = this.percent();
    if (percent > 100) return 'success'; // Always green when over 100%
    return percent >= 70 ? 'success' : percent >= 50 ? 'average' : 'danger';
  });

  public readonly dimensions = computed(() => {
    switch (this.size()) {
      case 'l':
        return 100;
      case 'm':
        return 100;
      case 's':
        return 50;
    }
  });

  public readonly strokeWidth = computed(() => {
    switch (this.size()) {
      case 'l':
        return 7;
      case 'm':
        return 7;
      case 's':
        return 3;
    }
  });

  public readonly fontSize = computed(() => {
    switch (this.size()) {
      case 'l':
        return 7;
      case 'm':
        return 24;
      case 's':
        return 12;
    }
  });

  public readonly radius = computed(() => this.dimensions() / 2 - this.strokeWidth() * 2);
  public readonly circumference = computed(() => this.radius() * 2 * Math.PI);
  public readonly strokeDashOffset = signal(this.circumference());
  public readonly excessStrokeDashOffset = signal(this.circumference());

  public readonly transition = signal('none');

  public readonly strokeDashArray = computed(() => {
    const circumference = this.circumference();
    return `${circumference} ${circumference}`;
  });

  public readonly excessStrokeDashArray = computed(() => {
    const circumference = this.circumference();
    return `${circumference} ${circumference}`;
  });

  private animateCountUp(targetValue: number, duration: number = 2000): void {
    const startValue = this.count();
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const easeOutQuad = (t: number) => t * (2 - t);
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);

      const currentValue = Math.round(startValue + (targetValue - startValue) * easedProgress);
      this.count.set(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.count.set(targetValue);
      }
    };

    requestAnimationFrame(animate);
  }

  public ngOnInit() {
    this.transition.set('none');
    this.strokeDashOffset.set(this.circumference());
    this.excessStrokeDashOffset.set(this.circumference());
    this.showExcess.set(false);
  }

  #updateStrokeDashOffset = effect(() => {
    const percent = this.percent();
    const circumference = this.circumference();
    const durationMs = 800;

    setTimeout(() => {
      this.transition.set(`stroke-dashoffset ${durationMs}ms`);
      
      if (percent <= 100) {
        const offset = circumference - (percent / 100) * circumference;
        this.strokeDashOffset.set(offset);
        this.showExcess.set(false);
      } else {
        const offset = 0; // Full circle
        this.strokeDashOffset.set(offset);
        
        setTimeout(() => {
          this.showExcess.set(true);
          
          setTimeout(() => {
            const excessPercent = percent - 100;
            const excessOffset = circumference - (excessPercent / 100) * circumference;
            this.excessStrokeDashOffset.set(excessOffset);
          }, 50);
        }, durationMs / 2);
      }

      this.animateCountUp(this.value(), durationMs);
    }, 1000);
  });
}