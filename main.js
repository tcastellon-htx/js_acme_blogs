/* main.js */

// 1. createElemWithText
function createElemWithText(tagName = "p", textContent = "", className) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  if (className) element.className = className;
  return element;
}

// 2. createSelectOptions
function createSelectOptions(users) {
  if (!users) return undefined;
  const options = [];
  for (let user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  }
  return options;
}

// 3. toggleCommentSection
function toggleCommentSection(postId) {
  if (!postId) return undefined;
  const section = document.querySelector(`section[data-post-id='${postId}']`);
  if (!section) return null;
  section.classList.toggle("hide");
  return section;
}

// 4. toggleCommentButton
function toggleCommentButton(postId) {
  if (!postId) return undefined;
  const button = document.querySelector(`button[data-post-id='${postId}']`);
  if (!button) return null;
  button.textContent = button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
  return button;
}

// 5. deleteChildElements
function deleteChildElements(parentElement) {
  if (!(parentElement instanceof HTMLElement)) return undefined;
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

// 6. addButtonListeners
function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  buttons.forEach((btn) => {
    const postId = btn.dataset.postId;
    if (postId) btn.addEventListener("click", (e) => toggleComments(e, postId));
  });
  return buttons;
}

// 7. removeButtonListeners
function removeButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  buttons.forEach((btn) => {
    const postId = btn.dataset.postId;
    if (postId) btn.removeEventListener("click", (e) => toggleComments(e, postId));
  });
  return buttons;
}

// 8. createComments
function createComments(comments) {
  if (!comments) return undefined;
  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const article = document.createElement("article");
    const h3 = createElemWithText("h3", comment.name);
    const pBody = createElemWithText("p", comment.body);
    const pEmail = createElemWithText("p", `From: ${comment.email}`);
    article.append(h3, pBody, pEmail);
    fragment.appendChild(article);
  });
  return fragment;
}

// 9. populateSelectMenu
function populateSelectMenu(users) {
  if (!users) return undefined;
  const selectMenu = document.getElementById("selectMenu");
  const options = createSelectOptions(users);
  options.forEach((opt) => selectMenu.appendChild(opt));
  return selectMenu;
}

// 10. getUsers
async function getUsers() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 11. getUserPosts
async function getUserPosts(userId) {
  if (!userId) return undefined;
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 12. getUser
async function getUser(userId) {
  if (!userId) return undefined;
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return {};
  }
}

// 13. getPostComments
async function getPostComments(postId) {
  if (!postId) return undefined;
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 14. displayComments
async function displayComments(postId) {
  if (!postId) return undefined;
  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  section.appendChild(fragment);
  return section;
}

// 15. createPosts
async function createPosts(posts) {
  if (!posts) return undefined;
  const fragment = document.createDocumentFragment();
  for (let post of posts) {
    const article = document.createElement("article");
    const h2 = createElemWithText("h2", post.title);
    const pBody = createElemWithText("p", post.body);
    const pId = createElemWithText("p", `Post ID: ${post.id}`);
    const author = await getUser(post.userId);
    const pAuthor = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
    const pCatch = createElemWithText("p", author.company.catchPhrase);
    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = post.id;
    const section = await displayComments(post.id);
    article.append(h2, pBody, pId, pAuthor, pCatch, button, section);
    fragment.appendChild(article);
  }
  return fragment;
}

// 16. displayPosts
async function displayPosts(posts) {
  const main = document.querySelector("main");
  let element;
  if (posts && posts.length > 0) {
    element = await createPosts(posts);
  } else {
    element = createElemWithText("p", "", "default-text");
  }
  main.appendChild(element);
  return element;
}

// 17. toggleComments
function toggleComments(event, postId) {
  if (!event || !postId) return undefined;
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
}

// 18. refreshPosts
async function refreshPosts(posts) {
  if (!posts) return undefined;
  const removeButtons = removeButtonListeners();
  const main = deleteChildElements(document.querySelector("main"));
  const fragment = await displayPosts(posts);
  const addButtons = addButtonListeners();
  return [removeButtons, main, fragment, addButtons];
}

// 19. selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
  if (!event) return undefined;
  const selectMenu = event.target;
  selectMenu.disabled = true;
  const userId = event.target.value || 1;
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);
  selectMenu.disabled = false;
  return [userId, posts, refreshPostsArray];
}

// 20. initPage
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
}

// 21. initApp
function initApp() {
  initPage();
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

// Call initApp after DOM loads
document.addEventListener("DOMContentLoaded", initApp);

