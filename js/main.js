// 1. createElemWithText
function createElemWithText(elementName = "p", textContent = "", className = "") {
    const element = document.createElement(elementName);
    element.textContent = textContent;
    if (className) element.classList.add(className);
    return element;
}

// 2. createSelectOptions
function createSelectOptions(users = []) {
    if (!users) return undefined;
    return users.map(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

// 3. toggleCommentSection
function toggleCommentSection(postId = 0) {
    if (!postId) return null;
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (!section) return null;
    section.classList.toggle("hide");
    return section;
}

// 4. toggleCommentButton
function toggleCommentButton(postId = 0) {
    if (!postId) return null;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (!button) return null;
    button.textContent =
        button.textContent === "Show Comments"
            ? "Hide Comments"
            : "Show Comments";
    return button;
}

// 5. deleteChildElements
function deleteChildElements(parentElement = null) {
    if (!(parentElement instanceof Element)) return undefined;
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
    if (!buttons) return null;

    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener("click", e => {
                toggleComments(e, postId);
            });
        }
    });

    return buttons;
}

// 7. removeButtonListeners
function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (!buttons) return null;

    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener("click", toggleComments);
        }
    });

    return buttons;
}

// 8. createComments
function createComments(comments = []) {
    if (!comments) return undefined;

    const fragment = document.createDocumentFragment();

    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const p1 = createElemWithText("p", comment.body);
        const p2 = createElemWithText("p", `From: ${comment.email}`);

        article.append(h3, p1, p2);
        fragment.appendChild(article);
    });

    return fragment;
}

// 9. populateSelectMenu
function populateSelectMenu(users = []) {
    if (!users) return undefined;

    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);

    options.forEach(option => selectMenu.appendChild(option));

    return selectMenu;
}

// 10. getUsers
async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// 11. getUserPosts
async function getUserPosts(userId = 1) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// 12. getUser
async function getUser(userId = 1) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// 13. getPostComments
async function getPostComments(postId = 1) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
        );
        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// 14. displayComments
async function displayComments(postId = 0) {
    if (!postId) return null;

    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");

    const comments = await getPostComments(postId);
    const fragment = createComments(comments);

    section.appendChild(fragment);
    return section;
}

// 15. createPosts
async function createPosts(posts = []) {
    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const article = document.createElement("article");

        const h2 = createElemWithText("h2", post.title);
        const p1 = createElemWithText("p", post.body);
        const p2 = createElemWithText("p", `Post ID: ${post.id}`);

        const author = await getUser(post.userId);
        const p3 = createElemWithText(
            "p",
            `Author: ${author.name} with ${author.company.name}`
        );
        const p4 = createElemWithText("p", author.company.catchPhrase);

        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        const section = await displayComments(post.id);

        article.append(h2, p1, p2, p3, p4, button, section);
        fragment.appendChild(article);
    }

    return fragment;
}

// 16. displayPosts
async function displayPosts(posts = []) {
    const main = document.querySelector("main");

    const element = posts
        ? await createPosts(posts)
        : createElemWithText(
              "p",
              "Select an Employee to display their posts.",
              "default-text"
          );

    main.appendChild(element);
    return element;
}

// 17. toggleComments
function toggleComments(event = null, postId = 0) {
    if (!event || !postId) return null;

    event.target.listener = true;

    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}

// 18. refreshPosts
async function refreshPosts(posts = []) {
    const removeButtons = removeButtonListeners();

    const main = document.querySelector("main");
    const deleted = deleteChildElements(main);

    const fragment = await displayPosts(posts);

    const addButtons = addButtonListeners();

    return [removeButtons, deleted, fragment, addButtons];
}

// 19. selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
    const select = document.getElementById("selectMenu");
    select.disabled = true;

    const userId = event.target.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);

    select.disabled = false;

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

initApp();


// EXPORTS (for tests)
export {
    createElemWithText,
    createSelectOptions,
    toggleCommentSection,
    toggleCommentButton,
    deleteChildElements,
    addButtonListeners,
    removeButtonListeners,
    createComments,
    populateSelectMenu,
    getUsers,
    getUserPosts,
    getUser,
    getPostComments,
    displayComments,
    createPosts,
    displayPosts,
    toggleComments,
    refreshPosts,
    selectMenuChangeEventHandler,
    initPage,
    initApp
};
