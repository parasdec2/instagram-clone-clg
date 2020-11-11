import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBa9HnVapEdcIS9x5WiGJwCh6wan5m_s9o",
  authDomain: "instagram-clone-pg.firebaseapp.com",
  databaseURL: "https://instagram-clone-pg.firebaseio.com",
  projectId: "instagram-clone-pg",
  storageBucket: "instagram-clone-pg.appspot.com",
  messagingSenderId: "716858796913",
  appId: "1:716858796913:web:821dd1780f8c9f54a9a4d0",
  measurementId: "G-FPWSPZJ2MZ",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
