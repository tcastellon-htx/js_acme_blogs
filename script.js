const API_URL = "https://jsonplaceholder.typicode.com";

/* ========= Utilities ========= */

window.createElemWithText = function (tag = "p", text = "", className) {
  const el = document.createElement(tag);
  el.textContent = text ?? "";
  if (className) el.className = className;
  return el;
};

window.deleteChildElements = function (element) {
  if (!(element instanceof HTMLElement)) return;
  while (element.firstChild) element.removeChild(element.firstChild);
  return element;
};

/* ========= Select ========= */

window.createSelectOptions = function (users) {
  if (!users) return;
  return users.map(u => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = u.name;
    return opt;
  });
};

window.populateSelectMenu = function (users) {
  if (!users) return;
  const select = document.getElementById("selectMenu");
  const options = createSelectOptions(users);
  options.forEach(o => select.appendChild(o));
  return select;
};

/* ========= API ========= */

window.getUsers = async function () {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};

window.getUser = async function (id) {
  if (!id) return;
  const res = await fetch(`${API_URL}/users/${id}`);
  return res.json();
};

window.getUserPosts = async function (id) {
  if (!id) return;
  const res = await fetch(`${API_URL}/posts?userId=${id}`);
  return res.json();
};

window.getPostComments = async function (id) {
  if (!id) return;
  const res = await fetch(`${API_URL}/comments?postId=${id}`);
  return res.json();
};

/* ========= Comments ========= */

window.createComments = function (comments) {
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
};

window.displayComments = async function (postId) {
  if (!postId) return;
  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");
  const comments = await getPostComments(postId);
  section.append(createComments(comments));
  return section;
};

/* ========= Toggle ========= */

window.toggleCommentSection = function (postId) {
  if (!postId) return;
  const section = document.querySelector(`[data-post-id="${postId}"]`);
  if (!section) return null;
  section.classList.toggle("hide");
  return section;
};

window.toggleCommentButton = function (postId) {
  if (!postId) return;
  const btn = document.querySelector(`button[data-post-id="${postId}"]`);
  if (!btn) return null;
  btn.textContent =
    btn.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
  return btn;
};

window.toggleComments = function (e, postId) {
  if (!e || !postId) return;
  const id = parseInt(postId);
  return [toggleCommentSection(id), toggleCommentButton(id)];
};

/* ========= Posts ========= */

window.createPosts = function (posts) {
  if (!posts) return;
  const frag = document.createDocumentFragment();

  posts.forEach(p => {
    const article = document.createElement("article");
    const btn = document.createElement("button");
    btn.dataset.postId = p.id;
    btn.textContent = "Show Comments";

    const section = document.createElement("section");
    section.dataset.postId = p.id;
    section.classList.add("comments", "hide");

    article.append(
      createElemWithText("h2", p.title),
      createElemWithText("p", p.body),
      createElemWithText("p", `User ID: ${p.userId}`),
      createElemWithText("p", `Post ID: ${p.id}`),
      btn,
      section
    );

    frag.append(article);
  });

  return frag;
};

window.displayPosts = function (posts) {
  const main = document.querySelector("main");
  deleteChildElements(main);

  if (!posts || posts.length === 0) {
    main.append(createElemWithText("p", "Select a user", "default-text"));
    return;
  }

  const frag = createPosts(posts);
  main.append(frag);
  return frag;
};

/* ========= Buttons ========= */

window.addButtonListeners = function () {
  const buttons = document.querySelectorAll("main button");
  buttons.forEach(btn => {
    if (!btn.dataset.postId) return;
    btn.addEventListener("click", e => toggleComments(e, btn.dataset.postId));
  });
  return buttons;
};

window.removeButtonListeners = function () {
  const buttons = document.querySelectorAll("main button");
  buttons.forEach(b => b.replaceWith(b.cloneNode(true)));
  return buttons;
};

/* ========= Refresh ========= */

window.refreshPosts = function (posts) {
  if (!posts) return;
  return [displayPosts(posts), addButtonListeners()];
};

/* ========= Select ========= */

window.selectMenuChangeEventHandler = async function (e) {
  if (!e) return;
  const posts = await getUserPosts(e.target.value);
  const refresh = refreshPosts(posts);
  return [e.target.value, posts, refresh];
};

/* ========= Init ========= */

window.initPage = async function () {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
};

window.initApp = async function () {
  const init = await initPage();
  document
    .getElementById("selectMenu")
    .addEventListener("change", selectMenuChangeEventHandler);
  return init;
};

window.addEventListener("DOMContentLoaded", initApp);

