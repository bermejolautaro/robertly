import ***REMOVED*** platformBrowserDynamic ***REMOVED*** from '@angular/platform-browser-dynamic';
import ***REMOVED*** AppModule ***REMOVED*** from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
