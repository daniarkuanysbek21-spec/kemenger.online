import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {

  apiKey:
  "AIzaSyADJAbETAdQNmwMLzWOZOpZ_6gSmHWVF-0",

  authDomain:
  "kemenger-online.firebaseapp.com",

  projectId:
  "kemenger-online",

  storageBucket:
  "kemenger-online.firebasestorage.app",

  messagingSenderId:
  "44270080959",

  appId:
  "1:44270080959:web:11378db65528a1a4e0470a",

  measurementId:
  "G-FMTYL770EJ"

};


const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


const ADMIN_EMAIL =
  "d.kuanyshbek11@mail.ru";


await setPersistence(
  auth,
  browserLocalPersistence
);


/* =========================
   БЕТТІ УАҚЫТША ЖАСЫРУ
========================= */

document.documentElement.style.visibility =
  "hidden";


/* =========================
   КҮТУ ЭКРАНЫ
========================= */

const loadingScreen =
  document.createElement("div");

loadingScreen.id =
  "kemenger-loading-screen";

loadingScreen.innerHTML = `
  <div style="
    text-align:center;
    font-family:Arial,sans-serif;
  ">
    <div style="
      font-size:22px;
      font-weight:bold;
      margin-bottom:14px;
    ">
      <img src="/favicon.png" style="width:55px;height:55px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:10px;"> KEMENGER ONLINE
    </div>

    <div style="
      font-size:17px;
    ">
      ⏳ Күте тұрыңыз...
    </div>
  </div>
`;

loadingScreen.style.cssText = `
  position:fixed;
  inset:0;
  z-index:999999;
  background:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#173b7a;
  visibility:visible;
`;

document.documentElement.appendChild(
  loadingScreen
);


function showPage() {

  document.documentElement.style.visibility =
    "visible";

  const screen =
    document.getElementById(
      "kemenger-loading-screen"
    );

  if (screen) {
    screen.remove();
  }

}


/* =========================
   ҚАЙ СЫНЫП ЕКЕНІН АНЫҚТАУ
========================= */

function getRequiredClass() {

  const path =
    window.location.pathname
    .toLowerCase();

  const fileName =
    path.split("/").pop();


  if (
    fileName === "5-synyp.html" ||
    fileName.startsWith("5.")
  ) {
    return "5";
  }


  if (
    fileName === "6-synyp.html" ||
    fileName.startsWith("6.")
  ) {
    return "6";
  }


  if (
    fileName === "7-synyp.html" ||
    fileName.startsWith("7.")
  ) {
    return "7";
  }


  if (
    fileName === "8-synyp.html" ||
    fileName.startsWith("8.")
  ) {
    return "8";
  }


  if (
    fileName === "9-synyp.html" ||
    fileName.startsWith("9.")
  ) {
    return "9";
  }


  if (
    fileName === "10-synyp.html" ||
    fileName.startsWith("10.")
  ) {
    return "10";
  }


  if (
    fileName === "11-synyp.html" ||
    fileName.startsWith("11.")
  ) {
    return "11";
  }


  return null;

}


/* =========================
   ҚОРҒАНЫС
========================= */

onAuthStateChanged(
  auth,
  async (user) => {

    /*
      АККАУНТҚА КІРМЕГЕН
    */

    if (!user) {

      window.location.replace(
        "/login.html"
      );

      return;

    }


    try {

      /*
        АДМИН БЕТІН ҚОРҒАУ
        ТЕК АДМИН КІРЕ АЛАДЫ
      */

      const path =
        window.location.pathname
        .toLowerCase();

      const fileName =
        path.split("/").pop();


      if (
        fileName === "admin.html"
      ) {

        if (
          user.email &&
          user.email.toLowerCase() ===
          ADMIN_EMAIL.toLowerCase()
        ) {

          showPage();

          return;

        }


        window.location.replace(
          "/index.html"
        );

        return;

      }


      /*
        АДМИНГЕ БАРЛЫҒЫ АШЫҚ
      */

      if (
        user.email &&
        user.email.toLowerCase() ===
        ADMIN_EMAIL.toLowerCase()
      ) {

        showPage();

        return;

      }


      /*
        FIRESTORE-ДАН
        ОҚУШЫНЫ ТАБУ
      */

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );


      const userSnap =
        await getDoc(userRef);


      if (!userSnap.exists()) {

        await signOut(auth);

        window.location.replace(
          "/login.html"
        );

        return;

      }


      const data =
        userSnap.data();


      /*
        БҰҒАТТАЛҒАН АККАУНТ
      */

      if (
        data.blocked === true
      ) {

        await signOut(auth);

        window.location.replace(
          "/login.html?blocked=1"
        );

        return;

      }


      const requiredClass =
        getRequiredClass();


      /*
        СЫНЫПҚА ҚАТЫСЫ ЖОҚ БЕТ
      */

      if (!requiredClass) {

        showPage();

        return;

      }


      /*
        СЕНІҢ ҚАЗІРГІ FIRESTORE
        ҚҰРЫЛЫМЫҢ:

        grade5
        grade6
        grade7
        ...
      */

      const accessField =
        "grade" + requiredClass;


      const hasAccess =
        data[accessField] === true;


      /*
        РҰҚСАТ БАР
      */

      if (hasAccess) {

        showPage();

        return;

      }


      /*
        РҰҚСАТ ЖОҚ
      */

      window.location.replace(
        "/index.html?access=denied"
      );

    }

    catch (error) {

      console.error(
        "Kemenger қорғау қатесі:",
        error
      );


      await signOut(auth);


      window.location.replace(
        "/login.html"
      );

    }

  }
);
