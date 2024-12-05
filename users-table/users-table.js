import { User } from '../User.js';
import { showTab } from '../AppUtil.js';

const users = Array.from({ length: 40 }, (_, i) => new User(i + 1));

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
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', handleSearch);
    addListeners();

    renderTable(users); // Изначальный рендер
}
