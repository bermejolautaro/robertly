import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { ExerciseLogService } from '@services/exercise-log.service';
import { Paths } from 'src/main';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLinkWithHref, RouterLinkActive]
})
export class FooterComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  public readonly Paths = Paths;
}
