import { init as userPageInit } from "./usersScript.js";

let currentTab = null;
const filesName = [
    "users",
    "empty" 
]
const START_PAGE = 'users';

async function loadTabContent() {
    const fetchPromises = filesName.map(htmlFile => 
        fetch(`${htmlFile}.html`)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML += html;
                document.getElementById(`${htmlFile}-content`).style.display = 'none';
            })
            .catch(error => console.error(`Ошибка загрузки ${htmlFile}.html:`, error))
    );

    await Promise.all(fetchPromises);
}

export function showTab(tabId) {
    document.getElementById(currentTab).style.display = 'none';
    document.getElementById(tabId).style.display = 'block';
    currentTab = tabId;
}

function initStartPage(startPage) {
    const pageId = `${startPage}-content`
    document.getElementById(pageId).style.display = 'block';
    currentTab = pageId;
    showTab(pageId);
    document.getElementById('sideBarUserButton').addEventListener('click', () => showTab('users-content'))
    document.getElementById('sideBarEmptyButton').addEventListener('click', () => showTab('empty-content'))
}

async function init() {
    await loadTabContent();

    initStartPage(START_PAGE);
    userPageInit();
}

init();