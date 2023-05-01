import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
