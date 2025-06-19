// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  configFile: 'assets/constants/bankconfig.json',
  url:'assets/lbrstatus.json',
  relUrl:'assets/relStatus.json',
  menuUrl:'assets/constants/menuConfig.json',
  subsidyUrl:'assets/constants/subsidyType.json',
  ardbUrl:'assets/constants/ardb_db.json',
  transUrl:'assets/constants/bengali.json',
  numUrl:'assets/constants/bengNum.json',
  ardbBanglaUrl:'assets/constants/ardb_bangla.json',
  ardbBanglaOverdueUrl:'assets/constants/bengaliOverdue.json'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
