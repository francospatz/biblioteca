import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import {
    getFirestore,
    collection,
    setDoc,
    getDoc,
    updateDoc,
    doc,
    arrayRemove,
    FieldValue
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        getFavs(user);
    } else {
    console.log("No user logged");

    }
});

// Trae de firestore los libros almacenados en Favorites
async function getFavs (user) {
    try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);
        const favoritesArray = docSnap.data().favorites;
        console.log(favoritesArray);

        if (favoritesArray.length == 0) {
            let message = document.createElement("p");
            message.className = "message";
            message.innerHTML = "A list of favorites will appear once you choose at least one fav";
            document.querySelector(".main__fav").appendChild(message);
        } else {
            let books = favoritesArray;
            for (let i = 0; i < books.length; i++) {
                let article = document.createElement("article");
                article.className = "article";
                document.querySelector(".main__fav").appendChild(article);
                
                let title = document.createElement("p");
                let author = document.createElement("p");
                let img = document.createElement("img");
                let desc = document.createElement("p");
                let content = document.createElement("div");
                let link = document.createElement("a");
                let btn1 = document.createElement("button");
                let btn2 = document.createElement("button");
                
                title.className = "title";
                author.className = "author";
                img.className = "img";
                desc.className = "description";
                content.className = "content";
                link.href = `${books[i].link}`;
                link.target = "_blank";
                btn1.className = "delete";
                btn1.type = "click";
                btn2.className = "btn2";
                btn2.type = "click";
                
                article.appendChild(title);
                article.appendChild(author);
                article.appendChild(img);
                article.appendChild(desc);
                article.appendChild(content);
                content.appendChild(btn1)
                content.appendChild(link);
                link.appendChild(btn2);

                title.innerHTML = `${books[i].title}`;
                author.innerHTML = `Written by: ${books[i].author}`;
                img.src = `${books[i].img}`;
                desc.innerHTML = `${books[i].desc}`;
                btn1.innerHTML = "Delete fav";
                btn2.innerHTML = "Amazon"
            }

            let deletes = document.querySelectorAll(".delete");
            deletes.forEach((btn, i) => {
                btn.addEventListener("click", async () => {
                    favoritesArray.splice(i, 1);
                    await setDoc(doc(db, "users", user.uid), {
                        favorites: favoritesArray
                    })
                    
                    location.reload();
                })
            })

        }
    } catch (err) {
        console.log(err);
    }
}


async function logout() {
    signOut(auth).then(() => {
        window.location.href = "../index.html";
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
