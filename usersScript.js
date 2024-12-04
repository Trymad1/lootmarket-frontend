// Массив с пользователями
const users = [];
const userCount = 40;

// Создаем пользователей с фиктивными данными
for (let i = 1; i <= userCount; i++) {
    users.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });
}

// Функция для отображения пользователей в таблице
function displayUsers(usersToDisplay) {
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением новых строк

    usersToDisplay.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Функция для фильтрации пользователей
function filterUsers() {
    const searchQuery = document.getElementById('search').value.trim().toLowerCase();

    let filteredUsers = users;

    // Фильтрация по имени или email
    if (searchQuery.includes('@')) {
        // Если введен символ '@', фильтруем по email
        filteredUsers = users.filter(user =>
            user.email.toLowerCase().includes(searchQuery)
        );
    } else {
        // Фильтруем по имени
        filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchQuery)
        );
    }

    // Отображаем отфильтрованных пользователей
    displayUsers(filteredUsers);
}

// Инициализация таблицы с пользователями
export function init() {
    // Отображаем всех пользователей при загрузке страницы
    displayUsers(users);
}
