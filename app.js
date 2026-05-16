const storageKey = "paras-gupta-blog-posts";
const postsEl = document.querySelector("#posts");
const form = document.querySelector("#blogForm");
const exportButton = document.querySelector("#exportPosts");
const importInput = document.querySelector("#importPosts");
const pdfInput = document.querySelector("#postPdf");
const fallbackPosts = [
  {
    id: "schema-evolution",
    title: "Handling schema evolution in ingestion pipelines",
    topic: "Lakehouse",
    date: "2026-05-17",
    body:
      "While building metadata-driven ingestion, I learned to treat schema change as a normal operating condition. A practical pattern is to capture source metadata, validate drift before transformation, and keep raw payloads available so downstream fixes do not require a full source replay."
  },
  {
    id: "spark-cost",
    title: "Small Spark tuning habits that reduce cost",
    topic: "PySpark",
    date: "2026-05-17",
    body:
      "Partition pruning, join strategy, cached intermediate frames, and Delta table layout can change both runtime and cloud cost. The biggest lesson: measure each optimization with the job context, because the same change can help one pipeline and hurt another."
  }
];
let publicPosts = [];

function loadPosts() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return publicPosts;

  try {
    const posts = JSON.parse(saved);
    return Array.isArray(posts) ? posts : publicPosts;
  } catch {
    return publicPosts;
  }
}

function savePosts(posts) {
  localStorage.setItem(storageKey, JSON.stringify(posts));
}

function readPdfAttachment(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve({
        name: file.name,
        type: file.type || "application/pdf",
        dataUrl: reader.result
      });
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    };
    return map[character];
  });
}

function renderPosts() {
  const posts = loadPosts();
  if (!posts.length) {
    postsEl.innerHTML = '<article class="post"><h3>No posts yet</h3><p>Add a learning note with the editor.</p></article>';
    return;
  }

  postsEl.innerHTML = posts
    .map(
      (post) => `
        <article class="post">
          <div class="post-meta">
            <span>${escapeHtml(post.topic || "Learning")}</span>
            <time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time>
          </div>
          <h3>${escapeHtml(post.title)}</h3>
          <p class="post-body">${escapeHtml(post.body)}</p>
          ${renderAttachment(post)}
          <button class="delete-post" type="button" data-id="${escapeHtml(post.id)}">Delete</button>
        </article>
      `
    )
    .join("");
}

function renderAttachment(post) {
  const attachment = post.attachment;
  if (!attachment) return "";

  const href = attachment.dataUrl || attachment.url;
  if (!href) return "";

  return `
    <a class="post-attachment" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">
      PDF: ${escapeHtml(attachment.name || "Explanation notes")}
    </a>
  `;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.querySelector("#postTitle").value.trim();
  const topic = document.querySelector("#postTopic").value.trim();
  const body = document.querySelector("#postBody").value.trim();
  const attachment = await readPdfAttachment(pdfInput.files[0]);

  if (!title || !body) return;

  const posts = loadPosts();
  posts.unshift({
    id: `${Date.now()}`,
    title,
    topic,
    body,
    attachment,
    date: new Date().toISOString().slice(0, 10)
  });
  savePosts(posts);
  form.reset();
  renderPosts();
});

postsEl.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-post");
  if (!button) return;

  const posts = loadPosts().filter((post) => post.id !== button.dataset.id);
  savePosts(posts);
  renderPosts();
});

exportButton.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(loadPosts(), null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "paras-gupta-blog-posts.json";
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  const text = await file.text();
  const posts = JSON.parse(text);
  if (!Array.isArray(posts)) return;

  savePosts(posts);
  renderPosts();
  importInput.value = "";
});

async function initPosts() {
  try {
    const response = await fetch("./posts.json");
    publicPosts = await response.json();
  } catch {
    publicPosts = fallbackPosts;
  }
  renderPosts();
}

initPosts();
