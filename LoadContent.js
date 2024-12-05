import { showTab } from "./AppUtil.js";

const filesName = [
    "users-table",
    "empty",
    "users-view"
]
const START_PAGE = 'users-table';
const scriptSuffix = '.js';

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
}

function initStartPage(startPage) {
    showTab(startPage);
    document.getElementById('sideBarUserButton').addEventListener('click', () => showTab('users-table'))
    document.getElementById('sideBarEmptyButton').addEventListener('click', () => showTab('empty'))
}

async function init() {
    await loadTabContent();
    initStartPage(START_PAGE);

    const initFunctions = await Promise.all(filesName.map(async (fileName) => {
        const scriptPath = `./${fileName}/${fileName}${scriptSuffix}`;
        try {
            const module = await import(scriptPath);
            return module['init']; // Возвращаем функцию, экспортированную из модуля
        } catch (error) {
            return null; // Если модуль не загружен, возвращаем null
        }
    }));

    initFunctions.forEach(initFunction => {
        if (typeof initFunction === 'function') {
            initFunction();
        }
    });
}

init();