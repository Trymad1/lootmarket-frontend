import { securityService } from "./service/SecurityService.js";

const filesName = [
    "users-table",
    "users-view",
    "edit-user",
    "user-services",
    "user-ads-details",
    "site-stat"
]
const START_PAGE = 'site-stat';
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

export async function loadTabContent() {
    sideBarButtonPermission();
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
            openFuncMap.set(fileName, module['open']);
            return module['init']; 
        } catch (error) {
            console.log(error);
            return null; 
        }
    }));

    await Promise.all(initFunctions.map(async (initFunction) => {
        if (typeof initFunction === 'function') {
            await initFunction();
        }
    }));
    
    const content = document.getElementById("content");
    if(securityService.permission.role() == "ROLE_USER") {
        setProfileOpen(true);
        loadUser(securityService.getCurrentUser());
        showTab('users-view');
    } else if(securityService.permission.role() == "ROLE_MODERATOR") {
        showTab('user-services');
    } else {
        showTab(START_PAGE);
    }

    content.style.display = "flex";
}

import { isUserProfileOpen, setProfileOpen } from "./users-table/users-table.js";
import { loadUser } from "./users-view/users-view.js";

export async function clear() {
    const content = document.getElementById("content");
    const sidePannel = document.getElementById("sidebar");
    sidePannel.style.display = "none";
    content.style.display = "none";
    
    while (content.firstChild) {
        content.removeChild(content.firstChild); // Удаляем первый дочерний элемент
    }

}
async function init() {
    document.getElementById('sideBarUserButton').addEventListener('click', () => {
        showTab('users-table')
    })
    document.getElementById('sideBarAdsButton').addEventListener('click', () => showTab('user-services'))
    document.getElementById('sideBarLogoutButton').addEventListener('click', () => {
        securityService.logout();
    })
    document.getElementById("sideBarStatsButton").addEventListener('click', () => {
        showTab('site-stat');
    })
}

function sideBarButtonPermission() {
    const usersButton = document.getElementById('sideBarUserButton');
    const servicesButton = document.getElementById('sideBarAdsButton');
    const statsButton = document.getElementById("sideBarStatsButton");
    [ usersButton, servicesButton, statsButton ].forEach(element => element.style.display = "block");
    const userRole = securityService.permission.role();
    if(userRole == "ROLE_MODERATOR") statsButton.style.display = "none";
    if(userRole != "ROLE_USER") return;
    [ usersButton, servicesButton, statsButton ].forEach(element => element.style.display = "none")
}

init();
