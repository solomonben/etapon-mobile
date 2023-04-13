export const environment = {
  production: true,
  API_LINK: "https://etapon-api.onrender.com/",
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
