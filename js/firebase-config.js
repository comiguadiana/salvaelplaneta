// Configuración de Firebase (reemplaza con tus datos)
  const firebaseConfig = {
    apiKey: "AIzaSyBsqHd-CyzbksSUlXwU3pv2VfahTY0lY1Y",
    authDomain: "salvaelplaneta-344c3.firebaseapp.com",
    databaseURL: "https://salvaelplaneta-344c3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "salvaelplaneta-344c3",
    storageBucket: "salvaelplaneta-344c3.firebasestorage.app",
    messagingSenderId: "261169636264",
    appId: "1:261169636264:web:e612e6328054e66b74739d"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();