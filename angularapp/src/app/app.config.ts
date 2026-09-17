import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { AppModule } from './app.module';
import { MsalModule, MsalInterceptorConfiguration, MsalGuardConfiguration, MsalInterceptor } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './auth.config';

export function msalInterceptorConfig(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // Local development
  protectedResourceMap.set(
    'http://localhost:5122/api/Shop',
    ['api://5f4e8beb-3a9d-4a31-8dd3-ffa432445c02/access_as_user']
  );
 
  // Deployed App Service
  protectedResourceMap.set(
    'https://testapps-cahabehzbfdrbefv.centralus-01.azurewebsites.net/api/Shop',
    ['api://5f4e8beb-3a9d-4a31-8dd3-ffa432445c02/access_as_user']
  );
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['User.Read']);
 
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

 
function msalGuardConfig(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest,
  };
}
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(AppModule),
    importProvidersFrom(
      MsalModule.forRoot(
        new PublicClientApplication(msalConfig),
        msalGuardConfig(),
        msalInterceptorConfig()
      )
    ),
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
  ],
};