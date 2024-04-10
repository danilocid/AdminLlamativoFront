// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //urlBackend: 'http://127.0.0.1:5001/llamativo-admin/us-central1/',
  urlBackend: 'https://us-central1-llamativo-admin.cloudfunctions.net/',
  urlBackendHeroku:
    'https://llamativo-admin-backend-6b023e3c403e.herokuapp.com/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
