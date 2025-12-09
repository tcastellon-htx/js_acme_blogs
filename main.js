/* MAIN.JS - All functions for Acme Blogs Project */

/*************** 1. createElemWithText ***************/
function createElemWithText(tagName = "p", textContent = "", className) {
    const element = document.createElement(tagName);
    element.textContent = textContent;
    if (className) element.className = className;
    return element;
}

/*************** 2. createSelectOptions ***************/
function createSelectOptions(users) {
    if (!users) return;
    return users.map(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

/*************** 3. toggleCommentSection ***************/
function toggleCommentSection(postId) {
    if (!postId) return;
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (!section) return null;
    section.classList.toggle("hide");
    return section;
}

/*************** 4. toggleCommentButton ***************/
function toggleCommentButton(postId) {
    if (!postId) return;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (!button) return null;
    button.textContent = button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
    return button;
}

/*************** 5. deleteChildElements ***************/
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

/*************** 6. addButtonListeners ***************/
function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (!postId) return;
        button.addEventListener("click", (event) => toggleComments(event, postId));
    });
    return buttons;
}

/*************** 7. removeButtonListeners ***************/
function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (!postId) return;
        button.removeEventListener("click", (event) => toggleComments(event, postId));
    });
    return buttons;
}

/*************** 8. createComments ***************/
function createComments(comments) {
    if (!comments) return;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const pBody = createElemWithText("p", comment.body);
        const pEmail = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, pBody, pEmail);
        fragment.appendChild(article);
    });
    return fragment;
}

/*************** 9. populateSelectMenu ***************/
function populateSelectMenu(users) {
    if (!users) return;
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);
    options.forEach(option => selectMenu.appendChild(option));
    return selectMenu;
}

/*************** 10. getUsers ***************/
async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await response.json();
        return users;
    } catch (error) {
        console.error(error);
    }
}

/*************** 11. getUserPosts ***************/
async function getUserPosts(userId) {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error(error);
    }
}

/*************** 12. getUser ***************/
async function getUser(userId) {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const user = await response.json();
        return user;
    } catch (error) {
        console.error(error);
    }
}

/*************** 13. getPostComments ***************/
async function getPostComments(postId) {
    if (!postId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = await response.json();
        return comments;
    } catch (error) {
        console.error(error);
    }
}

/*************** 14. displayComments ***************/
async function displayComments(postId) {
    if (!postId) return;
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    return section;
}

/*************** 15. createPosts ***************/
async function createPosts(posts) {
    if (!posts) return;
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement("article");
        const h2 = createElemWithText("h2", post.title);
        const pBody = createElemWithText("p", post.body);
        const pId = createElemWithText("p", `Post ID: ${post.id}`);
        const authorData = await getUser(post.userId);
        const pAuthor = createElemWithText("p", `Author: ${authorData.name} with ${authorData.company.name}`);
        const pCatch = createElemWithText("p", authorData.company.catchPhrase);
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;
        const section = await displayComments(post.id);
        article.append(h2, pBody, pId, pAuthor, pCatch, button, section);
        fragment.appendChild(article);
    }
    return fragment;
}

/*************** 16. displayPosts ***************/
async function displayPosts(posts) {
    const main = document.querySelector("main");
    const element = posts && posts.length ? await createPosts(posts) : createElemWithText("p", "No posts available", "default-text");
    main.appendChild(element);
    return element;
}

/*************** 17. toggleComments ***************/
function toggleComments(event, postId) {
    if (!event || !postId) return;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

/*************** 18. refreshPosts ***************/
async function refreshPosts(posts) {
    if (!posts) return;
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
}

/*************** 19. selectMenuChangeEventHandler ***************/
async function selectMenuChangeEventHandler(event) {
    if (!event) return;
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = selectMenu.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}

/*************** 20. initPage ***************/
async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

/*************** 21. initApp ***************/
function initApp() {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

/*************** START APP ON DOM CONTENT LOADED ***************/
document.addEventListener("DOMContentLoaded", initApp);

