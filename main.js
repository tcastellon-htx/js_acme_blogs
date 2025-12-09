const API_URL = "https://jsonplaceholder.typicode.com";

/* ========= 1. createElemWithText ========= */
function createElemWithText(tag = "p", text = "", className) {
  const el = document.createElement(tag);
  el.textContent = text ?? "";
  if (className) el.className = className;
  return el;
}

/* ========= 2. createSelectOptions ========= */
function createSelectOptions(users) {
  if (!users) return;
  return users.map(u => {
    const option = document.createElement("option");
    option.value = u.id;
    option.textContent = u.name;
    return option;
  });
}

/* ========= 3. toggleCommentSection ========= */
function toggleCommentSection(postId) {
  if (!postId) return;
  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  if (!section) return null;
  section.classList.toggle("hide");
  return section;
}

/* ========= 4. toggleCommentButton ========= */
function toggleCommentButton(postId) {
  if (!postId) return;
  const btn = document.querySelector(`button[data-post-id="${postId}"]`);
  if (!btn) return null;
  btn.textContent = btn.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
  return btn;
}

/* ========= 5. deleteChildElements ========= */
function deleteChildElements(parentElement) {
  if (!parentElement) return null;
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

/* ========= 6. addButtonListeners ========= */
function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  buttons.forEach(btn => {
    const postId = btn.dataset.postId;
    if (postId) {
      btn.addEventListener("click", (e) => toggleComments(e, postId));
    }
  });
  return buttons;
}

/* ========= 7. removeButtonListeners ========= */
function removeButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  buttons.forEach(btn => {
    const clone = btn.cloneNode(true);
    btn.replaceWith(clone);
  });
  return buttons;
}

/* ========= 8. createComments ========= */
function createComments(comments) {
  if (!comments) return;
  const frag = document.createDocumentFragment();
  comments.forEach(c => {
    const article = document.createElement("article");
    article.append(
      createElemWithText("h3", c.name),
      createElemWithText("p", c.body),
      createElemWithText("p", `From: ${c.email}`)
    );
    frag.append(article);
  });
  return frag;
}

/* ========= 9. populateSelectMenu ========= */
function populateSelectMenu(users) {
  if (!users) return;
  const select = document.getElementById("selectMenu");
  const options = createSelectOptions(users);
  options.forEach(o => select.appendChild(o));
  return select;
}

/* ========= 10. getUsers ========= */
async function getUsers() {
  try {
    const res = await fetch(`${API_URL}/users`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

/* ========= 11. getUserPosts ========= */
async function getUserPosts(userId) {
  if (!userId) return;
  try {
    const res = await fetch(`${API_URL}/posts?userId=${userId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

/* ========= 12. getUser ========= */
async function getUser(userId) {
  if (!userId) return;
  try {
    const res = await fetch(`${API_URL}/users/${userId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

/* ========= 13. getPostComments ========= */
async function getPostComments(postId) {
  if (!postId) return;
  try {
    const res = await fetch(`${API_URL}/comments?postId=${postId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

/* ========= 14. displayComments ========= */
async function displayComments(postId) {
  if (!postId) return;
  const section = document.createElement("section");
  section.dataset.post
