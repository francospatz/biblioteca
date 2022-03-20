import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, updateDoc, doc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

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

// Traer la lista de libros seleccionada por el usuario
async function list() {
    try {
      let selected = JSON.parse(sessionStorage.getItem("selected"));
      let response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${selected}.json?api-key=Z7VCxOGX5NT3CYU2zPpoMQczCaROIWmi`);
      let data = await response.json();
      let books = data.results.books;

      for (let i = 0; i < books.length; i++) {
        let article = document.createElement("article");
        article.className = "article";
        document.querySelector(".main__record").appendChild(article);
        
        let title = document.createElement("p");
        let author = document.createElement("p");
        let img = document.createElement("img");
        let weeks = document.createElement("p");
        let desc = document.createElement("p");
        let content = document.createElement("div");
        let link = document.createElement("a");
        let btn1 = document.createElement("button");
        let btn2 = document.createElement("button");
        
        title.className = "title";
        author.className = "author";
        img.className = "img";
        weeks.className = "weeks";
        desc.className = "desc";
        content.className = "content";
        btn1.className = "btn1";
        btn1.type = "click";
        btn2.className = "btn2";
        btn2.type = "click";
        link.href = `${books[i].amazon_product_url}`;
        link.target = "_blank";
        
        article.appendChild(title);
        article.appendChild(author);
        article.appendChild(img);
        article.appendChild(weeks);
        article.appendChild(desc);
        article.appendChild(content);
        content.appendChild(link);
        
        link.appendChild(btn1);
        content.appendChild(btn2);
        
        title.innerHTML = `#${books[i].rank} ${books[i].title}`;
        author.innerHTML = `Written by: ${books[i].author}`;
        img.src = `${books[i].book_image}`;
        weeks.innerHTML = `Weeks on list: ${books[i].weeks_on_list}`;
        desc.innerHTML = `${books[i].description}`;
        btn1.innerHTML = "Amazon";
        btn2.innerHTML = "Fav"

      }

      // Se le da función al botón de favorito según si está logeado o no el usuario
      let favs = document.querySelectorAll(".btn2");
      const user = auth.currentUser;
      if (user != null) {
        favs.forEach((fav, i) => {
            fav.addEventListener("click", async () => {
                await updateDoc(doc(db, "users", user.uid), {
                    // En caso de que no esté todavía dicho libro en el firestore, se le hace push al array "favorites" adjudicado al usuario
                    favorites: arrayUnion({
                        title: `${books[i].title}`,
                        author: `Written by: ${books[i].author}`,
                        img: `${books[i].book_image}`,
                        weeks: `Weeks on list: ${books[i].weeks_on_list}`,
                        desc: `${books[i].description}`,
                        link: `${books[i].amazon_product_url}`
                    })
                });
            });
        });
      } else {
        favs.forEach((fav, i) => {
            fav.addEventListener("click",  () => {
                alert("You must be logged in to save books in your favorites page")
            });
        });
      }
      
        
      
    } catch (err) {
      console.log(err);
    }
  }

  list();

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        const logoutBtn = document.querySelector(".btnContainer");
        logoutBtn.style.visibility = "visible";
        
    } else {
        const logoutBtn = document.querySelector(".btnContainer");
        logoutBtn.style.visibility = "hidden";

    }
});