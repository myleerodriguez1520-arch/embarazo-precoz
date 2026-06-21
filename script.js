import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  increment,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiWqVUHxqqIMbL1kHlk7i84R4GTM6Dsg8",
  authDomain: "embarazo-precoz-dbc7b.firebaseapp.com",
  projectId: "embarazo-precoz-dbc7b",
  storageBucket: "embarazo-precoz-dbc7b.firebasestorage.app",
  messagingSenderId: "986445624216",
  appId: "1:986445624216:web:1d2e5ad66cd0ddc6ed71ed",
  measurementId: "G-E2LFSQYCTC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const visitCountElement = document.getElementById("visitCount");
const commentForm = document.getElementById("commentForm");
const commentsList = document.getElementById("commentsList");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const commentsRef = collection(db, "comments");
const visitsRef = doc(db, "stats", "visits");

async function updateGlobalVisits() {
  try {
    const sessionKey = "firebase_visit_registered";

    if (!sessionStorage.getItem(sessionKey)) {
      await setDoc(visitsRef, { total: increment(1) }, { merge: true });
      sessionStorage.setItem(sessionKey, "true");
    }

    const visitSnap = await getDoc(visitsRef);
    const totalVisits = visitSnap.exists() ? visitSnap.data().total || 0 : 0;
    visitCountElement.textContent = totalVisits;
  } catch (error) {
    console.error("Error al actualizar visitas:", error);
    visitCountElement.textContent = "—";
  }
}

function listenToComments() {
  const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));

  onSnapshot(commentsQuery, (snapshot) => {
    commentsList.innerHTML = "";

    if (snapshot.empty) {
      commentsList.innerHTML = '<p class="muted">Aún no hay comentarios publicados.</p>';
      return;
    }

    snapshot.forEach((document) => {
      const comment = document.data();

      const item = document.createElement("div");
      item.className = "comment-item";

      const meta = document.createElement("div");
      meta.className = "comment-meta";

      const name = document.createElement("span");
      name.className = "comment-name";
      name.textContent = comment.name || "Anónimo";

      const date = document.createElement("span");
      const createdAt = comment.createdAt?.toDate?.();
      date.textContent = createdAt
        ? createdAt.toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })
        : "Ahora";

      const message = document.createElement("p");
      message.textContent = comment.message || "";

      meta.appendChild(name);
      meta.appendChild(date);
      item.appendChild(meta);
      item.appendChild(message);
      commentsList.appendChild(item);
    });
  }, (error) => {
    console.error("Error al leer comentarios:", error);
    commentsList.innerHTML = '<p class="muted">No se pudieron cargar los comentarios. Revisa las reglas de Firestore.</p>';
  });
}

commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !message) return;

  try {
    await addDoc(commentsRef, {
      name,
      message,
      createdAt: serverTimestamp()
    });

    commentForm.reset();
  } catch (error) {
    console.error("Error al publicar comentario:", error);
    alert("No se pudo publicar el comentario. Revisa la configuración de Firebase.");
  }
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("active"));
});

updateGlobalVisits();
listenToComments();
