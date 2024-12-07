import { showTab } from '../LoadContent.js';
import { loadUser } from '../users-view/users-view.js';
import { apiInstance as api } from '../service/BackendApi.js';
import { restClient } from '../web/RestClient.js';

let users = [];

function renderTable(filteredUsers) {
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = ''; // Очистка перед рендерингом

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.mail}</td>
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

export let isUserProfileOpen = false;
export function setProfileOpen(booleanValue) {
    isUserProfileOpen = booleanValue;
}

function addListeners() {
    const table = document.getElementById('user-table').addEventListener('click', (event) => {

        const clickedElement = event.target;

        if (!clickedElement.tagName === 'TD') {
            return;
        }
        const cells = clickedElement.parentElement.getElementsByTagName('td');  
        const email = cells[1].textContent.trim();  
        const currentUser = users.find(user => user.mail === email)
        
        setProfileOpen(true);
        loadUser(currentUser)
        showTab('users-view')
    })
}

export async function init() {
    users = await api.userService.getUsers();
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', handleSearch);
    addListeners();

    renderTable(users);
}
function findUserRowByMail(mail) {
    const tbody = document.getElementById('user-table-body');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const emailCell = rows[i].getElementsByTagName('td')[1]; // Столбец Email
        if (emailCell && emailCell.textContent.trim() === mail) {
            return rows[i]; // Возвращаем найденную строку
        }
    }

    return null; // Если пользователь не найден
}

export function updateUserRowByMail(mail, user) {
    const row = findUserRowByMail(mail);
    console.log(mail);
    if (row) {
        const cells = row.getElementsByTagName('td');
        if (cells.length > 1) {
            cells[0].textContent = user.name; 
            cells[1].textContent = user.mail; 
        }
    } else {
        console.log('Пользователь с таким Email не найден.');
    }
}

export function open() {

}

