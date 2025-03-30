import { Component, computed, input } from '@angular/core';
import { PadStartPipe } from '@pipes/pad-start.pipe';

@Component({
  selector: 'app-progress-bar',
  imports: [PadStartPipe],
  template: `
    <div class="progress-container">
      <div class="progress-header">
        <span class="label">{{ label() }}</span>
        <div class="value">
          {{ current() | padStart: 2 }} / {{ goal() }}
          @if (isExceeded()) {
            @if (isDangerousExcess()) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="warning-icon"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="check-icon"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            }
            <span class="excess-text">({{ achievedPercentage() - 100 }}% over)</span>
          }
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-wrapper">
          <div
            class="goal-portion"
            [class]="isLow() ? 'danger-color' : null"
            [style.width.%]="goalPercentage()"
          >
            @if (goalPercentage() > 10) {
              <span class="percentage-text"
                >{{ achievedPercentage() >= 100 ? 100 : (goalPercentage() | padStart: 2) }}%</span
              >
            }
          </div>

          @if (isExceeded()) {
            <div
              class="excess-portion"
              [style.width.%]="excessPercentage()"
            >
              @if (excessPercentage() > 10) {
                <span class="percentage-text">{{ excessPercentage() }}%</span>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .progress-container {
        width: 100%;
        margin-bottom: 16px;
      }

      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .label,
      .value {
        font-size: 14px;
        font-weight: 500;
      }

      .value {
        display: flex;
        align-items: center;
        gap: 0.2rem;
      }

      .warning-icon,
      .check-icon {
        margin-left: 4px;
        height: 16px;
        width: 16px;
        vertical-align: middle;
      }

      .warning-icon {
        color: #ef4444;
      }

      .check-icon {
        color: #10b981;
      }

      .excess-text {
        margin-left: 4px;
        color: #ef4444;
      }

      .progress-bar-container {
        height: 18px;
        width: 100%;
        background-color: var(--light-bg);
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }

      .progress-bar-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        overflow: hidden;
      }

      .goal-portion {
        height: 100%;
        background-color: #27bb65;
        transition: width 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .excess-portion {
        height: 100%;
        background-color: #ef4444;
        transition: width 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .percentage-text {
        font-size: 12px;
        font-weight: 500;
        color: white;
        padding: 0 8px;
      }

      .legend {
        display: flex;
        gap: 16px;
        padding-top: 4px;
        font-size: 12px;
      }

      .legend-item {
        display: flex;
        align-items: center;
      }

      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 9999px;
        margin-right: 4px;
      }

      .goal-color {
        background-color: #1f2937;
      }

      .danger-color {
        background-color: #ef4444;
      }

      .achievement-text {
        font-size: 12px;
        text-align: center;
        margin-top: 8px;
      }

      :host-context(.dark) .progress-bar-container {
        background-color: #374151;
      }

      :host-context(.dark) .goal-portion {
        background-color: #e5e7eb;
      }

      :host-context(.dark) .goal-portion .percentage-text {
        color: #1f2937;
      }

      :host-context(.dark) .excess-portion {
        background-color: #dc2626;
      }

      :host-context(.dark) .goal-color {
        background-color: #e5e7eb;
      }

      :host-context(.dark) .excess-color {
        background-color: #dc2626;
      }

      :host-context(.dark) .excess-text {
        color: #f87171;
      }

      :host-context(.dark) .warning-icon {
        color: #f87171;
      }

      :host-context(.dark) .check-icon {
        color: #34d399;
      }
    `,
  ],
})
export class ProgressBarComponent {
  public readonly current = input.required<number>();
  public readonly goal = input.required<number>();
  public readonly label = input<string>('Value');

  public readonly isExceeded = computed(() => this.current() > this.goal());

  public readonly goalPercentage = computed(() => {
    if (this.isExceeded()) {
      return 200 - Math.round((this.current() * 100) / this.goal());
    } else {
      return this.achievedPercentage();
    }
  });

  public readonly excessPercentage = computed(() => (this.isExceeded() ? 100 - this.goalPercentage() : 0));

  public readonly achievedPercentage = computed(() => Math.round((this.current() / this.goal()) * 100));

  public readonly isDangerousExcess = computed(() => this.achievedPercentage() >= 120);
  public readonly isLow = computed(() => this.achievedPercentage() <= 70);
}
