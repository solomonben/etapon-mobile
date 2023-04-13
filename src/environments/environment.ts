// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_LINK: "https://etapon-api.onrender.com/",
  // API_LINK: "http://localhost:3000/",
  // SOCKET_LINK : "http://localhost:4000/",
  SOCKET_LINK : "https://elabay-socket-server.onrender.com/",
  barangay_list: [ "Acmac", "Bagong Silang", "Del Carmen", "Hinaplanon", "Luinab",
  "Mahayahay", "Palao", "Poblacion", "San Miguel", "San Roque", "Sta. Elena",
  "Santiago", "Sto. Rosario", "Saray", "Suarez", "Tambacan", "Tibanga", "Tipanoy",
  "Tominobo",  "Tubod", "Ubaldo Laya", "Villa Verde" ],
  prices: {
    price_60: ["Acmac", "Suarez", "Tominobo"],
    price_40: ["San Roque", "Sta. Elena", "Tipanoy", "Tubod"],
    price_30:["Bagong Silang", "Del Carmen","Hinaplanon", "Luinab", "Mahayahay", 
    "Palao" ,"Poblacion","San Miguel", "Santiago","Sto. Rosario","Saray", "Tambacan",
    "Tibanga", "Ubaldo Laya","Villa Verde"],

  },
  refresh_interval: 60000,
  message_refresh: 1000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
