let currentTab = null;
const filesId = [
    
]
const startPage = '';

async function loadTabContent() {
    const fetchPromises = filesId.map(htmlFile => 
        fetch(`${htmlFile}.html`)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML += html;
                document.getElementById(htmlFile).style.display = 'none';
            })
            .catch(error => console.error(`Ошибка загрузки ${htmlFile}.html:`, error))
    );

    await Promise.all(fetchPromises);
}

function showTab(tabId) {
    if (currentTab && document.getElementById(currentTab)) {
        document.getElementById(currentTab).style.display = 'none';
        document.getElementById(tabId).style.display = 'block';
    }

    currentTab = tabId;
}

function initStartPage(startPageId) {
    document.getElementById(startPageId).style.display = 'block';
    currentTab = 'tab1-content';
    showTab('tab1-content');
}

async function init() {
    await loadTabContent();
    initStartPage(startPage);
}

init();