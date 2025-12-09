/* main.js */

// Create an element with text content and optional class
function createElemWithText(tag = 'p', text = '', className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
}

// Delete all child elements of a given element
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return undefined;
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
    return parentElement;
}

// Toggle comment section visibility
function toggleCommentSection(postId) {
    if (!postId) return undefined;
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (!section) return null;
    section.classList.toggle('hide');
    return section;
}

// Toggle comment button text
function toggleCommentButton(postId) {
    if (!postId) return undefined;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (!button) return null;
    button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    return button;
}

// Toggle comments: show/hide section and button
function toggleComments(event, postId) {
    if (!event || !postId) return undefined;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

// Create an array of option elements for a select menu
function createSelectOptions(users = []) {
    if (!users) return undefined;
    return users.map(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

// Populate the select menu with users
function populateSelectMenu(users) {
    if (!users) return undefined;
    const selectMenu = document.getElementById('selectMenu');
    const options = createSelectOptions(users);
    options.forEach(option => selectMenu.appendChild(option));
    return selectMenu;
}

// Fetch JSON users
async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    return users;
}

// Fetch posts by userId
async function getUserPosts(userId) {
    if (!userId) return undefined;
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = await response.json();
    return posts;
}

// Fetch specific user by ID
async function getUser(userId) {
    if (!userId) return undefined;
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const user = await response.json();
    return user;
}

// Fetch comments for a post
async function getPostComments(postId) {
    if (!postId) return undefined;
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const comments = await response.json();
    return comments;
}

// Create comment elements
function createComments(comments = []) {
    if (!comments) return undefined;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement('article');
        article.appendChild(createElemWithText('h3', comment.name));
        article.appendChild(createElemWithText('p', comment.body));
        article.appendChild(createElemWithText('p', `From: ${comment.email}`));
        fragment.appendChild(article);
    });
    return fragment;
}

// Display comments section
async function displayComments(postId) {
    if (!postId) return undefined;
    const section = document.createElement('section');
    section.className = 'comments hide';
    section.dataset.postId = postId;
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    return section;
}

// Create posts elements
async function createPosts(posts = []) {
    if (!posts) return undefined;
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement('article');
        const user = await getUser(post.userId);

        article.appendChild(createElemWithText('h2', post.title));
        article.appendChild(createElemWithText('p', post.body));
        article.appendChild(createElemWithText('p', `Author: ${user.name}`));
        article.appendChild(createElemWithText('p', `Email: ${user.email}`));

        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;
        article.appendChild(button);

        const commentSection = await displayComments(post.id);
        article.appendChild(commentSection);

        fragment.appendChild(article);
    }
    return fragment;
}

// Display posts in main element
async function displayPosts(posts) {
    const main = document.querySelector('main');
    deleteChildElements(main);
    if (!posts || posts.length === 0) {
        const p = createElemWithText('p', 'No posts available', 'default-text');
        main.appendChild(p);
        return p;
    }
    const fragment = await createPosts(posts);
    main.appendChild(fragment);
    return fragment;
}

// Event handler for select menu change
async function selectMenuChangeEventHandler(event) {
    if (!event) return undefined;
    const userId = event.target.value;
    const posts = await getUserPosts(userId);
    const refreshed = await displayPosts(posts);
    return [userId, posts, refreshed];
}

// Initialize the page
async function initPage() {
    const users = await getUsers();
    populateSelectMenu(users);
    return [users, document.getElementById('selectMenu')];
}

// Add event listeners
function addButtonListeners() {
    const main = document.querySelector('main');
    const buttons = main.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.dataset.postId) return;
        button.addEventListener('click', (e) => toggleComments(e, button.dataset.postId));
    });
    return buttons;
}

// Remove event listeners
function removeButtonListeners() {
    const main = document.querySelector('main');
    const buttons = main.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.dataset.postId) return;
        button.removeEventListener('click', (e) => toggleComments(e, button.dataset.postId));
    });
    return buttons;
}

// Refresh posts
async function refreshPosts(posts) {
    if (!posts) return undefined;
    const refreshed = await displayPosts(posts);
    addButtonListeners();
    return [refreshed];
}

// Initialize app
async function initApp() {
    const [users] = await initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);
