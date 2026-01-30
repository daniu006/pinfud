// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyC0uoGXLmk8DMOzlWwNPXPBgUjuJpN7Jy0",
    authDomain: "pintfud.firebaseapp.com",
    projectId: "pintfud",
    storageBucket: "pintfud.firebasestorage.app",
    messagingSenderId: "613093766310",
    appId: "1:613093766310:web:b90ac3b137fd317cc3f067",
    measurementId: "G-RN7684R07K"
  },
  cloudinary: {
    cloudName: 'dgkwimlbm',
    uploadPreset: 'pinfud_upload'
  },
  geminiApiKey: "TU_API_KEY_AQUI",
  groqApiKey: "TU_API_KEY_AQUI"
};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
