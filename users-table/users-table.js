import { showTab } from '../LoadContent.js';
import { loadUser } from '../users-view/users-view.js';
import { apiInstance as api } from '../service/BackendApi.js';
import { restClient } from '../web/RestClient.js';

let users = [];

function renderTable(filteredUsers) {
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = ''; 

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.mail}</td>
        `;
        tbody.appendChild(row);
    });
}


function handleFilters() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const showOnlyBanned = document.getElementById('filter-banned').checked; 
    const selectedRole = document.getElementById('filter-role').value; 

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (searchTerm.includes('@') && user.mail.toLowerCase().includes(searchTerm)) ||
            user.name.toLowerCase().includes(searchTerm);

        const matchesBanned = !showOnlyBanned || user.banned; 
        const matchesRole = !selectedRole || user.roles[0] === selectedRole; 

        return matchesSearch && matchesBanned && matchesRole;
    });

    renderTable(filteredUsers);
}

// Добавлено: Функция привязки событий фильтров
function addFilterListeners() {
    const searchInput = document.getElementById('search');
    const bannedCheckbox = document.getElementById('filter-banned');
    const roleSelect = document.getElementById('filter-role');

    searchInput.addEventListener('input', handleFilters);
    bannedCheckbox.addEventListener('change', handleFilters);
    roleSelect.addEventListener('change', handleFilters);
}

export let isUserProfileOpen = false;
export function setProfileOpen(booleanValue) {
    isUserProfileOpen = booleanValue;
}

function addListeners() {
    const table = document.getElementById('user-table').addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement.tagName !== 'TD') {
            return;
        }
        const cells = clickedElement.parentElement.getElementsByTagName('td');  
        const email = cells[1].textContent.trim();  
        const currentUser = users.find(user => user.mail === email);
        
        setProfileOpen(true);
        loadUser(currentUser);
        showTab('users-view');
    });
}

export async function init() {
    users = await api.userService.getUsers();
    addFilterListeners(); 
    addListeners();
    renderTable(users);
}

function findUserRowByMail(mail) {
    const tbody = document.getElementById('user-table-body');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const emailCell = rows[i].getElementsByTagName('td')[1]; 
        if (emailCell && emailCell.textContent.trim() === mail) {
            return rows[i]; 
        }
    }

    return null;
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

export function open() {}
