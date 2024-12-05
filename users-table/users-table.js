import { showTab } from '../LoadContent.js';
import { loadUser } from '../users-view/users-view.js';
import { apiInstance as api } from '../service/BackendApi.js';

let users = [];

function renderTable(filteredUsers) {
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = ''; // Очистка перед рендерингом

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
        `;
        tbody.appendChild(row);
    });
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredUsers = users.filter(user => {
        if (searchTerm.includes('@')) {
            return user.email.toLowerCase().includes(searchTerm);
        }
        return user.name.toLowerCase().includes(searchTerm);
    });

    renderTable(filteredUsers);
}

function addListeners() {
    const table = document.getElementById('user-table').addEventListener('click', (event) => {

        const clickedElement = event.target;

        if (!clickedElement.tagName === 'TD') {
            return;
        }
        const row = clickedElement.parentElement;  
        const cellData = clickedElement.textContent;  
        showTab('users-view')
    })
}

export function init() {
    users = api.getAll();
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', handleSearch);
    addListeners();

    renderTable(users); // Изначальный рендер
}

export function open() {
    console.log('user-table open')
}
