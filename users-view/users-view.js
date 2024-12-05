import { apiInstance as api } from '../service/BackendApi.js';

function populateUserDetails(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-createdAt').textContent = user.createdAt;
    document.getElementById('user-updatedAt').textContent = user.updatedAt;
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString(); // Локальное форматирование даты и времени
}

// Функция для рендеринга платежных систем
function renderPaymentSystems(paymentSystems) {
    const container = document.getElementById('payment-systems-container');
    container.innerHTML = ''; // Очистка перед рендерингом

    paymentSystems.forEach(system => {
        const div = document.createElement('div');
        div.className = 'payment-system';
        div.innerHTML = `
            <span class="payment-system-icon"></span>
            <span class="payment-system-label">${system}</span>
        `;
        container.appendChild(div);
    });
}

export function loadUser(id) {
    const user = api.getUserById(id);

    document.getElementById('user-id').textContent = user.id;
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-created-at').textContent = formatDateTime(user.createdAt);
    document.getElementById('user-updated-at').textContent = formatDateTime(user.updatedAt);

    // Обновление статистики
    document.getElementById('user-services-count').textContent = user.servicesCount;
    document.getElementById('user-deals-author').textContent = user.dealsAsAuthor;
    document.getElementById('user-deals-buyer').textContent = user.dealsAsBuyer;

    // Построение графика онлайн-активности
    const ctx = document.getElementById('online-stats-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: user.onlineStat.map(date => new Date(date).toLocaleDateString()), // Метки по датам
            datasets: [{
                label: 'Online Activity',
                data: user.onlineStat.map(date => new Date(date).getHours()), // Часы активности
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Hour'
                    }
                }
            }
        }
    });

    // Обновление платежных систем
    renderPaymentSystems(user.paymentSystems);
}

// Установка слушателей событий
export function init() {
    
}

export function open() {
    console.log('user-view open');
}
