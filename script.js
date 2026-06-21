const visitKey = "embarazo_precoz_visit_count";
const commentKey = "embarazo_precoz_comments";

const visitCountElement = document.getElementById("visitCount");
const commentForm = document.getElementById("commentForm");
const commentsList = document.getElementById("commentsList");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function updateVisits() {
  const currentVisits = Number(localStorage.getItem(visitKey) || 0) + 1;
  localStorage.setItem(visitKey, currentVisits);
  visitCountElement.textContent = currentVisits;
}

function getComments() {
  return JSON.parse(localStorage.getItem(commentKey) || "[]");
}

function saveComments(comments) {
  localStorage.setItem(commentKey, JSON.stringify(comments));
}

function renderComments() {
  const comments = getComments();
  commentsList.innerHTML = "";

  if (comments.length === 0) {
    commentsList.innerHTML = '<p class="muted">Aún no hay comentarios publicados.</p>';
    return;
  }

  comments.slice().reverse().forEach((comment) => {
    const item = document.createElement("div");
    item.className = "comment-item";

    const meta = document.createElement("div");
    meta.className = "comment-meta";

    const name = document.createElement("span");
    name.className = "comment-name";
    name.textContent = comment.name;

    const date = document.createElement("span");
    date.textContent = comment.date;

    const message = document.createElement("p");
    message.textContent = comment.message;

    meta.appendChild(name);
    meta.appendChild(date);
    item.appendChild(meta);
    item.appendChild(message);
    commentsList.appendChild(item);
  });
}

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !message) return;

  const comments = getComments();
  comments.push({
    name,
    message,
    date: new Date().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  });

  saveComments(comments);
  commentForm.reset();
  renderComments();
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("active"));
});

updateVisits();
renderComments();
