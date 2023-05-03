import ***REMOVED*** platformBrowserDynamic ***REMOVED*** from '@angular/platform-browser-dynamic';
import ***REMOVED*** AppModule ***REMOVED*** from './app/app.module';

import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek)

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
