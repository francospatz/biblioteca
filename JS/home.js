// https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=Z7VCxOGX5NT3CYU2zPpoMQczCaROIWmi

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

window.onload = function (){
    const loader = document.querySelector(".loader");
    setTimeout(() => {
        loader.parentElement.removeChild(loader);
    }, 1000)
}
// Traer libros de la API
async function allBooks () {
    try {
        let response = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=Z7VCxOGX5NT3CYU2zPpoMQczCaROIWmi");
        let data = await response.json();
        let results = data.results;
        for (let i = 0; i < results.length; i++) {
            let article = document.createElement("article");
            article.className = "article";
            document.querySelector(".main__articles").appendChild(article);

            let title = document.createElement("p");
            let encode = document.createElement("p");
            let oldest = document.createElement("p");
            let newest = document.createElement("p");
            let updated = document.createElement("p");
            let link = document.createElement("a");
            let button = document.createElement("button");

            title.className = "section__title";
            encode.className = "section__encode";
            oldest.className = "section__oldest";
            newest.className = "section__newest";
            updated.className = "section__update";
            button.className = "section__button";
            button.type = "click";

            article.appendChild(encode);
            article.appendChild(title);
            article.appendChild(oldest);
            article.appendChild(newest);
            article.appendChild(updated);
            article.appendChild(link);
            link.appendChild(button);

            encode.innerHTML = results[i].list_name_encoded;
            title.innerHTML = `${results[i].list_name.toUpperCase()}`;
            oldest.innerHTML = `Oldest: ${results[i].oldest_published_date}`;
            newest.innerHTML = `Newest: ${results[i].newest_published_date}`;
            updated.innerHTML = `Updated: ${results[i].updated.toLowerCase()}`;
            button.innerHTML = "More";
        }

        let allArticles = document.querySelectorAll(".article");

        function storage (e) {
            let sName = this.firstChild.innerHTML;
            let sLink = this.lastChild;
            sessionStorage.setItem("selected", JSON.stringify(sName));
            sLink.href = "./record.html";
        }

        allArticles.forEach(button => {
            button.addEventListener("click", storage);
        });

    } catch (err) {
        console.log(err);
    }
}

allBooks();

async function logout() {
    signOut(auth).then(() => {
        window.location.href = "/index.html";
    }).catch((error) => {
        console.log(error)
    });
}

const googleLogout = document.getElementById("googleLogout");

if (googleLogout != null) {
    googleLogout.addEventListener("click", async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    });
}

// Qué botones se enseñan según si se está logeado o no
onAuthStateChanged(auth, (user) => {
    if (user) {
        const logoutBtn = document.querySelector(".btnContainer");
        const backBtn = document.querySelector("#backBtn");
        logoutBtn.style.visibility = "visible";
        backBtn.style.visibility = "hidden";
    } else {
        const logoutBtn = document.querySelector(".btnContainer");
        const backBtn = document.querySelector("#backBtn");
        logoutBtn.style.visibility = "hidden";
        backBtn.style.visibility = "visible";
    }
});