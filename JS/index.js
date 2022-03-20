import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBYxIlS1JuB4RhlrCZSGJ1PPD9arXxxt3g",
    authDomain: "library-9c21f.firebaseapp.com",
    projectId: "library-9c21f",
    storageBucket: "library-9c21f.appspot.com",
    messagingSenderId: "383281372355",
    appId: "1:383281372355:web:f71c9d53674ef7766e1676"
};

// Iniciar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore();


// *****************************************************************************************************************************
async function login() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            //console.log(user);
            createUserFS(user);
            

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            console.log(errorCode);
        });
    await setPersistence(auth, browserLocalPersistence);

}
// Crea usuario en firestore
let everyUser = [];
async function createUserFS(user) {
    const docData = {
        displayName: user.displayName,
        email: user.email,
        favorites: [],
    }

    const allUsers = await getDocs(collection(db, "users"));
    allUsers.forEach((u) => {
        everyUser.push(u.id);
    })
    console.log(everyUser);
    //console.log(allUsers);
    if (everyUser.includes(user.uid) == false) {
        await setDoc(doc(db, "users", user.uid), docData);
    }
    window.location.href = "./pages/home.html";
}

const googleLogin = document.getElementById("googleLogin");

googleLogin.addEventListener("click", async () => {
    try {
        await login();
    } catch (error) {
        console.log(error);
    }
});