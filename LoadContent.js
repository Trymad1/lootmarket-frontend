const filesName = [
    "users-table",
    "empty",
    "users-view",
    "edit-user"
]
const START_PAGE = 'users-table';
const scriptSuffix = '.js';
const openFuncMap = new Map();

let currentTab = null;

export function showTab(fileName) {
    const fileId = `${fileName}-content`
    if(currentTab) {
        document.getElementById(currentTab).style.display = 'none';
    }

    openFuncMap.get(fileName)();
    document.getElementById(fileId).style.display = 'block';
    currentTab = fileId;
}

async function loadTabContent() {
    const fetchPromises = filesName.map(htmlFile => 
        fetch(`${htmlFile}/${htmlFile}.html`)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML += html;
                document.getElementById(`${htmlFile}-content`).style.display = 'none';
            })
            .catch(error => console.error(`Ошибка загрузки ${htmlFile}.html:`, error))
    );

    await Promise.all(fetchPromises);

    const initFunctions = await Promise.all(filesName.map(async (fileName) => {
        const scriptPath = `./${fileName}/${fileName}${scriptSuffix}`;
        try {
            const module = await import(scriptPath);
            openFuncMap.set(fileName, module['open'])
            return module['init']; 
        } catch (error) {
            console.log(error);
            return null; 
        }
    }));

    initFunctions.forEach(initFunction => {
        if (typeof initFunction === 'function') {
            initFunction();
        }
    });
}

import { isUserProfileOpen } from "./users-table/users-table.js";
function initStartPage(startPage) {
    showTab(startPage);
    document.getElementById('sideBarUserButton').addEventListener('click', () => {
        if(isUserProfileOpen) {
            showTab('users-view')
        } else {
            showTab('users-table')
        }
    })
    document.getElementById('sideBarEmptyButton').addEventListener('click', () => showTab('empty'))
}

async function init() {
    await loadTabContent();
    initStartPage(START_PAGE);
}

init();