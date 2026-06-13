import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { App } from './app/app';
import { routes } from './app/app.routes';

registerLocaleData(localePt, 'pt-BR');

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
  ],
}).catch((err) => console.error(err));