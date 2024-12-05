let currentTab = null;

export function showTab(tabId) {
    tabId = `${tabId}-content`
    if(currentTab) {
        document.getElementById(currentTab).style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
    currentTab = tabId;
}