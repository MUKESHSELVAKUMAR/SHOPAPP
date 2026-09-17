import { LogLevel, Configuration } from '@azure/msal-browser';
 
export const msalConfig: Configuration = {
  auth: {
    clientId: '5f4e8beb-3a9d-4a31-8dd3-ffa432445c02',
    authority: 'https://login.microsoftonline.com/5686a807-cc23-4a34-886b-a3004819d8ab',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage'
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        // console.log(message);
      },
      logLevel: LogLevel.Info,
    },
  },
};
 
export const loginRequest = {
  scopes: ['User.Read'],
};