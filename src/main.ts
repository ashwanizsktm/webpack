import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '../src/app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(err));

//  this will be added while adding environment varaibles.
// if (environment.production) {
//     enableProdMode();
//     window.console.log = function() {};
// }